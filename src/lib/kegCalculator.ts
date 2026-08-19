/**
 * Keg volume and serving-count math.
 *
 * Keg sizes: the US Alcohol and Tobacco Tax and Trade Bureau defines a
 * barrel of beer as 31 gallons for tax purposes (27 CFR 25.11), and
 * authorizes half, quarter, and sixth-barrel kegs as fractional parts of
 * that (27 CFR 25.156) — 15.5 gal, 7.75 gal, and 31/6 gal respectively. The
 * same section separately authorizes a 5-gallon keg (the size homebrewers
 * know as a "Cornelius" or "corny" keg) and metric 30 L / 50 L kegs common
 * outside the US.
 *
 * Serving sizes: 12 fl oz is the US "standard drink" reference volume for
 * beer at ~5% ABV per NIAAA. A US pint pour is 16 fl oz; a UK/Ireland
 * imperial pint is 20 imperial fl oz, a different (larger) fluid ounce than
 * the US one, so it is not simply "20 vs 16".
 *
 * All volume math runs in milliliters using NIST's exact unit-conversion
 * factors (1 US gal = 3785.411784 mL, 1 US fl oz = 29.5735295625 mL, 1
 * imperial fl oz = 28.4130625 mL) so gallon-denominated keg sizes and
 * ounce-denominated servings share one unambiguous base unit.
 */

export const US_GAL_TO_ML = 3785.411784;
export const US_FLOZ_TO_ML = 29.5735295625;
export const IMPERIAL_FLOZ_TO_ML = 28.4130625;
export const LITER_TO_ML = 1000;

export type KegPreset = 'halfBarrel' | 'quarterBarrel' | 'sixthBarrel' | 'cornyKeg' | 'miniKeg' | 'custom';
export type VolumeUnit = 'gal' | 'l';
export type ServingPreset = 'can12oz' | 'usPint16oz' | 'imperialPint20oz' | 'custom';
export type ServingUnit = 'floz' | 'ml';

/** 27 CFR 25.11 / 25.156: barrel = 31 US gal; authorized fractional keg sizes. */
export const KEG_PRESET_ML: Record<Exclude<KegPreset, 'custom'>, number> = {
	halfBarrel: 15.5 * US_GAL_TO_ML,
	quarterBarrel: 7.75 * US_GAL_TO_ML,
	sixthBarrel: (31 / 6) * US_GAL_TO_ML,
	cornyKeg: 5 * US_GAL_TO_ML,
	miniKeg: 5 * LITER_TO_ML,
};

/** NIAAA standard-drink reference (12 oz beer) plus common US/UK pour sizes. */
export const SERVING_PRESET_ML: Record<Exclude<ServingPreset, 'custom'>, number> = {
	can12oz: 12 * US_FLOZ_TO_ML,
	usPint16oz: 16 * US_FLOZ_TO_ML,
	imperialPint20oz: 20 * IMPERIAL_FLOZ_TO_ML,
};

export function volumeToMl(value: number, unit: VolumeUnit): number {
	return unit === 'gal' ? value * US_GAL_TO_ML : value * LITER_TO_ML;
}

export function servingToMl(value: number, unit: ServingUnit): number {
	return unit === 'floz' ? value * US_FLOZ_TO_ML : value;
}

export interface KegResult {
	kegVolumeMl: number;
	servingSizeMl: number;
	/** Full servings the keg pours, ignoring foam loss/waste. */
	servings: number;
	/** Fractional servings before rounding down, useful to show how close to the next pour it is. */
	rawServings: number;
}

/** Whole servings a keg yields: floor(volume / serving size). Partial pours don't round up. */
export function calculateServings(kegVolumeMl: number, servingSizeMl: number): KegResult {
	const rawServings = servingSizeMl > 0 ? kegVolumeMl / servingSizeMl : 0;
	return {
		kegVolumeMl,
		servingSizeMl,
		servings: Math.floor(rawServings),
		rawServings,
	};
}

/** Servings lost to foam/pour waste, applied as a percent haircut before flooring. */
export function servingsWithWaste(servings: number, wastePercent: number): number {
	return Math.floor(servings * (1 - wastePercent / 100));
}

/** Kegs needed to cover guests x drinks-per-guest, rounded up since kegs are indivisible. */
export function kegsNeeded(guests: number, drinksPerGuest: number, servingsPerKeg: number): number {
	if (servingsPerKeg <= 0) return 0;
	return Math.ceil((guests * drinksPerGuest) / servingsPerKeg);
}

export function costPerServing(kegPrice: number, servings: number): number | null {
	return servings > 0 ? kegPrice / servings : null;
}
