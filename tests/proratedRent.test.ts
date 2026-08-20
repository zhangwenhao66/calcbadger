import { describe, expect, it } from 'vitest';
import {
	computeProration,
	isLeapYear,
	occupiedDaysForMoveIn,
	occupiedDaysForMoveOut,
} from '../src/lib/proratedRent';

/**
 * Expected values: hand-computed with Python's calendar module (2026-08-20)
 * before checking against the implementation. daysInMonth/leap-year figures
 * cross-checked against the proleptic Gregorian calendar (the same one
 * ECMAScript's Date object implements, per ECMA-262 §21.4), not derived
 * from this codebase's own output.
 */

describe('occupiedDaysForMoveIn', () => {
	it('June 2026 (30-day month), move in on the 16th -> 15 days occupied', () => {
		expect(occupiedDaysForMoveIn(2026, 6, 16)).toBe(15);
	});

	it('moving in on the 1st occupies the whole month', () => {
		expect(occupiedDaysForMoveIn(2026, 3, 1)).toBe(31);
	});

	it('moving in on the last day occupies exactly 1 day', () => {
		expect(occupiedDaysForMoveIn(2026, 4, 30)).toBe(1);
	});

	it('day 0 or a day past the month length is invalid', () => {
		expect(occupiedDaysForMoveIn(2026, 4, 0)).toBeNull();
		expect(occupiedDaysForMoveIn(2026, 4, 31)).toBeNull();
	});
});

describe('occupiedDaysForMoveOut', () => {
	it('September 2026, move out on the 10th -> 10 days occupied (1st through the 10th)', () => {
		expect(occupiedDaysForMoveOut(2026, 9, 10)).toBe(10);
	});
});

describe('isLeapYear', () => {
	it('2028 is a leap year (divisible by 4, not a century year)', () => {
		expect(isLeapYear(2028)).toBe(true);
	});

	it('2026 is not a leap year', () => {
		expect(isLeapYear(2026)).toBe(false);
	});

	it('2000 is a leap year (divisible by 400)', () => {
		expect(isLeapYear(2000)).toBe(true);
	});

	it('1900 is not a leap year (divisible by 100, not by 400)', () => {
		expect(isLeapYear(1900)).toBe(false);
	});
});

describe('computeProration', () => {
	it('June 2026 (30-day month), $1500 rent, 15 days occupied: actual and banker\'s-month agree at $750, annual differs', () => {
		const date = { year: 2026, month: 6, day: 1 };
		const actual = computeProration(1500, 'actual', date, 15)!;
		const banker = computeProration(1500, 'banker', date, 15)!;
		const annual = computeProration(1500, 'annual', date, 15)!;
		expect(actual.proratedRent).toBeCloseTo(750, 2);
		expect(banker.proratedRent).toBeCloseTo(750, 2);
		expect(annual.proratedRent).toBeCloseTo(739.73, 2);
	});

	it('March 2026 (31-day month), $1500 rent, moved in on the 20th (12 days occupied): the three methods diverge', () => {
		const date = { year: 2026, month: 3, day: 1 };
		const days = occupiedDaysForMoveIn(2026, 3, 20)!;
		expect(days).toBe(12);
		const actual = computeProration(1500, 'actual', date, days)!;
		const banker = computeProration(1500, 'banker', date, days)!;
		const annual = computeProration(1500, 'annual', date, days)!;
		expect(actual.proratedRent).toBeCloseTo(580.65, 2);
		expect(banker.proratedRent).toBeCloseTo(600, 2);
		expect(annual.proratedRent).toBeCloseTo(591.78, 2);
	});

	it('Feb 2028 (leap year, 29-day month), $1000 rent, moved in on the 10th (20 days occupied)', () => {
		const date = { year: 2028, month: 2, day: 1 };
		const days = occupiedDaysForMoveIn(2028, 2, 10)!;
		expect(days).toBe(20);
		const actual = computeProration(1000, 'actual', date, days)!;
		const banker = computeProration(1000, 'banker', date, days)!;
		const annual = computeProration(1000, 'annual', date, days)!;
		expect(actual.proratedRent).toBeCloseTo(689.66, 2);
		expect(banker.proratedRent).toBeCloseTo(666.67, 2);
		expect(annual.proratedRent).toBeCloseTo(655.74, 2);
	});

	it('Sept 2026 (30-day month), $1800 rent, moved out on the 10th (10 days occupied)', () => {
		const date = { year: 2026, month: 9, day: 1 };
		const days = occupiedDaysForMoveOut(2026, 9, 10)!;
		expect(days).toBe(10);
		const actual = computeProration(1800, 'actual', date, days)!;
		const annual = computeProration(1800, 'annual', date, days)!;
		expect(actual.proratedRent).toBeCloseTo(600, 2);
		expect(annual.proratedRent).toBeCloseTo(591.78, 2);
	});

	it('0 days occupied -> $0 rent regardless of method', () => {
		const date = { year: 2026, month: 6, day: 1 };
		expect(computeProration(1500, 'actual', date, 0)!.proratedRent).toBe(0);
	});

	it('full month occupied -> prorated rent equals the monthly rent for actual and banker methods on a 30-day month', () => {
		const date = { year: 2026, month: 6, day: 1 };
		expect(computeProration(1500, 'actual', date, 30)!.proratedRent).toBeCloseTo(1500, 6);
		expect(computeProration(1500, 'banker', date, 30)!.proratedRent).toBeCloseTo(1500, 6);
	});

	it('negative rent is invalid', () => {
		const date = { year: 2026, month: 6, day: 1 };
		expect(computeProration(-100, 'actual', date, 10)).toBeNull();
	});

	it('daysOccupied greater than the month length is invalid', () => {
		const date = { year: 2026, month: 6, day: 1 };
		expect(computeProration(1500, 'actual', date, 31)).toBeNull();
	});

	it('an invalid calendar month is rejected', () => {
		expect(computeProration(1500, 'actual', { year: 2026, month: 13, day: 1 }, 10)).toBeNull();
	});
});
