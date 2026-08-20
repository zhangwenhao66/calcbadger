/**
 * NEC conduit fill: how much of a conduit's cross-section a set of conductors
 * occupies, and whether that stays under the code-allowed limit.
 *
 * Source: NFPA 70 (National Electrical Code) Chapter 9. Two tables do the
 * work --
 *
 * - Table 4 "Dimensions and Percent Area of Conduit and Tubing" gives each
 *   conduit type's internal cross-sectional area at 100% fill, by trade size.
 * - Table 5 "Dimensions of Insulated Conductors and Fixture Wires" gives each
 *   conductor's cross-sectional area (including insulation), by AWG/kcmil
 *   size and insulation type.
 * - Chapter 9, Table 1 caps how much of that 100% area conductors may
 *   actually occupy: 53% for a single conductor, 31% for exactly two, 40%
 *   for three or more. A note to Table 1 raises that to a flat 60% for a
 *   nipple (a conduit run of 24 in. or less between two enclosures), with no
 *   separate rule for the conductor count.
 *
 * Every area value below is copied from the NEC 2011 edition (Chapter 9,
 * Tables 4 and 5), cross-checked against NEC's own Annex C, Table C.1
 * ("Maximum Number of Conductors ... in Electrical Metallic Tubing") --
 * multiplying each Table C.1 conductor-count entry by the matching Table 5
 * area reproduces a number at or under the Table 4 40%-fill area for that
 * trade size, and one AWG size over always exceeds it, for every EMT
 * trade-size/AWG pair checked. Conduit and conductor cross-sectional
 * dimensions are physical manufacturing standards (ANSI C80 series for rigid
 * conduit/EMT, insulation wall thickness in UL 83 for THHN/THWN-2), not code
 * policy, and have stayed unchanged since the 2011 edition through the 2023
 * edition industry references consulted alongside it.
 *
 * Scope: this calculator covers electrical metallic tubing (EMT), rigid
 * metal conduit (RMC), intermediate metal conduit (IMC), and Schedule 40
 * rigid PVC -- the four types used in the overwhelming majority of branch
 * circuit and feeder work -- with THHN/THWN/THWN-2 conductors, the dominant
 * building-wire insulation for new work. Other conduit types (ENT, flexible
 * metal conduit, PVC Schedule 80) and other insulations (XHHW, RHW, TW) use
 * different areas and are out of scope; swap in the matching NEC Table 4/5
 * row for those combinations.
 */

export type ConduitType = 'emt' | 'imc' | 'rmc' | 'pvc40';

export const CONDUIT_TYPE_LABEL: Readonly<Record<ConduitType, string>> = {
	emt: 'EMT (electrical metallic tubing)',
	imc: 'IMC (intermediate metal conduit)',
	rmc: 'RMC (rigid metal conduit)',
	pvc40: 'PVC Schedule 40',
};

export type TradeSize = '1/2' | '3/4' | '1' | '1-1/4' | '1-1/2' | '2' | '2-1/2' | '3' | '3-1/2' | '4';

export const TRADE_SIZES: readonly TradeSize[] = [
	'1/2',
	'3/4',
	'1',
	'1-1/4',
	'1-1/2',
	'2',
	'2-1/2',
	'3',
	'3-1/2',
	'4',
];

export const TRADE_SIZE_LABEL: Readonly<Record<TradeSize, string>> = {
	'1/2': '1/2 in',
	'3/4': '3/4 in',
	'1': '1 in',
	'1-1/4': '1-1/4 in',
	'1-1/2': '1-1/2 in',
	'2': '2 in',
	'2-1/2': '2-1/2 in',
	'3': '3 in',
	'3-1/2': '3-1/2 in',
	'4': '4 in',
};

/** NEC Chapter 9, Table 4: total internal area at 100% fill, sq in. */
export const CONDUIT_AREA_100PCT: Readonly<Record<ConduitType, Record<TradeSize, number>>> = {
	emt: {
		'1/2': 0.304,
		'3/4': 0.533,
		'1': 0.864,
		'1-1/4': 1.496,
		'1-1/2': 2.036,
		'2': 3.356,
		'2-1/2': 5.858,
		'3': 8.846,
		'3-1/2': 11.545,
		'4': 14.753,
	},
	imc: {
		'1/2': 0.342,
		'3/4': 0.586,
		'1': 0.959,
		'1-1/4': 1.647,
		'1-1/2': 2.225,
		'2': 3.63,
		'2-1/2': 5.135,
		'3': 7.922,
		'3-1/2': 10.584,
		'4': 13.631,
	},
	rmc: {
		'1/2': 0.314,
		'3/4': 0.549,
		'1': 0.887,
		'1-1/4': 1.526,
		'1-1/2': 2.071,
		'2': 3.408,
		'2-1/2': 4.866,
		'3': 7.499,
		'3-1/2': 10.01,
		'4': 12.882,
	},
	pvc40: {
		'1/2': 0.285,
		'3/4': 0.508,
		'1': 0.832,
		'1-1/4': 1.453,
		'1-1/2': 1.986,
		'2': 3.291,
		'2-1/2': 4.695,
		'3': 7.268,
		'3-1/2': 9.737,
		'4': 12.554,
	},
};

export type AwgSize = '14' | '12' | '10' | '8' | '6' | '4' | '3' | '2' | '1' | '1/0' | '2/0' | '3/0' | '4/0';

export const AWG_SIZES: readonly AwgSize[] = ['14', '12', '10', '8', '6', '4', '3', '2', '1', '1/0', '2/0', '3/0', '4/0'];

export const AWG_LABEL: Readonly<Record<AwgSize, string>> = {
	'14': '14 AWG',
	'12': '12 AWG',
	'10': '10 AWG',
	'8': '8 AWG',
	'6': '6 AWG',
	'4': '4 AWG',
	'3': '3 AWG',
	'2': '2 AWG',
	'1': '1 AWG',
	'1/0': '1/0 AWG',
	'2/0': '2/0 AWG',
	'3/0': '3/0 AWG',
	'4/0': '4/0 AWG',
};

/** NEC Chapter 9, Table 5: THHN/THWN/THWN-2 conductor area, sq in. */
export const THHN_AREA_SQIN: Readonly<Record<AwgSize, number>> = {
	'14': 0.0097,
	'12': 0.0133,
	'10': 0.0211,
	'8': 0.0366,
	'6': 0.0507,
	'4': 0.0824,
	'3': 0.0973,
	'2': 0.1158,
	'1': 0.1562,
	'1/0': 0.1855,
	'2/0': 0.2223,
	'3/0': 0.2679,
	'4/0': 0.3237,
};

export interface WireEntry {
	awg: AwgSize;
	count: number;
}

/** Total conductor count across all rows (non-finite/non-positive counts excluded). */
export function totalWireCount(wires: readonly WireEntry[]): number {
	return wires.reduce((sum, w) => sum + (Number.isFinite(w.count) && w.count > 0 ? w.count : 0), 0);
}

/** Sum of each row's conductor area x count, sq in. */
export function totalConductorArea(wires: readonly WireEntry[]): number {
	return wires.reduce((sum, w) => {
		const count = Number.isFinite(w.count) && w.count > 0 ? w.count : 0;
		return sum + THHN_AREA_SQIN[w.awg] * count;
	}, 0);
}

/**
 * Chapter 9, Table 1 fill fraction: a nipple (run <= 24 in. between two
 * enclosures) gets a flat 60% regardless of conductor count. Otherwise it is
 * 53% for exactly one conductor, 31% for exactly two, 40% for three or more.
 */
export function allowedFillFraction(wireCount: number, isNipple: boolean): number {
	if (isNipple) return 0.6;
	if (wireCount <= 1) return 0.53;
	if (wireCount === 2) return 0.31;
	return 0.4;
}

export interface ConduitFillResult {
	wireCount: number;
	conductorAreaSqIn: number;
	conduitAreaSqIn: number;
	fillFraction: number;
	allowedAreaSqIn: number;
	fillPercent: number;
	passes: boolean;
}

export function computeConduitFill(
	conduitType: ConduitType,
	tradeSize: TradeSize,
	wires: readonly WireEntry[],
	isNipple: boolean,
): ConduitFillResult {
	const wireCount = totalWireCount(wires);
	const conductorAreaSqIn = totalConductorArea(wires);
	const conduitAreaSqIn = CONDUIT_AREA_100PCT[conduitType][tradeSize];
	const fillFraction = allowedFillFraction(wireCount, isNipple);
	const allowedAreaSqIn = conduitAreaSqIn * fillFraction;
	const fillPercent = conduitAreaSqIn > 0 ? (conductorAreaSqIn / conduitAreaSqIn) * 100 : 0;
	return {
		wireCount,
		conductorAreaSqIn,
		conduitAreaSqIn,
		fillFraction,
		allowedAreaSqIn,
		fillPercent,
		passes: wireCount > 0 && conductorAreaSqIn <= allowedAreaSqIn,
	};
}

/** Smallest trade size (same conduit type) at which this wire set passes, or null if none up to 4 in. */
export function suggestNextSize(
	conduitType: ConduitType,
	wires: readonly WireEntry[],
	isNipple: boolean,
): TradeSize | null {
	for (const size of TRADE_SIZES) {
		if (computeConduitFill(conduitType, size, wires, isNipple).passes) return size;
	}
	return null;
}
