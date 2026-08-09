/**
 * Restaurant tip math: back out the pre-tax subtotal from a tax-inclusive
 * receipt total, compute the tip both ways (pre-tax vs. post-tax base), and
 * split the resulting total across a party with an optional round-up.
 *
 * Tip-base convention: etiquette authorities (the Emily Post Institute,
 * emilypost.com/advice/general-tipping-guide) hold that tipping on the
 * pre-tax subtotal is the correct standard, since sales tax is a government
 * charge unrelated to the service, not a discretionary amount. This module
 * computes both bases so the page can show the actual dollar gap rather
 * than assert one is "right" without evidence.
 *
 * Percent-by-service figures used in the reference table (sit-down 15-20%,
 * delivery 10-15%, bar $1-2/drink or 15-20%, rideshare 15-20% + $1/bag,
 * salon/spa 15-20%, hotel housekeeping $2-5/day) are Emily Post Institute
 * conventions, not a physical law — there is no regulatory minimum tip
 * percentage in the US the way there is a minimum wage.
 */

export type TipBase = 'pretax' | 'total';

/** Recovers the pre-tax subtotal from a tax-inclusive total. taxRatePercent=0 returns total unchanged. */
export function preTaxSubtotal(total: number, taxRatePercent: number): number {
	return total / (1 + taxRatePercent / 100);
}

/** Tax portion embedded in a tax-inclusive total. */
export function taxAmount(total: number, taxRatePercent: number): number {
	return total - preTaxSubtotal(total, taxRatePercent);
}

/** tip = base * (tipPercent / 100). */
export function tipAmount(base: number, tipPercent: number): number {
	return base * (tipPercent / 100);
}

export interface TipResult {
	preTaxSubtotal: number;
	taxAmount: number;
	/** Tip if calculated on the pre-tax subtotal (the etiquette-recommended base). */
	tipOnPreTax: number;
	/** Tip if calculated on the tax-inclusive total. */
	tipOnTotal: number;
	/** Whichever of the two above matches `tipBase`. */
	tip: number;
	grandTotal: number;
	/** grandTotal split evenly across numPeople; equals grandTotal when numPeople <= 1. */
	perPerson: number;
}

/**
 * `total` is the tax-inclusive amount printed on the receipt. `taxRatePercent`
 * is optional context used only to recover the pre-tax subtotal; pass 0 (or
 * omit tax entirely) when the diner doesn't know the local rate, and the two
 * tip bases collapse to the same number.
 */
export function computeTip(
	total: number,
	taxRatePercent: number,
	tipPercent: number,
	tipBase: TipBase,
	numPeople: number,
): TipResult {
	const subtotal = preTaxSubtotal(total, taxRatePercent);
	const tax = total - subtotal;
	const tipOnPreTax = tipAmount(subtotal, tipPercent);
	const tipOnTotal = tipAmount(total, tipPercent);
	const tip = tipBase === 'pretax' ? tipOnPreTax : tipOnTotal;
	const grandTotal = total + tip;
	const people = numPeople > 0 ? numPeople : 1;
	const perPerson = grandTotal / people;

	return {
		preTaxSubtotal: subtotal,
		taxAmount: tax,
		tipOnPreTax,
		tipOnTotal,
		tip,
		grandTotal,
		perPerson,
	};
}

/** Rounds a per-person amount up to the next multiple of `increment` (e.g. nearest $1 or $5). increment<=0 returns the value unchanged. */
export function roundUpPerPerson(perPerson: number, increment: number): number {
	if (increment <= 0) return perPerson;
	return Math.ceil(perPerson / increment) * increment;
}
