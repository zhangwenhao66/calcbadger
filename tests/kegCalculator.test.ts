import { describe, expect, it } from 'vitest';
import {
	KEG_PRESET_ML,
	SERVING_PRESET_ML,
	calculateServings,
	costPerServing,
	kegsNeeded,
	servingsWithWaste,
	servingToMl,
	volumeToMl,
} from '../src/lib/kegCalculator';

// Expected values are independently hand-calculated (not copied from the
// implementation): keg volume in mL = gallons x 3785.411784 (NIST exact US
// gal->mL), serving mL = fl oz x 29.5735295625 (US) or x 28.4130625
// (imperial), servings = floor(keg mL / serving mL). Also cross-checked
// against the widely published "half barrel ~ 165 12oz beers, quarter ~ 82,
// sixth ~ 55" figures (e.g. Kegerator Learning Center, The Calculator Site).

describe('KEG_PRESET_ML (27 CFR 25.11/25.156 authorized keg sizes)', () => {
	it('half barrel = 15.5 US gal', () => {
		expect(KEG_PRESET_ML.halfBarrel).toBeCloseTo(58673.8827, 3);
	});
	it('quarter barrel = 7.75 US gal', () => {
		expect(KEG_PRESET_ML.quarterBarrel).toBeCloseTo(29336.9413, 3);
	});
	it('sixth barrel = 31/6 US gal', () => {
		expect(KEG_PRESET_ML.sixthBarrel).toBeCloseTo(19557.9609, 3);
	});
	it('corny keg = 5 US gal', () => {
		expect(KEG_PRESET_ML.cornyKeg).toBeCloseTo(18927.0589, 3);
	});
	it('mini keg = 5 L', () => {
		expect(KEG_PRESET_ML.miniKeg).toBe(5000);
	});
});

describe('SERVING_PRESET_ML', () => {
	it('12 oz can (NIAAA standard drink reference)', () => {
		expect(SERVING_PRESET_ML.can12oz).toBeCloseTo(354.8824, 3);
	});
	it('16 oz US pint', () => {
		expect(SERVING_PRESET_ML.usPint16oz).toBeCloseTo(473.1765, 3);
	});
	it('20 imperial fl oz UK pint', () => {
		expect(SERVING_PRESET_ML.imperialPint20oz).toBeCloseTo(568.2613, 3);
	});
});

describe('calculateServings', () => {
	it('half barrel / 12 oz can = 165 (matches published ~165 figure)', () => {
		const r = calculateServings(KEG_PRESET_ML.halfBarrel, SERVING_PRESET_ML.can12oz);
		expect(r.servings).toBe(165);
	});
	it('half barrel / 16 oz pint = 124 exactly (1984 US fl oz / 16)', () => {
		const r = calculateServings(KEG_PRESET_ML.halfBarrel, SERVING_PRESET_ML.usPint16oz);
		expect(r.servings).toBe(124);
		expect(r.rawServings).toBeCloseTo(124, 6);
	});
	it('quarter barrel / 12 oz can = 82 (matches published ~82 figure)', () => {
		const r = calculateServings(KEG_PRESET_ML.quarterBarrel, SERVING_PRESET_ML.can12oz);
		expect(r.servings).toBe(82);
	});
	it('sixth barrel / 12 oz can = 55 (matches published ~55 figure)', () => {
		const r = calculateServings(KEG_PRESET_ML.sixthBarrel, SERVING_PRESET_ML.can12oz);
		expect(r.servings).toBe(55);
	});
	it('corny keg / 12 oz can = 53', () => {
		const r = calculateServings(KEG_PRESET_ML.cornyKeg, SERVING_PRESET_ML.can12oz);
		expect(r.servings).toBe(53);
	});
	it('mini keg (5L) / 12 oz can = 14', () => {
		const r = calculateServings(KEG_PRESET_ML.miniKeg, SERVING_PRESET_ML.can12oz);
		expect(r.servings).toBe(14);
	});
	it('half barrel / imperial pint = 103 (imperial fl oz is larger than US fl oz)', () => {
		const r = calculateServings(KEG_PRESET_ML.halfBarrel, SERVING_PRESET_ML.imperialPint20oz);
		expect(r.servings).toBe(103);
	});
	it('custom 50 L euro keg / custom 500 mL serving = 100 exactly', () => {
		const kegMl = volumeToMl(50, 'l');
		const servingMl = servingToMl(500, 'ml');
		const r = calculateServings(kegMl, servingMl);
		expect(r.servings).toBe(100);
	});
	it('zero volume yields zero servings, not NaN or divide-by-zero', () => {
		const r = calculateServings(0, SERVING_PRESET_ML.can12oz);
		expect(r.servings).toBe(0);
	});
	it('zero serving size is guarded (no divide-by-zero/Infinity)', () => {
		const r = calculateServings(KEG_PRESET_ML.halfBarrel, 0);
		expect(r.servings).toBe(0);
		expect(Number.isFinite(r.rawServings)).toBe(true);
	});
});

describe('volumeToMl / servingToMl unit conversion', () => {
	it('gallons to mL uses the NIST exact factor', () => {
		expect(volumeToMl(1, 'gal')).toBeCloseTo(3785.411784, 6);
	});
	it('liters to mL', () => {
		expect(volumeToMl(2, 'l')).toBe(2000);
	});
	it('fl oz to mL uses the US fluid ounce', () => {
		expect(servingToMl(1, 'floz')).toBeCloseTo(29.5735295625, 6);
	});
	it('mL passes through unchanged', () => {
		expect(servingToMl(355, 'ml')).toBe(355);
	});
});

describe('servingsWithWaste', () => {
	it('10% waste on 165 servings floors to 148', () => {
		expect(servingsWithWaste(165, 10)).toBe(148); // 165 * 0.9 = 148.5 -> floor 148
	});
	it('0% waste is a no-op', () => {
		expect(servingsWithWaste(82, 0)).toBe(82);
	});
});

describe('kegsNeeded', () => {
	it('80 guests x 2 drinks over a 165-serving keg needs 1 keg', () => {
		expect(kegsNeeded(80, 2, 165)).toBe(1); // 160 <= 165
	});
	it('100 guests x 2 drinks over a 165-serving keg needs 2 kegs', () => {
		expect(kegsNeeded(100, 2, 165)).toBe(2); // 200 / 165 = 1.21 -> 2
	});
	it('zero servings per keg returns 0 rather than dividing by zero', () => {
		expect(kegsNeeded(50, 2, 0)).toBe(0);
	});
});

describe('costPerServing', () => {
	it('$150 keg over 165 servings', () => {
		expect(costPerServing(150, 165)).toBeCloseTo(0.9091, 4);
	});
	it('returns null when there are no servings to divide by', () => {
		expect(costPerServing(150, 0)).toBeNull();
	});
});
