import { describe, expect, it } from 'vitest';
import { computeGpa, GRADE_POINTS, LEVEL_BOOST, pointsForCourse, type Course } from '../src/lib/gpa';

/**
 * Expected values hand-computed with Python (2026-08-10) before the
 * implementation existed: q = sum(points*credits), gpa = q / sum(credits).
 */
describe('GRADE_POINTS / LEVEL_BOOST', () => {
	it('matches the College Board BigFuture 4.0-scale chart', () => {
		expect(GRADE_POINTS['A+']).toBe(4.0);
		expect(GRADE_POINTS.A).toBe(4.0);
		expect(GRADE_POINTS['A-']).toBe(3.7);
		expect(GRADE_POINTS['B+']).toBe(3.3);
		expect(GRADE_POINTS.B).toBe(3.0);
		expect(GRADE_POINTS['B-']).toBe(2.7);
		expect(GRADE_POINTS['C+']).toBe(2.3);
		expect(GRADE_POINTS.C).toBe(2.0);
		expect(GRADE_POINTS['C-']).toBe(1.7);
		expect(GRADE_POINTS['D+']).toBe(1.3);
		expect(GRADE_POINTS.D).toBe(1.0);
		expect(GRADE_POINTS['D-']).toBe(0.7);
		expect(GRADE_POINTS.F).toBe(0.0);
	});

	it('level boosts follow the common Honors +0.5 / AP-IB +1.0 convention', () => {
		expect(LEVEL_BOOST.regular).toBe(0);
		expect(LEVEL_BOOST.honors).toBe(0.5);
		expect(LEVEL_BOOST.ap).toBe(1.0);
	});
});

describe('pointsForCourse', () => {
	it('unweighted ignores level entirely', () => {
		expect(pointsForCourse({ grade: 'B+', level: 'ap' }, false)).toBe(3.3);
	});

	it('weighted adds the level boost on top of the base grade points', () => {
		expect(pointsForCourse({ grade: 'A', level: 'ap' }, true)).toBeCloseTo(5.0, 10);
		expect(pointsForCourse({ grade: 'B+', level: 'honors' }, true)).toBeCloseTo(3.8, 10);
		expect(pointsForCourse({ grade: 'A-', level: 'regular' }, true)).toBeCloseTo(3.7, 10);
	});
});

describe('computeGpa — unweighted', () => {
	it('A(3cr) + B+(4cr) + C(3cr) + A-(3cr) = 3.2538... over 13 credits', () => {
		const courses: Course[] = [
			{ grade: 'A', credits: 3, level: 'regular' },
			{ grade: 'B+', credits: 4, level: 'regular' },
			{ grade: 'C', credits: 3, level: 'regular' },
			{ grade: 'A-', credits: 3, level: 'regular' },
		];
		const result = computeGpa(courses, false);
		expect(result).not.toBeNull();
		expect(result!.qualityPoints).toBeCloseTo(42.3, 10);
		expect(result!.totalCredits).toBe(13);
		expect(result!.gpa).toBeCloseTo(3.253846153846154, 10);
	});

	it('all F grades average to 0.0', () => {
		const courses: Course[] = [
			{ grade: 'F', credits: 3, level: 'regular' },
			{ grade: 'F', credits: 4, level: 'regular' },
		];
		expect(computeGpa(courses, false)!.gpa).toBe(0);
	});

	it('a single 4-credit A course averages to exactly 4.0', () => {
		const courses: Course[] = [{ grade: 'A', credits: 4, level: 'regular' }];
		expect(computeGpa(courses, false)!.gpa).toBe(4.0);
	});
});

describe('computeGpa — weighted', () => {
	it('matches the worked example: AP A + Honors B+ + Regular A-, 1 credit each = 4.1667', () => {
		// (4.0+1.0)*1 + (3.3+0.5)*1 + (3.7+0.0)*1 = 12.5, / 3 credits = 4.1666...
		const courses: Course[] = [
			{ grade: 'A', credits: 1, level: 'ap' },
			{ grade: 'B+', credits: 1, level: 'honors' },
			{ grade: 'A-', credits: 1, level: 'regular' },
		];
		const result = computeGpa(courses, true);
		expect(result!.qualityPoints).toBeCloseTo(12.5, 10);
		expect(result!.totalCredits).toBe(3);
		expect(result!.gpa).toBeCloseTo(4.166666666666667, 10);
	});

	it('an AP A course alone can push weighted GPA above the 4.0 unweighted ceiling', () => {
		const courses: Course[] = [{ grade: 'A', credits: 3, level: 'ap' }];
		expect(computeGpa(courses, true)!.gpa).toBeCloseTo(5.0, 10);
		expect(computeGpa(courses, false)!.gpa).toBeCloseTo(4.0, 10);
	});
});

describe('computeGpa — edge cases', () => {
	it('excludes courses with zero or negative credits from the average', () => {
		const courses: Course[] = [
			{ grade: 'A', credits: 3, level: 'regular' },
			{ grade: 'F', credits: 0, level: 'regular' },
			{ grade: 'F', credits: -2, level: 'regular' },
		];
		const result = computeGpa(courses, false);
		expect(result!.totalCredits).toBe(3);
		expect(result!.gpa).toBe(4.0);
	});

	it('returns null when no course has positive credits', () => {
		expect(computeGpa([], false)).toBeNull();
		expect(computeGpa([{ grade: 'A', credits: 0, level: 'regular' }], false)).toBeNull();
	});

	it('returns null when credits is NaN', () => {
		expect(computeGpa([{ grade: 'A', credits: NaN, level: 'regular' }], false)).toBeNull();
	});
});
