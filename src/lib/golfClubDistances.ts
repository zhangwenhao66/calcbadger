/**
 * Golf club distance chart, personalized by scaling a published baseline
 * table against one distance the golfer already knows.
 *
 * Data authority: the four skill-tier columns (Beginner/Average/Good/Tour)
 * are the total-distance figures reported consistently across TrackMan-
 * sourced golf-instruction publishers (PlayBetter, MyGolfSpy, GolfSidekick,
 * BruceBolt) for driver clubhead speeds of roughly 80/90/100/114 mph. The
 * Tour column matches TrackMan's own published PGA Tour averages (driver
 * carry ~282 yd at ~114 mph clubhead speed); the Beginner/Average/Good
 * columns are the mid-range figures those same publishers converge on for
 * amateur clubhead-speed brackets. Scaling every other club by the ratio of
 * a golfer's own known driver distance to the tier baseline is the same
 * "distance efficiency" logic golf-fitting sources use when they describe a
 * player's distances as roughly proportional to swing speed.
 */

export type SkillLevel = 'beginner' | 'average' | 'good' | 'tour';

export type ClubKey =
	| 'driver'
	| 'wood3'
	| 'iron5'
	| 'iron7'
	| 'iron9'
	| 'pw'
	| 'gw'
	| 'sw'
	| 'lw';

export const CLUB_LABELS: Record<ClubKey, string> = {
	driver: 'Driver',
	wood3: '3-Wood',
	iron5: '5-Iron',
	iron7: '7-Iron',
	iron9: '9-Iron',
	pw: 'Pitching Wedge',
	gw: 'Gap Wedge',
	sw: 'Sand Wedge',
	lw: 'Lob Wedge',
};

/** Bag order, longest club first — also the order gaps are checked in. */
export const CLUB_ORDER: ClubKey[] = ['driver', 'wood3', 'iron5', 'iron7', 'iron9', 'pw', 'gw', 'sw', 'lw'];

export const SKILL_LABELS: Record<SkillLevel, string> = {
	beginner: 'Beginner (~80 mph swing)',
	average: 'Average (~90 mph swing)',
	good: 'Good (~100 mph swing)',
	tour: 'Tour (~114 mph swing)',
};

/** Total distance in yards, no wind, sea level. See module doc for sourcing. */
export const BASELINE_DISTANCES: Record<SkillLevel, Record<ClubKey, number>> = {
	beginner: { driver: 190, wood3: 170, iron5: 125, iron7: 105, iron9: 85, pw: 75, gw: 65, sw: 55, lw: 40 },
	average: { driver: 230, wood3: 205, iron5: 160, iron7: 140, iron9: 120, pw: 110, gw: 95, sw: 80, lw: 65 },
	good: { driver: 260, wood3: 230, iron5: 185, iron7: 160, iron9: 135, pw: 125, gw: 115, sw: 100, lw: 85 },
	tour: { driver: 282, wood3: 243, iron5: 205, iron7: 176, iron9: 148, pw: 142, gw: 126, sw: 104, lw: 88 },
};

/** How far a personalized distance may drift from the tier baseline before the scale is suspect (not a real bag, a typo). */
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.8;

/**
 * Ratio of a golfer's own known driver distance to the tier's baseline
 * driver distance, clamped to a plausible range. Returns 1 (no change) for
 * a missing/non-finite/non-positive input.
 */
export function driverScaleFactor(tier: SkillLevel, knownDriverYards: number | null | undefined): number {
	if (knownDriverYards == null || !Number.isFinite(knownDriverYards) || knownDriverYards <= 0) return 1;
	const baseline = BASELINE_DISTANCES[tier].driver;
	const raw = knownDriverYards / baseline;
	return Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
}

export type DistanceTable = Record<ClubKey, number>;

/**
 * Every club's distance scaled by the same factor as the driver, rounded to
 * the nearest yard. With no known driver distance (factor 1) this returns
 * the tier baseline unchanged.
 */
export function personalizedDistances(tier: SkillLevel, knownDriverYards: number | null | undefined): DistanceTable {
	const factor = driverScaleFactor(tier, knownDriverYards);
	const baseline = BASELINE_DISTANCES[tier];
	const out = {} as DistanceTable;
	for (const club of CLUB_ORDER) {
		out[club] = Math.round(baseline[club] * factor);
	}
	return out;
}

export interface ClubGap {
	from: ClubKey;
	to: ClubKey;
	yards: number;
}

/**
 * Yard gap between each consecutive pair of clubs in this table, in bag
 * order. Purely observational — this table only carries 9 anchor clubs
 * (no 4/6/8-iron or hybrid), so a wide gap here often just means the
 * golfer's actual bag has a club in between that isn't listed, not that
 * one is missing. No "too wide/too tight" judgment is made from this alone.
 */
export function clubGaps(distances: DistanceTable): ClubGap[] {
	const gaps: ClubGap[] = [];
	for (let i = 0; i < CLUB_ORDER.length - 1; i++) {
		const from = CLUB_ORDER[i]!;
		const to = CLUB_ORDER[i + 1]!;
		gaps.push({ from, to, yards: distances[from] - distances[to] });
	}
	return gaps;
}
