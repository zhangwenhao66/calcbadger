import { describe, it, expect } from 'vitest';
import {
	binomialProbability,
	binomialAtLeast,
	binomialAtMost,
	binomialExpectedValue,
	binomialStdDev,
	summarizeFlips,
	simulateFlips,
} from '../src/lib/coinFlip';

// Expected values hand-derived from the NIST binomial PMF P(x;p,n) = C(n,x) p^x (1-p)^(n-x),
// not read back from the implementation.

describe('binomialProbability', () => {
	it('exactly 5 heads in 10 fair flips: C(10,5)/2^10 = 252/1024', () => {
		expect(binomialProbability(10, 5, 0.5)).toBeCloseTo(252 / 1024, 10);
	});

	it('exactly 1 head in 2 fair flips: C(2,1) * 0.5 * 0.5 = 0.5', () => {
		expect(binomialProbability(2, 1, 0.5)).toBeCloseTo(0.5, 10);
	});

	it('exactly 2 heads in 4 flips at p=0.3: C(4,2) * 0.3^2 * 0.7^2 = 6 * 0.09 * 0.49', () => {
		expect(binomialProbability(4, 2, 0.3)).toBeCloseTo(6 * 0.09 * 0.49, 10);
	});

	it('single fair flip: P(0)=0.5, P(1)=0.5', () => {
		expect(binomialProbability(1, 0, 0.5)).toBeCloseTo(0.5, 10);
		expect(binomialProbability(1, 1, 0.5)).toBeCloseTo(0.5, 10);
	});

	it('zero flips: P(exactly 0 of 0) = 1 (empty product, C(0,0)=1)', () => {
		expect(binomialProbability(0, 0, 0.5)).toBeCloseTo(1, 10);
	});

	it('k greater than n is impossible', () => {
		expect(binomialProbability(3, 5, 0.5)).toBe(0);
	});

	it('negative k is impossible', () => {
		expect(binomialProbability(3, -1, 0.5)).toBe(0);
	});

	it('a coin that always lands heads (p=1): P(n heads)=1, anything else 0', () => {
		expect(binomialProbability(5, 5, 1)).toBeCloseTo(1, 10);
		expect(binomialProbability(5, 3, 1)).toBe(0);
	});

	it('a coin that always lands tails (p=0): P(0 heads)=1, anything else 0', () => {
		expect(binomialProbability(5, 0, 0)).toBeCloseTo(1, 10);
		expect(binomialProbability(5, 2, 0)).toBe(0);
	});

	it('stays numerically sane for a large flip count (n=1000, k=500, fair)', () => {
		// Central term of a large fair binomial; Stirling approximation puts it near
		// 1/sqrt(pi*n/2) = 1/sqrt(500*pi) ≈ 0.02523.
		const p = binomialProbability(1000, 500, 0.5);
		expect(p).toBeGreaterThan(0.02);
		expect(p).toBeLessThan(0.03);
	});
});

describe('binomialAtLeast / binomialAtMost', () => {
	it('at least 1 of 2 fair flips: P(1)+P(2) = 0.5 + 0.25 = 0.75', () => {
		expect(binomialAtLeast(2, 1, 0.5)).toBeCloseTo(0.75, 10);
	});

	it('at least 0 is always certain', () => {
		expect(binomialAtLeast(10, 0, 0.5)).toBeCloseTo(1, 10);
	});

	it('at most n is always certain', () => {
		expect(binomialAtMost(10, 10, 0.5)).toBeCloseTo(1, 10);
	});

	it('at-least and at-most partition correctly: P(atLeast k) + P(atMost k-1) = 1', () => {
		expect(binomialAtLeast(20, 12, 0.5) + binomialAtMost(20, 11, 0.5)).toBeCloseTo(1, 9);
	});

	it('at least k > n is impossible', () => {
		expect(binomialAtLeast(4, 5, 0.5)).toBe(0);
	});
});

describe('binomialExpectedValue / binomialStdDev', () => {
	it('E[X] = n*p for 100 fair flips is 50', () => {
		expect(binomialExpectedValue(100, 0.5)).toBe(50);
	});

	it('stddev = sqrt(n*p*(1-p)) for 100 fair flips is 5', () => {
		expect(binomialStdDev(100, 0.5)).toBeCloseTo(5, 10);
	});

	it('a biased coin (p=0.2) over 50 flips: mean 10, stddev sqrt(50*0.2*0.8)=sqrt(8)', () => {
		expect(binomialExpectedValue(50, 0.2)).toBeCloseTo(10, 10);
		expect(binomialStdDev(50, 0.2)).toBeCloseTo(Math.sqrt(8), 10);
	});
});

describe('summarizeFlips', () => {
	it('counts heads/tails and the longest run of each, by hand: H H T H H H T', () => {
		const results = [true, true, false, true, true, true, false];
		const summary = summarizeFlips(results);
		expect(summary.heads).toBe(5);
		expect(summary.tails).toBe(2);
		expect(summary.headsPct).toBeCloseTo((5 / 7) * 100, 10);
		expect(summary.longestHeadsStreak).toBe(3);
		expect(summary.longestTailsStreak).toBe(1);
	});

	it('handles an empty sequence without dividing by zero', () => {
		const summary = summarizeFlips([]);
		expect(summary.heads).toBe(0);
		expect(summary.tails).toBe(0);
		expect(summary.headsPct).toBe(0);
		expect(summary.longestHeadsStreak).toBe(0);
		expect(summary.longestTailsStreak).toBe(0);
	});

	it('an all-heads sequence has zero tails streak', () => {
		const summary = summarizeFlips([true, true, true, true, true]);
		expect(summary.heads).toBe(5);
		expect(summary.tails).toBe(0);
		expect(summary.longestHeadsStreak).toBe(5);
		expect(summary.longestTailsStreak).toBe(0);
	});

	it('a single flip streak is length 1', () => {
		const summary = summarizeFlips([false]);
		expect(summary.longestTailsStreak).toBe(1);
		expect(summary.longestHeadsStreak).toBe(0);
	});
});

describe('simulateFlips', () => {
	it('produces exactly n results', () => {
		expect(simulateFlips(37, 0.5, () => 0.4)).toHaveLength(37);
	});

	it('an injected RNG that always returns 0 always beats p, so every flip is heads', () => {
		const results = simulateFlips(10, 0.5, () => 0);
		expect(results.every((r) => r === true)).toBe(true);
	});

	it('an injected RNG that always returns 0.999 always loses, so every flip is tails', () => {
		const results = simulateFlips(10, 0.5, () => 0.999);
		expect(results.every((r) => r === false)).toBe(true);
	});

	it('respects a custom bias: rng just under p is heads, just over is tails', () => {
		const results = simulateFlips(2, 0.3, ((): (() => number) => {
			let call = 0;
			const values = [0.29, 0.31];
			return () => values[call++];
		})());
		expect(results).toEqual([true, false]);
	});
});
