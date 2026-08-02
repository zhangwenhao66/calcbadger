import { describe, expect, it } from 'vitest';
import {
	bmiImperial,
	bmiMetric,
	classifyBmi,
	healthyWeightRangeKg,
	healthyWeightRangeLb,
} from '../src/lib/bmi';

/**
 * Expected values: CDC formula (weight(kg)/height(m)^2, or 703*lb/in^2),
 * hand-computed and cross-checked with an independent Python calculation
 * (2026-08-02). CDC categories: <18.5 underweight, 18.5-24.9 healthy,
 * 25-29.9 overweight, >=30 obese (30-34.9/35-39.9/>=40 Classes 1/2/3).
 * Asian cutoffs: WHO Expert Consultation, Lancet 2004;363:157-63
 * (23 overweight, 27.5 obese).
 */
describe('bmiMetric', () => {
	it('70 kg / 175 cm = 22.857', () => {
		expect(bmiMetric(70, 175)).toBeCloseTo(22.857143, 5);
	});

	it('45 kg / 170 cm = 15.571 (underweight)', () => {
		expect(bmiMetric(45, 170)).toBeCloseTo(15.570934, 5);
	});

	it('120 kg / 165 cm = 44.077 (obese class 3)', () => {
		expect(bmiMetric(120, 165)).toBeCloseTo(44.077135, 5);
	});
});

describe('bmiImperial', () => {
	it('203 lb / 69 in = 29.975 (just under obese)', () => {
		expect(bmiImperial(203, 69)).toBeCloseTo(29.974585, 5);
	});

	it('154 lb / 68 in ~= metric equivalent of 70 kg / 172.72 cm within CDC rounding', () => {
		// 703 is CDC's rounded factor (exact is ~703.07), so imperial and
		// metric paths for the "same" person differ by a few thousandths.
		const metric = bmiMetric(69.853, 172.72); // 154 lb, 68 in in SI
		const imperial = bmiImperial(154, 68);
		expect(imperial).toBeCloseTo(metric, 2);
	});
});

describe('classifyBmi — who/CDC standard', () => {
	it('18.5 is the underweight/healthy boundary (inclusive of healthy)', () => {
		expect(classifyBmi(18.4, 'who').className).toBe('underweight');
		expect(classifyBmi(18.5, 'who').className).toBe('healthy');
	});

	it('24.9 healthy, 25.0 overweight', () => {
		expect(classifyBmi(24.9, 'who').className).toBe('healthy');
		expect(classifyBmi(25.0, 'who').className).toBe('overweight');
	});

	it('29.9 overweight, 30.0 obese class 1', () => {
		expect(classifyBmi(29.9, 'who').label).toBe('Overweight');
		expect(classifyBmi(30.0, 'who').label).toBe('Obesity (Class 1)');
	});

	it('35 and 40 step into class 2 and class 3', () => {
		expect(classifyBmi(35, 'who').label).toBe('Obesity (Class 2)');
		expect(classifyBmi(40, 'who').label).toBe('Obesity (Class 3)');
	});
});

describe('classifyBmi — asian standard (WHO 2004)', () => {
	it('22.9 healthy, 23.0 overweight', () => {
		expect(classifyBmi(22.9, 'asian').className).toBe('healthy');
		expect(classifyBmi(23.0, 'asian').className).toBe('overweight');
	});

	it('27.4 overweight, 27.5 obese', () => {
		expect(classifyBmi(27.4, 'asian').className).toBe('overweight');
		expect(classifyBmi(27.5, 'asian').className).toBe('obese');
	});
});

describe('healthyWeightRangeKg', () => {
	it('175 cm, who standard: 56.66-76.26 kg', () => {
		const r = healthyWeightRangeKg(175, 'who');
		expect(r.min).toBeCloseTo(56.65625, 3);
		expect(r.max).toBeCloseTo(76.25625, 3);
	});

	it('175 cm, asian standard: narrower band, 56.66-70.13 kg', () => {
		const r = healthyWeightRangeKg(175, 'asian');
		expect(r.min).toBeCloseTo(56.65625, 3);
		expect(r.max).toBeCloseTo(70.13125, 3);
	});
});

describe('healthyWeightRangeLb', () => {
	it('69 in, who standard: 125.3-168.6 lb', () => {
		const r = healthyWeightRangeLb(69, 'who');
		expect(r.min).toBeCloseTo(125.289474, 3);
		expect(r.max).toBeCloseTo(168.632859, 3);
	});
});
