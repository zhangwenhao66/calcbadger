import { describe, expect, it } from 'vitest';
import {
	CALLIGRAPHY_STYLES,
	DEFAULT_PRACTICE_TEXT,
	LOWERCASE_LETTERS,
	getCalligraphyStyle,
	sanitizePracticeText,
	UPPERCASE_LETTERS,
} from '../src/lib/calligraphyAlphabet';

describe('sanitizePracticeText', () => {
	it('keeps plain letters and spaces untouched', () => {
		expect(sanitizePracticeText('Hello World')).toBe('Hello World');
	});

	it('keeps apostrophes and hyphens for names like names', () => {
		expect(sanitizePracticeText("O'Brien")).toBe("O'Brien");
		expect(sanitizePracticeText('Anne-Marie')).toBe('Anne-Marie');
	});

	it('strips digits and symbols', () => {
		expect(sanitizePracticeText('Calligraphy123!@#')).toBe('Calligraphy');
	});

	it('collapses repeated whitespace to single spaces', () => {
		expect(sanitizePracticeText('Too   many    spaces')).toBe('Too many spaces');
	});

	it('truncates to 24 characters', () => {
		const long = 'abcdefghijklmnopqrstuvwxyz';
		const result = sanitizePracticeText(long);
		expect(result.length).toBe(24);
		expect(result).toBe('abcdefghijklmnopqrstuvwx');
	});

	it('returns an empty string for input with no allowed characters', () => {
		expect(sanitizePracticeText('123456')).toBe('');
	});

	it('trims leading and trailing whitespace left over after stripping digits/symbols', () => {
		expect(sanitizePracticeText("  Mary-Jane O'Neil!! 123  ")).toBe("Mary-Jane O'Neil");
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

describe('CALLIGRAPHY_STYLES', () => {
	it('has exactly three styles', () => {
		expect(CALLIGRAPHY_STYLES).toHaveLength(3);
	});

	it('has unique keys', () => {
		const keys = CALLIGRAPHY_STYLES.map((s) => s.key);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it('has unique font families (three genuinely different fonts, not one font relabeled)', () => {
		const families = CALLIGRAPHY_STYLES.map((s) => s.fontFamily);
		expect(new Set(families).size).toBe(families.length);
	});

	it('has unique font classes', () => {
		const classes = CALLIGRAPHY_STYLES.map((s) => s.fontClass);
		expect(new Set(classes).size).toBe(classes.length);
	});

	it('every style has a non-empty label and shortLabel', () => {
		for (const style of CALLIGRAPHY_STYLES) {
			expect(style.label.length).toBeGreaterThan(0);
			expect(style.shortLabel.length).toBeGreaterThan(0);
		}
	});

	it('shortLabel is never longer than label (it exists to save space)', () => {
		for (const style of CALLIGRAPHY_STYLES) {
			expect(style.shortLabel.length).toBeLessThanOrEqual(style.label.length);
		}
	});
});

describe('getCalligraphyStyle', () => {
	it('returns the matching style by key', () => {
		expect(getCalligraphyStyle('chancery').label).toBe('Chancery Italic');
		expect(getCalligraphyStyle('brush').label).toBe('Modern Brush');
		expect(getCalligraphyStyle('blackletter').label).toBe('Blackletter');
	});

	it('falls back to the first style for an unknown key', () => {
		expect(getCalligraphyStyle('nonsense')).toBe(CALLIGRAPHY_STYLES[0]);
	});
});
