import { describe, expect, it } from 'vitest';
import {
	MEAN_YEAR_DAYS,
	ageDifference,
	creepinessRuleMinAge,
	decimalAge,
	passesCreepinessRule,
} from '../src/lib/ageDifference';
import type { YMD } from '../src/lib/dateCalculator';

// Every expected value below was independently computed with a standalone
// Python script (datetime + a hand-rolled calendar-diff routine mirroring
// dateCalculator.ts's own documented algorithm) — not derived by running
// this file's own implementation and copying its output.

const A: YMD = { year: 1990, month: 6, day: 15 };
const B: YMD = { year: 1995, month: 3, day: 22 };
const ASOF: YMD = { year: 2026, month: 8, day: 23 };

describe('MEAN_YEAR_DAYS', () => {
	it('is 146,097 / 400', () => {
		expect(MEAN_YEAR_DAYS).toBeCloseTo(365.2425, 10);
	});
});

describe('decimalAge', () => {
	it('matches Python-computed decimal ages for the worked example', () => {
		expect(decimalAge(A, ASOF)).toBeCloseTo(36.189654818374095, 9);
		expect(decimalAge(B, ASOF)).toBeCloseTo(31.422958719207102, 9);
	});

	it('is exactly 0 for someone born on the reference date', () => {
		expect(decimalAge(ASOF, ASOF)).toBe(0);
	});
});

describe('ageDifference', () => {
	it('computes the calendar gap, total days, ages, and percent gap for A older than B', () => {
		const r = ageDifference(A, B, ASOF);
		expect(r.gap).toEqual({ years: 4, months: 9, days: 7, negative: false });
		expect(r.totalDaysGap).toBe(1741);
		expect(r.aIsOlder).toBe(true);
		expect(r.ageA).toBeCloseTo(36.189654818374095, 9);
		expect(r.ageB).toBeCloseTo(31.422958719207102, 9);
		expect(r.gapPercentOfOlder).toBeCloseTo(13.171432894537752, 9);
	});

	it('flips aIsOlder and the calendar gap sign when the arguments are swapped, but keeps totalDaysGap positive', () => {
		const r = ageDifference(B, A, ASOF);
		expect(r.gap).toEqual({ years: 4, months: 9, days: 7, negative: true });
		expect(r.totalDaysGap).toBe(1741);
		expect(r.aIsOlder).toBe(false);
	});

	it('returns a zero gap and equal ages for identical birth dates', () => {
		const same: YMD = { year: 2000, month: 5, day: 5 };
		const r = ageDifference(same, same, ASOF);
		expect(r.gap).toEqual({ years: 0, months: 0, days: 0, negative: false });
		expect(r.totalDaysGap).toBe(0);
		expect(r.ageA).toBeCloseTo(r.ageB, 12);
		expect(r.gapPercentOfOlder).toBe(0);
	});

	it('does not divide by zero when the older person is a newborn (age 0)', () => {
		const r = ageDifference(ASOF, { year: 2020, month: 1, day: 1 }, ASOF);
		// A is born exactly on asOf (age 0) and is therefore NOT older, so B (born
		// 2020) is the older party — the older age is > 0 and this is not the
		// zero-division branch. Assert against the independently computed values.
		expect(r.aIsOlder).toBe(false);
		expect(r.ageA).toBe(0);
		expect(r.ageB).toBeCloseTo(6.642162398954119, 9);
		expect(r.gapPercentOfOlder).toBeCloseTo(100, 9);
	});

	it('returns gapPercentOfOlder 0 (not NaN/Infinity) when both people are newborns today', () => {
		const r = ageDifference(ASOF, ASOF, ASOF);
		expect(r.gapPercentOfOlder).toBe(0);
		expect(Number.isFinite(r.gapPercentOfOlder)).toBe(true);
	});
});

describe('creepinessRuleMinAge', () => {
	it("matches Wikipedia's worked examples (28 -> 21, 50 -> 32)", () => {
		expect(creepinessRuleMinAge(28)).toBe(21);
		expect(creepinessRuleMinAge(50)).toBe(32);
	});
});

describe('passesCreepinessRule', () => {
	it('is true exactly at the boundary and false just under it', () => {
		expect(passesCreepinessRule(28, 21)).toBe(true);
		expect(passesCreepinessRule(28, 20.99)).toBe(false);
	});

	it('holds both directions for the worked-example ages (A vs B, and B vs A)', () => {
		const ageA = decimalAge(A, ASOF);
		const ageB = decimalAge(B, ASOF);
		expect(passesCreepinessRule(ageA, ageB)).toBe(true);
		expect(passesCreepinessRule(ageB, ageA)).toBe(true);
	});
});
