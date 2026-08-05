/**
 * Percentage math: part/whole/percent relationships, percentage change,
 * discount pricing, and percent difference.
 *
 * "Percent" (%) means "parts per hundred" and may be used with the SI per
 * the BIPM SI Brochure, 9th edition, §5.4.7 ("Quantities with the unit
 * one") — it is not one of the units in the separate "accepted for use
 * with the SI" table (that table covers minute/hour/day/litre/etc., not
 * %). All formulas below are elementary algebra that follow directly from
 * that "per hundred" definition.
 *
 * Percent difference (a symmetric comparison of two values where neither
 * is a reference/true value) is distinct from percent error (which divides
 * by an accepted value) — see Statistics How To, "Percent Error / Percent
 * Difference".
 */

/** part = (percent/100) * whole. E.g. 20% of 50 = 10. */
export function percentOfWhole(percent: number, whole: number): number {
	return (percent / 100) * whole;
}

/** percent = (part/whole) * 100. Returns null if whole is 0 (undefined). */
export function partAsPercentOfWhole(part: number, whole: number): number | null {
	if (whole === 0) return null;
	return (part / whole) * 100;
}

/** whole = part / (percent/100). Returns null if percent is 0 (undefined). */
export function wholeFromPartAndPercent(part: number, percent: number): number | null {
	if (percent === 0) return null;
	return part / (percent / 100);
}

/**
 * Percentage change from oldValue to newValue, signed (positive = increase,
 * negative = decrease). Returns null if oldValue is 0 (undefined — there is
 * no base to measure a change against).
 */
export function percentChange(oldValue: number, newValue: number): number | null {
	if (oldValue === 0) return null;
	return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

export interface DiscountResult {
	salePrice: number;
	amountSaved: number;
}

/** Apply a percent-off discount to a price. A negative discountPercent acts as a markup. */
export function applyDiscount(originalPrice: number, discountPercent: number): DiscountResult {
	const amountSaved = originalPrice * (discountPercent / 100);
	return { salePrice: originalPrice - amountSaved, amountSaved };
}

/**
 * Symmetric percent difference between two values (order-independent):
 * |a-b| / ((a+b)/2) * 100. Returns null if a+b is 0 (undefined — e.g. 5 and
 * -5, including both being 0).
 */
export function percentDifference(a: number, b: number): number | null {
	const denominator = (a + b) / 2;
	if (denominator === 0) return null;
	return (Math.abs(a - b) / Math.abs(denominator)) * 100;
}
