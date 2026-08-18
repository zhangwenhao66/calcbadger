import { describe, expect, it } from 'vitest';
import {
	bagsNeeded,
	circleAreaSqFt,
	cuFtToCuYd,
	DENSITY_LB_PER_CUFT,
	lbToTons,
	rectangleAreaSqFt,
	toFeet,
	volumeCuFt,
	weightLb,
	withSettling,
} from '../src/lib/topsoil';

/**
 * Expected values: elementary geometry, hand-computed. Densities are the
 * USDA NRCS Soil Health Educators Guide (2023) ideal bulk density ceilings
 * by soil texture (sand/loamy sand 99.7 lb/ft^3, sandy loam through silt
 * loam 87.2 lb/ft^3, clay-heavy textures 68.5 lb/ft^3), as tabulated by SDSU
 * Extension -- see src/lib/topsoil.ts header for the source and conversion.
 */
describe('rectangleAreaSqFt', () => {
	it('20 ft x 10 ft bed = 200 sq ft', () => {
		expect(rectangleAreaSqFt(20, 10)).toBeCloseTo(200, 6);
	});

	it('4 ft x 8 ft raised bed = 32 sq ft', () => {
		expect(rectangleAreaSqFt(4, 8)).toBeCloseTo(32, 6);
	});
});

describe('circleAreaSqFt', () => {
	it('10 ft diameter circle = pi * 5^2 = 78.5398 sq ft', () => {
		expect(circleAreaSqFt(10)).toBeCloseTo(78.53982, 4);
	});

	it('6 ft diameter tree ring = pi * 3^2 = 28.2743 sq ft', () => {
		expect(circleAreaSqFt(6)).toBeCloseTo(28.27433, 4);
	});

	it('zero diameter yields zero area', () => {
		expect(circleAreaSqFt(0)).toBe(0);
	});
});

describe('volumeCuFt', () => {
	it('1,200 sq ft lawn, 4 in depth = 400 cu ft', () => {
		expect(volumeCuFt(1200, 4 / 12)).toBeCloseTo(400, 6);
	});

	it('32 sq ft raised bed, 8 in depth = 21.3333 cu ft', () => {
		expect(volumeCuFt(32, 8 / 12)).toBeCloseTo(21.33333, 4);
	});

	it('zero depth yields zero volume', () => {
		expect(volumeCuFt(200, 0)).toBe(0);
	});
});

describe('toFeet (NIST exact factors)', () => {
	it('4 inches = 0.33333 ft', () => {
		expect(toFeet(4, 'in')).toBeCloseTo(0.333333, 6);
	});

	it('2 yards = 6 ft', () => {
		expect(toFeet(2, 'yd')).toBeCloseTo(6, 12);
	});

	it('1 meter = 3.28084 ft (1 / 0.3048 exactly)', () => {
		expect(toFeet(1, 'm')).toBeCloseTo(3.2808399, 6);
	});

	it('10 cm = 0.328084 ft', () => {
		expect(toFeet(10, 'cm')).toBeCloseTo(0.3280840, 6);
	});
});

describe('withSettling', () => {
	it('400 cu ft with 10% settling allowance = 440 cu ft', () => {
		expect(withSettling(400, 10)).toBeCloseTo(440, 6);
	});

	it('0% settling is a no-op', () => {
		expect(withSettling(50, 0)).toBe(50);
	});
});

describe('cuFtToCuYd', () => {
	it('27 cu ft = 1 cu yd exactly', () => {
		expect(cuFtToCuYd(27)).toBeCloseTo(1, 12);
	});

	it('400 cu ft = 14.8148 cu yd', () => {
		expect(cuFtToCuYd(400)).toBeCloseTo(14.81481, 4);
	});
});

describe('weightLb + lbToTons (sandy/loamy sand preset, 99.7 lb/ft^3)', () => {
	it('10 cu ft weighs 997 lb', () => {
		expect(weightLb(10, DENSITY_LB_PER_CUFT.sandy)).toBeCloseTo(997, 6);
	});
});

describe('weightLb + lbToTons (loam preset, 87.2 lb/ft^3)', () => {
	it('400 cu ft (1,200 sq ft lawn, 4 in depth) weighs 34,880 lb = 17.44 tons', () => {
		const lb = weightLb(400, DENSITY_LB_PER_CUFT.loam);
		expect(lb).toBeCloseTo(34880, 6);
		expect(lbToTons(lb)).toBeCloseTo(17.44, 6);
	});

	it('21.3333 cu ft (raised bed) weighs 1,860.27 lb', () => {
		expect(weightLb(21.33333, DENSITY_LB_PER_CUFT.loam)).toBeCloseTo(1860.27, 1);
	});
});

describe('weightLb + lbToTons (clay preset, 68.5 lb/ft^3)', () => {
	it('10 cu ft weighs 685 lb', () => {
		expect(weightLb(10, DENSITY_LB_PER_CUFT.clay)).toBeCloseTo(685, 6);
	});
});

describe('lbToTons', () => {
	it('2,000 lb = 1 ton', () => {
		expect(lbToTons(2000)).toBe(1);
	});

	it('zero weight is zero tons', () => {
		expect(lbToTons(0)).toBe(0);
	});
});

describe('bagsNeeded', () => {
	it('27 cu ft at 0.75 cu ft/bag = exactly 36 bags', () => {
		expect(bagsNeeded(27, 0.75)).toBe(36);
	});

	it('21.3333 cu ft (raised bed) at 0.75 cu ft/bag rounds up to 29 bags', () => {
		expect(bagsNeeded(21.33333, 0.75)).toBe(29);
	});

	it('10 cu ft at 1 cu ft/bag = 10 bags', () => {
		expect(bagsNeeded(10, 1)).toBe(10);
	});

	it('floating-point noise at an exact boundary does not add an extra bag', () => {
		// 0.1 + 0.2 = 0.30000000000000004 in IEEE 754 double math, so
		// 0.30000000000000004 / 0.1 lands just above 3, not at it.
		expect(bagsNeeded(0.1 + 0.2, 0.1)).toBe(3);
	});

	it('zero volume needs zero bags', () => {
		expect(bagsNeeded(0, 0.75)).toBe(0);
	});
});
