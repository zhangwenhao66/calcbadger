import { useState } from 'preact/hooks';
import { calculateWacc, capmCostOfEquity } from '../../lib/wacc';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const pct = (n: number, digits = 3) => `${(n * 100).toFixed(digits)}%`;

export default function WaccCalculator() {
	const [equity, setEquity] = useState('600');
	const [debt, setDebt] = useState('400');
	const [equityMethod, setEquityMethod] = useState<'direct' | 'capm'>('capm');
	const [directRe, setDirectRe] = useState('10.0');
	const [riskFree, setRiskFree] = useState('4.0');
	const [beta, setBeta] = useState('1.2');
	const [marketReturn, setMarketReturn] = useState('9.0');
	const [costOfDebt, setCostOfDebt] = useState('6.0');
	const [taxRate, setTaxRate] = useState('21');

	const e = parseFloat(equity);
	const d = parseFloat(debt);
	const rd = parseFloat(costOfDebt) / 100;
	const tc = parseFloat(taxRate) / 100;
	const rf = parseFloat(riskFree) / 100;
	const b = parseFloat(beta);
	const rm = parseFloat(marketReturn) / 100;
	const reDirect = parseFloat(directRe) / 100;

	const re = equityMethod === 'capm' ? capmCostOfEquity(rf, b, rm) : reDirect;

	const inputsValid =
		Number.isFinite(e) &&
		e >= 0 &&
		Number.isFinite(d) &&
		d >= 0 &&
		e + d > 0 &&
		Number.isFinite(rd) &&
		rd >= 0 &&
		Number.isFinite(tc) &&
		tc >= 0 &&
		tc < 1 &&
		Number.isFinite(re) &&
		(equityMethod === 'direct' || (Number.isFinite(rf) && Number.isFinite(b) && Number.isFinite(rm)));

	const result = inputsValid ? calculateWacc({ equity: e, debt: d, costOfEquity: re, costOfDebt: rd, taxRate: tc }) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField label="Market value of equity" unit="$M" value={equity} onChange={setEquity} min={0} step={10} />
				<NumberField label="Market value of debt" unit="$M" value={debt} onChange={setDebt} min={0} step={10} />
				<Segmented
					label="Cost of equity"
					value={equityMethod}
					onChange={setEquityMethod}
					options={[
						{ value: 'capm', label: 'CAPM', title: 'Estimate from risk-free rate, beta, and market return' },
						{ value: 'direct', label: 'Enter directly', title: 'Type in a cost of equity you already have' },
					]}
					wide
				/>
				{equityMethod === 'capm' ? (
					<>
						<NumberField label="Risk-free rate" unit="%" value={riskFree} onChange={setRiskFree} step={0.1} />
						<NumberField label="Beta" value={beta} onChange={setBeta} step={0.05} />
						<NumberField label="Expected market return" unit="%" value={marketReturn} onChange={setMarketReturn} step={0.1} />
					</>
				) : (
					<NumberField label="Cost of equity" unit="%" value={directRe} onChange={setDirectRe} min={0} step={0.1} />
				)}
				<NumberField label="Pre-tax cost of debt" unit="%" value={costOfDebt} onChange={setCostOfDebt} min={0} step={0.1} />
				<NumberField label="Corporate tax rate" unit="%" value={taxRate} onChange={setTaxRate} min={0} max={99} step={1} />
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">WACC</p>
						<p class="calc-result-value primary">{pct(result.wacc)}</p>
					</div>
					<div>
						<p class="calc-result-label">Cost of equity (Re)</p>
						<p class="calc-result-value">{pct(re)}</p>
					</div>
					<div>
						<p class="calc-result-label">After-tax cost of debt</p>
						<p class="calc-result-value">{pct(result.afterTaxCostOfDebt)}</p>
					</div>
					<div>
						<p class="calc-result-label">Capital structure (E / D)</p>
						<p class="calc-result-value">
							{pct(result.weightEquity, 1)} / {pct(result.weightDebt, 1)}
						</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter equity, debt, and the rate inputs (equity and debt cannot both be zero) to see WACC.</p>
			)}

			<p class="calc-note">
				Formula: WACC = (E/V × Re) + (D/V × Rd × (1 − Tc)), where V = E + D and Re is the cost of equity
				{equityMethod === 'capm' ? ' from CAPM (Re = Rf + β × (Rm − Rf))' : ''}. Debt's contribution is
				scaled by (1 − Tc) because interest is tax-deductible; equity gets no equivalent deduction.
				Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
