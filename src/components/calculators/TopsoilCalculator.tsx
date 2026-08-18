import { useState } from 'preact/hooks';
import {
	bagsNeeded,
	circleAreaSqFt,
	cuFtToCuYd,
	DENSITY_LB_PER_CUFT,
	lbToTons,
	rectangleAreaSqFt,
	toFeet,
	volumeCuFt,
	weightLb,
	withSettling,
	type LengthUnit,
	type Shape,
	type SoilTexture,
} from '../../lib/topsoil';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const SHAPES: { value: Shape; label: string }[] = [
	{ value: 'rectangle', label: 'Rectangle' },
	{ value: 'circle', label: 'Circle' },
];

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

const TEXTURES: { value: SoilTexture; label: string }[] = [
	{ value: 'sandy', label: 'Sandy blend' },
	{ value: 'loam', label: 'Loam (typical topsoil)' },
	{ value: 'clay', label: 'Clay-heavy' },
	{ value: 'custom', label: 'Custom density' },
];

const BAG_SIZES: { value: string; label: string }[] = [
	{ value: '0.75', label: '0.75 cu ft (most common bag)' },
	{ value: '1', label: '1 cu ft' },
	{ value: '1.5', label: '1.5 cu ft' },
	{ value: '2', label: '2 cu ft' },
];

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function TopsoilCalculator() {
	const [shape, setShape] = useState<Shape>('rectangle');
	const [unit, setUnit] = useState<LengthUnit>('ft');
	const [length, setLength] = useState('20');
	const [width, setWidth] = useState('10');
	const [diameter, setDiameter] = useState('10');
	const [depthUnit, setDepthUnit] = useState<LengthUnit>('in');
	const [depth, setDepth] = useState('4');
	const [texture, setTexture] = useState<SoilTexture>('loam');
	const [customDensity, setCustomDensity] = useState('80');
	const [settling, setSettling] = useState('10');
	const [bagSize, setBagSize] = useState('0.75');
	const [pricePerYard, setPricePerYard] = useState('');

	const depthFt = toFeet(parseFloat(depth), depthUnit);
	const settlingPercent = parseFloat(settling);
	const validSettling = Number.isFinite(settlingPercent) && settlingPercent >= 0 ? settlingPercent : 0;

	const areaSqFt =
		shape === 'rectangle'
			? rectangleAreaSqFt(toFeet(parseFloat(length), unit), toFeet(parseFloat(width), unit))
			: circleAreaSqFt(toFeet(parseFloat(diameter), unit));

	const density = texture === 'custom' ? parseFloat(customDensity) : DENSITY_LB_PER_CUFT[texture];
	const bagSizeCuFt = parseFloat(bagSize);

	let result: {
		cuFt: number;
		cuYd: number;
		lb: number;
		tons: number;
		bags: number;
		cost: number | null;
	} | null = null;

	if (areaSqFt > 0 && depthFt > 0 && Number.isFinite(density) && density > 0) {
		const rawCuFt = volumeCuFt(areaSqFt, depthFt);
		const cuFt = withSettling(rawCuFt, validSettling);
		const cuYd = cuFtToCuYd(cuFt);
		const lb = weightLb(cuFt, density);
		const price = parseFloat(pricePerYard);
		result = {
			cuFt,
			cuYd,
			lb,
			tons: lbToTons(lb),
			bags: bagSizeCuFt > 0 ? bagsNeeded(cuFt, bagSizeCuFt) : 0,
			cost: Number.isFinite(price) && price > 0 ? cuYd * price : null,
		};
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented label="Bed shape" value={shape} onChange={setShape} options={SHAPES} />
				<Segmented label="Length/width unit" value={unit} onChange={setUnit} options={AREA_UNITS} wide />

				{shape === 'rectangle' ? (
					<>
						<NumberField label="Length" unit={unit} value={length} onChange={setLength} min={0} step={0.5} />
						<NumberField label="Width" unit={unit} value={width} onChange={setWidth} min={0} step={0.5} />
					</>
				) : (
					<NumberField label="Diameter" unit={unit} value={diameter} onChange={setDiameter} min={0} step={0.5} />
				)}

				<Segmented label="Depth unit" value={depthUnit} onChange={setDepthUnit} options={DEPTH_UNITS} />
				<NumberField
					label="Fill depth"
					unit={depthUnit}
					value={depth}
					onChange={setDepth}
					min={0}
					step={depthUnit === 'in' ? 0.5 : 1}
				/>

				<Segmented label="Soil texture" value={texture} onChange={setTexture} options={TEXTURES} wide />
				{texture === 'custom' && (
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
					label="Settling allowance"
					unit="%"
					value={settling}
					onChange={setSettling}
					min={0}
					max={30}
					step={1}
				/>
				<Select label="Bag size" value={bagSize} onChange={setBagSize} options={BAG_SIZES} wide />
				<NumberField
					label="Price per cu yd (optional)"
					unit="$"
					value={pricePerYard}
					onChange={setPricePerYard}
					min={0}
					step={1}
					placeholder="e.g. 35"
				/>
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Topsoil needed</p>
						<p class="calc-result-value primary">{fmt(result.cuYd, 3)} cu yd</p>
					</div>
					<div>
						<p class="calc-result-label">Volume</p>
						<p class="calc-result-value">{fmt(result.cuFt, 1)} cu ft</p>
					</div>
					<div>
						<p class="calc-result-label">Estimated weight</p>
						<p class="calc-result-value">
							{fmt(result.lb, 0)} lb ({fmt(result.tons, 2)} tons)
						</p>
					</div>
					<div>
						<p class="calc-result-label">Bags needed</p>
						<p class="calc-result-value">{fmt(result.bags, 0)}</p>
					</div>
					{result.cost !== null && (
						<div>
							<p class="calc-result-label">Estimated bulk material cost</p>
							<p class="calc-result-value">${fmt(result.cost, 0)}</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Enter the bed's dimensions and fill depth to see how much topsoil to order.</p>
			)}

			<p class="calc-note">
				Density presets come from the USDA NRCS Soil Health Educators Guide's ideal bulk-density
				ceiling for each soil texture, not a single official "topsoil weighs X" figure. Purchased,
				screened topsoil is usually looser than a compacted native sample, so treat the estimate as a
				planning number and use a supplier-provided density if you have one. Calculations run in your
				browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
