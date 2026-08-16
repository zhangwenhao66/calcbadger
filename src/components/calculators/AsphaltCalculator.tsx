import { useState } from 'preact/hooks';
import {
	cuFtToCuYd,
	DENSITY_LB_PER_CUFT,
	lbToTons,
	slabVolumeCuFt,
	toFeet,
	weightLb,
	withWaste,
	type LengthUnit,
	type MaterialType,
} from '../../lib/asphalt';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const AREA_UNITS = [
	{ value: 'ft' as LengthUnit, label: 'ft', title: 'feet' },
	{ value: 'in' as LengthUnit, label: 'in', title: 'inches' },
	{ value: 'yd' as LengthUnit, label: 'yd', title: 'yards' },
	{ value: 'm' as LengthUnit, label: 'm', title: 'meters' },
	{ value: 'cm' as LengthUnit, label: 'cm', title: 'centimeters' },
];

const DEPTH_UNITS = [
	{ value: 'in' as LengthUnit, label: 'in', title: 'inches' },
	{ value: 'cm' as LengthUnit, label: 'cm', title: 'centimeters' },
];

const MATERIALS = [
	{ value: 'hotmix' as MaterialType, label: 'Hot mix (new paving)' },
	{ value: 'rap' as MaterialType, label: 'Recycled (RAP)' },
	{ value: 'custom' as MaterialType, label: 'Custom density' },
];

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function AsphaltCalculator() {
	const [unit, setUnit] = useState<LengthUnit>('ft');
	const [length, setLength] = useState('20');
	const [width, setWidth] = useState('10');
	const [depthUnit, setDepthUnit] = useState<LengthUnit>('in');
	const [depth, setDepth] = useState('2');
	const [material, setMaterial] = useState<MaterialType>('hotmix');
	const [customDensity, setCustomDensity] = useState('130');
	const [waste, setWaste] = useState('5');
	const [pricePerTon, setPricePerTon] = useState('');

	const lengthFt = toFeet(parseFloat(length), unit);
	const widthFt = toFeet(parseFloat(width), unit);
	const depthFt = toFeet(parseFloat(depth), depthUnit);
	const wastePercent = parseFloat(waste);
	const validWaste = Number.isFinite(wastePercent) && wastePercent >= 0 ? wastePercent : 0;

	const density = material === 'custom' ? parseFloat(customDensity) : DENSITY_LB_PER_CUFT[material];

	let result: { cuFt: number; cuYd: number; lb: number; tons: number; cost: number | null } | null = null;

	if (lengthFt > 0 && widthFt > 0 && depthFt > 0 && Number.isFinite(density) && density > 0) {
		const rawCuFt = slabVolumeCuFt(lengthFt, widthFt, depthFt);
		const cuFt = withWaste(rawCuFt, validWaste);
		const lb = weightLb(cuFt, density);
		const tons = lbToTons(lb);
		const price = parseFloat(pricePerTon);
		result = {
			cuFt,
			cuYd: cuFtToCuYd(cuFt),
			lb,
			tons,
			cost: Number.isFinite(price) && price > 0 ? tons * price : null,
		};
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented label="Length/width unit" value={unit} onChange={setUnit} options={AREA_UNITS} wide />
				<NumberField label="Length" unit={unit} value={length} onChange={setLength} min={0} step={0.5} />
				<NumberField label="Width" unit={unit} value={width} onChange={setWidth} min={0} step={0.5} />

				<Segmented label="Depth unit" value={depthUnit} onChange={setDepthUnit} options={DEPTH_UNITS} />
				<NumberField
					label="Compacted depth"
					unit={depthUnit}
					value={depth}
					onChange={setDepth}
					min={0}
					step={depthUnit === 'in' ? 0.25 : 0.5}
				/>

				<Segmented label="Material" value={material} onChange={setMaterial} options={MATERIALS} wide />
				{material === 'custom' && (
					<NumberField
						label="Density"
						unit="lb/ft³"
						value={customDensity}
						onChange={setCustomDensity}
						min={1}
						step={1}
					/>
				)}

				<NumberField
					label="Waste allowance"
					unit="%"
					value={waste}
					onChange={setWaste}
					min={0}
					max={25}
					step={1}
				/>
				<NumberField
					label="Price per ton (optional)"
					unit="$"
					value={pricePerTon}
					onChange={setPricePerTon}
					min={0}
					step={1}
					placeholder="e.g. 110"
				/>
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Asphalt needed</p>
						<p class="calc-result-value primary">{fmt(result.tons, 2)} tons</p>
					</div>
					<div>
						<p class="calc-result-label">Total weight</p>
						<p class="calc-result-value">{fmt(result.lb, 0)} lb</p>
					</div>
					<div>
						<p class="calc-result-label">Volume</p>
						<p class="calc-result-value">{fmt(result.cuYd, 3)} cu yd</p>
					</div>
					{result.cost !== null && (
						<div>
							<p class="calc-result-label">Estimated material cost</p>
							<p class="calc-result-value">${fmt(result.cost, 0)}</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Enter the paved area's length, width, and compacted depth to see the tonnage.</p>
			)}

			<p class="calc-note">
				Density defaults: hot mix asphalt 145 lb/ft³ (Iowa DOT Standard Specifications Section
				2303 planning value, within the Asphalt Institute's 142-148 lb/ft³ in-place range) and
				recycled asphalt pavement (RAP) 112 lb/ft³, near the midpoint of the 100-125 lb/ft³ compacted
				range FHWA documents for reclaimed material. Use the custom option if your supplier gives
				you a lab-tested density. Calculations run in your browser; nothing you type is sent
				anywhere.
			</p>
		</div>
	);
}
