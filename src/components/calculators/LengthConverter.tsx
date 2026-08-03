import { useState } from 'preact/hooks';
import { convertAll, roundSig, UNITS, type LengthUnit } from '../../lib/length';
import NumberField from '../ui/NumberField';
import Select from '../ui/Select';

const UNIT_LABEL: Record<LengthUnit, string> = {
	mm: 'mm',
	cm: 'cm',
	m: 'm',
	km: 'km',
	in: 'in',
	ft: 'ft',
	yd: 'yd',
	mi: 'mi',
};

const UNIT_NAME: Record<LengthUnit, string> = {
	mm: 'Millimeters',
	cm: 'Centimeters',
	m: 'Meters',
	km: 'Kilometers',
	in: 'Inches',
	ft: 'Feet',
	yd: 'Yards',
	mi: 'Miles',
};

function fmt(n: number): string {
	return roundSig(n).toLocaleString('en-US', { maximumFractionDigits: 10 });
}

export default function LengthConverter() {
	const [from, setFrom] = useState<LengthUnit>('cm');
	const [value, setValue] = useState('30');

	const n = parseFloat(value);
	const parsed = Number.isFinite(n);
	// A physical length can't be negative, unlike temperature (which has
	// Celsius/Fahrenheit readings below zero) — so unlike TemperatureConverter's
	// absolute-zero floor, any negative value here is simply out of range.
	const negative = parsed && n < 0;
	const valid = parsed && !negative;
	const results = valid ? convertAll(n, from) : null;
	const others = UNITS.filter((u) => u !== from);

	// Switching units re-expresses the same physical length in the new unit
	// rather than reinterpreting the same digits, so "30" typed as cm becomes
	// "11.811..." when you switch to inches instead of silently meaning
	// something else.
	function switchTo(next: LengthUnit) {
		if (next === from) return;
		// Re-express whatever was typed, even if it's out of range (negative) —
		// otherwise switching units would reinterpret the same digits under a
		// new unit instead of converting them, same failure mode `parsed` guards
		// against above.
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
					label={`Length (${UNIT_NAME[from]})`}
					unit={UNIT_LABEL[from]}
					value={value}
					onChange={setValue}
					min={0}
					step={from === 'km' || from === 'mi' ? 0.01 : 0.1}
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
				<p class="calc-note">A length can't be negative — enter a value of 0 or more.</p>
			) : (
				<p class="calc-note">Enter a length to convert it to the other seven units.</p>
			)}

			<p class="calc-note">
				1 in = 2.54 cm, 1 ft = 0.3048 m, and 1 mi = 1,609.344 m are exact by international
				agreement (1959 International Yard and Pound Agreement / NIST Handbook 44) — not measured
				approximations, so there is no rounding error in the conversion itself, only in how many
				digits are displayed above. Calculations run in your browser; nothing you type is sent
				anywhere.
			</p>
		</div>
	);
}
