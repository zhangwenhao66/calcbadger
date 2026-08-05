/**
 * Concrete volume and bag-count math.
 *
 * Volume formulas: elementary geometry (rectangular prism = l*w*d, cylinder =
 * pi*r^2*h). Length conversions: NIST SP 811 / the international
 * yard-and-pound agreement, 1 ft = 0.3048 m exactly.
 *
 * Bag yields: QUIKRETE Concrete Mix (Product No. 1101-40/-50/-60/-80)
 * technical data sheet, revised October 2022 — published yield per bag:
 * 40 lb -> 0.30 ft^3, 50 lb -> 0.375 ft^3, 60 lb -> 0.45 ft^3, 80 lb -> 0.60
 * ft^3.
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

/** Slab, footing, or wall: length x width x thickness, all in feet. */
export function slabVolumeCuFt(lengthFt: number, widthFt: number, depthFt: number): number {
	return lengthFt * widthFt * depthFt;
}

/** Column, tube form, or post hole: diameter x depth, both in feet. */
export function roundVolumeCuFt(diameterFt: number, depthFt: number): number {
	const r = diameterFt / 2;
	return Math.PI * r * r * depthFt;
}

/** Multiply a single pour's volume by how many identical pours are needed. */
export function totalCuFt(unitCuFt: number, quantity: number): number {
	return unitCuFt * quantity;
}

/** Add a waste/overage allowance (contractor rule of thumb, typically 5-10%). */
export function withWaste(cuFt: number, wastePercent: number): number {
	return cuFt * (1 + wastePercent / 100);
}

export function cuFtToCuYd(cuFt: number): number {
	return cuFt / 27;
}

export type BagSize = 40 | 50 | 60 | 80;

/** QUIKRETE Concrete Mix 1101 TDS (Oct 2022), published yield per bag size. */
const BAG_YIELD_CU_FT: Record<BagSize, number> = {
	40: 0.3,
	50: 0.375,
	60: 0.45,
	80: 0.6,
};

export function bagYieldCuFt(bagSize: BagSize): number {
	return BAG_YIELD_CU_FT[bagSize];
}

export function bagsNeeded(cuFt: number, bagSize: BagSize): number {
	if (cuFt <= 0) return 0;
	// Nudge by a tiny epsilon so floating-point noise (e.g. 27/0.45 landing on
	// 60.00000000000001) doesn't round a whole-bag quantity up to an extra bag.
	return Math.ceil(cuFt / bagYieldCuFt(bagSize) - 1e-9);
}

export function bagsTotalWeightLb(bags: number, bagSize: BagSize): number {
	return bags * bagSize;
}
