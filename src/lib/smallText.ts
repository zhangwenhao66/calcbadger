/**
 * Convert plain text into three genuinely distinct "tiny text" Unicode
 * styles: superscript, small caps, and subscript. Every mapping below is a
 * real, individually-named code point from the Unicode Character Database
 * (source: https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt),
 * not a custom font or an image — the output copies and pastes as plain
 * text anywhere Unicode is supported.
 *
 * None of the three styles has a complete a-z coverage in Unicode:
 * - superscript is missing a dedicated glyph for "q" (25 of 26)
 * - small caps is missing a dedicated glyph for "x" (25 of 26)
 * - subscript only has letters that see real use in math/chemistry
 *   notation — b, c, d, f, g, q, w, y, z have no subscript form at all
 *   (17 of 26)
 * Unmapped letters fall back to the original character rather than being
 * dropped, and the gap is surfaced to the caller via `unsupportedCount`
 * instead of being silently hidden.
 */

export type SmallTextStyle = 'superscript' | 'smallCaps' | 'subscript';

export const STYLES: readonly SmallTextStyle[] = ['superscript', 'smallCaps', 'subscript'];

export const MAX_INPUT_LENGTH = 300;

export function clampSmallTextInput(text: string): string {
	return text.slice(0, MAX_INPUT_LENGTH);
}

// Superscript lowercase letters. Every letter but "q" has a dedicated
// Unicode code point; capital input is normalized to these same small-form
// glyphs rather than a separate capital-height table, because Unicode's
// capital superscript letters (U+1D2C block) have far more gaps (only 18
// of 26 exist) than the lowercase small-form set used here.
const SUPERSCRIPT_LETTERS: Readonly<Record<string, string>> = {
	a: 'ᵃ',
	b: 'ᵇ',
	c: 'ᶜ',
	d: 'ᵈ',
	e: 'ᵉ',
	f: 'ᶠ',
	g: 'ᵍ',
	h: 'ʰ',
	i: 'ⁱ',
	j: 'ʲ',
	k: 'ᵏ',
	l: 'ˡ',
	m: 'ᵐ',
	n: 'ⁿ',
	o: 'ᵒ',
	p: 'ᵖ',
	r: 'ʳ',
	s: 'ˢ',
	t: 'ᵗ',
	u: 'ᵘ',
	v: 'ᵛ',
	w: 'ʷ',
	x: 'ˣ',
	y: 'ʸ',
	z: 'ᶻ',
};

const SUPERSCRIPT_DIGITS: Readonly<Record<string, string>> = {
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹',
};

const SUPERSCRIPT_SYMBOLS: Readonly<Record<string, string>> = {
	'+': '⁺',
	'-': '⁻',
	'=': '⁼',
	'(': '⁽',
	')': '⁾',
};

// Small capitals. Lowercase input maps to a reduced-size capital glyph, the
// same convention word processors use for a "small caps" text style;
// uppercase input is left as-is, since it is already a full-size capital
// and standard small-caps typography doesn't shrink letters that were
// already capitalized.
const SMALL_CAPS_LETTERS: Readonly<Record<string, string>> = {
	a: 'ᴀ',
	b: 'ʙ',
	c: 'ᴄ',
	d: 'ᴅ',
	e: 'ᴇ',
	f: 'ꜰ',
	g: 'ɢ',
	h: 'ʜ',
	i: 'ɪ',
	j: 'ᴊ',
	k: 'ᴋ',
	l: 'ʟ',
	m: 'ᴍ',
	n: 'ɴ',
	o: 'ᴏ',
	p: 'ᴘ',
	q: 'ꞯ',
	r: 'ʀ',
	s: 'ꜱ',
	t: 'ᴛ',
	u: 'ᴜ',
	v: 'ᴠ',
	w: 'ᴡ',
	y: 'ʏ',
	z: 'ᴢ',
};

// Subscript letters. Unicode only encodes the letters that appear in real
// mathematical and IPA subscript notation (variable subscripts like x_a,
// phonetic length/stress marks) — it was never extended to a full alphabet.
const SUBSCRIPT_LETTERS: Readonly<Record<string, string>> = {
	a: 'ₐ',
	e: 'ₑ',
	h: 'ₕ',
	i: 'ᵢ',
	j: 'ⱼ',
	k: 'ₖ',
	l: 'ₗ',
	m: 'ₘ',
	n: 'ₙ',
	o: 'ₒ',
	p: 'ₚ',
	r: 'ᵣ',
	s: 'ₛ',
	t: 'ₜ',
	u: 'ᵤ',
	v: 'ᵥ',
	x: 'ₓ',
};

const SUBSCRIPT_DIGITS: Readonly<Record<string, string>> = {
	'0': '₀',
	'1': '₁',
	'2': '₂',
	'3': '₃',
	'4': '₄',
	'5': '₅',
	'6': '₆',
	'7': '₇',
	'8': '₈',
	'9': '₉',
};

const SUBSCRIPT_SYMBOLS: Readonly<Record<string, string>> = {
	'+': '₊',
	'-': '₋',
	'=': '₌',
	'(': '₍',
	')': '₎',
};

export interface SmallTextResult {
	text: string;
	/** Letters/digits/symbols that had a real dedicated tiny glyph and were converted. */
	convertedCount: number;
	/** Letters this style has no dedicated Unicode glyph for; left as the original character. */
	unsupportedCount: number;
}

function isLetter(char: string): boolean {
	return /^[a-zA-Z]$/.test(char);
}

function isDigit(char: string): boolean {
	return /^[0-9]$/.test(char);
}

export function convertSmallText(input: string, style: SmallTextStyle): SmallTextResult {
	let out = '';
	let convertedCount = 0;
	let unsupportedCount = 0;

	for (const char of input) {
		if (style === 'superscript') {
			if (isLetter(char)) {
				const mapped = SUPERSCRIPT_LETTERS[char.toLowerCase()];
				if (mapped) {
					out += mapped;
					convertedCount++;
				} else {
					out += char;
					unsupportedCount++;
				}
				continue;
			}
			if (isDigit(char)) {
				out += SUPERSCRIPT_DIGITS[char]!;
				convertedCount++;
				continue;
			}
			if (SUPERSCRIPT_SYMBOLS[char]) {
				out += SUPERSCRIPT_SYMBOLS[char];
				convertedCount++;
				continue;
			}
			out += char;
			continue;
		}

		if (style === 'smallCaps') {
			if (isLetter(char)) {
				if (char === char.toUpperCase() && char !== char.toLowerCase()) {
					// Already uppercase: standard small-caps convention leaves it full-size.
					out += char;
					continue;
				}
				const mapped = SMALL_CAPS_LETTERS[char.toLowerCase()];
				if (mapped) {
					out += mapped;
					convertedCount++;
				} else {
					out += char;
					unsupportedCount++;
				}
				continue;
			}
			out += char;
			continue;
		}

		// subscript
		if (isLetter(char)) {
			const mapped = SUBSCRIPT_LETTERS[char.toLowerCase()];
			if (mapped) {
				out += mapped;
				convertedCount++;
			} else {
				out += char;
				unsupportedCount++;
			}
			continue;
		}
		if (isDigit(char)) {
			out += SUBSCRIPT_DIGITS[char]!;
			convertedCount++;
			continue;
		}
		if (SUBSCRIPT_SYMBOLS[char]) {
			out += SUBSCRIPT_SYMBOLS[char];
			convertedCount++;
			continue;
		}
		out += char;
	}

	return { text: out, convertedCount, unsupportedCount };
}

export function styleLabel(style: SmallTextStyle): string {
	switch (style) {
		case 'superscript':
			return 'Superscript';
		case 'smallCaps':
			return 'Small caps';
		case 'subscript':
			return 'Subscript';
	}
}

export function styleCoverage(style: SmallTextStyle): string {
	switch (style) {
		case 'superscript':
			return '25 of 26 letters (no "q")';
		case 'smallCaps':
			return '25 of 26 letters (no "x")';
		case 'subscript':
			return '17 of 26 letters';
	}
}
