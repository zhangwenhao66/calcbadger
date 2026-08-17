import { describe, it, expect } from 'vitest';
import {
	MARKS_UP,
	MARKS_DOWN,
	MARKS_MID,
	MAX_INPUT_LENGTH,
	glitchify,
	stripGlitch,
	clampGlitchInput,
	intensityLabel,
	directionLabel,
	type Intensity,
} from '../src/lib/glitchText';

// Deterministic RNGs for reproducible tests: always returns the same value,
// so randomCount()/pickMark() land on the low end (rand=0) or effectively
// the high end (rand just under 1) every call.
const lowRand = () => 0;
const highRand = () => 0.999999;

describe('mark tables', () => {
	it('cover the whole Combining Diacritical Marks block except the invisible grapheme joiner', () => {
		// U+0300-U+036F is 112 code points; U+034F (COMBINING GRAPHEME JOINER)
		// is deliberately excluded because it renders no visible mark.
		expect(MARKS_UP.length + MARKS_DOWN.length + MARKS_MID.length).toBe(111);
	});

	it('has no overlap between the three buckets', () => {
		const up = new Set(MARKS_UP);
		const down = new Set(MARKS_DOWN);
		const mid = new Set(MARKS_MID);
		for (const m of up) {
			expect(down.has(m)).toBe(false);
			expect(mid.has(m)).toBe(false);
		}
		for (const m of down) expect(mid.has(m)).toBe(false);
	});

	it('every mark is a single combining code point in U+0300-U+036F', () => {
		for (const m of [...MARKS_UP, ...MARKS_DOWN, ...MARKS_MID]) {
			expect(m.length).toBe(1);
			const code = m.codePointAt(0)!;
			expect(code).toBeGreaterThanOrEqual(0x300);
			expect(code).toBeLessThanOrEqual(0x36f);
		}
	});

	it('excludes U+034F COMBINING GRAPHEME JOINER from every bucket', () => {
		const joiner = '͏';
		expect(MARKS_UP).not.toContain(joiner);
		expect(MARKS_DOWN).not.toContain(joiner);
		expect(MARKS_MID).not.toContain(joiner);
	});
});

describe('glitchify', () => {
	it('returns empty output for empty input', () => {
		const result = glitchify('', { intensity: 'heavy', direction: 'both', random: highRand });
		expect(result.text).toBe('');
		expect(result.marksAdded).toBe(0);
	});

	it('leaves whitespace-only input untouched (no glyph to anchor a mark to)', () => {
		const result = glitchify('  \t\n ', { intensity: 'extreme', direction: 'both', random: highRand });
		expect(result.text).toBe('  \t\n ');
		expect(result.marksAdded).toBe(0);
	});

	it('preserves every base character, in order, once combining marks are stripped', () => {
		const input = 'Hello, world! 123 你好';
		const result = glitchify(input, { intensity: 'heavy', direction: 'both', random: highRand });
		expect(stripGlitch(result.text)).toBe(input);
	});

	it('mild at the lowest possible roll (rand=0) can add zero marks per character', () => {
		// mild range is [0, 2]; floor(0 * (2-0+1)) = 0.
		const result = glitchify('a', { intensity: 'mild', direction: 'up', random: lowRand });
		expect(result.marksAdded).toBe(0);
		expect(result.text).toBe('a');
	});

	it('direction "up" only ever adds marks from MARKS_UP', () => {
		const result = glitchify('abc', { intensity: 'extreme', direction: 'up', random: highRand });
		const added = [...stripAscii(result.text)];
		expect(added.length).toBeGreaterThan(0);
		for (const ch of added) expect(MARKS_UP).toContain(ch);
	});

	it('direction "down" only ever adds marks from MARKS_DOWN', () => {
		const result = glitchify('abc', { intensity: 'extreme', direction: 'down', random: highRand });
		const added = [...stripAscii(result.text)];
		expect(added.length).toBeGreaterThan(0);
		for (const ch of added) expect(MARKS_DOWN).toContain(ch);
	});

	it('direction "both" can add marks from all three buckets', () => {
		const result = glitchify('a', { intensity: 'extreme', direction: 'both', random: highRand });
		const added = new Set(stripAscii(result.text));
		const hasUp = [...added].some((ch) => MARKS_UP.includes(ch));
		const hasDown = [...added].some((ch) => MARKS_DOWN.includes(ch));
		const hasMid = [...added].some((ch) => MARKS_MID.includes(ch));
		expect(hasUp).toBe(true);
		expect(hasDown).toBe(true);
		expect(hasMid).toBe(true);
	});

	it('at a fixed high roll, higher intensities never add fewer marks than lower ones', () => {
		const order: Intensity[] = ['mild', 'medium', 'heavy', 'extreme'];
		const counts = order.map(
			(intensity) => glitchify('same input', { intensity, direction: 'both', random: highRand }).marksAdded
		);
		for (let i = 1; i < counts.length; i++) {
			expect(counts[i]!).toBeGreaterThanOrEqual(counts[i - 1]!);
		}
	});

	it('is a pure function of (input, options, random sequence): same inputs give the same output', () => {
		function makeSeq() {
			let seed = 0;
			return () => {
				seed = (seed + 0.137) % 1;
				return seed;
			};
		}
		const a = glitchify('reproducible', { intensity: 'medium', direction: 'both', random: makeSeq() });
		const b = glitchify('reproducible', { intensity: 'medium', direction: 'both', random: makeSeq() });
		expect(a.text).toBe(b.text);
		expect(a.marksAdded).toBe(b.marksAdded);
	});
});

describe('stripGlitch', () => {
	it('is a no-op on plain text with no combining marks', () => {
		expect(stripGlitch('plain text 123')).toBe('plain text 123');
	});

	it('removes marks added by glitchify at every intensity/direction combination', () => {
		const intensities: Intensity[] = ['mild', 'medium', 'heavy', 'extreme'];
		for (const intensity of intensities) {
			for (const direction of ['up', 'down', 'both'] as const) {
				const { text } = glitchify('roundtrip', { intensity, direction, random: highRand });
				expect(stripGlitch(text)).toBe('roundtrip');
			}
		}
	});
});

describe('clampGlitchInput', () => {
	it('leaves short input unchanged', () => {
		expect(clampGlitchInput('short')).toBe('short');
	});

	it('truncates to MAX_INPUT_LENGTH characters', () => {
		const long = 'x'.repeat(MAX_INPUT_LENGTH + 50);
		const clamped = clampGlitchInput(long);
		expect(clamped.length).toBe(MAX_INPUT_LENGTH);
	});
});

describe('labels', () => {
	it('give a distinct label for each intensity', () => {
		const labels = (['mild', 'medium', 'heavy', 'extreme'] as Intensity[]).map(intensityLabel);
		expect(new Set(labels).size).toBe(4);
	});

	it('give a distinct label for each direction', () => {
		const labels = (['up', 'down', 'both'] as const).map(directionLabel);
		expect(new Set(labels).size).toBe(3);
	});
});

/** Strips plain ASCII/base characters, leaving just the combining marks in the string. */
function stripAscii(text: string): string {
	return [...text].filter((ch) => ch.codePointAt(0)! >= 0x300 && ch.codePointAt(0)! <= 0x36f).join('');
}
