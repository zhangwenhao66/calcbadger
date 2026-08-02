/**
 * Straight-run stair layout math.
 *
 * Code authority: 2021 International Residential Code (IRC) R311.7.5.1 — maximum
 * riser height 7 3/4 in (196 mm) — and R311.7.5.2 — minimum tread depth 10 in
 * (254 mm). Riser count = ceil(total rise / max riser); all risers equal
 * (R311.7.5.1 limits riser variance to 3/8 in, so dividing evenly is the
 * standard method). Stringer length is the Pythagorean diagonal of total rise
 * and total run. Commercial/IBC stairs use 7 in max riser / 11 in min tread —
 * this module defaults to the residential IRC limits and takes maxRiser as a
 * parameter so either standard can be applied.
 */

export const IRC_MAX_RISER_IN = 7.75;
export const IRC_MIN_TREAD_IN = 10;

export interface StairLayout {
	riserCount: number;
	/** Height of each individual riser, inches. */
	riserHeightIn: number;
	/** Treads = risers - 1 for a standard mount (top riser lands on the deck/floor). */
	treadCount: number;
	/** Horizontal distance the stair covers, inches. */
	totalRunIn: number;
	/** Pythagorean stringer (diagonal) length, inches. */
	stringerLengthIn: number;
	/** Stair incline from horizontal, degrees. */
	angleDeg: number;
	/** true when riser height and tread depth pass the IRC residential limits. */
	ircCompliant: boolean;
}

export function stairLayout(
	totalRiseIn: number,
	treadDepthIn: number = IRC_MIN_TREAD_IN,
	maxRiserIn: number = IRC_MAX_RISER_IN,
): StairLayout {
	if (totalRiseIn <= 0 || treadDepthIn <= 0 || maxRiserIn <= 0) {
		throw new RangeError('rise, tread depth and max riser must all be positive');
	}
	const riserCount = Math.max(1, Math.ceil(totalRiseIn / maxRiserIn));
	const riserHeightIn = totalRiseIn / riserCount;
	const treadCount = riserCount - 1;
	const totalRunIn = treadCount * treadDepthIn;
	const stringerLengthIn = Math.sqrt(totalRiseIn * totalRiseIn + totalRunIn * totalRunIn);
	const angleDeg =
		totalRunIn === 0 ? 90 : (Math.atan(totalRiseIn / totalRunIn) * 180) / Math.PI;
	return {
		riserCount,
		riserHeightIn,
		treadCount,
		totalRunIn,
		stringerLengthIn,
		angleDeg,
		ircCompliant: riserHeightIn <= IRC_MAX_RISER_IN && treadDepthIn >= IRC_MIN_TREAD_IN,
	};
}

/**
 * Nearest carpenter's fraction (default 1/16 in), for tape-measure-friendly output.
 * Returns e.g. { whole: 7, num: 3, den: 4 } for 7.75.
 */
export function toNearestFraction(
	inches: number,
	denominator = 16,
): { whole: number; num: number; den: number } {
	const totalSixteenths = Math.round(inches * denominator);
	let whole = Math.floor(totalSixteenths / denominator);
	let num = totalSixteenths - whole * denominator;
	let den = denominator;
	while (num !== 0 && num % 2 === 0 && den % 2 === 0) {
		num /= 2;
		den /= 2;
	}
	if (num === 0) den = 1;
	return { whole, num, den };
}
