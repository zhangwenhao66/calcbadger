import { describe, expect, it } from 'vitest';
import {
	cuFtToCuYd,
	DENSITY_LB_PER_CUFT,
	lbToTons,
	slabVolumeCuFt,
	toFeet,
	weightLb,
	withWaste,
} from '../src/lib/asphalt';

/**
 * Expected values: elementary geometry, hand-computed. Densities are the
 * Iowa DOT Section 2303 planning value for hot mix (145 lb/ft^3) and a
 * figure near the FHWA-RD-97-148 documented range's 112.5 midpoint, used
 * as 112 lb/ft^3 for RAP.
 */
describe('slabVolumeCuFt', () => {
	it('20 ft x 10 ft driveway, 3 in thick = 50 cu ft', () => {
		expect(slabVolumeCuFt(20, 10, 3 / 12)).toBeCloseTo(50, 6);
	});

	it('12 ft x 8 ft path, 2 in thick = 16 cu ft', () => {
		expect(slabVolumeCuFt(12, 8, 2 / 12)).toBeCloseTo(16, 6);
	});

	it('zero depth yields zero volume', () => {
		expect(slabVolumeCuFt(20, 10, 0)).toBe(0);
	});
});

describe('toFeet (NIST exact factors)', () => {
	it('3 inches = 0.25 ft', () => {
		expect(toFeet(3, 'in')).toBeCloseTo(0.25, 12);
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

describe('withWaste', () => {
	it('100 cu ft with 5% waste = 105 cu ft', () => {
		expect(withWaste(100, 5)).toBeCloseTo(105, 8);
	});

	it('0% waste is a no-op', () => {
		expect(withWaste(50, 0)).toBe(50);
	});
});

describe('cuFtToCuYd', () => {
	it('27 cu ft = 1 cu yd exactly', () => {
		expect(cuFtToCuYd(27)).toBeCloseTo(1, 12);
	});
});

describe('weightLb + lbToTons (hot mix, 145 lb/ft^3)', () => {
	it('50 cu ft of hot mix weighs 7,250 lb = 3.625 tons', () => {
		const lb = weightLb(50, DENSITY_LB_PER_CUFT.hotmix);
		expect(lb).toBeCloseTo(7250, 6);
		expect(lbToTons(lb)).toBeCloseTo(3.625, 6);
	});

	it('16 cu ft of hot mix weighs 2,320 lb = 1.16 tons', () => {
		const lb = weightLb(16, DENSITY_LB_PER_CUFT.hotmix);
		expect(lb).toBeCloseTo(2320, 6);
		expect(lbToTons(lb)).toBeCloseTo(1.16, 6);
	});
});

describe('weightLb + lbToTons (RAP, 112 lb/ft^3)', () => {
	it('666.667 cu ft of RAP weighs 74,666.7 lb = 37.33 tons', () => {
		const cuFt = slabVolumeCuFt(100, 20, 4 / 12);
		expect(cuFt).toBeCloseTo(666.6667, 3);
		const lb = weightLb(cuFt, DENSITY_LB_PER_CUFT.rap);
		expect(lb).toBeCloseTo(74666.67, 1);
		expect(lbToTons(lb)).toBeCloseTo(37.3333, 3);
	});
});

describe('lbToTons', () => {
	it('4,000 lb = 2 tons', () => {
		expect(lbToTons(4000)).toBe(2);
	});

	it('zero weight is zero tons', () => {
		expect(lbToTons(0)).toBe(0);
	});
});
