import { describe, expect, it } from 'vitest';
import {
	DEFAULT_PRACTICE_TEXT,
	LOWERCASE_LETTERS,
	sanitizePracticeText,
	UPPERCASE_LETTERS,
} from '../src/lib/graffitiText';

describe('sanitizePracticeText', () => {
	it('keeps plain letters and spaces untouched', () => {
		expect(sanitizePracticeText('Hello World')).toBe('Hello World');
	});

	it('keeps digits and exclamation marks for tag-style text', () => {
		expect(sanitizePracticeText('OI 183!')).toBe('OI 183!');
	});

	it('strips punctuation and symbols outside the allowed set', () => {
		expect(sanitizePracticeText("Graffiti's #1 @tag")).toBe('Graffitis 1 tag');
	});

	it('collapses repeated whitespace to single spaces', () => {
		expect(sanitizePracticeText('Too   many    spaces')).toBe('Too many spaces');
	});

	it('truncates to 18 characters', () => {
		const long = 'abcdefghijklmnopqrstuvwxyz';
		const result = sanitizePracticeText(long);
		expect(result.length).toBe(18);
		expect(result).toBe('abcdefghijklmnopqr');
	});

	it('returns an empty string for input with no allowed characters', () => {
		expect(sanitizePracticeText('#@$%^&*')).toBe('');
	});

	it('trims leading and trailing whitespace left over after stripping symbols', () => {
		expect(sanitizePracticeText('  Wild-Style #Crew!! ')).toBe('WildStyle Crew!!');
	});
});

describe('alphabet constants', () => {
	it('UPPERCASE_LETTERS is A through Z in order', () => {
		expect(UPPERCASE_LETTERS).toHaveLength(26);
		expect(UPPERCASE_LETTERS[0]).toBe('A');
		expect(UPPERCASE_LETTERS[25]).toBe('Z');
		expect(UPPERCASE_LETTERS.join('')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	});

	it('LOWERCASE_LETTERS is a through z in order', () => {
		expect(LOWERCASE_LETTERS).toHaveLength(26);
		expect(LOWERCASE_LETTERS[0]).toBe('a');
		expect(LOWERCASE_LETTERS[25]).toBe('z');
		expect(LOWERCASE_LETTERS.join('')).toBe('abcdefghijklmnopqrstuvwxyz');
	});
});

describe('DEFAULT_PRACTICE_TEXT', () => {
	it('is itself valid practice text (sanitizing it is a no-op)', () => {
		expect(sanitizePracticeText(DEFAULT_PRACTICE_TEXT)).toBe(DEFAULT_PRACTICE_TEXT);
	});
});
