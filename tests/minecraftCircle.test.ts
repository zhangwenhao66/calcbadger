import { describe, expect, it } from 'vitest';
import { circleToSchematic, generateCircle } from '../src/lib/minecraftCircle';

// Expected block counts below are independently computed from the distance
// formula (sqrt(row^2 + col^2) <= radius) with a standalone Python script,
// not derived from this implementation's output.
describe('generateCircle — filled/outline block counts', () => {
	const cases: Array<[radius: number, diameter: number, filled: number, outline: number]> = [
		[0, 1, 1, 1],
		[1, 3, 5, 4],
		[2, 5, 13, 8],
		[3, 7, 29, 16],
		[4, 9, 49, 20],
		[5, 11, 81, 28],
		[8, 17, 197, 44],
		[10, 21, 317, 56],
		[15, 31, 709, 84],
		[20, 41, 1257, 112],
	];

	for (const [radius, diameter, filledCount, outlineCount] of cases) {
		it(`radius ${radius}: diameter ${diameter}, filled ${filledCount}, outline ${outlineCount}`, () => {
			const filled = generateCircle(radius, 'filled');
			expect(filled.diameter).toBe(diameter);
			expect(filled.diameter).toBe(radius * 2 + 1);
			expect(filled.blockCount).toBe(filledCount);

			const outline = generateCircle(radius, 'outline');
			expect(outline.blockCount).toBe(outlineCount);
		});
	}
});

describe('generateCircle — exact grid shape at small radii', () => {
	it('radius 1 filled is a plus/cross shape', () => {
		const result = generateCircle(1, 'filled');
		const rendered = result.grid.map((row) => row.map((v) => (v ? '#' : '.')).join(''));
		expect(rendered).toEqual(['.#.', '###', '.#.']);
	});

	it('radius 1 outline drops the fully-enclosed center block', () => {
		// The center's 4 orthogonal neighbors are all filled, so by the
		// surface-block rule it is interior, not surface — this yields four
		// disconnected arm blocks rather than the full cross. That is the
		// correct behavior of the "keep blocks touching an empty cell" rule,
		// not a bug: a 3x3 plus has no interior to hollow out.
		const result = generateCircle(1, 'outline');
		const rendered = result.grid.map((row) => row.map((v) => (v ? '#' : '.')).join(''));
		expect(rendered).toEqual(['.#.', '#.#', '.#.']);
	});

	it('radius 3 filled matches the hand-verified grid', () => {
		const result = generateCircle(3, 'filled');
		const rendered = result.grid.map((row) => row.map((v) => (v ? '#' : '.')).join(''));
		expect(rendered).toEqual([
			'...#...',
			'.#####.',
			'.#####.',
			'#######',
			'.#####.',
			'.#####.',
			'...#...',
		]);
	});

	it('radius 3 outline matches the hand-verified ring', () => {
		const result = generateCircle(3, 'outline');
		const rendered = result.grid.map((row) => row.map((v) => (v ? '#' : '.')).join(''));
		expect(rendered).toEqual([
			'...#...',
			'.##.##.',
			'.#...#.',
			'#.....#',
			'.#...#.',
			'.##.##.',
			'...#...',
		]);
	});
});

describe('generateCircle — row breakdown', () => {
	it('radius 3 filled row breakdown sums to the total block count and is symmetric', () => {
		const result = generateCircle(3, 'filled');
		const total = result.rows.reduce((sum, row) => sum + row.blockCount, 0);
		expect(total).toBe(result.blockCount);

		expect(result.rows).toEqual([
			{ rowOffset: -3, blockCount: 1, startCol: 0, endCol: 0 },
			{ rowOffset: -2, blockCount: 5, startCol: -2, endCol: 2 },
			{ rowOffset: -1, blockCount: 5, startCol: -2, endCol: 2 },
			{ rowOffset: 0, blockCount: 7, startCol: -3, endCol: 3 },
			{ rowOffset: 1, blockCount: 5, startCol: -2, endCol: 2 },
			{ rowOffset: 2, blockCount: 5, startCol: -2, endCol: 2 },
			{ rowOffset: 3, blockCount: 1, startCol: 0, endCol: 0 },
		]);
	});

	it('the middle row of an odd diameter is the widest row (center row spans the full diameter)', () => {
		const result = generateCircle(10, 'filled');
		const middle = result.rows.find((row) => row.rowOffset === 0)!;
		expect(middle.endCol - middle.startCol + 1).toBe(result.diameter);
	});
});

describe('generateCircle — input handling', () => {
	it('rounds a non-integer radius', () => {
		const result = generateCircle(2.6, 'filled');
		expect(result.radius).toBe(3);
		expect(result.diameter).toBe(7);
	});

	it('throws on a negative radius', () => {
		expect(() => generateCircle(-1, 'filled')).toThrow();
	});

	it('accepts radius 0 as a single center block', () => {
		const result = generateCircle(0, 'filled');
		expect(result.blockCount).toBe(1);
		expect(result.diameter).toBe(1);
	});
});

describe('circleToSchematic', () => {
	it('produces one line per occupied row plus a header, matching the block total', () => {
		const result = generateCircle(2, 'filled');
		const text = circleToSchematic(result);
		const lines = text.split('\n');
		expect(lines[0]).toContain('radius 2');
		expect(lines[0]).toContain('diameter 5');
		expect(lines[0]).toContain('13 blocks total');
		expect(lines.length).toBe(1 + result.rows.length);
	});
});
