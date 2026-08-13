import { describe, expect, it } from 'vitest';
import { filterMathSymbols, MATH_SYMBOLS } from '../src/lib/mathSymbols';

describe('MATH_SYMBOLS', () => {
	it('has exactly 12 symbols', () => {
		expect(MATH_SYMBOLS).toHaveLength(12);
	});

	it('every symbol has a unique name', () => {
		const names = MATH_SYMBOLS.map((s) => s.name);
		expect(new Set(names).size).toBe(MATH_SYMBOLS.length);
	});

	it('every symbol has a unique glyph', () => {
		const glyphs = MATH_SYMBOLS.map((s) => s.symbol);
		expect(new Set(glyphs).size).toBe(MATH_SYMBOLS.length);
	});

	it('every glyph field actually matches its declared Unicode code point', () => {
		for (const s of MATH_SYMBOLS) {
			const declared = parseInt(s.codePoint.replace('U+', ''), 16);
			expect(s.symbol.codePointAt(0)).toBe(declared);
			// Single-codepoint glyphs only — none of these symbols are pairs.
			expect([...s.symbol]).toHaveLength(1);
		}
	});

	it('every symbol has non-empty meaning, common use, and history text', () => {
		for (const s of MATH_SYMBOLS) {
			expect(s.meaning.length).toBeGreaterThan(0);
			expect(s.commonUse.length).toBeGreaterThan(0);
			expect(s.history.length).toBeGreaterThan(0);
		}
	});
});

describe('filterMathSymbols', () => {
	it('returns every symbol for an empty or whitespace-only query', () => {
		expect(filterMathSymbols(MATH_SYMBOLS, '')).toHaveLength(12);
		expect(filterMathSymbols(MATH_SYMBOLS, '   ')).toHaveLength(12);
	});

	it('matches by name, case-insensitively', () => {
		const result = filterMathSymbols(MATH_SYMBOLS, 'INFINITY');
		expect(result.map((s) => s.name)).toEqual(['Infinity']);
	});

	it('matches by exact glyph', () => {
		const result = filterMathSymbols(MATH_SYMBOLS, '√');
		expect(result.map((s) => s.name)).toEqual(['Square Root']);
	});

	it('matches by meaning text', () => {
		const result = filterMathSymbols(MATH_SYMBOLS, 'logical conclusion');
		expect(result.map((s) => s.name)).toEqual(['Therefore']);
	});

	it('matches by common-use text', () => {
		const result = filterMathSymbols(MATH_SYMBOLS, 'quadratic formula');
		const names = result.map((s) => s.name);
		expect(names).toContain('Plus-Minus');
		expect(names).toContain('Square Root');
	});

	it('matches partial, case-insensitive substrings within a word', () => {
		const result = filterMathSymbols(MATH_SYMBOLS, 'squar');
		const names = result.map((s) => s.name);
		expect(names).toContain('Square Root');
		expect(names).toContain('Squared');
	});

	it('returns an empty array for a query that matches nothing', () => {
		expect(filterMathSymbols(MATH_SYMBOLS, 'zzz-no-match-zzz')).toHaveLength(0);
	});

	it('does not mutate the input array', () => {
		const before = [...MATH_SYMBOLS];
		filterMathSymbols(MATH_SYMBOLS, 'infinity');
		expect(MATH_SYMBOLS).toEqual(before);
	});
});
