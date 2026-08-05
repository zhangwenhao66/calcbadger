import { useState } from 'preact/hooks';
import { convertAll, roundSig, UNITS, type VolumeUnit } from '../../lib/volume';
import NumberField from '../ui/NumberField';
import Select from '../ui/Select';

const UNIT_LABEL: Record<VolumeUnit, string> = {
	tsp: 'tsp',
	tbsp: 'tbsp',
	floz: 'fl oz',
	cup: 'cup',
	pint: 'pt',
	quart: 'qt',
	gallon: 'gal',
	ml: 'mL',
	l: 'L',
};

const UNIT_NAME: Record<VolumeUnit, string> = {
	tsp: 'Teaspoons',
	tbsp: 'Tablespoons',
	floz: 'Fluid ounces',
	cup: 'Cups',
	pint: 'Pints',
	quart: 'Quarts',
	gallon: 'Gallons',
	ml: 'Milliliters',
	l: 'Liters',
};

const STEP: Record<VolumeUnit, number> = {
	tsp: 0.25,
	tbsp: 0.25,
	floz: 0.5,
	cup: 0.25,
	pint: 0.5,
	quart: 0.25,
	gallon: 0.1,
	ml: 10,
	l: 0.1,
};

function fmt(n: number): string {
	const r = roundSig(n);
	// This converter's unit range spans tsp to gallon — a smaller span than
	// weight's mcg-to-ton, but a very small from-value (e.g. 1 tsp expressed
	// in gallons, ~0.0013) still needs more than toLocaleString's 10-decimal
	// cap can misrender for extreme inputs, so keep the same guard the other
	// converters use rather than assuming this range never needs it.
	if (r !== 0 && Math.abs(r) < 1e-6) {
		const decimals = Math.min(20, Math.max(0, 6 - Math.ceil(Math.log10(Math.abs(r)))));
		return r.toFixed(decimals);
	}
	return r.toLocaleString('en-US', { maximumFractionDigits: 10 });
}

export default function VolumeConverter() {
	const [from, setFrom] = useState<VolumeUnit>('cup');
	const [value, setValue] = useState('1');

	const n = parseFloat(value);
	const parsed = Number.isFinite(n);
	// A physical volume can't be negative — unlike a volume *change* (topping
	// off a tank by some delta, e.g.), which this single-value converter isn't modeling.
	const negative = parsed && n < 0;
	const valid = parsed && !negative;
	const results = valid ? convertAll(n, from) : null;
	const others = UNITS.filter((u) => u !== from);

	// Switching units re-expresses the same physical volume in the new unit
	// rather than reinterpreting the same digits, so "1" typed as cup becomes
	// "8" when you switch to fl oz instead of silently meaning something else.
	function switchTo(next: VolumeUnit) {
		if (next === from) return;
		if (parsed) setValue(String(roundSig(convertAll(n, from)[next])));
		setFrom(next);
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select
					label="Converting from"
					value={from}
					onChange={switchTo}
					options={UNITS.map((u) => ({ value: u, label: `${UNIT_NAME[u]} (${UNIT_LABEL[u]})` }))}
					wide
				/>
				<NumberField
					label={`Volume (${UNIT_NAME[from]})`}
					unit={UNIT_LABEL[from]}
					value={value}
					onChange={setValue}
					min={0}
					step={STEP[from]}
				/>
			</div>

			{results ? (
				<div class="calc-results">
					{others.map((u) => (
						<div key={u}>
							<p class="calc-result-label">{UNIT_NAME[u]}</p>
							<p class="calc-result-value primary">
								{fmt(results[u])} {UNIT_LABEL[u]}
							</p>
						</div>
					))}
				</div>
			) : negative ? (
				<p class="calc-note">A volume can't be negative — enter a value of 0 or more.</p>
			) : (
				<p class="calc-note">Enter a volume to convert it to the other eight units.</p>
			)}

			<p class="calc-note">
				1 US gallon = 3.785411784 liters exactly (NIST Handbook 44, Appendix C) — every other
				unit here is an exact legal ratio of that one figure (4 qt/gal, 2 pt/qt, 2 cup/pt, 8 fl
				oz/cup, 2 tbsp/fl oz, 3 tsp/tbsp), so there is no rounding error in the conversion itself,
				only in how many digits are displayed above. Calculations run in your browser; nothing
				you type is sent anywhere.
			</p>
		</div>
	);
}
