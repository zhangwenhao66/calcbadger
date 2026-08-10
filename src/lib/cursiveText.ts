/**
 * Text sanitation for the cursive alphabet preview.
 *
 * This page renders the alphabet and any word a learner types with a real
 * cursive display font (Dancing Script, SIL OFL-1.1), not Unicode
 * "mathematical script" code points (U+1D49C…). That Unicode block is a
 * separate, unrelated set of characters used for stylized math notation and
 * copy-paste "fancy text" generators — it does not match any classroom
 * cursive teaching alphabet, and pasted elsewhere it would just render in
 * whatever font the destination site uses, not cursive. Sanitizing input
 * here is only about keeping the on-page preview readable, not about
 * producing portable "fancy" text.
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

export const DEFAULT_PRACTICE_TEXT = 'Cursive';

export const UPPERCASE_LETTERS: readonly string[] = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export const LOWERCASE_LETTERS: readonly string[] = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(97 + i),
);
