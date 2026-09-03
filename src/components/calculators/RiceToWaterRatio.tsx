import { useState } from 'preact/hooks';
import {
	computeRiceWater,
	RICE_TYPE_ORDER,
	RICE_TYPES,
	type RiceAmountUnit,
	type RiceType,
} from '../../lib/riceToWaterRatio';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select, { type SelectOption } from '../ui/Select';

const RICE_TYPE_OPTIONS: SelectOption<RiceType>[] = RICE_TYPE_ORDER.map((id) => ({
	value: id,
	label: RICE_TYPES[id].label,
}));

const UNIT_OPTIONS: { value: RiceAmountUnit; label: string }[] = [
	{ value: 'cups', label: 'Cups (dry)' },
	{ value: 'grams', label: 'Grams (dry)' },
];

export default function RiceToWaterRatio() {
	const [amount, setAmount] = useState('2');
	const [unit, setUnit] = useState<RiceAmountUnit>('cups');
	const [riceType, setRiceType] = useState<RiceType>('white-long');

	const amountNum = parseFloat(amount);
	const result =
		Number.isFinite(amountNum) && amountNum > 0 ? computeRiceWater(amountNum, unit, riceType) : null;

	const info = RICE_TYPES[riceType];
	const isTwoToOneType = info.ratio === 2;

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField
					label="Amount of dry rice"
					value={amount}
					onChange={setAmount}
					min={0}
					step={unit === 'cups' ? 0.25 : 25}
					inputMode="decimal"
				/>
				<Segmented label="Measured in" value={unit} onChange={setUnit} options={UNIT_OPTIONS} />
				<Select label="Rice type" value={riceType} onChange={setRiceType} options={RICE_TYPE_OPTIONS} wide />
			</div>

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Water needed</p>
						<p class="calc-result-value primary">{result.waterCups} cups</p>
					</div>
					<div>
						<p class="calc-result-label">Water needed (ml)</p>
						<p class="calc-result-value">{result.waterMl} ml</p>
					</div>
					<div>
						<p class="calc-result-label">Est. cooked yield</p>
						<p class="calc-result-value">{result.cookedCups} cups</p>
					</div>
					<div>
						<p class="calc-result-label">Est. cooked yield (oz)</p>
						<p class="calc-result-value">{result.cookedOz} oz</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter an amount of dry rice greater than 0 to see how much water it needs.</p>
			)}

			{result !== null && (
				<p class="calc-note">
					{info.label} uses a {info.ratio}:1 liquid-to-rice ratio (parts liquid to 1 part rice, by volume,
					per USA Rice's stovetop chart): {result.riceCups} cup{result.riceCups === 1 ? '' : 's'} of dry
					rice needs {result.waterCups} cup{result.waterCups === 1 ? '' : 's'} of water, simmered covered
					for {info.cookTime}.
				</p>
			)}

			<p class="calc-note">
				Cooked yield is an estimate (dry rice volume plus the water it absorbs), not a separately measured
				figure for every rice type
				{isTwoToOneType
					? '. For a 2:1 ratio like this one, that matches USA Rice\'s own stated rule that rice "typically triples in volume" when cooked.'
					: ', extended from USA Rice\'s tripling rule for the 2:1 ratio types to this ratio; expect it to be off by a little from evaporation and how tightly the grain packs.'}
			</p>

			<p class="calc-note">Calculations run in your browser; nothing you type is sent anywhere.</p>
		</div>
	);
}
