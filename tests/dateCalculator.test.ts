import { describe, expect, it } from 'vitest';
import {
	addDays,
	calendarDiff,
	daysBetween,
	daysInMonth,
	fixedHoliday,
	formatYMD,
	isValidDate,
	nextOccurrence,
	usThanksgiving,
	weekdayIndex,
	type YMD,
} from '../src/lib/dateCalculator';

// Every expected value below was independently computed with Python's
// datetime module (daysBetween/addDays) and dateutil.relativedelta
// (calendarDiff) — a different implementation of the same proleptic
// Gregorian calendar, not derived from this file's own output.

describe('daysInMonth', () => {
	it('handles leap and common Februaries', () => {
		expect(daysInMonth(2024, 2)).toBe(29); // 2024 divisible by 4, not by 100
		expect(daysInMonth(2023, 2)).toBe(28);
		expect(daysInMonth(1900, 2)).toBe(28); // divisible by 100, not by 400
		expect(daysInMonth(2000, 2)).toBe(29); // divisible by 400
	});

	it('handles 30- and 31-day months', () => {
		expect(daysInMonth(2026, 4)).toBe(30);
		expect(daysInMonth(2026, 1)).toBe(31);
	});

	it('does not fall into JS Date\'s 2-digit-year trap (year 50 is not remapped to 1950)', () => {
		// new Date(Date.UTC(50, ...)) silently becomes 1950 in plain JS. Year 50
		// is not a leap year (not divisible by 4), so Feb 50 must be 28 days —
		// if this ever regresses to 29, the 2-digit-year bug is back.
		expect(daysInMonth(50, 2)).toBe(28);
	});
});

describe('isValidDate', () => {
	it('accepts real calendar dates', () => {
		expect(isValidDate({ year: 2026, month: 8, day: 6 })).toBe(true);
		expect(isValidDate({ year: 2024, month: 2, day: 29 })).toBe(true);
	});

	it('rejects Feb 29 in a non-leap year and other invalid dates', () => {
		expect(isValidDate({ year: 2023, month: 2, day: 29 })).toBe(false);
		expect(isValidDate({ year: 2026, month: 4, day: 31 })).toBe(false);
		expect(isValidDate({ year: 2026, month: 13, day: 1 })).toBe(false);
		expect(isValidDate({ year: 2026, month: 0, day: 1 })).toBe(false);
		expect(isValidDate({ year: 2026, month: 1, day: 0 })).toBe(false);
		expect(isValidDate({ year: 2026, month: 1.5, day: 1 })).toBe(false);
	});
});

describe('daysBetween', () => {
	const cases: [YMD, YMD, number][] = [
		[{ year: 2000, month: 1, day: 1 }, { year: 2000, month: 3, day: 1 }, 60], // spans leap Feb
		[{ year: 2024, month: 2, day: 28 }, { year: 2024, month: 3, day: 1 }, 2], // leap year, Feb 29 exists
		[{ year: 1970, month: 1, day: 1 }, { year: 2000, month: 1, day: 1 }, 10957],
		[{ year: 2026, month: 8, day: 6 }, { year: 2026, month: 8, day: 6 }, 0],
		[{ year: 2026, month: 8, day: 6 }, { year: 2026, month: 9, day: 5 }, 30],
		[{ year: 1990, month: 3, day: 15 }, { year: 2026, month: 1, day: 1 }, 13076],
		[{ year: 2026, month: 1, day: 1 }, { year: 2026, month: 12, day: 25 }, 358],
	];

	it.each(cases)('from %o to %o is %i days', (start, end, expected) => {
		expect(daysBetween(start, end)).toBe(expected);
	});

	it('is negative when end precedes start', () => {
		expect(daysBetween({ year: 2026, month: 9, day: 5 }, { year: 2026, month: 8, day: 6 })).toBe(-30);
	});

	it('is correct for a 2-digit start year, not off by ~1900 years (JS Date 2-digit-year trap)', () => {
		// Independently verified with Python: (date(2026,1,1) - date(50,1,1)).days == 721719.
		// A regression to Date.UTC(year, ...)'s 2-digit-year remapping would instead
		// silently compute the year-1950-to-2026 span (27,759 days) here.
		expect(daysBetween({ year: 50, month: 1, day: 1 }, { year: 2026, month: 1, day: 1 })).toBe(721719);
	});
});

describe('addDays', () => {
	const base: YMD = { year: 2026, month: 8, day: 6 };
	const additions: [number, YMD][] = [
		[7, { year: 2026, month: 8, day: 13 }],
		[10, { year: 2026, month: 8, day: 16 }],
		[30, { year: 2026, month: 9, day: 5 }],
		[45, { year: 2026, month: 9, day: 20 }],
		[60, { year: 2026, month: 10, day: 5 }],
		[90, { year: 2026, month: 11, day: 4 }],
		[120, { year: 2026, month: 12, day: 4 }],
		[180, { year: 2027, month: 2, day: 2 }],
		[365, { year: 2027, month: 8, day: 6 }],
		[-10, { year: 2026, month: 7, day: 27 }],
	];

	it.each(additions)('base %+i days = %o', (n, expected) => {
		expect(addDays(base, n)).toEqual(expected);
	});

	it('round-trips through a leap day', () => {
		// Adding 1 year (365 days) from Feb 29 2024 lands on Feb 28 2025 (no Feb 29 that year).
		expect(addDays({ year: 2024, month: 2, day: 29 }, 365)).toEqual({ year: 2025, month: 2, day: 28 });
	});
});

describe('calendarDiff', () => {
	it('matches dateutil.relativedelta for a multi-decade span', () => {
		expect(calendarDiff({ year: 1990, month: 3, day: 15 }, { year: 2026, month: 1, day: 1 })).toEqual({
			years: 35,
			months: 9,
			days: 17,
			negative: false,
		});
	});

	it('handles an exact 2-month span with no day borrow', () => {
		expect(calendarDiff({ year: 2000, month: 1, day: 1 }, { year: 2000, month: 3, day: 1 })).toEqual({
			years: 0,
			months: 2,
			days: 0,
			negative: false,
		});
	});

	it('borrows a day across the Feb/Mar boundary in a leap year', () => {
		expect(calendarDiff({ year: 2024, month: 2, day: 28 }, { year: 2024, month: 3, day: 1 })).toEqual({
			years: 0,
			months: 0,
			days: 2,
			negative: false,
		});
	});

	it('is 11 months 30 days from Feb 29 leap day to the following Feb 28 (DATEDIF convention)', () => {
		// The month+day (2,28) has not yet reached (2,29), so DATEDIF counts 0
		// whole years elapsed — one day short of a full year. dateutil's
		// relativedelta instead reports exactly 1 year for this same pair by
		// clamping to the nearest valid day; see the calendarDiff docstring.
		expect(calendarDiff({ year: 2024, month: 2, day: 29 }, { year: 2025, month: 2, day: 28 })).toEqual({
			years: 0,
			months: 11,
			days: 30,
			negative: false,
		});
	});

	it('gives exactly 30 years with no leap-year drift', () => {
		expect(calendarDiff({ year: 1970, month: 1, day: 1 }, { year: 2000, month: 1, day: 1 })).toEqual({
			years: 30,
			months: 0,
			days: 0,
			negative: false,
		});
	});

	it('borrows both a month and days', () => {
		expect(calendarDiff({ year: 2026, month: 1, day: 15 }, { year: 2026, month: 3, day: 10 })).toEqual({
			years: 0,
			months: 1,
			days: 23,
			negative: false,
		});
	});

	it('flags negative (end before start) and reports the magnitude', () => {
		expect(calendarDiff({ year: 2026, month: 3, day: 10 }, { year: 2026, month: 1, day: 15 })).toEqual({
			years: 0,
			months: 1,
			days: 23,
			negative: true,
		});
	});

	it('is all zero for the same date', () => {
		expect(calendarDiff({ year: 2026, month: 8, day: 6 }, { year: 2026, month: 8, day: 6 })).toEqual({
			years: 0,
			months: 0,
			days: 0,
			negative: false,
		});
	});
});

describe('weekdayIndex', () => {
	it('identifies known weekdays (0=Sunday)', () => {
		expect(weekdayIndex({ year: 2026, month: 1, day: 1 })).toBe(4); // Thursday
		expect(weekdayIndex({ year: 2026, month: 8, day: 6 })).toBe(4); // Thursday
	});

	it('is correct for a 2-digit year, not the weekday of the remapped 1900s date', () => {
		// Verified independently with Python: date(1,1,1).weekday() == 0 (Monday),
		// which is weekdayIndex 1 in this module's 0=Sunday convention. The JS
		// 2-digit-year trap would instead report year 1 as Date.UTC(1,...) => 1901,
		// whose Jan 1 falls on a Tuesday (weekdayIndex 2).
		expect(weekdayIndex({ year: 1, month: 1, day: 1 })).toBe(1); // Monday
	});
});

describe('fixedHoliday', () => {
	it('returns the fixed calendar date for the given year', () => {
		expect(fixedHoliday('christmas', 2026)).toEqual({ year: 2026, month: 12, day: 25 });
		expect(fixedHoliday('halloween', 2026)).toEqual({ year: 2026, month: 10, day: 31 });
		expect(fixedHoliday('newYearsDay', 2027)).toEqual({ year: 2027, month: 1, day: 1 });
	});
});

describe('usThanksgiving', () => {
	// Verified against Python: 4th Thursday of November for each year.
	const known: [number, YMD][] = [
		[2026, { year: 2026, month: 11, day: 26 }],
		[2027, { year: 2027, month: 11, day: 25 }],
		[2028, { year: 2028, month: 11, day: 23 }],
		[2029, { year: 2029, month: 11, day: 22 }],
		[2030, { year: 2030, month: 11, day: 28 }],
	];

	it.each(known)('%i -> %o', (year, expected) => {
		expect(usThanksgiving(year)).toEqual(expected);
		expect(weekdayIndex(usThanksgiving(year))).toBe(4); // always a Thursday
	});
});

describe('nextOccurrence', () => {
	it('returns this year when the date has not passed yet', () => {
		const from: YMD = { year: 2026, month: 1, day: 1 };
		expect(nextOccurrence((y) => fixedHoliday('christmas', y), from)).toEqual({
			year: 2026,
			month: 12,
			day: 25,
		});
	});

	it('rolls to next year when the date already passed', () => {
		const from: YMD = { year: 2026, month: 12, day: 26 };
		expect(nextOccurrence((y) => fixedHoliday('christmas', y), from)).toEqual({
			year: 2027,
			month: 12,
			day: 25,
		});
	});

	it('treats the holiday itself as 0 days away, not rolled to next year', () => {
		const from: YMD = { year: 2026, month: 12, day: 25 };
		expect(nextOccurrence((y) => fixedHoliday('christmas', y), from)).toEqual({
			year: 2026,
			month: 12,
			day: 25,
		});
	});
});

describe('formatYMD', () => {
	it('formats as "Month D, YYYY"', () => {
		expect(formatYMD({ year: 2026, month: 8, day: 6 })).toBe('August 6, 2026');
		expect(formatYMD({ year: 2026, month: 1, day: 1 })).toBe('January 1, 2026');
	});
});
