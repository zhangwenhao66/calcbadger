/**
 * Dice rolling and dice-sum probability math.
 *
 * Formula authority: a single fair d-sided die is a discrete uniform
 * distribution over {1, 2, ..., d} (Weisstein, Eric W. "Discrete Uniform
 * Distribution." MathWorld, mathworld.wolfram.com/DiscreteUniformDistribution.html):
 *
 *   E[X] = (d + 1) / 2
 *   Var[X] = (d^2 - 1) / 12
 *
 * Rolling n independent dice and summing them is a sum of n i.i.d. discrete
 * uniform variables, so expectation and variance add (linearity of
 * expectation and variance-additivity under independence, standard results
 * in any probability text):
 *
 *   E[sum] = n * (d + 1) / 2
 *   Var[sum] = n * (d^2 - 1) / 12
 *
 * The exact probability distribution of the sum (not just its mean/variance)
 * is computed here by convolution: start from one die's uniform distribution
 * and repeatedly convolve it with itself, which is exact by construction
 * because each die is independent and identically distributed. This is
 * verified in tests against the classic 2d6 distribution (1/2/3/4/5/6/5/4/3/2/1
 * out of 36), the standard textbook example.
 *
 * Advantage/disadvantage rule (roll two d20s, keep the higher for advantage
 * or the lower for disadvantage) is the official D&D 5th Edition rule, System
 * Reference Document 5.1 (Wizards of the Coast LLC, CC-BY-4.0), p.76:
 * media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf. This tool is an
 * independent utility, not affiliated with or endorsed by Wizards of the Coast.
 */

export const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;
export type DiceType = (typeof DICE_TYPES)[number];

export interface RollResult {
	rolls: number[];
	sides: number;
	modifier: number;
	total: number;
}

/** One uniform draw from {1, ..., sides}. Injectable RNG for testability. */
export function rollDie(sides: number, rng: () => number = Math.random): number {
	return Math.floor(rng() * sides) + 1;
}

/** Roll `count` independent dice of `sides` faces and add `modifier` to the sum. */
export function rollDice(
	count: number,
	sides: number,
	modifier: number,
	rng: () => number = Math.random,
): RollResult {
	const n = Math.max(0, Math.floor(count));
	const rolls: number[] = new Array(n);
	for (let i = 0; i < n; i++) rolls[i] = rollDie(sides, rng);
	const total = rolls.reduce((a, b) => a + b, 0) + modifier;
	return { rolls, sides, modifier, total };
}

/**
 * D&D 5e advantage/disadvantage: roll two d20s, use the higher (advantage) or
 * lower (disadvantage). SRD 5.1 p.76 (see file header for citation).
 */
export function rollD20WithAdvantage(
	mode: 'advantage' | 'disadvantage',
	modifier: number,
	rng: () => number = Math.random,
): RollResult {
	const a = rollDie(20, rng);
	const b = rollDie(20, rng);
	const kept = mode === 'advantage' ? Math.max(a, b) : Math.min(a, b);
	return { rolls: [a, b], sides: 20, modifier, total: kept + modifier };
}

/** E[X] for one fair die of `sides` faces: (sides + 1) / 2. */
export function expectedValueSingleDie(sides: number): number {
	return (sides + 1) / 2;
}

/** Var[X] for one fair die of `sides` faces: (sides^2 - 1) / 12. */
export function varianceSingleDie(sides: number): number {
	return (sides * sides - 1) / 12;
}

/** E[sum] for `count` independent dice of `sides` faces: count * (sides + 1) / 2. */
export function expectedValueSum(count: number, sides: number): number {
	return count * expectedValueSingleDie(sides);
}

/** Var[sum] for `count` independent dice of `sides` faces: count * (sides^2 - 1) / 12. */
export function varianceSum(count: number, sides: number): number {
	return count * varianceSingleDie(sides);
}

export function stdDevSum(count: number, sides: number): number {
	return Math.sqrt(varianceSum(count, sides));
}

/**
 * Exact probability distribution of the sum of `count` independent d`sides`
 * dice, keyed by sum. Built by convolving the single-die uniform distribution
 * with itself `count` times (exact for independent, identically distributed
 * dice). Index 0 of the returned array corresponds to sum = `count` (the
 * minimum possible), so distributionOfSum(n, d)[k] = P(sum == n + k).
 */
export function distributionOfSum(count: number, sides: number): number[] {
	const n = Math.max(0, Math.floor(count));
	const d = Math.max(1, Math.floor(sides));
	if (n === 0) return [1];

	// dist[k] = P(sum of dice so far == minSoFar + k)
	let minSoFar = 1;
	let dist = new Array(d).fill(1 / d); // one die: sums 1..d, uniform

	for (let dieIndex = 1; dieIndex < n; dieIndex++) {
		const newMin = minSoFar + 1;
		const newLen = dist.length + d - 1;
		const next = new Array(newLen).fill(0);
		for (let i = 0; i < dist.length; i++) {
			const p = dist[i];
			if (p === 0) continue;
			for (let face = 1; face <= d; face++) {
				next[i + face - 1] += p / d;
			}
		}
		dist = next;
		minSoFar = newMin;
	}

	return dist;
}

/** The minimum possible sum of `count` d`sides` dice (all 1s). */
export function minSum(count: number): number {
	return Math.max(0, Math.floor(count));
}

/** P(sum + modifier is exactly `target`), from the exact distribution. */
export function probabilityExactly(count: number, sides: number, modifier: number, target: number): number {
	const dist = distributionOfSum(count, sides);
	const idx = target - modifier - minSum(count);
	if (idx < 0 || idx >= dist.length) return 0;
	return dist[idx]!;
}

/** P(sum + modifier >= target), from the exact distribution. */
export function probabilityAtLeast(count: number, sides: number, modifier: number, target: number): number {
	const dist = distributionOfSum(count, sides);
	const base = minSum(count);
	let total = 0;
	for (let i = 0; i < dist.length; i++) {
		if (base + i + modifier >= target) total += dist[i]!;
	}
	return Math.min(1, total);
}

/** P(sum + modifier <= target), from the exact distribution. */
export function probabilityAtMost(count: number, sides: number, modifier: number, target: number): number {
	const dist = distributionOfSum(count, sides);
	const base = minSum(count);
	let total = 0;
	for (let i = 0; i < dist.length; i++) {
		if (base + i + modifier <= target) total += dist[i]!;
	}
	return Math.min(1, total);
}
