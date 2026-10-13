/**
 * Touchscreen test: a grid-coverage trace test for dead zones, a live
 * simultaneous-touch counter, and a touch-event log.
 *
 * The trace method follows the two tests the platform vendors themselves
 * document:
 *   - Google's Android help page "Fix a screen that isn't working right on
 *     Android" tells users to touch the top-left corner of the screen and drag
 *     slowly to the bottom-right "without lifting", slowly enough to count to
 *     10. If the drag releases partway and does so in the same place on a
 *     repeat, the page tells the user to contact the manufacturer. That is a
 *     dead-zone test done by hand.
 *   - Samsung's *#0*# hardware menu exposes a "Touch" test in which the user
 *     drags a finger to complete a box and an X; any part that doesn't change
 *     colour marks a problem area.
 * This tool paints a grid instead of a box so the result is countable, and
 * rasterises each drag as a line so a fast swipe doesn't leave phantom gaps.
 *
 * The device ceiling comes from Navigator.maxTouchPoints, which MDN documents
 * as "the maximum number of simultaneous touch contact points that are
 * supported by the current device" — 0 on a machine with no touchscreen, and
 * commonly 5 on a smartphone, though the real value is hardware-dependent.
 *
 * Touch identity follows the W3C/MDN touch and pointer models: each contact
 * carries an identifier (Touch.identifier, or PointerEvent.pointerId) that
 * "remains consistent for each event during the duration of each finger's
 * contact with the surface". That stability is what lets a stroke be tracked
 * as one continuous finger rather than a series of unrelated dots.
 */

/** Grid resolution for the trace test. 12 x 18 = 216 cells. */
export const GRID_COLS = 12;
export const GRID_ROWS = 18;

export interface Cell {
	col: number;
	row: number;
}

/**
 * Index of the grid cell containing (x, y), or -1 when the point is outside the
 * surface, the surface has no area, or the input isn't a finite number.
 */
export function cellAt(
	x: number,
	y: number,
	width: number,
	height: number,
	cols: number = GRID_COLS,
	rows: number = GRID_ROWS,
): number {
	if (!(width > 0) || !(height > 0) || cols < 1 || rows < 1) return -1;
	if (!Number.isFinite(x) || !Number.isFinite(y)) return -1;
	if (x < 0 || y < 0 || x >= width || y >= height) return -1;
	const col = Math.min(cols - 1, Math.floor(x / (width / cols)));
	const row = Math.min(rows - 1, Math.floor(y / (height / rows)));
	return row * cols + col;
}

export function cellIndex(col: number, row: number, cols: number = GRID_COLS): number {
	return row * cols + col;
}

/**
 * Every grid cell a drag from (x0, y0) to (x1, y1) passes through, as a sorted
 * list of unique indices. The segment is sampled at half the smallest cell
 * dimension, which is fine enough that a straight line cannot step over a cell
 * it should have touched — a single sample at the start and end points would
 * miss everything in between on a fast swipe.
 */
export function cellsForSegment(
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	width: number,
	height: number,
	cols: number = GRID_COLS,
	rows: number = GRID_ROWS,
): number[] {
	if (!(width > 0) || !(height > 0) || cols < 1 || rows < 1) return [];
	if (![x0, y0, x1, y1].every((n) => Number.isFinite(n))) return [];

	const step = Math.min(width / cols, height / rows) / 2;
	const dx = x1 - x0;
	const dy = y1 - y0;
	const distance = Math.hypot(dx, dy);
	const steps = Math.max(1, Math.ceil(distance / step));

	const hit = new Set<number>();
	for (let i = 0; i <= steps; i += 1) {
		const t = i / steps;
		const idx = cellAt(x0 + dx * t, y0 + dy * t, width, height, cols, rows);
		if (idx >= 0) hit.add(idx);
	}
	return [...hit].sort((a, b) => a - b);
}

/** Cells covered as a percentage of the whole grid, rounded to one decimal. */
export function coveragePercent(
	touched: number,
	cols: number = GRID_COLS,
	rows: number = GRID_ROWS,
): number {
	const total = cols * rows;
	if (!(total > 0) || !Number.isFinite(touched)) return 0;
	const clamped = Math.max(0, Math.min(touched, total));
	return Math.round((clamped / total) * 1000) / 10;
}

export interface TouchPointTier {
	tier: string;
	description: string;
}

/**
 * Compares the highest number of fingers seen at once against what the device
 * reports it can handle. A device reporting 0 has no touchscreen at all, which
 * is a different situation from "you only pressed one finger".
 */
export function classifyTouchPoints(peak: number, maxTouchPoints: number): TouchPointTier {
	if (!Number.isFinite(maxTouchPoints) || maxTouchPoints <= 0) {
		return {
			tier: 'No touchscreen reported',
			description:
				'This browser reports 0 simultaneous touch points, so the touch surface below will only respond to a mouse or trackpad. On a phone or tablet that reads 0, the page is probably running in a desktop-mode request.',
		};
	}
	if (!Number.isFinite(peak) || peak <= 0) {
		return {
			tier: 'No reading yet',
			description: `Touch the surface with one or more fingers. This device reports up to ${maxTouchPoints} points at once.`,
		};
	}
	if (peak >= maxTouchPoints) {
		return {
			tier: 'At the reported ceiling',
			description: `You registered ${peak} simultaneous points, which reaches the ${maxTouchPoints} this device reports it can track.`,
		};
	}
	return {
		tier: 'Below the reported ceiling',
		description: `You registered ${peak} of the ${maxTouchPoints} simultaneous points this device reports. Press more fingers at once to find the real ceiling.`,
	};
}

/** Human-readable label for a PointerEvent.pointerType value. */
export function pointerTypeLabel(pointerType: string): string {
	switch (pointerType) {
		case 'touch':
			return 'finger';
		case 'pen':
			return 'stylus';
		case 'mouse':
			return 'mouse';
		default:
			return pointerType || 'unknown';
	}
}

/**
 * One line describing a touch event, for the event log. Timestamps are
 * milliseconds since the page loaded, which is enough to spot a stream of
 * events arriving when nothing is touching the screen.
 */
export function formatEventLine(elapsedMs: number, kind: string, pointerType: string, id: number): string {
	const seconds = Math.max(0, elapsedMs) / 1000;
	return `${seconds.toFixed(1)}s · ${kind} · ${pointerTypeLabel(pointerType)} #${id}`;
}
