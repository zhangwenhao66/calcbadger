import { describe, expect, it } from 'vitest';
import { convert, convertAll, ouncesToPoundsOunces, roundSig } from '../src/lib/weight';

// Expected values independently computed in Python (Decimal, 30-digit precision) from the
// exact grams-per-unit factors (1959 International Yard and Pound Agreement / NIST HB44
// App. C), not read back from this implementation:
//   G = {mcg:0.000001, mg:0.001, g:1, kg:1000, oz:28.349523125, lb:453.59237, ton:907184.74}
//   conv(v, frm, to) = v * G[frm] / G[to]

describe('convert — exact-definition pairs', () => {
	it('1 lb = 0.45359237 kg exactly (1959 agreement)', () => {
		expect(convert(1, 'lb', 'kg')).toBeCloseTo(0.45359237, 10);
	});

	it('1 oz = 28.349523125 g exactly (1 lb / 16)', () => {
		expect(convert(1, 'oz', 'g')).toBeCloseTo(28.349523125, 9);
	});

	it('16 oz = 1 lb exactly', () => {
		expect(convert(16, 'oz', 'lb')).toBeCloseTo(1, 10);
	});

	it('1 US ton = 2000 lb exactly', () => {
		expect(convert(1, 'ton', 'lb')).toBeCloseTo(2000, 8);
	});

	it('1 US ton = 907.18474 kg exactly', () => {
		expect(convert(1, 'ton', 'kg')).toBeCloseTo(907.18474, 8);
	});
});

describe('convert — real-world worked values (Python hand-calc)', () => {
	it('1 kg to lb', () => {
		expect(convert(1, 'kg', 'lb')).toBeCloseTo(2.2046226218487758, 9);
	});

	it('150 lb to kg', () => {
		expect(convert(150, 'lb', 'kg')).toBeCloseTo(68.0388555, 7);
	});

	it('70 kg to lb', () => {
		expect(convert(70, 'kg', 'lb')).toBeCloseTo(154.3235835294143, 8);
	});

	it('80 kg to lb', () => {
		expect(convert(80, 'kg', 'lb')).toBeCloseTo(176.36980974790206, 8);
	});

	it('68 kg to lb (body weight)', () => {
		expect(convert(68, 'kg', 'lb')).toBeCloseTo(149.91433828571675, 8);
	});

	it('5 kg to lb (newborn weight)', () => {
		expect(convert(5, 'kg', 'lb')).toBeCloseTo(11.023113109243879, 9);
	});

	it('134 oz (8lb 6oz) to g', () => {
		expect(convert(134, 'oz', 'g')).toBeCloseTo(3798.83609875, 6);
	});

	it('1 g to oz', () => {
		expect(convert(1, 'g', 'oz')).toBeCloseTo(0.03527396194958041, 9);
	});
});

describe('convert — edge cases', () => {
	it('zero converts to zero in any unit', () => {
		expect(convert(0, 'kg', 'ton')).toBe(0);
	});

	it('negative values pass through linearly (e.g. weight-change deltas)', () => {
		expect(convert(-5, 'lb', 'kg')).toBeCloseTo(-2.26796185, 8);
	});

	it('same-unit conversion is a no-op', () => {
		expect(convert(42.5, 'kg', 'kg')).toBeCloseTo(42.5, 10);
	});

	it('very small value (1 mcg to kg)', () => {
		expect(convert(1, 'mcg', 'kg')).toBeCloseTo(1e-9, 15);
	});

	it('very large value round-trips (1e6 mg to kg and back)', () => {
		const kg = convert(1e6, 'mg', 'kg');
		expect(kg).toBeCloseTo(1, 9);
		expect(convert(kg, 'kg', 'mg')).toBeCloseTo(1e6, 3);
	});
});

describe('convertAll', () => {
	it('returns all 7 units and each matches pairwise convert()', () => {
		const all = convertAll(1, 'kg');
		expect(Object.keys(all).sort()).toEqual(['g', 'kg', 'lb', 'mcg', 'mg', 'oz', 'ton'].sort());
		for (const unit of Object.keys(all) as (keyof typeof all)[]) {
			expect(all[unit]).toBeCloseTo(convert(1, 'kg', unit), 9);
		}
	});

	it('the from-unit itself is unchanged', () => {
		const all = convertAll(75, 'lb');
		expect(all.lb).toBeCloseTo(75, 10);
	});
});

describe('roundSig', () => {
	it('rounds to 6 significant figures by default', () => {
		expect(roundSig(2.2046226218487758)).toBeCloseTo(2.20462, 5);
	});

	it('preserves small values instead of flooring to 0', () => {
		expect(roundSig(0.000001)).toBeCloseTo(0.000001, 9);
	});

	it('handles zero without dividing by zero', () => {
		expect(roundSig(0)).toBe(0);
	});

	it('rounds large values without excess trailing digits', () => {
		expect(roundSig(907184.74)).toBeCloseTo(907185, 0);
	});
});

describe('ouncesToPoundsOunces', () => {
	it('134 oz is 8 lb 6 oz (typical newborn weight)', () => {
		expect(ouncesToPoundsOunces(134)).toEqual({ pounds: 8, ounces: 6 });
	});

	it('160 oz is exactly 10 lb 0 oz', () => {
		expect(ouncesToPoundsOunces(160)).toEqual({ pounds: 10, ounces: 0 });
	});

	it('handles fractional remainder ounces', () => {
		const result = ouncesToPoundsOunces(100.5);
		expect(result.pounds).toBe(6);
		expect(result.ounces).toBeCloseTo(4.5, 4);
	});
});
