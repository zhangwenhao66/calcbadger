import { useState } from 'preact/hooks';
import { addDays, isValidDate, ymdFromJsDate, type YMD } from '../../lib/dateCalculator';
import {
	breakdownSeconds,
	durationBetweenDateTimes,
	durationBetweenTimes,
	formatClockTime12,
	formatClockTime24,
	from12Hour,
	isValidClockTime,
	shiftTime,
	to12Hour,
	type ClockTime,
	type DurationBreakdown,
	type Period,
} from '../../lib/timeDuration';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

type Mode = 'between' | 'shift' | 'datetime';
type Format = '12' | '24';

const MODES = [
	{ value: 'between' as Mode, label: 'Between two times' },
	{ value: 'shift' as Mode, label: 'Add or subtract a duration' },
	{ value: 'datetime' as Mode, label: 'Between two full dates and times' },
];

interface TimeFieldsState {
	hour: string;
	minute: string;
	period: Period;
}

function today(): YMD {
	return ymdFromJsDate(new Date());
}

function fieldsFromClockTime(t: ClockTime, format: Format): TimeFieldsState {
	if (format === '24') {
		return { hour: String(t.hours), minute: String(t.minutes), period: 'AM' };
	}
	const { hour12, period } = to12Hour(t);
	return { hour: String(hour12), minute: String(t.minutes), period };
}

function toClockTime(f: TimeFieldsState, format: Format): ClockTime | null {
	const hour = parseFloat(f.hour);
	const minute = parseFloat(f.minute);
	if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
	if (minute < 0 || minute > 59) return null;
	if (format === '24') {
		if (hour < 0 || hour > 23) return null;
		const candidate = { hours: hour, minutes: minute, seconds: 0 };
		return isValidClockTime(candidate) ? candidate : null;
	}
	if (hour < 1 || hour > 12) return null;
	return from12Hour(hour, minute, 0, f.period);
}

// A 3-field month/day/year date entry, matching this site's DateCalculator —
// there is no native <input type="date"> here because its OS calendar
// popup paints system chrome over the dark instrument.
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

function TimeFields({
	legend,
	time,
	format,
	onChange,
}: {
	legend: string;
	time: TimeFieldsState;
	format: Format;
	onChange: (next: TimeFieldsState) => void;
}) {
	return (
		<>
			<NumberField
				label={`${legend} — hour`}
				value={time.hour}
				onChange={(v) => onChange({ ...time, hour: v })}
				min={format === '12' ? 1 : 0}
				max={format === '12' ? 12 : 23}
				step={1}
				inputMode="numeric"
			/>
			<NumberField
				label={`${legend} — minute`}
				value={time.minute}
				onChange={(v) => onChange({ ...time, minute: v })}
				min={0}
				max={59}
				step={1}
				inputMode="numeric"
			/>
			{format === '12' && (
				<Segmented
					label={`${legend} — AM/PM`}
					value={time.period}
					onChange={(p) => onChange({ ...time, period: p })}
					options={[
						{ value: 'AM', label: 'AM' },
						{ value: 'PM', label: 'PM' },
					]}
				/>
			)}
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

function formatTime(t: ClockTime, format: Format): string {
	return format === '12' ? formatClockTime12(t) : formatClockTime24(t);
}

function DurationResults({ b, format }: { b: DurationBreakdown; format: Format }) {
	return (
		<div class="calc-results">
			<div>
				<p class="calc-result-label">Duration</p>
				<p class="calc-result-value primary">
					{b.negative ? '−' : ''}
					{b.days > 0 ? `${b.days}d ` : ''}
					{b.hours}h {b.minutes}m{b.seconds > 0 ? ` ${b.seconds}s` : ''}
				</p>
			</div>
			<div>
				<p class="calc-result-label">In decimal hours</p>
				<p class="calc-result-value">
					{b.negative ? '−' : ''}
					{b.decimalHours.toLocaleString('en-US', { maximumFractionDigits: 2 })} hours
				</p>
			</div>
			<div>
				<p class="calc-result-label">In minutes</p>
				<p class="calc-result-value">
					{b.negative ? '−' : ''}
					{Math.round(b.totalSeconds < 0 ? -b.totalSeconds / 60 : b.totalSeconds / 60).toLocaleString('en-US')} min
				</p>
			</div>
		</div>
	);
}

export default function TimeDurationCalculator() {
	const [mode, setMode] = useState<Mode>('between');
	const [format, setFormat] = useState<Format>('12');

	const [between1, setBetween1] = useState<TimeFieldsState>(fieldsFromClockTime({ hours: 9, minutes: 0, seconds: 0 }, '12'));
	const [between2, setBetween2] = useState<TimeFieldsState>(fieldsFromClockTime({ hours: 17, minutes: 0, seconds: 0 }, '12'));

	const [shiftStart, setShiftStart] = useState<TimeFieldsState>(fieldsFromClockTime({ hours: 9, minutes: 0, seconds: 0 }, '12'));
	const [shiftHours, setShiftHours] = useState('1');
	const [shiftMinutes, setShiftMinutes] = useState('30');
	const [shiftDirection, setShiftDirection] = useState<'add' | 'subtract'>('add');

	const t0 = today();
	const [dtStartDate, setDtStartDate] = useState(fieldsFromYMD(t0));
	const [dtStartTime, setDtStartTime] = useState<TimeFieldsState>(fieldsFromClockTime({ hours: 9, minutes: 0, seconds: 0 }, '12'));
	const [dtEndDate, setDtEndDate] = useState(fieldsFromYMD(addDays(t0, 1)));
	const [dtEndTime, setDtEndTime] = useState<TimeFieldsState>(fieldsFromClockTime({ hours: 17, minutes: 0, seconds: 0 }, '12'));

	function changeFormat(next: Format) {
		// Re-render each stored time in the new format's hour convention so the
		// same instant survives the switch (e.g. 14:00 becomes 2:00 PM, not a
		// blank/invalid field).
		const convert = (f: TimeFieldsState) => {
			const ct = toClockTime(f, format);
			return ct ? fieldsFromClockTime(ct, next) : f;
		};
		setBetween1(convert(between1));
		setBetween2(convert(between2));
		setShiftStart(convert(shiftStart));
		setDtStartTime(convert(dtStartTime));
		setDtEndTime(convert(dtEndTime));
		setFormat(next);
	}

	const ct1 = toClockTime(between1, format);
	const ct2 = toClockTime(between2, format);
	const betweenResult = ct1 && ct2 ? durationBetweenTimes(ct1, ct2) : null;
	const betweenCrossesMidnight = ct1 && ct2 ? ct1.hours * 3600 + ct1.minutes * 60 >= ct2.hours * 3600 + ct2.minutes * 60 : false;

	const shiftCt = toClockTime(shiftStart, format);
	const hoursNum = parseFloat(shiftHours);
	const minutesNum = parseFloat(shiftMinutes);
	const durationValid = Number.isFinite(hoursNum) && hoursNum >= 0 && Number.isFinite(minutesNum) && minutesNum >= 0 && minutesNum < 60;
	const shiftResult =
		shiftCt && durationValid
			? shiftTime(shiftCt, hoursNum * 3600 + minutesNum * 60, shiftDirection === 'add' ? 1 : -1)
			: null;

	const dtStartYmd = toYMD(dtStartDate);
	const dtEndYmd = toYMD(dtEndDate);
	const dtStartCt = toClockTime(dtStartTime, format);
	const dtEndCt = toClockTime(dtEndTime, format);
	const dtResult =
		dtStartYmd && dtEndYmd && dtStartCt && dtEndCt
			? durationBetweenDateTimes({ date: dtStartYmd, time: dtStartCt }, { date: dtEndYmd, time: dtEndCt })
			: null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select label="Calculator" value={mode} onChange={setMode} options={MODES} wide />
				<Segmented
					label="Time format"
					value={format}
					onChange={changeFormat}
					options={[
						{ value: '12', label: '12-hour' },
						{ value: '24', label: '24-hour' },
					]}
				/>

				{mode === 'between' && (
					<>
						<TimeFields legend="Start time" time={between1} format={format} onChange={setBetween1} />
						<TimeFields legend="End time" time={between2} format={format} onChange={setBetween2} />
					</>
				)}

				{mode === 'shift' && (
					<>
						<TimeFields legend="Start time" time={shiftStart} format={format} onChange={setShiftStart} />
						<NumberField label="Hours" value={shiftHours} onChange={setShiftHours} min={0} step={1} inputMode="numeric" />
						<NumberField label="Minutes" value={shiftMinutes} onChange={setShiftMinutes} min={0} max={59} step={1} inputMode="numeric" />
						<Segmented
							label="Direction"
							value={shiftDirection}
							onChange={setShiftDirection}
							options={[
								{ value: 'add', label: 'Add' },
								{ value: 'subtract', label: 'Subtract' },
							]}
						/>
					</>
				)}

				{mode === 'datetime' && (
					<>
						<DateFields legend="Start date" date={dtStartDate} onChange={setDtStartDate} />
						<TimeFields legend="Start time" time={dtStartTime} format={format} onChange={setDtStartTime} />
						<DateFields legend="End date" date={dtEndDate} onChange={setDtEndDate} />
						<TimeFields legend="End time" time={dtEndTime} format={format} onChange={setDtEndTime} />
					</>
				)}
			</div>

			{mode === 'between' &&
				(betweenResult ? (
					<>
						<DurationResults b={betweenResult} format={format} />
						{betweenCrossesMidnight && (
							<p class="calc-note">
								The end time is at or before the start time, so this assumes it falls on the next day (an overnight span).
							</p>
						)}
					</>
				) : (
					<p class="calc-note">Enter a valid hour and minute for both times.</p>
				))}

			{mode === 'shift' &&
				(shiftResult ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Result time</p>
							<p class="calc-result-value primary">{formatTime(shiftResult.result, format)}</p>
						</div>
						{shiftResult.daysRolled !== 0 && (
							<div>
								<p class="calc-result-label">Crosses into</p>
								<p class="calc-result-value">
									{shiftResult.daysRolled > 0
										? `${shiftResult.daysRolled} day${shiftResult.daysRolled === 1 ? '' : 's'} later`
										: `${Math.abs(shiftResult.daysRolled)} day${Math.abs(shiftResult.daysRolled) === 1 ? '' : 's'} earlier`}
								</p>
							</div>
						)}
					</div>
				) : (
					<p class="calc-note">Enter a valid start time and a duration (0 or more hours, 0–59 minutes).</p>
				))}

			{mode === 'datetime' &&
				(dtResult ? (
					<>
						<DurationResults b={dtResult} format={format} />
						{dtResult.negative && <p class="calc-note">The end date-time is earlier than the start date-time.</p>}
					</>
				) : (
					<p class="calc-note">Enter two valid dates and times (e.g. a real day-of-month, hour 0–23 or 1–12 with AM/PM).</p>
				))}

			<p class="calc-note">
				Calculations run in your browser; nothing you type is sent anywhere. The "Between two times" and "Add/subtract"
				modes work on a single 24-hour clock; use "Two date-times" when the span crosses more than one calendar date and
				you want the day count included.
			</p>
		</div>
	);
}
