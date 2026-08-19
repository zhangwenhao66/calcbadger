import { describe, expect, it } from 'vitest';
import {
	costFromPriceAndMarkup,
	marginPercentFromMarkupPercent,
	markupFromCostAndPrice,
	markupPercentFromMarginPercent,
	sellingPriceFromCostAndMarkup,
} from '../src/lib/markup';

/**
 * Expected values: elementary cost-accounting algebra (markup% = profit/cost
 * * 100, margin% = profit/price * 100), hand-computed with Python and
 * cross-checked independently (2026-08-19) before the implementation
 * existed. Reference case (cost 70, price 100 -> markup ~42.86%, margin 30%)
 * cross-checked against the worked example in Corporate Finance Institute's
 * "Markup" article and AccountingTools' "difference between margin and
 * markup" article, both of which use the same cost-as-denominator vs.
 * price-as-denominator distinction.
 */

describe('sellingPriceFromCostAndMarkup', () => {
	it('$40 cost at 35% markup -> $54.00 price, $14.00 profit, 25.93% margin', () => {
		const r = sellingPriceFromCostAndMarkup(40, 35);
		expect(r.sellingPrice).toBeCloseTo(54, 10);
		expect(r.profit).toBeCloseTo(14, 10);
		expect(r.markupPercent).toBeCloseTo(35, 10);
		expect(r.marginPercent).toBeCloseTo(25.925925925925924, 6);
	});

	it('$70 cost at 100% markup doubles to $140 (classic "keystone" retail markup)', () => {
		const r = sellingPriceFromCostAndMarkup(70, 100);
		expect(r.sellingPrice).toBeCloseTo(140, 10);
		expect(r.marginPercent).toBeCloseTo(50, 10);
	});

	it('0% markup returns price = cost, 0 profit, 0 margin', () => {
		const r = sellingPriceFromCostAndMarkup(25, 0);
		expect(r.sellingPrice).toBeCloseTo(25, 10);
		expect(r.profit).toBeCloseTo(0, 10);
		expect(r.marginPercent).toBeCloseTo(0, 10);
	});
});

describe('markupFromCostAndPrice', () => {
	it('cost $70, price $100 -> markup 42.857...%, margin 30% (CFI/AccountingTools reference case)', () => {
		const r = markupFromCostAndPrice(70, 100);
		expect(r).not.toBeNull();
		expect(r!.profit).toBeCloseTo(30, 10);
		expect(r!.markupPercent).toBeCloseTo(42.857142857142854, 6);
		expect(r!.marginPercent).toBeCloseTo(30, 10);
	});

	it('cost $18.50, price $24.99 -> markup ~35.08%, margin ~25.97%', () => {
		const r = markupFromCostAndPrice(18.5, 24.99);
		expect(r).not.toBeNull();
		expect(r!.markupPercent).toBeCloseTo(35.081081081081074, 6);
		expect(r!.marginPercent).toBeCloseTo(25.970388155262103, 6);
	});

	it('cost = 0 returns null (markup undefined relative to a $0 cost)', () => {
		expect(markupFromCostAndPrice(0, 50)).toBeNull();
	});

	it('selling below cost gives a negative markup and margin', () => {
		const r = markupFromCostAndPrice(100, 80);
		expect(r).not.toBeNull();
		expect(r!.profit).toBeCloseTo(-20, 10);
		expect(r!.markupPercent).toBeCloseTo(-20, 10);
		expect(r!.marginPercent).toBeCloseTo(-25, 10);
	});
});

describe('costFromPriceAndMarkup', () => {
	it('price $54, 35% markup -> cost $40 (inverse of the first sellingPrice case)', () => {
		const r = costFromPriceAndMarkup(54, 35);
		expect(r).not.toBeNull();
		expect(r!.cost).toBeCloseTo(40, 10);
		expect(r!.markupPercent).toBeCloseTo(35, 10);
	});

	it('markup = -100% returns null (a $0 price is consistent with any cost)', () => {
		expect(costFromPriceAndMarkup(0, -100)).toBeNull();
	});
});

describe('marginPercentFromMarkupPercent / markupPercentFromMarginPercent (round-trip + reference table)', () => {
	it.each([
		[10, 9.090909090909092],
		[20, 16.666666666666668],
		[25, 20],
		[30, 23.076923076923077],
		[40, 28.571428571428573],
		[50, 33.33333333333333],
		[75, 42.857142857142854],
		[100, 50],
		[150, 60],
		[200, 66.66666666666667],
		[300, 75],
	])('markup %i%% -> margin %f%% (Python cross-check)', (markup, expectedMargin) => {
		expect(marginPercentFromMarkupPercent(markup)).toBeCloseTo(expectedMargin, 6);
	});

	it('round-trips: margin computed from a markup converts back to the same markup', () => {
		for (const markup of [10, 25, 50, 100, 150]) {
			const margin = marginPercentFromMarkupPercent(markup)!;
			expect(markupPercentFromMarginPercent(margin)).toBeCloseTo(markup, 6);
		}
	});

	it('markup = -100% makes margin -> null (denominator 0)', () => {
		expect(marginPercentFromMarkupPercent(-100)).toBeNull();
	});

	it('margin = 100% makes markup -> null (a $0 cost has no finite markup %)', () => {
		expect(markupPercentFromMarginPercent(100)).toBeNull();
	});
});
