/**
 * Weight/mass unit conversion.
 *
 * Formula authority: the 1959 International Yard and Pound Agreement (signed
 * by the US, UK, Canada, Australia, New Zealand, and South Africa) fixed the
 * avoirdupois pound at exactly 0.453 592 37 kilograms — a legal definition,
 * not a measured approximation. NIST Handbook 44, Appendix C, "General
 * Tables of Units of Measurement" (nist.gov/pml/owm) carries the same value
 * for US trade and measurement use, and derives the ounce as exactly 1/16 of
 * that pound (28.349523125 g) and the US short ton as exactly 2,000 pounds
 * (907.18474 kg). Metric prefixes (mg, mcg, kg) are SI-exact by definition.
 */

export type WeightUnit = 'mcg' | 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'ton';

/** Grams per unit — the base for every conversion below. All values exact. */
export const GRAMS_PER_UNIT: Record<WeightUnit, number> = {
	mcg: 0.000001,
	mg: 0.001,
	g: 1,
	kg: 1000,
	oz: 28.349523125,
	lb: 453.59237,
	ton: 907184.74,
};

export const UNITS: WeightUnit[] = ['mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'ton'];

export function toGrams(value: number, unit: WeightUnit): number {
	return value * GRAMS_PER_UNIT[unit];
}

export function fromGrams(grams: number, unit: WeightUnit): number {
	return grams / GRAMS_PER_UNIT[unit];
}

export function convert(value: number, from: WeightUnit, to: WeightUnit): number {
	return fromGrams(toGrams(value, from), to);
}

/** Converts a value in one unit to all seven, for a "type once, see all" display. */
export function convertAll(value: number, from: WeightUnit): Record<WeightUnit, number> {
	const grams = toGrams(value, from);
	const result = {} as Record<WeightUnit, number>;
	for (const unit of UNITS) result[unit] = fromGrams(grams, unit);
	return result;
}

/**
 * Rounds to `sig` significant figures rather than a fixed decimal count —
 * a fixed 2dp would show 1mcg-in-kg as "0.00" and a fixed 6dp would clutter
 * "5000 g in mg" with trailing zeros. 6 significant figures matches the
 * site's length-converter precision and keeps small and large results both
 * readable.
 */
export function roundSig(n: number, sig = 6): number {
	if (n === 0 || !Number.isFinite(n)) return n;
	const magnitude = Math.pow(10, sig - Math.ceil(Math.log10(Math.abs(n))));
	return Math.round(n * magnitude) / magnitude;
}

/** Splits a total ounces value into whole pounds + remaining ounces, e.g. for a newborn's weight. */
export function ouncesToPoundsOunces(totalOunces: number): { pounds: number; ounces: number } {
	const pounds = Math.floor(totalOunces / 16);
	const ounces = roundSig(totalOunces - pounds * 16, 4);
	return { pounds, ounces };
}
