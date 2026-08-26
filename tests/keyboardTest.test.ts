import { describe, expect, it } from 'vitest';
import {
	ANSI_104_LAYOUT,
	ANSI_ISO_JIS_KEY_COUNTS,
	USB_BOOT_PROTOCOL_MAX_KEYS,
	classifyRollover,
	totalKeyCount,
	trackMaxSimultaneous,
} from '../src/lib/keyboardTest';

describe('ANSI_104_LAYOUT', () => {
	it('has exactly 104 keys total, matching the sourced ANSI key count', () => {
		expect(totalKeyCount(ANSI_104_LAYOUT)).toBe(104);
	});

	it('has no duplicate key codes', () => {
		const codes = ANSI_104_LAYOUT.flat().map((k) => k.code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it('breaks down into the documented section sizes (function/main/nav/arrows/numpad)', () => {
		const rows = ANSI_104_LAYOUT;
		const functionRow = rows[0]!.length; // Esc + F1-F12
		const mainBlock = rows[1]!.length + rows[2]!.length + rows[3]!.length + rows[4]!.length + rows[5]!.length;
		const navCluster = rows[6]!.length + rows[7]!.length + rows[8]!.length;
		const arrowCluster = rows[9]!.length + rows[10]!.length;
		const numpad = rows[11]!.length + rows[12]!.length + rows[13]!.length + rows[14]!.length + rows[15]!.length;
		expect(functionRow).toBe(13);
		expect(mainBlock).toBe(61);
		expect(navCluster).toBe(9);
		expect(arrowCluster).toBe(4);
		expect(numpad).toBe(17);
		expect(functionRow + mainBlock + navCluster + arrowCluster + numpad).toBe(104);
	});
});

describe('ANSI_ISO_JIS_KEY_COUNTS', () => {
	it('lists three layouts with the sourced key counts (104/105/109)', () => {
		expect(ANSI_ISO_JIS_KEY_COUNTS.map((l) => l.keys)).toEqual([104, 105, 109]);
	});

	it('matches the rendered virtual keyboard to its own ANSI entry', () => {
		const ansi = ANSI_ISO_JIS_KEY_COUNTS.find((l) => l.name.startsWith('ANSI'));
		expect(ansi?.keys).toBe(totalKeyCount(ANSI_104_LAYOUT));
	});
});

describe('classifyRollover', () => {
	it('reports no keys held for zero or invalid input', () => {
		expect(classifyRollover(0).tier).toBe('No keys held');
		expect(classifyRollover(-3).tier).toBe('No keys held');
		expect(classifyRollover(NaN).tier).toBe('No keys held');
	});

	it('classifies 2 keys as the baseline two-key rollover', () => {
		expect(classifyRollover(2).tier).toBe('2-key rollover');
	});

	it('classifies 3-5 keys as typical limited/matrix rollover', () => {
		expect(classifyRollover(4).tier).toBe('4-key rollover');
		expect(classifyRollover(5).description).toMatch(/matrix/i);
	});

	it('classifies exactly 6 keys as the USB HID boot-protocol ceiling', () => {
		const result = classifyRollover(USB_BOOT_PROTOCOL_MAX_KEYS);
		expect(result.tier).toBe('6-key rollover');
		expect(result.description).toMatch(/boot protocol/i);
	});

	it('classifies more than 6 keys as full n-key rollover via the HID report protocol', () => {
		const result = classifyRollover(10);
		expect(result.tier).toBe('10-key rollover');
		expect(result.description).toMatch(/report protocol/i);
	});

	it('floors non-integer counts', () => {
		expect(classifyRollover(3.9).tier).toBe('3-key rollover');
	});
});

describe('trackMaxSimultaneous', () => {
	it('keeps the running max as the current count rises', () => {
		expect(trackMaxSimultaneous(3, 1)).toBe(3);
		expect(trackMaxSimultaneous(5, 3)).toBe(5);
	});

	it('keeps the prior max when the current count drops (keys released)', () => {
		expect(trackMaxSimultaneous(1, 5)).toBe(5);
	});

	it('treats invalid input as zero rather than NaN', () => {
		expect(trackMaxSimultaneous(NaN, 4)).toBe(4);
		expect(trackMaxSimultaneous(3, NaN)).toBe(3);
		expect(trackMaxSimultaneous(-1, 2)).toBe(2);
	});
});
