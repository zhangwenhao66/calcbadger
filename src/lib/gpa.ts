/**
 * GPA on a 4.0 scale, unweighted and weighted.
 *
 * Grade-to-points table: the standard 12-step conversion published by College
 * Board's BigFuture ("How to Calculate Your GPA on a 4.0 Scale",
 * bigfuture.collegeboard.org/plan-for-college/get-started/how-to-calculate-gpa-4.0-scale),
 * the same chart reproduced by many high school guidance offices. College
 * Board's own note applies here too: this is one commonly used system, and a
 * given school's registrar may round or step differently.
 *
 * Weighted level boost (Honors +0.5, AP/IB +1.0 added to the base grade
 * point before averaging) is a widely used school convention, not a single
 * official standard — schools set their own boosts, and some use a 5.0
 * scale instead of adding a fixed boost. This module implements the
 * additive-boost convention, the most commonly documented version.
 */

export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F';
export type Level = 'regular' | 'honors' | 'ap';

export const GRADES: readonly Grade[] = [
	'A+',
	'A',
	'A-',
	'B+',
	'B',
	'B-',
	'C+',
	'C',
	'C-',
	'D+',
	'D',
	'D-',
	'F',
];

export const LEVELS: readonly Level[] = ['regular', 'honors', 'ap'];

export const GRADE_POINTS: Readonly<Record<Grade, number>> = {
	'A+': 4.0,
	A: 4.0,
	'A-': 3.7,
	'B+': 3.3,
	B: 3.0,
	'B-': 2.7,
	'C+': 2.3,
	C: 2.0,
	'C-': 1.7,
	'D+': 1.3,
	D: 1.0,
	'D-': 0.7,
	F: 0.0,
};

export const LEVEL_BOOST: Readonly<Record<Level, number>> = {
	regular: 0,
	honors: 0.5,
	ap: 1.0,
};

export interface Course {
	grade: Grade;
	credits: number;
	level: Level;
}

export interface GpaResult {
	gpa: number;
	qualityPoints: number;
	totalCredits: number;
}

/** Grade points for one course: base points, plus the level boost when `weighted`. */
export function pointsForCourse(course: Pick<Course, 'grade' | 'level'>, weighted: boolean): number {
	const base = GRADE_POINTS[course.grade];
	return weighted ? base + LEVEL_BOOST[course.level] : base;
}

/**
 * Credit-weighted average of grade points across courses. Courses with
 * non-finite or non-positive credits are excluded (a course you haven't
 * assigned credit hours to shouldn't silently count as one credit).
 * Returns null when no course has positive credits (nothing to average).
 */
export function computeGpa(courses: readonly Course[], weighted: boolean): GpaResult | null {
	const valid = courses.filter((c) => Number.isFinite(c.credits) && c.credits > 0);
	const totalCredits = valid.reduce((sum, c) => sum + c.credits, 0);
	if (totalCredits <= 0) return null;
	const qualityPoints = valid.reduce((sum, c) => sum + pointsForCourse(c, weighted) * c.credits, 0);
	return { gpa: qualityPoints / totalCredits, qualityPoints, totalCredits };
}
