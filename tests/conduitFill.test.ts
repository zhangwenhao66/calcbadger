import { describe, expect, it } from 'vitest';
import {
	AWG_SIZES,
	allowedFillFraction,
	computeConduitFill,
	CONDUIT_AREA_100PCT,
	suggestNextSize,
	THHN_AREA_SQIN,
	totalConductorArea,
	totalWireCount,
	TRADE_SIZES,
	type WireEntry,
} from '../src/lib/conduitFill';

/**
 * Expected values hand-computed with an independent Python script
 * (2026-08-20) before writing this test file: area = sum(THHN[awg]*count),
 * allowed = conduitArea100pct * fillFraction(wireCount, isNipple),
 * fillPercent = area / conduitArea100pct * 100.
 *
 * Source data cross-check: NEC 2011 Chapter 9 Table 4 (conduit areas) and
 * Table 5 (THHN/THWN/THWN-2 conductor areas), verified against NEC's own
 * Annex C Table C.1 "Maximum Number of Conductors ... in EMT" -- see T2/T3
 * below, which reproduce Table C.1's published max-conductor-count entries
 * exactly (10 AWG THHN in 3/4in EMT: Table C.1 lists a max of 10 wires; 10
 * passes here and 11 fails).
 */

describe('NEC Table 4 / Table 5 source data', () => {
	it('EMT areas match the published Chapter 9 Table 4 values', () => {
		expect(CONDUIT_AREA_100PCT.emt['1/2']).toBeCloseTo(0.304, 10);
		expect(CONDUIT_AREA_100PCT.emt['3/4']).toBeCloseTo(0.533, 10);
		expect(CONDUIT_AREA_100PCT.emt['1']).toBeCloseTo(0.864, 10);
		expect(CONDUIT_AREA_100PCT.emt['2']).toBeCloseTo(3.356, 10);
		expect(CONDUIT_AREA_100PCT.emt['4']).toBeCloseTo(14.753, 10);
	});

	it('THHN/THWN-2 areas match the published Chapter 9 Table 5 values', () => {
		expect(THHN_AREA_SQIN['12']).toBeCloseTo(0.0133, 10);
		expect(THHN_AREA_SQIN['10']).toBeCloseTo(0.0211, 10);
		expect(THHN_AREA_SQIN['4/0']).toBeCloseTo(0.3237, 10);
	});

	it('every AWG size has a defined area and every trade size a defined area for all four conduit types', () => {
		for (const awg of AWG_SIZES) expect(THHN_AREA_SQIN[awg]).toBeGreaterThan(0);
		for (const type of ['emt', 'imc', 'rmc', 'pvc40'] as const) {
			for (const size of TRADE_SIZES) expect(CONDUIT_AREA_100PCT[type][size]).toBeGreaterThan(0);
		}
	});
});

describe('allowedFillFraction', () => {
	it('is 53% for exactly one conductor', () => {
		expect(allowedFillFraction(1, false)).toBeCloseTo(0.53, 10);
	});
	it('is 31% for exactly two conductors', () => {
		expect(allowedFillFraction(2, false)).toBeCloseTo(0.31, 10);
	});
	it('is 40% for three or more conductors', () => {
		expect(allowedFillFraction(3, false)).toBeCloseTo(0.4, 10);
		expect(allowedFillFraction(11, false)).toBeCloseTo(0.4, 10);
	});
	it('is a flat 60% for a nipple regardless of conductor count', () => {
		expect(allowedFillFraction(1, true)).toBeCloseTo(0.6, 10);
		expect(allowedFillFraction(3, true)).toBeCloseTo(0.6, 10);
		expect(allowedFillFraction(20, true)).toBeCloseTo(0.6, 10);
	});
});

describe('totalWireCount / totalConductorArea', () => {
	it('excludes non-positive or non-finite counts', () => {
		const wires: WireEntry[] = [
			{ awg: '12', count: 3 },
			{ awg: '10', count: 0 },
			{ awg: '8', count: -1 },
			{ awg: '6', count: NaN },
		];
		expect(totalWireCount(wires)).toBe(3);
		expect(totalConductorArea(wires)).toBeCloseTo(3 * 0.0133, 10);
	});
});

describe('computeConduitFill', () => {
	it('T1: 3x 12 AWG THHN in 1/2in EMT — well under the 40% (3-wire) limit', () => {
		const r = computeConduitFill('emt', '1/2', [{ awg: '12', count: 3 }], false);
		expect(r.wireCount).toBe(3);
		expect(r.conductorAreaSqIn).toBeCloseTo(0.0399, 10);
		expect(r.allowedAreaSqIn).toBeCloseTo(0.1216, 10);
		expect(r.fillPercent).toBeCloseTo(13.125, 3);
		expect(r.passes).toBe(true);
	});

	it('T2: 10x 10 AWG THHN in 3/4in EMT — passes, matching NEC Annex C Table C.1 max of 10', () => {
		const r = computeConduitFill('emt', '3/4', [{ awg: '10', count: 10 }], false);
		expect(r.conductorAreaSqIn).toBeCloseTo(0.211, 10);
		expect(r.allowedAreaSqIn).toBeCloseTo(0.2132, 10);
		expect(r.fillPercent).toBeCloseTo(39.5872, 3);
		expect(r.passes).toBe(true);
	});

	it('T3: 11x 10 AWG THHN in 3/4in EMT — fails, one conductor over Table C.1 max', () => {
		const r = computeConduitFill('emt', '3/4', [{ awg: '10', count: 11 }], false);
		expect(r.conductorAreaSqIn).toBeCloseTo(0.2321, 10);
		expect(r.fillPercent).toBeCloseTo(43.546, 3);
		expect(r.passes).toBe(false);
	});

	it('T4: a single 4 AWG THHN in 1in EMT uses the 53% one-conductor rule', () => {
		const r = computeConduitFill('emt', '1', [{ awg: '4', count: 1 }], false);
		expect(r.fillFraction).toBeCloseTo(0.53, 10);
		expect(r.allowedAreaSqIn).toBeCloseTo(0.45792, 5);
		expect(r.fillPercent).toBeCloseTo(9.537, 3);
		expect(r.passes).toBe(true);
	});

	it('T5: two 2 AWG THHN in 3/4in EMT fails under the stricter 31% two-conductor rule', () => {
		const r = computeConduitFill('emt', '3/4', [{ awg: '2', count: 2 }], false);
		expect(r.fillFraction).toBeCloseTo(0.31, 10);
		expect(r.allowedAreaSqIn).toBeCloseTo(0.16523, 5);
		expect(r.fillPercent).toBeCloseTo(43.4522, 3);
		expect(r.passes).toBe(false);
	});

	it('T6: the same 3x 12 AWG in a 1/2in EMT nipple passes under the flat 60% nipple rule', () => {
		const r = computeConduitFill('emt', '1/2', [{ awg: '12', count: 3 }], true);
		expect(r.fillFraction).toBeCloseTo(0.6, 10);
		expect(r.allowedAreaSqIn).toBeCloseTo(0.1824, 10);
		expect(r.passes).toBe(true);
	});

	it('T7: mixed gauges (4x 12 AWG + 2x 10 AWG) in 1in PVC Schedule 40', () => {
		const r = computeConduitFill(
			'pvc40',
			'1',
			[
				{ awg: '12', count: 4 },
				{ awg: '10', count: 2 },
			],
			false,
		);
		expect(r.wireCount).toBe(6);
		expect(r.conductorAreaSqIn).toBeCloseTo(0.0954, 10);
		expect(r.allowedAreaSqIn).toBeCloseTo(0.3328, 10);
		expect(r.fillPercent).toBeCloseTo(11.4663, 3);
		expect(r.passes).toBe(true);
	});

	it('with zero total conductors, passes is false rather than a vacuous true', () => {
		const r = computeConduitFill('emt', '1', [{ awg: '12', count: 0 }], false);
		expect(r.wireCount).toBe(0);
		expect(r.passes).toBe(false);
	});
});

describe('suggestNextSize', () => {
	it('finds the smallest EMT trade size where 11x 10 AWG THHN passes (1in)', () => {
		expect(suggestNextSize('emt', [{ awg: '10', count: 11 }], false)).toBe('1');
	});

	it('returns the same size already passing, not a larger one', () => {
		expect(suggestNextSize('emt', [{ awg: '12', count: 3 }], false)).toBe('1/2');
	});

	it('returns null when nothing up to 4in passes (absurdly oversized request)', () => {
		expect(suggestNextSize('emt', [{ awg: '4/0', count: 500 }], false)).toBeNull();
	});
});
