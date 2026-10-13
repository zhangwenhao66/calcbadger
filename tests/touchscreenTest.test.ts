import { describe, expect, it } from 'vitest';
import {
	GRID_COLS,
	GRID_ROWS,
	cellAt,
	cellIndex,
	cellsForSegment,
	classifyTouchPoints,
	coveragePercent,
	formatEventLine,
	pointerTypeLabel,
} from '../src/lib/touchscreenTest';

describe('cellAt', () => {
	it('maps a point to its cell on a 2x2 grid of 100x100', () => {
		expect(cellAt(10, 10, 100, 100, 2, 2)).toBe(0);
		expect(cellAt(60, 10, 100, 100, 2, 2)).toBe(1);
		expect(cellAt(10, 60, 100, 100, 2, 2)).toBe(2);
		expect(cellAt(60, 60, 100, 100, 2, 2)).toBe(3);
	});

	it('treats the last addressable pixel as inside the final cell', () => {
		expect(cellAt(99.9, 99.9, 100, 100, 2, 2)).toBe(3);
		expect(cellAt(49.9, 49.9, 100, 100, 2, 2)).toBe(0);
		expect(cellAt(50, 50, 100, 100, 2, 2)).toBe(3);
	});

	it('returns -1 for points outside the surface', () => {
		expect(cellAt(-1, 10, 100, 100, 2, 2)).toBe(-1);
		expect(cellAt(10, -1, 100, 100, 2, 2)).toBe(-1);
		expect(cellAt(100, 10, 100, 100, 2, 2)).toBe(-1);
		expect(cellAt(10, 100, 100, 100, 2, 2)).toBe(-1);
	});

	it('returns -1 for degenerate surfaces and non-finite input', () => {
		expect(cellAt(10, 10, 0, 100, 2, 2)).toBe(-1);
		expect(cellAt(10, 10, 100, 0, 2, 2)).toBe(-1);
		expect(cellAt(10, 10, 100, 100, 0, 2)).toBe(-1);
		expect(cellAt(NaN, 10, 100, 100, 2, 2)).toBe(-1);
		expect(cellAt(10, Infinity, 100, 100, 2, 2)).toBe(-1);
	});
});

describe('cellIndex', () => {
	it('lays cells out row-major', () => {
		expect(cellIndex(0, 0, 12)).toBe(0);
		expect(cellIndex(11, 0, 12)).toBe(11);
		expect(cellIndex(0, 1, 12)).toBe(12);
		expect(cellIndex(11, 17, 12)).toBe(GRID_COLS * GRID_ROWS - 1);
	});
});

describe('cellsForSegment', () => {
	it('returns a single cell when start and end coincide', () => {
		expect(cellsForSegment(10, 10, 10, 10, 100, 100, 2, 2)).toEqual([0]);
	});

	it('covers every cell along a horizontal drag, not just the endpoints', () => {
		expect(cellsForSegment(10, 10, 90, 10, 100, 100, 2, 2)).toEqual([0, 1]);
	});

	it('covers every cell along a vertical drag', () => {
		expect(cellsForSegment(10, 10, 10, 90, 100, 100, 2, 2)).toEqual([0, 2]);
		expect(cellsForSegment(10, 90, 90, 90, 100, 100, 2, 2)).toEqual([2, 3]);
	});

	it('covers the cells a diagonal drag crosses', () => {
		// (10,10) -> (90,60) samples at (10,10) (30,22.5) (50,35) (70,47.5) (90,60),
		// landing in cells 0, 0, 1, 1, 3. Deliberately not the exact-corner diagonal
		// (10,10) -> (90,90), which grazes the point shared by all four cells and would
		// make the expected list depend on the sampling step rather than the geometry.
		expect(cellsForSegment(10, 10, 90, 60, 100, 100, 2, 2)).toEqual([0, 1, 3]);
	});

	it('keeps only the in-bounds part of a drag that leaves the surface', () => {
		expect(cellsForSegment(0, 0, -100, 0, 100, 100, 2, 2)).toEqual([0]);
	});

	it('returns nothing for non-finite coordinates or a degenerate surface', () => {
		expect(cellsForSegment(NaN, 0, 10, 10, 100, 100, 2, 2)).toEqual([]);
		expect(cellsForSegment(0, 0, 10, 10, 0, 100, 2, 2)).toEqual([]);
	});

	it('does not repeat a cell when the drag stays inside one', () => {
		expect(cellsForSegment(5, 5, 40, 40, 100, 100, 2, 2)).toEqual([0]);
	});
});

describe('coveragePercent', () => {
	it('reports 0 for an untouched grid', () => {
		expect(coveragePercent(0, 12, 18)).toBe(0);
	});

	it('reports half coverage for half the cells', () => {
		expect(coveragePercent(108, 12, 18)).toBe(50);
	});

	it('clamps above the grid size and below zero', () => {
		expect(coveragePercent(216, 12, 18)).toBe(100);
		expect(coveragePercent(300, 12, 18)).toBe(100);
		expect(coveragePercent(-5, 12, 18)).toBe(0);
	});

	it('rounds to one decimal place', () => {
		expect(coveragePercent(1, 12, 18)).toBe(0.5);
		expect(coveragePercent(2, 12, 18)).toBe(0.9);
	});
});

describe('classifyTouchPoints', () => {
	it('reports no touchscreen when the device claims 0 points', () => {
		expect(classifyTouchPoints(0, 0).tier).toBe('No touchscreen reported');
		expect(classifyTouchPoints(3, 0).tier).toBe('No touchscreen reported');
		expect(classifyTouchPoints(0, NaN).tier).toBe('No touchscreen reported');
	});

	it('reports no reading before any finger lands', () => {
		expect(classifyTouchPoints(0, 5).tier).toBe('No reading yet');
		expect(classifyTouchPoints(NaN, 5).tier).toBe('No reading yet');
	});

	it('reports the ceiling when the peak reaches or exceeds it', () => {
		expect(classifyTouchPoints(5, 5).tier).toBe('At the reported ceiling');
		expect(classifyTouchPoints(7, 5).tier).toBe('At the reported ceiling');
		expect(classifyTouchPoints(1, 1).tier).toBe('At the reported ceiling');
	});

	it('reports below the ceiling when fewer fingers were used', () => {
		expect(classifyTouchPoints(2, 5).tier).toBe('Below the reported ceiling');
		expect(classifyTouchPoints(2, 5).description).toContain('2 of the 5');
	});
});

describe('pointerTypeLabel', () => {
	it('names the common pointer types', () => {
		expect(pointerTypeLabel('touch')).toBe('finger');
		expect(pointerTypeLabel('pen')).toBe('stylus');
		expect(pointerTypeLabel('mouse')).toBe('mouse');
	});

	it('falls back for unknown or missing types', () => {
		expect(pointerTypeLabel('eraser')).toBe('eraser');
		expect(pointerTypeLabel('')).toBe('unknown');
	});
});

describe('formatEventLine', () => {
	it('renders elapsed seconds, kind, pointer type and id', () => {
		expect(formatEventLine(1500, 'down', 'touch', 3)).toBe('1.5s · down · finger #3');
		expect(formatEventLine(12300, 'move', 'mouse', 1)).toBe('12.3s · move · mouse #1');
	});

	it('never renders a negative elapsed time', () => {
		expect(formatEventLine(-100, 'up', 'touch', 2)).toBe('0.0s · up · finger #2');
	});
});
