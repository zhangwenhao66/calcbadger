import { describe, expect, it } from 'vitest';
import { solveLinearSystem } from '../src/lib/linearSystem';

/**
 * Expected values are hand-solved algebra (substitution/elimination done on
 * paper, independent of the Gaussian-elimination implementation under test),
 * verified by back-substitution into every original equation.
 */
describe('2x2 systems', () => {
	it('unique solution: 2x+3y=8, x-y=-1 -> x=1, y=2', () => {
		// From eq2: x = y - 1. Sub into eq1: 2(y-1)+3y=8 -> 5y=10 -> y=2, x=1.
		// Check: 2(1)+3(2)=8 [OK]. 1-2=-1 [OK].
		const result = solveLinearSystem(
			[
				[2, 3],
				[1, -1],
			],
			[8, -1],
		);
		expect(result.type).toBe('unique');
		if (result.type === 'unique') {
			expect(result.solution[0]).toBeCloseTo(1, 9);
			expect(result.solution[1]).toBeCloseTo(2, 9);
		}
	});

	it('unique solution with decimals: 0.5x+0.25y=1.25, x-y=1 -> x=2, y=1', () => {
		// From eq2: x = y+1. Sub: 0.5(y+1)+0.25y=1.25 -> 0.75y=0.75 -> y=1, x=2.
		// Check: 0.5(2)+0.25(1)=1.25 [OK]. 2-1=1 [OK].
		const result = solveLinearSystem(
			[
				[0.5, 0.25],
				[1, -1],
			],
			[1.25, 1],
		);
		expect(result.type).toBe('unique');
		if (result.type === 'unique') {
			expect(result.solution[0]).toBeCloseTo(2, 9);
			expect(result.solution[1]).toBeCloseTo(1, 9);
		}
	});

	it('no solution: parallel lines x+y=2, x+y=5', () => {
		const result = solveLinearSystem(
			[
				[1, 1],
				[1, 1],
			],
			[2, 5],
		);
		expect(result.type).toBe('none');
	});

	it('infinitely many solutions: 2x+y=5 and its double 4x+2y=10', () => {
		const result = solveLinearSystem(
			[
				[2, 1],
				[4, 2],
			],
			[5, 10],
		);
		expect(result.type).toBe('infinite');
	});

	it('negative and zero coefficients: -x+2y=4, 3x+0y=-6 -> x=-2, y=1', () => {
		// From eq2: x=-2. Sub into eq1: -(-2)+2y=4 -> 2+2y=4 -> y=1.
		// Check: -(-2)+2(1)=4 [OK]. 3(-2)+0(1)=-6 [OK].
		const result = solveLinearSystem(
			[
				[-1, 2],
				[3, 0],
			],
			[4, -6],
		);
		expect(result.type).toBe('unique');
		if (result.type === 'unique') {
			expect(result.solution[0]).toBeCloseTo(-2, 9);
			expect(result.solution[1]).toBeCloseTo(1, 9);
		}
	});
});

describe('3x3 systems', () => {
	it('unique solution: x+y+z=6, 2y+5z=-4, 2x+5y-z=27 -> x=5, y=3, z=-2', () => {
		// Classic elimination example. Check: 5+3-2=6 [OK]. 2(3)+5(-2)=6-10=-4 [OK].
		// 2(5)+5(3)-(-2)=10+15+2=27 [OK].
		const result = solveLinearSystem(
			[
				[1, 1, 1],
				[0, 2, 5],
				[2, 5, -1],
			],
			[6, -4, 27],
		);
		expect(result.type).toBe('unique');
		if (result.type === 'unique') {
			expect(result.solution[0]).toBeCloseTo(5, 9);
			expect(result.solution[1]).toBeCloseTo(3, 9);
			expect(result.solution[2]).toBeCloseTo(-2, 9);
		}
	});

	it('no solution: first two equations directly contradict', () => {
		// x+y+z=1 and x+y+z=2 cannot both hold.
		const result = solveLinearSystem(
			[
				[1, 1, 1],
				[1, 1, 1],
				[1, -1, 1],
			],
			[1, 2, 0],
		);
		expect(result.type).toBe('none');
	});

	it('infinitely many solutions: eq2 is 2x eq1, eq3 independent -> one free parameter', () => {
		// eq1: x+y+z=6. eq3: x-y=1 -> x=y+1. Sub into eq1: 2y+1+z=6 -> z=5-2y.
		// For any y: x=y+1, z=5-2y satisfies both, and eq2=2*eq1 is automatically satisfied.
		// e.g. y=1 -> x=2, z=3: check 2+1+3=6 [OK], 2(2+1+3)=12 [OK], 2-1=1 [OK].
		const result = solveLinearSystem(
			[
				[1, 1, 1],
				[2, 2, 2],
				[1, -1, 0],
			],
			[6, 12, 1],
		);
		expect(result.type).toBe('infinite');
	});
});
