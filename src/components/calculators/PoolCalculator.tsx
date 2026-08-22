import { useState } from 'preact/hooks';
import {
	averageDepth,
	gallonsToLiters,
	lbToKg,
	ovalGallons,
	rectangleGallons,
	roundGallons,
	saltLbsNeeded,
	type PoolShape,
} from '../../lib/pool';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

type Mode = 'volume' | 'salt';

const MODES: { value: Mode; label: string }[] = [
	{ value: 'volume', label: 'Pool volume' },
	{ value: 'salt', label: 'Salt needed' },
];

const SHAPES: { value: PoolShape; label: string }[] = [
	{ value: 'rectangle', label: 'Rectangle' },
	{ value: 'round', label: 'Round' },
	{ value: 'oval', label: 'Oval' },
];

function fmt(n: number, digits = 0): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function PoolCalculator() {
	const [mode, setMode] = useState<Mode>('volume');

	// Volume mode state
	const [shape, setShape] = useState<PoolShape>('rectangle');
	const [length, setLength] = useState('32');
	const [width, setWidth] = useState('16');
	const [diameter, setDiameter] = useState('24');
	const [ovalLength, setOvalLength] = useState('20');
	const [ovalWidth, setOvalWidth] = useState('12');
	const [shallowDepth, setShallowDepth] = useState('3');
	const [deepDepth, setDeepDepth] = useState('8');

	// Salt mode state
	const [gallons, setGallons] = useState('15000');
	const [currentPpm, setCurrentPpm] = useState('0');
	const [targetPpm, setTargetPpm] = useState('3200');

	const shallowFt = parseFloat(shallowDepth);
	const deepFt = parseFloat(deepDepth);
	const avgDepthFt = Number.isFinite(shallowFt) && Number.isFinite(deepFt) ? averageDepth(shallowFt, deepFt) : NaN;

	let volumeGallons = NaN;
	if (Number.isFinite(avgDepthFt) && avgDepthFt > 0) {
		if (shape === 'rectangle') {
			const l = parseFloat(length);
			const w = parseFloat(width);
			if (l > 0 && w > 0) volumeGallons = rectangleGallons(l, w, avgDepthFt);
		} else if (shape === 'round') {
			const d = parseFloat(diameter);
			if (d > 0) volumeGallons = roundGallons(d, avgDepthFt);
		} else {
			const l = parseFloat(ovalLength);
			const w = parseFloat(ovalWidth);
			if (l > 0 && w > 0) volumeGallons = ovalGallons(l, w, avgDepthFt);
		}
	}
	const hasVolume = Number.isFinite(volumeGallons) && volumeGallons > 0;

	const gal = parseFloat(gallons);
	const cur = parseFloat(currentPpm);
	const tgt = parseFloat(targetPpm);
	const validSaltInputs = gal > 0 && Number.isFinite(cur) && Number.isFinite(tgt);
	const saltLb = validSaltInputs ? saltLbsNeeded(gal, cur, tgt) : NaN;
	// saltLbsNeeded returns 0 (not NaN) when tgt <= cur, so "hasSalt" only
	// covers the genuine-dose case -- the already-at-target branch below
	// needs validSaltInputs, not Number.isFinite(saltLb), to ever render.
	const hasSalt = validSaltInputs && tgt > cur;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented label="Calculate" value={mode} onChange={setMode} options={MODES} wide />
			</div>

			{mode === 'volume' ? (
				<>
					<div class="calc-grid">
						<Segmented label="Pool shape" value={shape} onChange={setShape} options={SHAPES} wide />

						{shape === 'rectangle' && (
							<>
								<NumberField label="Length" unit="ft" value={length} onChange={setLength} min={0} step={1} />
								<NumberField label="Width" unit="ft" value={width} onChange={setWidth} min={0} step={1} />
							</>
						)}
						{shape === 'round' && (
							<NumberField label="Diameter" unit="ft" value={diameter} onChange={setDiameter} min={0} step={1} />
						)}
						{shape === 'oval' && (
							<>
								<NumberField label="Length" unit="ft" value={ovalLength} onChange={setOvalLength} min={0} step={1} />
								<NumberField label="Width" unit="ft" value={ovalWidth} onChange={setOvalWidth} min={0} step={1} />
							</>
						)}

						<NumberField
							label="Shallow end depth"
							unit="ft"
							value={shallowDepth}
							onChange={setShallowDepth}
							min={0}
							step={0.5}
						/>
						<NumberField label="Deep end depth" unit="ft" value={deepDepth} onChange={setDeepDepth} min={0} step={0.5} />
					</div>

					{hasVolume ? (
						<div class="calc-results">
							<div>
								<p class="calc-result-label">Pool volume</p>
								<p class="calc-result-value primary">{fmt(volumeGallons)} gal</p>
							</div>
							<div>
								<p class="calc-result-label">In liters</p>
								<p class="calc-result-value">{fmt(gallonsToLiters(volumeGallons))} L</p>
							</div>
							<div>
								<p class="calc-result-label">Average depth</p>
								<p class="calc-result-value">{avgDepthFt.toFixed(2)} ft</p>
							</div>
						</div>
					) : (
						<p class="calc-note">Enter the pool's dimensions and both end depths to see its volume.</p>
					)}

					<p class="calc-note">
						Rectangular and round use exact geometry (prism and cylinder volume) times the precise 7.480519
						gal/ft³ conversion, which is why they land a hair off the rounded "7.5"/"5.9" shortcuts some pool
						guides print. Oval pools are built as a stadium shape (a rectangle with two semicircular ends),
						not a true ellipse, so there's no clean formula to derive. That mode uses the 6.7 multiplier
						published in Hayward's Aqua Rite manual instead. Calculations run in your browser; nothing you
						type is sent anywhere.
					</p>
				</>
			) : (
				<>
					<div class="calc-grid">
						<NumberField label="Pool volume" unit="gal" value={gallons} onChange={setGallons} min={0} step={100} />
						<NumberField
							label="Current salt level"
							unit="ppm"
							value={currentPpm}
							onChange={setCurrentPpm}
							min={0}
							step={100}
						/>
						<NumberField
							label="Target salt level"
							unit="ppm"
							value={targetPpm}
							onChange={setTargetPpm}
							min={0}
							step={100}
						/>
					</div>
					{hasVolume && mode === 'salt' && (
						<p class="calc-note">
							Volume tab computed {fmt(volumeGallons)} gal for your pool. Enter that above if it's this pool.
						</p>
					)}

					{hasSalt ? (
						<div class="calc-results">
							<div>
								<p class="calc-result-label">Salt to add</p>
								<p class="calc-result-value primary">{fmt(saltLb, 1)} lb</p>
							</div>
							<div>
								<p class="calc-result-label">In kilograms</p>
								<p class="calc-result-value">{fmt(lbToKg(saltLb), 1)} kg</p>
							</div>
						</div>
					) : (
						<p class="calc-note">
							{validSaltInputs
								? "Current level is already at or above target, so no salt is needed. (This calculator doesn't model diluting an over-salted pool.)"
								: "Enter your pool's gallons and current/target salt levels."}
						</p>
					)}

					<p class="calc-note">
						Add salt gradually and let it fully dissolve (run the pump, brush any undissolved salt off the
						floor) before retesting. Dumping the full amount at once risks localized over-concentration
						near the bottom. 2,700-3,400 ppm is a typical saltwater chlorine generator operating window,
						with 3,200 ppm a common target; check your specific cell's manual for its exact spec. Calculations
						run in your browser; nothing you type is sent anywhere.
					</p>
				</>
			)}
		</div>
	);
}
