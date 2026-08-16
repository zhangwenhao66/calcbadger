import { describe, it, expect } from 'vitest';
import {
	ALPHABET,
	VOWELS,
	CONSONANTS,
	LETTER_FREQUENCY,
	lettersForSet,
	weightsFor,
	normalizeWeights,
	pickIndex,
	generateLetters,
	tallyLetters,
	probabilitiesFor,
} from '../src/lib/randomLetter';

// Cumulative probabilities for the frequency-weighted vowel test below are
// hand-derived from LETTER_FREQUENCY (a=8.2, e=12.7, i=7.0, o=7.5, u=2.8,
// sum=38.2), not read back from the implementation:
// a: 0.2147 (cum 0.2147), e: 0.3325 (cum 0.5471), i: 0.1832 (cum 0.7304),
// o: 0.1963 (cum 0.9267), u: 0.0733 (cum 1.0)

describe('lettersForSet', () => {
	it('all returns the 26-letter alphabet in a-z order', () => {
		expect(lettersForSet('all')).toEqual(ALPHABET);
		expect(lettersForSet('all')).toHaveLength(26);
	});

	it('vowels returns exactly a e i o u', () => {
		expect(lettersForSet('vowels')).toEqual(['a', 'e', 'i', 'o', 'u']);
	});

	it('consonants returns the other 21 letters, none of them vowels', () => {
		const consonants = lettersForSet('consonants');
		expect(consonants).toHaveLength(21);
		for (const v of VOWELS) expect(consonants).not.toContain(v);
	});

	it('vowels + consonants together reconstruct the full alphabet', () => {
		const combined = [...lettersForSet('vowels'), ...lettersForSet('consonants')].sort();
		expect(combined).toEqual([...ALPHABET].sort());
	});
});

describe('LETTER_FREQUENCY', () => {
	it('has an entry for all 26 letters summing to ~100%', () => {
		expect(Object.keys(LETTER_FREQUENCY)).toHaveLength(26);
		const total = Object.values(LETTER_FREQUENCY).reduce((a, b) => a + b, 0);
		expect(total).toBeGreaterThan(99);
		expect(total).toBeLessThan(101);
	});

	it('ranks e, t, a, o, i as the five most frequent letters (Wikipedia/Cornell corpus rank order)', () => {
		const ranked = Object.entries(LETTER_FREQUENCY)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([letter]) => letter);
		expect(ranked).toEqual(['e', 't', 'a', 'o', 'i']);
	});
});

describe('weightsFor', () => {
	it('equal weighting gives every letter weight 1', () => {
		const letters = lettersForSet('vowels');
		expect(weightsFor(letters, 'equal')).toEqual([1, 1, 1, 1, 1]);
	});

	it('frequency weighting pulls each letter\'s weight from LETTER_FREQUENCY', () => {
		const letters = ['a', 'z'];
		expect(weightsFor(letters, 'frequency')).toEqual([8.2, 0.074]);
	});
});

describe('normalizeWeights', () => {
	it('two equal weights normalize to 0.5 each', () => {
		expect(normalizeWeights([1, 1])).toEqual([0.5, 0.5]);
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
});

describe('pickIndex', () => {
	it('a fair two-option draw: rng just under 0.5 picks index 0, just at/over picks index 1', () => {
		expect(pickIndex([1, 1], () => 0.49)).toBe(0);
		expect(pickIndex([1, 1], () => 0.5)).toBe(1);
		expect(pickIndex([1, 1], () => 0.99)).toBe(1);
	});

	it('frequency-weighted vowels (a e i o u): rng lands in each hand-derived cumulative bucket', () => {
		const letters = lettersForSet('vowels');
		const weights = weightsFor(letters, 'frequency');
		expect(pickIndex(weights, () => 0.1)).toBe(0); // a: [0, 0.2147)
		expect(pickIndex(weights, () => 0.4)).toBe(1); // e: [0.2147, 0.5471)
		expect(pickIndex(weights, () => 0.6)).toBe(2); // i: [0.5471, 0.7304)
		expect(pickIndex(weights, () => 0.8)).toBe(3); // o: [0.7304, 0.9267)
		expect(pickIndex(weights, () => 0.95)).toBe(4); // u: [0.9267, 1.0)
	});
});

describe('generateLetters', () => {
	it('draws exactly `count` letters', () => {
		expect(generateLetters(5, 'all', 'equal', () => 0.5)).toHaveLength(5);
	});

	it('count 0 returns an empty array', () => {
		expect(generateLetters(0, 'all', 'equal')).toEqual([]);
	});

	it('a negative or fractional count is floored to a non-negative integer', () => {
		expect(generateLetters(-3, 'all', 'equal')).toEqual([]);
		expect(generateLetters(2.9, 'all', 'equal', () => 0.5)).toHaveLength(2);
	});

	it('restricting to vowels only ever draws vowels, even with a deterministic high rng', () => {
		const letters = generateLetters(10, 'vowels', 'equal', () => 0.999);
		for (const l of letters) expect(VOWELS).toContain(l);
	});

	it('restricting to consonants only ever draws consonants', () => {
		const letters = generateLetters(10, 'consonants', 'frequency', () => 0.01);
		for (const l of letters) expect(CONSONANTS).toContain(l);
	});

	it('a fixed rng of 0 always draws the first letter in the set (with-replacement draws can repeat)', () => {
		expect(generateLetters(4, 'all', 'equal', () => 0)).toEqual(['a', 'a', 'a', 'a']);
	});
});

describe('tallyLetters', () => {
	it('counts occurrences and sorts by count descending', () => {
		expect(tallyLetters(['a', 'b', 'a', 'c', 'a', 'b'])).toEqual([
			{ letter: 'a', count: 3 },
			{ letter: 'b', count: 2 },
			{ letter: 'c', count: 1 },
		]);
	});

	it('ties break alphabetically', () => {
		expect(tallyLetters(['z', 'a'])).toEqual([
			{ letter: 'a', count: 1 },
			{ letter: 'z', count: 1 },
		]);
	});

	it('an empty history returns an empty tally', () => {
		expect(tallyLetters([])).toEqual([]);
	});
});

describe('probabilitiesFor', () => {
	it('equal weighting over 26 letters gives each 1/26', () => {
		const probs = probabilitiesFor(ALPHABET, 'equal');
		expect(probs).toHaveLength(26);
		probs.forEach((p) => expect(p).toBeCloseTo(1 / 26, 10));
	});

	it('frequency weighting over all 26 letters sums to 1 and ranks e highest', () => {
		const probs = probabilitiesFor(ALPHABET, 'frequency');
		const total = probs.reduce((a, b) => a + b, 0);
		expect(total).toBeCloseTo(1, 10);
		const eIndex = ALPHABET.indexOf('e');
		expect(probs[eIndex]).toBe(Math.max(...probs));
	});
});
