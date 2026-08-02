import { describe, expect, it } from 'vitest';
import { stairLayout, toNearestFraction } from '../src/lib/stairs';

/**
 * Expected values: hand-worked from the 2021 IRC R311.7.5 limits (max riser
 * 7.75 in, min tread 10 in) and the Pythagorean theorem, verified with an
 * independent calculation (Python, 2026-08-02). E.g. for a 108 in floor-to-floor
 * rise: ceil(108/7.75) = ceil(13.94) = 14 risers; 108/14 = 7.7143 in each;
 * 13 treads x 10 in = 130 in run; stringer = sqrt(108^2 + 130^2) = sqrt(28564)
 * = 169.009 in.
 */
describe('stairLayout', () => {
	it('classic full-floor case: 108 in rise, 10 in treads', () => {
		const s = stairLayout(108, 10);
		expect(s.riserCount).toBe(14);
		expect(s.riserHeightIn).toBeCloseTo(7.714286, 5);
		expect(s.treadCount).toBe(13);
		expect(s.totalRunIn).toBe(130);
		expect(s.stringerLengthIn).toBeCloseTo(169.0089, 3);
		expect(s.angleDeg).toBeCloseTo(39.7188, 3);
		expect(s.ircCompliant).toBe(true);
	});

	it('low deck: 30 in rise, 10.5 in treads -> 4 risers of exactly 7.5 in', () => {
		const s = stairLayout(30, 10.5);
		expect(s.riserCount).toBe(4);
		expect(s.riserHeightIn).toBe(7.5);
		expect(s.treadCount).toBe(3);
		expect(s.totalRunIn).toBeCloseTo(31.5, 10);
		// 30-31.5-43.5 is a scaled 20-21-29 right triangle: stringer is exactly 43.5
		expect(s.stringerLengthIn).toBeCloseTo(43.5, 10);
		expect(s.angleDeg).toBeCloseTo(43.6028, 3);
		expect(s.ircCompliant).toBe(true);
	});

	it('rise exactly one max riser -> single riser, no treads, vertical stringer', () => {
		const s = stairLayout(7.75, 10);
		expect(s.riserCount).toBe(1);
		expect(s.treadCount).toBe(0);
		expect(s.totalRunIn).toBe(0);
		expect(s.stringerLengthIn).toBeCloseTo(7.75, 10);
		expect(s.angleDeg).toBe(90);
	});

	it('rise a hair over one max riser -> splits into 2 equal risers', () => {
		const s = stairLayout(7.76, 10);
		expect(s.riserCount).toBe(2);
		expect(s.riserHeightIn).toBeCloseTo(3.88, 10);
	});

	it('flags a sub-IRC tread depth as non-compliant', () => {
		expect(stairLayout(108, 9).ircCompliant).toBe(false);
	});

	it('commercial IBC limits can be passed in (7 in riser cap)', () => {
		const s = stairLayout(108, 11, 7);
		// ceil(108/7) = 16 risers, 108/16 = 6.75 in each
		expect(s.riserCount).toBe(16);
		expect(s.riserHeightIn).toBe(6.75);
	});

	it('rejects non-positive rise', () => {
		expect(() => stairLayout(0, 10)).toThrow(RangeError);
		expect(() => stairLayout(-10, 10)).toThrow(RangeError);
	});
});

describe('toNearestFraction', () => {
	it('7.75 -> 7 3/4', () => {
		expect(toNearestFraction(7.75)).toEqual({ whole: 7, num: 3, den: 4 });
	});

	it('7.7143 -> 7 11/16 (nearest sixteenth: 0.7143 * 16 = 11.43 -> 11)', () => {
		expect(toNearestFraction(7.7142857)).toEqual({ whole: 7, num: 11, den: 16 });
	});

	it('whole number stays whole', () => {
		expect(toNearestFraction(10)).toEqual({ whole: 10, num: 0, den: 1 });
	});

	it('rounds up across a whole boundary (9.97 -> 10)', () => {
		expect(toNearestFraction(9.97)).toEqual({ whole: 10, num: 0, den: 1 });
	});
});
