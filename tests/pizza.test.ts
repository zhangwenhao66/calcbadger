import { describe, expect, it } from 'vitest';
import { computePizzaOrder, peopleFedBySize, SLICES_PER_ADULT, SLICES_PER_SIZE } from '../src/lib/pizza';

/**
 * Expected values: hand-computed arithmetic (raw = adults*slicesPerAdult +
 * children*2, optionally *0.75 for heavy sides; pizzas = ceil(needed / slices
 * per pizza)), cross-checked against Pizza Hut's published "3/8 rule" example
 * (16 guests -> 6 large pizzas) before the implementation existed.
 */
describe('computePizzaOrder', () => {
	it('8 average-appetite adults, large pizzas: 24 slices needed, exactly 3 pizzas, no leftovers', () => {
		const r = computePizzaOrder(8, 0, 'average', 'large', false);
		expect(r.slicesPerPizza).toBe(8);
		expect(r.rawSlicesNeeded).toBe(24);
		expect(r.slicesNeeded).toBe(24);
		expect(r.pizzasNeeded).toBe(3);
		expect(r.slicesProvided).toBe(24);
		expect(r.leftoverSlices).toBe(0);
	});

	it("matches Pizza Hut's published 3/8 rule example: 16 average-appetite adults -> 6 large pizzas", () => {
		const r = computePizzaOrder(16, 0, 'average', 'large', false);
		expect(r.pizzasNeeded).toBe(6);
		expect(r.leftoverSlices).toBe(0);
	});

	it('mixed group with heavy sides: 10 hearty adults + 5 children, medium pizzas, sides cut order by 25%', () => {
		const r = computePizzaOrder(10, 5, 'hearty', 'medium', true);
		// raw = (10*4 + 5*2) * 0.75 = 50 * 0.75 = 37.5
		expect(r.rawSlicesNeeded).toBeCloseTo(37.5, 10);
		expect(r.slicesNeeded).toBe(38); // ceil(37.5)
		expect(r.pizzasNeeded).toBe(5); // ceil(38/8)
		expect(r.slicesProvided).toBe(40);
		expect(r.leftoverSlices).toBe(2);
	});

	it('same mixed group without heavy sides needs one more pizza', () => {
		const r = computePizzaOrder(10, 5, 'hearty', 'medium', false);
		// raw = 10*4 + 5*2 = 50
		expect(r.rawSlicesNeeded).toBe(50);
		expect(r.slicesNeeded).toBe(50);
		expect(r.pizzasNeeded).toBe(7); // ceil(50/8)
		expect(r.slicesProvided).toBe(56);
		expect(r.leftoverSlices).toBe(6);
	});

	it('a single light-appetite adult on a small pizza only needs 1 pizza with slices to spare', () => {
		const r = computePizzaOrder(1, 0, 'light', 'small', false);
		expect(r.rawSlicesNeeded).toBe(2);
		expect(r.pizzasNeeded).toBe(1);
		expect(r.slicesProvided).toBe(6);
		expect(r.leftoverSlices).toBe(4);
	});

	it('zero people needs zero pizzas (no division producing a stray minimum of 1)', () => {
		const r = computePizzaOrder(0, 0, 'average', 'large', false);
		expect(r.slicesNeeded).toBe(0);
		expect(r.pizzasNeeded).toBe(0);
		expect(r.slicesProvided).toBe(0);
		expect(r.leftoverSlices).toBe(0);
	});

	it('negative adults/children are clamped to 0, not treated as negative slices', () => {
		const r = computePizzaOrder(-5, -3, 'average', 'large', false);
		expect(r.rawSlicesNeeded).toBe(0);
		expect(r.pizzasNeeded).toBe(0);
	});

	it('extra-large pizzas hold 12 slices each, cutting the pizza count for a big group', () => {
		const r = computePizzaOrder(24, 0, 'average', 'xlarge', false);
		// raw = 24*3 = 72; 72/12 = 6 exactly
		expect(r.rawSlicesNeeded).toBe(72);
		expect(r.pizzasNeeded).toBe(6);
		expect(r.leftoverSlices).toBe(0);
	});
});

describe('peopleFedBySize', () => {
	it('a large pizza (8 slices) feeds 2 average-appetite adults (3 slices each) with 2 slices left', () => {
		expect(peopleFedBySize('large', 'average')).toBe(2);
	});

	it('the same large pizza feeds 4 light-appetite adults (2 slices each)', () => {
		expect(peopleFedBySize('large', 'light')).toBe(4);
	});

	it('an extra-large pizza (12 slices) feeds 3 hearty-appetite adults (4 slices each)', () => {
		expect(peopleFedBySize('xlarge', 'hearty')).toBe(3);
	});

	it('a medium pizza (8 slices) feeds 2 average-appetite adults, same as large', () => {
		expect(peopleFedBySize('medium', 'average')).toBe(2);
	});

	it('a small pizza (6 slices) feeds exactly 2 average-appetite adults', () => {
		expect(peopleFedBySize('small', 'average')).toBe(2);
	});
});

describe('constants match the documented conventions', () => {
	it('slices per size: small 6, medium 8, large 8, xlarge 12', () => {
		expect(SLICES_PER_SIZE).toEqual({ small: 6, medium: 8, large: 8, xlarge: 12 });
	});

	it('slices per adult: light 2, average 3, hearty 4', () => {
		expect(SLICES_PER_ADULT).toEqual({ light: 2, average: 3, hearty: 4 });
	});
});
