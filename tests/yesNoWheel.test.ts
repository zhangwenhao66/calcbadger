import { describe, it, expect } from 'vitest';
import {
	normalizeWeights,
	spinWheel,
	simulateSpins,
	summarizeSpins,
	expectedSpinsUntilFirst,
	streakProbability,
	segmentAngles,
	rotationForLanding,
} from '../src/lib/yesNoWheel';

// Expected values hand-derived (equal weights -> 1/n; 70/30 -> 0.7/0.3; p^k for
// streaks; 1/p for geometric mean), not read back from the implementation.

describe('normalizeWeights', () => {
	it('two equal weights normalize to 0.5 each', () => {
		expect(normalizeWeights([1, 1])).toEqual([0.5, 0.5]);
	});

	it('70/30 weights normalize to 0.7/0.3', () => {
		const [a, b] = normalizeWeights([70, 30]);
		expect(a).toBeCloseTo(0.7, 10);
		expect(b).toBeCloseTo(0.3, 10);
	});

	it('three equal weights normalize to 1/3 each', () => {
		const probs = normalizeWeights([1, 1, 1]);
		probs.forEach((p) => expect(p).toBeCloseTo(1 / 3, 10));
	});

	it('a zero or negative weight is treated as zero, not negative probability', () => {
		const probs = normalizeWeights([1, -5, 0]);
		expect(probs[1]).toBe(0);
		expect(probs[2]).toBe(0);
		expect(probs[0]).toBeCloseTo(1, 10);
	});

	it('all-zero weights return all zeros instead of dividing by zero', () => {
		expect(normalizeWeights([0, 0])).toEqual([0, 0]);
	});

	it('a NaN weight is treated as zero', () => {
		const probs = normalizeWeights([NaN, 1]);
		expect(probs[0]).toBe(0);
		expect(probs[1]).toBeCloseTo(1, 10);
	});
});

describe('spinWheel', () => {
	it('a fair two-segment wheel: rng just under 0.5 picks segment 0, just at/over picks segment 1', () => {
		expect(spinWheel([1, 1], () => 0.49)).toBe(0);
		expect(spinWheel([1, 1], () => 0.5)).toBe(1);
		expect(spinWheel([1, 1], () => 0.99)).toBe(1);
	});

	it('a 70/30 wheel: rng just under 0.7 picks segment 0, just over picks segment 1', () => {
		expect(spinWheel([70, 30], () => 0.69)).toBe(0);
		expect(spinWheel([70, 30], () => 0.71)).toBe(1);
	});

	it('a three-segment equal wheel picks the correct third by cumulative range', () => {
		expect(spinWheel([1, 1, 1], () => 0.1)).toBe(0);
		expect(spinWheel([1, 1, 1], () => 0.4)).toBe(1);
		expect(spinWheel([1, 1, 1], () => 0.99)).toBe(2);
	});

	it('rng exactly at 0 always lands the first segment', () => {
		expect(spinWheel([1, 1], () => 0)).toBe(0);
	});
});

describe('simulateSpins', () => {
	it('produces exactly n results', () => {
		expect(simulateSpins(25, [1, 1], () => 0.4)).toHaveLength(25);
	});

	it('an rng that always returns 0 always lands segment 0', () => {
		const results = simulateSpins(10, [1, 1], () => 0);
		expect(results.every((r) => r === 0)).toBe(true);
	});

	it('an rng that always returns 0.99 always lands the last segment', () => {
		const results = simulateSpins(10, [1, 1], () => 0.99);
		expect(results.every((r) => r === 1)).toBe(true);
	});
});

describe('summarizeSpins', () => {
	it('counts occurrences and the longest streak of each segment, by hand: 0 0 1 0 0 0 1', () => {
		const results = [0, 0, 1, 0, 0, 0, 1];
		const summary = summarizeSpins(results, 2);
		expect(summary.counts).toEqual([5, 2]);
		expect(summary.pct[0]).toBeCloseTo((5 / 7) * 100, 10);
		expect(summary.pct[1]).toBeCloseTo((2 / 7) * 100, 10);
		expect(summary.longestStreaks).toEqual([3, 1]);
	});

	it('handles an empty sequence without dividing by zero', () => {
		const summary = summarizeSpins([], 2);
		expect(summary.counts).toEqual([0, 0]);
		expect(summary.pct).toEqual([0, 0]);
		expect(summary.longestStreaks).toEqual([0, 0]);
	});

	it('an all-same-segment sequence gives that segment the full streak and zero elsewhere', () => {
		const summary = summarizeSpins([0, 0, 0, 0], 2);
		expect(summary.counts).toEqual([4, 0]);
		expect(summary.longestStreaks).toEqual([4, 0]);
	});

	it('handles three segments correctly: 0 1 2 1 1', () => {
		const summary = summarizeSpins([0, 1, 2, 1, 1], 3);
		expect(summary.counts).toEqual([1, 3, 1]);
		expect(summary.longestStreaks).toEqual([1, 2, 1]);
	});
});

describe('expectedSpinsUntilFirst', () => {
	it('a fair 50/50 wheel: expect a given side once every 2 spins on average', () => {
		expect(expectedSpinsUntilFirst(0.5)).toBe(2);
	});

	it('a 25% chance segment: expect it once every 4 spins on average (1/0.25)', () => {
		expect(expectedSpinsUntilFirst(0.25)).toBe(4);
	});

	it('a segment with zero probability never appears: expected wait is infinite', () => {
		expect(expectedSpinsUntilFirst(0)).toBe(Infinity);
	});

	it('a segment that always wins (p=1) appears on the very first spin', () => {
		expect(expectedSpinsUntilFirst(1)).toBe(1);
	});
});

describe('streakProbability', () => {
	it('a fair coin-equivalent wheel landing the same side 4 times in a row: 0.5^4 = 0.0625', () => {
		expect(streakProbability(0.5, 4)).toBeCloseTo(0.0625, 10);
	});

	it('a 70% segment landing 3 times in a row: 0.7^3 = 0.343', () => {
		expect(streakProbability(0.7, 3)).toBeCloseTo(0.343, 10);
	});

	it('a streak of 0 is certain (empty product)', () => {
		expect(streakProbability(0.5, 0)).toBe(1);
	});

	it('a streak of 1 is just the per-spin probability itself', () => {
		expect(streakProbability(0.3, 1)).toBeCloseTo(0.3, 10);
	});

	it('a negative streak length is impossible', () => {
		expect(streakProbability(0.5, -1)).toBe(0);
	});
});

describe('segmentAngles', () => {
	it('two equal segments split the circle at 0-180 and 180-360, midpoints 90/270', () => {
		const [a, b] = segmentAngles([1, 1]);
		expect(a).toEqual({ start: 0, end: 180, mid: 90 });
		expect(b).toEqual({ start: 180, end: 360, mid: 270 });
	});

	it('a 70/30 split: first segment 0-252 (mid 126), second 252-360 (mid 306)', () => {
		const [a, b] = segmentAngles([70, 30]);
		expect(a.start).toBeCloseTo(0, 10);
		expect(a.end).toBeCloseTo(252, 10);
		expect(a.mid).toBeCloseTo(126, 10);
		expect(b.start).toBeCloseTo(252, 10);
		expect(b.end).toBeCloseTo(360, 10);
		expect(b.mid).toBeCloseTo(306, 10);
	});

	it('three equal segments are 120 degrees each, midpoints 60/180/300', () => {
		const segs = segmentAngles([1, 1, 1]);
		expect(segs.map((s) => Math.round(s.mid))).toEqual([60, 180, 300]);
	});
});

describe('rotationForLanding', () => {
	it('from rotation 0, landing a segment at mid=90 needs rotation mod 360 = 270', () => {
		const r = rotationForLanding(0, 90, 4);
		expect(r).toBe(4 * 360 + 270);
		expect(((r % 360) + 360) % 360).toBeCloseTo(270, 10);
	});

	it('from rotation 0, landing a segment at mid=270 needs rotation mod 360 = 90', () => {
		const r = rotationForLanding(0, 270, 4);
		expect(((r % 360) + 360) % 360).toBeCloseTo(90, 10);
	});

	it('landing mid=0 (segment starts at the pointer) needs zero extra rotation beyond full spins', () => {
		const r = rotationForLanding(0, 0, 5);
		expect(r).toBe(5 * 360);
	});

	it('always spins forward: result is never less than currentRotation', () => {
		const r = rotationForLanding(1000, 45, 3);
		expect(r).toBeGreaterThanOrEqual(1000);
	});

	it('carries over an existing non-zero rotation correctly (currentRotation=1710, same target as a prior spin)', () => {
		// After landing on mid=90 once (rotation 1710, mod 270), spinning again to
		// the same segment should add exactly extraSpins full turns (delta = 0).
		const r = rotationForLanding(1710, 90, 4);
		expect(r).toBe(1710 + 4 * 360);
	});
});
