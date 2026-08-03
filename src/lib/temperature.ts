/**
 * Temperature scale conversion.
 *
 * Formula authority: NIST Special Publication 811, "Guide for the Use of the
 * International System of Units (SI)" (physics.nist.gov/cuu/pdf/sp811.pdf),
 * and the BIPM SI Brochure — t/°C = T/K − 273.15 is exact by definition in
 * the current SI, and °F = °C × 9/5 + 32 is the exact legal US-customary
 * relationship (no measurement uncertainty; any rounding below comes only
 * from display precision, not the formula).
 *
 * Reference-point authority:
 * - 0°C/32°F and 100°C/212°F: water's freezing and boiling points at 1 atm,
 *   the two calibration points Celsius originally defined the scale from.
 * - 37°C/98.6°F normal body temperature and 38°C/100.4°F fever threshold:
 *   CDC, "Definitions of Signs, Symptoms, and Conditions of Ill Travelers"
 *   (cdc.gov/port-health) — fever is "a measured temperature of 100.4°F
 *   [38°C] or greater."
 * - Absolute zero, 0 K = −273.15°C = −459.67°F: by definition of the Kelvin
 *   scale (NIST SP 811).
 */

export type TempUnit = 'C' | 'F' | 'K';

/** Absolute zero on each scale — nothing colder is physically possible. */
export const ABSOLUTE_ZERO: Record<TempUnit, number> = {
	C: -273.15,
	F: -459.67,
	K: 0,
};

export function celsiusToFahrenheit(c: number): number {
	return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
	return ((f - 32) * 5) / 9;
}

export function celsiusToKelvin(c: number): number {
	return c + 273.15;
}

export function kelvinToCelsius(k: number): number {
	return k - 273.15;
}

export function fahrenheitToKelvin(f: number): number {
	return ((f - 32) * 5) / 9 + 273.15;
}

export function kelvinToFahrenheit(k: number): number {
	return ((k - 273.15) * 9) / 5 + 32;
}

/** Converts a value on one scale to all three, for a "type once, see all" display. */
export function convertAll(value: number, from: TempUnit): Record<TempUnit, number> {
	const c = from === 'C' ? value : from === 'F' ? fahrenheitToCelsius(value) : kelvinToCelsius(value);
	return {
		C: c,
		F: from === 'F' ? value : celsiusToFahrenheit(c),
		K: from === 'K' ? value : celsiusToKelvin(c),
	};
}

/** True if the value is at or above absolute zero on its own scale. */
export function isPhysicallyValid(value: number, unit: TempUnit): boolean {
	return value >= ABSOLUTE_ZERO[unit] - 1e-9;
}

/** Rounds to 2dp so a clean input (100°C) doesn't come back as 373.14999999999998. */
export function round2(n: number): number {
	return Math.round(n * 100) / 100;
}
