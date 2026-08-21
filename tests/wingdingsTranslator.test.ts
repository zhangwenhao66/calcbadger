import { describe, it, expect } from 'vitest';
import {
	MAX_INPUT_LENGTH,
	UPPERCASE_LEGEND,
	clampWingdingsInput,
	convertWingdings,
	decodeFontCode,
	lookupSymbol,
	modeLabel,
	textToFontCode,
	textToSymbolPreview,
} from '../src/lib/wingdingsTranslator';

describe('textToFontCode / decodeFontCode', () => {
	it('offsets every printable ASCII character by exactly 0xF000 (Microsoft symbol-font cmap convention)', () => {
		const result = textToFontCode('Hi!');
		const codes = [...result.text].map((c) => c.codePointAt(0));
		expect(codes).toEqual(['H', 'i', '!'].map((c) => 0xf000 + c.charCodeAt(0)));
		expect(result.convertedCount).toBe(3);
		expect(result.unsupportedCount).toBe(0);
	});

	it('round-trips: encode then decode returns the original ASCII text', () => {
		const original = 'CalcBadger 123!? Hello.';
		const encoded = textToFontCode(original);
		const decoded = decodeFontCode(encoded.text);
		expect(decoded.text).toBe(original);
		expect(decoded.unsupportedCount).toBe(0);
	});

	it('leaves characters outside the printable ASCII range unconverted and counts them as unsupported', () => {
		const result = textToFontCode('café 😀');
		const expected =
			String.fromCodePoint(0xf000 + 'c'.charCodeAt(0)) +
			String.fromCodePoint(0xf000 + 'a'.charCodeAt(0)) +
			String.fromCodePoint(0xf000 + 'f'.charCodeAt(0)) +
			'é' +
			String.fromCodePoint(0xf000 + ' '.charCodeAt(0)) +
			'😀';
		expect(result.text).toBe(expected);
		expect(result.convertedCount).toBe(4);
		expect(result.unsupportedCount).toBe(2);
	});

	it('decodeFontCode passes through plain ASCII text unchanged (nothing in the 0xF020-0xF07E range)', () => {
		const result = decodeFontCode('just plain text 123');
		expect(result.text).toBe('just plain text 123');
		expect(result.convertedCount).toBe(0);
		expect(result.unsupportedCount).toBe(result.text.length);
	});

	it('decodeFontCode only decodes the 0xF020-0xF07E band, not other private-use code points', () => {
		const outsideBand = String.fromCodePoint(0xf0a0); // above 0xF07E
		const result = decodeFontCode(outsideBand);
		expect(result.text).toBe(outsideBand);
		expect(result.unsupportedCount).toBe(1);
	});

	it('handles an empty string without throwing', () => {
		expect(textToFontCode('').text).toBe('');
		expect(decodeFontCode('').text).toBe('');
	});
});

describe('textToSymbolPreview', () => {
	it('maps every uppercase A-Z to a distinct, real Unicode code point (case-sensitive — A and a differ)', () => {
		const seen = new Set<string>();
		for (const { char } of UPPERCASE_LEGEND) {
			const glyph = lookupSymbol(char);
			expect(glyph).toBeDefined();
			expect(glyph!.symbol.length).toBeGreaterThan(0);
			seen.add(glyph!.symbol);
		}
		expect(seen.size).toBe(26); // no two letters collide on the same glyph
	});

	it('upper and lower case of the same letter map to different glyphs (Wingdings is code-based, not letter-based)', () => {
		const upper = lookupSymbol('A')!;
		const lower = lookupSymbol('a')!;
		expect(upper.symbol).not.toBe(lower.symbol);
	});

	it('covers the full printable ASCII range 0x20-0x7E with no gaps', () => {
		for (let code = 0x20; code <= 0x7e; code++) {
			const char = String.fromCharCode(code);
			expect(lookupSymbol(char), `missing mapping for ASCII 0x${code.toString(16)} (${char})`).toBeDefined();
		}
	});

	it('leaves an unmapped character (outside ASCII) as-is and counts it unsupported', () => {
		const result = textToSymbolPreview('é');
		expect(result.text).toBe('é');
		expect(result.unsupportedCount).toBe(1);
		expect(result.convertedCount).toBe(0);
	});

	it('converts a full sentence, counting every character', () => {
		const input = 'Hi!';
		const result = textToSymbolPreview(input);
		expect(result.convertedCount).toBe(3);
		expect(result.unsupportedCount).toBe(0);
		expect([...result.text].length).toBe(3);
	});
});

describe('convertWingdings dispatcher', () => {
	it('routes to the matching conversion for each mode', () => {
		expect(convertWingdings('A', 'symbolPreview').text).toBe(textToSymbolPreview('A').text);
		expect(convertWingdings('A', 'fontCode').text).toBe(textToFontCode('A').text);
		expect(convertWingdings('A', 'decode').text).toBe(decodeFontCode('A').text);
	});
});

describe('clampWingdingsInput', () => {
	it('truncates input longer than MAX_INPUT_LENGTH', () => {
		const long = 'x'.repeat(MAX_INPUT_LENGTH + 50);
		expect(clampWingdingsInput(long).length).toBe(MAX_INPUT_LENGTH);
	});

	it('leaves shorter input untouched', () => {
		expect(clampWingdingsInput('short')).toBe('short');
	});
});

describe('modeLabel', () => {
	it('returns a distinct human label for every mode', () => {
		const labels = new Set([modeLabel('symbolPreview'), modeLabel('fontCode'), modeLabel('decode')]);
		expect(labels.size).toBe(3);
	});
});
