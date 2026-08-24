import { useState } from 'preact/hooks';
import { NATURAL_LIMIT_MALE, ffmiImperial, ffmiMetric, kgToLb } from '../../lib/ffmi';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

function fmt(n: number, digits = 1): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function FfmiCalculator() {
	const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');
	const [weightKg, setWeightKg] = useState('90');
	const [heightCm, setHeightCm] = useState('180');
	const [weightLb, setWeightLb] = useState('198');
	const [heightFt, setHeightFt] = useState('5');
	const [heightIn, setHeightIn] = useState('11');
	const [bodyFat, setBodyFat] = useState('15');

	const wKg = parseFloat(weightKg);
	const hCm = parseFloat(heightCm);
	const wLb = parseFloat(weightLb);
	const ft = parseFloat(heightFt);
	const inches = parseFloat(heightIn);
	const totalIn = (Number.isFinite(ft) ? ft : 0) * 12 + (Number.isFinite(inches) ? inches : 0);
	const bf = parseFloat(bodyFat);

	const bfValid = Number.isFinite(bf) && bf > 0 && bf < 70;
	const validMetric = Number.isFinite(wKg) && wKg > 0 && Number.isFinite(hCm) && hCm > 0 && bfValid;
	const validImperial = Number.isFinite(wLb) && wLb > 0 && totalIn > 0 && bfValid;

	const result =
		units === 'metric'
			? validMetric
				? ffmiMetric(wKg, hCm, bf)
				: null
			: validImperial
				? ffmiImperial(wLb, totalIn, bf)
				: null;

	const percentOfLimit = result ? (result.normalizedFfmi / NATURAL_LIMIT_MALE) * 100 : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Units"
					value={units}
					onChange={setUnits}
					options={[
						{ value: 'imperial', label: 'US', title: 'US units: pounds, feet and inches' },
						{ value: 'metric', label: 'Metric', title: 'Metric units: kilograms and centimeters' },
					]}
				/>

				{units === 'imperial' ? (
					<>
						<NumberField label="Weight" unit="lb" value={weightLb} onChange={setWeightLb} min={0} step={1} />
						<NumberField label="Height" unit="ft" value={heightFt} onChange={setHeightFt} min={0} step={1} inputMode="numeric" />
						<NumberField label="plus" unit="in" value={heightIn} onChange={setHeightIn} min={0} max={11.9} step={0.5} />
					</>
				) : (
					<>
						<NumberField label="Weight" unit="kg" value={weightKg} onChange={setWeightKg} min={0} step={0.5} />
						<NumberField label="Height" unit="cm" value={heightCm} onChange={setHeightCm} min={0} step={1} />
					</>
				)}
				<NumberField label="Body fat" unit="%" value={bodyFat} onChange={setBodyFat} min={0} max={69.9} step={0.5} />
			</div>

			{result && percentOfLimit !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Normalized FFMI</p>
						<p class="calc-result-value primary">{fmt(result.normalizedFfmi)}</p>
					</div>
					<div>
						<p class="calc-result-label">Raw FFMI (unadjusted for height)</p>
						<p class="calc-result-value">{fmt(result.ffmi)}</p>
					</div>
					<div>
						<p class="calc-result-label">Fat-free mass</p>
						<p class="calc-result-value">
							{units === 'metric' ? `${fmt(result.ffmKg)} kg` : `${fmt(kgToLb(result.ffmKg))} lb`}
						</p>
					</div>
					<div>
						<p class="calc-result-label">Vs. documented natural limit ({NATURAL_LIMIT_MALE})</p>
						<p class="calc-result-value">{fmt(percentOfLimit, 0)}%</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter your weight, height, and an estimated body fat percentage to see your FFMI.</p>
			)}

			<p class="calc-note">
				Normalized FFMI adjusts fat-free mass index to a 1.80 m reference height so people of different
				heights compare on the same scale (Kouri et al. 1995). That study's natural (non-steroid) ceiling
				of {NATURAL_LIMIT_MALE} was measured in male athletes only — there is no equivalent peer-reviewed
				figure for women, so treat the percentage above as a male reference point, not a verdict. This
				calculator does not estimate body fat percentage; enter a value from calipers, a scale with
				bioimpedance, or a DEXA scan. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
