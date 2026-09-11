import { useState } from 'preact/hooks';
import {
	bandForWpm,
	computeTypingSpeed,
	type EntryMode,
} from '../../lib/wordsPerMinuteAverage';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const MODE_OPTIONS: { value: EntryMode; label: string }[] = [
	{ value: 'words', label: 'Words typed' },
	{ value: 'characters', label: 'Characters typed' },
];

export default function WordsPerMinuteAverage() {
	const [mode, setMode] = useState<EntryMode>('words');
	const [amount, setAmount] = useState('90');
	const [minutes, setMinutes] = useState('2');
	const [errors, setErrors] = useState('3');

	const amountNum = parseFloat(amount);
	const minutesNum = parseFloat(minutes);
	const errorsNum = errors === '' ? 0 : parseFloat(errors);

	const result =
		Number.isFinite(amountNum) && Number.isFinite(minutesNum) && Number.isFinite(errorsNum)
			? computeTypingSpeed({ mode, amount: amountNum, minutes: minutesNum, errors: errorsNum })
			: null;

	const band = result ? bandForWpm(result.netWpm) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented label="Count by" value={mode} onChange={setMode} options={MODE_OPTIONS} />
				<NumberField
					label={mode === 'words' ? 'Words typed' : 'Characters typed'}
					value={amount}
					onChange={setAmount}
					min={0}
					step={mode === 'words' ? 1 : 5}
					inputMode="decimal"
				/>
				<NumberField
					label="Time taken"
					value={minutes}
					onChange={setMinutes}
					unit="min"
					min={0}
					step={0.5}
					inputMode="decimal"
				/>
				<NumberField
					label={mode === 'words' ? 'Uncorrected wrong words' : 'Uncorrected wrong characters'}
					value={errors}
					onChange={setErrors}
					min={0}
					step={1}
					inputMode="decimal"
				/>
			</div>

			{result !== null ? (
				<>
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Net WPM</p>
							<p class="calc-result-value primary">{result.netWpm}</p>
						</div>
						<div>
							<p class="calc-result-label">Gross WPM</p>
							<p class="calc-result-value">{result.grossWpm}</p>
						</div>
						<div>
							<p class="calc-result-label">Accuracy</p>
							<p class="calc-result-value">{result.accuracyPct}%</p>
						</div>
					</div>

					{band && (
						<p class="calc-note">
							{result.netWpm} net WPM sits in the <strong>{band.label.toLowerCase()}</strong> range (
							{band.low === band.high ? `${band.low}` : `${band.low}-${band.high}`} WPM in the cited
							research). {band.note}
						</p>
					)}

					<p class="calc-note">
						Net WPM is gross WPM minus your uncorrected errors, prorated by time — the score typing
						certifications and employers use, since it reflects how much correct text you actually
						produced rather than just how fast your fingers moved.
					</p>
				</>
			) : (
				<p class="calc-note">
					Enter a positive amount and time, with errors no greater than the amount typed, to see your
					typing speed.
				</p>
			)}

			<p class="calc-note">
				Word count uses the standard text-entry convention of 5 characters per word (including spaces and
				punctuation), so scores from character counts and from word counts are directly comparable.
			</p>

			<p class="calc-note">Calculations run in your browser; nothing you type is sent anywhere.</p>
		</div>
	);
}
