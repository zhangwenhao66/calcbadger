import { useState } from 'preact/hooks';
import {
	bmiImperial,
	bmiMetric,
	classifyBmi,
	healthyWeightRangeKg,
	healthyWeightRangeLb,
	type Standard,
} from '../../lib/bmi';

const BADGE_CLASS: Record<string, string> = {
	underweight: 'info',
	healthy: 'ok',
	overweight: 'caution',
	obese: 'bad',
};

function fmt(n: number, digits = 1): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function BmiCalculator() {
	const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');
	const [standard, setStandard] = useState<Standard>('who');
	const [weightKg, setWeightKg] = useState('70');
	const [heightCm, setHeightCm] = useState('175');
	const [weightLb, setWeightLb] = useState('160');
	const [heightFt, setHeightFt] = useState('5');
	const [heightIn, setHeightIn] = useState('9');

	const wKg = parseFloat(weightKg);
	const hCm = parseFloat(heightCm);
	const wLb = parseFloat(weightLb);
	const ft = parseFloat(heightFt);
	const inches = parseFloat(heightIn);
	const totalIn = (Number.isFinite(ft) ? ft : 0) * 12 + (Number.isFinite(inches) ? inches : 0);

	const validMetric = Number.isFinite(wKg) && wKg > 0 && Number.isFinite(hCm) && hCm > 0;
	const validImperial = Number.isFinite(wLb) && wLb > 0 && totalIn > 0;

	const bmi =
		units === 'metric'
			? validMetric
				? bmiMetric(wKg, hCm)
				: null
			: validImperial
				? bmiImperial(wLb, totalIn)
				: null;

	const category = bmi !== null ? classifyBmi(bmi, standard) : null;
	const range =
		bmi !== null
			? units === 'metric'
				? healthyWeightRangeKg(hCm, standard)
				: healthyWeightRangeLb(totalIn, standard)
			: null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<label class="calc-field">
					<span class="calc-label">Units</span>
					<select
						class="calc-select"
						value={units}
						onChange={(e) => setUnits((e.target as HTMLSelectElement).value as 'metric' | 'imperial')}
					>
						<option value="imperial">US (lb, ft/in)</option>
						<option value="metric">Metric (kg, cm)</option>
					</select>
				</label>
				<label class="calc-field">
					<span class="calc-label">Cutoffs</span>
					<select
						class="calc-select"
						value={standard}
						onChange={(e) => setStandard((e.target as HTMLSelectElement).value as Standard)}
					>
						<option value="who">Standard (WHO / CDC)</option>
						<option value="asian">Asian population (WHO 2004)</option>
					</select>
				</label>

				{units === 'imperial' ? (
					<>
						<label class="calc-field">
							<span class="calc-label">Weight (lb)</span>
							<input
								class="calc-input"
								type="number"
								inputMode="decimal"
								min="0"
								step="1"
								value={weightLb}
								onInput={(e) => setWeightLb((e.target as HTMLInputElement).value)}
							/>
						</label>
						<label class="calc-field">
							<span class="calc-label">Height — feet</span>
							<input
								class="calc-input"
								type="number"
								inputMode="numeric"
								min="0"
								step="1"
								value={heightFt}
								onInput={(e) => setHeightFt((e.target as HTMLInputElement).value)}
							/>
						</label>
						<label class="calc-field">
							<span class="calc-label">Height — inches</span>
							<input
								class="calc-input"
								type="number"
								inputMode="decimal"
								min="0"
								max="11.9"
								step="0.5"
								value={heightIn}
								onInput={(e) => setHeightIn((e.target as HTMLInputElement).value)}
							/>
						</label>
					</>
				) : (
					<>
						<label class="calc-field">
							<span class="calc-label">Weight (kg)</span>
							<input
								class="calc-input"
								type="number"
								inputMode="decimal"
								min="0"
								step="0.5"
								value={weightKg}
								onInput={(e) => setWeightKg((e.target as HTMLInputElement).value)}
							/>
						</label>
						<label class="calc-field">
							<span class="calc-label">Height (cm)</span>
							<input
								class="calc-input"
								type="number"
								inputMode="decimal"
								min="0"
								step="1"
								value={heightCm}
								onInput={(e) => setHeightCm((e.target as HTMLInputElement).value)}
							/>
						</label>
					</>
				)}
			</div>

			{bmi !== null && category && range ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">BMI</p>
						<p class="calc-result-value primary">{fmt(bmi)}</p>
					</div>
					<div>
						<p class="calc-result-label">Category</p>
						<p class="calc-result-value">
							<span class={`calc-badge ${BADGE_CLASS[category.className]}`}>{category.label}</span>
						</p>
					</div>
					<div>
						<p class="calc-result-label">Healthy-weight range at this height</p>
						<p class="calc-result-value">
							{units === 'metric'
								? `${fmt(range.min)}–${fmt(range.max)} kg`
								: `${fmt(range.min)}–${fmt(range.max)} lb`}
						</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter your weight and height to see your BMI.</p>
			)}

			<p class="calc-note">
				BMI is weight ÷ height² and does not distinguish fat from muscle; it is a screening
				number, not a diagnosis, and CDC's adult categories apply from age 20 up (not to
				children, pregnant women, or highly muscular adults). Calculations run in your browser;
				nothing you type is sent anywhere.
			</p>
		</div>
	);
}
