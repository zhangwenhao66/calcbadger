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
 *
 * The stone is a UK/Ireland unit, not part of the 1959 agreement itself, but
 * fixed at exactly 14 lb by the Weights and Measures Act 1985 (Schedule 1,
 * Part VI) — so it inherits the same exact pound and converts to exactly
 * 6.35029318 kg (14 × 0.45359237 kg).
 */

export type WeightUnit = 'mcg' | 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'st' | 'ton';

/** Grams per unit — the base for every conversion below. All values exact. */
export const GRAMS_PER_UNIT: Record<WeightUnit, number> = {
	mcg: 0.000001,
	mg: 0.001,
	g: 1,
	kg: 1000,
	oz: 28.349523125,
	lb: 453.59237,
	st: 6350.29318,
	ton: 907184.74,
};

export const UNITS: WeightUnit[] = ['mcg', 'mg', 'g', 'kg', 'oz', 'lb', 'st', 'ton'];

export function toGrams(value: number, unit: WeightUnit): number {
	return value * GRAMS_PER_UNIT[unit];
}

export function fromGrams(grams: number, unit: WeightUnit): number {
	return grams / GRAMS_PER_UNIT[unit];
}

export function convert(value: number, from: WeightUnit, to: WeightUnit): number {
	return fromGrams(toGrams(value, from), to);
}

/** Converts a value in one unit to all eight, for a "type once, see all" display. */
export function convertAll(value: number, from: WeightUnit): Record<WeightUnit, number> {
	const grams = toGrams(value, from);
	const result = {} as Record<WeightUnit, number>;
	for (const unit of UNITS) result[unit] = fromGrams(grams, unit);
	return result;
}

/**
 * Rounds to `sig` significant figures rather than a fixed decimal count, since
 * a fixed 2dp would show 1mcg-in-kg as "0.00" and a fixed 6dp would clutter
 * "5000 g in mg" with trailing zeros. 6 significant figures matches the
 * site's length-converter precision and keeps small and large results both
 * readable.
 *
 * Uses `toPrecision` (a correctly-rounded decimal string conversion) rather
 * than `Math.round(n * 10^k) / 10^k`. That approach breaks for large n:
 * `10^k` for a negative k is not exactly representable in IEEE-754, so the
 * multiply-round-divide round-trips through binary error and can surface as
 * e.g. 9.071850000000001e+22 instead of 9.07185e+22 for a ~1e23 input (this
 * converter spans mcg to US ton, about 12 orders of magnitude, so inputs in
 * that range are reachable). `toPrecision` doesn't have this failure mode
 * because it rounds the decimal representation directly instead of scaling
 * by an inexact power of ten. Same fix as length.ts's roundSig (2026-08-13).
 */
export function roundSig(n: number, sig = 6): number {
	if (n === 0 || !Number.isFinite(n)) return n;
	return Number(n.toPrecision(sig));
}

/** Splits a total ounces value into whole pounds + remaining ounces, e.g. for a newborn's weight. */
export function ouncesToPoundsOunces(totalOunces: number): { pounds: number; ounces: number } {
	const pounds = Math.floor(totalOunces / 16);
	const ounces = roundSig(totalOunces - pounds * 16, 4);
	return { pounds, ounces };
}
