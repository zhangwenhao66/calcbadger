/**
 * Square footage (area) math.
 *
 * Formula authority: elementary geometry (rectangle w*l, circle pi*r^2,
 * triangle b*h/2). Unit conversion authority: NIST Special Publication 811 /
 * the international yard-and-pound agreement — 1 ft = 0.3048 m exactly,
 * 1 yd = 3 ft, 1 in = 1/12 ft, 1 acre = 43,560 sq ft exactly.
 */

export type LengthUnit = 'ft' | 'in' | 'yd' | 'm' | 'cm';

/** Exact factors to feet (NIST SP 811: 1 ft = 0.3048 m exactly). */
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

export function rectangleAreaSqFt(lengthFt: number, widthFt: number): number {
	return lengthFt * widthFt;
}

export function circleAreaSqFt(diameterFt: number): number {
	const r = diameterFt / 2;
	return Math.PI * r * r;
}

export function triangleAreaSqFt(baseFt: number, heightFt: number): number {
	return (baseFt * heightFt) / 2;
}

/** L-shape = the sum of its two rectangles. */
export function lShapeAreaSqFt(
	l1Ft: number,
	w1Ft: number,
	l2Ft: number,
	w2Ft: number,
): number {
	return rectangleAreaSqFt(l1Ft, w1Ft) + rectangleAreaSqFt(l2Ft, w2Ft);
}

export interface AreaConversions {
	sqFt: number;
	sqM: number;
	sqYd: number;
	acres: number;
}

export function convertArea(sqFt: number): AreaConversions {
	return {
		sqFt,
		sqM: sqFt * 0.09290304, // 1 sq ft = 0.3048^2 m^2 exactly
		sqYd: sqFt / 9,
		acres: sqFt / 43560,
	};
}

/** Material/paint/flooring budgeting: area x unit price. */
export function costEstimate(sqFt: number, pricePerSqFt: number): number {
	return sqFt * pricePerSqFt;
}
