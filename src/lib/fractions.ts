/**
 * Fraction arithmetic: add/subtract/multiply/divide, simplification, and
 * conversion between mixed numbers, improper fractions, decimals, and
 * percentages.
 *
 * Addition and multiplication of fractions (including mixed numbers) follow
 * the definitions in the Common Core State Standards for Mathematics, Grade
 * 5 Number & Operations-Fractions domain (CCSS.Math.Content.5.NF.A.1,
 * 5.NF.B.4), e.g. a/b + c/d = (a*d + c*b) / (b*d), found by converting to a
 * common denominator. General fraction-by-fraction division (5.NF.B.7 only
 * covers dividing by/into a unit fraction) follows CCSS.Math.Content.6.NS.A.1,
 * which extends the reciprocal rule to any fraction divided by any fraction.
 * Simplification reduces a fraction to lowest terms by dividing both terms
 * by their greatest common divisor, computed with the Euclidean algorithm
 * (Euclid, *Elements*, Book VII, Proposition 2).
 */

export interface Fraction {
	numerator: number;
	denominator: number;
}

export interface MixedNumber {
	whole: number;
	numerator: number;
	denominator: number;
}

/** Euclidean algorithm (Euclid, Elements, Book VII, Prop. 2). Always returns a non-negative integer. */
export function gcd(a: number, b: number): number {
	a = Math.abs(Math.round(a));
	b = Math.abs(Math.round(b));
	while (b !== 0) {
		[a, b] = [b, a % b];
	}
	return a;
}

/** Reduces a fraction to lowest terms with a positive denominator. Null if denominator is 0 or either term isn't a finite number (e.g. a blank/partial form field). */
export function simplifyFraction(numerator: number, denominator: number): Fraction | null {
	if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
	if (denominator === 0) return null;
	if (numerator === 0) return { numerator: 0, denominator: 1 };
	const sign = denominator < 0 ? -1 : 1;
	const n = numerator * sign;
	const d = denominator * sign;
	const divisor = gcd(n, d);
	return { numerator: n / divisor, denominator: d / divisor };
}

export function addFractions(a: Fraction, b: Fraction): Fraction | null {
	if (a.denominator === 0 || b.denominator === 0) return null;
	return simplifyFraction(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
}

export function subtractFractions(a: Fraction, b: Fraction): Fraction | null {
	if (a.denominator === 0 || b.denominator === 0) return null;
	return simplifyFraction(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
}

export function multiplyFractions(a: Fraction, b: Fraction): Fraction | null {
	if (a.denominator === 0 || b.denominator === 0) return null;
	return simplifyFraction(a.numerator * b.numerator, a.denominator * b.denominator);
}

/** Dividing by a zero-valued fraction (numerator 0) is undefined -> null. */
export function divideFractions(a: Fraction, b: Fraction): Fraction | null {
	if (a.denominator === 0 || b.denominator === 0 || b.numerator === 0) return null;
	return simplifyFraction(a.numerator * b.denominator, a.denominator * b.numerator);
}

/** whole 2, num 3, denom 4 ("2 3/4") -> 11/4. Sign of `whole` governs the result; a negative whole with a positive numerator is still "negative and a bit more" (-2 3/4 = -11/4), matching how mixed numbers are read aloud. */
export function mixedToImproper(whole: number, numerator: number, denominator: number): Fraction | null {
	if (denominator === 0) return null;
	const sign = whole < 0 ? -1 : 1;
	const improperNumerator = Math.abs(whole) * denominator + numerator;
	return simplifyFraction(sign * improperNumerator, denominator);
}

/** 11/4 -> {whole: 2, numerator: 3, denominator: 4} ("2 3/4"). For |value| < 1 (e.g. -3/4), whole is 0 and the sign is carried on numerator. */
export function improperToMixed(numerator: number, denominator: number): MixedNumber | null {
	const simplified = simplifyFraction(numerator, denominator);
	if (!simplified) return null;
	const sign = simplified.numerator < 0 ? -1 : 1;
	const absNumerator = Math.abs(simplified.numerator);
	const wholePart = Math.floor(absNumerator / simplified.denominator);
	const remainder = absNumerator % simplified.denominator;
	// Avoid `-0` when wholePart is 0 (e.g. -3/4 has no whole part; the sign
	// lives on the remaining numerator instead).
	const whole = wholePart === 0 ? 0 : sign * wholePart;
	return {
		whole,
		numerator: whole === 0 ? sign * remainder : remainder,
		denominator: simplified.denominator,
	};
}

export function fractionToDecimal(numerator: number, denominator: number): number | null {
	if (denominator === 0) return null;
	return numerator / denominator;
}

export function fractionToPercent(numerator: number, denominator: number): number | null {
	const decimal = fractionToDecimal(numerator, denominator);
	return decimal === null ? null : decimal * 100;
}

/**
 * Converts a decimal typed as text (e.g. "0.75", "-2.5") to an exact
 * fraction by counting digits after the decimal point, so 0.1 becomes
 * exactly 1/10 rather than a binary-float approximation. Returns null for
 * anything that isn't a plain decimal number.
 */
export function decimalStringToFraction(input: string): Fraction | null {
	const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(input.trim());
	if (!match) return null;
	const sign = match[1] ? -1 : 1;
	const wholeDigits = match[2]!;
	const fractionDigits = match[3] ?? '';
	const denominator = 10 ** fractionDigits.length;
	const numerator = sign * parseInt(wholeDigits + fractionDigits, 10);
	return simplifyFraction(numerator, denominator);
}
