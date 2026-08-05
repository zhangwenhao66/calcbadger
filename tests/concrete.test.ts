import { describe, expect, it } from 'vitest';
import {
	bagsNeeded,
	bagsTotalWeightLb,
	bagYieldCuFt,
	cuFtToCuYd,
	roundVolumeCuFt,
	slabVolumeCuFt,
	toFeet,
	totalCuFt,
	withWaste,
} from '../src/lib/concrete';

/**
 * Expected values: elementary geometry, hand-computed. Bag yields are the
 * exact figures from the QUIKRETE Concrete Mix 1101 technical data sheet
 * (revised October 2022): 40 lb -> 0.30 ft^3, 50 lb -> 0.375 ft^3,
 * 60 lb -> 0.45 ft^3, 80 lb -> 0.60 ft^3.
 */
describe('volumes', () => {
	it('10 ft x 10 ft slab, 4 in thick = 33.33 cu ft', () => {
		// 4 in = 1/3 ft exactly; 10 * 10 * (1/3) = 33.3333...
		expect(slabVolumeCuFt(10, 10, 4 / 12)).toBeCloseTo(33.3333, 3);
	});

	it('8 ft x 4 ft footing, 8 in deep = 21.33 cu ft', () => {
		expect(slabVolumeCuFt(8, 4, 8 / 12)).toBeCloseTo(21.3333, 3);
	});

	it('zero thickness yields zero volume', () => {
		expect(slabVolumeCuFt(10, 10, 0)).toBe(0);
	});

	it('1 ft diameter post hole, 3 ft deep = pi/4 * 3 = 2.3562 cu ft', () => {
		expect(roundVolumeCuFt(1, 3)).toBeCloseTo(2.35619, 4);
	});

	it('12 in diameter tube, 4 ft deep matches converting to feet first', () => {
		const diameterFt = toFeet(12, 'in');
		expect(roundVolumeCuFt(diameterFt, 4)).toBeCloseTo(3.14159, 4);
	});
});

describe('toFeet (NIST exact factors)', () => {
	it('18 inches = 1.5 ft', () => {
		expect(toFeet(18, 'in')).toBeCloseTo(1.5, 12);
	});

	it('2 meters = 6.5617 ft (2 / 0.3048 exactly)', () => {
		expect(toFeet(2, 'm')).toBeCloseTo(6.56167979, 6);
	});

	it('3 yards = 9 ft', () => {
		expect(toFeet(3, 'yd')).toBeCloseTo(9, 12);
	});

	it('30.48 cm = 1 ft (exact by definition)', () => {
		expect(toFeet(30.48, 'cm')).toBeCloseTo(1, 12);
	});
});

describe('totalCuFt (quantity multiplier)', () => {
	it('6 identical 2.3562 cu ft post holes = 14.1372 cu ft', () => {
		expect(totalCuFt(2.35619, 6)).toBeCloseTo(14.1372, 3);
	});

	it('quantity of 1 is a no-op', () => {
		expect(totalCuFt(33.3333, 1)).toBeCloseTo(33.3333, 3);
	});
});

describe('withWaste', () => {
	it('100 cu ft with 10% waste = 110 cu ft', () => {
		expect(withWaste(100, 10)).toBeCloseTo(110, 8);
	});

	it('0% waste is a no-op', () => {
		expect(withWaste(50, 0)).toBe(50);
	});
});

describe('cuFtToCuYd', () => {
	it('27 cu ft = 1 cu yd exactly', () => {
		expect(cuFtToCuYd(27)).toBeCloseTo(1, 12);
	});

	it('54 cu ft = 2 cu yd', () => {
		expect(cuFtToCuYd(54)).toBeCloseTo(2, 12);
	});
});

describe('bagYieldCuFt (QUIKRETE 1101 TDS, Oct 2022)', () => {
	it('40 lb bag yields 0.30 cu ft', () => {
		expect(bagYieldCuFt(40)).toBeCloseTo(0.3, 10);
	});

	it('50 lb bag yields 0.375 cu ft', () => {
		expect(bagYieldCuFt(50)).toBeCloseTo(0.375, 10);
	});

	it('60 lb bag yields 0.45 cu ft', () => {
		expect(bagYieldCuFt(60)).toBeCloseTo(0.45, 10);
	});

	it('80 lb bag yields 0.60 cu ft', () => {
		expect(bagYieldCuFt(80)).toBeCloseTo(0.6, 10);
	});
});

describe('bagsNeeded', () => {
	it('1 cu yd (27 cu ft) needs exactly 60 bags of 60 lb mix', () => {
		expect(bagsNeeded(27, 60)).toBe(60);
	});

	it('1 cu yd (27 cu ft) needs exactly 45 bags of 80 lb mix', () => {
		expect(bagsNeeded(27, 80)).toBe(45);
	});

	it('rounds up a partial bag (1 cu ft at 0.45 cu ft/bag needs 3, not 2.22)', () => {
		expect(bagsNeeded(1, 60)).toBe(3);
	});

	it('zero volume needs zero bags', () => {
		expect(bagsNeeded(0, 60)).toBe(0);
	});
});

describe('bagsTotalWeightLb', () => {
	it('60 bags of 60 lb mix weigh 3,600 lb', () => {
		expect(bagsTotalWeightLb(60, 60)).toBe(3600);
	});

	it('45 bags of 80 lb mix weigh 3,600 lb', () => {
		expect(bagsTotalWeightLb(45, 80)).toBe(3600);
	});
});
