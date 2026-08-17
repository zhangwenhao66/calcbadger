/**
 * "Glitch" / zalgo text: stack Unicode combining marks on top of, through,
 * and below each base character. The base letters stay intact and readable
 * (and copy-paste as real Unicode, not an image or a special font); the
 * combining marks just pile up around them.
 *
 * Mark tables below are every code point in the Unicode Combining Diacritical
 * Marks block, U+0300-U+036F (source: Unicode Character Database,
 * UnicodeData.txt), sorted into three buckets by where each mark's own
 * character name says it renders: names containing "BELOW", "LOW LINE",
 * "CEDILLA" or "OGONEK" go under the base letter (MARKS_DOWN); names
 * containing "OVERLAY" or "SOLIDUS" strike through it (MARKS_MID);
 * everything else in the block stacks above (MARKS_UP). U+034F COMBINING
 * GRAPHEME JOINER is excluded -- it is invisible and adds no visible mark.
 */

export const MARKS_UP: readonly string[] = [
	'\u0300',
	'\u0301',
	'\u0302',
	'\u0303',
	'\u0304',
	'\u0305',
	'\u0306',
	'\u0307',
	'\u0308',
	'\u0309',
	'\u030A',
	'\u030B',
	'\u030C',
	'\u030D',
	'\u030E',
	'\u030F',
	'\u0310',
	'\u0311',
	'\u0312',
	'\u0313',
	'\u0314',
	'\u0315',
	'\u031A',
	'\u031B',
	'\u033D',
	'\u033E',
	'\u033F',
	'\u0340',
	'\u0341',
	'\u0342',
	'\u0343',
	'\u0344',
	'\u0345',
	'\u0346',
	'\u034A',
	'\u034B',
	'\u034C',
	'\u0350',
	'\u0351',
	'\u0352',
	'\u0357',
	'\u0358',
	'\u035B',
	'\u035D',
	'\u035E',
	'\u0360',
	'\u0361',
	'\u0363',
	'\u0364',
	'\u0365',
	'\u0366',
	'\u0367',
	'\u0368',
	'\u0369',
	'\u036A',
	'\u036B',
	'\u036C',
	'\u036D',
	'\u036E',
	'\u036F',
];

export const MARKS_DOWN: readonly string[] = [
	'\u0316',
	'\u0317',
	'\u0318',
	'\u0319',
	'\u031C',
	'\u031D',
	'\u031E',
	'\u031F',
	'\u0320',
	'\u0321',
	'\u0322',
	'\u0323',
	'\u0324',
	'\u0325',
	'\u0326',
	'\u0327',
	'\u0328',
	'\u0329',
	'\u032A',
	'\u032B',
	'\u032C',
	'\u032D',
	'\u032E',
	'\u032F',
	'\u0330',
	'\u0331',
	'\u0332',
	'\u0333',
	'\u0339',
	'\u033A',
	'\u033B',
	'\u033C',
	'\u0347',
	'\u0348',
	'\u0349',
	'\u034D',
	'\u034E',
	'\u0353',
	'\u0354',
	'\u0355',
	'\u0356',
	'\u0359',
	'\u035A',
	'\u035C',
	'\u035F',
	'\u0362',
];

export const MARKS_MID: readonly string[] = [
	'\u0334',
	'\u0335',
	'\u0336',
	'\u0337',
	'\u0338',
];

export type Intensity = 'mild' | 'medium' | 'heavy' | 'extreme';
export type Direction = 'up' | 'down' | 'both';

export const INTENSITY_ORDER: readonly Intensity[] = ['mild', 'medium', 'heavy', 'extreme'];
export const DIRECTION_ORDER: readonly Direction[] = ['up', 'down', 'both'];

/** [min, max] combining marks added per direction, per base character. */
const INTENSITY_RANGE: Record<Intensity, readonly [number, number]> = {
	mild: [0, 2],
	medium: [2, 5],
	heavy: [5, 10],
	extreme: [10, 18],
};

export const MAX_INPUT_LENGTH = 400;

export interface GlitchOptions {
	intensity: Intensity;
	direction: Direction;
	/** Injectable RNG (0 <= x < 1) so output is testable/deterministic. Defaults to Math.random. */
	random?: () => number;
}

function randomCount([min, max]: readonly [number, number], rand: () => number): number {
	return min + Math.floor(rand() * (max - min + 1));
}

function pickMark(marks: readonly string[], rand: () => number): string {
	return marks[Math.floor(rand() * marks.length)]!;
}

export function clampGlitchInput(text: string): string {
	return text.slice(0, MAX_INPUT_LENGTH);
}

/** True for characters with no glyph to hang a combining mark on. */
function isBlank(char: string): boolean {
	return char.trim().length === 0;
}

export interface GlitchResult {
	text: string;
	/** Total combining marks added, across every base character. */
	marksAdded: number;
}

export function glitchify(input: string, options: GlitchOptions): GlitchResult {
	const rand = options.random ?? Math.random;
	const range = INTENSITY_RANGE[options.intensity];
	const wantsUp = options.direction === 'up' || options.direction === 'both';
	const wantsDown = options.direction === 'down' || options.direction === 'both';
	const wantsMid = options.direction === 'both';

	let out = '';
	let marksAdded = 0;

	for (const char of input) {
		out += char;
		if (isBlank(char)) continue;

		if (wantsUp) {
			const n = randomCount(range, rand);
			for (let i = 0; i < n; i++) out += pickMark(MARKS_UP, rand);
			marksAdded += n;
		}
		if (wantsDown) {
			const n = randomCount(range, rand);
			for (let i = 0; i < n; i++) out += pickMark(MARKS_DOWN, rand);
			marksAdded += n;
		}
		if (wantsMid) {
			// Strikethrough marks read as noisier than up/down accents even in
			// small numbers, so "both" mode uses a third of the up/down count.
			const n = Math.ceil(randomCount(range, rand) / 3);
			for (let i = 0; i < n; i++) out += pickMark(MARKS_MID, rand);
			marksAdded += n;
		}
	}

	return { text: out, marksAdded };
}

/** Strips every combining mark in the block back off, for round-trip checks. */
export function stripGlitch(text: string): string {
	return text.replace(/[\u0300-\u036F]/g, '');
}

export function intensityLabel(intensity: Intensity): string {
	switch (intensity) {
		case 'mild':
			return 'Mild';
		case 'medium':
			return 'Medium';
		case 'heavy':
			return 'Heavy';
		case 'extreme':
			return 'Extreme';
	}
}

export function directionLabel(direction: Direction): string {
	switch (direction) {
		case 'up':
			return 'Up only';
		case 'down':
			return 'Down only';
		case 'both':
			return 'Up + down';
	}
}
