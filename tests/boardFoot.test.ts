import { describe, expect, it } from 'vitest';
import {
	boardFeetPerPiece,
	costEstimate,
	quartersToInches,
	toFeet,
	totalBoardFeet,
	withWaste,
} from '../src/lib/boardFoot';

/**
 * Expected values: hand-computed from board feet = (thickness in. x width
 * in. x length ft.) / 12 (UW-Madison Division of Extension, Forestry,
 * FEM-042 "What Is A Board Foot?").
 */
describe('boardFeetPerPiece', () => {
	it('1" x 6" x 8 ft = 4 bd ft (textbook example)', () => {
		expect(boardFeetPerPiece(1, 6, 8)).toBe(4);
	});

	it('2" x 8" x 10 ft = 13.3333 bd ft', () => {
		expect(boardFeetPerPiece(2, 8, 10)).toBeCloseTo(13.3333, 3);
	});

	it('2" x 12" x 16 ft = 32 bd ft', () => {
		expect(boardFeetPerPiece(2, 12, 16)).toBe(32);
	});

	it('zero thickness yields zero board feet', () => {
		expect(boardFeetPerPiece(0, 8, 8)).toBe(0);
	});
});

describe('totalBoardFeet', () => {
	it('8 bd ft/piece x 6 pieces = 48 bd ft', () => {
		expect(totalBoardFeet(8, 6)).toBe(48);
	});
});

describe('withWaste', () => {
	it('48 bd ft + 10% waste = 52.8 bd ft', () => {
		expect(withWaste(48, 10)).toBeCloseTo(52.8, 8);
	});

	it('0% waste leaves the value unchanged', () => {
		expect(withWaste(48, 0)).toBe(48);
	});
});

describe('costEstimate', () => {
	it('52.8 bd ft at $9.25/bd ft = $488.40', () => {
		expect(costEstimate(52.8, 9.25)).toBeCloseTo(488.4, 8);
	});

	it('4 bd ft at $6.50/bd ft = $26.00', () => {
		expect(costEstimate(4, 6.5)).toBeCloseTo(26, 8);
	});
});

describe('quartersToInches (NHLA rough-sawn convention)', () => {
	it('4/4 = 1 inch', () => {
		expect(quartersToInches(4)).toBe(1);
	});

	it('8/4 = 2 inches', () => {
		expect(quartersToInches(8)).toBe(2);
	});

	it('5/4 = 1.25 inches', () => {
		expect(quartersToInches(5)).toBe(1.25);
	});
});

describe('toFeet', () => {
	it('96 inches = 8 ft', () => {
		expect(toFeet(96, 'in')).toBeCloseTo(8, 12);
	});

	it('feet passthrough', () => {
		expect(toFeet(8, 'ft')).toBe(8);
	});
});
