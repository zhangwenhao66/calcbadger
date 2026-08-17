/**
 * Body surface area (BSA), used clinically to normalize renal clearance
 * (GFR "per 1.73 m²"), dose chemotherapy, and compute cardiac index.
 *
 * Formula authority:
 * - Du Bois D, Du Bois EF (Jun 1916). "A formula to estimate the approximate
 *   surface area if height and weight be known." Archives of Internal
 *   Medicine 17(6):863-871. BSA(m^2) = 0.007184 * height(cm)^0.725 *
 *   weight(kg)^0.425. Derived from direct surface measurements of nine
 *   people.
 * - Mosteller RD (1987). "Simplified calculation of body-surface area."
 *   N Engl J Med 317(17):1098. BSA(m^2) = sqrt(height(cm) * weight(kg) / 3600).
 *   Validated by correlation against the Du Bois formula, not by independent
 *   direct measurement.
 *
 * Imperial inputs are converted to metric (2.54 cm/in, 0.45359237 kg/lb)
 * before either formula is applied, rather than using a separately-cited
 * "imperial shortcut" constant — the commonly repeated inches/pounds
 * denominators for Mosteller (3131 vs the exact ~3125) disagree across
 * sources, so converting to metric first avoids relying on an unverified
 * shortcut.
 */

export type BsaFormula = 'dubois' | 'mosteller';

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.45359237;
const M2_PER_FT2 = 0.09290304;

export function bsaDuBois(heightCm: number, weightKg: number): number {
	return 0.007184 * heightCm ** 0.725 * weightKg ** 0.425;
}

export function bsaMosteller(heightCm: number, weightKg: number): number {
	return Math.sqrt((heightCm * weightKg) / 3600);
}

export function bsaMetric(heightCm: number, weightKg: number, formula: BsaFormula): number {
	return formula === 'dubois' ? bsaDuBois(heightCm, weightKg) : bsaMosteller(heightCm, weightKg);
}

export function bsaImperial(heightIn: number, weightLb: number, formula: BsaFormula): number {
	return bsaMetric(heightIn * CM_PER_IN, weightLb * KG_PER_LB, formula);
}

export function m2ToFt2(m2: number): number {
	return m2 / M2_PER_FT2;
}
