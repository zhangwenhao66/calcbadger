/**
 * Prorated rent: the fraction of a month's rent owed for a partial month
 * (move-in or move-out mid-month), split by which day-count convention sets
 * the denominator.
 *
 * There is no single federally mandated formula for residential rent
 * proration; landlords and property managers pick a day-count convention,
 * the same choice bond and loan markets have to make when accruing interest
 * for a period shorter than a full term. The two conventions below are
 * named after that finance vocabulary — the "30/360 Day Count Convention"
 * that the International Swaps and Derivatives Association's 2006 ISDA
 * Definitions formally define for interest accrual (isda.org, "30/360 Day
 * Count Conventions") is the same math as the "banker's month" rent
 * convention, applied here to a monthly rent instead of a bond coupon:
 *
 * - **30/360 ("banker's month")**: every month is treated as exactly 30
 *   days, regardless of its actual length. daily rate = monthlyRent / 30.
 * - **Actual/Actual**: the real number of days in the specific calendar
 *   month is the denominator. daily rate = monthlyRent / daysInMonth.
 *
 * A third convention, sometimes called the "annual" or "365" method,
 * anchors the daily rate to the year rather than the month: daily rate =
 * (monthlyRent * 12) / daysInYear (366 in a leap year) — the rent-math
 * equivalent of the Actual/365 convention used for some bonds.
 *
 * All three conventions agree exactly whenever the partial month itself has
 * 30 days (e.g. April, June, September, November); they diverge in 31-day
 * and 28/29-day months, which is why the calculator always shows what each
 * one would charge.
 */

import { daysInMonth, isValidDate, type YMD } from './dateCalculator';

export type ProrationMethod = 'actual' | 'banker' | 'annual';

export interface ProrationResult {
	method: ProrationMethod;
	/** Days used as the denominator for the daily rate (not always daysInMonth — 30 for banker's, the year length / 12 for annual). */
	denominatorDays: number;
	dailyRate: number;
	daysOccupied: number;
	proratedRent: number;
}

/** True for years divisible by 4, except century years not divisible by 400 (the standard Gregorian rule) — derived from daysInMonth(year, 2) rather than re-implementing the divisibility rule, so the two can't drift apart. */
export function isLeapYear(year: number): boolean {
	return daysInMonth(year, 2) === 29;
}

/** Days occupied when moving in partway through the month: the move-in day itself counts as occupied, through the end of the month. */
export function occupiedDaysForMoveIn(year: number, month: number, moveInDay: number): number | null {
	const total = daysInMonth(year, month);
	if (!Number.isInteger(moveInDay) || moveInDay < 1 || moveInDay > total) return null;
	return total - moveInDay + 1;
}

/** Days occupied when moving out partway through the month: the 1st through the move-out day, inclusive. */
export function occupiedDaysForMoveOut(year: number, month: number, moveOutDay: number): number | null {
	const total = daysInMonth(year, month);
	if (!Number.isInteger(moveOutDay) || moveOutDay < 1 || moveOutDay > total) return null;
	return moveOutDay;
}

function denominatorDaysFor(method: ProrationMethod, year: number, month: number): number {
	if (method === 'banker') return 30;
	if (method === 'annual') return (isLeapYear(year) ? 366 : 365) / 12;
	return daysInMonth(year, month);
}

/**
 * Computes prorated rent for a given month, method, and number of days
 * occupied. Returns null for invalid input (non-positive rent, a
 * year/month that doesn't form a real calendar month, or daysOccupied
 * outside 0..daysInMonth for the actual/banker methods — the annual method
 * has no such upper bound tied to this specific month's length, but a
 * partial month by definition can't exceed this month's own day count
 * either, so the same bound applies to keep the three methods comparable
 * on the same days-occupied figure).
 */
export function computeProration(
	monthlyRent: number,
	method: ProrationMethod,
	date: YMD,
	daysOccupied: number,
): ProrationResult | null {
	if (!Number.isFinite(monthlyRent) || monthlyRent < 0) return null;
	if (!isValidDate({ ...date, day: 1 })) return null;
	const total = daysInMonth(date.year, date.month);
	if (!Number.isFinite(daysOccupied) || daysOccupied < 0 || daysOccupied > total) return null;

	const denominatorDays = denominatorDaysFor(method, date.year, date.month);
	const dailyRate = monthlyRent / denominatorDays;
	return {
		method,
		denominatorDays,
		dailyRate,
		daysOccupied,
		proratedRent: dailyRate * daysOccupied,
	};
}
