import { describe, expect, it } from 'vitest';
import {
	dilutionStockVolume,
	massForMolarity,
	molarity,
	molarMassFromMolarity,
	molesOfSolute,
	volumeForMolarity,
} from '../src/lib/molarity';

/**
 * Expected values: hand-worked from the IUPAC definition c = n/V with n = m/M.
 * Molar masses from PubChem: NaCl 58.44 g/mol, NaOH 40.00 g/mol,
 * glucose (C6H12O6) 180.16 g/mol.
 */
describe('molarity', () => {
	it('58.44 g NaCl in 1 L = exactly 1.000 M (one mole by definition)', () => {
		expect(molarity(58.44, 58.44, 1)).toBeCloseTo(1.0, 10);
	});

	it('20 g NaOH in 500 mL = 1.0 M (20/40 = 0.5 mol in 0.5 L)', () => {
		expect(molarity(20, 40.0, 0.5)).toBeCloseTo(1.0, 10);
	});

	it('90.08 g glucose in 2 L = 0.25 M (0.5 mol in 2 L)', () => {
		expect(molarity(90.08, 180.16, 2)).toBeCloseTo(0.25, 10);
	});
});

describe('inverse solvers', () => {
	it('mass for 0.1 M NaCl in 250 mL = 1.461 g (0.025 mol x 58.44)', () => {
		expect(massForMolarity(0.1, 58.44, 0.25)).toBeCloseTo(1.461, 6);
	});

	it('volume that makes 20 g NaOH a 2 M solution = 0.25 L', () => {
		expect(volumeForMolarity(20, 40.0, 2)).toBeCloseTo(0.25, 10);
	});

	it('recovers molar mass: 58.44 g giving 1 M in 1 L -> 58.44 g/mol', () => {
		expect(molarMassFromMolarity(58.44, 1, 1)).toBeCloseTo(58.44, 10);
	});

	it('moles of solute: 0.5 M x 2 L = 1 mol', () => {
		expect(molesOfSolute(0.5, 2)).toBeCloseTo(1, 12);
	});
});

describe('dilution (c1V1 = c2V2)', () => {
	it('making 500 mL of 0.5 M from 6 M stock needs 41.67 mL', () => {
		// V1 = (0.5 x 0.5) / 6 = 0.0416667 L, hand-worked
		expect(dilutionStockVolume(6, 0.5, 0.5)).toBeCloseTo(0.0416667, 6);
	});

	it('diluting to the same concentration needs the full volume', () => {
		expect(dilutionStockVolume(2, 2, 1)).toBeCloseTo(1, 12);
	});
});
