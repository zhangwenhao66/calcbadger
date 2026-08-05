import { describe, expect, it } from 'vitest';
import { convert, convertAll, roundSig } from '../src/lib/volume';

// Expected values independently computed in Python (Decimal, 40-digit precision) from the
// exact mL-per-unit factors (NIST HB44 App. C — 1 US gal = 3.785411784 L exactly, with every
// other unit an exact legal ratio of that: 1 gal=4qt, 1qt=2pt, 1pt=2cup, 1cup=8floz,
// 1floz=2tbsp, 1tbsp=3tsp), not read back from this implementation:
//   ML = {tsp:4.92892159375, tbsp:14.78676478125, floz:29.5735295625, cup:236.5882365,
//         pint:473.176473, quart:946.352946, gallon:3785.411784, ml:1, l:1000}
//   conv(v, frm, to) = v * ML[frm] / ML[to]

describe('convert — exact-definition pairs', () => {
	it('1 gallon = 3.785411784 liters exactly (NIST HB44)', () => {
		expect(convert(1, 'gallon', 'l')).toBeCloseTo(3.785411784, 9);
	});

	it('1 tbsp = 3 tsp exactly', () => {
		expect(convert(1, 'tbsp', 'tsp')).toBeCloseTo(3, 10);
	});

	it('1 cup = 8 fl oz exactly', () => {
		expect(convert(1, 'cup', 'floz')).toBeCloseTo(8, 10);
	});

	it('1 quart = 4 cups exactly', () => {
		expect(convert(1, 'quart', 'cup')).toBeCloseTo(4, 10);
	});

	it('1 pint = 2 cups exactly', () => {
		expect(convert(1, 'pint', 'cup')).toBeCloseTo(2, 10);
	});

	it('128 fl oz = 1 gallon exactly', () => {
		expect(convert(128, 'floz', 'gallon')).toBeCloseTo(1, 10);
	});

	it('1 fl oz = 29.5735295625 mL exactly', () => {
		expect(convert(1, 'floz', 'ml')).toBeCloseTo(29.5735295625, 9);
	});
});

describe('convert — real-world worked values (Python hand-calc)', () => {
	it('1 cup to mL', () => {
		expect(convert(1, 'cup', 'ml')).toBeCloseTo(236.5882365, 6);
	});

	it('750 mL (wine bottle) to fl oz', () => {
		expect(convert(750, 'ml', 'floz')).toBeCloseTo(25.360517026382248, 8);
	});

	it('1 liter to fl oz', () => {
		expect(convert(1, 'l', 'floz')).toBeCloseTo(33.814022701842997, 8);
	});

	it('500 mL to fl oz', () => {
		expect(convert(500, 'ml', 'floz')).toBeCloseTo(16.907011350921499, 8);
	});

	it('42 gallons (oil barrel) to liters', () => {
		expect(convert(42, 'gallon', 'l')).toBeCloseTo(158.987294928, 6);
	});

	it('2 liters to fl oz', () => {
		expect(convert(2, 'l', 'floz')).toBeCloseTo(67.628045403685994, 7);
	});

	it('1 liter to cups', () => {
		expect(convert(1, 'l', 'cup')).toBeCloseTo(4.226752837730375, 8);
	});

	it('355 mL (standard can) to fl oz', () => {
		expect(convert(355, 'ml', 'floz')).toBeCloseTo(12.003978059154264, 8);
	});

	it('1.5 fl oz (standard shot) to mL', () => {
		expect(convert(1.5, 'floz', 'ml')).toBeCloseTo(44.36029434375, 6);
	});
});

describe('convert — edge cases', () => {
	it('zero converts to zero in any unit', () => {
		expect(convert(0, 'cup', 'ml')).toBe(0);
	});

	it('negative values pass through linearly (e.g. a recipe-scaling delta)', () => {
		expect(convert(-5, 'cup', 'ml')).toBeCloseTo(-1182.9411825, 6);
	});

	it('same-unit conversion is a no-op', () => {
		expect(convert(12.5, 'gallon', 'gallon')).toBeCloseTo(12.5, 10);
	});

	it('very small value (1 tsp to gallon)', () => {
		expect(convert(1, 'tsp', 'gallon')).toBeCloseTo(0.0013020833333333333, 12);
	});

	it('very large value round-trips (1000 gallon to ml and back)', () => {
		const ml = convert(1000, 'gallon', 'ml');
		expect(ml).toBeCloseTo(3785411.784, 3);
		expect(convert(ml, 'ml', 'gallon')).toBeCloseTo(1000, 6);
	});
});

describe('convertAll', () => {
	it('returns all 9 units and each matches pairwise convert()', () => {
		const all = convertAll(1, 'gallon');
		expect(Object.keys(all).sort()).toEqual(
			['tsp', 'tbsp', 'floz', 'cup', 'pint', 'quart', 'gallon', 'ml', 'l'].sort(),
		);
		for (const unit of Object.keys(all) as (keyof typeof all)[]) {
			expect(all[unit]).toBeCloseTo(convert(1, 'gallon', unit), 6);
		}
	});

	it('the from-unit itself is unchanged', () => {
		const all = convertAll(2.5, 'cup');
		expect(all.cup).toBeCloseTo(2.5, 10);
	});
});

describe('roundSig', () => {
	it('rounds to 6 significant figures by default', () => {
		expect(roundSig(33.814022701842997)).toBeCloseTo(33.814, 3);
	});

	it('preserves small values instead of flooring to 0', () => {
		expect(roundSig(0.0013020833333333333)).toBeCloseTo(0.00130208, 8);
	});

	it('handles zero without dividing by zero', () => {
		expect(roundSig(0)).toBe(0);
	});

	it('rounds large values without excess trailing digits', () => {
		expect(roundSig(3785411.784)).toBeCloseTo(3785410, -1);
	});
});
