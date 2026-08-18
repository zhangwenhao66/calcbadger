/**
 * Topsoil volume, weight, and bag-count math.
 *
 * Volume formulas: elementary geometry (rectangular prism = l*w*d, cylinder =
 * pi*r^2*h). Length conversions: NIST SP 811 / the international
 * yard-and-pound agreement, 1 ft = 0.3048 m exactly.
 *
 * Densities: derived from the USDA NRCS Soil Health Educators Guide (2023)
 * "ideal bulk density" ceilings by soil texture, as tabulated by SDSU
 * Extension (Klopp & Bly, "Bulk Density is an Indicator of Soil Health",
 * updated 2023) -- the density a soil should stay at or under for healthy
 * root growth. Converted from that table's lb/ft^3 column: sand/loamy sand
 * <99.7, sandy loam through silt loam <87.2, clay-heavy textures <68.5.
 * These are soil-science ceilings, not a single official "topsoil weighs X"
 * figure -- purchased, screened topsoil is typically looser than a
 * compacted native soil sample, so treat the preset as a planning estimate
 * and swap in a supplier-provided density when one is available.
 *
 * Bag size: 0.75 cu ft is the size Scotts Premium Topsoil (sold at Home
 * Depot, Lowe's, and Amazon) ships in; other brands range roughly 0.5-2
 * cu ft, hence the selectable field.
 */

export type LengthUnit = 'ft' | 'in' | 'yd' | 'm' | 'cm';

const TO_FEET: Record<LengthUnit, number> = {
	ft: 1,
	in: 1 / 12,
	yd: 3,
	m: 1 / 0.3048,
	cm: 1 / 30.48,
};

export function toFeet(value: number, unit: LengthUnit): number {
	return value * TO_FEET[unit];
}

export type Shape = 'rectangle' | 'circle';

/** Rectangular bed or lawn: length x width, in feet. */
export function rectangleAreaSqFt(lengthFt: number, widthFt: number): number {
	return lengthFt * widthFt;
}

/** Round bed or tree ring: diameter, in feet. */
export function circleAreaSqFt(diameterFt: number): number {
	const r = diameterFt / 2;
	return Math.PI * r * r;
}

/** Area (sq ft) x depth (ft) = volume (cu ft). */
export function volumeCuFt(areaSqFt: number, depthFt: number): number {
	return areaSqFt * depthFt;
}

/** Add a settling/waste allowance (fresh topsoil compacts once watered in). */
export function withSettling(cuFt: number, settlingPercent: number): number {
	return cuFt * (1 + settlingPercent / 100);
}

export function cuFtToCuYd(cuFt: number): number {
	return cuFt / 27;
}

export type SoilTexture = 'sandy' | 'loam' | 'clay' | 'custom';

/**
 * USDA NRCS Soil Health Educators Guide (2023) ideal bulk density ceilings,
 * lb/ft^3, as tabulated by SDSU Extension. See file header for derivation.
 */
export const DENSITY_LB_PER_CUFT: Record<Exclude<SoilTexture, 'custom'>, number> = {
	sandy: 99.7,
	loam: 87.2,
	clay: 68.5,
};

export function weightLb(cuFt: number, densityLbPerCuFt: number): number {
	return cuFt * densityLbPerCuFt;
}

export function lbToTons(lb: number): number {
	return lb / 2000;
}

export type BagSize = 0.75 | 1 | 1.5 | 2;

export function bagsNeeded(cuFt: number, bagSizeCuFt: number): number {
	if (cuFt <= 0 || bagSizeCuFt <= 0) return 0;
	// Nudge by a tiny epsilon so floating-point noise doesn't round a
	// whole-bag quantity up to an extra bag (same guard as concrete.ts).
	return Math.ceil(cuFt / bagSizeCuFt - 1e-9);
}
