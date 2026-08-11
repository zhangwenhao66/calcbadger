import { useState } from 'preact/hooks';
import { ABSOLUTE_ZERO, convertAll, isPhysicallyValid, round2, type TempUnit } from '../../lib/temperature';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const UNIT_LABEL: Record<TempUnit, string> = { C: '°C', F: '°F', K: 'K' };
const UNIT_NAME: Record<TempUnit, string> = { C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin' };

function fmt(n: number): string {
	return round2(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export default function TemperatureConverter() {
	const [from, setFrom] = useState<TempUnit>('C');
	const [value, setValue] = useState('100');

	const n = parseFloat(value);
	const valid = Number.isFinite(n);
	const results = valid ? convertAll(n, from) : null;
	const physical = valid ? isPhysicallyValid(n, from) : true;

	const others = (['C', 'F', 'K'] as TempUnit[]).filter((u) => u !== from);

	// Switching scales re-expresses the same physical temperature in the new
	// unit (e.g. 100°C -> 212°F) rather than reinterpreting the same digits
	// under a different scale, which would silently change the meaning of
	// whatever the visitor already typed.
	function switchTo(next: TempUnit) {
		if (next === from) return;
		if (valid) setValue(String(round2(convertAll(n, from)[next])));
		setFrom(next);
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Converting from"
					value={from}
					onChange={switchTo}
					options={[
						{ value: 'C', label: '°C', title: 'Celsius' },
						{ value: 'F', label: '°F', title: 'Fahrenheit' },
						{ value: 'K', label: 'K', title: 'Kelvin' },
					]}
				/>
				<NumberField
					label={`Temperature (${UNIT_NAME[from]})`}
					unit={UNIT_LABEL[from]}
					value={value}
					onChange={setValue}
					min={ABSOLUTE_ZERO[from]}
					step={from === 'K' ? 1 : 0.1}
				/>
			</div>

			{results && physical ? (
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
			) : results && !physical ? (
				<p class="calc-note">
					{fmt(n)} {UNIT_LABEL[from]} is below absolute zero ({fmt(ABSOLUTE_ZERO[from])}{' '}
					{UNIT_LABEL[from]}), which is not physically possible. Nothing can be colder than
					absolute zero on any scale.
				</p>
			) : (
				<p class="calc-note">Enter a temperature to convert it to the other two scales.</p>
			)}

			<p class="calc-note">
				°F = °C × 9/5 + 32 and K = °C + 273.15 are exact by definition (NIST SP 811). There is no
				rounding in the formula itself, only in the display above. Calculations run in your
				browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
