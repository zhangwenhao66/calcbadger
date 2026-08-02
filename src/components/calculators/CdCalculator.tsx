import { useState } from 'preact/hooks';
import { apyFromApr, cdFromApr, cdFromApy } from '../../lib/cd';

const COMPOUNDING = [
	{ label: 'Daily (365/yr)', value: 365 },
	{ label: 'Monthly', value: 12 },
	{ label: 'Quarterly', value: 4 },
	{ label: 'Semiannually', value: 2 },
	{ label: 'Annually', value: 1 },
];

const usd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export default function CdCalculator() {
	const [deposit, setDeposit] = useState('10000');
	const [rate, setRate] = useState('4.50');
	const [rateType, setRateType] = useState<'apy' | 'apr'>('apy');
	const [compounds, setCompounds] = useState(12);
	const [term, setTerm] = useState('36');
	const [termUnit, setTermUnit] = useState<'months' | 'years'>('months');

	const p = parseFloat(deposit);
	const r = parseFloat(rate) / 100;
	const t = parseFloat(term);
	const years = termUnit === 'months' ? t / 12 : t;
	const valid = Number.isFinite(p) && p >= 0 && Number.isFinite(r) && r >= 0 && Number.isFinite(years) && years > 0;

	const result = !valid
		? null
		: rateType === 'apy'
			? cdFromApy(p, r, years)
			: cdFromApr(p, r, compounds, years);

	return (
		<div class="calc">
			<div class="calc-grid">
				<label class="calc-field">
					<span class="calc-label">Deposit amount ($)</span>
					<input
						class="calc-input"
						type="number"
						inputMode="decimal"
						min="0"
						step="100"
						value={deposit}
						onInput={(e) => setDeposit((e.target as HTMLInputElement).value)}
					/>
				</label>
				<label class="calc-field">
					<span class="calc-label">Interest rate (%)</span>
					<input
						class="calc-input"
						type="number"
						inputMode="decimal"
						min="0"
						step="0.05"
						value={rate}
						onInput={(e) => setRate((e.target as HTMLInputElement).value)}
					/>
				</label>
				<label class="calc-field">
					<span class="calc-label">Rate is quoted as</span>
					<select
						class="calc-select"
						value={rateType}
						onChange={(e) => setRateType((e.target as HTMLSelectElement).value as 'apy' | 'apr')}
					>
						<option value="apy">APY (most CD ads)</option>
						<option value="apr">APR / nominal rate</option>
					</select>
				</label>
				{rateType === 'apr' && (
					<label class="calc-field">
						<span class="calc-label">Compounding</span>
						<select
							class="calc-select"
							value={compounds}
							onChange={(e) => setCompounds(Number((e.target as HTMLSelectElement).value))}
						>
							{COMPOUNDING.map((c) => (
								<option value={c.value}>{c.label}</option>
							))}
						</select>
					</label>
				)}
				<label class="calc-field">
					<span class="calc-label">Term</span>
					<input
						class="calc-input"
						type="number"
						inputMode="decimal"
						min="0"
						step="1"
						value={term}
						onInput={(e) => setTerm((e.target as HTMLInputElement).value)}
					/>
				</label>
				<label class="calc-field">
					<span class="calc-label">Term unit</span>
					<select
						class="calc-select"
						value={termUnit}
						onChange={(e) => setTermUnit((e.target as HTMLSelectElement).value as 'months' | 'years')}
					>
						<option value="months">Months</option>
						<option value="years">Years</option>
					</select>
				</label>
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Balance at maturity</p>
						<p class="calc-result-value primary">{usd.format(result.finalBalance)}</p>
					</div>
					<div>
						<p class="calc-result-label">Total interest earned</p>
						<p class="calc-result-value">{usd.format(result.interestEarned)}</p>
					</div>
					<div>
						<p class="calc-result-label">{rateType === 'apr' ? 'Effective APY' : 'APY'}</p>
						<p class="calc-result-value">{(result.apy * 100).toFixed(3)}%</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter a deposit, rate and term to see the result.</p>
			)}

			<p class="calc-note">
				Assumes interest stays in the CD until maturity, with no early withdrawal. Formula: A =
				P(1&nbsp;+&nbsp;r/n)<sup>nt</sup>{rateType === 'apr' && result
					? `. At this compounding the effective APY is ${(apyFromApr(parseFloat(rate) / 100 || 0, compounds) * 100).toFixed(3)}%`
					: ''}. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
