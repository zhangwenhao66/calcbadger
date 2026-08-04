import { describe, expect, it } from 'vitest';
import { commonYearIn, convert, convertAll, roundSig, SECONDS_PER_UNIT } from '../src/lib/time';

// Expected values independently computed in Python from the exact seconds-per-unit
// factors (BIPM SI Brochure §4.1 for second/minute/hour/day/week; mean Gregorian
// month/year derived from the calendar's own 400-year-cycle = 146,097-day rule),
// not read back from this implementation:
//   S = {second:1, minute:60, hour:3600, day:86400, week:604800, month:2629746, year:31556952}
//   conv(v, frm, to) = v * S[frm] / S[to]

describe('convert — exact-definition pairs (SI / BIPM)', () => {
	it('1 minute = 60 seconds exactly', () => {
		expect(convert(1, 'minute', 'second')).toBeCloseTo(60, 10);
	});

	it('1 hour = 3600 seconds exactly', () => {
		expect(convert(1, 'hour', 'second')).toBeCloseTo(3600, 10);
	});

	it('1 day = 24 hours exactly', () => {
		expect(convert(1, 'day', 'hour')).toBeCloseTo(24, 10);
	});

	it('1 week = 7 days exactly', () => {
		expect(convert(1, 'week', 'day')).toBeCloseTo(7, 10);
	});

	it('86,400 seconds = 1 day exactly', () => {
		expect(convert(86400, 'second', 'day')).toBeCloseTo(1, 10);
	});
});

describe('convert — mean Gregorian month/year (146,097 days / 400-year cycle)', () => {
	it('1 mean year = 365.2425 days', () => {
		expect(convert(1, 'year', 'day')).toBeCloseTo(365.2425, 10);
	});

	it('1 mean year = 8,765.82 hours', () => {
		expect(convert(1, 'year', 'hour')).toBeCloseTo(8765.82, 8);
	});

	it('1 mean year = 52.1775 weeks', () => {
		expect(convert(1, 'year', 'week')).toBeCloseTo(52.1775, 8);
	});

	it('1 mean year = 12 months exactly', () => {
		expect(convert(1, 'year', 'month')).toBeCloseTo(12, 9);
	});

	it('1 mean month = 30.436875 days', () => {
		expect(convert(1, 'month', 'day')).toBeCloseTo(30.436875, 9);
	});

	it('1 mean month = 4.348125 weeks', () => {
		expect(convert(1, 'month', 'week')).toBeCloseTo(4.348125, 9);
	});

	it('3 years = 94,670,856 seconds', () => {
		expect(convert(3, 'year', 'second')).toBeCloseTo(94670856, 4);
	});
});

describe('SECONDS_PER_UNIT sanity', () => {
	it('carries the exact defining constants', () => {
		expect(SECONDS_PER_UNIT.second).toBe(1);
		expect(SECONDS_PER_UNIT.minute).toBe(60);
		expect(SECONDS_PER_UNIT.hour).toBe(3600);
		expect(SECONDS_PER_UNIT.day).toBe(86400);
		expect(SECONDS_PER_UNIT.week).toBe(604800);
		expect(SECONDS_PER_UNIT.month).toBe(2629746);
		expect(SECONDS_PER_UNIT.year).toBe(31556952);
	});
});

describe('convertAll', () => {
	it('round-trips the input value in its own unit', () => {
		const result = convertAll(42, 'hour');
		expect(result.hour).toBeCloseTo(42, 10);
	});

	it('produces all seven units', () => {
		const result = convertAll(1, 'day');
		expect(Object.keys(result).sort()).toEqual(
			['second', 'minute', 'hour', 'day', 'week', 'month', 'year'].sort(),
		);
	});
});

describe('roundSig', () => {
	it('rounds to 6 significant figures by default', () => {
		expect(roundSig(1 / 3)).toBe(0.333333);
	});

	it('passes through 0 and non-finite values unchanged', () => {
		expect(roundSig(0)).toBe(0);
		expect(roundSig(Infinity)).toBe(Infinity);
	});
});

describe('commonYearIn — plain 365/366-day calendar-year quick facts', () => {
	it('365-day year = 8,760 hours', () => {
		expect(commonYearIn('hour')).toBeCloseTo(8760, 8);
	});

	it('365-day year = 525,600 minutes', () => {
		expect(commonYearIn('minute')).toBeCloseTo(525600, 6);
	});

	it('365-day year = 31,536,000 seconds', () => {
		expect(commonYearIn('second')).toBeCloseTo(31536000, 4);
	});

	it('366-day leap year = 8,784 hours', () => {
		expect(commonYearIn('hour', 366)).toBeCloseTo(8784, 8);
	});

	it('366-day leap year = 31,622,400 seconds', () => {
		expect(commonYearIn('second', 366)).toBeCloseTo(31622400, 4);
	});
});
