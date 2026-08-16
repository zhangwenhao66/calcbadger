/**
 * Text sanitation and style metadata for the calligraphy alphabet preview.
 *
 * The three styles here render with real open-license display fonts
 * (SIL OFL-1.1, via @fontsource) standing in for three genuinely distinct
 * calligraphy traditions — this is not one script shown three ways. See
 * CalligraphyStyle below for what each one is actually based on.
 */

export const MAX_LENGTH = 24;
// Letters, spaces, apostrophes, and hyphens cover names and short practice
// words (O'Brien, Anne-Marie) without letting the preview balloon into a
// full paragraph.
const DISALLOWED = /[^A-Za-z' -]/g;

export function sanitizePracticeText(raw: string): string {
	const cleaned = raw.replace(DISALLOWED, '').replace(/\s+/g, ' ').trim();
	return cleaned.slice(0, MAX_LENGTH);
}

export const DEFAULT_PRACTICE_TEXT = 'Calligraphy';

export const UPPERCASE_LETTERS: readonly string[] = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export const LOWERCASE_LETTERS: readonly string[] = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(97 + i),
);

export interface CalligraphyStyle {
	key: 'blackletter' | 'chancery' | 'brush';
	label: string;
	/** Shorter form for the style switcher button, which has little room on narrow screens. */
	shortLabel: string;
	fontFamily: string;
	fontClass: string;
}

export const CALLIGRAPHY_STYLES: readonly CalligraphyStyle[] = [
	{
		key: 'blackletter',
		label: 'Blackletter',
		shortLabel: 'Blackletter',
		fontFamily: "'UnifrakturMaguntia', cursive",
		fontClass: 'font-blackletter',
	},
	{
		key: 'chancery',
		label: 'Chancery Italic',
		shortLabel: 'Chancery',
		fontFamily: "'Tangerine', cursive",
		fontClass: 'font-chancery',
	},
	{
		key: 'brush',
		label: 'Modern Brush',
		shortLabel: 'Brush',
		fontFamily: "'Alex Brush', cursive",
		fontClass: 'font-brush',
	},
];

export function getCalligraphyStyle(key: string): CalligraphyStyle {
	return CALLIGRAPHY_STYLES.find((style) => style.key === key) ?? CALLIGRAPHY_STYLES[0]!;
}
