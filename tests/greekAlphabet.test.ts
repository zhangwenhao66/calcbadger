import { describe, expect, it } from 'vitest';
import { filterGreekLetters, GREEK_LETTERS } from '../src/lib/greekAlphabet';

describe('GREEK_LETTERS', () => {
	it('has exactly 24 letters', () => {
		expect(GREEK_LETTERS).toHaveLength(24);
	});

	it('starts with Alpha and ends with Omega', () => {
		expect(GREEK_LETTERS[0].name).toBe('Alpha');
		expect(GREEK_LETTERS[23].name).toBe('Omega');
	});

	it('every letter has a unique name', () => {
		const names = GREEK_LETTERS.map((l) => l.name);
		expect(new Set(names).size).toBe(24);
	});

	it('uppercase code points run U+0391 through U+03A9, skipping the unassigned U+03A2 gap', () => {
		const points = GREEK_LETTERS.map((l) => parseInt(l.upperCodePoint.replace('U+', ''), 16));
		expect(points[0]).toBe(0x0391);
		expect(points[points.length - 1]).toBe(0x03a9);
		// The block has a reserved, unassigned slot at U+03A2 (between rho and
		// sigma) — the 24-letter run skips it, so it must never appear here.
		expect(points).not.toContain(0x03a2);
	});

	it('lowercase code points run U+03B1 through U+03C9, skipping U+03C2 (that slot is final sigma, not medial sigma)', () => {
		const points = GREEK_LETTERS.map((l) => parseInt(l.lowerCodePoint.replace('U+', ''), 16));
		expect(points[0]).toBe(0x03b1);
		expect(points[points.length - 1]).toBe(0x03c9);
		expect(points).not.toContain(0x03c2);
	});

	it('sigma is the only letter with a final form, and it is U+03C2', () => {
		const withFinal = GREEK_LETTERS.filter((l) => l.finalForm);
		expect(withFinal).toHaveLength(1);
		expect(withFinal[0].name).toBe('Sigma');
		expect(withFinal[0].finalForm).toBe('ς');
		expect(withFinal[0].finalForm?.codePointAt(0)).toBe(0x03c2);
	});

	it('every glyph field actually matches its declared code point', () => {
		for (const letter of GREEK_LETTERS) {
			expect(letter.uppercase.codePointAt(0)).toBe(parseInt(letter.upperCodePoint.replace('U+', ''), 16));
			expect(letter.lowercase.codePointAt(0)).toBe(parseInt(letter.lowerCodePoint.replace('U+', ''), 16));
		}
	});
});

describe('filterGreekLetters', () => {
	it('returns every letter for an empty query', () => {
		expect(filterGreekLetters(GREEK_LETTERS, '')).toHaveLength(24);
		expect(filterGreekLetters(GREEK_LETTERS, '   ')).toHaveLength(24);
	});

	it('matches by name, case-insensitively', () => {
		const result = filterGreekLetters(GREEK_LETTERS, 'OMEGA');
		expect(result.map((l) => l.name)).toEqual(['Omega']);
	});

	it('matches partial names', () => {
		const result = filterGreekLetters(GREEK_LETTERS, 'kap');
		expect(result.map((l) => l.name)).toEqual(['Kappa']);
	});

	it('matches an exact uppercase glyph', () => {
		const result = filterGreekLetters(GREEK_LETTERS, 'Σ');
		expect(result.map((l) => l.name)).toEqual(['Sigma']);
	});

	it('matches an exact lowercase glyph', () => {
		const result = filterGreekLetters(GREEK_LETTERS, 'δ');
		expect(result.map((l) => l.name)).toEqual(['Delta']);
	});

	it('matches the final sigma glyph', () => {
		const result = filterGreekLetters(GREEK_LETTERS, 'ς');
		expect(result.map((l) => l.name)).toEqual(['Sigma']);
	});

	it('matches by common-use text', () => {
		const result = filterGreekLetters(GREEK_LETTERS, 'standard deviation');
		expect(result.map((l) => l.name)).toEqual(['Sigma']);
	});

	it('returns an empty array when nothing matches', () => {
		expect(filterGreekLetters(GREEK_LETTERS, 'zzzzz')).toHaveLength(0);
	});
});
