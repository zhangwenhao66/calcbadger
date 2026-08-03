import { describe, expect, it } from 'vitest';
import { convert, convertAll, inchesToFeetInches, roundSig } from '../src/lib/length';

// Expected values independently computed in Python from the exact meters-per-unit
// factors (1959 International Yard and Pound Agreement / NIST HB44 App. C), not
// read back from this implementation:
//   M = {mm:0.001, cm:0.01, m:1, km:1000, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344}
//   conv(v, frm, to) = v * M[frm] / M[to]

describe('convert — exact-definition pairs', () => {
	it('1 inch = 2.54 cm exactly', () => {
		expect(convert(1, 'in', 'cm')).toBeCloseTo(2.54, 10);
	});

	it('1 foot = 0.3048 m exactly', () => {
		expect(convert(1, 'ft', 'm')).toBeCloseTo(0.3048, 10);
	});

	it('1 mile = 1609.344 m exactly', () => {
		expect(convert(1, 'mi', 'm')).toBeCloseTo(1609.344, 6);
	});

	it('1 mile = 5280 feet exactly', () => {
		expect(convert(1, 'mi', 'ft')).toBeCloseTo(5280, 6);
	});

	it('1 yard = 3 feet exactly', () => {
		expect(convert(1, 'yd', 'ft')).toBeCloseTo(3, 10);
	});
});

describe('convert — real-world worked values (Python hand-calc)', () => {
	it('30 cm to inches', () => {
		expect(convert(30, 'cm', 'in')).toBeCloseTo(11.811023622047244, 9);
	});

	it('74 inches (6ft2in) to cm', () => {
		expect(convert(74, 'in', 'cm')).toBeCloseTo(187.96, 9);
	});

	it('5 km to miles', () => {
		expect(convert(5, 'km', 'mi')).toBeCloseTo(3.1068559611866697, 9);
	});

	it('marathon distance 42.195 km to miles', () => {
		expect(convert(42.195, 'km', 'mi')).toBeCloseTo(26.218757456454306, 9);
	});

	it('100 miles to km', () => {
		expect(convert(100, 'mi', 'km')).toBeCloseTo(160.9344, 9);
	});
});

describe('convert — edge cases', () => {
	it('zero converts to zero in any unit', () => {
		expect(convert(0, 'cm', 'mi')).toBe(0);
	});

	it('negative values pass through linearly (e.g. displacement/offsets)', () => {
		expect(convert(-10, 'cm', 'in')).toBeCloseTo(-3.937007874015748, 9);
	});

	it('same-unit conversion is a no-op', () => {
		expect(convert(123.456, 'km', 'km')).toBeCloseTo(123.456, 10);
	});

	it('very small value (1 mm to km)', () => {
		expect(convert(1, 'mm', 'km')).toBeCloseTo(0.000001, 12);
	});

	it('very large value round-trips (1e9 mm to km and back)', () => {
		const km = convert(1e9, 'mm', 'km');
		expect(km).toBeCloseTo(1000, 6);
		expect(convert(km, 'km', 'mm')).toBeCloseTo(1e9, 3);
	});
});

describe('convertAll', () => {
	it('returns all 8 units and each matches pairwise convert()', () => {
		const all = convertAll(1, 'm');
		expect(Object.keys(all).sort()).toEqual(['cm', 'ft', 'in', 'km', 'm', 'mi', 'mm', 'yd'].sort());
		for (const unit of Object.keys(all) as (keyof typeof all)[]) {
			expect(all[unit]).toBeCloseTo(convert(1, 'm', unit), 9);
		}
	});

	it('the from-unit itself is unchanged', () => {
		const all = convertAll(42, 'ft');
		expect(all.ft).toBeCloseTo(42, 10);
	});
});

describe('roundSig', () => {
	it('rounds to 6 significant figures by default', () => {
		expect(roundSig(11.811023622047244)).toBeCloseTo(11.811, 3);
	});

	it('preserves small values instead of flooring to 0', () => {
		expect(roundSig(0.000001)).toBeCloseTo(0.000001, 9);
	});

	it('handles zero without dividing by zero', () => {
		expect(roundSig(0)).toBe(0);
	});

	it('rounds large values without excess trailing digits', () => {
		expect(roundSig(3280.8399)).toBeCloseTo(3280.84, 1);
	});
});

describe('inchesToFeetInches', () => {
	it('74 inches is 6 feet 2 inches', () => {
		expect(inchesToFeetInches(74)).toEqual({ feet: 6, inches: 2 });
	});

	it('60 inches is exactly 5 feet 0 inches', () => {
		expect(inchesToFeetInches(60)).toEqual({ feet: 5, inches: 0 });
	});

	it('handles fractional remainder inches', () => {
		const result = inchesToFeetInches(70.5);
		expect(result.feet).toBe(5);
		expect(result.inches).toBeCloseTo(10.5, 4);
	});
});
