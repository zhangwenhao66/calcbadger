/**
 * Steps-to-distance conversion via personalized stride length, not a flat
 * steps-per-mile constant. Step length as a fraction of height (0.415 for
 * men, 0.413 for women) is the regression Hoeger et al. fit across walking
 * and running speeds: "One-Mile Step Count at Walking and Running Speeds,"
 * ACSM's Health & Fitness Journal, Vol. 12, No. 1 (2008). (The paper's own
 * abstract doesn't state a sample size for this coefficient — don't restate
 * one; see 内容通用教训库.md L-0805-21.)
 */

export type Gender = 'male' | 'female';

const STEP_LENGTH_FACTOR: Record<Gender, number> = {
	male: 0.415,
	female: 0.413,
};

const INCHES_PER_MILE = 63360; // 5280 ft * 12 in
const INCHES_PER_CM = 1 / 2.54;

/** Average step length in inches from height in inches and gender. */
export function stepLengthInches(heightInches: number, gender: Gender): number {
	return heightInches * STEP_LENGTH_FACTOR[gender];
}

export function stepsToMiles(steps: number, stepLenInches: number): number {
	return (steps * stepLenInches) / INCHES_PER_MILE;
}

export function stepsToKm(steps: number, stepLenInches: number): number {
	return (steps * stepLenInches) / INCHES_PER_CM / 100000;
}

export function milesToSteps(miles: number, stepLenInches: number): number {
	return (miles * INCHES_PER_MILE) / stepLenInches;
}

export function kmToSteps(km: number, stepLenInches: number): number {
	return (km * 100000 * INCHES_PER_CM) / stepLenInches;
}

export function cmToInches(cm: number): number {
	return cm * INCHES_PER_CM;
}
