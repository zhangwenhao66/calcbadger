import { useState } from 'preact/hooks';
import {
	addDays,
	calendarDiff,
	daysBetween,
	fixedHoliday,
	formatYMD,
	isValidDate,
	nextOccurrence,
	usThanksgiving,
	weekdayIndex,
	ymdFromJsDate,
	type YMD,
} from '../../lib/dateCalculator';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

type Mode = 'diff' | 'add' | 'until';

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function today(): YMD {
	return ymdFromJsDate(new Date());
}

// A 3-field month/day/year date entry. There is no native <input type="date">
// on this site — its OS calendar popup would paint system chrome over the
// dark instrument, same problem the site's Select and NumberField components
// were built to avoid for dropdowns and number spinners.
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
	// parseFloat (not parseInt) so a typed "6.5" surfaces as invalid instead of
	// silently truncating to 6 — isValidDate's Number.isInteger check catches
	// it, matching how the "Shift date" offset field already rejects decimals.
	const month = parseFloat(f.month);
	const day = parseFloat(f.day);
	const year = parseFloat(f.year);
	const ymd = { year, month, day };
	return isValidDate(ymd) ? ymd : null;
}

function fieldsFromYMD(d: YMD): { month: string; day: string; year: string } {
	return { month: String(d.month), day: String(d.day), year: String(d.year) };
}

export default function DateCalculator() {
	const [mode, setMode] = useState<Mode>('diff');

	const t = today();
	const [start, setStart] = useState(fieldsFromYMD(t));
	const [end, setEnd] = useState(fieldsFromYMD(addDays(t, 30)));

	const [baseDate, setBaseDate] = useState(fieldsFromYMD(t));
	const [offset, setOffset] = useState('30');
	const [direction, setDirection] = useState<'add' | 'subtract'>('add');

	const startYmd = toYMD(start);
	const endYmd = toYMD(end);
	const diffValid = startYmd !== null && endYmd !== null;
	const totalDays = diffValid ? daysBetween(startYmd, endYmd) : null;
	const breakdown = diffValid ? calendarDiff(startYmd, endYmd) : null;

	const baseYmd = toYMD(baseDate);
	const offsetNum = parseFloat(offset);
	const offsetValid = Number.isFinite(offsetNum) && Number.isInteger(offsetNum) && offsetNum >= 0;
	const addCandidate =
		baseYmd && offsetValid ? addDays(baseYmd, direction === 'add' ? offsetNum : -offsetNum) : null;
	// A large enough offset can push the result past year 1 or year 9999 — the
	// same range this tool's own date fields accept — so re-validate the
	// computed result rather than trusting arithmetic on a valid input to stay
	// in range.
	const addResult = addCandidate && isValidDate(addCandidate) ? addCandidate : null;
	const addOutOfRange = addCandidate !== null && addResult === null;

	const untilBase = t;
	const holidays: { label: string; date: YMD }[] = [
		{ label: "New Year's Day", date: nextOccurrence((y) => fixedHoliday('newYearsDay', y), untilBase) },
		{ label: 'Halloween', date: nextOccurrence((y) => fixedHoliday('halloween', y), untilBase) },
		{ label: 'Thanksgiving (US)', date: nextOccurrence(usThanksgiving, untilBase) },
		{ label: 'Christmas', date: nextOccurrence((y) => fixedHoliday('christmas', y), untilBase) },
	].sort((a, b) => daysBetween(untilBase, a.date) - daysBetween(untilBase, b.date));

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Calculator"
					value={mode}
					onChange={setMode}
					options={[
						{ value: 'diff', label: 'Difference' },
						{ value: 'add', label: 'Shift date', title: 'Add or subtract days from a date' },
						{ value: 'until', label: 'Days until' },
					]}
					wide
				/>

				{mode === 'diff' && (
					<>
						<DateFields legend="Start date" date={start} onChange={setStart} />
						<DateFields legend="End date" date={end} onChange={setEnd} />
					</>
				)}

				{mode === 'add' && (
					<>
						<DateFields legend="Date" date={baseDate} onChange={setBaseDate} />
						<NumberField label="Number of days" value={offset} onChange={setOffset} min={0} step={1} inputMode="numeric" />
						<Segmented
							label="Direction"
							value={direction}
							onChange={setDirection}
							options={[
								{ value: 'add', label: 'Add' },
								{ value: 'subtract', label: 'Subtract' },
							]}
						/>
					</>
				)}
			</div>

			{mode === 'diff' &&
				(diffValid && totalDays !== null && breakdown ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Total days</p>
							<p class="calc-result-value primary">
								{Math.abs(totalDays).toLocaleString('en-US')} {Math.abs(totalDays) === 1 ? 'day' : 'days'}
							</p>
						</div>
						<div>
							<p class="calc-result-label">Calendar span</p>
							<p class="calc-result-value">
								{breakdown.negative ? '−' : ''}
								{breakdown.years}y {breakdown.months}m {breakdown.days}d
							</p>
						</div>
						<div>
							<p class="calc-result-label">In weeks</p>
							<p class="calc-result-value">
								{(Math.abs(totalDays) / 7).toLocaleString('en-US', { maximumFractionDigits: 1 })} weeks
							</p>
						</div>
						<div>
							<p class="calc-result-label">End date falls on</p>
							<p class="calc-result-value">{WEEKDAY_NAMES[weekdayIndex(endYmd)]}</p>
						</div>
					</div>
				) : (
					<p class="calc-note">Enter two valid calendar dates (e.g. a real day-of-month for the given month/year).</p>
				))}

			{mode === 'add' &&
				(addResult ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Result date</p>
							<p class="calc-result-value primary">{formatYMD(addResult)}</p>
						</div>
						<div>
							<p class="calc-result-label">Falls on</p>
							<p class="calc-result-value">{WEEKDAY_NAMES[weekdayIndex(addResult)]}</p>
						</div>
					</div>
				) : addOutOfRange ? (
					<p class="calc-note">That shift lands outside year 1–9999 — try a smaller number of days.</p>
				) : (
					<p class="calc-note">Enter a valid date and a whole number of days (0 or more).</p>
				))}

			{mode === 'until' && (
				<div class="calc-results">
					{holidays.map((h) => {
						const days = daysBetween(untilBase, h.date);
						return (
							<div key={h.label}>
								<p class="calc-result-label">{h.label}</p>
								<p class="calc-result-value primary">
									{days === 0 ? 'Today' : `${days.toLocaleString('en-US')} ${days === 1 ? 'day' : 'days'}`}
								</p>
								<p class="calc-result-value">{formatYMD(h.date)}</p>
							</div>
						);
					})}
				</div>
			)}

			<p class="calc-note">
				{mode === 'until'
					? "Countdown is based on today's date in your browser."
					: 'All three modes use the proleptic Gregorian calendar (the standard civil calendar) with no time-of-day component — a "day" always means one full calendar date. Calculations run in your browser; nothing you type is sent anywhere.'}
			</p>
		</div>
	);
}
