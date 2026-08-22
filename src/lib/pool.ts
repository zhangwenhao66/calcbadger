/**
 * Pool volume and saltwater chlorination dosing math.
 *
 * Volume formulas: rectangular and round pools are unambiguous solids
 * (rectangular prism = l*w*d, cylinder = pi*r^2*h), computed here from exact
 * geometry times the exact cubic-foot-to-US-gallon conversion, 1 ft^3 =
 * 7.480519480... gal (NIST Handbook 44, Appendix C -- 1 US gallon = 231 in^3
 * exactly, 1 ft^3 = 1,728 in^3 exactly, so 1 ft^3 = 1728/231 gal exactly).
 * "Oval" pools are a different case: the shape sold as an oval pool is a
 * stadium/racetrack outline (a rectangle with two semicircular ends), not a
 * true mathematical ellipse, so there is no clean formula to derive from
 * scratch. This module uses the multiplier published in Hayward's Aqua Rite
 * salt chlorine generator manual (length x width x average depth x 6.7 for
 * gallons) -- cross-checked against that same manual's metric version
 * (x 893 for liters from meter measurements): 6.7 gal/ft^3-equivalent x
 * 35.3147 ft^3/m^3 x 3.785412 L/gal = 895.7, consistent with 893 within
 * print-rounding, confirming the figure is deliberate. Note this published
 * oval multiplier (6.7) is noticeably higher than a true ellipse of the same
 * length/width/depth would give (pi/4 x 7.480519 = 5.875) -- exactly because
 * a stadium shape holds more water than an ellipse inscribed in the same
 * bounding rectangle.
 *
 * Salt dosing: ppm (parts per million) is mg of solute per liter of
 * solution. Dissolving W pounds of salt (453,592.37 mg/lb, the exact
 * international avoirdupois pound) into G US gallons (3.785411784 L/gal
 * exactly) raises concentration by W * 453,592.37 / (G * 3.785411784) ppm --
 * a unit-conversion identity, not a manufacturer-specific figure. Pool and
 * salt-cell literature commonly round the resulting gallon-ppm-per-pound
 * constant to "120,000"; this module computes it exactly. The 2,700-3,400
 * ppm operating window (3,200 ppm as the optimal target) is Hayward's
 * published ideal range for its Aqua Rite salt chlorine generator cells --
 * consult your specific cell's manual, since other brands vary.
 */

export const GALLONS_PER_CUFT = 1728 / 231; // exact: in^3 per ft^3 / in^3 per US gallon

const MG_PER_LB = 453592.37; // exact international avoirdupois pound
const LITERS_PER_GALLON = 3.785411784; // exact US gallon-to-liter factor

/** Gallon-ppm raised per pound of salt fully dissolved (exact, ~119,826). */
export const PPM_GALLONS_PER_LB = MG_PER_LB / LITERS_PER_GALLON;

export type PoolShape = 'rectangle' | 'round' | 'oval';

/** Rectangular pool: length x width x average depth, all in feet. */
export function rectangleGallons(lengthFt: number, widthFt: number, avgDepthFt: number): number {
	return lengthFt * widthFt * avgDepthFt * GALLONS_PER_CUFT;
}

/** Round pool: diameter x average depth, in feet. */
export function roundGallons(diameterFt: number, avgDepthFt: number): number {
	const r = diameterFt / 2;
	return Math.PI * r * r * avgDepthFt * GALLONS_PER_CUFT;
}

/**
 * Oval pool: length x width x average depth, in feet, using Hayward's
 * published stadium-shape multiplier (6.7) -- see file header for why a
 * true-ellipse formula would understate an oval pool's actual volume.
 */
export const OVAL_MULTIPLIER = 6.7;

export function ovalGallons(lengthFt: number, widthFt: number, avgDepthFt: number): number {
	return lengthFt * widthFt * avgDepthFt * OVAL_MULTIPLIER;
}

/** Shallow-end + deep-end depth, averaged -- the standard pool-operator method for sloped floors. */
export function averageDepth(shallowFt: number, deepFt: number): number {
	return (shallowFt + deepFt) / 2;
}

export function gallonsToLiters(gallons: number): number {
	return gallons * LITERS_PER_GALLON;
}

/**
 * Pounds of salt to raise a pool from currentPpm to targetPpm. Returns 0 if
 * already at or above target (never suggests removing salt -- that requires
 * partial draining/dilution, not a formula this calculator performs).
 */
export function saltLbsNeeded(gallons: number, currentPpm: number, targetPpm: number): number {
	const deltaPpm = targetPpm - currentPpm;
	if (deltaPpm <= 0 || gallons <= 0) return 0;
	return (deltaPpm * gallons) / PPM_GALLONS_PER_LB;
}

export function lbToKg(lb: number): number {
	return lb * 0.45359237; // exact international avoirdupois pound
}
