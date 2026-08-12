import { useState } from 'preact/hooks';
import {
	coneSurfaceArea,
	coneVolume,
	cylinderSurfaceArea,
	cylinderVolume,
	prismSurfaceArea,
	prismVolume,
	sphereSurfaceArea,
	sphereVolume,
	type Shape,
} from '../../lib/geometry';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const SHAPES = [
	{ value: 'prism' as Shape, label: 'Rectangular Prism' },
	{ value: 'cylinder' as Shape, label: 'Cylinder' },
	{ value: 'sphere' as Shape, label: 'Sphere' },
	{ value: 'cone' as Shape, label: 'Cone' },
];

type LengthUnit = 'ft' | 'in' | 'yd' | 'm' | 'cm';

const UNITS = [
	{ value: 'ft' as LengthUnit, label: 'ft', title: 'feet' },
	{ value: 'in' as LengthUnit, label: 'in', title: 'inches' },
	{ value: 'yd' as LengthUnit, label: 'yd', title: 'yards' },
	{ value: 'm' as LengthUnit, label: 'm', title: 'meters' },
	{ value: 'cm' as LengthUnit, label: 'cm', title: 'centimeters' },
];

function fmt(n: number, digits = 3): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function ShapeVolumeCalculator() {
	const [shape, setShape] = useState<Shape>('prism');
	const [unit, setUnit] = useState<LengthUnit>('ft');
	const [length, setLength] = useState('3');
	const [width, setWidth] = useState('4');
	const [height, setHeight] = useState('5');
	const [radius, setRadius] = useState('3');

	const l = parseFloat(length);
	const w = parseFloat(width);
	const h = parseFloat(height);
	const r = parseFloat(radius);

	let volume: number | null = null;
	let surfaceArea: number | null = null;

	if (shape === 'prism' && l > 0 && w > 0 && h > 0) {
		volume = prismVolume(l, w, h);
		surfaceArea = prismSurfaceArea(l, w, h);
	}
	if (shape === 'cylinder' && r > 0 && h > 0) {
		volume = cylinderVolume(r, h);
		surfaceArea = cylinderSurfaceArea(r, h);
	}
	if (shape === 'sphere' && r > 0) {
		volume = sphereVolume(r);
		surfaceArea = sphereSurfaceArea(r);
	}
	if (shape === 'cone' && r > 0 && h > 0) {
		volume = coneVolume(r, h);
		surfaceArea = coneSurfaceArea(r, h);
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented label="Shape" value={shape} onChange={setShape} options={SHAPES} wide />
				<Segmented label="Unit" value={unit} onChange={setUnit} options={UNITS} wide />

				{shape === 'prism' && (
					<>
						<NumberField label="Length" unit={unit} value={length} onChange={setLength} min={0} step={0.5} />
						<NumberField label="Width" unit={unit} value={width} onChange={setWidth} min={0} step={0.5} />
						<NumberField label="Height" unit={unit} value={height} onChange={setHeight} min={0} step={0.5} />
					</>
				)}

				{(shape === 'cylinder' || shape === 'sphere' || shape === 'cone') && (
					<NumberField label="Radius" unit={unit} value={radius} onChange={setRadius} min={0} step={0.5} />
				)}

				{(shape === 'cylinder' || shape === 'cone') && (
					<NumberField label="Height" unit={unit} value={height} onChange={setHeight} min={0} step={0.5} />
				)}
			</div>

			{volume !== null && surfaceArea !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Volume</p>
						<p class="calc-result-value primary">
							{fmt(volume)} {unit}³
						</p>
					</div>
					<div>
						<p class="calc-result-label">Surface area</p>
						<p class="calc-result-value">
							{fmt(surfaceArea)} {unit}²
						</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter the dimensions to see the volume and surface area.</p>
			)}

			<p class="calc-note">
				Sphere, cylinder, and cone use radius, not diameter: if you only know the diameter, halve
				it first. A cone's surface area here is the total surface (base circle plus the slanted
				side), not the lateral surface alone. Calculations run in your browser; nothing you type
				is sent anywhere.
			</p>
		</div>
	);
}
