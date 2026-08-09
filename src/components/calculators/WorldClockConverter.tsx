import { useEffect, useMemo, useState } from 'preact/hooks';
import {
	CITIES,
	convertTime,
	formatOffsetLabel,
	getDstInfo,
	partsInZone,
	type CityZone,
} from '../../lib/worldClock';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select, { type SelectOption } from '../ui/Select';

type Mode = 'now' | 'convert';

const WEEKDAY_FULL: Record<string, string> = {
	Mon: 'Monday',
	Tue: 'Tuesday',
	Wed: 'Wednesday',
	Thu: 'Thursday',
	Fri: 'Friday',
	Sat: 'Saturday',
	Sun: 'Sunday',
};

const MONTH_NAMES = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December',
];

const CITY_OPTIONS: SelectOption<string>[] = CITIES.slice()
	.sort((a, b) => a.city.localeCompare(b.city))
	.map((c) => ({ value: c.id, label: c.city === c.region ? c.city : `${c.city}, ${c.region}` }));

function cityById(id: string): CityZone {
	return CITIES.find((c) => c.id === id) ?? CITIES[0]!;
}

function pad2(n: number): string {
	return String(n).padStart(2, '0');
}

function fmtLongDate(year: number, month: number, day: number, weekday: string): string {
	const w = WEEKDAY_FULL[weekday] ?? weekday;
	return `${w}, ${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

export default function WorldClockConverter() {
	const [mode, setMode] = useState<Mode>('now');
	const [nowCityId, setNowCityId] = useState('new-york');
	const [tick, setTick] = useState(() => new Date());

	useEffect(() => {
		const id = window.setInterval(() => setTick(new Date()), 1000);
		return () => window.clearInterval(id);
	}, []);

	const nowCity = cityById(nowCityId);
	const nowParts = partsInZone(tick, nowCity.timeZone);
	const nowDst = getDstInfo(tick, nowCity.timeZone);

	// Convert mode
	const [fromCityId, setFromCityId] = useState('london');
	const [toCityId, setToCityId] = useState('tokyo');
	const seedParts = useMemo(() => partsInZone(new Date(), cityById(fromCityId).timeZone), []); // eslint-disable-line react-hooks/exhaustive-deps
	const [date, setDate] = useState({
		month: String(seedParts.month),
		day: String(seedParts.day),
		year: String(seedParts.year),
	});
	const [time, setTime] = useState({ hour: String(seedParts.hour), minute: String(pad2(seedParts.minute)) });

	const fromCity = cityById(fromCityId);
	const toCity = cityById(toCityId);

	const month = parseFloat(date.month);
	const day = parseFloat(date.day);
	const year = parseFloat(date.year);
	const hour = parseFloat(time.hour);
	const minute = parseFloat(time.minute);
	const validInputs =
		[month, day, year, hour, minute].every(Number.isFinite) &&
		Number.isInteger(month) && month >= 1 && month <= 12 &&
		Number.isInteger(day) && day >= 1 && day <= 31 &&
		Number.isInteger(year) && year >= 1 && year <= 9999 &&
		Number.isInteger(hour) && hour >= 0 && hour <= 23 &&
		Number.isInteger(minute) && minute >= 0 && minute <= 59;

	const result = validInputs
		? convertTime({ year, month, day, hour, minute }, fromCity.timeZone, toCity.timeZone)
		: null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Mode"
					value={mode}
					onChange={setMode}
					options={[
						{ value: 'now', label: 'World clock' },
						{ value: 'convert', label: 'Convert a time' },
					]}
					wide
				/>

				{mode === 'now' && (
					<Select label="City" value={nowCityId} onChange={setNowCityId} options={CITY_OPTIONS} wide />
				)}

				{mode === 'convert' && (
					<>
						<Select label="From" value={fromCityId} onChange={setFromCityId} options={CITY_OPTIONS} wide />
						<NumberField label="Month" value={date.month} onChange={(v) => setDate({ ...date, month: v })} min={1} max={12} step={1} inputMode="numeric" />
						<NumberField label="Day" value={date.day} onChange={(v) => setDate({ ...date, day: v })} min={1} max={31} step={1} inputMode="numeric" />
						<NumberField label="Year" value={date.year} onChange={(v) => setDate({ ...date, year: v })} min={1} max={9999} step={1} inputMode="numeric" />
						<NumberField label="Hour (24h)" value={time.hour} onChange={(v) => setTime({ ...time, hour: v })} min={0} max={23} step={1} inputMode="numeric" />
						<NumberField label="Minute" value={time.minute} onChange={(v) => setTime({ ...time, minute: v })} min={0} max={59} step={1} inputMode="numeric" />
						<Select label="To" value={toCityId} onChange={setToCityId} options={CITY_OPTIONS} wide />
					</>
				)}
			</div>

			{mode === 'now' && (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">{nowCity.city === nowCity.region ? nowCity.city : `${nowCity.city}, ${nowCity.region}`}</p>
						<p class="calc-result-value primary">
							{pad2(nowParts.hour)}:{pad2(nowParts.minute)}:{pad2(nowParts.second)}
						</p>
					</div>
					<div>
						<p class="calc-result-label">Date</p>
						<p class="calc-result-value">{fmtLongDate(nowParts.year, nowParts.month, nowParts.day, nowParts.weekday)}</p>
					</div>
					<div>
						<p class="calc-result-label">UTC offset</p>
						<p class="calc-result-value">
							{formatOffsetLabel(nowDst.isCurrentlyDst ? nowDst.dstOffsetMinutes : nowDst.standardOffsetMinutes)}
						</p>
					</div>
					<div>
						<p class="calc-result-label">Daylight saving</p>
						<p class="calc-result-value">
							{!nowDst.observesDst ? 'Not observed here' : nowDst.isCurrentlyDst ? 'In effect now' : 'Not in effect now'}
						</p>
					</div>
				</div>
			)}

			{mode === 'convert' &&
				(result ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">{toCity.city === toCity.region ? toCity.city : `${toCity.city}, ${toCity.region}`}</p>
							<p class="calc-result-value primary">
								{pad2(result.target.hour)}:{pad2(result.target.minute)}
							</p>
						</div>
						<div>
							<p class="calc-result-label">Date there</p>
							<p class="calc-result-value">{fmtLongDate(result.target.year, result.target.month, result.target.day, result.target.weekday)}</p>
						</div>
						<div>
							<p class="calc-result-label">Day difference</p>
							<p class="calc-result-value">
								{result.dayShift === 0
									? 'Same calendar day'
									: result.dayShift > 0
										? `${result.dayShift} day${result.dayShift === 1 ? '' : 's'} ahead`
										: `${Math.abs(result.dayShift)} day${Math.abs(result.dayShift) === 1 ? '' : 's'} behind`}
							</p>
						</div>
						<div>
							<p class="calc-result-label">Time gap</p>
							<p class="calc-result-value">
								{result.hourDifference === 0
									? 'Same time zone offset'
									: `${Math.abs(result.hourDifference)} hr ${result.hourDifference > 0 ? 'ahead' : 'behind'}`}
							</p>
						</div>
					</div>
				) : (
					<p class="calc-note">Enter a valid date and 24-hour time (hour 0–23, minute 0–59).</p>
				))}

			<p class="calc-note">
				Every offset and daylight-saving transition is read live from your browser's IANA time zone
				database (the same source every OS and browser uses) rather than a stored table, so results
				stay correct across DST changes in either zone. Calculations run in your browser; nothing you
				enter is sent anywhere.
			</p>
		</div>
	);
}
