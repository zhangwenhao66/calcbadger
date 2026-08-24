import { describe, expect, it } from 'vitest';
import {
	fatFreeMassKg,
	ffmForTargetNormalizedFfmi,
	ffmiFromFfm,
	ffmiImperial,
	ffmiMetric,
	kgToLb,
	normalizeFfmi,
} from '../src/lib/ffmi';

/**
 * Expected values: Kouri et al. 1995 formula (FFM = weight * (1 -
 * bodyFat/100); FFMI = FFM / height(m)^2; normalized FFMI = FFMI + 6.3 *
 * (1.80 - height(m))), hand-computed and cross-checked with an independent
 * Python calculation (2026-08-24).
 */
describe('fatFreeMassKg', () => {
	it('90 kg at 12% body fat = 79.2 kg fat-free mass', () => {
		expect(fatFreeMassKg(90, 12)).toBeCloseTo(79.2, 5);
	});

	it('0% body fat returns full body weight', () => {
		expect(fatFreeMassKg(80, 0)).toBe(80);
	});
});

describe('ffmiFromFfm', () => {
	it('79.2 kg FFM at 180 cm = 24.444', () => {
		expect(ffmiFromFfm(79.2, 180)).toBeCloseTo(24.444444, 5);
	});
});

describe('normalizeFfmi', () => {
	it('at exactly 180 cm, normalized FFMI equals raw FFMI (reference height)', () => {
		expect(normalizeFfmi(24.444444, 180)).toBeCloseTo(24.444444, 5);
	});

	it('below 180 cm, normalization adds a positive correction', () => {
		// 16.113281 raw FFMI at 160 cm -> +6.3*(1.80-1.60) = +1.26
		expect(normalizeFfmi(16.113281, 160)).toBeCloseTo(17.373281, 5);
	});

	it('above 180 cm, normalization subtracts', () => {
		// height 190cm -> 6.3*(1.80-1.90) = -0.63
		expect(normalizeFfmi(20, 190)).toBeCloseTo(19.37, 5);
	});
});

describe('ffmiMetric', () => {
	it('90 kg, 180 cm, 12% body fat', () => {
		const r = ffmiMetric(90, 180, 12);
		expect(r.ffmKg).toBeCloseTo(79.2, 5);
		expect(r.ffmi).toBeCloseTo(24.444444, 5);
		expect(r.normalizedFfmi).toBeCloseTo(24.444444, 5);
	});

	it('55 kg, 160 cm, 25% body fat (small frame, short height case)', () => {
		const r = ffmiMetric(55, 160, 25);
		expect(r.ffmKg).toBeCloseTo(41.25, 5);
		expect(r.ffmi).toBeCloseTo(16.113281, 5);
		expect(r.normalizedFfmi).toBeCloseTo(17.373281, 5);
	});
});

describe('ffmiImperial', () => {
	it('200 lb, 5\'10" (70 in), 15% body fat matches metric conversion', () => {
		const r = ffmiImperial(200, 70, 15);
		// 200 lb = 90.718474 kg, 70 in = 177.8 cm
		expect(r.ffmKg).toBeCloseTo(77.1107029, 4);
		expect(r.ffmi).toBeCloseTo(24.3922099, 4);
		expect(r.normalizedFfmi).toBeCloseTo(24.5308099, 4);
	});
});

describe('kgToLb', () => {
	it('79.2 kg = 174.606 lb', () => {
		expect(kgToLb(79.2)).toBeCloseTo(174.60611, 3);
	});
});

describe('ffmForTargetNormalizedFfmi', () => {
	it('180 cm needs 64.8 kg FFM for normalized FFMI 20', () => {
		expect(ffmForTargetNormalizedFfmi(20, 180)).toBeCloseTo(64.8, 1);
	});

	it('180 cm needs 81.0 kg FFM for normalized FFMI 25 (the natural-limit reference)', () => {
		expect(ffmForTargetNormalizedFfmi(25, 180)).toBeCloseTo(81.0, 1);
	});

	it('160 cm needs 60.8 kg FFM for normalized FFMI 25', () => {
		expect(ffmForTargetNormalizedFfmi(25, 160)).toBeCloseTo(60.8, 1);
	});

	it('round-trips through ffmiMetric: FFM at the target height/BF gives back the target FFMI', () => {
		const heightCm = 175;
		const target = 22;
		const ffmNeeded = ffmForTargetNormalizedFfmi(target, heightCm);
		const bodyFatPct = 15;
		const weightKg = ffmNeeded / (1 - bodyFatPct / 100);
		const r = ffmiMetric(weightKg, heightCm, bodyFatPct);
		expect(r.normalizedFfmi).toBeCloseTo(target, 4);
	});
});
