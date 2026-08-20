import { useState } from 'preact/hooks';
import { formatYMD, isValidDate, ymdFromJsDate, type YMD } from '../../lib/dateCalculator';
import {
	computeProration,
	occupiedDaysForMoveIn,
	occupiedDaysForMoveOut,
	type ProrationMethod,
} from '../../lib/proratedRent';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

type Mode = 'moveIn' | 'moveOut';

const METHODS: { value: ProrationMethod; label: string; title: string }[] = [
	{ value: 'actual', label: 'Actual days', title: "Actual/Actual: divide by this month's real day count" },
	{ value: 'banker', label: "Banker's month", title: '30/360: every month treated as exactly 30 days' },
	{ value: 'annual', label: 'Annual (365)', title: 'Annual/365: divide the yearly rent by 365 (366 in a leap year)' },
];

function fmtMoney(n: number): string {
	return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

function today(): YMD {
	return ymdFromJsDate(new Date());
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

export default function ProratedRentCalculator() {
	const [mode, setMode] = useState<Mode>('moveIn');
	const [method, setMethod] = useState<ProrationMethod>('actual');
	const [rent, setRent] = useState('1500');
	const [date, setDate] = useState(fieldsFromYMD(today()));

	const ymd = toYMD(date);
	const rentNum = parseFloat(rent);
	const rentValid = Number.isFinite(rentNum) && rentNum >= 0;

	const daysOccupied = ymd
		? mode === 'moveIn'
			? occupiedDaysForMoveIn(ymd.year, ymd.month, ymd.day)
			: occupiedDaysForMoveOut(ymd.year, ymd.month, ymd.day)
		: null;

	const results =
		ymd && rentValid && daysOccupied !== null
			? METHODS.map((m) => ({
					...m,
					result: computeProration(rentNum, m.value, ymd, daysOccupied),
				}))
			: null;
	const selected = results?.find((r) => r.value === method)?.result ?? null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Situation"
					value={mode}
					onChange={setMode}
					options={[
						{ value: 'moveIn', label: 'Moving in mid-month' },
						{ value: 'moveOut', label: 'Moving out mid-month' },
					]}
					wide
				/>
				<NumberField label="Monthly rent" value={rent} onChange={setRent} unit="$" min={0} step={1} />
				<NumberField
					label={mode === 'moveIn' ? 'Move-in date — month' : 'Move-out date — month'}
					value={date.month}
					onChange={(v) => setDate({ ...date, month: v })}
					min={1}
					max={12}
					step={1}
					inputMode="numeric"
				/>
				<NumberField
					label="— day"
					value={date.day}
					onChange={(v) => setDate({ ...date, day: v })}
					min={1}
					max={31}
					step={1}
					inputMode="numeric"
				/>
				<NumberField
					label="— year"
					value={date.year}
					onChange={(v) => setDate({ ...date, year: v })}
					min={1}
					max={9999}
					step={1}
					inputMode="numeric"
				/>
				<Segmented label="Day-count method" value={method} onChange={setMethod} options={METHODS} wide />
			</div>

			{selected ? (
				<>
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Days {mode === 'moveIn' ? 'occupied this month' : 'occupied before move-out'}</p>
							<p class="calc-result-value primary">{selected.daysOccupied}</p>
						</div>
						<div>
							<p class="calc-result-label">Daily rate</p>
							<p class="calc-result-value">{fmtMoney(selected.dailyRate)}</p>
						</div>
						<div>
							<p class="calc-result-label">Prorated rent</p>
							<p class="calc-result-value primary">{fmtMoney(selected.proratedRent)}</p>
						</div>
					</div>
					<div class="calc-results">
						{results!.map((r) => (
							<div key={r.value}>
								<p class="calc-result-label">{r.label}</p>
								<p class="calc-result-value">{r.result ? fmtMoney(r.result.proratedRent) : '—'}</p>
							</div>
						))}
					</div>
				</>
			) : (
				<p class="calc-note">
					Enter a monthly rent of $0 or more and a real calendar date ({ymd ? formatYMD(ymd) : 'e.g. a valid day for that month'}).
				</p>
			)}

			<p class="calc-note">
				"Actual days" divides by this month's real length (28–31 days); "banker's month" always divides by 30,
				the 30/360 convention bond and loan markets use for partial periods; "annual (365)" divides the yearly
				rent (monthly × 12) by 365, or 366 in a leap year. All three agree exactly in a 30-day month and diverge
				elsewhere, so check the lease for which one applies. Calculations run in your browser; nothing you type
				is sent anywhere.
			</p>
		</div>
	);
}
