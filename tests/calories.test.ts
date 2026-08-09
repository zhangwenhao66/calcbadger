import { describe, expect, it } from 'vitest';
import {
	ACTIVITY_MULTIPLIERS,
	bmrImperial,
	bmrMetric,
	calorieTarget,
	dailyCalorieAdjustment,
	isBelowSafeMinimum,
	safeMinimumCalories,
	tdee,
} from '../src/lib/calories';

/**
 * Expected values: Mifflin-St Jeor equation (Am J Clin Nutr 1990;51(2):241-247),
 * hand-computed and cross-checked with an independent calculation
 * (2026-08-09). Imperial path uses the exact international conversion
 * factors (1 lb = 0.45359237 kg, 1 in = 2.54 cm) before applying the same
 * metric formula, mirroring the length/weight converters' approach.
 */
describe('bmrMetric', () => {
	it('male, 80kg, 180cm, 30y = 1780', () => {
		expect(bmrMetric('male', 80, 180, 30)).toBeCloseTo(1780, 6);
	});

	it('female, 65kg, 165cm, 25y = 1395.25', () => {
		expect(bmrMetric('female', 65, 165, 25)).toBeCloseTo(1395.25, 6);
	});

	it('the only difference between sexes is the +5 / -161 constant', () => {
		const male = bmrMetric('male', 70, 170, 40);
		const female = bmrMetric('female', 70, 170, 40);
		expect(male - female).toBeCloseTo(166, 6);
	});
});

describe('bmrImperial', () => {
	it('male, 200lb, 70in, 40y = 1823.435 (matches metric path via exact conversion)', () => {
		expect(bmrImperial('male', 200, 70, 40)).toBeCloseTo(1823.43474, 3);
	});

	it('female, 140lb, 64in, 35y = 1315.029', () => {
		expect(bmrImperial('female', 140, 64, 35)).toBeCloseTo(1315.029318, 3);
	});
});

describe('tdee', () => {
	it('applies the sedentary-to-extra-active multipliers 1.2/1.375/1.55/1.725/1.9', () => {
		expect(ACTIVITY_MULTIPLIERS.sedentary).toBe(1.2);
		expect(ACTIVITY_MULTIPLIERS.light).toBe(1.375);
		expect(ACTIVITY_MULTIPLIERS.moderate).toBe(1.55);
		expect(ACTIVITY_MULTIPLIERS.active).toBe(1.725);
		expect(ACTIVITY_MULTIPLIERS.very_active).toBe(1.9);
	});

	it('BMR 1780 * moderate (1.55) = 2759', () => {
		expect(tdee(1780, 'moderate')).toBeCloseTo(2759, 6);
	});

	it('BMR 1395.25 * sedentary (1.2) = 1674.3', () => {
		expect(tdee(1395.25, 'sedentary')).toBeCloseTo(1674.3, 6);
	});

	it('BMR 1823.43474 * active (1.725) = 3145.425', () => {
		expect(tdee(1823.43474, 'active')).toBeCloseTo(3145.425, 2);
	});
});

describe('dailyCalorieAdjustment — 3,500 kcal/lb rule', () => {
	it('1 lb/week = 500 kcal/day', () => {
		expect(dailyCalorieAdjustment(1)).toBeCloseTo(500, 6);
	});

	it('2 lb/week = 1000 kcal/day', () => {
		expect(dailyCalorieAdjustment(2)).toBeCloseTo(1000, 6);
	});

	it('0.5 lb/week = 250 kcal/day', () => {
		expect(dailyCalorieAdjustment(0.5)).toBeCloseTo(250, 6);
	});
});

describe('calorieTarget', () => {
	it('lose 1 lb/week from TDEE 2759 = 2259', () => {
		expect(calorieTarget(2759, 'lose', 1)).toBeCloseTo(2259, 6);
	});

	it('lose 2 lb/week from TDEE 2759 = 1759', () => {
		expect(calorieTarget(2759, 'lose', 2)).toBeCloseTo(1759, 6);
	});

	it('maintain ignores the rate and returns TDEE unchanged', () => {
		expect(calorieTarget(2759, 'maintain', 2)).toBe(2759);
	});

	it('gain 0.5 lb/week from TDEE 2759 = 3009', () => {
		expect(calorieTarget(2759, 'gain', 0.5)).toBeCloseTo(3009, 6);
	});
});

describe('safeMinimumCalories / isBelowSafeMinimum — 2013 AHA/ACC/TOS guideline floor', () => {
	it('male floor is 1500, female floor is 1200', () => {
		expect(safeMinimumCalories('male')).toBe(1500);
		expect(safeMinimumCalories('female')).toBe(1200);
	});

	it('1759 is not below the male floor, 1400 is', () => {
		expect(isBelowSafeMinimum(1759, 'male')).toBe(false);
		expect(isBelowSafeMinimum(1400, 'male')).toBe(true);
	});

	it('1250 is not below the female floor, 1100 is', () => {
		expect(isBelowSafeMinimum(1250, 'female')).toBe(false);
		expect(isBelowSafeMinimum(1100, 'female')).toBe(true);
	});
});
