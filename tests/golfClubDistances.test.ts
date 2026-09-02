import { describe, expect, it } from 'vitest';
import {
	BASELINE_DISTANCES,
	clubGaps,
	driverScaleFactor,
	personalizedDistances,
} from '../src/lib/golfClubDistances';

/**
 * Expected values: computed independently (node REPL, 2026-09-02) from the
 * module's own documented formulas (ratio = known/baseline, clamped to
 * [0.5, 1.8]; each club scaled by that ratio and rounded) — NOT read back
 * from the implementation's output.
 */
describe('driverScaleFactor', () => {
	it('no known distance -> factor 1 (baseline unchanged)', () => {
		expect(driverScaleFactor('average', null)).toBe(1);
		expect(driverScaleFactor('average', undefined)).toBe(1);
	});

	it('known distance equal to baseline -> factor 1', () => {
		expect(driverScaleFactor('average', 230)).toBe(1);
	});

	it('253/230 = 1.1', () => {
		expect(driverScaleFactor('average', 253)).toBeCloseTo(1.1, 10);
	});

	it('clamps an implausibly short known drive to 0.5', () => {
		// 50/282 = 0.177, below the 0.5 floor
		expect(driverScaleFactor('tour', 50)).toBe(0.5);
	});

	it('clamps an implausibly long known drive to 1.8', () => {
		// 600/190 = 3.16, above the 1.8 ceiling
		expect(driverScaleFactor('beginner', 600)).toBe(1.8);
	});

	it('non-positive or non-finite input -> factor 1', () => {
		expect(driverScaleFactor('average', 0)).toBe(1);
		expect(driverScaleFactor('average', -10)).toBe(1);
		expect(driverScaleFactor('average', NaN)).toBe(1);
	});
});

describe('personalizedDistances', () => {
	it('with no known driver distance, returns the tier baseline exactly', () => {
		expect(personalizedDistances('good', null)).toEqual(BASELINE_DISTANCES.good);
	});

	it('scales every club by the same 1.1 factor, rounded to the nearest yard', () => {
		// baseline.average x 1.1, each rounded: 230,205,160,140,120,110,95,80,65 -> x1.1
		const result = personalizedDistances('average', 253);
		expect(result).toEqual({
			driver: 253,
			wood3: 226,
			iron5: 176,
			iron7: 154,
			iron9: 132,
			pw: 121,
			gw: 105,
			sw: 88,
			lw: 72,
		});
	});

	it('a known driver distance below baseline scales every club down', () => {
		// tour baseline driver 282; known 141 -> factor 0.5 (clamp floor)
		const result = personalizedDistances('tour', 141);
		expect(result.driver).toBe(141);
		expect(result.lw).toBe(44); // round(88 * 0.5)
		expect(result.iron7).toBe(88); // round(176 * 0.5)
	});
});

describe('clubGaps', () => {
	it('beginner baseline: gaps computed as consecutive differences', () => {
		const gaps = clubGaps(BASELINE_DISTANCES.beginner);
		expect(gaps.map((g) => g.yards)).toEqual([20, 45, 20, 20, 10, 10, 10, 15]);
	});

	it('gap count is always one less than the number of clubs', () => {
		const gaps = clubGaps(BASELINE_DISTANCES.tour);
		expect(gaps).toHaveLength(8);
	});

	it('gaps sum to the total driver-to-lob-wedge spread', () => {
		const table = BASELINE_DISTANCES.good;
		const gaps = clubGaps(table);
		const sum = gaps.reduce((total, g) => total + g.yards, 0);
		expect(sum).toBe(table.driver - table.lw);
	});
});
