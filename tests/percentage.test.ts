import { describe, expect, it } from 'vitest';
import {
	applyDiscount,
	partAsPercentOfWhole,
	percentChange,
	percentDifference,
	percentOfWhole,
	wholeFromPartAndPercent,
} from '../src/lib/percentage';

/**
 * Expected values: elementary algebra, hand-computed from the "percent =
 * parts per hundred" definition (BIPM SI Brochure §5.4.7). Percent
 * difference expected values match the standard symmetric formula
 * |a-b|/((a+b)/2)*100.
 */
describe('percentOfWhole', () => {
	it('20% of 50 = 10', () => {
		expect(percentOfWhole(20, 50)).toBeCloseTo(10, 10);
	});

	it('15% of 200 = 30', () => {
		expect(percentOfWhole(15, 200)).toBeCloseTo(30, 10);
	});

	it('30% of 150 = 45', () => {
		expect(percentOfWhole(30, 150)).toBeCloseTo(45, 10);
	});

	it('20% of 80 = 16', () => {
		expect(percentOfWhole(20, 80)).toBeCloseTo(16, 10);
	});

	it('25% of 80 = 20', () => {
		expect(percentOfWhole(25, 80)).toBeCloseTo(20, 10);
	});

	it('0% of anything = 0', () => {
		expect(percentOfWhole(0, 500)).toBe(0);
	});

	it('negative whole scales through unchanged (100% of -40 = -40)', () => {
		expect(percentOfWhole(100, -40)).toBeCloseTo(-40, 10);
	});
});

describe('partAsPercentOfWhole', () => {
	it('25 is 12.5% of 200', () => {
		expect(partAsPercentOfWhole(25, 200)).toBeCloseTo(12.5, 10);
	});

	it('10 is 25% of 40', () => {
		expect(partAsPercentOfWhole(10, 40)).toBeCloseTo(25, 10);
	});

	it('45 is 30% of 150 (inverse of percentOfWhole 30% of 150)', () => {
		expect(partAsPercentOfWhole(45, 150)).toBeCloseTo(30, 10);
	});

	it('whole of 0 is undefined -> null', () => {
		expect(partAsPercentOfWhole(10, 0)).toBeNull();
	});
});

describe('wholeFromPartAndPercent', () => {
	it('10 is 20% of 50', () => {
		expect(wholeFromPartAndPercent(10, 20)).toBeCloseTo(50, 10);
	});

	it('45 is 30% of 150 (inverse check)', () => {
		expect(wholeFromPartAndPercent(45, 30)).toBeCloseTo(150, 10);
	});

	it('percent of 0 is undefined -> null', () => {
		expect(wholeFromPartAndPercent(10, 0)).toBeNull();
	});
});

describe('percentChange', () => {
	it('50 -> 60 is +20%', () => {
		expect(percentChange(50, 60)).toBeCloseTo(20, 10);
	});

	it('80 -> 60 is -25%', () => {
		expect(percentChange(80, 60)).toBeCloseTo(-25, 10);
	});

	it('200 -> 150 is -25%', () => {
		expect(percentChange(200, 150)).toBeCloseTo(-25, 10);
	});

	it('no change is 0%', () => {
		expect(percentChange(75, 75)).toBe(0);
	});

	it('old value of 0 is undefined -> null', () => {
		expect(percentChange(0, 40)).toBeNull();
	});

	it('negative old value uses its absolute value as the base (-50 -> -25 is +50%)', () => {
		expect(percentChange(-50, -25)).toBeCloseTo(50, 10);
	});
});

describe('applyDiscount', () => {
	it('$100 at 20% off -> $80 sale, $20 saved', () => {
		const r = applyDiscount(100, 20);
		expect(r.salePrice).toBeCloseTo(80, 10);
		expect(r.amountSaved).toBeCloseTo(20, 10);
	});

	it('$49.99 at 30% off -> $34.993 sale, $14.997 saved', () => {
		const r = applyDiscount(49.99, 30);
		expect(r.salePrice).toBeCloseTo(34.993, 10);
		expect(r.amountSaved).toBeCloseTo(14.997, 10);
	});

	it('$250 at 15% off -> $212.50 sale, $37.50 saved', () => {
		const r = applyDiscount(250, 15);
		expect(r.salePrice).toBeCloseTo(212.5, 10);
		expect(r.amountSaved).toBeCloseTo(37.5, 10);
	});

	it('0% off changes nothing', () => {
		const r = applyDiscount(60, 0);
		expect(r.salePrice).toBe(60);
		expect(r.amountSaved).toBe(0);
	});

	it('negative discount acts as a markup ($100 at -10% -> $110 sale)', () => {
		const r = applyDiscount(100, -10);
		expect(r.salePrice).toBeCloseTo(110, 10);
		expect(r.amountSaved).toBeCloseTo(-10, 10);
	});
});

describe('percentDifference', () => {
	it('10 vs 12 = 18.1818...% (2 / 11 * 100)', () => {
		expect(percentDifference(10, 12)).toBeCloseTo((2 / 11) * 100, 6);
	});

	it('8 vs 10 = 22.2222...% (2 / 9 * 100)', () => {
		expect(percentDifference(8, 10)).toBeCloseTo((2 / 9) * 100, 6);
	});

	it('45 vs 55 = 20%', () => {
		expect(percentDifference(45, 55)).toBeCloseTo(20, 10);
	});

	it('is order-independent: diff(a,b) === diff(b,a)', () => {
		expect(percentDifference(10, 12)).toBeCloseTo(percentDifference(12, 10)!, 10);
	});

	it('identical values have 0% difference', () => {
		expect(percentDifference(100, 100)).toBe(0);
	});

	it('a+b = 0 is undefined -> null (e.g. -5 and 5)', () => {
		expect(percentDifference(-5, 5)).toBeNull();
	});

	it('both zero is undefined -> null', () => {
		expect(percentDifference(0, 0)).toBeNull();
	});
});
