/**
 * Weighted average cost of capital.
 *
 * Formula authority: WACC = (E/V × Re) + (D/V × Rd × (1 - Tc)), where Re is the
 * cost of equity and Rd is the pre-tax cost of debt, as documented in Aswath
 * Damodaran's (NYU Stern) corporate-finance valuation notes and standard
 * corporate finance texts. Cost of equity via CAPM — Re = Rf + β(Rm − Rf) —
 * follows the same source's "Models of Risk and Return" section. Interest is
 * tax-deductible, so debt's contribution is scaled by (1 − Tc); equity has no
 * equivalent deduction.
 */

/** CAPM: Re = Rf + β(Rm − Rf). All rates are decimals (0.05 = 5%). */
export function capmCostOfEquity(riskFreeRate: number, beta: number, marketReturn: number): number {
	return riskFreeRate + beta * (marketReturn - riskFreeRate);
}

/** Interest is tax-deductible: after-tax cost of debt = Rd × (1 − Tc). */
export function afterTaxCostOfDebt(costOfDebt: number, taxRate: number): number {
	return costOfDebt * (1 - taxRate);
}

export interface WaccWeights {
	weightEquity: number;
	weightDebt: number;
}

/** E/V and D/V, where V = E + D (market values, not book values). */
export function waccWeights(equity: number, debt: number): WaccWeights {
	const total = equity + debt;
	return { weightEquity: equity / total, weightDebt: debt / total };
}

export interface WaccInput {
	equity: number;
	debt: number;
	costOfEquity: number;
	costOfDebt: number;
	taxRate: number;
}

export interface WaccResult extends WaccWeights {
	afterTaxCostOfDebt: number;
	wacc: number;
}

export function calculateWacc(input: WaccInput): WaccResult {
	const { weightEquity, weightDebt } = waccWeights(input.equity, input.debt);
	const atrd = afterTaxCostOfDebt(input.costOfDebt, input.taxRate);
	const wacc = weightEquity * input.costOfEquity + weightDebt * atrd;
	return { weightEquity, weightDebt, afterTaxCostOfDebt: atrd, wacc };
}
