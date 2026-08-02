import { useState } from 'preact/hooks';
import {
	circleAreaSqFt,
	convertArea,
	costEstimate,
	lShapeAreaSqFt,
	rectangleAreaSqFt,
	toFeet,
	triangleAreaSqFt,
	type LengthUnit,
} from '../../lib/squareFootage';

type Shape = 'rectangle' | 'lshape' | 'circle' | 'triangle';

const UNITS: { label: string; value: LengthUnit }[] = [
	{ label: 'feet', value: 'ft' },
	{ label: 'inches', value: 'in' },
	{ label: 'yards', value: 'yd' },
	{ label: 'meters', value: 'm' },
	{ label: 'centimeters', value: 'cm' },
];

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function SquareFootageCalculator() {
	const [shape, setShape] = useState<Shape>('rectangle');
	const [unit, setUnit] = useState<LengthUnit>('ft');
	const [d1, setD1] = useState('12'); // length | diameter | base | L1
	const [d2, setD2] = useState('10'); // width | - | height | W1
	const [d3, setD3] = useState('8'); // L2
	const [d4, setD4] = useState('6'); // W2
	const [price, setPrice] = useState('');

	const n1 = toFeet(parseFloat(d1), unit);
	const n2 = toFeet(parseFloat(d2), unit);
	const n3 = toFeet(parseFloat(d3), unit);
	const n4 = toFeet(parseFloat(d4), unit);

	let sqFt: number | null = null;
	if (shape === 'rectangle' && n1 > 0 && n2 > 0) sqFt = rectangleAreaSqFt(n1, n2);
	if (shape === 'circle' && n1 > 0) sqFt = circleAreaSqFt(n1);
	if (shape === 'triangle' && n1 > 0 && n2 > 0) sqFt = triangleAreaSqFt(n1, n2);
	if (shape === 'lshape' && n1 > 0 && n2 > 0 && n3 > 0 && n4 > 0)
		sqFt = lShapeAreaSqFt(n1, n2, n3, n4);

	const conv = sqFt !== null ? convertArea(sqFt) : null;
	const priceNum = parseFloat(price);
	const cost = sqFt !== null && Number.isFinite(priceNum) && priceNum > 0 ? costEstimate(sqFt, priceNum) : null;

	const labels: Record<Shape, [string, string?, string?, string?]> = {
		rectangle: ['Length', 'Width'],
		circle: ['Diameter'],
		triangle: ['Base', 'Height'],
		lshape: ['Rectangle 1 length', 'Rectangle 1 width', 'Rectangle 2 length', 'Rectangle 2 width'],
	};
	const dims = labels[shape];
	const values = [d1, d2, d3, d4];
	const setters = [setD1, setD2, setD3, setD4];

	return (
		<div class="calc">
			<div class="calc-grid">
				<label class="calc-field">
					<span class="calc-label">Shape</span>
					<select
						class="calc-select"
						value={shape}
						onChange={(e) => setShape((e.target as HTMLSelectElement).value as Shape)}
					>
						<option value="rectangle">Rectangle / square</option>
						<option value="lshape">L-shape</option>
						<option value="circle">Circle</option>
						<option value="triangle">Triangle</option>
					</select>
				</label>
				<label class="calc-field">
					<span class="calc-label">Measured in</span>
					<select
						class="calc-select"
						value={unit}
						onChange={(e) => setUnit((e.target as HTMLSelectElement).value as LengthUnit)}
					>
						{UNITS.map((u) => (
							<option value={u.value}>{u.label}</option>
						))}
					</select>
				</label>
				{dims.map((label, i) =>
					label ? (
						<label class="calc-field">
							<span class="calc-label">
								{label} ({unit})
							</span>
							<input
								class="calc-input"
								type="number"
								inputMode="decimal"
								min="0"
								step="0.1"
								value={values[i]}
								onInput={(e) => setters[i]!((e.target as HTMLInputElement).value)}
							/>
						</label>
					) : null,
				)}
				<label class="calc-field">
					<span class="calc-label">Price per sq ft ($, optional)</span>
					<input
						class="calc-input"
						type="number"
						inputMode="decimal"
						min="0"
						step="0.25"
						value={price}
						placeholder="e.g. 3.50"
						onInput={(e) => setPrice((e.target as HTMLInputElement).value)}
					/>
				</label>
			</div>

			{conv ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Square feet</p>
						<p class="calc-result-value primary">{fmt(conv.sqFt)} ft²</p>
					</div>
					<div>
						<p class="calc-result-label">Square meters</p>
						<p class="calc-result-value">{fmt(conv.sqM)} m²</p>
					</div>
					<div>
						<p class="calc-result-label">Square yards</p>
						<p class="calc-result-value">{fmt(conv.sqYd)} yd²</p>
					</div>
					<div>
						<p class="calc-result-label">Acres</p>
						<p class="calc-result-value">{fmt(conv.acres, 4)}</p>
					</div>
					{cost !== null && (
						<div>
							<p class="calc-result-label">Estimated cost</p>
							<p class="calc-result-value">{usd.format(cost)}</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Enter the dimensions to see the area.</p>
			)}

			<p class="calc-note">
				All inputs are converted to feet first (1 ft = 0.3048 m exactly). For an L-shaped room,
				split it into two rectangles and enter both. Calculations run in your browser; nothing you
				type is sent anywhere.
			</p>
		</div>
	);
}
