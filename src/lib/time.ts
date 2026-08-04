/**
 * Time/duration unit conversion.
 *
 * Formula authority: second, minute (60 s), hour (60 min), day (24 h = 86,400 s)
 * and week (7 d) are exact by definition — BIPM SI Brochure §4.1 defines the
 * second as the SI base unit of time and accepts minute/hour/day as units
 * "used with the SI" at those fixed ratios.
 *
 * Month and year have no single fixed length (a calendar month runs 28-31
 * days and a calendar year is 365 or 366 days), so this converter uses the
 * *mean* Gregorian calendar month/year: the Gregorian calendar's defining
 * rule (introduced 1582, still the civil calendar in nearly every country)
 * is that every 400-year cycle contains exactly 97 leap years, i.e. exactly
 * 146,097 days. Dividing that cycle evenly gives an exact mean year of
 * 365.2425 days (31,556,952 s) and an exact mean month of 30.436875 days
 * (2,629,746 s, one-twelfth of the mean year) — both are precise arithmetic
 * consequences of the calendar's own rule, not estimates.
 */

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

/** Seconds per unit — the base for every conversion below. All values exact. */
export const SECONDS_PER_UNIT: Record<TimeUnit, number> = {
	second: 1,
	minute: 60,
	hour: 3600,
	day: 86400,
	week: 604800,
	month: 2629746, // mean Gregorian month = 146,097 days / 4,800 months over a 400-year cycle
	year: 31556952, // mean Gregorian year = 146,097 days / 400 years over a 400-year cycle
};

export const UNITS: TimeUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

export function toSeconds(value: number, unit: TimeUnit): number {
	return value * SECONDS_PER_UNIT[unit];
}

export function fromSeconds(seconds: number, unit: TimeUnit): number {
	return seconds / SECONDS_PER_UNIT[unit];
}

export function convert(value: number, from: TimeUnit, to: TimeUnit): number {
	return fromSeconds(toSeconds(value, from), to);
}

/** Converts a value in one unit to all seven, for a "type once, see all" display. */
export function convertAll(value: number, from: TimeUnit): Record<TimeUnit, number> {
	const seconds = toSeconds(value, from);
	const result = {} as Record<TimeUnit, number>;
	for (const unit of UNITS) result[unit] = fromSeconds(seconds, unit);
	return result;
}

/**
 * Rounds to `sig` significant figures rather than a fixed decimal count —
 * matches the precision convention used by the site's other converters
 * (length/weight/temperature) so results stay readable at any magnitude.
 */
export function roundSig(n: number, sig = 6): number {
	if (n === 0 || !Number.isFinite(n)) return n;
	const magnitude = Math.pow(10, sig - Math.ceil(Math.log10(Math.abs(n))));
	return Math.round(n * magnitude) / magnitude;
}

/**
 * The plain calendar-year quick facts most searchers expect ("8,760 hours in
 * a year"), which use a simple 365-day (or 366-day leap) count rather than
 * the mean Gregorian year this converter's live tool uses. Kept separate so
 * the reference table can show both without conflating the two conventions.
 */
export const COMMON_YEAR_DAYS = 365;
export const LEAP_YEAR_DAYS = 366;

export function commonYearIn(unit: Exclude<TimeUnit, 'year'>, days = COMMON_YEAR_DAYS): number {
	return fromSeconds(days * SECONDS_PER_UNIT.day, unit);
}
