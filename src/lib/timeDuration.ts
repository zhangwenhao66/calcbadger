/**
 * Time-of-day duration arithmetic: elapsed time between two clock times
 * (with automatic next-day rollover), adding/subtracting a duration from a
 * clock time, and elapsed time between two full date-times.
 *
 * Formula authority: minute (60 s), hour (60 min) and day (24 h = 86,400 s)
 * are exact by definition per the BIPM SI Brochure Annex 1 — the same source
 * this site's Time Converter cites for identical ratios. Calendar-day
 * arithmetic for the date-time mode reuses dateCalculator.ts's epoch-day
 * functions (proleptic Gregorian calendar, ECMA-262 §21.4), so a "day" in
 * that mode always means one full calendar date with no leap-second
 * adjustment, consistent with every other date tool on this site.
 */

import { daysBetween, type YMD } from './dateCalculator';

export interface ClockTime {
	hours: number; // 0-23
	minutes: number; // 0-59
	seconds: number; // 0-59
}

export function isValidClockTime(t: ClockTime): boolean {
	return (
		Number.isInteger(t.hours) &&
		t.hours >= 0 &&
		t.hours <= 23 &&
		Number.isInteger(t.minutes) &&
		t.minutes >= 0 &&
		t.minutes <= 59 &&
		Number.isInteger(t.seconds) &&
		t.seconds >= 0 &&
		t.seconds <= 59
	);
}

export function clockTimeToSeconds(t: ClockTime): number {
	return t.hours * 3600 + t.minutes * 60 + t.seconds;
}

/** Wraps any integer second count into a single 0–86,399s clock time. */
export function secondsToClockTime(totalSeconds: number): ClockTime {
	const s = ((Math.round(totalSeconds) % 86400) + 86400) % 86400;
	return {
		hours: Math.floor(s / 3600),
		minutes: Math.floor((s % 3600) / 60),
		seconds: s % 60,
	};
}

export type Period = 'AM' | 'PM';

/** 12-hour clock convention: 12:00 AM is midnight (hour 0), 12:00 PM is noon (hour 12). */
export function to12Hour(t: ClockTime): { hour12: number; period: Period } {
	const period: Period = t.hours < 12 ? 'AM' : 'PM';
	const hour12 = t.hours % 12 === 0 ? 12 : t.hours % 12;
	return { hour12, period };
}

export function from12Hour(hour12: number, minutes: number, seconds: number, period: Period): ClockTime {
	const hours = (hour12 % 12) + (period === 'PM' ? 12 : 0);
	return { hours, minutes, seconds };
}

export interface DurationBreakdown {
	/** Signed; negative when the end point precedes the start point. */
	totalSeconds: number;
	negative: boolean;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	/** Unsigned magnitude, for a single "X.XX hours" figure. */
	decimalHours: number;
}

export function breakdownSeconds(totalSeconds: number): DurationBreakdown {
	const negative = totalSeconds < 0;
	const abs = Math.abs(totalSeconds);
	const days = Math.floor(abs / 86400);
	const hours = Math.floor((abs % 86400) / 3600);
	const minutes = Math.floor((abs % 3600) / 60);
	const seconds = abs % 60;
	return { totalSeconds, negative, days, hours, minutes, seconds, decimalHours: abs / 3600 };
}

/**
 * Elapsed time from `start` to `end` on a single 24-hour clock. If `end` is
 * earlier than or equal to `start`, this assumes the end time falls on the
 * next day (the convention every major time-duration tool uses for an
 * overnight span, e.g. a 10 PM–6 AM shift), never a negative result.
 */
export function durationBetweenTimes(start: ClockTime, end: ClockTime): DurationBreakdown {
	const startSec = clockTimeToSeconds(start);
	const endSec = clockTimeToSeconds(end);
	let diff = endSec - startSec;
	if (diff <= 0) diff += 86400;
	return breakdownSeconds(diff);
}

export interface ShiftTimeResult {
	result: ClockTime;
	/** Whole days crossed; negative when subtracting wraps back a day. */
	daysRolled: number;
}

/** Adds (sign=1) or subtracts (sign=-1) a duration in seconds from a clock time. */
export function shiftTime(start: ClockTime, durationSeconds: number, sign: 1 | -1): ShiftTimeResult {
	const totalSec = clockTimeToSeconds(start) + sign * durationSeconds;
	const daysRolled = Math.floor(totalSec / 86400);
	return { result: secondsToClockTime(totalSec), daysRolled };
}

export interface DateTime {
	date: YMD;
	time: ClockTime;
}

/** Signed elapsed time between two full date-times, at whole-second precision. */
export function durationBetweenDateTimes(start: DateTime, end: DateTime): DurationBreakdown {
	const dayDiff = daysBetween(start.date, end.date);
	const totalSeconds = dayDiff * 86400 + (clockTimeToSeconds(end.time) - clockTimeToSeconds(start.time));
	return breakdownSeconds(totalSeconds);
}

function pad2(n: number): string {
	return String(n).padStart(2, '0');
}

export function formatClockTime12(t: ClockTime): string {
	const { hour12, period } = to12Hour(t);
	return `${hour12}:${pad2(t.minutes)} ${period}`;
}

export function formatClockTime24(t: ClockTime): string {
	return `${pad2(t.hours)}:${pad2(t.minutes)}`;
}
