import { describe, it, expect } from 'vitest';
import {
	rollDie,
	rollDice,
	rollD20WithAdvantage,
	expectedValueSingleDie,
	varianceSingleDie,
	expectedValueSum,
	varianceSum,
	stdDevSum,
	distributionOfSum,
	minSum,
	probabilityExactly,
	probabilityAtLeast,
	probabilityAtMost,
} from '../src/lib/diceRoller';

// Expected values hand-derived independently (fractions.Fraction in Python), not read
// back from the implementation. The 2d6 distribution (1/2/3/4/5/6/5/4/3/2/1 out of 36)
// is the standard textbook example for verifying dice-sum convolution math.

describe('rollDie', () => {
	it('a fair d6 with a fixed RNG returns the deterministic face', () => {
		expect(rollDie(6, () => 0)).toBe(1);
		expect(rollDie(6, () => 0.999999)).toBe(6);
		expect(rollDie(6, () => 0.5)).toBe(4);
	});

	it('a d20 stays within 1..20 across the RNG range', () => {
		for (const r of [0, 0.1, 0.5, 0.99, 0.999999]) {
			const v = rollDie(20, () => r);
			expect(v).toBeGreaterThanOrEqual(1);
			expect(v).toBeLessThanOrEqual(20);
		}
	});
});

describe('rollDice', () => {
	it('rolls the requested count and sums them plus the modifier', () => {
		const seq = [0, 0.5, 0.999999]; // -> 1, 4, 6 on a d6 (0-indexed floor(r*6)+1)
		let i = 0;
		const rng = () => seq[i++]!;
		const result = rollDice(3, 6, 2, rng);
		expect(result.rolls).toEqual([1, 4, 6]);
		expect(result.total).toBe(1 + 4 + 6 + 2);
	});

	it('zero dice sums to just the modifier', () => {
		const result = rollDice(0, 6, 5, () => 0);
		expect(result.rolls).toEqual([]);
		expect(result.total).toBe(5);
	});
});

describe('rollD20WithAdvantage', () => {
	it('advantage keeps the higher of two d20 rolls (SRD 5.1 p.76)', () => {
		const seq = [0.5, 0.9]; // floor(0.5*20)+1=11, floor(0.9*20)+1=19
		let i = 0;
		const rng = () => seq[i++]!;
		const result = rollD20WithAdvantage('advantage', 0, rng);
		expect(result.rolls).toEqual([11, 19]);
		expect(result.total).toBe(19);
	});

	it('disadvantage keeps the lower of two d20 rolls (SRD 5.1 p.76)', () => {
		const seq = [0.5, 0.9];
		let i = 0;
		const rng = () => seq[i++]!;
		const result = rollD20WithAdvantage('disadvantage', 3, rng);
		expect(result.rolls).toEqual([11, 19]);
		expect(result.total).toBe(11 + 3);
	});
});

describe('expectedValueSingleDie / varianceSingleDie', () => {
	it('d6: E=3.5, Var=35/12 (MathWorld discrete uniform distribution)', () => {
		expect(expectedValueSingleDie(6)).toBeCloseTo(3.5, 10);
		expect(varianceSingleDie(6)).toBeCloseTo(35 / 12, 10);
	});

	it('d20: E=10.5, Var=(400-1)/12', () => {
		expect(expectedValueSingleDie(20)).toBeCloseTo(10.5, 10);
		expect(varianceSingleDie(20)).toBeCloseTo(399 / 12, 10);
	});

	it('d4: E=2.5, Var=15/12', () => {
		expect(expectedValueSingleDie(4)).toBeCloseTo(2.5, 10);
		expect(varianceSingleDie(4)).toBeCloseTo(15 / 12, 10);
	});
});

describe('expectedValueSum / varianceSum / stdDevSum', () => {
	it('2d6: E=7, Var=35/6 (variance additive under independence)', () => {
		expect(expectedValueSum(2, 6)).toBeCloseTo(7, 10);
		expect(varianceSum(2, 6)).toBeCloseTo(35 / 6, 10);
		expect(stdDevSum(2, 6)).toBeCloseTo(Math.sqrt(35 / 6), 10);
	});

	it('4d6: E=14', () => {
		expect(expectedValueSum(4, 6)).toBeCloseTo(14, 10);
	});
});

describe('distributionOfSum', () => {
	it('1 die: uniform over 1..sides', () => {
		const dist = distributionOfSum(1, 6);
		expect(dist).toHaveLength(6);
		for (const p of dist) expect(p).toBeCloseTo(1 / 6, 10);
	});

	it('2d6: matches the classic 1/2/3/4/5/6/5/4/3/2/1 out of 36 distribution', () => {
		const dist = distributionOfSum(2, 6);
		expect(dist).toHaveLength(11); // sums 2..12
		const expectedCounts = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
		expectedCounts.forEach((count, i) => {
			expect(dist[i]).toBeCloseTo(count / 36, 10);
		});
	});

	it('every distribution sums to 1 (it is a probability distribution)', () => {
		for (const [n, d] of [
			[1, 6],
			[2, 6],
			[3, 6],
			[2, 20],
			[4, 8],
		] as const) {
			const dist = distributionOfSum(n, d);
			const total = dist.reduce((a, b) => a + b, 0);
			expect(total).toBeCloseTo(1, 9);
		}
	});

	it('0 dice: a single point mass at sum 0', () => {
		expect(distributionOfSum(0, 6)).toEqual([1]);
	});
});

describe('minSum', () => {
	it('n dice can sum to at least n (all 1s)', () => {
		expect(minSum(3)).toBe(3);
		expect(minSum(0)).toBe(0);
	});
});

describe('probabilityExactly / probabilityAtLeast / probabilityAtMost', () => {
	it('2d6: P(exactly 7) = 6/36 (the most common sum)', () => {
		expect(probabilityExactly(2, 6, 0, 7)).toBeCloseTo(6 / 36, 10);
	});

	it('2d6: P(exactly 2) = 1/36 (snake eyes)', () => {
		expect(probabilityExactly(2, 6, 0, 2)).toBeCloseTo(1 / 36, 10);
	});

	it('3d6: P(sum >= 15) = 5/54 (hand-derived via convolution)', () => {
		expect(probabilityAtLeast(3, 6, 0, 15)).toBeCloseTo(5 / 54, 10);
	});

	it('a modifier shifts the target the same as shifting the sum', () => {
		// 2d6+3 >= 10  is the same event as 2d6 >= 7
		expect(probabilityAtLeast(2, 6, 3, 10)).toBeCloseTo(probabilityAtLeast(2, 6, 0, 7), 10);
	});

	it('P(at least) and P(at most) partition correctly around the target', () => {
		// P(>=7) + P(<=6) should equal 1 for 2d6 (no overlap, full coverage)
		const atLeast7 = probabilityAtLeast(2, 6, 0, 7);
		const atMost6 = probabilityAtMost(2, 6, 0, 6);
		expect(atLeast7 + atMost6).toBeCloseTo(1, 10);
	});

	it('an impossible target (below minimum) has probability 0 for "exactly" and 1 for "at least"', () => {
		expect(probabilityExactly(2, 6, 0, 1)).toBe(0);
		expect(probabilityAtLeast(2, 6, 0, 0)).toBeCloseTo(1, 10);
	});

	it('an impossible target (above maximum) has probability 0 for "at least"', () => {
		expect(probabilityAtLeast(2, 6, 0, 13)).toBe(0);
	});
});

describe('advantage/disadvantage worked example: DC 15 on a d20 (SRD 5.1 p.76 mechanic)', () => {
	it('normal roll: P(>=15) = 6/20 = 30%', () => {
		expect(probabilityAtLeast(1, 20, 0, 15)).toBeCloseTo(0.3, 10);
	});

	it('advantage (max of two d20): P(>=15) = 1 - (14/20)^2 = 51%', () => {
		// max(a,b) >= 15  <=>  NOT(a<15 AND b<15), P(a<15)=14/20 each, independent
		const p = 1 - Math.pow(14 / 20, 2);
		expect(p).toBeCloseTo(0.51, 10);
	});

	it('disadvantage (min of two d20): P(>=15) = (6/20)^2 = 9%', () => {
		const p = Math.pow(6 / 20, 2);
		expect(p).toBeCloseTo(0.09, 10);
	});
});
