/**
 * Fixed-rate mortgage amortization math.
 *
 * Formula authority: the standard level-payment amortization formula
 * M = P[r(1+r)^n] / [(1+r)^n - 1], consistent with the actuarial method
 * for closed-end credit prescribed by Regulation Z, 12 CFR Part 1026,
 * Appendix J (Annual Percentage Rate Computations for Closed-End Credit
 * Transactions), and explained in plain language by the CFPB ("How do
 * mortgage lenders calculate monthly payments?"). r is the periodic
 * (monthly) rate as a decimal and n is the total number of monthly
 * payments.
 */

/** Monthly principal & interest payment. `annualRatePct` e.g. 6.5 for 6.5%. */
export function monthlyPrincipalInterest(
	principal: number,
	annualRatePct: number,
	termYears: number,
): number {
	const r = annualRatePct / 100 / 12;
	const n = termYears * 12;
	if (r === 0) return principal / n;
	const factor = Math.pow(1 + r, n);
	return (principal * (r * factor)) / (factor - 1);
}

/** Remaining principal balance after `paymentsMade` monthly payments. */
export function remainingBalance(
	principal: number,
	annualRatePct: number,
	termYears: number,
	paymentsMade: number,
): number {
	const r = annualRatePct / 100 / 12;
	const monthly = monthlyPrincipalInterest(principal, annualRatePct, termYears);
	if (r === 0) return principal - monthly * paymentsMade;
	const factor = Math.pow(1 + r, paymentsMade);
	return principal * factor - monthly * ((factor - 1) / r);
}

export interface MortgageInputs {
	homePrice: number;
	downPaymentPct: number;
	annualRatePct: number;
	termYears: number;
	/** Annual property tax, $. */
	annualTax?: number;
	/** Annual homeowners insurance, $. */
	annualInsurance?: number;
	/** Annual PMI, $. */
	annualPmi?: number;
	/** Monthly HOA dues, $. */
	monthlyHoa?: number;
}

export interface MortgageResult {
	loanAmount: number;
	downPaymentAmount: number;
	monthlyPI: number;
	monthlyEscrow: number;
	totalMonthlyPayment: number;
	totalInterest: number;
	totalOfPayments: number;
	/** Remaining balance at each whole year of the term (year 1 through termYears). */
	balanceByYear: { year: number; balance: number }[];
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
	const { homePrice, downPaymentPct, annualRatePct, termYears } = inputs;
	const downPaymentAmount = homePrice * (downPaymentPct / 100);
	const loanAmount = homePrice - downPaymentAmount;
	const monthlyPI = monthlyPrincipalInterest(loanAmount, annualRatePct, termYears);
	const monthlyEscrow =
		(inputs.annualTax ?? 0) / 12 + (inputs.annualInsurance ?? 0) / 12 + (inputs.annualPmi ?? 0) / 12 + (inputs.monthlyHoa ?? 0);
	const totalOfPayments = monthlyPI * termYears * 12;
	const totalInterest = totalOfPayments - loanAmount;

	const balanceByYear: { year: number; balance: number }[] = [];
	for (let year = 1; year <= termYears; year++) {
		const balance = Math.max(0, remainingBalance(loanAmount, annualRatePct, termYears, year * 12));
		balanceByYear.push({ year, balance });
	}

	return {
		loanAmount,
		downPaymentAmount,
		monthlyPI,
		monthlyEscrow,
		totalMonthlyPayment: monthlyPI + monthlyEscrow,
		totalInterest,
		totalOfPayments,
		balanceByYear,
	};
}
