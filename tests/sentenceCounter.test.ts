import { describe, expect, it } from 'vitest';
import {
	analyzeText,
	countCharacters,
	countParagraphs,
	countSentences,
	countSyllablesInWord,
	countWords,
	READING_SPEED_WPM,
	readingEaseBand,
	splitSentences,
	totalSyllables,
} from '../src/lib/sentenceCounter';

describe('splitSentences', () => {
	it('splits two plain sentences', () => {
		expect(splitSentences('The cat sat on the mat. It was happy.')).toEqual([
			'The cat sat on the mat.',
			'It was happy.',
		]);
	});

	it('does not split on a single-word abbreviation', () => {
		// "Fed Ex Inc." never ends the sentence in this heuristic -- the
		// abbreviation's period is always treated as non-terminal, so this
		// reads as one sentence even though a person would call it two.
		expect(splitSentences('We shipped it via Fed Ex Inc. It arrived Tuesday.')).toEqual([
			'We shipped it via Fed Ex Inc. It arrived Tuesday.',
		]);
	});

	it('does not split inside a decimal number', () => {
		expect(splitSentences('The rate is 3.14 percent today. That seems low.')).toEqual([
			'The rate is 3.14 percent today.',
			'That seems low.',
		]);
	});

	it('does not split on single-letter initials', () => {
		expect(splitSentences('J. K. Rowling wrote the book. It sold well.')).toEqual([
			'J. K. Rowling wrote the book.',
			'It sold well.',
		]);
	});

	it('does not split inside a dotted multi-part abbreviation like "p.m."', () => {
		// Regression case: a naive scanner treats each period in "p.m." as its
		// own boundary and produces a bogus one-word "m." sentence.
		expect(splitSentences('Dr. Smith arrived at 3 p.m. He was late.')).toEqual([
			'Dr. Smith arrived at 3 p.m. He was late.',
		]);
	});

	it('treats a run of terminal punctuation (ellipsis, "?!") as one boundary each', () => {
		expect(splitSentences("Wait... what?! That can't be true.")).toEqual([
			'Wait...',
			'what?!',
			"That can't be true.",
		]);
	});

	it('counts a trailing fragment with no terminal punctuation as one sentence', () => {
		expect(splitSentences('Hello there and welcome')).toEqual(['Hello there and welcome']);
	});

	it('returns no sentences for empty or whitespace-only input', () => {
		expect(splitSentences('')).toEqual([]);
		expect(splitSentences('   \n  ')).toEqual([]);
	});

	it('splits across blank-line paragraph breaks', () => {
		expect(
			splitSentences('First paragraph line one.\n\nSecond paragraph starts here. It has two sentences.')
		).toEqual(['First paragraph line one.', 'Second paragraph starts here.', 'It has two sentences.']);
	});
});

describe('countSentences', () => {
	it('matches splitSentences length', () => {
		expect(countSentences('One. Two. Three.')).toBe(3);
		expect(countSentences('')).toBe(0);
	});
});

describe('countWords', () => {
	it('counts whitespace-delimited tokens', () => {
		expect(countWords('The cat sat on the mat. It was happy.')).toBe(9);
		expect(countWords('  extra   spaces   between words  ')).toBe(4);
		expect(countWords('')).toBe(0);
		expect(countWords('   ')).toBe(0);
		expect(countWords('one-word')).toBe(1);
	});
});

describe('countCharacters', () => {
	const text = 'The rate is 3.14 percent today. That seems low.';

	it('counts characters with spaces as string length', () => {
		expect(countCharacters(text, true)).toBe(47);
	});

	it('counts characters without whitespace', () => {
		expect(countCharacters(text, false)).toBe(39);
	});

	it('handles empty input', () => {
		expect(countCharacters('', true)).toBe(0);
		expect(countCharacters('', false)).toBe(0);
	});
});

describe('countParagraphs', () => {
	it('counts blocks separated by a blank line', () => {
		expect(countParagraphs('First paragraph line one.\n\nSecond paragraph starts here. It has two sentences.')).toBe(
			2
		);
	});

	it('treats a single block of text as one paragraph', () => {
		expect(countParagraphs('Just one paragraph, no blank lines.')).toBe(1);
		expect(countParagraphs('Line one.\nLine two, still the same paragraph.')).toBe(1);
	});

	it('returns 0 for empty input', () => {
		expect(countParagraphs('')).toBe(0);
		expect(countParagraphs('   ')).toBe(0);
	});

	it('ignores extra blank lines between paragraphs', () => {
		expect(countParagraphs('A.\n\n\n\nB.')).toBe(2);
	});
});

describe('countSyllablesInWord', () => {
	const cases: Array<[string, number]> = [
		['the', 1],
		['cat', 1],
		['one', 1],
		['two', 1],
		['wrote', 1],
		['sold', 1],
		['happy', 2],
		['second', 2],
		['Rowling', 2],
		['paragraph', 3],
		['sentences', 3],
		['here', 1],
		['starts', 1],
	];

	it.each(cases)('counts %s as %i syllable(s)', (word, expected) => {
		expect(countSyllablesInWord(word)).toBe(expected);
	});

	it('returns 0 for a token with no letters', () => {
		expect(countSyllablesInWord('123')).toBe(0);
		expect(countSyllablesInWord('')).toBe(0);
	});
});

describe('totalSyllables', () => {
	it('sums syllables across a sentence', () => {
		// The + cat + sat + on + the + mat + It + was + happy
		// =  1  +  1 +  1 +  1 +  1  +  1 +  1  +  1 +   2   = 10
		expect(totalSyllables('The cat sat on the mat. It was happy.')).toBe(10);
	});
});

describe('analyzeText', () => {
	it('computes full stats for a short two-sentence text', () => {
		const stats = analyzeText('The cat sat on the mat. It was happy.');
		expect(stats.sentences).toBe(2);
		expect(stats.words).toBe(9);
		expect(stats.charactersWithSpaces).toBe(37);
		expect(stats.charactersNoSpaces).toBe(29);
		expect(stats.paragraphs).toBe(1);
		expect(stats.syllables).toBe(10);
		expect(stats.avgWordsPerSentence).toBeCloseTo(4.5, 6);
		expect(stats.avgSyllablesPerWord).toBeCloseTo(10 / 9, 6);
		expect(stats.fleschReadingEase).toBeCloseTo(108.2675, 3);
		expect(stats.fleschKincaidGrade).toBeCloseTo(-0.7239, 3);
		expect(stats.readingTimeMinutes).toBeCloseTo(9 / 238, 6);
	});

	it('computes full stats for the two-paragraph example', () => {
		const stats = analyzeText(
			'First paragraph line one.\n\nSecond paragraph starts here. It has two sentences.'
		);
		expect(stats.sentences).toBe(3);
		expect(stats.words).toBe(12);
		expect(stats.paragraphs).toBe(2);
		expect(stats.syllables).toBe(19);
		expect(stats.fleschReadingEase).toBeCloseTo(68.825, 2);
		expect(stats.fleschKincaidGrade).toBeCloseTo(4.6533, 2);
	});

	it('scores a plain-language paragraph as easy to read', () => {
		const stats = analyzeText(
			'Read the instructions first. Then fill in each blank. Check your answers before you submit the form.'
		);
		expect(stats.sentences).toBe(3);
		expect(stats.words).toBe(17);
		expect(stats.syllables).toBe(22);
		expect(stats.fleschReadingEase).toBeCloseTo(91.6, 1);
		expect(stats.fleschKincaidGrade).toBeCloseTo(1.89, 1);
		expect(readingEaseBand(stats.fleschReadingEase as number)).toBe('Very easy');
	});

	it('scores a jargon-heavy paragraph as very confusing', () => {
		const stats = analyzeText(
			'Notwithstanding the aforementioned stipulations, applicants seeking supplementary compensation must, prior to formal adjudication, substantiate their eligibility through comprehensive documentation verifying continuous employment throughout the preceding fiscal quarter.'
		);
		expect(stats.sentences).toBe(1);
		expect(stats.words).toBe(27);
		expect(stats.fleschReadingEase).toBeCloseTo(-64.97, 1);
		expect(readingEaseBand(stats.fleschReadingEase as number)).toBe('Very confusing');
	});

	it('returns null readability scores for empty input, not NaN or a crash', () => {
		const stats = analyzeText('');
		expect(stats.words).toBe(0);
		expect(stats.sentences).toBe(0);
		expect(stats.fleschReadingEase).toBeNull();
		expect(stats.fleschKincaidGrade).toBeNull();
		expect(stats.readingTimeMinutes).toBe(0);
	});

	it('computes reading time from the Brysbaert (2019) 238 wpm average', () => {
		expect(READING_SPEED_WPM).toBe(238);
		const stats = analyzeText(Array(238).fill('word').join(' ') + '.');
		expect(stats.words).toBe(238);
		expect(stats.readingTimeMinutes).toBeCloseTo(1, 6);
	});
});

describe('readingEaseBand', () => {
	it('maps scores to the standard Flesch interpretation bands', () => {
		expect(readingEaseBand(95)).toBe('Very easy');
		expect(readingEaseBand(90)).toBe('Very easy');
		expect(readingEaseBand(89.9)).toBe('Easy');
		expect(readingEaseBand(80)).toBe('Easy');
		expect(readingEaseBand(75)).toBe('Fairly easy');
		expect(readingEaseBand(65)).toBe('Standard');
		expect(readingEaseBand(55)).toBe('Fairly difficult');
		expect(readingEaseBand(40)).toBe('Difficult');
		expect(readingEaseBand(10)).toBe('Very confusing');
		expect(readingEaseBand(-50)).toBe('Very confusing');
	});
});
