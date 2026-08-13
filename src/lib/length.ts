/**
 * Length/distance unit conversion.
 *
 * Formula authority: the 1959 International Yard and Pound Agreement (signed
 * by the US, UK, Canada, Australia, New Zealand, and South Africa) fixed the
 * yard at exactly 0.9144 meters and the mile at exactly 1,609.344 meters —
 * these are legal definitions, not measured approximations. NIST Handbook 44,
 * Appendix C, "General Tables of Units of Measurement" (nist.gov/pml/owm)
 * carries the same values (marking them "exact") for US trade and measurement
 * use: 1 in = 2.54 cm, 1 ft = 0.3048 m, 1 yd = 0.9144 m, 1 mi = 1,609.344 m.
 * Metric prefixes (mm, cm, km) are SI-exact by definition.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi';

/** Meters per unit — the base for every conversion below. All values exact. */
export const METERS_PER_UNIT: Record<LengthUnit, number> = {
	mm: 0.001,
	cm: 0.01,
	m: 1,
	km: 1000,
	in: 0.0254,
	ft: 0.3048,
	yd: 0.9144,
	mi: 1609.344,
};

export const UNITS: LengthUnit[] = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];

export function toMeters(value: number, unit: LengthUnit): number {
	return value * METERS_PER_UNIT[unit];
}

export function fromMeters(meters: number, unit: LengthUnit): number {
	return meters / METERS_PER_UNIT[unit];
}

export function convert(value: number, from: LengthUnit, to: LengthUnit): number {
	return fromMeters(toMeters(value, from), to);
}

/** Converts a value in one unit to all eight, for a "type once, see all" display. */
export function convertAll(value: number, from: LengthUnit): Record<LengthUnit, number> {
	const meters = toMeters(value, from);
	const result = {} as Record<LengthUnit, number>;
	for (const unit of UNITS) result[unit] = fromMeters(meters, unit);
	return result;
}

/**
 * Rounds to `sig` significant figures rather than a fixed decimal count —
 * a fixed 2dp would show 1mm-in-km as "0.00" and a fixed 6dp would clutter
 * "1000 m in mm" with trailing zeros. 6 significant figures matches common
 * unit-converter practice and keeps small and large results both readable.
 *
 * Uses `toPrecision` (a correctly-rounded decimal string conversion) rather
 * than the more obvious `Math.round(n * 10^k) / 10^k`. That approach breaks
 * for large n: `10^k` for a negative k is not exactly representable in
 * IEEE-754, so the multiply-round-divide round-trips through binary error
 * and can surface as e.g. 32808400000.000004 instead of 32808400000 for a
 * ~1e12 input. `toPrecision` doesn't have this failure mode because it
 * rounds the decimal representation directly instead of scaling by an
 * inexact power of ten.
 */
export function roundSig(n: number, sig = 6): number {
	if (n === 0 || !Number.isFinite(n)) return n;
	return Number(n.toPrecision(sig));
}

/** Splits a total inches value into whole feet + remaining inches, e.g. for height display. */
export function inchesToFeetInches(totalInches: number): { feet: number; inches: number } {
	const feet = Math.floor(totalInches / 12);
	const inches = roundSig(totalInches - feet * 12, 4);
	return { feet, inches };
}
