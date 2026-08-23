import { useState } from 'preact/hooks';
import {
	ageDifference,
	creepinessRuleMinAge,
	passesCreepinessRule,
} from '../../lib/ageDifference';
import { addDays, isValidDate, ymdFromJsDate, type YMD } from '../../lib/dateCalculator';
import NumberField from '../ui/NumberField';

function today(): YMD {
	return ymdFromJsDate(new Date());
}

// Same 3-field month/day/year entry DateCalculator.tsx uses — there is no
// native <input type="date"> on this site (its OS calendar popup would paint
// system chrome over the dark instrument).
function DateFields({
	legend,
	date,
	onChange,
}: {
	legend: string;
	date: { month: string; day: string; year: string };
	onChange: (next: { month: string; day: string; year: string }) => void;
}) {
	return (
		<>
			<NumberField
				label={`${legend} — month`}
				value={date.month}
				onChange={(v) => onChange({ ...date, month: v })}
				min={1}
				max={12}
				step={1}
				inputMode="numeric"
			/>
			<NumberField
				label={`${legend} — day`}
				value={date.day}
				onChange={(v) => onChange({ ...date, day: v })}
				min={1}
				max={31}
				step={1}
				inputMode="numeric"
			/>
			<NumberField
				label={`${legend} — year`}
				value={date.year}
				onChange={(v) => onChange({ ...date, year: v })}
				min={1}
				max={9999}
				step={1}
				inputMode="numeric"
			/>
		</>
	);
}

function toYMD(f: { month: string; day: string; year: string }): YMD | null {
	const month = parseFloat(f.month);
	const day = parseFloat(f.day);
	const year = parseFloat(f.year);
	const ymd = { year, month, day };
	return isValidDate(ymd) ? ymd : null;
}

function fieldsFromYMD(d: YMD): { month: string; day: string; year: string } {
	return { month: String(d.month), day: String(d.day), year: String(d.year) };
}

function formatAge(years: number): string {
	return years.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

export default function AgeDifferenceCalculator() {
	const t = today();
	// Defaults recompute from today's date on every load rather than a fixed
	// date, so the example stays illustrative (a live ~5-year gap) no matter
	// when the page is viewed — same convention DateCalculator.tsx uses.
	const [birthA, setBirthA] = useState(fieldsFromYMD(addDays(t, -30 * 365)));
	const [birthB, setBirthB] = useState(fieldsFromYMD(addDays(t, -25 * 365)));

	const a = toYMD(birthA);
	const b = toYMD(birthB);
	const valid = a !== null && b !== null;

	const result = valid ? ageDifference(a, b, t) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<DateFields legend="Person 1's birth date" date={birthA} onChange={setBirthA} />
				<DateFields legend="Person 2's birth date" date={birthB} onChange={setBirthB} />
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Age gap</p>
						<p class="calc-result-value primary">
							{result.gap.years}y {result.gap.months}m {result.gap.days}d
						</p>
					</div>
					<div>
						<p class="calc-result-label">Total days apart</p>
						<p class="calc-result-value">{result.totalDaysGap.toLocaleString('en-US')} days</p>
					</div>
					<div>
						<p class="calc-result-label">Person 1's age today</p>
						<p class="calc-result-value">
							{formatAge(result.ageA)} {result.aIsOlder ? '(older)' : '(younger)'}
						</p>
					</div>
					<div>
						<p class="calc-result-label">Person 2's age today</p>
						<p class="calc-result-value">
							{formatAge(result.ageB)} {result.aIsOlder ? '(younger)' : '(older)'}
						</p>
					</div>
					<div>
						<p class="calc-result-label">Gap as % of the older person's age</p>
						<p class="calc-result-value">{result.gapPercentOfOlder.toLocaleString('en-US', { maximumFractionDigits: 1 })}%</p>
					</div>
					<div>
						<p class="calc-result-label">"Half your age plus seven" reference</p>
						<p class="calc-result-value">
							{(() => {
								const olderAge = result.aIsOlder ? result.ageA : result.ageB;
								const youngerAge = result.aIsOlder ? result.ageB : result.ageA;
								const floor = creepinessRuleMinAge(olderAge);
								const clears = passesCreepinessRule(olderAge, youngerAge);
								return `Min. age by this rule: ${formatAge(floor)} (this gap ${clears ? 'clears' : 'falls under'} it)`;
							})()}
						</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter two valid calendar dates (e.g. a real day-of-month for the given month/year).</p>
			)}

			<p class="calc-note">
				Ages are calculated as of today, in your browser. "Half your age plus seven" is a commonly cited rule of thumb
				(see the FAQ below), not a scientific standard — shown here for reference only. Calculations run locally;
				nothing you type is sent anywhere.
			</p>
		</div>
	);
}
