import { describe, it, expect } from 'vitest';
import {
	OBJECTS,
	CATEGORY_ORDER,
	DIFFICULTY_ORDER,
	objectsForFilter,
	categoryCounts,
	difficultyCounts,
	drawObjects,
} from '../src/lib/randomObject';

// Expected composition, counted independently from the source list (node -e
// regex count over the raw file, not read back from these functions) before
// writing this test: 8 categories totaling 145, 3 difficulty tiers totaling 145.
const EXPECTED_CATEGORY_COUNTS: Record<string, number> = {
	'Household & Kitchen': 20,
	'Food & Drink': 20,
	'Nature & Outdoors': 19,
	'Tools & Hardware': 18,
	'Clothing & Accessories': 17,
	'Vehicles & Transport': 15,
	'Sports & Recreation': 18,
	'School & Office': 18,
};

const EXPECTED_DIFFICULTY_COUNTS: Record<string, number> = {
	Easy: 76,
	Medium: 59,
	Hard: 10,
};

describe('OBJECTS dataset', () => {
	it('has 145 entries', () => {
		expect(OBJECTS).toHaveLength(145);
	});

	it('has no duplicate names', () => {
		const names = OBJECTS.map((o) => o.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('every object has a non-empty name, category, and difficulty', () => {
		for (const o of OBJECTS) {
			expect(o.name.length).toBeGreaterThan(0);
			expect(o.category.length).toBeGreaterThan(0);
			expect(o.difficulty.length).toBeGreaterThan(0);
		}
	});

	it('matches the independently-counted category composition', () => {
		for (const [cat, expected] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
			const actual = OBJECTS.filter((o) => o.category === cat).length;
			expect(actual).toBe(expected);
		}
	});

	it('matches the independently-counted difficulty composition', () => {
		for (const [diff, expected] of Object.entries(EXPECTED_DIFFICULTY_COUNTS)) {
			const actual = OBJECTS.filter((o) => o.difficulty === diff).length;
			expect(actual).toBe(expected);
		}
	});
});

describe('categoryCounts', () => {
	it('returns one entry per category in CATEGORY_ORDER, matching EXPECTED_CATEGORY_COUNTS', () => {
		const counts = categoryCounts();
		expect(counts.map((c) => c.category)).toEqual(CATEGORY_ORDER);
		for (const c of counts) {
			expect(c.count).toBe(EXPECTED_CATEGORY_COUNTS[c.category]);
		}
	});

	it('counts sum to the full dataset size (145)', () => {
		const total = categoryCounts().reduce((sum, c) => sum + c.count, 0);
		expect(total).toBe(145);
	});
});

describe('difficultyCounts', () => {
	it('returns one entry per tier in DIFFICULTY_ORDER, matching EXPECTED_DIFFICULTY_COUNTS', () => {
		const counts = difficultyCounts();
		expect(counts.map((c) => c.difficulty)).toEqual(DIFFICULTY_ORDER);
		for (const c of counts) {
			expect(c.count).toBe(EXPECTED_DIFFICULTY_COUNTS[c.difficulty]);
		}
	});

	it('counts sum to the full dataset size (145)', () => {
		const total = difficultyCounts().reduce((sum, c) => sum + c.count, 0);
		expect(total).toBe(145);
	});
});

describe('objectsForFilter', () => {
	it("'all' returns the full 145-object list", () => {
		expect(objectsForFilter('all')).toHaveLength(145);
		expect(objectsForFilter('all')).toBe(OBJECTS);
	});

	it('a category filter returns only that category, matching the expected count', () => {
		for (const [cat, expected] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
			const filtered = objectsForFilter(cat as any);
			expect(filtered).toHaveLength(expected);
			for (const o of filtered) expect(o.category).toBe(cat);
		}
	});
});

describe('drawObjects', () => {
	it('with replacement (unique=false) draws exactly `count` objects from a fixed sequence', () => {
		const pool = objectsForFilter('Vehicles & Transport'); // 15 objects
		let calls = 0;
		const seq = [0.0, 0.1, 0.2, 0.99];
		const rng = () => seq[calls++]!;
		const drawn = drawObjects(4, pool, false, rng);
		expect(drawn).toHaveLength(4);
		expect(drawn[0]).toBe(pool[0]); // floor(0.0*15)=0
		expect(drawn[1]).toBe(pool[1]); // floor(0.1*15)=1
		expect(drawn[2]).toBe(pool[3]); // floor(0.2*15)=3
		expect(drawn[3]).toBe(pool[14]); // floor(0.99*15)=14
	});

	it('with replacement can repeat the same object when rng returns the same value twice', () => {
		const pool = objectsForFilter('Tools & Hardware'); // 18 objects
		const rng = () => 0.5; // floor(0.5*18)=9 every time
		const drawn = drawObjects(3, pool, false, rng);
		expect(drawn).toEqual([pool[9], pool[9], pool[9]]);
	});

	it('unique=true never repeats an object within one draw, even with a constant rng', () => {
		const pool = objectsForFilter('Sports & Recreation'); // 18 objects
		const rng = () => 0.0; // always removes index 0 of what remains
		const drawn = drawObjects(5, pool, true, rng);
		const names = drawn.map((o) => o.name);
		expect(new Set(names).size).toBe(5);
		expect(drawn).toEqual(pool.slice(0, 5));
	});

	it('unique=true caps the draw at the pool size instead of erroring or looping', () => {
		const pool = objectsForFilter('Vehicles & Transport'); // 15 objects
		const drawn = drawObjects(25, pool, true, Math.random);
		expect(drawn).toHaveLength(15);
		expect(new Set(drawn.map((o) => o.name)).size).toBe(15);
	});

	it('returns an empty array for count=0', () => {
		expect(drawObjects(0, OBJECTS, false, Math.random)).toEqual([]);
		expect(drawObjects(0, OBJECTS, true, Math.random)).toEqual([]);
	});

	it('draws stay within the given pool (filtering + drawing compose correctly)', () => {
		const pool = objectsForFilter('Food & Drink');
		const drawn = drawObjects(10, pool, true, Math.random);
		for (const o of drawn) expect(o.category).toBe('Food & Drink');
	});
});
