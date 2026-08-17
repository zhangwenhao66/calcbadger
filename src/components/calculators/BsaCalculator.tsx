import { useState } from 'preact/hooks';
import { bsaImperial, bsaMetric, m2ToFt2, type BsaFormula } from '../../lib/bsa';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function BsaCalculator() {
	const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');
	const [formula, setFormula] = useState<BsaFormula>('mosteller');
	const [weightKg, setWeightKg] = useState('70');
	const [heightCm, setHeightCm] = useState('170');
	const [weightLb, setWeightLb] = useState('154');
	const [heightFt, setHeightFt] = useState('5');
	const [heightIn, setHeightIn] = useState('7');

	const wKg = parseFloat(weightKg);
	const hCm = parseFloat(heightCm);
	const wLb = parseFloat(weightLb);
	const ft = parseFloat(heightFt);
	const inches = parseFloat(heightIn);
	const totalIn = (Number.isFinite(ft) ? ft : 0) * 12 + (Number.isFinite(inches) ? inches : 0);

	const validMetric = Number.isFinite(wKg) && wKg > 0 && Number.isFinite(hCm) && hCm > 0;
	const validImperial = Number.isFinite(wLb) && wLb > 0 && totalIn > 0;

	const bsaM2 =
		units === 'metric'
			? validMetric
				? bsaMetric(hCm, wKg, formula)
				: null
			: validImperial
				? bsaImperial(totalIn, wLb, formula)
				: null;

	const otherFormula: BsaFormula = formula === 'dubois' ? 'mosteller' : 'dubois';
	const otherBsaM2 =
		units === 'metric'
			? validMetric
				? bsaMetric(hCm, wKg, otherFormula)
				: null
			: validImperial
				? bsaImperial(totalIn, wLb, otherFormula)
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
				<Segmented
					label="Formula"
					value={formula}
					onChange={setFormula}
					options={[
						{ value: 'mosteller', label: 'Mosteller', title: 'Mosteller (1987): sqrt(height x weight / 3600)' },
						{ value: 'dubois', label: 'Du Bois', title: 'Du Bois & Du Bois (1916): the original height/weight formula' },
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
			</div>

			{bsaM2 !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Body surface area ({formula === 'dubois' ? 'Du Bois' : 'Mosteller'})</p>
						<p class="calc-result-value primary">{fmt(bsaM2, 3)} m²</p>
					</div>
					<div>
						<p class="calc-result-label">In square feet</p>
						<p class="calc-result-value">{fmt(m2ToFt2(bsaM2), 2)} ft²</p>
					</div>
					<div>
						<p class="calc-result-label">{otherFormula === 'dubois' ? 'Du Bois' : 'Mosteller'} formula gives</p>
						<p class="calc-result-value">{otherBsaM2 !== null ? `${fmt(otherBsaM2, 3)} m²` : '—'}</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter a weight and height to see body surface area.</p>
			)}

			<p class="calc-note">
				Mosteller and Du Bois are the two most-used BSA formulas and typically agree within a few
				percent for adults of average build; they diverge more at the extremes of height and weight.
				This is a screening/reference number, not a substitute for a clinician's dosing calculation.
				Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
