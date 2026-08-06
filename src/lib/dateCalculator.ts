/**
 * Calendar date arithmetic: difference between two dates, add/subtract days,
 * and countdowns to fixed and floating US holidays.
 *
 * Formula authority: all arithmetic uses the proleptic Gregorian calendar as
 * defined by ISO 8601 and implemented by ECMAScript's Date object (ECMA-262
 * §21.4) — the same calendar convention used by every mainstream date
 * library. Epoch-day math (UTC midnight, divided by 86,400,000 ms) sidesteps
 * timezone and DST entirely; every date here is a pure calendar date with no
 * time-of-day component.
 *
 * Thanksgiving (US): fixed as "the fourth Thursday in November" by joint
 * resolution of Congress, signed Dec 26 1941, codified at 5 U.S.C. § 6103.
 * Christmas (Dec 25), Halloween (Oct 31) and New Year's Day (Jan 1) are
 * fixed calendar dates with no computation required.
 */

export interface YMD {
	year: number;
	month: number; // 1-12
	day: number;
}

/**
 * Builds a UTC Date from explicit calendar fields, for any year 1-9999.
 * Deliberately NOT `new Date(Date.UTC(year, month, day))` — passing the year
 * as a numeric argument to the Date constructor/Date.UTC() silently remaps
 * any year 0-99 to 1900-1999 (`Date.UTC(50, 0, 1)` is 1950, not year 50).
 * `setUTCFullYear` has no such special case and treats every year literally.
 */
function utcDateFromYMD({ year, month, day }: YMD): Date {
	const d = new Date(0);
	d.setUTCFullYear(year, month - 1, day);
	return d;
}

export function daysInMonth(year: number, month: number): number {
	// setUTCFullYear(year, month, 0) targets month's 0-indexed *next* month
	// (month is already 1-indexed, so it lines up one month ahead) and day 0
	// of that month rolls back to the last day of the target month — the same
	// trick the original Date.UTC(year, month, 0) form used, minus its
	// 2-digit-year bug.
	const d = new Date(0);
	d.setUTCFullYear(year, month, 0);
	return d.getUTCDate();
}

export function isValidDate({ year, month, day }: YMD): boolean {
	if (![year, month, day].every(Number.isInteger)) return false;
	if (year < 1 || year > 9999) return false;
	if (month < 1 || month > 12) return false;
	if (day < 1) return false;
	return day <= daysInMonth(year, month);
}

function epochDay(date: YMD): number {
	return Math.floor(utcDateFromYMD(date).getTime() / 86400000);
}

function fromEpochDay(epoch: number): YMD {
	const d = new Date(epoch * 86400000);
	return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Total whole days from `start` to `end` (negative if `end` precedes `start`). */
export function daysBetween(start: YMD, end: YMD): number {
	return epochDay(end) - epochDay(start);
}

/** Returns the date `n` calendar days after `date` (negative `n` goes backward). */
export function addDays(date: YMD, n: number): YMD {
	return fromEpochDay(epochDay(date) + n);
}

export interface CalendarDiff {
	years: number;
	months: number;
	days: number;
	/** True when `end` precedes `start` — years/months/days are the magnitude, not signed. */
	negative: boolean;
}

/**
 * Calendar-aware years/months/days breakdown (the "your age is 35 years, 9
 * months, 17 days" convention). Subtracts day-month-year with a borrow from
 * the actual length of the preceding calendar month — the method documented
 * for Microsoft Excel's DATEDIF("y"/"ym"/"md") — and matches Python's
 * dateutil.relativedelta for every case except one documented ambiguity: an
 * anniversary of Feb 29 measured in a non-leap year. DATEDIF's rule counts a
 * year as elapsed only once the month+day is reached or passed, so Feb 29 to
 * the following Feb 28 is 11 months 30 days, one day short of a full year;
 * relativedelta instead clamps to the nearest valid day and calls it exactly
 * 1 year. Both are defensible, differ only on that single edge case, and this
 * function follows DATEDIF's — see dateCalculator.test.ts for the verification
 * against both references.
 */
export function calendarDiff(start: YMD, end: YMD): CalendarDiff {
	let a = start;
	let b = end;
	let negative = false;
	if (epochDay(a) > epochDay(b)) {
		[a, b] = [b, a];
		negative = true;
	}

	let years = b.year - a.year;
	let months = b.month - a.month;
	let days = b.day - a.day;

	if (days < 0) {
		const prevMonth = b.month === 1 ? 12 : b.month - 1;
		const prevMonthYear = b.month === 1 ? b.year - 1 : b.year;
		days += daysInMonth(prevMonthYear, prevMonth);
		months -= 1;
	}
	if (months < 0) {
		months += 12;
		years -= 1;
	}

	return { years, months, days, negative };
}

/** 0=Sunday .. 6=Saturday, matching Date.prototype.getUTCDay(). */
export function weekdayIndex(date: YMD): number {
	return utcDateFromYMD(date).getUTCDay();
}

export type FixedHoliday = 'christmas' | 'halloween' | 'newYearsDay';

export function fixedHoliday(name: FixedHoliday, year: number): YMD {
	switch (name) {
		case 'christmas':
			return { year, month: 12, day: 25 };
		case 'halloween':
			return { year, month: 10, day: 31 };
		case 'newYearsDay':
			return { year, month: 1, day: 1 };
	}
}

/** US Thanksgiving: the fourth Thursday in November (5 U.S.C. § 6103). */
export function usThanksgiving(year: number): YMD {
	const nov1Weekday = weekdayIndex({ year, month: 11, day: 1 });
	const THURSDAY = 4;
	const firstThursday = 1 + ((THURSDAY - nov1Weekday + 7) % 7);
	return { year, month: 11, day: firstThursday + 21 };
}

/**
 * The next occurrence of an annual date on/after `from` — rolls to next year
 * if this year's date has already passed. `from` counts as "already arrived"
 * (0 days until), matching how a countdown reads on the holiday itself.
 */
export function nextOccurrence(getDate: (year: number) => YMD, from: YMD): YMD {
	const candidate = getDate(from.year);
	return epochDay(candidate) >= epochDay(from) ? candidate : getDate(from.year + 1);
}

export function ymdFromJsDate(d: Date): YMD {
	return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export function formatYMD(date: YMD): string {
	return `${MONTH_NAMES[date.month - 1]} ${date.day}, ${date.year}`;
}
