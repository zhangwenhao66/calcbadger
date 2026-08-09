import { describe, expect, it } from 'vitest';
import { computeTip, preTaxSubtotal, roundUpPerPerson, taxAmount, tipAmount } from '../src/lib/tip';

/**
 * Expected values: elementary algebra (tip = base * percent/100, subtotal =
 * total / (1 + taxRate/100)), hand-computed with Python and cross-checked
 * independently (2026-08-10) before the implementation existed.
 */
describe('preTaxSubtotal / taxAmount', () => {
	it('$106 total at 6% tax backs out to a $100 subtotal, $6 tax', () => {
		expect(preTaxSubtotal(106, 6)).toBeCloseTo(100, 10);
		expect(taxAmount(106, 6)).toBeCloseTo(6, 10);
	});

	it('0% tax leaves the total unchanged', () => {
		expect(preTaxSubtotal(80, 0)).toBe(80);
		expect(taxAmount(80, 0)).toBe(0);
	});

	it('$48.15 total at 7% tax backs out to a $44.999... subtotal', () => {
		expect(preTaxSubtotal(48.15, 7)).toBeCloseTo(44.99999999999999, 6);
	});
});

describe('tipAmount', () => {
	it('20% of 100 = 20', () => {
		expect(tipAmount(100, 20)).toBeCloseTo(20, 10);
	});

	it('18% of 80 = 14.4', () => {
		expect(tipAmount(80, 18)).toBeCloseTo(14.4, 10);
	});

	it('0% tip = 0', () => {
		expect(tipAmount(250, 0)).toBe(0);
	});
});

describe('computeTip', () => {
	it('$106 total, 6% tax, 20% tip, pre-tax base, split 2 ways', () => {
		const r = computeTip(106, 6, 20, 'pretax', 2);
		expect(r.preTaxSubtotal).toBeCloseTo(100, 10);
		expect(r.taxAmount).toBeCloseTo(6, 10);
		expect(r.tipOnPreTax).toBeCloseTo(20, 10);
		expect(r.tipOnTotal).toBeCloseTo(21.2, 10);
		expect(r.tip).toBeCloseTo(20, 10); // pretax base selected
		expect(r.grandTotal).toBeCloseTo(126, 10);
		expect(r.perPerson).toBeCloseTo(63, 10);
	});

	it('same bill, total-incl-tax base instead, split 3 ways', () => {
		const r = computeTip(106, 6, 20, 'total', 3);
		expect(r.tip).toBeCloseTo(21.2, 10);
		expect(r.grandTotal).toBeCloseTo(127.2, 10);
		expect(r.perPerson).toBeCloseTo(42.4, 10);
	});

	it('pre-tax tip is always <= total-base tip for a positive tax rate', () => {
		const r = computeTip(200, 8.5, 18, 'pretax', 1);
		expect(r.tipOnPreTax).toBeLessThan(r.tipOnTotal);
	});

	it('0% tax collapses both bases to the same tip', () => {
		const r = computeTip(80, 0, 18, 'pretax', 1);
		expect(r.tipOnPreTax).toBeCloseTo(r.tipOnTotal, 10);
		expect(r.tipOnPreTax).toBeCloseTo(14.4, 10);
	});

	it('numPeople <= 0 falls back to 1 (no division by zero or negative split)', () => {
		const r0 = computeTip(100, 0, 20, 'pretax', 0);
		const r1 = computeTip(100, 0, 20, 'pretax', 1);
		expect(r0.perPerson).toBeCloseTo(r1.perPerson, 10);
	});
});

describe('roundUpPerPerson', () => {
	it('rounds $63.00 up to the nearest $5 (already exact, stays $65 minimum ceiling)', () => {
		// 63 is not a multiple of 5, ceil(63/5)*5 = 65
		expect(roundUpPerPerson(63, 5)).toBe(65);
	});

	it('rounds $64.20 up to the nearest whole $1 = $65', () => {
		expect(roundUpPerPerson(64.2, 1)).toBe(65);
	});

	it('an exact multiple stays unchanged', () => {
		expect(roundUpPerPerson(60, 5)).toBe(60);
	});

	it('increment <= 0 returns the value unchanged (round-up disabled)', () => {
		expect(roundUpPerPerson(63.47, 0)).toBe(63.47);
		expect(roundUpPerPerson(63.47, -5)).toBe(63.47);
	});
});
