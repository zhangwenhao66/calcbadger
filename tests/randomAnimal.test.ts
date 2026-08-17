import { describe, it, expect } from 'vitest';
import {
	ANIMALS,
	CLASS_ORDER,
	animalsForFilter,
	classCounts,
	drawAnimals,
} from '../src/lib/randomAnimal';

// Expected class composition, counted independently from the source list
// (node -e regex count over the raw file, not read back from these
// functions) before writing this test: Mammal 52, Bird 26, Reptile 16,
// Amphibian 10, Fish 12, Invertebrate 15, total 131.
const EXPECTED_COUNTS: Record<string, number> = {
	Mammal: 52,
	Bird: 26,
	Reptile: 16,
	Amphibian: 10,
	Fish: 12,
	Invertebrate: 15,
};

describe('ANIMALS dataset', () => {
	it('has 131 entries', () => {
		expect(ANIMALS).toHaveLength(131);
	});

	it('has no duplicate names', () => {
		const names = ANIMALS.map((a) => a.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('every animal has a non-empty name, class, and region', () => {
		for (const a of ANIMALS) {
			expect(a.name.length).toBeGreaterThan(0);
			expect(a.animalClass.length).toBeGreaterThan(0);
			expect(a.region.length).toBeGreaterThan(0);
		}
	});

	it('matches the independently-counted class composition', () => {
		for (const [cls, expected] of Object.entries(EXPECTED_COUNTS)) {
			const actual = ANIMALS.filter((a) => a.animalClass === cls).length;
			expect(actual).toBe(expected);
		}
	});
});

describe('classCounts', () => {
	it('returns one entry per class in CLASS_ORDER, matching EXPECTED_COUNTS', () => {
		const counts = classCounts();
		expect(counts.map((c) => c.animalClass)).toEqual(CLASS_ORDER);
		for (const c of counts) {
			expect(c.count).toBe(EXPECTED_COUNTS[c.animalClass]);
		}
	});

	it('counts sum to the full dataset size (131)', () => {
		const total = classCounts().reduce((sum, c) => sum + c.count, 0);
		expect(total).toBe(131);
	});
});

describe('animalsForFilter', () => {
	it("'all' returns the full 131-animal list", () => {
		expect(animalsForFilter('all')).toHaveLength(131);
		expect(animalsForFilter('all')).toBe(ANIMALS);
	});

	it('a class filter returns only that class, matching the expected count', () => {
		for (const [cls, expected] of Object.entries(EXPECTED_COUNTS)) {
			const filtered = animalsForFilter(cls as any);
			expect(filtered).toHaveLength(expected);
			for (const a of filtered) expect(a.animalClass).toBe(cls);
		}
	});
});

describe('drawAnimals', () => {
	it('with replacement (unique=false) draws exactly `count` animals from a fixed sequence', () => {
		const pool = animalsForFilter('Reptile'); // 16 animals
		// Sequence of "random" numbers walks index 0, 1, 2 (scaled by pool.length)
		let calls = 0;
		const seq = [0.0, 0.1, 0.2, 0.99];
		const rng = () => seq[calls++]!;
		const drawn = drawAnimals(4, pool, false, rng);
		expect(drawn).toHaveLength(4);
		expect(drawn[0]).toBe(pool[0]); // floor(0.0*16)=0
		expect(drawn[1]).toBe(pool[1]); // floor(0.1*16)=1
		expect(drawn[2]).toBe(pool[3]); // floor(0.2*16)=3
		expect(drawn[3]).toBe(pool[15]); // floor(0.99*16)=15
	});

	it('with replacement can repeat the same animal when rng returns the same value twice', () => {
		const pool = animalsForFilter('Amphibian'); // 10 animals
		const rng = () => 0.5; // floor(0.5*10)=5 every time
		const drawn = drawAnimals(3, pool, false, rng);
		expect(drawn).toEqual([pool[5], pool[5], pool[5]]);
	});

	it('unique=true never repeats an animal within one draw, even with a constant rng', () => {
		const pool = animalsForFilter('Fish'); // 12 animals
		const rng = () => 0.0; // always removes index 0 of what remains
		const drawn = drawAnimals(5, pool, true, rng);
		const names = drawn.map((a) => a.name);
		expect(new Set(names).size).toBe(5);
		// removing index 0 five times from a fixed-order array walks pool[0..4]
		expect(drawn).toEqual(pool.slice(0, 5));
	});

	it('unique=true caps the draw at the pool size instead of erroring or looping', () => {
		const pool = animalsForFilter('Amphibian'); // 10 animals
		const drawn = drawAnimals(25, pool, true, Math.random);
		expect(drawn).toHaveLength(10);
		expect(new Set(drawn.map((a) => a.name)).size).toBe(10);
	});

	it('returns an empty array for count=0', () => {
		expect(drawAnimals(0, ANIMALS, false, Math.random)).toEqual([]);
		expect(drawAnimals(0, ANIMALS, true, Math.random)).toEqual([]);
	});

	it('draws stay within the given pool (filtering + drawing compose correctly)', () => {
		const pool = animalsForFilter('Bird');
		const drawn = drawAnimals(10, pool, true, Math.random);
		for (const a of drawn) expect(a.animalClass).toBe('Bird');
	});
});
