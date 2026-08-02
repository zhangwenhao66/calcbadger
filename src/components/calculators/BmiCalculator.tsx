import { useState } from 'preact/hooks';
import {
	bmiImperial,
	bmiMetric,
	classifyBmi,
	healthyWeightRangeKg,
	healthyWeightRangeLb,
	type Standard,
} from '../../lib/bmi';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

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
				<Segmented
					label="Units"
					value={units}
					onChange={setUnits}
					options={[
						{ value: 'imperial', label: 'US', title: 'US units: pounds, feet and inches' },
						{ value: 'metric', label: 'Metric', title: 'Metric units: kilograms and centimeters' },
					]}
				/>
				<Select
					label="Cutoffs"
					value={standard}
					onChange={setStandard}
					options={[
						{ value: 'who' as Standard, label: 'Standard (WHO / CDC)' },
						{ value: 'asian' as Standard, label: 'Asian population (WHO 2004)' },
					]}
					wide
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
				BMI is weight ÷ height² and does not distinguish fat from muscle; it is a screening number,
				not a diagnosis, and CDC's adult categories apply from age 20 up (not to children, pregnant
				women, or highly muscular adults). Calculations run in your browser; nothing you type is
				sent anywhere.
			</p>
		</div>
	);
}
