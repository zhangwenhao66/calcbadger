import { describe, expect, it } from 'vitest';
import { cmToInches, kmToSteps, milesToSteps, stepLengthInches, stepsToKm, stepsToMiles } from '../src/lib/steps';

// Expected values independently computed in Python (see 内容发布日志.md for the
// session transcript), not derived from this implementation's own output.

describe('stepLengthInches', () => {
	it('male, CDC average adult height 68.9in: 68.9 * 0.415 = 28.5935', () => {
		expect(stepLengthInches(68.9, 'male')).toBeCloseTo(28.5935, 4);
	});

	it('female, CDC average adult height 63.5in: 63.5 * 0.413 = 26.2255', () => {
		expect(stepLengthInches(63.5, 'female')).toBeCloseTo(26.2255, 4);
	});

	it('0 height gives 0 step length', () => {
		expect(stepLengthInches(0, 'male')).toBe(0);
	});
});

describe('stepsToMiles', () => {
	it('10,000 steps at male average height (68.9in): ~4.5129 mi', () => {
		const stepLen = stepLengthInches(68.9, 'male');
		expect(stepsToMiles(10000, stepLen)).toBeCloseTo(4.5129, 3);
	});

	it('10,000 steps at female average height (63.5in): ~4.1391 mi', () => {
		const stepLen = stepLengthInches(63.5, 'female');
		expect(stepsToMiles(10000, stepLen)).toBeCloseTo(4.1391, 3);
	});

	it("classic 5'9\" male, 10,000 steps: ~4.519 mi (matches public range of 4.5-5mi)", () => {
		const stepLen = stepLengthInches(69, 'male');
		expect(stepsToMiles(10000, stepLen)).toBeCloseTo(4.519, 2);
	});

	it('0 steps is 0 miles', () => {
		expect(stepsToMiles(0, 28.5935)).toBe(0);
	});
});

describe('stepsToKm', () => {
	it('10,000 steps at male average height: ~7.263 km', () => {
		const stepLen = stepLengthInches(68.9, 'male');
		expect(stepsToKm(10000, stepLen)).toBeCloseTo(7.263, 2);
	});
});

describe('milesToSteps (reverse direction, e.g. "how many steps is 5 miles")', () => {
	it('5 miles at male average height: ~11,079.4 steps', () => {
		const stepLen = stepLengthInches(68.9, 'male');
		expect(milesToSteps(5, stepLen)).toBeCloseTo(11079.4, 0);
	});

	it('5 miles at female average height: ~12,079.8 steps', () => {
		const stepLen = stepLengthInches(63.5, 'female');
		expect(milesToSteps(5, stepLen)).toBeCloseTo(12079.8, 0);
	});

	it('round trip: milesToSteps(stepsToMiles(x)) recovers x', () => {
		const stepLen = stepLengthInches(66, 'female');
		const miles = stepsToMiles(8000, stepLen);
		expect(milesToSteps(miles, stepLen)).toBeCloseTo(8000, 6);
	});
});

describe('kmToSteps', () => {
	it('round trip: kmToSteps(stepsToKm(x)) recovers x', () => {
		const stepLen = stepLengthInches(70, 'male');
		const km = stepsToKm(9000, stepLen);
		expect(kmToSteps(km, stepLen)).toBeCloseTo(9000, 6);
	});
});

describe('cmToInches', () => {
	it('64in female height in cm converts back to 64in: 64 * 2.54 = 162.56cm', () => {
		expect(cmToInches(162.56)).toBeCloseTo(64, 6);
	});

	it('170cm to inches: ~66.9291in', () => {
		expect(cmToInches(170)).toBeCloseTo(66.9291, 3);
	});
});
