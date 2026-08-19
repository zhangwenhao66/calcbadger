/**
 * Text statistics: word/sentence/character/paragraph counts, a syllable
 * heuristic, and the two Flesch readability formulas.
 *
 * Sentence splitting has no exact algorithm -- English punctuation is
 * genuinely ambiguous ("Dr. Smith" vs. a sentence that happens to end in an
 * abbreviation). This implementation treats a run of . ! or ? as a sentence
 * boundary unless the single period immediately follows a known abbreviation,
 * sits between two digits (a decimal point), or follows a lone capital
 * letter acting as an initial ("J. K. Rowling").
 *
 * Readability formulas: Flesch Reading Ease and the Flesch-Kincaid Grade
 * Level, both from J. P. Kincaid, R. P. Fishburne, R. L. Rogers & B. S.
 * Chissom, "Derivation of New Readability Formulas ... for Navy Enlisted
 * Personnel," Research Branch Report 8-75, Chief of Naval Technical
 * Training, Naval Air Station Memphis, 1975 (archive.org/details/DTIC_ADA006655).
 * The syllable count that feeds both formulas is a vowel-group heuristic --
 * it can miscount irregular words by one syllable, which nudges the score a
 * few points without changing which reading-level band a typical paragraph
 * falls into.
 */

const MAX_INPUT_LENGTH = 20000;

export function clampTextInput(value: string): string {
	return value.length > MAX_INPUT_LENGTH ? value.slice(0, MAX_INPUT_LENGTH) : value;
}

// Single-word abbreviations: one word immediately followed by one period,
// with no periods of its own (e.g. "Dr.", "Inc.", "approx."). Multi-part
// dotted abbreviations ("p.m.", "e.g.", "U.S.") are handled separately below
// since their internal periods have no preceding letters to look up here.
const ABBREVIATIONS = new Set([
	'mr', 'mrs', 'ms', 'mx', 'dr', 'prof', 'sr', 'jr', 'st', 'vs',
	'etc', 'inc', 'ltd', 'co', 'corp', 'no', 'fig', 'cf', 'al', 'gen', 'rev',
	'approx', 'univ', 'dept', 'govt', 'assn', 'ave', 'blvd', 'apt',
]);

// Runs of two or more "letter + period", e.g. "p.m.", "e.g.", "U.S.A.",
// "J.K." -- every period inside a match is protected, including the last.
const DOTTED_ABBREVIATION = /\b(?:[a-zA-Z]\.){2,}/g;

function findDottedAbbreviationPeriods(text: string): Set<number> {
	const indexes = new Set<number>();
	for (const match of text.matchAll(DOTTED_ABBREVIATION)) {
		const start = match.index ?? 0;
		for (let k = 0; k < match[0].length; k++) {
			if (match[0][k] === '.') indexes.add(start + k);
		}
	}
	return indexes;
}

function isDecimalPoint(text: string, index: number): boolean {
	const before = text[index - 1];
	const after = text[index + 1];
	return before !== undefined && after !== undefined && /\d/.test(before) && /\d/.test(after);
}

function isAbbreviation(text: string, index: number): boolean {
	let start = index;
	while (start > 0 && /[a-zA-Z]/.test(text[start - 1])) start--;
	const word = text.slice(start, index).toLowerCase();
	return ABBREVIATIONS.has(word);
}

function isInitial(text: string, index: number): boolean {
	const before = text[index - 1];
	const twoBefore = text[index - 2];
	return before !== undefined && /[A-Z]/.test(before) && (twoBefore === undefined || /\s/.test(twoBefore));
}

/** Splits text into sentence strings using the boundary rules above. */
export function splitSentences(text: string): string[] {
	const trimmed = text.trim();
	if (!trimmed) return [];

	const dottedPeriods = findDottedAbbreviationPeriods(trimmed);
	const sentences: string[] = [];
	let segmentStart = 0;
	let i = 0;
	const n = trimmed.length;

	while (i < n) {
		const ch = trimmed[i];
		if (ch === '.' || ch === '!' || ch === '?') {
			let j = i;
			while (j < n && (trimmed[j] === '.' || trimmed[j] === '!' || trimmed[j] === '?')) j++;
			const isSinglePeriod = trimmed[i] === '.' && j - i === 1;
			const isProtected =
				isSinglePeriod &&
				(dottedPeriods.has(i) || isDecimalPoint(trimmed, i) || isAbbreviation(trimmed, i) || isInitial(trimmed, i));

			if (!isProtected) {
				let end = j;
				// swallow a closing quote/paren/bracket that trails the punctuation
				while (end < n && /["'”’)\]]/.test(trimmed[end])) end++;
				const sentence = trimmed.slice(segmentStart, end).trim();
				if (sentence.length > 0) sentences.push(sentence);
				segmentStart = end;
				i = end;
				continue;
			}
			i = j;
			continue;
		}
		i++;
	}

	const tail = trimmed.slice(segmentStart).trim();
	if (tail.length > 0) sentences.push(tail);

	return sentences;
}

export function countSentences(text: string): number {
	return splitSentences(text).length;
}

export function countWords(text: string): number {
	const trimmed = text.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).length;
}

export function countCharacters(text: string, includeSpaces: boolean): number {
	if (includeSpaces) return [...text].length;
	return [...text.replace(/\s/g, '')].length;
}

export function countParagraphs(text: string): number {
	const blocks = text
		.split(/\n\s*\n/)
		.map((b) => b.trim())
		.filter((b) => b.length > 0);
	if (blocks.length > 0) return blocks.length;
	return text.trim().length > 0 ? 1 : 0;
}

/**
 * Vowel-group syllable heuristic: count runs of a/e/i/o/u/y, then drop one
 * for a silent trailing "e" (but not when it's the word's only vowel group,
 * e.g. "the"). Every word counts as at least one syllable.
 */
export function countSyllablesInWord(word: string): number {
	const clean = word.toLowerCase().replace(/[^a-z]/g, '');
	if (clean.length === 0) return 0;
	if (clean.length <= 3) return 1;

	let working = clean.replace(/e$/, '');
	if (working.length === 0) working = clean;

	const groups = working.match(/[aeiouy]+/g);
	let count = groups ? groups.length : 0;
	if (count === 0) count = 1;
	return count;
}

export function totalSyllables(text: string): number {
	const trimmed = text.trim();
	if (!trimmed) return 0;
	const words = trimmed.split(/\s+/).map((w) => w.replace(/[^a-zA-Z]/g, '')).filter((w) => w.length > 0);
	return words.reduce((sum, w) => sum + countSyllablesInWord(w), 0);
}

export interface TextStats {
	sentences: number;
	words: number;
	charactersWithSpaces: number;
	charactersNoSpaces: number;
	paragraphs: number;
	syllables: number;
	avgWordsPerSentence: number;
	avgSyllablesPerWord: number;
	fleschReadingEase: number | null;
	fleschKincaidGrade: number | null;
	readingTimeMinutes: number;
}

/** Adults' average silent (non-fiction) reading rate, Brysbaert (2019). */
export const READING_SPEED_WPM = 238;

export function readingEaseBand(score: number): string {
	if (score >= 90) return 'Very easy';
	if (score >= 80) return 'Easy';
	if (score >= 70) return 'Fairly easy';
	if (score >= 60) return 'Standard';
	if (score >= 50) return 'Fairly difficult';
	if (score >= 30) return 'Difficult';
	return 'Very confusing';
}

export function analyzeText(text: string): TextStats {
	const words = countWords(text);
	const sentences = countSentences(text);
	const syllables = totalSyllables(text);

	const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
	const avgSyllablesPerWord = words > 0 ? syllables / words : 0;

	const fleschReadingEase =
		words > 0 && sentences > 0
			? 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
			: null;
	const fleschKincaidGrade =
		words > 0 && sentences > 0 ? 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59 : null;

	return {
		sentences,
		words,
		charactersWithSpaces: countCharacters(text, true),
		charactersNoSpaces: countCharacters(text, false),
		paragraphs: countParagraphs(text),
		syllables,
		avgWordsPerSentence,
		avgSyllablesPerWord,
		fleschReadingEase,
		fleschKincaidGrade,
		readingTimeMinutes: words / READING_SPEED_WPM,
	};
}
