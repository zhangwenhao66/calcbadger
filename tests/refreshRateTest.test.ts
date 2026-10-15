import { describe, expect, it } from 'vitest';
import {
	MAX_PLAUSIBLE_HZ,
	MIN_PLAUSIBLE_HZ,
	MIN_SAMPLES,
	STANDARD_RATES,
	commonIntervals,
	filterOutlierIntervals,
	formatHz,
	intervalForRate,
	intervalsFrom,
	median,
	nearestStandardRate,
	percentile,
	summarize,
	verdict,
} from '../src/lib/refreshRateTest';

// Every expected value below is worked out by hand from the definition of the
// statistic, not copied from a previous run of the code.

describe('median', () => {
	it('returns the middle value of an odd count', () => {
		expect(median([3, 1, 2])).toBe(2);
		expect(median([5])).toBe(5);
	});

	it('averages the two middle values of an even count', () => {
		expect(median([1, 3])).toBe(2);
		expect(median([1, 2, 3, 4])).toBe(2.5);
	});

	it('ignores entries that are not finite and positive', () => {
		expect(median([1, NaN, 3])).toBe(2);
		expect(median([1, Infinity, 3])).toBe(2);
		expect(median([0, 0])).toBeNaN();
		expect(median([])).toBeNaN();
	});
});

describe('percentile', () => {
	const values = [1, 2, 3, 4, 5];

	it('returns the endpoints at 0 and 1', () => {
		expect(percentile(values, 0)).toBe(1);
		expect(percentile(values, 1)).toBe(5);
	});

	it('interpolates between the closest ranks', () => {
		// rank = 0.5 * (5 - 1) = 2, landing exactly on the third value.
		expect(percentile(values, 0.5)).toBe(3);
		// rank = 0.95 * 4 = 3.8, so 4 + 0.8 * (5 - 4) = 4.8.
		expect(percentile(values, 0.95)).toBeCloseTo(4.8, 10);
		// rank = 0.5 * 3 = 1.5, so 2 + 0.5 * (3 - 2) = 2.5.
		expect(percentile([1, 2, 3, 4], 0.5)).toBe(2.5);
	});

	it('clamps out-of-range fractions and handles an empty sample', () => {
		expect(percentile(values, 2)).toBe(5);
		expect(percentile(values, -1)).toBe(1);
		expect(percentile([], 0.5)).toBeNaN();
	});

	it('falls back to the smallest value when the fraction is not a number', () => {
		expect(percentile(values, NaN)).toBe(1);
	});
});

describe('intervalsFrom', () => {
	it('returns the gaps between consecutive timestamps', () => {
		expect(intervalsFrom([0, 16, 33, 50])).toEqual([16, 17, 17]);
	});

	it('discards zero and non-finite gaps', () => {
		expect(intervalsFrom([0, 0, 16])).toEqual([16]);
		// Both gaps touching the NaN are unusable, so only the last one survives.
		expect(intervalsFrom([0, NaN, 16, 32])).toEqual([16]);
	});

	it('returns nothing for a sample of fewer than two timestamps', () => {
		expect(intervalsFrom([5])).toEqual([]);
		expect(intervalsFrom([])).toEqual([]);
	});
});

describe('filterOutlierIntervals', () => {
	it('drops only the slow tail past the factor of the median', () => {
		// median of [16, 16, 16, 17, 100] is 16; 2.5 x 16 = 40, so 100 goes.
		expect(filterOutlierIntervals([16, 17, 16, 100, 16], 2.5)).toEqual({
			kept: [16, 17, 16, 16],
			droppedCount: 1,
		});
	});

	it('keeps every value when nothing exceeds the ceiling', () => {
		expect(filterOutlierIntervals([16, 16, 16], 2.5)).toEqual({ kept: [16, 16, 16], droppedCount: 0 });
	});

	it('handles an empty sample without inventing a centre', () => {
		expect(filterOutlierIntervals([], 2.5)).toEqual({ kept: [], droppedCount: 0 });
	});
});

describe('summarize', () => {
	it('reports 60Hz for a steady 16.6667 ms period', () => {
		const summary = summarize(Array.from({ length: 40 }, () => 16.6667));
		expect(summary).not.toBeNull();
		expect(summary!.sampleCount).toBe(40);
		expect(summary!.droppedCount).toBe(0);
		expect(summary!.medianMs).toBeCloseTo(16.6667, 4);
		expect(summary!.hz).toBeCloseTo(60, 2);
		expect(summary!.jitterRatio).toBeCloseTo(1, 10);
		expect(summary!.steady).toBe(true);
		// 40 frames of 16.6667 ms cover 666.668 ms.
		expect(summary!.spanMs).toBeCloseTo(666.668, 3);
	});

	it('reports 144Hz for a steady 6.9444 ms period', () => {
		const summary = summarize(Array.from({ length: 60 }, () => 6.9444));
		expect(summary!.hz).toBeCloseTo(144, 1);
	});

	it('refuses a sample below the minimum size', () => {
		expect(summarize(Array.from({ length: MIN_SAMPLES - 1 }, () => 16.6667))).toBeNull();
	});

	it('drops a stalled frame instead of letting it drag the rate down', () => {
		// 20 good frames plus one 100 ms stall: the stall is a slow frame, not a
		// 9Hz panel, so the median still lands on the good period.
		const sample = [100, ...Array.from({ length: 20 }, () => 16.6667)];
		const summary = summarize(sample);
		expect(summary!.droppedCount).toBe(1);
		expect(summary!.sampleCount).toBe(20);
		expect(summary!.hz).toBeCloseTo(60, 2);
	});

	it('flags an unsteady rate through the jitter ratio', () => {
		// 18 frames at 16.6 ms and 2 at 25 ms: median stays 16.6 (the 9th and 10th
		// values of the sorted sample), the 95th percentile is 25, so the ratio is
		// 25 / 16.6 = 1.506.
		const sample = [...Array.from({ length: 18 }, () => 16.6), 25, 25];
		const summary = summarize(sample);
		expect(summary!.medianMs).toBeCloseTo(16.6, 10);
		expect(summary!.p95Ms).toBe(25);
		expect(summary!.jitterRatio).toBeCloseTo(25 / 16.6, 6);
		expect(summary!.steady).toBe(false);
	});

	it('returns null when filtering leaves too little to work with', () => {
		// 20 values with one outlier at 10x: dropping it leaves 19, below the
		// minimum, so there is no reading. With 21 values the same outlier leaves
		// exactly the minimum and a reading is possible.
		expect(summarize([166.667, ...Array.from({ length: 19 }, () => 16.6667)])).toBeNull();
		expect(summarize([166.667, ...Array.from({ length: 20 }, () => 16.6667)])).not.toBeNull();
	});

	it('returns null when most frames stalled, rather than reporting a fake low rate', () => {
		// Half the frames took 1000 ms. The median of the whole sample is
		// (16.6667 + 1000) / 2 = 508 ms, so the 1000 ms frames sit under the
		// 2.5x ceiling and survive filtering. 1000 / 508 = 1.97 Hz is not a
		// display, so the guard rejects the sample instead of printing it.
		const stalled = [...Array.from({ length: 10 }, () => 16.6667), ...Array.from({ length: 10 }, () => 1000)];
		expect(summarize(stalled)).toBeNull();
	});

	it('returns null for a period shorter than any display can produce', () => {
		// 0.5 ms between frames would be 2000 Hz, past the top of the standard
		// list and past anything a panel does, so the sample is rejected.
		expect(summarize(Array.from({ length: 30 }, () => 0.5))).toBeNull();
	});
});

describe('nearestStandardRate', () => {
	it('picks the closest standard rate and reports the signed gap', () => {
		const match = nearestStandardRate(59.8)!;
		expect(match.rate).toBe(60);
		expect(match.deltaHz).toBeCloseTo(-0.2, 10);
		// -0.2 / 60 * 100 = -0.3333...
		expect(match.deltaPercent).toBeCloseTo(-0.3333, 3);
	});

	it('matches the high-refresh rates users actually look for', () => {
		expect(nearestStandardRate(143.1)!.rate).toBe(144);
		expect(nearestStandardRate(120.4)!.rate).toBe(120);
		expect(nearestStandardRate(165.2)!.rate).toBe(165);
	});

	it('clamps to the ends of the list', () => {
		expect(nearestStandardRate(1)!.rate).toBe(24);
		expect(nearestStandardRate(1000)!.rate).toBe(360);
	});

	it('accepts a custom rate list', () => {
		expect(nearestStandardRate(100, [60, 120])!.rate).toBe(120);
	});

	it('returns null for values that are not a positive finite number', () => {
		expect(nearestStandardRate(NaN)).toBeNull();
		expect(nearestStandardRate(0)).toBeNull();
		expect(nearestStandardRate(-60)).toBeNull();
	});

	it('returns null when handed no rates to choose from', () => {
		expect(nearestStandardRate(60, [])).toBeNull();
	});

	it('keeps the standard rate list sorted, unique and inside the plausible band', () => {
		// This list drives the "closest standard rate" label, so a duplicate or an
		// out-of-order entry would silently change which rate a reading matches.
		for (let i = 1; i < STANDARD_RATES.length; i += 1) {
			expect(STANDARD_RATES[i]).toBeGreaterThan(STANDARD_RATES[i - 1]);
		}
		for (const rate of STANDARD_RATES) {
			expect(rate).toBeGreaterThanOrEqual(MIN_PLAUSIBLE_HZ);
			expect(rate).toBeLessThanOrEqual(MAX_PLAUSIBLE_HZ);
		}
	});
});

describe('verdict', () => {
	it('counts a reading inside the tolerance as a match', () => {
		expect(verdict(59.9, nearestStandardRate(59.9))).toBe('match');
		expect(verdict(60, null)).toBe('match');
	});

	it('separates below and above', () => {
		// 58 against 60 is -3.33%, outside the 3% band.
		expect(verdict(58, nearestStandardRate(58))).toBe('below');
		// 62 against 60 is +3.33%.
		expect(verdict(62, nearestStandardRate(62))).toBe('above');
	});

	it('treats the tolerance boundary itself as a match', () => {
		const match = { rate: 100, deltaHz: -3, deltaPercent: -3 };
		expect(verdict(97, match, 3)).toBe('match');
		expect(verdict(97, match, 2.9)).toBe('below');
	});
});

describe('commonIntervals', () => {
	it('groups at a tenth of a millisecond and sorts by count', () => {
		expect(commonIntervals([16.7, 16.7, 16.7, 16.6, 16.6], 2)).toEqual([
			{ ms: 16.7, count: 3, share: 0.6 },
			{ ms: 16.6, count: 2, share: 0.4 },
		]);
	});

	it('rounds half a tenth up', () => {
		expect(commonIntervals([16.65], 1)[0].ms).toBe(16.7);
		expect(commonIntervals([16.64], 1)[0].ms).toBe(16.6);
	});

	it('breaks count ties toward the shorter interval', () => {
		const top = commonIntervals([16.6, 16.7], 2);
		expect(top.map((b) => b.ms)).toEqual([16.6, 16.7]);
	});

	it('returns nothing for an empty sample', () => {
		expect(commonIntervals([], 3)).toEqual([]);
		expect(commonIntervals([16.7, 16.7], 0)).toEqual([]);
	});
});

describe('formatHz and intervalForRate', () => {
	it('prints whole rates bare and the rest to one decimal', () => {
		expect(formatHz(60)).toBe('60');
		expect(formatHz(144)).toBe('144');
		expect(formatHz(59.94)).toBe('59.9');
		expect(formatHz(NaN)).toBe('—');
	});

	it('turns a rate into its frame period', () => {
		expect(intervalForRate(60)).toBeCloseTo(16.6667, 4);
		expect(intervalForRate(144)).toBeCloseTo(6.9444, 4);
		expect(intervalForRate(0)).toBeNaN();
	});
});
