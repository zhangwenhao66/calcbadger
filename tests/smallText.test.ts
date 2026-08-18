import { describe, it, expect } from 'vitest';
import {
	convertSmallText,
	clampSmallTextInput,
	styleLabel,
	styleCoverage,
	MAX_INPUT_LENGTH,
	STYLES,
} from '../src/lib/smallText';

describe('convertSmallText - superscript', () => {
	it('converts a known word to its exact Unicode superscript form', () => {
		// Expected string built from Unicode Character Database names:
		// MODIFIER LETTER SMALL H/E/L/L/O -> ʰᵉˡˡᵒ
		const result = convertSmallText('hello', 'superscript');
		expect(result.text).toBe('ʰᵉˡˡᵒ');
		expect(result.convertedCount).toBe(5);
		expect(result.unsupportedCount).toBe(0);
	});

	it('has no dedicated glyph for "q" and falls back to the plain letter', () => {
		const result = convertSmallText('q', 'superscript');
		expect(result.text).toBe('q');
		expect(result.convertedCount).toBe(0);
		expect(result.unsupportedCount).toBe(1);
	});

	it('normalizes uppercase letters to the same small-form glyph as lowercase', () => {
		const upper = convertSmallText('HELLO', 'superscript');
		const lower = convertSmallText('hello', 'superscript');
		expect(upper.text).toBe(lower.text);
	});

	it('converts digits to the dedicated superscript digit block', () => {
		// SUPERSCRIPT ONE/TWO/THREE come from Latin-1 (U+00B9/B2/B3); the rest
		// from U+2074-2079.
		expect(convertSmallText('0123456789', 'superscript').text).toBe('⁰¹²³⁴⁵⁶⁷⁸⁹');
	});

	it('converts + - = ( ) to their superscript symbol forms', () => {
		expect(convertSmallText('+-=()', 'superscript').text).toBe('⁺⁻⁼⁽⁾');
	});

	it('leaves spaces and unmapped punctuation untouched', () => {
		const result = convertSmallText('a b!', 'superscript');
		expect(result.text).toBe('ᵃ ᵇ!');
	});

	it('every letter a-z except q converts to a distinct single code point', () => {
		const letters = 'abcdefghijklmnopqrstuvwxyz';
		const seen = new Set<string>();
		let unsupported = 0;
		for (const letter of letters) {
			const { text, unsupportedCount } = convertSmallText(letter, 'superscript');
			if (unsupportedCount > 0) {
				unsupported++;
				expect(text).toBe(letter);
			} else {
				expect([...text].length).toBe(1);
				expect(seen.has(text)).toBe(false);
				seen.add(text);
			}
		}
		expect(unsupported).toBe(1);
		expect(seen.size).toBe(25);
	});
});

describe('convertSmallText - smallCaps', () => {
	it('converts a known lowercase word to its exact small caps form', () => {
		// LATIN LETTER SMALL CAPITAL H/E/L/L/O -> ʜᴇʟʟᴏ
		const result = convertSmallText('hello', 'smallCaps');
		expect(result.text).toBe('ʜᴇʟʟᴏ');
		expect(result.convertedCount).toBe(5);
		expect(result.unsupportedCount).toBe(0);
	});

	it('has no dedicated glyph for lowercase "x" and falls back to the plain letter', () => {
		const result = convertSmallText('x', 'smallCaps');
		expect(result.text).toBe('x');
		expect(result.convertedCount).toBe(0);
		expect(result.unsupportedCount).toBe(1);
	});

	it('leaves already-uppercase letters unchanged, including X', () => {
		const result = convertSmallText('HELLO X', 'smallCaps');
		expect(result.text).toBe('HELLO X');
		expect(result.convertedCount).toBe(0);
		expect(result.unsupportedCount).toBe(0);
	});

	it('mixed case: lowercase converts, uppercase passes through', () => {
		// "AbC" -> "A" stays, "b" -> small-cap b (ʙ), "C" stays
		const result = convertSmallText('AbC', 'smallCaps');
		expect(result.text).toBe('AʙC');
	});

	it('leaves digits unchanged (no Unicode small-caps digit forms exist)', () => {
		const result = convertSmallText('abc123', 'smallCaps');
		expect(result.text).toBe('ᴀʙᴄ123');
	});

	it('every lowercase letter a-z except x converts to a distinct single code point', () => {
		const letters = 'abcdefghijklmnopqrstuvwxyz';
		const seen = new Set<string>();
		let unsupported = 0;
		for (const letter of letters) {
			const { text, unsupportedCount } = convertSmallText(letter, 'smallCaps');
			if (unsupportedCount > 0) {
				unsupported++;
				expect(text).toBe(letter);
			} else {
				expect([...text].length).toBe(1);
				expect(seen.has(text)).toBe(false);
				seen.add(text);
			}
		}
		expect(unsupported).toBe(1);
		expect(seen.size).toBe(25);
	});
});

describe('convertSmallText - subscript', () => {
	it('converts letters that have a real Unicode subscript form', () => {
		// LATIN SUBSCRIPT SMALL LETTER I/N -> ᵢₙ
		const result = convertSmallText('in', 'subscript');
		expect(result.text).toBe('ᵢₙ');
		expect(result.convertedCount).toBe(2);
		expect(result.unsupportedCount).toBe(0);
	});

	it('falls back for the 9 letters with no subscript form (b c d f g q w y z)', () => {
		const result = convertSmallText('bcdfgqwyz', 'subscript');
		expect(result.text).toBe('bcdfgqwyz');
		expect(result.convertedCount).toBe(0);
		expect(result.unsupportedCount).toBe(9);
	});

	it('normalizes case (subscript has no separate capital forms)', () => {
		const upper = convertSmallText('IN', 'subscript');
		const lower = convertSmallText('in', 'subscript');
		expect(upper.text).toBe(lower.text);
	});

	it('converts digits to the dedicated subscript digit block', () => {
		expect(convertSmallText('0123456789', 'subscript').text).toBe('₀₁₂₃₄₅₆₇₈₉');
	});

	it('converts + - = ( ) to their subscript symbol forms', () => {
		expect(convertSmallText('+-=()', 'subscript').text).toBe('₊₋₌₍₎');
	});

	it('has exactly 17 of 26 letters with a true subscript form', () => {
		const letters = 'abcdefghijklmnopqrstuvwxyz';
		let supported = 0;
		let unsupported = 0;
		for (const letter of letters) {
			const { unsupportedCount } = convertSmallText(letter, 'subscript');
			if (unsupportedCount > 0) unsupported++;
			else supported++;
		}
		expect(supported).toBe(17);
		expect(unsupported).toBe(9);
	});
});

describe('clampSmallTextInput', () => {
	it('truncates to MAX_INPUT_LENGTH', () => {
		const long = 'x'.repeat(MAX_INPUT_LENGTH + 50);
		expect(clampSmallTextInput(long).length).toBe(MAX_INPUT_LENGTH);
	});

	it('leaves short input untouched', () => {
		expect(clampSmallTextInput('hi')).toBe('hi');
	});
});

describe('styleLabel / styleCoverage / STYLES', () => {
	it('has a label and coverage string for every style', () => {
		for (const style of STYLES) {
			expect(styleLabel(style).length).toBeGreaterThan(0);
			expect(styleCoverage(style).length).toBeGreaterThan(0);
		}
	});

	it('lists exactly the three supported styles', () => {
		expect(STYLES).toEqual(['superscript', 'smallCaps', 'subscript']);
	});
});
