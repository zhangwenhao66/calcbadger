import { useState } from 'preact/hooks';
import { convertAll, roundSig, UNITS, type TimeUnit } from '../../lib/time';
import NumberField from '../ui/NumberField';
import Select from '../ui/Select';

const UNIT_LABEL: Record<TimeUnit, string> = {
	second: 'sec',
	minute: 'min',
	hour: 'hr',
	day: 'day',
	week: 'wk',
	month: 'mo',
	year: 'yr',
};

const UNIT_NAME: Record<TimeUnit, string> = {
	second: 'Seconds',
	minute: 'Minutes',
	hour: 'Hours',
	day: 'Days',
	week: 'Weeks',
	month: 'Months (mean)',
	year: 'Years (mean)',
};

const STEP: Record<TimeUnit, number> = {
	second: 60,
	minute: 5,
	hour: 1,
	day: 0.5,
	week: 0.1,
	month: 0.05,
	year: 0.01,
};

function fmt(n: number): string {
	const r = roundSig(n);
	// This converter's unit range spans seconds to years — over 7.5 orders of
	// magnitude, wider than length's mm-to-mile (~6.2). toLocaleString's
	// maximumFractionDigits caps at 10 decimal places, which would silently
	// render a correctly-computed value like "1 second in years" (3.17e-8) as
	// "0". Below that threshold, format with enough fixed decimals to preserve
	// the 6 significant figures roundSig already computed, instead of
	// truncating them away.
	if (r !== 0 && Math.abs(r) < 1e-6) {
		const decimals = Math.min(20, Math.max(0, 6 - Math.ceil(Math.log10(Math.abs(r)))));
		return r.toFixed(decimals);
	}
	return r.toLocaleString('en-US', { maximumFractionDigits: 10 });
}

export default function TimeConverter() {
	const [from, setFrom] = useState<TimeUnit>('day');
	const [value, setValue] = useState('1');

	const n = parseFloat(value);
	const parsed = Number.isFinite(n);
	// A duration can't be negative — this single-value converter isn't
	// modeling a signed offset like "3 days ago."
	const negative = parsed && n < 0;
	const valid = parsed && !negative;
	const results = valid ? convertAll(n, from) : null;
	const others = UNITS.filter((u) => u !== from);

	// Switching units re-expresses the same duration in the new unit rather
	// than reinterpreting the same digits, so "1" typed as days becomes
	// "24" when you switch to hours instead of silently meaning something else.
	function switchTo(next: TimeUnit) {
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
					label={`Duration (${UNIT_NAME[from]})`}
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
				<p class="calc-note">A duration can't be negative — enter a value of 0 or more.</p>
			) : (
				<p class="calc-note">Enter a duration to convert it to the other six units.</p>
			)}

			<p class="calc-note">
				Seconds through weeks are exact by definition (1 day = 24 h = 86,400 s, 1 week = 7 days).
				Months and years have no single fixed length on the calendar, so this converter uses the
				mean Gregorian month (30.436875 days) and mean Gregorian year (365.2425 days) — the exact
				average over the calendar's 400-year leap-year cycle, not an estimate. Calculations run in
				your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
