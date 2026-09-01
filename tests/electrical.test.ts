import { describe, expect, it } from 'vitest';
import { ampsFrom, multiplierFor, round2, voltsFrom, wattsFrom } from '../src/lib/electrical';

/**
 * Expected values: hand-computed from Watt's Law (P = V x I) and its
 * three-phase variants, independently cross-checked with a Python
 * calculation (2026-09-01). The 15A/120V/1800W example additionally matches
 * a published worked example (inchcalculator.com/amps-to-watts-calculator/).
 */
describe('multiplierFor', () => {
	it('DC is 1', () => {
		expect(multiplierFor('dc', 'line-to-line')).toBe(1);
	});

	it('AC single-phase is 1', () => {
		expect(multiplierFor('ac1', 'line-to-line')).toBe(1);
	});

	it('AC three-phase line-to-line is sqrt(3)', () => {
		expect(multiplierFor('ac3', 'line-to-line')).toBeCloseTo(Math.sqrt(3), 10);
	});

	it('AC three-phase line-to-neutral is 3', () => {
		expect(multiplierFor('ac3', 'line-to-neutral')).toBe(3);
	});
});

describe('wattsFrom', () => {
	it('DC: 12V x 5A = 60W', () => {
		expect(wattsFrom(12, 5, 1, 'dc', 'line-to-line')).toBeCloseTo(60, 10);
	});

	it('AC1, PF=1: 120V x 15A = 1800W (matches published worked example)', () => {
		expect(wattsFrom(120, 15, 1, 'ac1', 'line-to-line')).toBeCloseTo(1800, 10);
	});

	it('AC1, PF=0.8: 230V x 10A x 0.8 = 1840W', () => {
		expect(wattsFrom(230, 10, 0.8, 'ac1', 'line-to-line')).toBeCloseTo(1840, 10);
	});

	it('AC3 line-to-line, PF=0.9: sqrt(3) x 400V x 20A x 0.9 = 12470.77W', () => {
		expect(round2(wattsFrom(400, 20, 0.9, 'ac3', 'line-to-line'))).toBeCloseTo(12470.77, 2);
	});

	it('AC3 line-to-neutral, PF=1: 3 x 230V x 10A = 6900W', () => {
		expect(wattsFrom(230, 10, 1, 'ac3', 'line-to-neutral')).toBeCloseTo(6900, 10);
	});

	it('0A gives 0W', () => {
		expect(wattsFrom(120, 0, 1, 'ac1', 'line-to-line')).toBe(0);
	});
});

describe('ampsFrom (reverse of wattsFrom)', () => {
	it('DC: 60W / 12V = 5A', () => {
		expect(ampsFrom(60, 12, 1, 'dc', 'line-to-line')).toBeCloseTo(5, 10);
	});

	it('AC1: 1800W / 120V / 1 = 15A', () => {
		expect(ampsFrom(1800, 120, 1, 'ac1', 'line-to-line')).toBeCloseTo(15, 10);
	});

	it('AC1, PF=0.8: 1840W / (230V x 0.8) = 10A', () => {
		expect(ampsFrom(1840, 230, 0.8, 'ac1', 'line-to-line')).toBeCloseTo(10, 10);
	});

	it('AC3 line-to-line, PF=0.9: round-trips to 20A', () => {
		const watts = wattsFrom(400, 20, 0.9, 'ac3', 'line-to-line');
		expect(ampsFrom(watts, 400, 0.9, 'ac3', 'line-to-line')).toBeCloseTo(20, 8);
	});

	it('AC3 line-to-neutral, PF=1: 6900W / (3 x 230V) = 10A', () => {
		expect(ampsFrom(6900, 230, 1, 'ac3', 'line-to-neutral')).toBeCloseTo(10, 10);
	});
});

describe('voltsFrom (reverse of wattsFrom)', () => {
	it('DC: 60W / 5A = 12V', () => {
		expect(voltsFrom(60, 5, 1, 'dc', 'line-to-line')).toBeCloseTo(12, 10);
	});

	it('AC1: 1800W / 15A / 1 = 120V', () => {
		expect(voltsFrom(1800, 15, 1, 'ac1', 'line-to-line')).toBeCloseTo(120, 10);
	});

	it('AC3 line-to-neutral, PF=1: 6900W / (3 x 10A) = 230V', () => {
		expect(voltsFrom(6900, 10, 1, 'ac3', 'line-to-neutral')).toBeCloseTo(230, 10);
	});
});

describe('round-trip consistency across all three circuit types', () => {
	const cases: Array<[number, number, number, 'dc' | 'ac1' | 'ac3', 'line-to-line' | 'line-to-neutral']> = [
		[12, 5, 1, 'dc', 'line-to-line'],
		[120, 15, 1, 'ac1', 'line-to-line'],
		[230, 10, 0.8, 'ac1', 'line-to-line'],
		[400, 20, 0.9, 'ac3', 'line-to-line'],
		[230, 10, 1, 'ac3', 'line-to-neutral'],
		[277, 8, 0.85, 'ac3', 'line-to-neutral'],
	];

	for (const [v, i, pf, circuit, vt] of cases) {
		it(`${circuit}/${vt} V=${v} I=${i} PF=${pf}: watts->amps and watts->volts both recover the inputs`, () => {
			const w = wattsFrom(v, i, pf, circuit, vt);
			expect(ampsFrom(w, v, pf, circuit, vt)).toBeCloseTo(i, 8);
			expect(voltsFrom(w, i, pf, circuit, vt)).toBeCloseTo(v, 8);
		});
	}
});
