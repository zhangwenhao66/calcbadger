/**
 * Random letter generation and English letter-frequency weighting.
 *
 * Frequency source: Wikipedia, "Letter frequency" (Texts column), cross-
 * checked against Cornell University's Math Explorers' Club 40,000-word
 * corpus table (pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/
 * frequencies.html). The two sources agree on the top 7 letters (E T A O I N
 * S) and on most percentages, but diverge below that -- Wikipedia ranks H
 * above R (6.1% vs 6.0%) where Cornell has R above H (6.02% vs 5.92%), and
 * ranks further down the alphabet differ more. The Wikipedia figures are used
 * here as the canonical weights (see tools.ts sources for both citations).
 *
 * Weighted picking uses the same cumulative-weight method as the site's
 * decision-wheel tool (see yesNoWheel.ts): draw one uniform random number and
 * walk cumulative probability until it's exceeded (inverse transform
 * sampling for a discrete distribution).
 */

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const VOWELS = 'aeiou'.split('');
export const CONSONANTS = ALPHABET.filter((l) => !VOWELS.includes(l));

/** Relative frequency (%) of each lowercase letter in English text. Wikipedia "Letter frequency", Texts column. */
export const LETTER_FREQUENCY: Record<string, number> = {
	a: 8.2,
	b: 1.5,
	c: 2.8,
	d: 4.3,
	e: 12.7,
	f: 2.2,
	g: 2.0,
	h: 6.1,
	i: 7.0,
	j: 0.16,
	k: 0.77,
	l: 4.0,
	m: 2.4,
	n: 6.7,
	o: 7.5,
	p: 1.9,
	q: 0.12,
	r: 6.0,
	s: 6.3,
	t: 9.1,
	u: 2.8,
	v: 0.98,
	w: 2.4,
	x: 0.15,
	y: 2.0,
	z: 0.074,
};

export type LetterSet = 'all' | 'vowels' | 'consonants';
export type Weighting = 'equal' | 'frequency';

/** The candidate letters for a given set, in fixed a-z order. */
export function lettersForSet(set: LetterSet): string[] {
	if (set === 'vowels') return VOWELS;
	if (set === 'consonants') return CONSONANTS;
	return ALPHABET;
}

/** Weight for each letter in `letters` (same order), per the chosen weighting scheme. */
export function weightsFor(letters: string[], weighting: Weighting): number[] {
	if (weighting === 'equal') return letters.map(() => 1);
	return letters.map((l) => LETTER_FREQUENCY[l] ?? 0);
}

/** Normalize weights so they sum to 1. Non-positive/NaN weights count as 0. */
export function normalizeWeights(weights: number[]): number[] {
	const clean = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
	const total = clean.reduce((sum, w) => sum + w, 0);
	if (total <= 0) return clean.map(() => 0);
	return clean.map((w) => w / total);
}

/**
 * Pick an index from `weights` using the cumulative-weight method: draw one
 * uniform random number in [0, 1) and walk the cumulative probability sums
 * until it's exceeded. Injectable RNG for testability.
 */
export function pickIndex(weights: number[], rng: () => number = Math.random): number {
	const probs = normalizeWeights(weights);
	const r = rng();
	let cumulative = 0;
	for (let i = 0; i < probs.length; i++) {
		cumulative += probs[i]!;
		if (r < cumulative) return i;
	}
	for (let i = probs.length - 1; i >= 0; i--) {
		if (probs[i]! > 0) return i;
	}
	return probs.length - 1;
}

/**
 * Draw `count` letters independently (with replacement) from `set`, weighted
 * per `weighting`. Each draw is its own independent pick, the same way rolling
 * a die twice gives two independent results -- so the same letter can appear
 * more than once in a single draw.
 */
export function generateLetters(
	count: number,
	set: LetterSet,
	weighting: Weighting,
	rng: () => number = Math.random,
): string[] {
	const letters = lettersForSet(set);
	const weights = weightsFor(letters, weighting);
	const n = Math.max(0, Math.floor(count));
	const result: string[] = new Array(n);
	for (let i = 0; i < n; i++) {
		result[i] = letters[pickIndex(weights, rng)]!;
	}
	return result;
}

export interface LetterCount {
	letter: string;
	count: number;
}

/** Tally how many times each letter appears in a history of draws, sorted by count descending then alphabetically. */
export function tallyLetters(history: string[]): LetterCount[] {
	const counts = new Map<string, number>();
	for (const l of history) counts.set(l, (counts.get(l) ?? 0) + 1);
	return [...counts.entries()]
		.map(([letter, count]) => ({ letter, count }))
		.sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter));
}

/** Per-spin probability (0-1) of each letter in `letters`, for the given weighting. Same order as `letters`. */
export function probabilitiesFor(letters: string[], weighting: Weighting): number[] {
	return normalizeWeights(weightsFor(letters, weighting));
}
