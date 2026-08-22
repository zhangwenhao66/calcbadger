import { describe, expect, it } from 'vitest';
import {
	averageDepth,
	gallonsToLiters,
	GALLONS_PER_CUFT,
	lbToKg,
	ovalGallons,
	OVAL_MULTIPLIER,
	PPM_GALLONS_PER_LB,
	rectangleGallons,
	roundGallons,
	saltLbsNeeded,
} from '../src/lib/pool';

/**
 * Expected values: elementary geometry (rectangle/circle/ellipse area x
 * depth) and exact unit-conversion identities, hand-computed in Python --
 * see src/lib/pool.ts header for the derivation and sources (NIST Handbook
 * 44 gallon/cubic-foot conversion, exact avoirdupois pound, exact US
 * gallon-to-liter factor).
 */

describe('GALLONS_PER_CUFT', () => {
	it('1728 cubic inches per cubic foot / 231 cubic inches per gallon = 7.480519...', () => {
		expect(GALLONS_PER_CUFT).toBeCloseTo(7.48051948, 6);
	});
});

describe('averageDepth', () => {
	it('3 ft shallow, 8 ft deep = 5.5 ft average', () => {
		expect(averageDepth(3, 8)).toBeCloseTo(5.5, 6);
	});

	it('constant 4 ft depth (shallow = deep) averages to 4 ft', () => {
		expect(averageDepth(4, 4)).toBe(4);
	});
});

describe('rectangleGallons', () => {
	it('32 ft x 16 ft, 5.5 ft average depth = 21,065.14 gal', () => {
		expect(rectangleGallons(32, 16, 5.5)).toBeCloseTo(21065.142857, 3);
	});

	it('10 ft x 10 ft x 1 ft = 748.0519 gal', () => {
		expect(rectangleGallons(10, 10, 1)).toBeCloseTo(748.0519, 3);
	});

	it('zero depth yields zero gallons', () => {
		expect(rectangleGallons(20, 10, 0)).toBe(0);
	});
});

describe('roundGallons', () => {
	it('24 ft diameter, 4.5 ft average depth = 15,228.48 gal', () => {
		expect(roundGallons(24, 4.5)).toBeCloseTo(15228.482789, 3);
	});

	it('zero diameter yields zero gallons', () => {
		expect(roundGallons(0, 4)).toBe(0);
	});
});

describe('ovalGallons (Hayward Aqua Rite manual stadium-shape multiplier)', () => {
	it('20 ft x 12 ft, 4 ft average depth = 6,432 gal', () => {
		expect(ovalGallons(20, 12, 4)).toBeCloseTo(6432, 6);
	});

	it('uses the published 6.7 multiplier, not a true-ellipse (pi/4) factor', () => {
		expect(OVAL_MULTIPLIER).toBe(6.7);
		// A true ellipse of the same footprint would be noticeably smaller
		// (pi/4 x 7.480519 = 5.875 gal/ft^3-equivalent) than the stadium
		// shape an actual oval pool is built as -- see src/lib/pool.ts header.
		const ellipseEquivalent = Math.PI * (20 / 2) * (12 / 2) * 4 * GALLONS_PER_CUFT;
		expect(ovalGallons(20, 12, 4)).toBeGreaterThan(ellipseEquivalent);
	});

	it('zero depth yields zero gallons', () => {
		expect(ovalGallons(20, 12, 0)).toBe(0);
	});
});

describe('gallonsToLiters', () => {
	it('1,000 US gallons = 3,785.41 L (exact factor)', () => {
		expect(gallonsToLiters(1000)).toBeCloseTo(3785.411784, 6);
	});
});

describe('PPM_GALLONS_PER_LB', () => {
	it('rounds to the ~120,000 shorthand pool guides cite', () => {
		expect(PPM_GALLONS_PER_LB).toBeCloseTo(119826.427, 2);
		expect(Math.round(PPM_GALLONS_PER_LB / 1000) * 1000).toBe(120000);
	});
});

describe('saltLbsNeeded', () => {
	it('8,000 gal pool, 1,000 ppm current, 3,200 ppm target = 146.88 lb', () => {
		expect(saltLbsNeeded(8000, 1000, 3200)).toBeCloseTo(146.879118, 3);
	});

	it('15,000 gal fresh fill, 0 ppm current, 3,200 ppm target = 400.58 lb', () => {
		expect(saltLbsNeeded(15000, 0, 3200)).toBeCloseTo(400.579414, 3);
	});

	it('already at target (delta = 0) needs zero salt', () => {
		expect(saltLbsNeeded(10000, 3200, 3200)).toBe(0);
	});

	it('current above target needs zero salt (this calculator does not model dilution)', () => {
		expect(saltLbsNeeded(10000, 3500, 3200)).toBe(0);
	});

	it('zero gallons needs zero salt', () => {
		expect(saltLbsNeeded(0, 0, 3200)).toBe(0);
	});
});

describe('lbToKg', () => {
	it('100 lb = 45.359237 kg (exact avoirdupois pound)', () => {
		expect(lbToKg(100)).toBeCloseTo(45.359237, 6);
	});

	it('zero pounds is zero kilograms', () => {
		expect(lbToKg(0)).toBe(0);
	});
});
