import { useState } from 'preact/hooks';
import {
	boardFeetPerPiece,
	costEstimate,
	quartersToInches,
	toFeet,
	totalBoardFeet,
	withWaste,
	type LengthUnit,
} from '../../lib/boardFoot';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const QUARTERS = [
	{ value: '4', label: '4/4' },
	{ value: '5', label: '5/4' },
	{ value: '6', label: '6/4' },
	{ value: '8', label: '8/4' },
	{ value: '12', label: '12/4' },
	{ value: '16', label: '16/4' },
] as const;

const LENGTH_UNITS = [
	{ value: 'ft' as LengthUnit, label: 'ft', title: 'feet' },
	{ value: 'in' as LengthUnit, label: 'in', title: 'inches' },
];

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function BoardFootCalculator() {
	const [thickness, setThickness] = useState('1');
	const [width, setWidth] = useState('6');
	const [length, setLength] = useState('8');
	const [lengthUnit, setLengthUnit] = useState<LengthUnit>('ft');
	const [quantity, setQuantity] = useState('1');
	const [waste, setWaste] = useState('0');
	const [price, setPrice] = useState('');

	const thicknessIn = parseFloat(thickness);
	const widthIn = parseFloat(width);
	const lengthFt = toFeet(parseFloat(length), lengthUnit);
	const qty = parseFloat(quantity);
	const wastePercent = parseFloat(waste);
	const priceNum = parseFloat(price);

	const validQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
	const validWaste = Number.isFinite(wastePercent) && wastePercent >= 0 ? wastePercent : 0;

	let result: { perPiece: number; total: number; withWasteTotal: number; cost: number | null } | null = null;
	if (thicknessIn > 0 && widthIn > 0 && lengthFt > 0) {
		const perPiece = boardFeetPerPiece(thicknessIn, widthIn, lengthFt);
		const total = totalBoardFeet(perPiece, validQty);
		const withWasteTotal = withWaste(total, validWaste);
		const cost =
			Number.isFinite(priceNum) && priceNum > 0 ? costEstimate(withWasteTotal, priceNum) : null;
		result = { perPiece, total, withWasteTotal, cost };
	}

	function applyQuarters(q: string) {
		setThickness(String(quartersToInches(Number(q))));
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Nominal thickness (rough-sawn quarters)"
					value={String(Math.round(thicknessIn / 0.25))}
					onChange={applyQuarters}
					options={QUARTERS}
					wide
				/>
				<NumberField
					label="Actual thickness"
					unit="in"
					value={thickness}
					onChange={setThickness}
					min={0}
					step={0.125}
				/>
				<NumberField label="Width" unit="in" value={width} onChange={setWidth} min={0} step={0.25} />
				<Segmented label="Length unit" value={lengthUnit} onChange={setLengthUnit} options={LENGTH_UNITS} />
				<NumberField
					label="Length"
					unit={lengthUnit}
					value={length}
					onChange={setLength}
					min={0}
					step={lengthUnit === 'ft' ? 0.5 : 1}
				/>
				<NumberField label="Number of boards" value={quantity} onChange={setQuantity} min={1} step={1} />
				<NumberField
					label="Waste allowance"
					unit="%"
					value={waste}
					onChange={setWaste}
					min={0}
					max={30}
					step={1}
				/>
				<NumberField
					label="Price per board foot (optional)"
					unit="$"
					value={price}
					onChange={setPrice}
					min={0}
					step={0.25}
					placeholder="e.g. 6.50"
				/>
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Total board feet</p>
						<p class="calc-result-value primary">{fmt(result.withWasteTotal, 2)} bd ft</p>
					</div>
					<div>
						<p class="calc-result-label">Per board</p>
						<p class="calc-result-value">{fmt(result.perPiece, 3)} bd ft</p>
					</div>
					<div>
						<p class="calc-result-label">Before waste allowance</p>
						<p class="calc-result-value">{fmt(result.total, 2)} bd ft</p>
					</div>
					{result.cost !== null && (
						<div>
							<p class="calc-result-label">Estimated cost</p>
							<p class="calc-result-value">{usd.format(result.cost)}</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Enter thickness, width, and length to see the board footage.</p>
			)}

			<p class="calc-note">
				Board feet = (thickness in. x width in. x length ft.) / 12, using the piece's actual
				measured dimensions, not the nominal size printed on the price tag. Rough-sawn hardwood is
				sold by the quarter (4/4 = 1", 8/4 = 2"), but once it's surfaced (S2S/S4S) the mill has
				already planed material off, so measure the board with calipers rather than assuming
				nominal equals actual. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
