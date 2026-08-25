import { describe, expect, it } from 'vitest';
import {
	ISO_13406_2_CLASSES,
	RESOLUTION_PRESETS,
	TEST_COLORS,
	computeFlashSchedule,
	nextColorIndex,
	panelPixelCount,
	prevColorIndex,
	scaleAllowance,
} from '../src/lib/deadPixelTest';

describe('nextColorIndex / prevColorIndex', () => {
	it('advances through the middle of the list', () => {
		expect(nextColorIndex(0, TEST_COLORS.length)).toBe(1);
		expect(nextColorIndex(3, TEST_COLORS.length)).toBe(4);
	});

	it('wraps from the last color back to the first', () => {
		expect(nextColorIndex(TEST_COLORS.length - 1, TEST_COLORS.length)).toBe(0);
	});

	it('steps backward through the middle of the list', () => {
		expect(prevColorIndex(3, TEST_COLORS.length)).toBe(2);
	});

	it('wraps from the first color back to the last', () => {
		expect(prevColorIndex(0, TEST_COLORS.length)).toBe(TEST_COLORS.length - 1);
	});

	it('treats a non-positive length as a single fixed index of 0', () => {
		expect(nextColorIndex(2, 0)).toBe(0);
		expect(prevColorIndex(2, -1)).toBe(0);
	});
});

describe('computeFlashSchedule', () => {
	it('computes interval and flash count for a 30s run at 10Hz', () => {
		// 1000ms / 10Hz = 100ms interval; 30s * 10Hz = 300 flashes
		const result = computeFlashSchedule(30, 10);
		expect(result.intervalMs).toBe(100);
		expect(result.totalFlashes).toBe(300);
	});

	it('computes interval and flash count for a 10s run at 4Hz', () => {
		// 1000ms / 4Hz = 250ms interval; 10s * 4Hz = 40 flashes
		const result = computeFlashSchedule(10, 4);
		expect(result.intervalMs).toBe(250);
		expect(result.totalFlashes).toBe(40);
	});

	it('returns zero for a zero or negative duration', () => {
		expect(computeFlashSchedule(0, 10)).toEqual({ intervalMs: 0, totalFlashes: 0 });
		expect(computeFlashSchedule(-5, 10)).toEqual({ intervalMs: 0, totalFlashes: 0 });
	});

	it('returns zero for a zero or negative rate', () => {
		expect(computeFlashSchedule(30, 0)).toEqual({ intervalMs: 0, totalFlashes: 0 });
		expect(computeFlashSchedule(30, -2)).toEqual({ intervalMs: 0, totalFlashes: 0 });
	});

	it('returns zero for non-finite inputs rather than NaN/Infinity', () => {
		const result = computeFlashSchedule(NaN, Infinity);
		expect(Number.isFinite(result.intervalMs)).toBe(true);
		expect(Number.isFinite(result.totalFlashes)).toBe(true);
	});
});

describe('panelPixelCount', () => {
	it('multiplies width by height', () => {
		expect(panelPixelCount(1920, 1080)).toBe(2_073_600);
		expect(panelPixelCount(2560, 1440)).toBe(3_686_400);
		expect(panelPixelCount(3840, 2160)).toBe(8_294_400);
	});

	it('treats a non-positive dimension as zero', () => {
		expect(panelPixelCount(0, 1080)).toBe(0);
		expect(panelPixelCount(1920, -1)).toBe(0);
	});
});

describe('scaleAllowance', () => {
	it('scales the ISO Class II hot/dead-pixel allowance (2 per million) to a 1920x1080 panel', () => {
		// 2 * 2,073,600 / 1,000,000 = 4.1472 -> floor to 4
		expect(scaleAllowance(2, panelPixelCount(1920, 1080))).toBe(4);
	});

	it('scales the ISO Class II stuck-subpixel allowance (5 per million) to a 1920x1080 panel', () => {
		// 5 * 2,073,600 / 1,000,000 = 10.368 -> floor to 10
		expect(scaleAllowance(5, panelPixelCount(1920, 1080))).toBe(10);
	});

	it('scales the ISO Class II hot/dead-pixel allowance to a 2560x1440 panel', () => {
		// 2 * 3,686,400 / 1,000,000 = 7.3728 -> floor to 7
		expect(scaleAllowance(2, panelPixelCount(2560, 1440))).toBe(7);
	});

	it('scales the ISO Class II hot/dead-pixel allowance to a 3840x2160 panel', () => {
		// 2 * 8,294,400 / 1,000,000 = 16.5888 -> floor to 16
		expect(scaleAllowance(2, panelPixelCount(3840, 2160))).toBe(16);
	});

	it('returns zero when either input is zero, negative, or non-finite', () => {
		expect(scaleAllowance(0, 2_073_600)).toBe(0);
		expect(scaleAllowance(2, 0)).toBe(0);
		expect(scaleAllowance(-1, 2_073_600)).toBe(0);
		expect(scaleAllowance(2, NaN)).toBe(0);
	});
});

describe('reference data integrity', () => {
	it('lists exactly six test colors with distinct hex values', () => {
		expect(TEST_COLORS.length).toBe(6);
		const hexes = new Set(TEST_COLORS.map((c) => c.hex));
		expect(hexes.size).toBe(6);
	});

	it('lists the four ISO 13406-2 classes in ascending fault-tolerance order', () => {
		expect(ISO_13406_2_CLASSES.map((c) => c.class)).toEqual(['I', 'II', 'III', 'IV']);
		for (let i = 1; i < ISO_13406_2_CLASSES.length; i++) {
			expect(ISO_13406_2_CLASSES[i]!.type1HotPixel).toBeGreaterThanOrEqual(ISO_13406_2_CLASSES[i - 1]!.type1HotPixel);
			expect(ISO_13406_2_CLASSES[i]!.type2DeadPixel).toBeGreaterThanOrEqual(ISO_13406_2_CLASSES[i - 1]!.type2DeadPixel);
			expect(ISO_13406_2_CLASSES[i]!.type3StuckSubpixel).toBeGreaterThanOrEqual(
				ISO_13406_2_CLASSES[i - 1]!.type3StuckSubpixel,
			);
		}
	});

	it('lists four resolution presets with positive dimensions', () => {
		expect(RESOLUTION_PRESETS.length).toBe(4);
		for (const preset of RESOLUTION_PRESETS) {
			expect(preset.width).toBeGreaterThan(0);
			expect(preset.height).toBeGreaterThan(0);
		}
	});
});
