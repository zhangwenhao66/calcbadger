/**
 * Coin flip simulation and binomial probability math.
 *
 * Formula authority: NIST/SEMATECH e-Handbook of Statistical Methods, "Binomial
 * Distribution" (itl.nist.gov/div898/handbook/eda/section3/eda366i.htm):
 *
 *   P(x; p, n) = C(n, x) * p^x * (1 - p)^(n - x),  x = 0, 1, ..., n
 *   C(n, x) = n! / (x! * (n - x)!)
 *
 * A fair coin is the p = 0.5 case; the same formula covers a weighted coin at
 * any p. Mean and variance of the count of successes (E. Kreyszig, Advanced
 * Engineering Mathematics, or any standard probability text):
 *
 *   E[X] = n * p
 *   Var[X] = n * p * (1 - p)
 *
 * Binomial coefficients are computed in log space (sum of logs of the ratio
 * (n-k+i)/i for i = 1..k) rather than via factorials, so n can run into the
 * thousands without overflowing to Infinity.
 */

/** log(C(n, k)), using the smaller of k and n-k to minimize terms. */
function logBinomialCoefficient(n: number, k: number): number {
	if (k < 0 || k > n) return -Infinity;
	const j = Math.min(k, n - k);
	let logSum = 0;
	for (let i = 1; i <= j; i++) {
		logSum += Math.log((n - j + i) / i);
	}
	return logSum;
}

/** P(exactly k successes in n trials at per-trial probability p). */
export function binomialProbability(n: number, k: number, p: number): number {
	if (k < 0 || k > n || !Number.isInteger(k) || !Number.isInteger(n)) return 0;
	if (p <= 0) return k === 0 ? 1 : 0;
	if (p >= 1) return k === n ? 1 : 0;
	const logP = logBinomialCoefficient(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
	return Math.exp(logP);
}

/** P(at least k successes in n trials). */
export function binomialAtLeast(n: number, k: number, p: number): number {
	if (k <= 0) return 1;
	if (k > n) return 0;
	let total = 0;
	for (let x = k; x <= n; x++) total += binomialProbability(n, x, p);
	return Math.min(1, total);
}

/** P(at most k successes in n trials). */
export function binomialAtMost(n: number, k: number, p: number): number {
	if (k >= n) return 1;
	if (k < 0) return 0;
	let total = 0;
	for (let x = 0; x <= k; x++) total += binomialProbability(n, x, p);
	return Math.min(1, total);
}

/** E[X] = n * p. */
export function binomialExpectedValue(n: number, p: number): number {
	return n * p;
}

/** sqrt(Var[X]) = sqrt(n * p * (1 - p)). */
export function binomialStdDev(n: number, p: number): number {
	return Math.sqrt(n * p * (1 - p));
}

export interface FlipSummary {
	heads: number;
	tails: number;
	headsPct: number;
	longestHeadsStreak: number;
	longestTailsStreak: number;
}

/** Pure summary of a fixed sequence of results (true = heads). No randomness. */
export function summarizeFlips(results: boolean[]): FlipSummary {
	let heads = 0;
	let tails = 0;
	let longestHeadsStreak = 0;
	let longestTailsStreak = 0;
	let currentStreak = 0;
	let currentIsHeads: boolean | null = null;

	for (const result of results) {
		if (result) heads++;
		else tails++;

		if (result === currentIsHeads) {
			currentStreak++;
		} else {
			currentIsHeads = result;
			currentStreak = 1;
		}
		if (result) longestHeadsStreak = Math.max(longestHeadsStreak, currentStreak);
		else longestTailsStreak = Math.max(longestTailsStreak, currentStreak);
	}

	return {
		heads,
		tails,
		headsPct: results.length === 0 ? 0 : (heads / results.length) * 100,
		longestHeadsStreak,
		longestTailsStreak,
	};
}

/** Simulate n independent flips at heads-probability p. Injectable RNG for testability. */
export function simulateFlips(n: number, p: number, rng: () => number = Math.random): boolean[] {
	const results: boolean[] = new Array(Math.max(0, Math.floor(n)));
	for (let i = 0; i < results.length; i++) {
		results[i] = rng() < p;
	}
	return results;
}
