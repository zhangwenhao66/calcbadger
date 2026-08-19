/**
 * Markup and margin math: given any two of {cost, selling price, markup %},
 * solve for the third, and always report the corresponding margin % and
 * profit alongside it.
 *
 * Markup and margin are both "profit as a percentage," but they divide by
 * different bases: markup uses cost, margin uses selling price. The same
 * dollar profit produces two different-looking percentages. This is a
 * standard distinction in cost accounting, not a house convention: see
 * Corporate Finance Institute, "Markup" (corporatefinanceinstitute.com) and
 * AccountingTools, "The difference between margin and markup"
 * (accountingtools.com). Markup% = (price - cost) / cost * 100. Margin% =
 * (price - cost) / price * 100, the same profit dollar divided by the
 * larger of the two numbers, so margin% is always lower than markup% for a
 * profitable sale.
 */

export interface MarkupResult {
	cost: number;
	sellingPrice: number;
	profit: number;
	markupPercent: number;
	marginPercent: number;
}

function fromCostAndProfit(cost: number, sellingPrice: number): MarkupResult {
	const profit = sellingPrice - cost;
	return {
		cost,
		sellingPrice,
		profit,
		markupPercent: cost !== 0 ? (profit / cost) * 100 : NaN,
		marginPercent: sellingPrice !== 0 ? (profit / sellingPrice) * 100 : NaN,
	};
}

/** sellingPrice = cost * (1 + markupPercent / 100). */
export function sellingPriceFromCostAndMarkup(cost: number, markupPercent: number): MarkupResult {
	const sellingPrice = cost * (1 + markupPercent / 100);
	return fromCostAndProfit(cost, sellingPrice);
}

/**
 * cost = sellingPrice / (1 + markupPercent / 100).
 * Returns null when markupPercent = -100 (a $0 selling price is consistent
 * with any cost, so there is no unique answer).
 */
export function costFromPriceAndMarkup(sellingPrice: number, markupPercent: number): MarkupResult | null {
	const denominator = 1 + markupPercent / 100;
	if (denominator === 0) return null;
	const cost = sellingPrice / denominator;
	return fromCostAndProfit(cost, sellingPrice);
}

/**
 * Solves markup % (and margin %) from a known cost and selling price.
 * Returns null when cost = 0 (markup is undefined relative to a $0 cost).
 */
export function markupFromCostAndPrice(cost: number, sellingPrice: number): MarkupResult | null {
	if (cost === 0) return null;
	return fromCostAndProfit(cost, sellingPrice);
}

/** margin% = markup% / (1 + markup% / 100). Returns null when markupPercent = -100. */
export function marginPercentFromMarkupPercent(markupPercent: number): number | null {
	const denominator = 1 + markupPercent / 100;
	if (denominator === 0) return null;
	return markupPercent / denominator;
}

/** markup% = margin% / (1 - margin% / 100). Returns null when marginPercent = 100 (a $0 cost has no finite markup %). */
export function markupPercentFromMarginPercent(marginPercent: number): number | null {
	const denominator = 1 - marginPercent / 100;
	if (denominator === 0) return null;
	return marginPercent / denominator;
}
