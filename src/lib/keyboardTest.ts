/**
 * Keyboard tester: virtual key-press visualizer plus rollover (simultaneous
 * key) classification.
 *
 * The 104-key ANSI layout below is a physical layout of the US Windows
 * keyboard's key sections (function row, main alphanumeric block,
 * navigation cluster, arrow cluster, numeric keypad), cross-checked against
 * Wikipedia's "Keyboard layout" article, which states the US national
 * standard keyboard has 104 keys while most other countries' ISO layout
 * has 105, and separately documents the JIS layout (109 keys, via the
 * OADG 109A standard) -- see ANSI_ISO_JIS_KEY_COUNTS below. A test asserts
 * this module's own layout array has exactly 104 entries, tying the
 * rendered virtual keyboard to that count instead of letting the two drift
 * apart silently.
 *
 * The rollover tiers in classifyRollover() come from Wikipedia's "Key
 * rollover" article: keyboards without per-key diodes typically manage
 * two-key rollover reliably, "typically produce four- to five-key
 * rollover for the most common key sequences" once matrix layout is
 * optimized, and the USB HID boot protocol (used only by BIOS-level
 * input, not normal OS operation) caps out at 8 modifier keys plus 6
 * additional scancodes -- 6 non-modifier keys at once. Modern OSes use
 * the HID *report* protocol instead, which "imposes no restrictions and
 * supports full n-key rollover", so a browser detecting more than 6
 * simultaneous keys demonstrates the keyboard/OS/browser chain is using
 * that unrestricted report protocol rather than the boot protocol.
 */

export interface KeyDef {
	code: string;
	label: string;
	/** Width in units of one standard 1u key (2 = twice as wide, etc). */
	width: number;
}

// prettier-ignore
export const ANSI_104_LAYOUT: KeyDef[][] = [
	// Function row: Esc + F1-F12 = 13 keys
	[
		{ code: 'Escape', label: 'Esc', width: 1 },
		{ code: 'F1', label: 'F1', width: 1 }, { code: 'F2', label: 'F2', width: 1 },
		{ code: 'F3', label: 'F3', width: 1 }, { code: 'F4', label: 'F4', width: 1 },
		{ code: 'F5', label: 'F5', width: 1 }, { code: 'F6', label: 'F6', width: 1 },
		{ code: 'F7', label: 'F7', width: 1 }, { code: 'F8', label: 'F8', width: 1 },
		{ code: 'F9', label: 'F9', width: 1 }, { code: 'F10', label: 'F10', width: 1 },
		{ code: 'F11', label: 'F11', width: 1 }, { code: 'F12', label: 'F12', width: 1 },
	],
	// Number row: ` 1-0 - = Backspace = 14 keys
	[
		{ code: 'Backquote', label: '`', width: 1 },
		{ code: 'Digit1', label: '1', width: 1 }, { code: 'Digit2', label: '2', width: 1 },
		{ code: 'Digit3', label: '3', width: 1 }, { code: 'Digit4', label: '4', width: 1 },
		{ code: 'Digit5', label: '5', width: 1 }, { code: 'Digit6', label: '6', width: 1 },
		{ code: 'Digit7', label: '7', width: 1 }, { code: 'Digit8', label: '8', width: 1 },
		{ code: 'Digit9', label: '9', width: 1 }, { code: 'Digit0', label: '0', width: 1 },
		{ code: 'Minus', label: '-', width: 1 }, { code: 'Equal', label: '=', width: 1 },
		{ code: 'Backspace', label: 'Backspace', width: 2 },
	],
	// QWERTY row: Tab + Q-P + [ ] \ = 14 keys
	[
		{ code: 'Tab', label: 'Tab', width: 1.5 },
		{ code: 'KeyQ', label: 'Q', width: 1 }, { code: 'KeyW', label: 'W', width: 1 },
		{ code: 'KeyE', label: 'E', width: 1 }, { code: 'KeyR', label: 'R', width: 1 },
		{ code: 'KeyT', label: 'T', width: 1 }, { code: 'KeyY', label: 'Y', width: 1 },
		{ code: 'KeyU', label: 'U', width: 1 }, { code: 'KeyI', label: 'I', width: 1 },
		{ code: 'KeyO', label: 'O', width: 1 }, { code: 'KeyP', label: 'P', width: 1 },
		{ code: 'BracketLeft', label: '[', width: 1 }, { code: 'BracketRight', label: ']', width: 1 },
		{ code: 'Backslash', label: '\\', width: 1.5 },
	],
	// Home row: CapsLock + A-L + ; ' Enter = 13 keys
	[
		{ code: 'CapsLock', label: 'Caps Lock', width: 1.75 },
		{ code: 'KeyA', label: 'A', width: 1 }, { code: 'KeyS', label: 'S', width: 1 },
		{ code: 'KeyD', label: 'D', width: 1 }, { code: 'KeyF', label: 'F', width: 1 },
		{ code: 'KeyG', label: 'G', width: 1 }, { code: 'KeyH', label: 'H', width: 1 },
		{ code: 'KeyJ', label: 'J', width: 1 }, { code: 'KeyK', label: 'K', width: 1 },
		{ code: 'KeyL', label: 'L', width: 1 },
		{ code: 'Semicolon', label: ';', width: 1 }, { code: 'Quote', label: "'", width: 1 },
		{ code: 'Enter', label: 'Enter', width: 2.25 },
	],
	// Bottom letter row: ShiftL + Z-M + , . / ShiftR = 12 keys
	[
		{ code: 'ShiftLeft', label: 'Shift', width: 2.25 },
		{ code: 'KeyZ', label: 'Z', width: 1 }, { code: 'KeyX', label: 'X', width: 1 },
		{ code: 'KeyC', label: 'C', width: 1 }, { code: 'KeyV', label: 'V', width: 1 },
		{ code: 'KeyB', label: 'B', width: 1 }, { code: 'KeyN', label: 'N', width: 1 },
		{ code: 'KeyM', label: 'M', width: 1 },
		{ code: 'Comma', label: ',', width: 1 }, { code: 'Period', label: '.', width: 1 },
		{ code: 'Slash', label: '/', width: 1 },
		{ code: 'ShiftRight', label: 'Shift', width: 2.75 },
	],
	// Bottom modifier row: CtrlL WinL AltL Space AltR WinR Menu CtrlR = 8 keys
	[
		{ code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
		{ code: 'MetaLeft', label: 'Win', width: 1.25 },
		{ code: 'AltLeft', label: 'Alt', width: 1.25 },
		{ code: 'Space', label: 'Space', width: 6.25 },
		{ code: 'AltRight', label: 'Alt', width: 1.25 },
		{ code: 'MetaRight', label: 'Win', width: 1.25 },
		{ code: 'ContextMenu', label: 'Menu', width: 1.25 },
		{ code: 'ControlRight', label: 'Ctrl', width: 1.25 },
	],
	// Navigation cluster row 1: PrtSc ScrLk Pause = 3 keys
	[
		{ code: 'PrintScreen', label: 'PrtSc', width: 1 },
		{ code: 'ScrollLock', label: 'ScrLk', width: 1 },
		{ code: 'Pause', label: 'Pause', width: 1 },
	],
	// Navigation cluster row 2: Insert Home PageUp = 3 keys
	[
		{ code: 'Insert', label: 'Ins', width: 1 },
		{ code: 'Home', label: 'Home', width: 1 },
		{ code: 'PageUp', label: 'PgUp', width: 1 },
	],
	// Navigation cluster row 3: Delete End PageDown = 3 keys
	[
		{ code: 'Delete', label: 'Del', width: 1 },
		{ code: 'End', label: 'End', width: 1 },
		{ code: 'PageDown', label: 'PgDn', width: 1 },
	],
	// Arrow cluster: Up, Left, Down, Right = 4 keys
	[
		{ code: 'ArrowUp', label: '↑', width: 1 },
	],
	[
		{ code: 'ArrowLeft', label: '←', width: 1 },
		{ code: 'ArrowDown', label: '↓', width: 1 },
		{ code: 'ArrowRight', label: '→', width: 1 },
	],
	// Numeric keypad, top to bottom: NumLock / * - (4); 7 8 9 + (4); 4 5 6 (3); 1 2 3 Enter (4); 0 . (2) = 17
	[
		{ code: 'NumLock', label: 'Num', width: 1 },
		{ code: 'NumpadDivide', label: '/', width: 1 },
		{ code: 'NumpadMultiply', label: '*', width: 1 },
		{ code: 'NumpadSubtract', label: '-', width: 1 },
	],
	[
		{ code: 'Numpad7', label: '7', width: 1 }, { code: 'Numpad8', label: '8', width: 1 },
		{ code: 'Numpad9', label: '9', width: 1 }, { code: 'NumpadAdd', label: '+', width: 1 },
	],
	[
		{ code: 'Numpad4', label: '4', width: 1 }, { code: 'Numpad5', label: '5', width: 1 },
		{ code: 'Numpad6', label: '6', width: 1 },
	],
	[
		{ code: 'Numpad1', label: '1', width: 1 }, { code: 'Numpad2', label: '2', width: 1 },
		{ code: 'Numpad3', label: '3', width: 1 }, { code: 'NumpadEnter', label: 'Enter', width: 1 },
	],
	[
		{ code: 'Numpad0', label: '0', width: 2 }, { code: 'NumpadDecimal', label: '.', width: 1 },
	],
];

export function totalKeyCount(layout: KeyDef[][]): number {
	return layout.reduce((sum, row) => sum + row.length, 0);
}

export interface LayoutKeyCount {
	name: string;
	keys: number;
	note: string;
}

/** Sourced figures for the three common full-size physical layouts (see module doc). */
export const ANSI_ISO_JIS_KEY_COUNTS: LayoutKeyCount[] = [
	{ name: 'ANSI (US)', keys: 104, note: 'Shorter Enter key, tall left Shift, backslash above Enter.' },
	{ name: 'ISO (UK/EU)', keys: 105, note: 'Tall Enter key, shorter left Shift makes room for one extra key beside it.' },
	{ name: 'JIS (Japan)', keys: 109, note: 'Split space bar and extra kana/conversion keys near Enter.' },
];

/** USB HID boot protocol: 8 modifier keys (exempt) + 6 simultaneous non-modifier scancodes. */
export const USB_BOOT_PROTOCOL_MAX_KEYS = 6;

export interface RolloverTier {
	tier: string;
	description: string;
}

/** Classifies a count of simultaneously-held (non-modifier) keys against the documented rollover tiers. */
export function classifyRollover(simultaneousCount: number): RolloverTier {
	const n = Number.isFinite(simultaneousCount) && simultaneousCount > 0 ? Math.floor(simultaneousCount) : 0;
	if (n <= 0) {
		return { tier: 'No keys held', description: 'Hold down several keys at once to test rollover.' };
	}
	if (n <= 2) {
		return {
			tier: `${n}-key rollover`,
			description: 'The baseline every working keyboard should handle without dropping a key.',
		};
	}
	if (n < USB_BOOT_PROTOCOL_MAX_KEYS) {
		return {
			tier: `${n}-key rollover`,
			description: "Typical range for a keyboard's common-sequence rollover on a diode-free key matrix.",
		};
	}
	if (n === USB_BOOT_PROTOCOL_MAX_KEYS) {
		return {
			tier: `${n}-key rollover`,
			description: "Right at the USB HID boot protocol's ceiling of 6 simultaneous non-modifier keys.",
		};
	}
	return {
		tier: `${n}-key rollover`,
		description:
			'Past the 6-key boot-protocol ceiling: your keyboard, OS, and browser are using the unrestricted HID report protocol.',
	};
}

export function trackMaxSimultaneous(currentCount: number, maxSoFar: number): number {
	const c = Number.isFinite(currentCount) && currentCount >= 0 ? currentCount : 0;
	const m = Number.isFinite(maxSoFar) && maxSoFar >= 0 ? maxSoFar : 0;
	return Math.max(c, m);
}
