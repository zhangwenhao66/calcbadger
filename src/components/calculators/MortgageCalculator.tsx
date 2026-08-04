import { useState } from 'preact/hooks';
import { calculateMortgage } from '../../lib/mortgage';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const TERMS = [
	{ value: '15', label: '15 yr' },
	{ value: '20', label: '20 yr' },
	{ value: '30', label: '30 yr' },
];

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function MortgageCalculator() {
	const [homePrice, setHomePrice] = useState('400000');
	const [downPct, setDownPct] = useState('20');
	const [rate, setRate] = useState('6.50');
	const [term, setTerm] = useState('30');
	const [tax, setTax] = useState('');
	const [insurance, setInsurance] = useState('');
	const [pmi, setPmi] = useState('');
	const [hoa, setHoa] = useState('');

	const price = parseFloat(homePrice);
	const down = parseFloat(downPct);
	const r = parseFloat(rate);
	const years = Number(term);
	const valid =
		Number.isFinite(price) && price > 0 && Number.isFinite(down) && down >= 0 && down < 100 && Number.isFinite(r) && r >= 0;

	const result = !valid
		? null
		: calculateMortgage({
				homePrice: price,
				downPaymentPct: down,
				annualRatePct: r,
				termYears: years,
				annualTax: parseFloat(tax) || 0,
				annualInsurance: parseFloat(insurance) || 0,
				annualPmi: parseFloat(pmi) || 0,
				monthlyHoa: parseFloat(hoa) || 0,
			});

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField label="Home price" unit="$" value={homePrice} onChange={setHomePrice} min={0} step={5000} />
				<NumberField label="Down payment" unit="%" value={downPct} onChange={setDownPct} min={0} max={99} step={1} />
				<NumberField label="Interest rate" unit="%" value={rate} onChange={setRate} min={0} step={0.05} />
				<Segmented label="Loan term" value={term} onChange={setTerm} options={TERMS} />
				<NumberField
					label="Property tax (optional)"
					unit="$/yr"
					value={tax}
					onChange={setTax}
					min={0}
					step={100}
					placeholder="e.g. 4800"
				/>
				<NumberField
					label="Home insurance (optional)"
					unit="$/yr"
					value={insurance}
					onChange={setInsurance}
					min={0}
					step={50}
					placeholder="e.g. 1400"
				/>
				<NumberField
					label="PMI (optional)"
					unit="$/yr"
					value={pmi}
					onChange={setPmi}
					min={0}
					step={50}
					placeholder="e.g. 1800"
				/>
				<NumberField
					label="HOA dues (optional)"
					unit="$/mo"
					value={hoa}
					onChange={setHoa}
					min={0}
					step={10}
					placeholder="e.g. 50"
				/>
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Total monthly payment</p>
						<p class="calc-result-value primary">{usd.format(result.totalMonthlyPayment)}</p>
					</div>
					<div>
						<p class="calc-result-label">Principal &amp; interest</p>
						<p class="calc-result-value">{usd.format(result.monthlyPI)}</p>
					</div>
					{result.monthlyEscrow > 0 && (
						<div>
							<p class="calc-result-label">Taxes, insurance, PMI &amp; HOA</p>
							<p class="calc-result-value">{usd.format(result.monthlyEscrow)}</p>
						</div>
					)}
					<div>
						<p class="calc-result-label">Loan amount</p>
						<p class="calc-result-value">{usd0.format(result.loanAmount)}</p>
					</div>
					<div>
						<p class="calc-result-label">Down payment</p>
						<p class="calc-result-value">{usd0.format(result.downPaymentAmount)}</p>
					</div>
					<div>
						<p class="calc-result-label">Total interest over {years} years</p>
						<p class="calc-result-value">{usd0.format(result.totalInterest)}</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter a home price, down payment and rate to see the payment.</p>
			)}

			<p class="calc-note">
				Principal &amp; interest use the standard level-payment amortization formula M =
				P[r(1+r)<sup>n</sup>]/[(1+r)<sup>n</sup>&minus;1]. Taxes, insurance, PMI and HOA are added on
				top as flat monthly amounts, not amortized — they change the total payment but not the loan
				payoff schedule. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
