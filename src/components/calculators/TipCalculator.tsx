import { useState } from 'preact/hooks';
import { computeTip, roundUpPerPerson, type TipBase } from '../../lib/tip';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const TIP_PRESETS = [15, 18, 20, 25] as const;
const ROUND_OPTIONS = [
	{ value: '0', label: 'Off' },
	{ value: '1', label: 'Nearest $1' },
	{ value: '5', label: 'Nearest $5' },
];

function money(n: number): string {
	return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function TipCalculator() {
	const [total, setTotal] = useState('106.00');
	const [taxRate, setTaxRate] = useState('6');
	const [tipPreset, setTipPreset] = useState<string>('20');
	const [customTip, setCustomTip] = useState('');
	const [tipBase, setTipBase] = useState<TipBase>('pretax');
	const [people, setPeople] = useState('2');
	const [roundIncrement, setRoundIncrement] = useState('0');

	const totalNum = parseFloat(total);
	const taxRateNum = parseFloat(taxRate);
	const customTipNum = parseFloat(customTip);
	const tipPercent = customTip.trim() !== '' && Number.isFinite(customTipNum) ? customTipNum : parseFloat(tipPreset);
	const peopleNum = parseFloat(people);

	const validTotal = Number.isFinite(totalNum) && totalNum > 0;
	const validTax = Number.isFinite(taxRateNum) && taxRateNum >= 0;
	const validTip = Number.isFinite(tipPercent) && tipPercent >= 0;
	const validPeople = Number.isFinite(peopleNum) && peopleNum >= 1;
	const valid = validTotal && validTax && validTip && validPeople;

	const result = valid
		? computeTip(totalNum, taxRateNum, tipPercent, tipBase, Math.round(peopleNum))
		: null;

	const increment = parseFloat(roundIncrement);
	const roundedPerPerson = result && increment > 0 ? roundUpPerPerson(result.perPerson, increment) : null;
	const extraFromRounding =
		result && roundedPerPerson !== null ? roundedPerPerson * Math.round(peopleNum) - result.grandTotal : null;

	const tipGap = result ? Math.abs(result.tipOnTotal - result.tipOnPreTax) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField
					label="Bill total (as printed)"
					unit="$"
					value={total}
					onChange={setTotal}
					min={0}
					step={0.01}
				/>
				<NumberField
					label="Sales tax rate"
					unit="%"
					value={taxRate}
					onChange={setTaxRate}
					min={0}
					max={20}
					step={0.1}
					placeholder="0"
				/>
				<NumberField label="Split between" unit="people" value={people} onChange={setPeople} min={1} step={1} inputMode="numeric" />

				<Segmented
					label="Tip %"
					value={tipPreset}
					onChange={(v) => {
						setTipPreset(v);
						setCustomTip('');
					}}
					options={TIP_PRESETS.map((p) => ({ value: String(p), label: `${p}%` }))}
					wide
				/>
				<NumberField
					label="Custom tip %"
					unit="%"
					value={customTip}
					onChange={setCustomTip}
					min={0}
					max={100}
					step={1}
					placeholder="e.g. 22"
				/>
				<Segmented
					label="Tip on"
					value={tipBase}
					onChange={setTipBase}
					options={[
						{ value: 'pretax' as TipBase, label: 'Pre-tax subtotal', title: 'Tip calculated on the subtotal before sales tax, the etiquette-recommended base' },
						{ value: 'total' as TipBase, label: 'Total incl. tax', title: 'Tip calculated on the full tax-inclusive total' },
					]}
					wide
				/>
				<Segmented
					label="Round up per person to"
					value={roundIncrement}
					onChange={setRoundIncrement}
					options={ROUND_OPTIONS}
					wide
				/>
			</div>

			{customTip.trim() !== '' && (
				<p class="calc-note">Using custom {tipPercent || 0}% instead of the {tipPreset}% preset above.</p>
			)}

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Pre-tax subtotal</p>
						<p class="calc-result-value">{money(result.preTaxSubtotal)}</p>
					</div>
					<div>
						<p class="calc-result-label">Tip ({tipPercent}%{tipBase === 'pretax' ? ' of subtotal' : ' of total'})</p>
						<p class="calc-result-value">{money(result.tip)}</p>
					</div>
					<div>
						<p class="calc-result-label">Grand total</p>
						<p class="calc-result-value">{money(result.grandTotal)}</p>
					</div>
					<div>
						<p class="calc-result-label">Per person ({Math.round(peopleNum)})</p>
						<p class="calc-result-value primary">
							{money(roundedPerPerson !== null ? roundedPerPerson : result.perPerson)}
						</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter the bill total and party size to see the tip breakdown.</p>
			)}

			{result !== null && tipGap !== null && tipGap > 0.005 && (
				<p class="calc-note">
					Tipping on the pre-tax subtotal instead of the tax-inclusive total changes this tip by{' '}
					{money(tipGap)} ({money(result.tipOnPreTax)} vs. {money(result.tipOnTotal)}). Etiquette
					authorities recommend the pre-tax base, since sales tax is a government charge unrelated to
					the service, though the gap is usually small enough that either is accepted in practice.
				</p>
			)}

			{result !== null && roundedPerPerson !== null && extraFromRounding !== null && extraFromRounding > 0.005 && (
				<p class="calc-note">
					Rounding each share up to the nearest {roundIncrement === '1' ? '$1' : '$5'} adds{' '}
					{money(extraFromRounding)} total ({money(extraFromRounding / Math.max(1, Math.round(peopleNum)))} per
					person) on top of the calculated tip.
				</p>
			)}

			<p class="calc-note">
				Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
