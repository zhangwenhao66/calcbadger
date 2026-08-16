/**
 * Asphalt paving tonnage math.
 *
 * Volume: elementary geometry (rectangular slab = l*w*d). Length
 * conversions: NIST SP 811 / the international yard-and-pound agreement,
 * 1 ft = 0.3048 m exactly.
 *
 * Densities:
 * - Hot mix asphalt (compacted, in place): 145 lb/ft^3, the unit weight the
 *   Iowa DOT Standard Specifications Section 2303 uses for converting bid
 *   quantities to a weight basis, and within the 142-148 lb/ft^3 range the
 *   Asphalt Institute's Engineering FAQ gives for in-place asphalt mixture.
 * - Reclaimed asphalt pavement (RAP), compacted: FHWA-RD-97-148 "User
 *   Guidelines for Waste and Byproduct Materials in Pavement Construction"
 *   documents a compacted range of 1600-2000 kg/m^3 (100-125 lb/ft^3); this
 *   calculator uses 112 lb/ft^3 (near the range's 112.5 midpoint) as a
 *   planning default.
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

export type MaterialType = 'hotmix' | 'rap' | 'custom';

export const DENSITY_LB_PER_CUFT: Record<Exclude<MaterialType, 'custom'>, number> = {
	hotmix: 145,
	rap: 112,
};

/** Paved area x compacted depth, all in feet. */
export function slabVolumeCuFt(lengthFt: number, widthFt: number, depthFt: number): number {
	return lengthFt * widthFt * depthFt;
}

/** Add a waste/compaction allowance (common contractor rule of thumb, 5-10%). */
export function withWaste(cuFt: number, wastePercent: number): number {
	return cuFt * (1 + wastePercent / 100);
}

export function cuFtToCuYd(cuFt: number): number {
	return cuFt / 27;
}

export function weightLb(cuFt: number, densityLbPerCuFt: number): number {
	return cuFt * densityLbPerCuFt;
}

export function lbToTons(lb: number): number {
	return lb / 2000;
}
