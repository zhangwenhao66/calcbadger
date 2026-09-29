/**
 * Mouse tester: button-registration visualizer, double-click timing
 * classification, and a polling-rate (report-rate) estimate.
 *
 * Double-click thresholds come from Windows' own DoubleClickSpeed control
 * (read via the .NET SystemInformation.DoubleClickTime API, which documents
 * it as "the maximum number of milliseconds that may elapse between a first
 * click and a second click for the OS to consider the mouse action a double-
 * click"). Community-verified guides to that control (ComputerHope, NinjaOne)
 * consistently report the out-of-the-box default as 500 ms with an adjustable
 * range of roughly 200-900 ms, backed by the underlying Win32 registry value
 * HKEY_CURRENT_USER\Control Panel\Mouse\DoubleClickSpeed. macOS exposes the
 * same idea as a relative Accessibility slider (System Settings > Accessibility
 * > Pointer Control > Double-click speed) rather than a fixed millisecond
 * number, per Apple's own support documentation.
 *
 * Polling-rate tiers (125/500/1000 Hz) reflect the USB HID interrupt-transfer
 * report rates most consumer mice (125 Hz, one report every 8 ms) and gaming
 * mice (500-1000+ Hz) actually ship with, as documented across mouse-hardware
 * vendor and hardware-explainer sources.
 *
 * The measurement caveat matters as much as the numbers: Chromium and Firefox
 * both coalesce continuous pointer/mouse-move events and only dispatch them to
 * page JavaScript right before the next animation frame (see Chromium's "Inside
 * look at modern web browser" series and the W3C Pointer Events spec's
 * getCoalescedEvents()), so a naive mousemove-per-second count caps out near
 * the display's refresh rate (commonly 60-144 Hz) no matter how fast the mouse
 * itself reports. PointerEvent.getCoalescedEvents() (Chrome 58+, Firefox 59+;
 * unsupported in Safari) recovers the individual pre-coalescing samples, which
 * is why this tool reports its method (coalesced vs raw) alongside the number.
 */

export const DOUBLE_CLICK_DEFAULT_MS = 500;
export const DOUBLE_CLICK_MIN_MS = 200;
export const DOUBLE_CLICK_MAX_MS = 900;

export interface DoubleClickTier {
	tier: string;
	description: string;
}

/** Classifies a measured interval between two clicks against the documented Windows default range. */
export function classifyDoubleClickInterval(ms: number): DoubleClickTier {
	if (!Number.isFinite(ms) || ms < 0) {
		return { tier: 'No reading yet', description: 'Click twice in the test area to measure your interval.' };
	}
	if (ms <= DOUBLE_CLICK_MIN_MS) {
		return {
			tier: 'Faster than the fastest default setting',
			description: `At or under the ${DOUBLE_CLICK_MIN_MS} ms floor of Windows' adjustable range: this would register as a double-click under every common default.`,
		};
	}
	if (ms <= DOUBLE_CLICK_DEFAULT_MS) {
		return {
			tier: 'Within the out-of-the-box default',
			description: `Under Windows' commonly documented default of ${DOUBLE_CLICK_DEFAULT_MS} ms, so this would register as a double-click on an unmodified system.`,
		};
	}
	if (ms <= DOUBLE_CLICK_MAX_MS) {
		return {
			tier: 'Slower than default, but within range',
			description: `Past the ${DOUBLE_CLICK_DEFAULT_MS} ms default but still inside the ${DOUBLE_CLICK_MIN_MS}-${DOUBLE_CLICK_MAX_MS} ms adjustable range: this would only register as a double-click if that setting has been loosened.`,
		};
	}
	return {
		tier: 'Slower than any default double-click window',
		description: `Past the ${DOUBLE_CLICK_MAX_MS} ms ceiling of the adjustable range: most systems on default settings would read this as two separate single clicks.`,
	};
}

/** Average interval (ms) between consecutive, already-sorted timestamps. Needs at least 2 samples. */
export function computeAverageIntervalMs(timestamps: number[]): number {
	if (!Array.isArray(timestamps) || timestamps.length < 2) return 0;
	let total = 0;
	let count = 0;
	for (let i = 1; i < timestamps.length; i++) {
		const diff = timestamps[i]! - timestamps[i - 1]!;
		if (Number.isFinite(diff) && diff > 0) {
			total += diff;
			count++;
		}
	}
	return count > 0 ? total / count : 0;
}

/** Converts an average interval in milliseconds to a rate in Hz (reports per second). */
export function hzFromAverageIntervalMs(avgMs: number): number {
	if (!Number.isFinite(avgMs) || avgMs <= 0) return 0;
	return 1000 / avgMs;
}

export type PollingMethod = 'coalesced' | 'raw';

export interface PollingTier {
	tier: string;
	description: string;
}

/**
 * Classifies an estimated Hz reading. "raw" readings (no getCoalescedEvents
 * support, e.g. Safari) are capped by the display's refresh rate rather than
 * the mouse's true report rate, so tiers above roughly 144 Hz are only
 * meaningful for "coalesced" readings.
 */
export function classifyPollingRate(hz: number, method: PollingMethod): PollingTier {
	if (!Number.isFinite(hz) || hz <= 0) {
		return { tier: 'No reading yet', description: 'Move the mouse steadily inside the test area for a couple of seconds.' };
	}
	if (method === 'raw' && hz <= 144) {
		return {
			tier: `~${Math.round(hz)} Hz (raw, likely display-capped)`,
			description:
				"This browser doesn't expose pre-coalescing pointer samples, so this number reflects your screen's refresh rate more than the mouse's true report rate. It's an upper bound on what raw events can show here, not a measurement of the mouse itself.",
		};
	}
	if (hz <= 180) {
		return {
			tier: `~${Math.round(hz)} Hz (125 Hz class)`,
			description: 'Consistent with a standard-issue mouse reporting at the common 125 Hz (one report every 8 ms).',
		};
	}
	if (hz <= 700) {
		return {
			tier: `~${Math.round(hz)} Hz (500 Hz class)`,
			description: 'Consistent with a mid-tier or gaming mouse set to roughly 500 Hz.',
		};
	}
	return {
		tier: `~${Math.round(hz)} Hz (1000 Hz+ class)`,
		description: 'Consistent with a gaming mouse set to 1000 Hz or higher (one report every millisecond or less).',
	};
}

export interface MouseButtonDef {
	/** MouseEvent.button value per the DOM UIEvents spec (0=left,1=middle,2=right,3=back,4=forward). */
	button: number;
	label: string;
}

export const MOUSE_BUTTONS: MouseButtonDef[] = [
	{ button: 0, label: 'Left' },
	{ button: 2, label: 'Right' },
	{ button: 1, label: 'Middle / scroll wheel click' },
	{ button: 3, label: 'Back (button 4)' },
	{ button: 4, label: 'Forward (button 5)' },
];
