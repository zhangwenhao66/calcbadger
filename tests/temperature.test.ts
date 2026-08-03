import { describe, expect, it } from 'vitest';
import {
	ABSOLUTE_ZERO,
	celsiusToFahrenheit,
	celsiusToKelvin,
	convertAll,
	fahrenheitToCelsius,
	fahrenheitToKelvin,
	isPhysicallyValid,
	kelvinToCelsius,
	kelvinToFahrenheit,
} from '../src/lib/temperature';

/**
 * Expected values: NIST SP 811 exact formulas (°F = °C×9/5+32,
 * K = °C+273.15), hand-computed and cross-checked with an independent
 * Python calculation (2026-08-04). 37°C/98.6°F and 38°C/100.4°F cross-check
 * against CDC's published fever threshold (cdc.gov/port-health).
 */
describe('celsiusToFahrenheit', () => {
	it('0°C = 32°F (water freezes)', () => {
		expect(celsiusToFahrenheit(0)).toBeCloseTo(32, 10);
	});

	it('100°C = 212°F (water boils)', () => {
		expect(celsiusToFahrenheit(100)).toBeCloseTo(212, 10);
	});

	it('37°C = 98.6°F (normal body temperature)', () => {
		expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6, 10);
	});

	it('38°C = 100.4°F (CDC fever threshold)', () => {
		expect(celsiusToFahrenheit(38)).toBeCloseTo(100.4, 10);
	});

	it('-40°C = -40°F (the scales cross here)', () => {
		expect(celsiusToFahrenheit(-40)).toBeCloseTo(-40, 10);
	});

	it('180°C = 356°F (oven temperature)', () => {
		expect(celsiusToFahrenheit(180)).toBeCloseTo(356, 10);
	});

	it('36.6°C = 97.88°F (decimal input)', () => {
		expect(celsiusToFahrenheit(36.6)).toBeCloseTo(97.88, 10);
	});
});

describe('fahrenheitToCelsius', () => {
	it('98.6°F = 37°C (inverse of body temperature)', () => {
		expect(fahrenheitToCelsius(98.6)).toBeCloseTo(37, 10);
	});

	it('212°F = 100°C (inverse of boiling point)', () => {
		expect(fahrenheitToCelsius(212)).toBeCloseTo(100, 10);
	});

	it('32°F = 0°C (inverse of freezing point)', () => {
		expect(fahrenheitToCelsius(32)).toBeCloseTo(0, 10);
	});
});

describe('celsius <-> kelvin', () => {
	it('0°C = 273.15 K', () => {
		expect(celsiusToKelvin(0)).toBeCloseTo(273.15, 10);
	});

	it('-273.15°C = 0 K (absolute zero)', () => {
		expect(celsiusToKelvin(-273.15)).toBeCloseTo(0, 10);
	});

	it('100°C = 373.15 K', () => {
		expect(celsiusToKelvin(100)).toBeCloseTo(373.15, 10);
	});

	it('273.15 K = 0°C', () => {
		expect(kelvinToCelsius(273.15)).toBeCloseTo(0, 10);
	});

	it('0 K = -273.15°C', () => {
		expect(kelvinToCelsius(0)).toBeCloseTo(-273.15, 10);
	});
});

describe('fahrenheit <-> kelvin', () => {
	it('32°F = 273.15 K', () => {
		expect(fahrenheitToKelvin(32)).toBeCloseTo(273.15, 10);
	});

	it('-459.67°F = 0 K (absolute zero)', () => {
		expect(fahrenheitToKelvin(-459.67)).toBeCloseTo(0, 6);
	});

	it('0 K = -459.67°F', () => {
		expect(kelvinToFahrenheit(0)).toBeCloseTo(-459.67, 6);
	});

	it('310.15 K = 98.6°F (body temperature in kelvin)', () => {
		expect(kelvinToFahrenheit(310.15)).toBeCloseTo(98.6, 10);
	});
});

describe('convertAll', () => {
	it('from Celsius: 100°C fills in 212°F and 373.15 K', () => {
		const r = convertAll(100, 'C');
		expect(r.C).toBeCloseTo(100, 10);
		expect(r.F).toBeCloseTo(212, 10);
		expect(r.K).toBeCloseTo(373.15, 10);
	});

	it('from Fahrenheit: 98.6°F fills in 37°C and 310.15 K', () => {
		const r = convertAll(98.6, 'F');
		expect(r.C).toBeCloseTo(37, 10);
		expect(r.F).toBeCloseTo(98.6, 10);
		expect(r.K).toBeCloseTo(310.15, 10);
	});

	it('from Kelvin: 0 K fills in -273.15°C and -459.67°F', () => {
		const r = convertAll(0, 'K');
		expect(r.C).toBeCloseTo(-273.15, 10);
		expect(r.F).toBeCloseTo(-459.67, 6);
		expect(r.K).toBeCloseTo(0, 10);
	});
});

describe('isPhysicallyValid', () => {
	it('absolute zero is valid on every scale', () => {
		expect(isPhysicallyValid(ABSOLUTE_ZERO.C, 'C')).toBe(true);
		expect(isPhysicallyValid(ABSOLUTE_ZERO.F, 'F')).toBe(true);
		expect(isPhysicallyValid(ABSOLUTE_ZERO.K, 'K')).toBe(true);
	});

	it('one degree below absolute zero is invalid', () => {
		expect(isPhysicallyValid(-274.15, 'C')).toBe(false);
		expect(isPhysicallyValid(-460.67, 'F')).toBe(false);
		expect(isPhysicallyValid(-1, 'K')).toBe(false);
	});

	it('room temperature is comfortably valid', () => {
		expect(isPhysicallyValid(20, 'C')).toBe(true);
	});
});
