import { useState } from 'preact/hooks';
import {
	bagsNeeded,
	bagsTotalWeightLb,
	bagYieldCuFt,
	cuFtToCuYd,
	roundVolumeCuFt,
	slabVolumeCuFt,
	toFeet,
	totalCuFt,
	withWaste,
	type BagSize,
	type LengthUnit,
} from '../../lib/concrete';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

type Shape = 'slab' | 'round';

const SHAPES = [
	{ value: 'slab' as Shape, label: 'Slab / Footing / Wall' },
	{ value: 'round' as Shape, label: 'Column / Post Hole / Tube' },
];

const UNITS = [
	{ value: 'ft' as LengthUnit, label: 'ft', title: 'feet' },
	{ value: 'in' as LengthUnit, label: 'in', title: 'inches' },
	{ value: 'yd' as LengthUnit, label: 'yd', title: 'yards' },
	{ value: 'm' as LengthUnit, label: 'm', title: 'meters' },
	{ value: 'cm' as LengthUnit, label: 'cm', title: 'centimeters' },
];

const BAG_SIZES = [
	{ value: '40' as const, label: '40 lb' },
	{ value: '50' as const, label: '50 lb' },
	{ value: '60' as const, label: '60 lb' },
	{ value: '80' as const, label: '80 lb' },
];

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function ConcreteCalculator() {
	const [shape, setShape] = useState<Shape>('slab');
	const [unit, setUnit] = useState<LengthUnit>('ft');
	const [length, setLength] = useState('10');
	const [width, setWidth] = useState('10');
	const [depth, setDepth] = useState('4');
	const [depthUnit, setDepthUnit] = useState<LengthUnit>('in');
	const [diameter, setDiameter] = useState('10');
	const [diameterUnit, setDiameterUnit] = useState<LengthUnit>('in');
	const [quantity, setQuantity] = useState('1');
	const [waste, setWaste] = useState('10');
	const [bagSize, setBagSize] = useState<'40' | '50' | '60' | '80'>('80');

	const lengthFt = toFeet(parseFloat(length), unit);
	const widthFt = toFeet(parseFloat(width), unit);
	const depthFt = toFeet(parseFloat(depth), depthUnit);
	const diameterFt = toFeet(parseFloat(diameter), diameterUnit);
	const qty = parseFloat(quantity);
	const wastePercent = parseFloat(waste);

	let unitCuFt: number | null = null;
	if (shape === 'slab' && lengthFt > 0 && widthFt > 0 && depthFt > 0) {
		unitCuFt = slabVolumeCuFt(lengthFt, widthFt, depthFt);
	}
	if (shape === 'round' && diameterFt > 0 && depthFt > 0) {
		unitCuFt = roundVolumeCuFt(diameterFt, depthFt);
	}

	const validQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
	const validWaste = Number.isFinite(wastePercent) && wastePercent >= 0 ? wastePercent : 0;

	let result: {
		cuFt: number;
		cuYd: number;
		bags: number;
		bagsWeightLb: number;
	} | null = null;

	if (unitCuFt !== null) {
		const rawCuFt = totalCuFt(unitCuFt, validQty);
		const cuFt = withWaste(rawCuFt, validWaste);
		const size = Number(bagSize) as BagSize;
		const bags = bagsNeeded(cuFt, size);
		result = {
			cuFt,
			cuYd: cuFtToCuYd(cuFt),
			bags,
			bagsWeightLb: bagsTotalWeightLb(bags, size),
		};
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select label="Pour shape" value={shape} onChange={setShape} options={SHAPES} wide />

				{shape === 'slab' ? (
					<>
						<Segmented label="Length/width unit" value={unit} onChange={setUnit} options={UNITS} wide />
						<NumberField label="Length" unit={unit} value={length} onChange={setLength} min={0} step={0.5} />
						<NumberField label="Width" unit={unit} value={width} onChange={setWidth} min={0} step={0.5} />
					</>
				) : (
					<>
						<Segmented
							label="Diameter unit"
							value={diameterUnit}
							onChange={setDiameterUnit}
							options={UNITS}
							wide
						/>
						<NumberField
							label="Diameter"
							unit={diameterUnit}
							value={diameter}
							onChange={setDiameter}
							min={0}
							step={0.5}
						/>
					</>
				)}

				<NumberField
					label={shape === 'slab' ? 'Thickness' : 'Depth'}
					unit={depthUnit}
					value={depth}
					onChange={setDepth}
					min={0}
					step={depthUnit === 'in' ? 0.5 : 0.1}
				/>
				<Segmented
					label={shape === 'slab' ? 'Thickness unit' : 'Depth unit'}
					value={depthUnit}
					onChange={setDepthUnit}
					options={UNITS}
					wide
				/>

				<NumberField
					label={shape === 'slab' ? 'Identical pours' : 'Number of holes/columns'}
					value={quantity}
					onChange={setQuantity}
					min={1}
					step={1}
				/>
				<NumberField
					label="Waste allowance"
					unit="%"
					value={waste}
					onChange={setWaste}
					min={0}
					max={25}
					step={1}
				/>
				<Segmented label="Bag size" value={bagSize} onChange={setBagSize} options={BAG_SIZES} wide />
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Concrete needed</p>
						<p class="calc-result-value primary">{fmt(result.cuYd, 3)} cu yd</p>
					</div>
					<div>
						<p class="calc-result-label">In cubic feet</p>
						<p class="calc-result-value">{fmt(result.cuFt)} ft³</p>
					</div>
					<div>
						<p class="calc-result-label">Bags needed ({bagSize} lb)</p>
						<p class="calc-result-value">{fmt(result.bags, 0)} bags</p>
					</div>
					<div>
						<p class="calc-result-label">Total bag weight</p>
						<p class="calc-result-value">{fmt(result.bagsWeightLb, 0)} lb</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter the dimensions to see how much concrete you need.</p>
			)}

			<p class="calc-note">
				Bag yields are QUIKRETE Concrete Mix (Product No. 1101) published figures: 40 lb → 0.30
				ft³, 50 lb → 0.375 ft³, 60 lb → 0.45 ft³, 80 lb → 0.60 ft³. For a ready-mix truck order,
				use the cubic yard figure with waste included; most plants round up to the nearest
				quarter or half yard. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
