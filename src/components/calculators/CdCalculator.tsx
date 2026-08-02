import { useState } from 'preact/hooks';
import { apyFromApr, cdFromApr, cdFromApy } from '../../lib/cd';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const COMPOUNDING = [
	{ value: '365', label: 'Daily (365/yr)' },
	{ value: '12', label: 'Monthly' },
	{ value: '4', label: 'Quarterly' },
	{ value: '2', label: 'Semiannually' },
	{ value: '1', label: 'Annually' },
];

const usd = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export default function CdCalculator() {
	const [deposit, setDeposit] = useState('10000');
	const [rate, setRate] = useState('4.50');
	const [rateType, setRateType] = useState<'apy' | 'apr'>('apy');
	const [compounds, setCompounds] = useState('12');
	const [term, setTerm] = useState('36');
	const [termUnit, setTermUnit] = useState<'months' | 'years'>('months');

	const p = parseFloat(deposit);
	const r = parseFloat(rate) / 100;
	const t = parseFloat(term);
	const years = termUnit === 'months' ? t / 12 : t;
	const n = Number(compounds);
	const valid =
		Number.isFinite(p) && p >= 0 && Number.isFinite(r) && r >= 0 && Number.isFinite(years) && years > 0;

	const result = !valid ? null : rateType === 'apy' ? cdFromApy(p, r, years) : cdFromApr(p, r, n, years);

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField label="Deposit amount" unit="$" value={deposit} onChange={setDeposit} min={0} step={100} />
				<NumberField label="Interest rate" unit="%" value={rate} onChange={setRate} min={0} step={0.05} />
				<Segmented
					label="Rate is quoted as"
					value={rateType}
					onChange={setRateType}
					options={[
						{ value: 'apy', label: 'APY', title: 'APY, the rate most CD ads quote' },
						{ value: 'apr', label: 'APR', title: 'APR, the nominal rate before compounding' },
					]}
				/>
				{rateType === 'apr' && (
					<Select label="Compounding" value={compounds} onChange={setCompounds} options={COMPOUNDING} />
				)}
				<NumberField label="Term" value={term} onChange={setTerm} min={0} step={1} />
				<Segmented
					label="Term unit"
					value={termUnit}
					onChange={setTermUnit}
					options={[
						{ value: 'months', label: 'Months' },
						{ value: 'years', label: 'Years' },
					]}
				/>
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
				P(1&nbsp;+&nbsp;r/n)<sup>nt</sup>
				{rateType === 'apr' && result
					? `. At this compounding the effective APY is ${(apyFromApr(parseFloat(rate) / 100 || 0, n) * 100).toFixed(3)}%`
					: ''}
				. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
