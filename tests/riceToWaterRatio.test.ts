import { describe, expect, it } from 'vitest';
import { computeRiceWater, cupsToGrams, gramsToCups, RICE_TYPES } from '../src/lib/riceToWaterRatio';

/**
 * Expected values are hand/Python-computed independently from the source
 * ratios (USA Rice "Rice Cooking Chart", usarice.com/thinkrice/how-to/how-to-cook-rice,
 * confirmed live 2026-09-03), not copied from this module's own output.
 * Water-ml / cooked-oz figures are pure arithmetic from the sourced ratios
 * (waterCups = riceCups * ratio; ml = cups * 236.588; cookedCups = rice + water;
 * oz = cookedCups * 8), verified with an independent Python script (float,
 * not this TS implementation) before being written here.
 */
describe('computeRiceWater', () => {
	it('white long grain, 2 cups: USA Rice 2:1 ratio -> 4 cups water, 6 cups cooked, 48 oz cooked', () => {
		const r = computeRiceWater(2, 'cups', 'white-long');
		expect(r).not.toBeNull();
		expect(r!.waterCups).toBe(4);
		expect(r!.waterMl).toBe(946.4);
		expect(r!.cookedCups).toBe(6);
		expect(r!.cookedOz).toBe(48);
		expect(r!.cookTime).toBe('15-18 min');
	});

	it('brown rice, 1 cup: USA Rice 2.25:1 ratio -> 2.25 cups water, 3.25 cups cooked, 26 oz cooked', () => {
		const r = computeRiceWater(1, 'cups', 'brown');
		expect(r).not.toBeNull();
		expect(r!.waterCups).toBe(2.25);
		expect(r!.waterMl).toBe(532.3);
		expect(r!.cookedCups).toBe(3.25);
		expect(r!.cookedOz).toBe(26);
		expect(r!.cookTime).toBe('40-45 min');
	});

	it('arborio, 1.5 cups: USA Rice 4:1 ratio -> 6 cups water, 7.5 cups cooked, 60 oz cooked', () => {
		const r = computeRiceWater(1.5, 'cups', 'arborio');
		expect(r).not.toBeNull();
		expect(r!.waterCups).toBe(6);
		expect(r!.waterMl).toBe(1420);
		expect(r!.cookedCups).toBe(7.5);
		expect(r!.cookedOz).toBe(60);
	});

	it('wild rice, 200 grams: converts via 1 cup dry = 7 oz (USA Rice), then 3:1 ratio', () => {
		const r = computeRiceWater(200, 'grams', 'wild');
		expect(r).not.toBeNull();
		// 200g / 198.4465 g/cup ~= 1.0078 cups dry rice
		expect(r!.riceCups).toBeCloseTo(1.0078, 3);
		expect(r!.waterCups).toBe(3.023);
		expect(r!.waterMl).toBe(715.3);
		expect(r!.cookedCups).toBe(4.031);
		expect(r!.cookedOz).toBe(32.25);
	});

	it('white short grain, 0.5 cups: USA Rice 1.25:1 ratio -> 0.625 cups water', () => {
		const r = computeRiceWater(0.5, 'cups', 'white-short');
		expect(r).not.toBeNull();
		expect(r!.waterCups).toBe(0.625);
		expect(r!.waterMl).toBe(147.9);
		expect(r!.cookedCups).toBe(1.125);
		expect(r!.cookedOz).toBe(9);
	});

	it('parboiled brown, 3 cups: USA Rice 2.25:1 ratio -> 6.75 cups water, 25 min cook time', () => {
		const r = computeRiceWater(3, 'cups', 'parboiled-brown');
		expect(r).not.toBeNull();
		expect(r!.waterCups).toBe(6.75);
		expect(r!.waterMl).toBe(1597);
		expect(r!.cookedCups).toBe(9.75);
		expect(r!.cookedOz).toBe(78);
		expect(r!.cookTime).toBe('25 min');
	});

	it('returns null for zero rice', () => {
		expect(computeRiceWater(0, 'cups', 'white-long')).toBeNull();
	});

	it('returns null for negative rice', () => {
		expect(computeRiceWater(-2, 'cups', 'jasmine')).toBeNull();
	});

	it('returns null for non-finite input', () => {
		expect(computeRiceWater(NaN, 'cups', 'basmati')).toBeNull();
	});

	it('every rice type in the source chart is present with its stated ratio', () => {
		expect(RICE_TYPES['white-long'].ratio).toBe(2);
		expect(RICE_TYPES['white-medium'].ratio).toBe(1.5);
		expect(RICE_TYPES['white-short'].ratio).toBe(1.25);
		expect(RICE_TYPES.brown.ratio).toBe(2.25);
		expect(RICE_TYPES.parboiled.ratio).toBe(2.25);
		expect(RICE_TYPES['parboiled-brown'].ratio).toBe(2.25);
		expect(RICE_TYPES.jasmine.ratio).toBe(2);
		expect(RICE_TYPES.basmati.ratio).toBe(2);
		expect(RICE_TYPES.arborio.ratio).toBe(4);
		expect(RICE_TYPES.wild.ratio).toBe(3);
	});
});

describe('gramsToCups / cupsToGrams', () => {
	it('round-trips using the USA Rice "1 cup dry rice ~= 7 oz" figure', () => {
		const grams = cupsToGrams(2);
		// 2 cups * 7 oz/cup * 28.3495 g/oz = 396.893 g
		expect(grams).toBeCloseTo(396.893, 2);
		expect(gramsToCups(grams)).toBeCloseTo(2, 6);
	});
});
