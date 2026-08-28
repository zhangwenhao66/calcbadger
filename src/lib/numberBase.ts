/**
 * Number base (radix) conversion: binary, octal, decimal, hexadecimal.
 *
 * These are positional numeral systems — the same integer value written with
 * a different number of symbols per digit (radix 2, 8, 10, or 16). There is
 * no measurement or legal-definition question here (unlike unit conversion):
 * the relationship is pure arithmetic, standardized by how place value works
 * in any base (Wikipedia — "Positional notation"; "Hexadecimal").
 *
 * Uses BigInt rather than Number so a full 64-bit-style value (or larger)
 * round-trips exactly — Number can only represent integers exactly up to
 * 2^53 - 1, and a 64-digit binary input is a routine thing to type into a
 * base converter.
 */

export type NumBase = 'binary' | 'octal' | 'decimal' | 'hex';

export const BASES: NumBase[] = ['binary', 'octal', 'decimal', 'hex'];

export const RADIX: Record<NumBase, number> = {
	binary: 2,
	octal: 8,
	decimal: 10,
	hex: 16,
};

const DIGIT_CHARSET: Record<NumBase, string> = {
	binary: '01',
	octal: '01234567',
	decimal: '0123456789',
	hex: '0123456789abcdef',
};

/**
 * Caps input length rather than magnitude — BigInt itself has no practical
 * size limit, but an unbounded string would let a pasted wall of digits
 * freeze the tab on `parseInBase`'s per-character loop. 64 digits covers
 * every realistic use (a 64-bit binary value is 64 digits; the equivalent
 * hex is only 16) with headroom to spare.
 */
export const MAX_DIGITS = 64;

/**
 * Strips characters that aren't valid digits in the given base, without
 * capping length — split out from `sanitizeForBase` so callers can tell
 * whether a paste got truncated (compare this output's length to MAX_DIGITS)
 * instead of that information disappearing silently into a `.slice()`.
 * Hex letters are case-folded to lowercase so "CA", "ca", and "Ca" all land
 * on the same input value.
 */
export function filterDigitsForBase(raw: string, base: NumBase): string {
	const charset = DIGIT_CHARSET[base];
	let out = '';
	for (const ch of raw.toLowerCase()) {
		if (charset.includes(ch)) out += ch;
	}
	return out;
}

/**
 * Live-filters and caps input as the user types, the same approach as the
 * site's other free-text tools (e.g. the Wingdings translator's input
 * clamp) rather than rejecting the whole field on one bad character.
 */
export function sanitizeForBase(raw: string, base: NumBase): string {
	return filterDigitsForBase(raw, base).slice(0, MAX_DIGITS);
}

/** Parses an already-sanitized digit string in the given base to a BigInt, or null if empty. */
export function parseInBase(value: string, base: NumBase): bigint | null {
	if (!value || value.length > MAX_DIGITS) return null;
	const charset = DIGIT_CHARSET[base];
	const radix = BigInt(RADIX[base]);
	let acc = 0n;
	for (const ch of value) {
		const digit = charset.indexOf(ch);
		if (digit === -1) return null; // defensive: sanitizeForBase should already guarantee this
		acc = acc * radix + BigInt(digit);
	}
	return acc;
}

/** Formats a non-negative BigInt as a digit string in the given base (hex digits lowercase). */
export function formatInBase(n: bigint, base: NumBase): string {
	return n.toString(RADIX[base]);
}

/** Converts a validated digit string in one base to all four bases at once. */
export function convertAll(value: string, from: NumBase): Record<NumBase, string> | null {
	const n = parseInBase(value, from);
	if (n === null) return null;
	const result = {} as Record<NumBase, string>;
	for (const base of BASES) result[base] = formatInBase(n, base);
	return result;
}
