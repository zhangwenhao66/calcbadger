/**
 * Wingdings translation, two different ways.
 *
 * Wingdings assigns a dingbat glyph to each printable ASCII code 0x20–0x7E.
 * On Windows, symbol fonts expose that same glyph set a second time in the
 * Unicode Private Use Area, at 0xF000 + the ASCII code — Microsoft's own
 * OpenType spec documents this exactly: "The character codes should start at
 * 0xF000... It is suggested to derive the format 4 encodings by simply
 * adding 0xF000 to the format 0 (Macintosh) encodings" (Microsoft
 * Typography, "Recommendations for OpenType Fonts," Non-Standard (Symbol)
 * Fonts). FONT_CODE mode reproduces that exact trick, so the output only
 * displays as symbols on a device that actually has Wingdings installed
 * (Windows ships it by default; most Mac/Linux/mobile browsers do not).
 *
 * SYMBOL_PREVIEW instead maps each character to its nearest *standard*
 * Unicode symbol equivalent — real, independently-encoded code points from
 * blocks such as Ornamental Dingbats and Geometric Shapes Extended, several
 * of which Unicode added specifically to give legacy symbol fonts like
 * Wingdings a portable equivalent. These render on any modern device with no
 * font dependency at all, which is why this tool uses them as the default
 * output. The correspondence table is sourced from Wikipedia's Wingdings
 * compatibility chart (per-character Unicode equivalents), cross-checked
 * against Unicode's stated rationale for the Geometric Shapes Extended block.
 */

export interface WingdingsGlyph {
	symbol: string;
	name: string;
}

// Keyed by the literal ASCII character (case-sensitive — Wingdings maps
// upper and lower case to unrelated glyphs, unlike a normal alphabet font).
const SYMBOL_PREVIEW: Readonly<Record<string, WingdingsGlyph>> = {
	' ': { symbol: ' ', name: 'space' },
	'!': { symbol: '\u{1F589}', name: 'lower left pencil' },
	'"': { symbol: '\u{2702}', name: 'black scissors' },
	'#': { symbol: '\u{2701}', name: 'upper blade scissors' },
	$: { symbol: '\u{1F453}', name: 'eyeglasses' },
	'%': { symbol: '\u{1F56D}', name: 'ringing bell' },
	'&': { symbol: '\u{1F56E}', name: 'book' },
	"'": { symbol: '\u{1F56F}', name: 'candle' },
	'(': { symbol: '\u{1F57F}', name: 'black touchtone telephone' },
	')': { symbol: '\u{2706}', name: 'telephone location sign' },
	'*': { symbol: '\u{1F582}', name: 'back of envelope' },
	'+': { symbol: '\u{1F583}', name: 'stamped envelope' },
	',': { symbol: '\u{1F4EA}', name: 'closed mailbox, lowered flag' },
	'-': { symbol: '\u{1F4EB}', name: 'closed mailbox, raised flag' },
	'.': { symbol: '\u{1F4EC}', name: 'open mailbox, raised flag' },
	'/': { symbol: '\u{1F4ED}', name: 'open mailbox, lowered flag' },
	'0': { symbol: '\u{1F5C0}', name: 'folder' },
	'1': { symbol: '\u{1F5C1}', name: 'open folder' },
	'2': { symbol: '\u{1F5CE}', name: 'document' },
	'3': { symbol: '\u{1F5CF}', name: 'page' },
	'4': { symbol: '\u{1F5D0}', name: 'pages' },
	'5': { symbol: '\u{1F5C4}', name: 'file cabinet' },
	'6': { symbol: '\u{23F3}', name: 'hourglass with flowing sand' },
	'7': { symbol: '\u{1F5AE}', name: 'wired keyboard' },
	'8': { symbol: '\u{1F5B0}', name: 'two button mouse' },
	'9': { symbol: '\u{1F5B2}', name: 'trackball' },
	':': { symbol: '\u{1F5B3}', name: 'old personal computer' },
	';': { symbol: '\u{1F5B4}', name: 'hard disk' },
	'<': { symbol: '\u{1F5AB}', name: 'white hard shell floppy disk' },
	'=': { symbol: '\u{1F5AC}', name: 'soft shell floppy disk' },
	'>': { symbol: '\u{2707}', name: 'tape drive' },
	'?': { symbol: '\u{270D}', name: 'writing hand' },
	'@': { symbol: '\u{1F58E}', name: 'left writing hand' },
	A: { symbol: '\u{270C}', name: 'victory hand' },
	B: { symbol: '\u{1F58F}', name: 'turned OK hand sign' },
	C: { symbol: '\u{1F44D}', name: 'thumbs up' },
	D: { symbol: '\u{1F44E}', name: 'thumbs down' },
	E: { symbol: '\u{261C}', name: 'pointing left' },
	F: { symbol: '\u{261E}', name: 'pointing right' },
	G: { symbol: '\u{261D}', name: 'pointing up' },
	H: { symbol: '\u{1F597}', name: 'pointing down (left hand)' },
	I: { symbol: '\u{1F590}', name: 'raised hand, fingers splayed' },
	J: { symbol: '\u{263A}', name: 'smiling face' },
	K: { symbol: '\u{1F610}', name: 'neutral face' },
	L: { symbol: '\u{2639}', name: 'frowning face' },
	M: { symbol: '\u{1F4A3}', name: 'bomb' },
	N: { symbol: '\u{1F571}', name: 'skull and crossbones' },
	O: { symbol: '\u{1F3F3}', name: 'waving white flag' },
	P: { symbol: '\u{1F3F1}', name: 'white pennant' },
	Q: { symbol: '\u{2708}', name: 'airplane' },
	R: { symbol: '\u{263C}', name: 'sun with rays' },
	S: { symbol: '\u{1F322}', name: 'raindrop' },
	T: { symbol: '\u{2744}', name: 'snowflake' },
	U: { symbol: '\u{1F546}', name: 'latin cross' },
	V: { symbol: '\u{271E}', name: 'shadowed latin cross' },
	W: { symbol: '\u{1F548}', name: 'celtic cross' },
	X: { symbol: '\u{2720}', name: 'maltese cross' },
	Y: { symbol: '\u{2721}', name: 'star of david' },
	Z: { symbol: '\u{262A}', name: 'star and crescent' },
	'[': { symbol: '\u{262F}', name: 'yin yang' },
	'\\': { symbol: '\u{1F549}', name: 'om symbol' },
	']': { symbol: '\u{2638}', name: 'wheel of dharma' },
	'^': { symbol: '\u{2648}', name: 'aries' },
	_: { symbol: '\u{2649}', name: 'taurus' },
	'`': { symbol: '\u{264A}', name: 'gemini' },
	a: { symbol: '\u{264B}', name: 'cancer' },
	b: { symbol: '\u{264C}', name: 'leo' },
	c: { symbol: '\u{264D}', name: 'virgo' },
	d: { symbol: '\u{264E}', name: 'libra' },
	e: { symbol: '\u{264F}', name: 'scorpius' },
	f: { symbol: '\u{2650}', name: 'sagittarius' },
	g: { symbol: '\u{2651}', name: 'capricorn' },
	h: { symbol: '\u{2652}', name: 'aquarius' },
	i: { symbol: '\u{2653}', name: 'pisces' },
	j: { symbol: '\u{1F670}', name: 'script ligature ornament' },
	k: { symbol: '\u{1F675}', name: 'swash ampersand ornament' },
	l: { symbol: '\u{26AB}', name: 'medium black circle' },
	m: { symbol: '\u{1F53E}', name: 'shadowed white circle' },
	n: { symbol: '\u{25FC}', name: 'black medium square' },
	o: { symbol: '\u{1F78F}', name: 'medium white square' },
	p: { symbol: '\u{1F790}', name: 'bold white square' },
	q: { symbol: '\u{2751}', name: 'shadowed white square (lower right)' },
	r: { symbol: '\u{2752}', name: 'shadowed white square (upper right)' },
	s: { symbol: '\u{1F79F}', name: 'black medium-small lozenge' },
	t: { symbol: '\u{29EB}', name: 'black lozenge' },
	u: { symbol: '\u{25C6}', name: 'black diamond' },
	v: { symbol: '\u{2756}', name: 'black diamond minus white X' },
	w: { symbol: '\u{1F799}', name: 'black medium-small diamond' },
	x: { symbol: '\u{2327}', name: 'X in a rectangle box' },
	y: { symbol: '\u{2BB9}', name: 'up arrowhead in a rectangle box' },
	z: { symbol: '\u{2318}', name: 'place of interest sign' },
	'{': { symbol: '\u{1F3F5}', name: 'rosette' },
	'|': { symbol: '\u{1F3F6}', name: 'black rosette' },
	'}': { symbol: '\u{1F676}', name: 'quotation mark ornament' },
	'~': { symbol: '\u{1F677}', name: 'quotation mark ornament (bold)' },
};

export const MAX_INPUT_LENGTH = 200;

export type WingdingsMode = 'symbolPreview' | 'fontCode' | 'decode';

export interface WingdingsResult {
	text: string;
	convertedCount: number;
	unsupportedCount: number;
}

export function clampWingdingsInput(text: string): string {
	return text.slice(0, MAX_INPUT_LENGTH);
}

export function lookupSymbol(char: string): WingdingsGlyph | undefined {
	return SYMBOL_PREVIEW[char];
}

export function textToSymbolPreview(input: string): WingdingsResult {
	let out = '';
	let convertedCount = 0;
	let unsupportedCount = 0;
	for (const char of input) {
		const glyph = SYMBOL_PREVIEW[char];
		if (glyph) {
			out += glyph.symbol;
			convertedCount++;
		} else {
			out += char;
			unsupportedCount++;
		}
	}
	return { text: out, convertedCount, unsupportedCount };
}

function isEncodableAscii(codePoint: number): boolean {
	return codePoint >= 0x20 && codePoint <= 0x7e;
}

export function textToFontCode(input: string): WingdingsResult {
	let out = '';
	let convertedCount = 0;
	let unsupportedCount = 0;
	for (const char of input) {
		const code = char.codePointAt(0)!;
		if (isEncodableAscii(code)) {
			out += String.fromCodePoint(0xf000 + code);
			convertedCount++;
		} else {
			out += char;
			unsupportedCount++;
		}
	}
	return { text: out, convertedCount, unsupportedCount };
}

export function decodeFontCode(input: string): WingdingsResult {
	let out = '';
	let convertedCount = 0;
	let unsupportedCount = 0;
	for (const char of input) {
		const code = char.codePointAt(0)!;
		if (code >= 0xf020 && code <= 0xf07e) {
			out += String.fromCodePoint(code - 0xf000);
			convertedCount++;
		} else {
			out += char;
			unsupportedCount++;
		}
	}
	return { text: out, convertedCount, unsupportedCount };
}

export function convertWingdings(input: string, mode: WingdingsMode): WingdingsResult {
	if (mode === 'symbolPreview') return textToSymbolPreview(input);
	if (mode === 'fontCode') return textToFontCode(input);
	return decodeFontCode(input);
}

export function modeLabel(mode: WingdingsMode): string {
	switch (mode) {
		case 'symbolPreview':
			return 'Symbol preview';
		case 'fontCode':
			return 'Windows font code';
		case 'decode':
			return 'Decode to text';
	}
}

/** A-Z legend for the on-page reference grid. */
export const UPPERCASE_LEGEND: ReadonlyArray<{ char: string; glyph: WingdingsGlyph }> = Array.from(
	{ length: 26 },
	(_, i) => {
		const char = String.fromCharCode(65 + i);
		return { char, glyph: SYMBOL_PREVIEW[char]! };
	},
);
