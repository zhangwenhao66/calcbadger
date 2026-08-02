import { describe, expect, it } from 'vitest';
import {
	circleAreaSqFt,
	convertArea,
	costEstimate,
	lShapeAreaSqFt,
	rectangleAreaSqFt,
	toFeet,
	triangleAreaSqFt,
} from '../src/lib/squareFootage';

/**
 * Expected values: elementary geometry, hand-computed; unit conversions use the
 * exact NIST SP 811 factors (1 ft = 0.3048 m exactly, 1 acre = 43,560 sq ft).
 */
describe('areas', () => {
	it('12 ft x 10 ft room = 120 sq ft', () => {
		expect(rectangleAreaSqFt(12, 10)).toBe(120);
	});

	it('10 ft diameter circle = 78.54 sq ft (pi * 5^2)', () => {
		expect(circleAreaSqFt(10)).toBeCloseTo(78.5398, 3);
	});

	it('triangle base 15 ft height 8 ft = 60 sq ft', () => {
		expect(triangleAreaSqFt(15, 8)).toBe(60);
	});

	it('L-shape 20x12 plus 8x6 = 288 sq ft', () => {
		expect(lShapeAreaSqFt(20, 12, 8, 6)).toBe(288);
	});

	it('zero dimension yields zero area', () => {
		expect(rectangleAreaSqFt(0, 25)).toBe(0);
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

describe('convertArea', () => {
	it('100 sq ft = 9.290304 sq m exactly', () => {
		expect(convertArea(100).sqM).toBeCloseTo(9.290304, 9);
	});

	it('43,560 sq ft = 1 acre exactly', () => {
		expect(convertArea(43560).acres).toBeCloseTo(1, 12);
	});

	it('9 sq ft = 1 sq yd', () => {
		expect(convertArea(9).sqYd).toBeCloseTo(1, 12);
	});
});

describe('costEstimate', () => {
	it('120 sq ft at $3.50/sq ft = $420', () => {
		expect(costEstimate(120, 3.5)).toBeCloseTo(420, 8);
	});
});
