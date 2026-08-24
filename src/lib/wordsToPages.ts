/**
 * Words-to-pages conversion.
 *
 * Baseline: standard manuscript / academic formatting fits about 500 words
 * on a single-spaced, 12-point Times New Roman page and about 250 words on
 * the same page double-spaced. The 250-word double-spaced figure is the
 * long-standing publishing rule of thumb documented in William Shunn's
 * "Proper Manuscript Format" (shunn.net) — the de facto formatting standard
 * for fiction submissions and the same 12pt-double-spaced layout schools use
 * for essays — and it is consistent with the single-spaced figure being
 * exactly double it. Arial and Calibri word-per-page figures are the
 * midpoints of the ranges reported consistently across font/spacing
 * word-count references (Arial 12pt ~450-500 single-spaced, Calibri 11pt
 * ~550-600 single-spaced); unlike Times New Roman 12pt, there is no single
 * fixed standard for these, so they are stated as estimates, not exact counts.
 *
 * Words-per-page scales inversely with the line-spacing multiplier: doubling
 * line spacing (1x -> 2x) halves how many lines fit on a page, which is
 * exactly the 500 -> 250 relationship the single- and double-spaced
 * baselines already show. wordsPerPage() derives every spacing option from
 * the single-spaced baseline divided by the spacing multiplier, rather than
 * treating 1.15- and 1.5-line spacing as separately sourced numbers.
 */

export interface FontPreset {
	id: string;
	label: string;
	/** Words per page at this font/size, single-spaced. */
	singleSpacedWordsPerPage: number;
}

export const FONT_PRESETS: FontPreset[] = [
	{ id: 'times-12', label: 'Times New Roman, 12pt', singleSpacedWordsPerPage: 500 },
	{ id: 'arial-12', label: 'Arial, 12pt', singleSpacedWordsPerPage: 470 },
	{ id: 'calibri-11', label: 'Calibri, 11pt', singleSpacedWordsPerPage: 575 },
];

export interface SpacingOption {
	id: string;
	label: string;
	multiplier: number;
}

export const SPACING_OPTIONS: SpacingOption[] = [
	{ id: 'single', label: 'Single-spaced', multiplier: 1 },
	{ id: '1.15', label: '1.15 lines', multiplier: 1.15 },
	{ id: '1.5', label: '1.5 lines', multiplier: 1.5 },
	{ id: 'double', label: 'Double-spaced', multiplier: 2 },
];

/** Words per page for a given single-spaced baseline and line-spacing multiplier. */
export function wordsPerPage(singleSpacedWordsPerPage: number, spacingMultiplier: number): number {
	return singleSpacedWordsPerPage / spacingMultiplier;
}

export function pagesFromWords(wordCount: number, wordsPerPageValue: number): number {
	return wordCount / wordsPerPageValue;
}

export function wordsFromPages(pageCount: number, wordsPerPageValue: number): number {
	return pageCount * wordsPerPageValue;
}
