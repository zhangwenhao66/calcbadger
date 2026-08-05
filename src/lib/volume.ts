/**
 * Volume unit conversion (US customary + metric, liquid measure).
 *
 * Formula authority: NIST Handbook 44 (2026), Appendix C, "General Tables of
 * Units of Measurement" (nist.gov/pml/owm) fixes the US liquid gallon at
 * exactly 3.785411784 liters. Every US customary unit below is derived from
 * that one exact figure by its legal definition — 1 gal = 4 qt, 1 qt = 2 pt,
 * 1 pt = 2 cup, 1 cup = 8 fl oz, 1 fl oz = 2 tbsp, 1 tbsp = 3 tsp — so the
 * resulting mL-per-unit values are exact, not measured approximations.
 * Metric prefixes (mL, L) are SI-exact by definition.
 */

export type VolumeUnit = 'tsp' | 'tbsp' | 'floz' | 'cup' | 'pint' | 'quart' | 'gallon' | 'ml' | 'l';

/** Milliliters per unit — the base for every conversion below. All values exact. */
export const ML_PER_UNIT: Record<VolumeUnit, number> = {
	tsp: 4.92892159375,
	tbsp: 14.78676478125,
	floz: 29.5735295625,
	cup: 236.5882365,
	pint: 473.176473,
	quart: 946.352946,
	gallon: 3785.411784,
	ml: 1,
	l: 1000,
};

export const UNITS: VolumeUnit[] = ['tsp', 'tbsp', 'floz', 'cup', 'pint', 'quart', 'gallon', 'ml', 'l'];

export function toMl(value: number, unit: VolumeUnit): number {
	return value * ML_PER_UNIT[unit];
}

export function fromMl(ml: number, unit: VolumeUnit): number {
	return ml / ML_PER_UNIT[unit];
}

export function convert(value: number, from: VolumeUnit, to: VolumeUnit): number {
	return fromMl(toMl(value, from), to);
}

/** Converts a value in one unit to all nine, for a "type once, see all" display. */
export function convertAll(value: number, from: VolumeUnit): Record<VolumeUnit, number> {
	const ml = toMl(value, from);
	const result = {} as Record<VolumeUnit, number>;
	for (const unit of UNITS) result[unit] = fromMl(ml, unit);
	return result;
}

/**
 * Rounds to `sig` significant figures rather than a fixed decimal count —
 * a fixed 2dp would show 1 tsp-in-gallon as "0.00" and a fixed 6dp would
 * clutter "5 gallon in ml" with trailing zeros. 6 significant figures
 * matches the site's other unit converters and keeps small and large
 * results both readable.
 */
export function roundSig(n: number, sig = 6): number {
	if (n === 0 || !Number.isFinite(n)) return n;
	const magnitude = Math.pow(10, sig - Math.ceil(Math.log10(Math.abs(n))));
	return Math.round(n * magnitude) / magnitude;
}
