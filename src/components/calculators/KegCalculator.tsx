import { useState } from 'preact/hooks';
import {
	KEG_PRESET_ML,
	SERVING_PRESET_ML,
	calculateServings,
	costPerServing,
	kegsNeeded,
	servingToMl,
	servingsWithWaste,
	volumeToMl,
	type KegPreset,
	type ServingPreset,
	type ServingUnit,
	type VolumeUnit,
} from '../../lib/kegCalculator';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const KEG_OPTIONS: { value: KegPreset; label: string }[] = [
	{ value: 'halfBarrel', label: 'Half barrel (15.5 gal, "full keg")' },
	{ value: 'quarterBarrel', label: 'Quarter barrel / pony keg (7.75 gal)' },
	{ value: 'sixthBarrel', label: 'Sixth barrel / sixtel (5.17 gal)' },
	{ value: 'cornyKeg', label: 'Corny keg / homebrew (5 gal)' },
	{ value: 'miniKeg', label: 'Mini keg / party keg (5 L)' },
	{ value: 'custom', label: 'Custom volume' },
];

const VOLUME_UNITS = [
	{ value: 'gal' as VolumeUnit, label: 'gal', title: 'US gallons' },
	{ value: 'l' as VolumeUnit, label: 'L', title: 'liters' },
];

const SERVING_OPTIONS: { value: ServingPreset; label: string }[] = [
	{ value: 'can12oz', label: '12 oz can' },
	{ value: 'usPint16oz', label: '16 oz US pint' },
	{ value: 'imperialPint20oz', label: '20 oz imperial pint' },
	{ value: 'custom', label: 'Custom' },
];

const SERVING_UNITS = [
	{ value: 'floz' as ServingUnit, label: 'fl oz', title: 'US fluid ounces' },
	{ value: 'ml' as ServingUnit, label: 'mL', title: 'milliliters' },
];

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function fmt(n: number, digits = 0): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function KegCalculator() {
	const [kegPreset, setKegPreset] = useState<KegPreset>('halfBarrel');
	const [customVolume, setCustomVolume] = useState('50');
	const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>('l');

	const [servingPreset, setServingPreset] = useState<ServingPreset>('can12oz');
	const [customServing, setCustomServing] = useState('12');
	const [servingUnit, setServingUnit] = useState<ServingUnit>('floz');

	const [waste, setWaste] = useState('0');
	const [price, setPrice] = useState('');
	const [guests, setGuests] = useState('');
	const [drinksPerGuest, setDrinksPerGuest] = useState('2');

	const kegVolumeMl =
		kegPreset === 'custom'
			? volumeToMl(parseFloat(customVolume) || 0, volumeUnit)
			: KEG_PRESET_ML[kegPreset];

	const servingSizeMl =
		servingPreset === 'custom'
			? servingToMl(parseFloat(customServing) || 0, servingUnit)
			: SERVING_PRESET_ML[servingPreset];

	const wastePercent = Number.isFinite(parseFloat(waste)) ? Math.min(100, Math.max(0, parseFloat(waste))) : 0;
	const priceNum = parseFloat(price);
	const guestsNum = parseFloat(guests);
	const drinksNum = parseFloat(drinksPerGuest);

	let result: {
		servings: number;
		afterWaste: number;
		gallons: number;
		liters: number;
		cost: number | null;
		kegsForParty: number | null;
	} | null = null;

	if (kegVolumeMl > 0 && servingSizeMl > 0) {
		const { servings } = calculateServings(kegVolumeMl, servingSizeMl);
		const afterWaste = wastePercent > 0 ? servingsWithWaste(servings, wastePercent) : servings;
		const cost = Number.isFinite(priceNum) && priceNum > 0 ? costPerServing(priceNum, afterWaste) : null;
		const kegsForParty =
			Number.isFinite(guestsNum) && guestsNum > 0 && Number.isFinite(drinksNum) && drinksNum > 0
				? kegsNeeded(guestsNum, drinksNum, afterWaste)
				: null;
		result = {
			servings,
			afterWaste,
			gallons: kegVolumeMl / 3785.411784,
			liters: kegVolumeMl / 1000,
			cost,
			kegsForParty,
		};
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select label="Keg size" value={kegPreset} onChange={setKegPreset} options={KEG_OPTIONS} wide />
				{kegPreset === 'custom' && (
					<>
						<NumberField
							label="Custom keg volume"
							value={customVolume}
							onChange={setCustomVolume}
							min={0}
							step={volumeUnit === 'gal' ? 0.5 : 1}
						/>
						<Segmented label="Volume unit" value={volumeUnit} onChange={setVolumeUnit} options={VOLUME_UNITS} />
					</>
				)}

				<Segmented label="Serving size" value={servingPreset} onChange={setServingPreset} options={SERVING_OPTIONS} wide />
				{servingPreset === 'custom' && (
					<>
						<NumberField
							label="Custom serving size"
							value={customServing}
							onChange={setCustomServing}
							min={0}
							step={servingUnit === 'floz' ? 0.5 : 10}
						/>
						<Segmented label="Serving unit" value={servingUnit} onChange={setServingUnit} options={SERVING_UNITS} />
					</>
				)}

				<NumberField
					label="Pour waste (foam, spillage)"
					unit="%"
					value={waste}
					onChange={setWaste}
					min={0}
					max={30}
					step={1}
				/>
				<NumberField
					label="Keg price (optional)"
					unit="$"
					value={price}
					onChange={setPrice}
					min={0}
					step={5}
					placeholder="e.g. 150"
				/>
				<NumberField
					label="Guests (optional)"
					value={guests}
					onChange={setGuests}
					min={0}
					step={1}
					placeholder="e.g. 80"
				/>
				<NumberField
					label="Drinks per guest"
					value={drinksPerGuest}
					onChange={setDrinksPerGuest}
					min={0}
					step={0.5}
				/>
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Servings from this keg</p>
						<p class="calc-result-value primary">{fmt(result.afterWaste)}</p>
					</div>
					{wastePercent > 0 && (
						<div>
							<p class="calc-result-label">Before waste allowance</p>
							<p class="calc-result-value">{fmt(result.servings)}</p>
						</div>
					)}
					<div>
						<p class="calc-result-label">Keg volume</p>
						<p class="calc-result-value">
							{fmt(result.gallons, 2)} gal ({fmt(result.liters, 1)} L)
						</p>
					</div>
					{result.cost !== null && (
						<div>
							<p class="calc-result-label">Cost per serving</p>
							<p class="calc-result-value">{usd.format(result.cost)}</p>
						</div>
					)}
					{result.kegsForParty !== null && (
						<div>
							<p class="calc-result-label">Kegs needed for this many guests</p>
							<p class="calc-result-value">{fmt(result.kegsForParty)}</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Choose a keg size and serving size to see how many pours it holds.</p>
			)}

			<p class="calc-note">
				Servings = keg volume divided by serving size, rounded down, since a partial pour past the
				last full serving doesn't count as one. Keg sizes come from the fractional-barrel and
				metric sizes the US Alcohol and Tobacco Tax and Trade Bureau authorizes (27 CFR 25.11 and
				25.156); the 12 oz default serving is the NIAAA's standard-drink reference for beer near 5%
				ABV. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
