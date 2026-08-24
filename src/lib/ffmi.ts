/**
 * Fat-Free Mass Index (FFMI) and its height-normalized variant, used to
 * gauge muscularity independent of body fat and to compare against the
 * documented natural (non-steroid) ceiling.
 *
 * Formula authority:
 * - Kouri EM, Pope HG Jr, Katz DL, Oliva P (Oct 1995). "Fat-free mass index
 *   in users and nonusers of anabolic-androgenic steroids." Clinical
 *   Journal of Sport Medicine 5(4):223-228. FFMI = fat-free mass(kg) /
 *   height(m)^2. Normalized FFMI adds 6.3 * (1.80 - height(m)) so people of
 *   different heights are compared on the same scale (the study's own
 *   correction, referenced to a 1.80 m man).
 * - The study population was 157 male athletes (83 steroid users, 74
 *   nonusers). Normalized FFMI for nonusers topped out at 25.0, matching a
 *   separately estimated mean of 25.4 for 20 Mr. America winners from the
 *   presteroid era (1939-1959); steroid users ranged 28-32. This 25 ceiling
 *   is specific to that male sample — the study did not include women, so
 *   there is no equivalent peer-reviewed natural-limit figure for women and
 *   this calculator does not assert one.
 *
 * Fat-free mass is derived from a user-supplied body fat percentage
 * (FFM = weight * (1 - bodyFat/100)); this tool does not estimate body fat
 * itself, since that requires a separate measurement method (calipers,
 * DEXA, bioimpedance, etc.) with its own error margin.
 */

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.45359237;
const NORMALIZATION_COEFFICIENT = 6.3;
const REFERENCE_HEIGHT_M = 1.8;
export const NATURAL_LIMIT_MALE = 25;

export function fatFreeMassKg(weightKg: number, bodyFatPct: number): number {
	return weightKg * (1 - bodyFatPct / 100);
}

export function ffmiFromFfm(ffmKg: number, heightCm: number): number {
	const heightM = heightCm / 100;
	return ffmKg / (heightM * heightM);
}

export function normalizeFfmi(ffmi: number, heightCm: number): number {
	const heightM = heightCm / 100;
	return ffmi + NORMALIZATION_COEFFICIENT * (REFERENCE_HEIGHT_M - heightM);
}

export interface FfmiResult {
	ffmKg: number;
	ffmi: number;
	normalizedFfmi: number;
}

export function ffmiMetric(weightKg: number, heightCm: number, bodyFatPct: number): FfmiResult {
	const ffmKg = fatFreeMassKg(weightKg, bodyFatPct);
	const ffmi = ffmiFromFfm(ffmKg, heightCm);
	return { ffmKg, ffmi, normalizedFfmi: normalizeFfmi(ffmi, heightCm) };
}

export function ffmiImperial(weightLb: number, heightIn: number, bodyFatPct: number): FfmiResult {
	return ffmiMetric(weightLb * KG_PER_LB, heightIn * CM_PER_IN, bodyFatPct);
}

export function kgToLb(kg: number): number {
	return kg / KG_PER_LB;
}

/** Fat-free mass (kg) required to reach a given normalized FFMI at a given height. */
export function ffmForTargetNormalizedFfmi(targetNormalizedFfmi: number, heightCm: number): number {
	const heightM = heightCm / 100;
	const rawFfmiNeeded = targetNormalizedFfmi - NORMALIZATION_COEFFICIENT * (REFERENCE_HEIGHT_M - heightM);
	return rawFfmiNeeded * heightM * heightM;
}
