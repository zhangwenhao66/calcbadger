/**
 * Daily calorie needs: basal metabolic rate, activity-adjusted maintenance
 * calories, and a goal-based target.
 *
 * BMR formula authority: Mifflin MD, St Jeor ST, et al., "A new predictive
 * equation for resting energy expenditure in healthy individuals," American
 * Journal of Clinical Nutrition 1990;51(2):241-247 — the equation studies
 * have since found estimates resting energy expenditure within 10% of
 * measured indirect calorimetry more often than the older Harris-Benedict
 * equation, which is why dietitians now default to it.
 *   Men:   BMR = 10*weight(kg) + 6.25*height(cm) - 5*age(y) + 5
 *   Women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age(y) - 161
 *
 * Activity multipliers: the standard sedentary-to-extra-active scale used
 * across sports-nutrition references (e.g. the exercise-physiology PAL
 * categories built on the original Harris-Benedict activity factors) —
 * 1.2 / 1.375 / 1.55 / 1.725 / 1.9. There is no single government standard
 * for these factors; they are a widely used convention, not a law of
 * physiology, which is why the page frames them as a starting estimate.
 *
 * Goal target: 1 lb of body fat is conventionally treated as ~3,500 kcal
 * (Wishnofsky, 1958), so a 500 kcal/day deficit or surplus is framed as
 * "about 1 lb/week." This is a short-term linear approximation only —
 * NIH/NIDDK's dynamic Body Weight Planner research (Hall KD et al.) has
 * shown the body's energy requirements adapt as weight changes, so real
 * results run slower than the linear rule predicts over many weeks.
 *
 * Safe-minimum threshold: the 2013 AHA/ACC/TOS Guideline for the Management
 * of Overweight and Obesity in Adults recommends reduced-calorie diets of
 * approximately 1,200-1,500 kcal/day for women and 1,500-1,800 kcal/day for
 * men; this calculator flags targets below 1,200 (women) / 1,500 (men) as
 * needing medical supervision rather than silently clamping them.
 */

export type Sex = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
	sedentary: 1.2,
	light: 1.375,
	moderate: 1.55,
	active: 1.725,
	very_active: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
	sedentary: 'Sedentary (little or no exercise, desk job)',
	light: 'Lightly active (light exercise 1-3 days/week)',
	moderate: 'Moderately active (moderate exercise 3-5 days/week)',
	active: 'Very active (hard exercise 6-7 days/week)',
	very_active: 'Extra active (hard daily exercise + physical job)',
};

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function bmrMetric(sex: Sex, weightKg: number, heightCm: number, age: number): number {
	const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
	return sex === 'male' ? base + 5 : base - 161;
}

export function bmrImperial(sex: Sex, weightLb: number, heightIn: number, age: number): number {
	return bmrMetric(sex, weightLb * LB_TO_KG, heightIn * IN_TO_CM, age);
}

export function tdee(bmr: number, activity: ActivityLevel): number {
	return bmr * ACTIVITY_MULTIPLIERS[activity];
}

export type Goal = 'lose' | 'maintain' | 'gain';

const KCAL_PER_LB = 3500;

/** Daily deficit/surplus implied by losing or gaining `rateLbPerWeek`. */
export function dailyCalorieAdjustment(rateLbPerWeek: number): number {
	return (rateLbPerWeek * KCAL_PER_LB) / 7;
}

export function calorieTarget(tdeeValue: number, goal: Goal, rateLbPerWeek: number): number {
	if (goal === 'maintain') return tdeeValue;
	const adjustment = dailyCalorieAdjustment(rateLbPerWeek);
	return goal === 'lose' ? tdeeValue - adjustment : tdeeValue + adjustment;
}

/** 2013 AHA/ACC/TOS guideline floor for a supervised reduced-calorie diet. */
export function safeMinimumCalories(sex: Sex): number {
	return sex === 'male' ? 1500 : 1200;
}

export function isBelowSafeMinimum(targetCalories: number, sex: Sex): boolean {
	return targetCalories < safeMinimumCalories(sex);
}
