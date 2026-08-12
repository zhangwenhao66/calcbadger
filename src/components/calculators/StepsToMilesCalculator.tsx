import { useState } from 'preact/hooks';
import {
	cmToInches,
	kmToSteps,
	milesToSteps,
	stepLengthInches,
	stepsToKm,
	stepsToMiles,
	type Gender,
} from '../../lib/steps';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

type Direction = 'toDistance' | 'toSteps';
type Units = 'imperial' | 'metric';

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function StepsToMilesCalculator() {
	const [direction, setDirection] = useState<Direction>('toDistance');
	const [units, setUnits] = useState<Units>('imperial');
	const [gender, setGender] = useState<Gender>('male');
	const [heightFt, setHeightFt] = useState('5');
	const [heightIn, setHeightIn] = useState('9');
	const [heightCm, setHeightCm] = useState('175');
	const [steps, setSteps] = useState('10000');
	const [distance, setDistance] = useState('5');

	const ft = parseFloat(heightFt);
	const inches = parseFloat(heightIn);
	const cm = parseFloat(heightCm);
	const heightInInches =
		units === 'imperial'
			? (Number.isFinite(ft) ? ft : 0) * 12 + (Number.isFinite(inches) ? inches : 0)
			: Number.isFinite(cm)
				? cmToInches(cm)
				: 0;

	const stepLen = heightInInches > 0 ? stepLengthInches(heightInInches, gender) : 0;
	const stepsNum = parseFloat(steps);
	const distanceNum = parseFloat(distance);

	let resultMiles: number | null = null;
	let resultKm: number | null = null;
	let resultSteps: number | null = null;

	if (stepLen > 0 && direction === 'toDistance' && stepsNum > 0) {
		resultMiles = stepsToMiles(stepsNum, stepLen);
		resultKm = stepsToKm(stepsNum, stepLen);
	}
	if (stepLen > 0 && direction === 'toSteps' && distanceNum > 0) {
		const distanceMiles = units === 'imperial' ? distanceNum : distanceNum * 0.621371;
		resultSteps = milesToSteps(distanceMiles, stepLen);
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Direction"
					value={direction}
					onChange={setDirection}
					options={[
						{ value: 'toDistance', label: 'Steps → Distance' },
						{ value: 'toSteps', label: 'Distance → Steps' },
					]}
					wide
				/>
				<Segmented
					label="Units"
					value={units}
					onChange={setUnits}
					options={[
						{ value: 'imperial', label: 'US', title: 'US units: feet, inches, miles' },
						{ value: 'metric', label: 'Metric', title: 'Metric units: centimeters, kilometers' },
					]}
				/>
				<Segmented
					label="Gender"
					value={gender}
					onChange={setGender}
					options={[
						{ value: 'male', label: 'Male' },
						{ value: 'female', label: 'Female' },
					]}
				/>

				{units === 'imperial' ? (
					<>
						<NumberField label="Height" unit="ft" value={heightFt} onChange={setHeightFt} min={0} step={1} inputMode="numeric" />
						<NumberField label="plus" unit="in" value={heightIn} onChange={setHeightIn} min={0} max={11.9} step={0.5} />
					</>
				) : (
					<NumberField label="Height" unit="cm" value={heightCm} onChange={setHeightCm} min={0} step={1} />
				)}

				{direction === 'toDistance' ? (
					<NumberField label="Steps" value={steps} onChange={setSteps} min={0} step={500} inputMode="numeric" />
				) : (
					<NumberField
						label="Distance"
						unit={units === 'imperial' ? 'mi' : 'km'}
						value={distance}
						onChange={setDistance}
						min={0}
						step={0.5}
					/>
				)}
			</div>

			{direction === 'toDistance' && resultMiles !== null && resultKm !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Distance</p>
						<p class="calc-result-value primary">{fmt(resultMiles)} mi</p>
					</div>
					<div>
						<p class="calc-result-label">In kilometers</p>
						<p class="calc-result-value">{fmt(resultKm)} km</p>
					</div>
					<div>
						<p class="calc-result-label">Your estimated step length</p>
						<p class="calc-result-value">
							{units === 'imperial' ? `${fmt(stepLen)} in` : `${fmt(stepLen * 2.54)} cm`}
						</p>
					</div>
				</div>
			) : direction === 'toSteps' && resultSteps !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Steps</p>
						<p class="calc-result-value primary">{fmt(resultSteps, 0)}</p>
					</div>
					<div>
						<p class="calc-result-label">Your estimated step length</p>
						<p class="calc-result-value">
							{units === 'imperial' ? `${fmt(stepLen)} in` : `${fmt(stepLen * 2.54)} cm`}
						</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter your height and either a step count or a distance.</p>
			)}

			<p class="calc-note">
				Step length is estimated from height using the regression Hoeger et al. fit across
				walking and running speeds (0.415 × height for men, 0.413 × height for women) rather than a flat
				"2,000 steps per mile" rule, so a taller or shorter stride shifts the result. Individual
				stride varies roughly 10-15% around this estimate depending on leg length and pace.
				Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
