/**
 * Text sanitation for the graffiti alphabet preview.
 *
 * This page renders the alphabet and any word a visitor types with a real
 * spray-paint display font (Rubik Spray Paint, SIL OFL-1.1), not Unicode
 * "fancy text" lookalike characters. Sanitizing input here is only about
 * keeping the on-page preview readable, not about producing portable
 * copy-paste text — pasted elsewhere it would just render in whatever font
 * the destination site uses.
 */

export const MAX_LENGTH = 18;
// Letters, digits, spaces, and exclamation marks cover most street-art tag
// text (names, crew initials, "OI!") without letting the preview balloon
// into a full sentence — Rubik Spray Paint only ships glyphs for A-Z, a-z,
// and 0-9, so anything else falls back to the browser's default font anyway.
const DISALLOWED = /[^A-Za-z0-9 !]/g;

export function sanitizePracticeText(raw: string): string {
	const cleaned = raw.replace(DISALLOWED, '').replace(/\s+/g, ' ').trim();
	return cleaned.slice(0, MAX_LENGTH);
}

export const DEFAULT_PRACTICE_TEXT = 'Graffiti';

export const UPPERCASE_LETTERS: readonly string[] = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export const LOWERCASE_LETTERS: readonly string[] = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(97 + i),
);
