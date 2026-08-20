import { describe, expect, it } from 'vitest';
import { parseDecimalString, roundToPlaceValue, roundToSignificantFigures, toExponentialForm, type RoundingMethod } from '../src/lib/rounding';

/**
 * Expected values for the tie table (2.5/-2.5/3.5/-3.5 at placeExponent 0)
 * are hand-derived directly from Wikipedia's "Rounding" article definitions
 * (Directed rounding to an integer / Rounding to the nearest integer
 * sections, 2026-08-20 revision) before the implementation existed:
 * half-up = ties toward +Infinity, half-down = ties toward -Infinity,
 * half-away-from-zero = ties away from zero both signs, half-to-even =
 * ties to whichever candidate is even, ceiling/floor/truncate as the
 * article's directed-rounding formulas. Cross-checked against Python's
 * built-in `round()` (half-to-even) and `math.floor`/`math.ceil`/`math.trunc`
 * for the applicable rows.
 */
describe('roundToPlaceValue — exact-tie table at whole-number precision', () => {
	const cases: Array<[string, RoundingMethod, string]> = [
		['2.5', 'half-up', '3'],
		['-2.5', 'half-up', '-2'],
		['3.5', 'half-up', '4'],
		['-3.5', 'half-up', '-3'],

		['2.5', 'half-down', '2'],
		['-2.5', 'half-down', '-3'],
		['3.5', 'half-down', '3'],
		['-3.5', 'half-down', '-4'],

		['2.5', 'half-away-from-zero', '3'],
		['-2.5', 'half-away-from-zero', '-3'],
		['3.5', 'half-away-from-zero', '4'],
		['-3.5', 'half-away-from-zero', '-4'],

		['2.5', 'half-to-even', '2'],
		['-2.5', 'half-to-even', '-2'],
		['3.5', 'half-to-even', '4'],
		['-3.5', 'half-to-even', '-4'],

		['2.5', 'ceiling', '3'],
		['-2.5', 'ceiling', '-2'],
		['3.5', 'ceiling', '4'],
		['-3.5', 'ceiling', '-3'],
		['2.5', 'floor', '2'],
		['-2.5', 'floor', '-3'],
		['3.5', 'floor', '3'],
		['-3.5', 'floor', '-4'],
		['2.5', 'truncate', '2'],
		['-2.5', 'truncate', '-2'],
		['3.5', 'truncate', '3'],
		['-3.5', 'truncate', '-3'],
	];

	it.each(cases)('%s rounded by %s -> %s', (input, method, expected) => {
		const result = roundToPlaceValue(input, 0, method);
		expect(result).not.toBeNull();
		expect(result!.formatted).toBe(expected);
		expect(result!.wasExactTie).toBe(true);
	});
});

describe('roundToPlaceValue — non-tie directed rounding (no ambiguity, from the article\'s worked examples)', () => {
	it('23.7 floors to 23, -23.2 floors to -24 (Wikipedia worked example)', () => {
		expect(roundToPlaceValue('23.7', 0, 'floor')!.formatted).toBe('23');
		expect(roundToPlaceValue('-23.2', 0, 'floor')!.formatted).toBe('-24');
	});

	it('23.2 ceils to 24, -23.7 ceils to -23 (Wikipedia worked example)', () => {
		expect(roundToPlaceValue('23.2', 0, 'ceiling')!.formatted).toBe('24');
		expect(roundToPlaceValue('-23.7', 0, 'ceiling')!.formatted).toBe('-23');
	});

	it('23.7 truncates to 23, -23.7 truncates to -23 (toward zero both signs)', () => {
		expect(roundToPlaceValue('23.7', 0, 'truncate')!.formatted).toBe('23');
		expect(roundToPlaceValue('-23.7', 0, 'truncate')!.formatted).toBe('-23');
	});

	it('non-tie nearest rounding is direction-agnostic across all half-* methods', () => {
		for (const method of ['half-up', 'half-down', 'half-away-from-zero', 'half-to-even'] as RoundingMethod[]) {
			expect(roundToPlaceValue('2.3', 0, method)!.formatted).toBe('2');
			expect(roundToPlaceValue('2.7', 0, method)!.formatted).toBe('3');
			expect(roundToPlaceValue('-2.3', 0, method)!.formatted).toBe('-2');
			expect(roundToPlaceValue('-2.7', 0, method)!.formatted).toBe('-3');
		}
	});
});

describe('roundToPlaceValue — decimal places and coarser place values', () => {
	it('rounds to nearest hundredth (placeExponent -2)', () => {
		expect(roundToPlaceValue('3.14159', -2, 'half-up')!.formatted).toBe('3.14');
		expect(roundToPlaceValue('3.145', -2, 'half-up')!.formatted).toBe('3.15');
	});

	it('rounds to nearest ten and hundred (placeExponent 1, 2)', () => {
		expect(roundToPlaceValue('247', 1, 'half-up')!.formatted).toBe('250');
		expect(roundToPlaceValue('247', 2, 'half-up')!.formatted).toBe('200');
		expect(roundToPlaceValue('4', 1, 'half-up')!.formatted).toBe('0');
	});

	it('the classic float-precision trap: 1.005 to 2 decimal places rounds UP to 1.01, not down to 1.00', () => {
		// Verifies the module works from exact decimal digits: the IEEE 754
		// double nearest to 1.005 is ~1.00499999999999989, which is why
		// `Math.round(1.005 * 100) / 100` gives 1.00 in JS. This module never
		// converts through that binary float, so it gets 1.01, matching what
		// the decimal digits "1.005" actually say.
		expect(roundToPlaceValue('1.005', -2, 'half-up')!.formatted).toBe('1.01');
		expect(roundToPlaceValue('1.005', -2, 'half-away-from-zero')!.formatted).toBe('1.01');
	});

	it('input already at or finer than the requested place value is returned unchanged, not padded', () => {
		const result = roundToPlaceValue('12', -3, 'half-up');
		expect(result!.formatted).toBe('12');
		expect(result!.placeExponent).toBe(0);
	});

	it('0 rounds to 0 with no sign; a bare "0" with no decimals given is not padded with false precision', () => {
		expect(roundToPlaceValue('0', -2, 'half-up')!.formatted).toBe('0');
		expect(roundToPlaceValue('0.000', -2, 'half-up')!.formatted).toBe('0.00');
		expect(roundToPlaceValue('-0.001', 0, 'half-up')!.formatted).toBe('0');
	});

	it('rejects non-numeric input', () => {
		expect(roundToPlaceValue('abc', 0, 'half-up')).toBeNull();
		expect(roundToPlaceValue('', 0, 'half-up')).toBeNull();
		expect(roundToPlaceValue('-', 0, 'half-up')).toBeNull();
	});
});

/**
 * Significant-figures expected values hand-computed independently (leading
 * digit's power of ten, then apply the same place-value rounding already
 * verified above): 0.0034567 = 3.4567 x 10^-3, so 2 sig figs means rounding
 * to the hundred-thousandths place... i.e. placeExponent = -3 - (2-1) = -4,
 * giving 0.0035. 995 -> 2 sig figs crosses a power-of-ten boundary to 1000.
 */
describe('roundToSignificantFigures', () => {
	it('0.0034567 to 2 sig figs -> 0.0035', () => {
		expect(roundToSignificantFigures('0.0034567', 2, 'half-up')!.formatted).toBe('0.0035');
	});

	it('123.45 to 3 sig figs -> 123, to 2 sig figs -> 120', () => {
		expect(roundToSignificantFigures('123.45', 3, 'half-up')!.formatted).toBe('123');
		expect(roundToSignificantFigures('123.45', 2, 'half-up')!.formatted).toBe('120');
	});

	it('995 to 2 sig figs carries across a power of ten -> 1000', () => {
		expect(roundToSignificantFigures('995', 2, 'half-up')!.formatted).toBe('1000');
	});

	it('leading zeros do not count as significant: 0.000456 to 1 sig fig -> 0.0005', () => {
		expect(roundToSignificantFigures('0.000456', 1, 'half-up')!.formatted).toBe('0.0005');
	});

	it('0 to any sig figs is 0', () => {
		expect(roundToSignificantFigures('0', 4, 'half-up')!.formatted).toBe('0');
	});
});

describe('toExponentialForm', () => {
	it('995 rounded to 2 sig figs (1000) displays as 1.0 x 10^3, preserving the 2-sig-fig count', () => {
		const result = roundToSignificantFigures('995', 2, 'half-up')!;
		expect(toExponentialForm(result, 2)).toBe('1.0 × 10^3');
	});

	it('0.0035 (2 sig figs) displays as 3.5 x 10^-3', () => {
		const result = roundToSignificantFigures('0.0034567', 2, 'half-up')!;
		expect(toExponentialForm(result, 2)).toBe('3.5 × 10^-3');
	});

	it('a negative result keeps its sign: -123 (2 sig figs from -123.45) displays as -1.2 x 10^2', () => {
		const result = roundToSignificantFigures('-123.45', 2, 'half-up')!;
		expect(toExponentialForm(result, 2)).toBe('-1.2 × 10^2');
	});
});

/**
 * Mirrors the "Decimal places vs. significant figures" reference table
 * published on the tool page (src/data/tools.ts) — kept as its own test so
 * the page content and the code can never silently drift apart.
 */
describe('published reference table: decimal places vs. significant figures', () => {
	it('3.14159 -> 3.14 (2 decimal places), 3.1 (2 sig figs)', () => {
		expect(roundToPlaceValue('3.14159', -2, 'half-up')!.formatted).toBe('3.14');
		expect(roundToSignificantFigures('3.14159', 2, 'half-up')!.formatted).toBe('3.1');
	});

	it('0.0034567 -> 0.00 (2 decimal places), 0.0035 (2 sig figs)', () => {
		expect(roundToPlaceValue('0.0034567', -2, 'half-up')!.formatted).toBe('0.00');
		expect(roundToSignificantFigures('0.0034567', 2, 'half-up')!.formatted).toBe('0.0035');
	});

	it('123.45 -> unchanged at 2 decimal places (already that precise), 120 (2 sig figs)', () => {
		expect(roundToPlaceValue('123.45', -2, 'half-up')!.formatted).toBe('123.45');
		expect(roundToSignificantFigures('123.45', 2, 'half-up')!.formatted).toBe('120');
	});

	it('995 -> unchanged at 2 decimal places (already coarser), 1000 (2 sig figs)', () => {
		expect(roundToPlaceValue('995', -2, 'half-up')!.formatted).toBe('995');
		expect(roundToSignificantFigures('995', 2, 'half-up')!.formatted).toBe('1000');
	});
});

describe('parseDecimalString', () => {
	it('accepts plain integers, decimals, and signed values', () => {
		expect(parseDecimalString('42')).toEqual({ negative: false, digits: 42n, scale: 0 });
		expect(parseDecimalString('-3.14')).toEqual({ negative: true, digits: 314n, scale: 2 });
		expect(parseDecimalString('+7')).toEqual({ negative: false, digits: 7n, scale: 0 });
	});

	it('rejects scientific notation and non-numeric strings (unsupported input, not silently mishandled)', () => {
		expect(parseDecimalString('1e5')).toBeNull();
		expect(parseDecimalString('NaN')).toBeNull();
		expect(parseDecimalString('12.3.4')).toBeNull();
	});
});
