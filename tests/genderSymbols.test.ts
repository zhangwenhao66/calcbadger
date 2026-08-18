import { describe, expect, it } from 'vitest';
import { filterGenderSymbols, GENDER_SYMBOLS } from '../src/lib/genderSymbols';

describe('GENDER_SYMBOLS', () => {
	it('has exactly 7 symbols', () => {
		expect(GENDER_SYMBOLS).toHaveLength(7);
	});

	it('every symbol has a unique name', () => {
		const names = GENDER_SYMBOLS.map((s) => s.name);
		expect(new Set(names).size).toBe(GENDER_SYMBOLS.length);
	});

	it('every symbol has a unique glyph', () => {
		const glyphs = GENDER_SYMBOLS.map((s) => s.symbol);
		expect(new Set(glyphs).size).toBe(GENDER_SYMBOLS.length);
	});

	it('every glyph field actually matches its declared Unicode code point', () => {
		for (const s of GENDER_SYMBOLS) {
			const declared = parseInt(s.codePoint.replace('U+', ''), 16);
			expect(s.symbol.codePointAt(0)).toBe(declared);
			// Single-codepoint glyphs only — none of these symbols are pairs.
			expect([...s.symbol]).toHaveLength(1);
		}
	});

	it('every symbol has non-empty meaning, common use, and history text', () => {
		for (const s of GENDER_SYMBOLS) {
			expect(s.meaning.length).toBeGreaterThan(0);
			expect(s.commonUse.length).toBeGreaterThan(0);
			expect(s.history.length).toBeGreaterThan(0);
		}
	});
});

describe('filterGenderSymbols', () => {
	it('returns every symbol for an empty or whitespace-only query', () => {
		expect(filterGenderSymbols(GENDER_SYMBOLS, '')).toHaveLength(7);
		expect(filterGenderSymbols(GENDER_SYMBOLS, '   ')).toHaveLength(7);
	});

	it('matches by name, case-insensitively', () => {
		const results = filterGenderSymbols(GENDER_SYMBOLS, 'female');
		expect(results.some((s) => s.name === 'Female')).toBe(true);
		expect(results.some((s) => s.name === 'Doubled Female')).toBe(true);
	});

	it('matches by exact glyph', () => {
		const results = filterGenderSymbols(GENDER_SYMBOLS, '⚧');
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe('Transgender');
	});

	it('matches by meaning text', () => {
		const results = filterGenderSymbols(GENDER_SYMBOLS, 'lesbian');
		expect(results.some((s) => s.name === 'Doubled Female')).toBe(true);
	});

	it('matches by common-use text', () => {
		const results = filterGenderSymbols(GENDER_SYMBOLS, 'astrology');
		expect(results.length).toBeGreaterThanOrEqual(2);
	});

	it('returns an empty array for a query matching nothing', () => {
		expect(filterGenderSymbols(GENDER_SYMBOLS, 'xyz123nonsense')).toHaveLength(0);
	});
});
