import { describe, expect, it } from 'vitest';
import { BASES, convertAll, filterDigitsForBase, formatInBase, MAX_DIGITS, parseInBase, sanitizeForBase } from '../src/lib/numberBase';

// Expected values independently computed in Python (`bin()`, `oct()`, `hex()`,
// `int(x, base)`), not read back from this implementation.

describe('parseInBase / formatInBase — round trips', () => {
	it('binary 11001010 == decimal 202', () => {
		expect(parseInBase('11001010', 'binary')).toBe(202n);
		expect(formatInBase(202n, 'binary')).toBe('11001010');
	});

	it('hex ca == decimal 202', () => {
		expect(parseInBase('ca', 'hex')).toBe(202n);
		expect(formatInBase(202n, 'hex')).toBe('ca');
	});

	it('octal 312 == decimal 202', () => {
		expect(parseInBase('312', 'octal')).toBe(202n);
		expect(formatInBase(202n, 'octal')).toBe('312');
	});

	it('zero in every base is "0"', () => {
		for (const base of BASES) {
			expect(parseInBase('0', base)).toBe(0n);
			expect(formatInBase(0n, base)).toBe('0');
		}
	});

	it('255 (largest byte value): binary 11111111, octal 377, hex ff', () => {
		expect(formatInBase(255n, 'binary')).toBe('11111111');
		expect(formatInBase(255n, 'octal')).toBe('377');
		expect(formatInBase(255n, 'hex')).toBe('ff');
	});

	it('empty string is invalid (returns null), not zero', () => {
		expect(parseInBase('', 'decimal')).toBeNull();
	});
});

describe('convertAll — same integer expressed in all four bases at once', () => {
	it('202 decimal converts to binary/octal/hex matching the worked example', () => {
		const result = convertAll('202', 'decimal');
		expect(result).toEqual({ binary: '11001010', octal: '312', decimal: '202', hex: 'ca' });
	});

	it('4095 decimal -> hex fff, binary 111111111111 (Python: hex(4095), bin(4095))', () => {
		const result = convertAll('4095', 'decimal');
		expect(result?.hex).toBe('fff');
		expect(result?.binary).toBe('111111111111');
		expect(result?.octal).toBe('7777');
	});

	it('starting from hex ca reproduces the same set as starting from decimal 202', () => {
		expect(convertAll('ca', 'hex')).toEqual(convertAll('202', 'decimal'));
	});

	it('a 64-digit binary value converts exactly (BigInt, no float precision loss)', () => {
		const sixtyFourOnes = '1'.repeat(64);
		const result = convertAll(sixtyFourOnes, 'binary');
		// Python: int('1'*64, 2) == 2**64 - 1 == 18446744073709551615
		expect(result?.decimal).toBe('18446744073709551615');
	});

	it('returns null for an empty value', () => {
		expect(convertAll('', 'decimal')).toBeNull();
	});

	it('a 65-digit value (over MAX_DIGITS) is rejected as too long', () => {
		expect(MAX_DIGITS).toBe(64);
		const tooLong = '1'.repeat(65);
		expect(convertAll(tooLong, 'binary')).toBeNull();
	});
});

describe('sanitizeForBase — live input filtering', () => {
	it('binary strips non-0/1 characters', () => {
		expect(sanitizeForBase('1a0b2c1', 'binary')).toBe('101');
	});

	it('octal strips digits 8 and 9 and letters', () => {
		expect(sanitizeForBase('789abc012', 'octal')).toBe('7012');
	});

	it('decimal strips letters', () => {
		expect(sanitizeForBase('12a3b4', 'decimal')).toBe('1234');
	});

	it('hex accepts a-f and digits, strips g and above, and lowercases', () => {
		expect(sanitizeForBase('CAfe123g', 'hex')).toBe('cafe123');
	});

	it('truncates input longer than MAX_DIGITS', () => {
		const long = '1'.repeat(100);
		expect(sanitizeForBase(long, 'binary').length).toBe(MAX_DIGITS);
	});
});

describe('filterDigitsForBase — truncation detection', () => {
	it('does not cap length, unlike sanitizeForBase, so callers can detect a paste got cut', () => {
		const long = '1'.repeat(100);
		expect(filterDigitsForBase(long, 'binary').length).toBe(100);
		expect(filterDigitsForBase(long, 'binary').length > MAX_DIGITS).toBe(true);
	});

	it('a value at exactly MAX_DIGITS is not flagged as truncated', () => {
		const exact = '1'.repeat(MAX_DIGITS);
		expect(filterDigitsForBase(exact, 'binary').length > MAX_DIGITS).toBe(false);
	});
});
