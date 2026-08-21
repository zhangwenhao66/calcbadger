import { describe, expect, it } from 'vitest';
import { classifyCps, computeClickSpeed } from '../src/lib/clickSpeedTest';

describe('computeClickSpeed', () => {
	it('computes CPS and CPM for a 5-second trial', () => {
		// 42 clicks / 5s = 8.4 CPS; 8.4 * 60 = 504 CPM
		const result = computeClickSpeed(42, 5);
		expect(result.cps).toBeCloseTo(8.4, 10);
		expect(result.cpm).toBeCloseTo(504, 10);
	});

	it('computes CPS and CPM for a 10-second trial', () => {
		// 156 clicks / 10s = 15.6 CPS; 15.6 * 60 = 936 CPM
		const result = computeClickSpeed(156, 10);
		expect(result.cps).toBeCloseTo(15.6, 10);
		expect(result.cpm).toBeCloseTo(936, 10);
	});

	it('computes CPS and CPM for a 1-second trial', () => {
		// 9 clicks / 1s = 9 CPS; 540 CPM
		const result = computeClickSpeed(9, 1);
		expect(result.cps).toBeCloseTo(9, 10);
		expect(result.cpm).toBeCloseTo(540, 10);
	});

	it('computes CPS and CPM for a 60-second trial', () => {
		// 300 clicks / 60s = 5 CPS; 300 CPM
		const result = computeClickSpeed(300, 60);
		expect(result.cps).toBeCloseTo(5, 10);
		expect(result.cpm).toBeCloseTo(300, 10);
	});

	it('returns zero for zero clicks', () => {
		const result = computeClickSpeed(0, 10);
		expect(result.cps).toBe(0);
		expect(result.cpm).toBe(0);
	});

	it('treats a non-positive duration as zero rather than dividing by zero', () => {
		const result = computeClickSpeed(50, 0);
		expect(result.cps).toBe(0);
		expect(result.cpm).toBe(0);
		expect(Number.isFinite(result.cps)).toBe(true);
	});

	it('clamps a negative or non-finite click count to zero', () => {
		expect(computeClickSpeed(-5, 10).clicks).toBe(0);
		expect(computeClickSpeed(NaN, 10).clicks).toBe(0);
	});
});

describe('classifyCps', () => {
	it('labels scores below 5 CPS as below the typical tapping range', () => {
		expect(classifyCps(4.9).label).toBe('Below the typical sustained single-finger tapping range');
	});

	it('labels 5-7 CPS as the typical single-finger tapping range', () => {
		expect(classifyCps(5).label).toBe('In the typical single-finger tapping range');
		expect(classifyCps(7).label).toBe('In the typical single-finger tapping range');
	});

	it('labels 7.01-15 CPS as above the natural single-finger range', () => {
		expect(classifyCps(7.1).label).toBe('Above the natural single-finger tapping range');
		expect(classifyCps(15).label).toBe('Above the natural single-finger tapping range');
	});

	it('labels above 15 CPS as specialized clicking techniques', () => {
		expect(classifyCps(15.1).label).toBe('In the range of specialized clicking techniques');
		expect(classifyCps(24).label).toBe('In the range of specialized clicking techniques');
	});

	it('returns N/A for negative or non-finite input', () => {
		expect(classifyCps(-1).label).toBe('N/A');
		expect(classifyCps(NaN).label).toBe('N/A');
	});
});
