import { describe, expect, it } from 'vitest';
import {
	breakdownSeconds,
	clockTimeToSeconds,
	durationBetweenDateTimes,
	durationBetweenTimes,
	formatClockTime12,
	formatClockTime24,
	from12Hour,
	isValidClockTime,
	secondsToClockTime,
	shiftTime,
	to12Hour,
	type ClockTime,
} from '../src/lib/timeDuration';

// Every expected value below was independently computed with a standalone
// Python script (plain integer seconds arithmetic for the clock-time cases,
// datetime.date subtraction for the date-time cases) — a separate
// implementation of the same arithmetic, not derived from this file's own
// output. See the timeDuration.ts header comment for the underlying formula
// authority (BIPM SI Brochure for second/minute/hour/day ratios; the site's
// existing dateCalculator.ts epoch-day functions for calendar-day spans).

function t(hours: number, minutes: number, seconds = 0): ClockTime {
	return { hours, minutes, seconds };
}

describe('isValidClockTime', () => {
	it('accepts in-range integer times', () => {
		expect(isValidClockTime(t(0, 0, 0))).toBe(true);
		expect(isValidClockTime(t(23, 59, 59))).toBe(true);
	});

	it('rejects out-of-range or non-integer fields', () => {
		expect(isValidClockTime(t(24, 0))).toBe(false);
		expect(isValidClockTime(t(-1, 0))).toBe(false);
		expect(isValidClockTime(t(9, 60))).toBe(false);
		expect(isValidClockTime({ hours: 9.5, minutes: 0, seconds: 0 })).toBe(false);
	});
});

describe('clockTimeToSeconds / secondsToClockTime', () => {
	it('round-trips a plain time', () => {
		expect(clockTimeToSeconds(t(1, 30, 0))).toBe(5400);
		expect(secondsToClockTime(5400)).toEqual(t(1, 30, 0));
	});

	it('wraps seconds past 24h back into 0-86399', () => {
		// 90,000s = 25h -> wraps to 01:00:00
		expect(secondsToClockTime(90000)).toEqual(t(1, 0, 0));
	});

	it('wraps negative seconds to the previous-day equivalent', () => {
		// -7,200s = -2h -> wraps to 22:00:00
		expect(secondsToClockTime(-7200)).toEqual(t(22, 0, 0));
	});
});

describe('to12Hour / from12Hour', () => {
	it('midnight is 12:00 AM', () => {
		expect(to12Hour(t(0, 0))).toEqual({ hour12: 12, period: 'AM' });
		expect(from12Hour(12, 0, 0, 'AM')).toEqual(t(0, 0, 0));
	});

	it('noon is 12:00 PM', () => {
		expect(to12Hour(t(12, 0))).toEqual({ hour12: 12, period: 'PM' });
		expect(from12Hour(12, 0, 0, 'PM')).toEqual(t(12, 0, 0));
	});

	it('handles a standard afternoon time', () => {
		expect(to12Hour(t(13, 0))).toEqual({ hour12: 1, period: 'PM' });
		expect(from12Hour(1, 0, 0, 'PM')).toEqual(t(13, 0, 0));
	});

	it('handles a standard morning time', () => {
		expect(to12Hour(t(9, 15))).toEqual({ hour12: 9, period: 'AM' });
		expect(from12Hour(9, 15, 0, 'AM')).toEqual(t(9, 15, 0));
	});
});

describe('durationBetweenTimes', () => {
	it('a standard 9:15 AM to 5:45 PM workday is 8h30m', () => {
		const result = durationBetweenTimes(t(9, 15), t(17, 45));
		expect(result).toEqual({
			totalSeconds: 30600,
			negative: false,
			days: 0,
			hours: 8,
			minutes: 30,
			seconds: 0,
			decimalHours: 8.5,
		});
	});

	it('an overnight 10 PM to 6 AM shift rolls to the next day (8h)', () => {
		const result = durationBetweenTimes(t(22, 0), t(6, 0));
		expect(result.hours).toBe(8);
		expect(result.minutes).toBe(0);
		expect(result.decimalHours).toBe(8);
		expect(result.negative).toBe(false);
	});

	it('identical start and end times means a full 24h day, not zero', () => {
		const result = durationBetweenTimes(t(9, 0), t(9, 0));
		expect(result.days).toBe(1);
		expect(result.hours).toBe(0);
		expect(result.decimalHours).toBe(24);
	});

	it('a short 30-minute span', () => {
		const result = durationBetweenTimes(t(8, 0), t(8, 30));
		expect(result.decimalHours).toBe(0.5);
	});
});

describe('shiftTime', () => {
	it('adding 2h to 23:30 rolls forward one day to 01:30', () => {
		const result = shiftTime(t(23, 30, 0), 2 * 3600, 1);
		expect(result.daysRolled).toBe(1);
		expect(result.result).toEqual(t(1, 30, 0));
	});

	it('subtracting 3h from 01:00 rolls back one day to 22:00', () => {
		const result = shiftTime(t(1, 0, 0), 3 * 3600, -1);
		expect(result.daysRolled).toBe(-1);
		expect(result.result).toEqual(t(22, 0, 0));
	});

	it('adding within the same day does not roll', () => {
		const result = shiftTime(t(10, 0, 0), 90 * 60, 1);
		expect(result.daysRolled).toBe(0);
		expect(result.result).toEqual(t(11, 30, 0));
	});
});

describe('durationBetweenDateTimes', () => {
	it('exactly 2 calendar days apart at the same time of day is 48h', () => {
		const result = durationBetweenDateTimes(
			{ date: { year: 2026, month: 1, day: 1 }, time: t(9, 0) },
			{ date: { year: 2026, month: 1, day: 3 }, time: t(9, 0) },
		);
		expect(result.days).toBe(2);
		expect(result.hours).toBe(0);
		expect(result.decimalHours).toBe(48);
		expect(result.negative).toBe(false);
	});

	it('an overnight span across a date boundary is 8h30m, matching the same-day case', () => {
		const result = durationBetweenDateTimes(
			{ date: { year: 2026, month: 1, day: 1 }, time: t(22, 0) },
			{ date: { year: 2026, month: 1, day: 2 }, time: t(6, 30) },
		);
		expect(result.days).toBe(0);
		expect(result.hours).toBe(8);
		expect(result.minutes).toBe(30);
		expect(result.decimalHours).toBe(8.5);
	});

	it('flags a negative span when the end date-time precedes the start', () => {
		const result = durationBetweenDateTimes(
			{ date: { year: 2026, month: 1, day: 5 }, time: t(10, 0) },
			{ date: { year: 2026, month: 1, day: 1 }, time: t(10, 0) },
		);
		expect(result.negative).toBe(true);
		expect(result.days).toBe(4);
		expect(result.decimalHours).toBe(96);
	});
});

describe('breakdownSeconds', () => {
	it('breaks a mixed duration into days/hours/minutes/seconds', () => {
		// 90,061s = 1d 1h 1m 1s
		expect(breakdownSeconds(90061)).toEqual({
			totalSeconds: 90061,
			negative: false,
			days: 1,
			hours: 1,
			minutes: 1,
			seconds: 1,
			decimalHours: 90061 / 3600,
		});
	});
});

describe('formatClockTime12 / formatClockTime24', () => {
	it('formats a morning time both ways', () => {
		expect(formatClockTime12(t(9, 5))).toBe('9:05 AM');
		expect(formatClockTime24(t(9, 5))).toBe('09:05');
	});

	it('formats midnight and noon correctly in 12h format', () => {
		expect(formatClockTime12(t(0, 0))).toBe('12:00 AM');
		expect(formatClockTime12(t(12, 0))).toBe('12:00 PM');
	});
});
