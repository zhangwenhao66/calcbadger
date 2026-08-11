import { describe, expect, it } from 'vitest';
import {
	addFractions,
	decimalStringToFraction,
	divideFractions,
	fractionToDecimal,
	fractionToPercent,
	gcd,
	improperToMixed,
	mixedToImproper,
	multiplyFractions,
	simplifyFraction,
	subtractFractions,
} from '../src/lib/fractions';

/**
 * Expected values are hand-computed from the CCSS.Math.Content.5.NF
 * add/subtract/multiply/divide definitions and the Euclidean algorithm
 * (Euclid, Elements, Book VII, Prop. 2) for GCD — not read off the
 * implementation.
 */
describe('gcd', () => {
	it('gcd(48, 18) = 6', () => {
		expect(gcd(48, 18)).toBe(6);
	});

	it('gcd(0, 5) = 5', () => {
		expect(gcd(0, 5)).toBe(5);
	});

	it('gcd(7, 0) = 7', () => {
		expect(gcd(7, 0)).toBe(7);
	});

	it('gcd(17, 13) = 1 (coprime)', () => {
		expect(gcd(17, 13)).toBe(1);
	});
});

describe('simplifyFraction', () => {
	it('8/12 reduces to 2/3', () => {
		expect(simplifyFraction(8, 12)).toEqual({ numerator: 2, denominator: 3 });
	});

	it('0/5 reduces to 0/1', () => {
		expect(simplifyFraction(0, 5)).toEqual({ numerator: 0, denominator: 1 });
	});

	it('denominator of 0 is undefined -> null', () => {
		expect(simplifyFraction(5, 0)).toBeNull();
	});

	it('-6/8 reduces to -3/4 (denominator already positive)', () => {
		expect(simplifyFraction(-6, 8)).toEqual({ numerator: -3, denominator: 4 });
	});

	it('6/-8 normalizes the sign onto the numerator: -3/4', () => {
		expect(simplifyFraction(6, -8)).toEqual({ numerator: -3, denominator: 4 });
	});

	it('already-simplest fraction is unchanged: 5/7', () => {
		expect(simplifyFraction(5, 7)).toEqual({ numerator: 5, denominator: 7 });
	});

	it('non-finite input (e.g. NaN from a blank form field) is rejected, not looped on', () => {
		expect(simplifyFraction(NaN, 4)).toBeNull();
		expect(simplifyFraction(3, NaN)).toBeNull();
	});
});

describe('addFractions', () => {
	it('1/2 + 1/3 = 5/6', () => {
		expect(addFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 })).toEqual({
			numerator: 5,
			denominator: 6,
		});
	});

	it('CCSS 5.NF.A.1 worked example: 2/3 + 5/4 = 23/12', () => {
		expect(addFractions({ numerator: 2, denominator: 3 }, { numerator: 5, denominator: 4 })).toEqual({
			numerator: 23,
			denominator: 12,
		});
	});

	it('-1/2 + 1/3 = -1/6', () => {
		expect(addFractions({ numerator: -1, denominator: 2 }, { numerator: 1, denominator: 3 })).toEqual({
			numerator: -1,
			denominator: 6,
		});
	});

	it('-1/2 + -1/3 = -5/6 (both negative)', () => {
		expect(addFractions({ numerator: -1, denominator: 2 }, { numerator: -1, denominator: 3 })).toEqual({
			numerator: -5,
			denominator: 6,
		});
	});

	it('a zero denominator is undefined -> null', () => {
		expect(addFractions({ numerator: 1, denominator: 0 }, { numerator: 1, denominator: 2 })).toBeNull();
		expect(addFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 0 })).toBeNull();
	});
});

describe('subtractFractions', () => {
	it('3/4 - 1/6 = 7/12', () => {
		expect(subtractFractions({ numerator: 3, denominator: 4 }, { numerator: 1, denominator: 6 })).toEqual({
			numerator: 7,
			denominator: 12,
		});
	});

	it('-3/4 - 1/6 = -11/12 (negative minuend)', () => {
		expect(subtractFractions({ numerator: -3, denominator: 4 }, { numerator: 1, denominator: 6 })).toEqual({
			numerator: -11,
			denominator: 12,
		});
	});

	it('1/2 - (-1/4) = 3/4 (subtracting a negative)', () => {
		expect(subtractFractions({ numerator: 1, denominator: 2 }, { numerator: -1, denominator: 4 })).toEqual({
			numerator: 3,
			denominator: 4,
		});
	});

	it('a zero denominator is undefined -> null', () => {
		expect(subtractFractions({ numerator: 1, denominator: 0 }, { numerator: 1, denominator: 2 })).toBeNull();
	});
});

describe('multiplyFractions', () => {
	it('2/3 * 3/4 = 1/2 (6/12 simplified)', () => {
		expect(multiplyFractions({ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 4 })).toEqual({
			numerator: 1,
			denominator: 2,
		});
	});

	it('-2/3 * 3/4 = -1/2 (one negative)', () => {
		expect(multiplyFractions({ numerator: -2, denominator: 3 }, { numerator: 3, denominator: 4 })).toEqual({
			numerator: -1,
			denominator: 2,
		});
	});

	it('-2/3 * -3/4 = 1/2 (two negatives cancel)', () => {
		expect(multiplyFractions({ numerator: -2, denominator: 3 }, { numerator: -3, denominator: 4 })).toEqual({
			numerator: 1,
			denominator: 2,
		});
	});

	it('a zero denominator is undefined -> null', () => {
		expect(multiplyFractions({ numerator: 1, denominator: 0 }, { numerator: 1, denominator: 2 })).toBeNull();
	});
});

describe('divideFractions', () => {
	it('1/2 divided by 1/4 = 2/1', () => {
		expect(divideFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 4 })).toEqual({
			numerator: 2,
			denominator: 1,
		});
	});

	it('dividing by a zero-valued fraction is undefined -> null', () => {
		expect(divideFractions({ numerator: 1, denominator: 2 }, { numerator: 0, denominator: 5 })).toBeNull();
	});

	it('-1/2 divided by 1/4 = -2/1 (one negative)', () => {
		expect(divideFractions({ numerator: -1, denominator: 2 }, { numerator: 1, denominator: 4 })).toEqual({
			numerator: -2,
			denominator: 1,
		});
	});

	it('-1/2 divided by -1/4 = 2/1 (two negatives cancel)', () => {
		expect(divideFractions({ numerator: -1, denominator: 2 }, { numerator: -1, denominator: 4 })).toEqual({
			numerator: 2,
			denominator: 1,
		});
	});

	it('a zero denominator on either side is undefined -> null', () => {
		expect(divideFractions({ numerator: 1, denominator: 0 }, { numerator: 1, denominator: 2 })).toBeNull();
		expect(divideFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 0 })).toBeNull();
	});
});

describe('mixedToImproper', () => {
	it('2 3/4 -> 11/4', () => {
		expect(mixedToImproper(2, 3, 4)).toEqual({ numerator: 11, denominator: 4 });
	});

	it('negative mixed number: -2 3/4 -> -11/4', () => {
		expect(mixedToImproper(-2, 3, 4)).toEqual({ numerator: -11, denominator: 4 });
	});

	it('0 5/10 -> 1/2 (simplified)', () => {
		expect(mixedToImproper(0, 5, 10)).toEqual({ numerator: 1, denominator: 2 });
	});
});

describe('improperToMixed', () => {
	it('11/4 -> 2 3/4', () => {
		expect(improperToMixed(11, 4)).toEqual({ whole: 2, numerator: 3, denominator: 4 });
	});

	it('-11/4 -> -2 3/4', () => {
		expect(improperToMixed(-11, 4)).toEqual({ whole: -2, numerator: 3, denominator: 4 });
	});

	it('-3/4 (magnitude under 1) -> whole 0, sign carried on numerator', () => {
		expect(improperToMixed(-3, 4)).toEqual({ whole: 0, numerator: -3, denominator: 4 });
	});

	it('4/4 -> whole number 1', () => {
		expect(improperToMixed(4, 4)).toEqual({ whole: 1, numerator: 0, denominator: 1 });
	});
});

describe('fractionToDecimal / fractionToPercent', () => {
	it('3/4 = 0.75 = 75%', () => {
		expect(fractionToDecimal(3, 4)).toBe(0.75);
		expect(fractionToPercent(3, 4)).toBe(75);
	});

	it('1/3 = 0.3333... (repeating)', () => {
		expect(fractionToDecimal(1, 3)).toBeCloseTo(0.3333333333, 9);
	});

	it('denominator of 0 is undefined -> null', () => {
		expect(fractionToDecimal(5, 0)).toBeNull();
		expect(fractionToPercent(5, 0)).toBeNull();
	});
});

describe('decimalStringToFraction', () => {
	it('"0.75" -> 3/4', () => {
		expect(decimalStringToFraction('0.75')).toEqual({ numerator: 3, denominator: 4 });
	});

	it('"0.125" -> 1/8', () => {
		expect(decimalStringToFraction('0.125')).toEqual({ numerator: 1, denominator: 8 });
	});

	it('"-2.5" -> -5/2', () => {
		expect(decimalStringToFraction('-2.5')).toEqual({ numerator: -5, denominator: 2 });
	});

	it('"5" (whole number) -> 5/1', () => {
		expect(decimalStringToFraction('5')).toEqual({ numerator: 5, denominator: 1 });
	});

	it('non-numeric input -> null', () => {
		expect(decimalStringToFraction('abc')).toBeNull();
	});

	it('trailing dot with no digits -> null', () => {
		expect(decimalStringToFraction('3.')).toBeNull();
	});
});
