import { useState } from 'preact/hooks';
import {
	ACTIVITY_LABELS,
	ACTIVITY_MULTIPLIERS,
	bmrImperial,
	bmrMetric,
	calorieTarget,
	isBelowSafeMinimum,
	safeMinimumCalories,
	type ActivityLevel,
	type Goal,
	type Sex,
} from '../../lib/calories';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const ACTIVITY_OPTIONS = (Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map((value) => ({
	value,
	label: ACTIVITY_LABELS[value],
}));

const LOSE_RATES = [0.5, 1, 1.5, 2];
const GAIN_RATES = [0.25, 0.5, 0.75, 1];

function fmt(n: number): string {
	return Math.round(n).toLocaleString('en-US');
}

export default function CalorieCalculator() {
	const [units, setUnits] = useState<'metric' | 'imperial'>('imperial');
	const [sex, setSex] = useState<Sex>('female');
	const [age, setAge] = useState('30');
	const [weightKg, setWeightKg] = useState('68');
	const [heightCm, setHeightCm] = useState('165');
	const [weightLb, setWeightLb] = useState('150');
	const [heightFt, setHeightFt] = useState('5');
	const [heightIn, setHeightIn] = useState('6');
	const [activity, setActivity] = useState<ActivityLevel>('light');
	const [goal, setGoal] = useState<Goal>('lose');
	const [rate, setRate] = useState('1');

	const ageNum = parseFloat(age);
	const wKg = parseFloat(weightKg);
	const hCm = parseFloat(heightCm);
	const wLb = parseFloat(weightLb);
	const ft = parseFloat(heightFt);
	const inches = parseFloat(heightIn);
	const totalIn = (Number.isFinite(ft) ? ft : 0) * 12 + (Number.isFinite(inches) ? inches : 0);
	const rateNum = parseFloat(rate);

	const validMetric = Number.isFinite(wKg) && wKg > 0 && Number.isFinite(hCm) && hCm > 0;
	const validImperial = Number.isFinite(wLb) && wLb > 0 && totalIn > 0;
	const validAge = Number.isFinite(ageNum) && ageNum > 0;
	const valid = validAge && (units === 'metric' ? validMetric : validImperial);

	const bmr = valid
		? units === 'metric'
			? bmrMetric(sex, wKg, hCm, ageNum)
			: bmrImperial(sex, wLb, totalIn, ageNum)
		: null;

	const maintenance = bmr !== null ? bmr * ACTIVITY_MULTIPLIERS[activity] : null;
	const target =
		maintenance !== null
			? calorieTarget(maintenance, goal, Number.isFinite(rateNum) ? rateNum : 0)
			: null;
	const belowFloor = target !== null && goal === 'lose' && isBelowSafeMinimum(target, sex);

	const rateOptions = (goal === 'lose' ? LOSE_RATES : GAIN_RATES).map((r) => ({
		value: String(r),
		label: `${r} lb/week`,
	}));

	function handleGoalChange(nextGoal: Goal) {
		setGoal(nextGoal);
		const nextRates = nextGoal === 'lose' ? LOSE_RATES : GAIN_RATES;
		if (!nextRates.map(String).includes(rate)) {
			setRate(String(nextRates[0]));
		}
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Sex"
					value={sex}
					onChange={setSex}
					options={[
						{ value: 'female' as Sex, label: 'Female' },
						{ value: 'male' as Sex, label: 'Male' },
					]}
				/>
				<Segmented
					label="Units"
					value={units}
					onChange={setUnits}
					options={[
						{ value: 'imperial', label: 'US', title: 'US units: pounds, feet and inches' },
						{ value: 'metric', label: 'Metric', title: 'Metric units: kilograms and centimeters' },
					]}
				/>
				<NumberField label="Age" unit="yrs" value={age} onChange={setAge} min={15} max={100} step={1} inputMode="numeric" />

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

				<Select
					label="Activity level"
					value={activity}
					onChange={setActivity}
					options={ACTIVITY_OPTIONS}
					wide
				/>
				<Segmented
					label="Goal"
					value={goal}
					onChange={handleGoalChange}
					options={[
						{ value: 'lose' as Goal, label: 'Lose' },
						{ value: 'maintain' as Goal, label: 'Maintain' },
						{ value: 'gain' as Goal, label: 'Gain' },
					]}
					wide
				/>
				{goal !== 'maintain' && (
					<Select label="Target rate" value={rate} onChange={setRate} options={rateOptions} />
				)}
			</div>

			{bmr !== null && maintenance !== null && target !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">BMR (calories at rest)</p>
						<p class="calc-result-value">{fmt(bmr)}</p>
					</div>
					<div>
						<p class="calc-result-label">Maintenance (TDEE)</p>
						<p class="calc-result-value">{fmt(maintenance)}</p>
					</div>
					<div>
						<p class="calc-result-label">
							{goal === 'lose' ? 'Calories to lose weight' : goal === 'gain' ? 'Calories to gain weight' : 'Calories to maintain'}
						</p>
						<p class="calc-result-value primary">{fmt(target)} cal/day</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter your age, weight, and height to see your calorie needs.</p>
			)}

			{belowFloor && target !== null && (
				<p class="calc-note">
					<span class="calc-badge caution">Below the general {fmt(safeMinimumCalories(sex))}-calorie floor</span>{' '}
					{fmt(target)} cal/day is a steep cut for this profile. The 2013 AHA/ACC/TOS obesity guideline
					suggests diets under about {fmt(safeMinimumCalories(sex))} cal/day for {sex === 'female' ? 'women' : 'men'} are
					meant to run under medical supervision, not as a default target. Try a slower rate instead.
				</p>
			)}

			<p class="calc-note">
				BMR uses the Mifflin-St Jeor equation, which studies have found more accurate than the older
				Harris-Benedict formula for most adults. The activity multiplier is a rough estimate of
				weekly movement, and the calorie target applies the conventional "3,500 kcal per pound"
				rule, a useful starting point that runs faster than real weight change tends to, since the
				body's energy needs shift as weight changes. Calculations run in your browser; nothing you
				type is sent anywhere.
			</p>
		</div>
	);
}
