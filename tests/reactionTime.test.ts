import { describe, expect, it } from 'vitest';
import { classifyReactionTime, mean, median, stdDev, summarizeTrials } from '../src/lib/reactionTime';

describe('mean', () => {
	it('averages a set of trial times', () => {
		expect(mean([200, 220, 240])).toBe(220);
	});

	it('returns 0 for an empty set', () => {
		expect(mean([])).toBe(0);
	});
});

describe('median', () => {
	it('returns the middle value for an odd count', () => {
		expect(median([300, 100, 200])).toBe(200);
	});

	it('averages the two middle values for an even count', () => {
		expect(median([100, 200, 300, 400])).toBe(250);
	});

	it('does not mutate the input array', () => {
		const values = [300, 100, 200];
		median(values);
		expect(values).toEqual([300, 100, 200]);
	});
});

describe('stdDev', () => {
	it('is 0 when every trial is identical', () => {
		expect(stdDev([200, 200, 200])).toBe(0);
	});

	it('matches a hand-calculated population standard deviation', () => {
		// mean 200, deviations +/-10, variance (100+100)/2 = 100, sqrt = 10
		expect(stdDev([190, 210])).toBe(10);
	});
});

describe('summarizeTrials', () => {
	it('summarizes a full run of trials', () => {
		// mean 250, sorted [230,240,250,260,270] -> median 250, best 230, worst 270
		// variance = (0^2 + 20^2 + 20^2 + 10^2 + 10^2) / 5 = 1000/5 = 200 -> stdDev sqrt(200)
		const summary = summarizeTrials([250, 230, 270, 260, 240]);
		expect(summary.mean).toBe(250);
		expect(summary.median).toBe(250);
		expect(summary.best).toBe(230);
		expect(summary.worst).toBe(270);
		expect(summary.stdDev).toBeCloseTo(Math.sqrt(200), 10);
	});

	it('returns all zeros for an empty run', () => {
		expect(summarizeTrials([])).toEqual({ mean: 0, median: 0, best: 0, worst: 0, stdDev: 0 });
	});
});

describe('classifyReactionTime', () => {
	it('flags times below the Kosinski (2008) 190ms floor as faster than typical', () => {
		expect(classifyReactionTime(180).label).toBe('Faster than the historic baseline');
	});

	it('treats the 190ms boundary as inside the modern computer-measured average band', () => {
		expect(classifyReactionTime(190).label).toBe('Faster than the modern computer-measured average');
	});

	it('labels 213ms and below (but >=190) as faster than the modern computer-measured average', () => {
		expect(classifyReactionTime(213).label).toBe('Faster than the modern computer-measured average');
	});

	it('labels 214-268ms as within the range of modern computer-based studies', () => {
		expect(classifyReactionTime(214).label).toBe('Within the range of modern computer-based studies');
		expect(classifyReactionTime(268).label).toBe('Within the range of modern computer-based studies');
	});

	it('labels times above 268ms as slower than the studies cited here', () => {
		expect(classifyReactionTime(269).label).toBe('Slower than the studies cited here');
	});

	it('returns N/A for negative or non-finite input', () => {
		expect(classifyReactionTime(-5).label).toBe('N/A');
		expect(classifyReactionTime(NaN).label).toBe('N/A');
	});
});
