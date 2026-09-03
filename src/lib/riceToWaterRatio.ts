/**
 * Rice-to-water ratio: how much liquid a given amount of dry rice needs on
 * the stovetop, by rice type, plus the cooked yield that liquid produces.
 *
 * Formula authority: USA Rice (the U.S. rice industry's own trade
 * association, usarice.com) publishes a "Rice Cooking Chart" (parts liquid
 * to 1 part rice by volume, stovetop method) at
 * usarice.com/thinkrice/how-to/how-to-cook-rice, confirmed live 2026-09-03:
 *
 *   White, long grain          2      15-18 min
 *   White, medium grain        1.5    15-18 min
 *   White, short grain         1.25   15-18 min
 *   Brown, medium or long      2.25   40-45 min
 *   Parboiled                  2.25   20 min
 *   Parboiled, brown           2.25   25 min
 *   U.S. jasmine, white        2      15-18 min
 *   U.S. basmati, white        2      15-18 min
 *   U.S. arborio                4      20-30 min
 *   Wild rice                  3      40-50 min
 *
 * The same page states two general (not per-type) conversions used below:
 * "1 cup dry rice = approximately 7 ounces (weight)" and "1 cup cooked rice
 * = approximately 8 ounces (weight)." These are averages across rice types,
 * not specific to any one grain, and USA Rice discloses them that way.
 *
 * Independent second-source check (2026-09-03, curl-verified against
 * extension.purdue.edu, not just a WebSearch summary): Purdue Extension's
 * "All About Cooking Rice" gives long-grain white rice as 1.75-2 cups
 * liquid per cup of rice (USA Rice's 2:1 sits inside that range) and brown
 * or converted rice as 2-2.5 cups (USA Rice's 2.25:1 sits in the middle).
 * Purdue groups medium and short grain together at 1.5 cups, while USA
 * Rice gives short grain its own lower 1.25:1 figure; that one gap is a
 * real, disclosed variance (see the page copy), not an error in either
 * source. Different institutions' stovetop testing lands in a similar but
 * not identical range, which is normal for a
 * cooking ratio rather than a fixed physical constant.
 */

export type RiceType =
	| 'white-long'
	| 'white-medium'
	| 'white-short'
	| 'brown'
	| 'parboiled'
	| 'parboiled-brown'
	| 'jasmine'
	| 'basmati'
	| 'arborio'
	| 'wild';

export interface RiceTypeInfo {
	label: string;
	/** Parts liquid to 1 part rice, by volume. */
	ratio: number;
	cookTime: string;
}

export const RICE_TYPES: Record<RiceType, RiceTypeInfo> = {
	'white-long': { label: 'White rice, long grain', ratio: 2, cookTime: '15-18 min' },
	'white-medium': { label: 'White rice, medium grain', ratio: 1.5, cookTime: '15-18 min' },
	'white-short': { label: 'White rice, short grain', ratio: 1.25, cookTime: '15-18 min' },
	brown: { label: 'Brown rice, medium or long grain', ratio: 2.25, cookTime: '40-45 min' },
	parboiled: { label: 'Parboiled (converted) white rice', ratio: 2.25, cookTime: '20 min' },
	'parboiled-brown': { label: 'Parboiled brown rice', ratio: 2.25, cookTime: '25 min' },
	jasmine: { label: 'U.S. jasmine, white', ratio: 2, cookTime: '15-18 min' },
	basmati: { label: 'U.S. basmati, white', ratio: 2, cookTime: '15-18 min' },
	arborio: { label: 'U.S. arborio', ratio: 4, cookTime: '20-30 min' },
	wild: { label: 'Wild rice', ratio: 3, cookTime: '40-50 min' },
};

export const RICE_TYPE_ORDER: RiceType[] = [
	'white-long',
	'jasmine',
	'basmati',
	'white-medium',
	'white-short',
	'brown',
	'parboiled',
	'parboiled-brown',
	'arborio',
	'wild',
];

export type RiceAmountUnit = 'cups' | 'grams';

/** USA Rice: "1 cup dry rice = approximately 7 ounces (weight)" (a general average, not per rice type). */
const OZ_PER_CUP_DRY_RICE = 7;
const GRAMS_PER_OZ = 28.3495;
const GRAMS_PER_CUP_DRY_RICE = OZ_PER_CUP_DRY_RICE * GRAMS_PER_OZ; // ~198.45 g

/** USA Rice: "1 cup cooked rice = approximately 8 ounces (weight)" (general average, not per rice type). */
const OZ_PER_CUP_COOKED_RICE = 8;

const ML_PER_CUP = 236.588; // US customary cup, standard conversion (not rice-specific)

export interface RiceWaterResult {
	riceCups: number;
	waterCups: number;
	waterMl: number;
	/** Estimated cooked volume: dry rice cups + water cups (see module note below). */
	cookedCups: number;
	cookedOz: number;
	cookTime: string;
	ratio: number;
}

/**
 * Cooked-yield estimate: USA Rice states dry rice "typically triples in
 * volume when cooked," and explains that figure as following from the 2:1
 * ratio (1 part rice + 2 parts liquid = 3 parts cooked rice). This module
 * generalizes that same relationship (cooked volume roughly equals dry rice
 * volume plus liquid volume) to every ratio in the chart, since it is the
 * liquid being absorbed into the grain that accounts for the added volume.
 * For the 2:1 types this reduces exactly to USA Rice's stated tripling. For
 * the other ratios (1.25:1 through 4:1) it is this module's own derived
 * estimate, not an independently sourced per-type yield figure: what comes
 * out of the pot will vary a little from minor evaporation and how tightly
 * the grain packs, so treat it as a planning figure rather than an exact
 * promise.
 */
export function computeRiceWater(
	amount: number,
	unit: RiceAmountUnit,
	riceType: RiceType,
): RiceWaterResult | null {
	if (!Number.isFinite(amount) || amount <= 0) return null;

	const info = RICE_TYPES[riceType];
	const riceCups = unit === 'cups' ? amount : amount / GRAMS_PER_CUP_DRY_RICE;
	if (!Number.isFinite(riceCups) || riceCups <= 0) return null;

	const waterCups = riceCups * info.ratio;
	const waterMl = waterCups * ML_PER_CUP;
	const cookedCups = riceCups + waterCups;
	const cookedOz = cookedCups * OZ_PER_CUP_COOKED_RICE;

	return {
		riceCups: roundSig(riceCups),
		waterCups: roundSig(waterCups),
		waterMl: roundSig(waterMl),
		cookedCups: roundSig(cookedCups),
		cookedOz: roundSig(cookedOz),
		cookTime: info.cookTime,
		ratio: info.ratio,
	};
}

/** Rounds to a sane number of significant figures for kitchen-quantity display. */
export function roundSig(n: number, sig = 4): number {
	if (n === 0 || !Number.isFinite(n)) return n;
	return Number(n.toPrecision(sig));
}

export function gramsToCups(grams: number): number {
	return grams / GRAMS_PER_CUP_DRY_RICE;
}

export function cupsToGrams(cups: number): number {
	return cups * GRAMS_PER_CUP_DRY_RICE;
}
