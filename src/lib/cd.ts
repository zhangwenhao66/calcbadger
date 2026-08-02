/**
 * Certificate of deposit (CD) math.
 *
 * Formula authority: the standard compound-interest formula A = P(1 + r/n)^(nt),
 * as published by the U.S. SEC's investor.gov ("Compound Interest Calculator"
 * methodology) and any finance textbook. APY definition follows 12 CFR Part 1030
 * (Regulation DD), Appendix A: APY = (1 + r/n)^n - 1 for an account without
 * intra-term withdrawals.
 */

/** A = P(1 + r/n)^(nt). `apr` is the nominal annual rate as a decimal (0.05 = 5%). */
export function cdFinalBalance(
	principal: number,
	apr: number,
	compoundsPerYear: number,
	years: number,
): number {
	return principal * Math.pow(1 + apr / compoundsPerYear, compoundsPerYear * years);
}

/** Regulation DD Appendix A: APY = (1 + r/n)^n - 1, as a decimal. */
export function apyFromApr(apr: number, compoundsPerYear: number): number {
	return Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1;
}

/** When the bank quotes APY directly, compounding is already baked in: A = P(1 + APY)^t. */
export function cdBalanceFromApy(principal: number, apy: number, years: number): number {
	return principal * Math.pow(1 + apy, years);
}

export interface CdResult {
	finalBalance: number;
	interestEarned: number;
	/** Effective annual yield as a decimal. */
	apy: number;
}

export function cdFromApr(
	principal: number,
	apr: number,
	compoundsPerYear: number,
	years: number,
): CdResult {
	const finalBalance = cdFinalBalance(principal, apr, compoundsPerYear, years);
	return {
		finalBalance,
		interestEarned: finalBalance - principal,
		apy: apyFromApr(apr, compoundsPerYear),
	};
}

export function cdFromApy(principal: number, apy: number, years: number): CdResult {
	const finalBalance = cdBalanceFromApy(principal, apy, years);
	return { finalBalance, interestEarned: finalBalance - principal, apy };
}
