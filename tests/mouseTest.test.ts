import { describe, expect, it } from 'vitest';
import {
	DOUBLE_CLICK_DEFAULT_MS,
	DOUBLE_CLICK_MAX_MS,
	DOUBLE_CLICK_MIN_MS,
	MOUSE_BUTTONS,
	classifyDoubleClickInterval,
	classifyPollingRate,
	computeAverageIntervalMs,
	hzFromAverageIntervalMs,
} from '../src/lib/mouseTest';

describe('classifyDoubleClickInterval', () => {
	it('reports no reading for missing/invalid input', () => {
		expect(classifyDoubleClickInterval(-1).tier).toBe('No reading yet');
		expect(classifyDoubleClickInterval(NaN).tier).toBe('No reading yet');
	});

	it('classifies at/under the 200ms floor as faster than any default', () => {
		expect(classifyDoubleClickInterval(150).tier).toBe('Faster than the fastest default setting');
		expect(classifyDoubleClickInterval(DOUBLE_CLICK_MIN_MS).tier).toBe('Faster than the fastest default setting');
	});

	it('classifies 201-500ms as within the out-of-the-box default', () => {
		expect(classifyDoubleClickInterval(DOUBLE_CLICK_MIN_MS + 1).tier).toBe('Within the out-of-the-box default');
		expect(classifyDoubleClickInterval(DOUBLE_CLICK_DEFAULT_MS).tier).toBe('Within the out-of-the-box default');
	});

	it('classifies 501-900ms as slower than default but within range', () => {
		expect(classifyDoubleClickInterval(DOUBLE_CLICK_DEFAULT_MS + 1).tier).toBe('Slower than default, but within range');
		expect(classifyDoubleClickInterval(DOUBLE_CLICK_MAX_MS).tier).toBe('Slower than default, but within range');
	});

	it('classifies over 900ms as slower than any default window', () => {
		expect(classifyDoubleClickInterval(DOUBLE_CLICK_MAX_MS + 1).tier).toBe('Slower than any default double-click window');
		expect(classifyDoubleClickInterval(2000).tier).toBe('Slower than any default double-click window');
	});
});

describe('computeAverageIntervalMs', () => {
	it('returns 0 for fewer than 2 timestamps', () => {
		expect(computeAverageIntervalMs([])).toBe(0);
		expect(computeAverageIntervalMs([100])).toBe(0);
	});

	it('averages evenly spaced timestamps (0,10,20,30 -> 10ms avg)', () => {
		expect(computeAverageIntervalMs([0, 10, 20, 30])).toBe(10);
	});

	it('averages unevenly spaced timestamps (0,5,15,30 -> diffs 5,10,15 -> avg 10ms)', () => {
		expect(computeAverageIntervalMs([0, 5, 15, 30])).toBe(10);
	});

	it('skips zero/duplicate-timestamp diffs rather than counting them as 0ms', () => {
		// diffs: 0 (skipped), 10 (counted) -> average of just the 10
		expect(computeAverageIntervalMs([0, 0, 10])).toBe(10);
	});
});

describe('hzFromAverageIntervalMs', () => {
	it('converts an 8ms interval to 125 Hz (standard mouse report rate)', () => {
		expect(hzFromAverageIntervalMs(8)).toBe(125);
	});

	it('converts a 1ms interval to 1000 Hz', () => {
		expect(hzFromAverageIntervalMs(1)).toBe(1000);
	});

	it('converts a 2ms interval to 500 Hz', () => {
		expect(hzFromAverageIntervalMs(2)).toBe(500);
	});

	it('converts a 16.667ms interval to ~60 Hz (typical display refresh)', () => {
		expect(hzFromAverageIntervalMs(1000 / 60)).toBeCloseTo(60, 5);
	});

	it('returns 0 for zero, negative, or non-finite input', () => {
		expect(hzFromAverageIntervalMs(0)).toBe(0);
		expect(hzFromAverageIntervalMs(-5)).toBe(0);
		expect(hzFromAverageIntervalMs(NaN)).toBe(0);
	});
});

describe('classifyPollingRate', () => {
	it('reports no reading for zero/invalid Hz', () => {
		expect(classifyPollingRate(0, 'coalesced').tier).toBe('No reading yet');
	});

	it('flags a raw (non-coalesced) reading at or under 144 Hz as likely display-capped', () => {
		const r = classifyPollingRate(60, 'raw');
		expect(r.tier).toContain('raw, likely display-capped');
		const r2 = classifyPollingRate(144, 'raw');
		expect(r2.tier).toContain('raw, likely display-capped');
	});

	it('classifies a coalesced reading up to 180 Hz as 125 Hz class', () => {
		expect(classifyPollingRate(125, 'coalesced').tier).toContain('125 Hz class');
		expect(classifyPollingRate(180, 'coalesced').tier).toContain('125 Hz class');
	});

	it('classifies a coalesced reading from 181-700 Hz as 500 Hz class', () => {
		expect(classifyPollingRate(181, 'coalesced').tier).toContain('500 Hz class');
		expect(classifyPollingRate(500, 'coalesced').tier).toContain('500 Hz class');
		expect(classifyPollingRate(700, 'coalesced').tier).toContain('500 Hz class');
	});

	it('classifies a coalesced reading over 700 Hz as 1000 Hz+ class', () => {
		expect(classifyPollingRate(701, 'coalesced').tier).toContain('1000 Hz+ class');
		expect(classifyPollingRate(1000, 'coalesced').tier).toContain('1000 Hz+ class');
	});

	it('a raw reading over 144 Hz still falls through to the normal tiers', () => {
		expect(classifyPollingRate(200, 'raw').tier).toContain('500 Hz class');
	});
});

describe('MOUSE_BUTTONS', () => {
	it('lists exactly 5 buttons with unique DOM MouseEvent.button codes', () => {
		expect(MOUSE_BUTTONS).toHaveLength(5);
		const codes = MOUSE_BUTTONS.map((b) => b.button);
		expect(new Set(codes).size).toBe(5);
		expect(codes.sort()).toEqual([0, 1, 2, 3, 4]);
	});

	it('maps button 0 to Left and button 2 to Right per the DOM spec', () => {
		expect(MOUSE_BUTTONS.find((b) => b.button === 0)?.label).toBe('Left');
		expect(MOUSE_BUTTONS.find((b) => b.button === 2)?.label).toBe('Right');
	});
});
