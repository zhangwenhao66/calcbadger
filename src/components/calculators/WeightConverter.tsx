import { useState } from 'preact/hooks';
import { convertAll, roundSig, UNITS, type WeightUnit } from '../../lib/weight';
import NumberField from '../ui/NumberField';
import Select from '../ui/Select';

const UNIT_LABEL: Record<WeightUnit, string> = {
	mcg: 'mcg',
	mg: 'mg',
	g: 'g',
	kg: 'kg',
	oz: 'oz',
	lb: 'lb',
	ton: 'US ton',
};

const UNIT_NAME: Record<WeightUnit, string> = {
	mcg: 'Micrograms',
	mg: 'Milligrams',
	g: 'Grams',
	kg: 'Kilograms',
	oz: 'Ounces',
	lb: 'Pounds',
	ton: 'US tons (short, 2,000 lb)',
};

const STEP: Record<WeightUnit, number> = {
	mcg: 1000,
	mg: 10,
	g: 1,
	kg: 0.1,
	oz: 0.5,
	lb: 0.1,
	ton: 0.01,
};

function fmt(n: number): string {
	const r = roundSig(n);
	// This converter's unit range spans mcg to US ton — about 12 orders of
	// magnitude, wider than length's mm-to-mile (~6.4). toLocaleString's
	// maximumFractionDigits caps at 10 decimal places, which would silently
	// render a correctly-computed value like "1 mcg in tons" (1.1e-12) as "0".
	// Below that threshold, format with enough fixed decimals to preserve the
	// 6 significant figures roundSig already computed, instead of truncating them away.
	if (r !== 0 && Math.abs(r) < 1e-6) {
		const decimals = Math.min(20, Math.max(0, 6 - Math.ceil(Math.log10(Math.abs(r)))));
		return r.toFixed(decimals);
	}
	return r.toLocaleString('en-US', { maximumFractionDigits: 10 });
}

export default function WeightConverter() {
	const [from, setFrom] = useState<WeightUnit>('kg');
	const [value, setValue] = useState('70');

	const n = parseFloat(value);
	const parsed = Number.isFinite(n);
	// A physical mass can't be negative — unlike a weight *change* (a person's
	// weight-loss delta, e.g.), which this single-value converter isn't modeling.
	const negative = parsed && n < 0;
	const valid = parsed && !negative;
	const results = valid ? convertAll(n, from) : null;
	const others = UNITS.filter((u) => u !== from);

	// Switching units re-expresses the same physical mass in the new unit rather
	// than reinterpreting the same digits, so "70" typed as kg becomes
	// "154.32..." when you switch to lb instead of silently meaning something else.
	function switchTo(next: WeightUnit) {
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
					label={`Weight (${UNIT_NAME[from]})`}
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
				<p class="calc-note">A weight can't be negative — enter a value of 0 or more.</p>
			) : (
				<p class="calc-note">Enter a weight to convert it to the other six units.</p>
			)}

			<p class="calc-note">
				1 lb = 0.45359237 kg and 1 oz = 28.349523125 g are exact by international agreement (1959
				International Yard and Pound Agreement / NIST Handbook 44) — not measured approximations,
				so there is no rounding error in the conversion itself, only in how many digits are
				displayed above. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
