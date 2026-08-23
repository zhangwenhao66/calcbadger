/**
 * Age-gap math for comparing two people's birth dates: the calendar-aware
 * years/months/days apart, each person's current decimal age, the gap
 * expressed as a percentage of the older person's age, and the
 * "half-your-age-plus-seven" rule of thumb.
 *
 * Calendar arithmetic delegates entirely to dateCalculator.ts (same
 * proleptic-Gregorian, epoch-day convention, ECMA-262 §21.4) rather than
 * re-implementing it — this module only adds the age-comparison layer on
 * top.
 *
 * Decimal age divides elapsed days by 365.2425, the mean length of a
 * Gregorian calendar year: the Gregorian leap-year rule (a leap year every
 * 4 years, except centuries not divisible by 400) gives exactly 146,097
 * days every 400 years, and 146097 / 400 = 365.2425.
 *
 * "Half-your-age-plus-seven": Wikipedia, "Age disparity in sexual
 * relationships" — a rule of thumb holding that a person should not date
 * someone younger than half their own age plus seven years (also cited in
 * the webcomic xkcd as the "Standard Creepiness Rule"). Presented here as a
 * commonly cited reference point, not advice.
 */

import { calendarDiff, daysBetween, type CalendarDiff, type YMD } from './dateCalculator';

/** Mean Gregorian calendar year length in days: 146,097 days every 400 years. */
export const MEAN_YEAR_DAYS = 146097 / 400;

/** Decimal age (fractional years) of someone born on `birth`, as of `asOf`. */
export function decimalAge(birth: YMD, asOf: YMD): number {
	return daysBetween(birth, asOf) / MEAN_YEAR_DAYS;
}

export interface AgeDifferenceResult {
	/** Calendar-aware years/months/days apart (magnitude — see calendarDiff). */
	gap: CalendarDiff;
	/** Total whole days apart, always non-negative. */
	totalDaysGap: number;
	/** True when person A (the first birth date) is the older of the two. */
	aIsOlder: boolean;
	/** Person A's decimal age as of `asOf`. */
	ageA: number;
	/** Person B's decimal age as of `asOf`. */
	ageB: number;
	/** The age gap as a percentage of the older person's age (0 if tied or the older age is 0). */
	gapPercentOfOlder: number;
}

export function ageDifference(birthA: YMD, birthB: YMD, asOf: YMD): AgeDifferenceResult {
	const gap = calendarDiff(birthA, birthB);
	const totalDaysGap = Math.abs(daysBetween(birthA, birthB));
	const ageA = decimalAge(birthA, asOf);
	const ageB = decimalAge(birthB, asOf);
	const aIsOlder = daysBetween(birthA, birthB) >= 0; // B born on/after A => A is older (or tied)
	const olderAge = aIsOlder ? ageA : ageB;
	const youngerAge = aIsOlder ? ageB : ageA;
	const gapPercentOfOlder = olderAge > 0 ? ((olderAge - youngerAge) / olderAge) * 100 : 0;

	return { gap, totalDaysGap, aIsOlder, ageA, ageB, gapPercentOfOlder };
}

/** The rule's minimum acceptable partner age for someone of `age`: half their age, plus seven. */
export function creepinessRuleMinAge(age: number): number {
	return age / 2 + 7;
}

/** Whether `youngerAge` clears the older person's "half-your-age-plus-seven" floor. */
export function passesCreepinessRule(olderAge: number, youngerAge: number): boolean {
	return youngerAge >= creepinessRuleMinAge(olderAge);
}
