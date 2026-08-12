/**
 * Weighted decision-wheel spin logic (2-segment "yes/no" by default, extensible
 * to more segments) and the probability math for repeated spins.
 *
 * Formula authority: picking a segment by walking cumulative weight against a
 * single uniform random draw is the standard "cumulative weight" method for
 * weighted random sampling (Wikipedia, "Fitness proportionate selection" /
 * inverse transform sampling for a discrete distribution — any standard
 * probability text, e.g. Ross, "A First Course in Probability", covers the
 * general technique). The per-spin chance of a given segment is simply its
 * weight divided by the sum of all weights; the chance of that segment landing
 * k times in a row across independent spins is p^k (product of independent
 * probabilities), and the expected number of spins until it first appears is
 * 1/p (geometric distribution mean, Wikipedia "Geometric distribution").
 */

export interface WheelSegment {
	label: string;
	weight: number;
}

/** Normalize weights so they sum to 1. Non-positive/NaN weights count as 0. */
export function normalizeWeights(weights: number[]): number[] {
	const clean = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
	const total = clean.reduce((sum, w) => sum + w, 0);
	if (total <= 0) return clean.map(() => 0);
	return clean.map((w) => w / total);
}

/**
 * Pick a segment index using the cumulative-weight method: draw one uniform
 * random number in [0, 1) and walk the cumulative probability sums until it's
 * exceeded. Injectable RNG for testability.
 */
export function spinWheel(weights: number[], rng: () => number = Math.random): number {
	const probs = normalizeWeights(weights);
	const r = rng();
	let cumulative = 0;
	for (let i = 0; i < probs.length; i++) {
		cumulative += probs[i];
		if (r < cumulative) return i;
	}
	for (let i = probs.length - 1; i >= 0; i--) {
		if (probs[i] > 0) return i;
	}
	return probs.length - 1;
}

/** Simulate n independent spins. Injectable RNG for testability. */
export function simulateSpins(
	n: number,
	weights: number[],
	rng: () => number = Math.random,
): number[] {
	const results: number[] = new Array(Math.max(0, Math.floor(n)));
	for (let i = 0; i < results.length; i++) {
		results[i] = spinWheel(weights, rng);
	}
	return results;
}

export interface SpinSummary {
	counts: number[];
	pct: number[];
	longestStreaks: number[];
}

/** Pure summary of a fixed sequence of spin results (segment indices). No randomness. */
export function summarizeSpins(results: number[], segmentCount: number): SpinSummary {
	const counts = new Array(segmentCount).fill(0);
	const longestStreaks = new Array(segmentCount).fill(0);
	let currentStreak = 0;
	let currentSegment = -1;

	for (const result of results) {
		counts[result]++;
		if (result === currentSegment) {
			currentStreak++;
		} else {
			currentSegment = result;
			currentStreak = 1;
		}
		longestStreaks[result] = Math.max(longestStreaks[result], currentStreak);
	}

	const pct = counts.map((c) => (results.length === 0 ? 0 : (c / results.length) * 100));
	return { counts, pct, longestStreaks };
}

/** E[X] = 1/p for a geometric distribution: expected spins until a segment with per-spin probability p first appears. */
export function expectedSpinsUntilFirst(p: number): number {
	if (p <= 0) return Infinity;
	return 1 / p;
}

/** P(the same segment lands k times in a row) = p^k, for independent spins at per-spin probability p. */
export function streakProbability(p: number, k: number): number {
	if (k < 0) return 0;
	if (k === 0) return 1;
	return Math.pow(p, k);
}

export interface SegmentAngle {
	start: number;
	end: number;
	mid: number;
}

/**
 * Cumulative angle ranges (degrees, clockwise from 12 o'clock) for each
 * segment, sized proportional to its normalized weight.
 */
export function segmentAngles(weights: number[]): SegmentAngle[] {
	const probs = normalizeWeights(weights);
	let cursor = 0;
	return probs.map((p) => {
		const start = cursor;
		const end = cursor + p * 360;
		cursor = end;
		return { start, end, mid: (start + end) / 2 };
	});
}

/**
 * Rotation (degrees) to apply to a wheel currently rotated `currentRotation`
 * degrees so that, after `extraSpins` additional full turns, the segment
 * whose midpoint sits at `targetMidAngle` (degrees clockwise from 12 o'clock,
 * matching segmentAngles) ends up under a pointer fixed at 12 o'clock.
 *
 * Rotating the disc clockwise by R degrees moves a point originally at angle
 * θ to (θ + R) mod 360 in the fixed frame; landing it at the pointer (0
 * degrees) requires R mod 360 = (360 - θ) mod 360. The returned rotation is
 * always >= currentRotation so the disc only ever spins forward.
 */
export function rotationForLanding(
	currentRotation: number,
	targetMidAngle: number,
	extraSpins: number,
): number {
	const currentMod = ((currentRotation % 360) + 360) % 360;
	const desiredMod = ((360 - targetMidAngle) % 360 + 360) % 360;
	const delta = ((desiredMod - currentMod) % 360 + 360) % 360;
	return currentRotation + extraSpins * 360 + delta;
}
