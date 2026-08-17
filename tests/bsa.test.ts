import { describe, expect, it } from 'vitest';
import { bsaDuBois, bsaImperial, bsaMetric, bsaMosteller, m2ToFt2 } from '../src/lib/bsa';

/**
 * Expected values: Du Bois BSA(m^2) = 0.007184 * height(cm)^0.725 *
 * weight(kg)^0.425 (Du Bois & Du Bois, Arch Intern Med 1916;17(6):863-71);
 * Mosteller BSA(m^2) = sqrt(height(cm) * weight(kg) / 3600) (Mosteller,
 * N Engl J Med 1987;317(17):1098). Hand-computed with an independent Python
 * calculation (2026-08-17), not copied from the implementation's output.
 * Imperial conversions use 2.54 cm/in and 0.45359237 kg/lb.
 */
describe('bsaDuBois', () => {
	it('170 cm / 70 kg = 1.8097 m^2', () => {
		expect(bsaDuBois(170, 70)).toBeCloseTo(1.809708, 5);
	});

	it('150 cm / 45 kg = 1.3698 m^2', () => {
		expect(bsaDuBois(150, 45)).toBeCloseTo(1.369770, 5);
	});

	it('190 cm / 110 kg = 2.3771 m^2', () => {
		expect(bsaDuBois(190, 110)).toBeCloseTo(2.377139, 5);
	});
});

describe('bsaMosteller', () => {
	it('170 cm / 70 kg = 1.8181 m^2', () => {
		expect(bsaMosteller(170, 70)).toBeCloseTo(1.818119, 5);
	});

	it('150 cm / 45 kg = 1.3693 m^2', () => {
		expect(bsaMosteller(150, 45)).toBeCloseTo(1.369306, 5);
	});

	it('190 cm / 110 kg = 2.4095 m^2', () => {
		expect(bsaMosteller(190, 110)).toBeCloseTo(2.409472, 5);
	});
});

describe('bsaMetric (formula switch)', () => {
	it('routes to Du Bois', () => {
		expect(bsaMetric(170, 70, 'dubois')).toBeCloseTo(1.809708, 5);
	});

	it('routes to Mosteller', () => {
		expect(bsaMetric(170, 70, 'mosteller')).toBeCloseTo(1.818119, 5);
	});
});

describe('bsaImperial', () => {
	it('70 in / 180 lb, Du Bois = 1.9959 m^2', () => {
		expect(bsaImperial(70, 180, 'dubois')).toBeCloseTo(1.995908, 4);
	});

	it('70 in / 180 lb, Mosteller = 2.0081 m^2', () => {
		expect(bsaImperial(70, 180, 'mosteller')).toBeCloseTo(2.008093, 4);
	});

	it('64 in / 130 lb, Du Bois = 1.6288 m^2', () => {
		expect(bsaImperial(64, 130, 'dubois')).toBeCloseTo(1.628771, 4);
	});

	it('64 in / 130 lb, Mosteller = 1.6318 m^2', () => {
		expect(bsaImperial(64, 130, 'mosteller')).toBeCloseTo(1.631774, 4);
	});
});

describe('m2ToFt2', () => {
	it('1.809708 m^2 (170/70 Du Bois) = 19.4795 ft^2', () => {
		expect(m2ToFt2(bsaDuBois(170, 70))).toBeCloseTo(19.479533, 3);
	});

	it('1 m^2 = 10.7639 ft^2', () => {
		expect(m2ToFt2(1)).toBeCloseTo(10.76391, 4);
	});
});

describe('formula agreement for a typical adult (Mosteller runs ~0.5% above Du Bois)', () => {
	it('170 cm / 70 kg: within 1% of each other', () => {
		const db = bsaDuBois(170, 70);
		const mo = bsaMosteller(170, 70);
		expect(Math.abs(mo - db) / db).toBeLessThan(0.01);
	});
});
