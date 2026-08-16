import { useState } from 'preact/hooks';
import {
	generateLetters,
	lettersForSet,
	probabilitiesFor,
	tallyLetters,
	type LetterSet,
	type Weighting,
} from '../../lib/randomLetter';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const MAX_COUNT = 20;
const HISTORY_LIMIT = 60;

function pct(x: number): string {
	return `${(x * 100).toFixed(1)}%`;
}

export default function RandomLetterGenerator() {
	const [set, setSet] = useState<LetterSet>('all');
	const [weighting, setWeighting] = useState<Weighting>('equal');
	const [letterCase, setLetterCase] = useState<'upper' | 'lower'>('upper');
	const [countStr, setCountStr] = useState('5');
	const [result, setResult] = useState<string[] | null>(null);
	const [history, setHistory] = useState<string[]>([]);

	const countNum = Math.round(parseFloat(countStr) || 0);
	const valid = countNum >= 1 && countNum <= MAX_COUNT;

	function generate() {
		if (!valid) return;
		const letters = generateLetters(countNum, set, weighting);
		setResult(letters);
		setHistory((h) => [...h, ...letters].slice(-HISTORY_LIMIT));
	}

	// Switching the letter set changes which letters are even valid, so old
	// history/result entries (e.g. a consonant drawn under "All A-Z") would be
	// stale and inconsistent with the newly selected set's own live stats
	// ("Letters in play" / "Most likely to come up") if left in place.
	function changeSet(next: LetterSet) {
		setSet(next);
		setHistory([]);
		setResult(null);
	}

	const displayCase = (l: string) => (letterCase === 'upper' ? l.toUpperCase() : l);

	const setLetters = lettersForSet(set);
	const probs = probabilitiesFor(setLetters, weighting);
	const topIndex = probs.indexOf(Math.max(...probs));
	const topLetter = setLetters[topIndex];

	const tally = tallyLetters(history);
	const topDrawn = tally[0];

	return (
		<div class="calc">
			<Segmented
				label="Letters"
				value={set}
				onChange={(v) => changeSet(v as LetterSet)}
				options={[
					{ value: 'all', label: 'All A-Z' },
					{ value: 'vowels', label: 'Vowels', title: 'Vowels only: a, e, i, o, u' },
					{ value: 'consonants', label: 'Consonants', title: 'Consonants only' },
				]}
				wide
			/>

			<Segmented
				label="Weighting"
				value={weighting}
				onChange={(v) => setWeighting(v as Weighting)}
				options={[
					{ value: 'equal', label: 'Equal chance' },
					{ value: 'frequency', label: 'English frequency' },
				]}
			/>

			<Segmented
				label="Case"
				value={letterCase}
				onChange={(v) => setLetterCase(v as 'upper' | 'lower')}
				options={[
					{ value: 'upper', label: 'UPPERCASE' },
					{ value: 'lower', label: 'lowercase' },
				]}
			/>

			<div class="calc-grid">
				<NumberField
					label="How many letters"
					value={countStr}
					onChange={setCountStr}
					min={1}
					max={MAX_COUNT}
					step={1}
					inputMode="numeric"
				/>
			</div>

			{!valid && (
				<p class="calc-note">Enter between 1 and {MAX_COUNT} letters.</p>
			)}

			<button type="button" class="op-button" onClick={generate} disabled={!valid}>
				Generate {countNum > 0 ? countNum : ''} letter{countNum === 1 ? '' : 's'}
			</button>

			{result && (
				<p
					class="calc-note"
					style="margin-top:0.9rem;text-align:center;font-size:2rem;font-weight:700;letter-spacing:0.15em;line-height:1.6"
				>
					{result.map((l, i) => (
						<span key={i} class="calc-result-value primary" style="margin:0 0.15em">
							{displayCase(l)}
						</span>
					))}
				</p>
			)}

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Letters in play</p>
					<p class="calc-result-value">{setLetters.length}</p>
				</div>
				<div>
					<p class="calc-result-label">Most likely to come up</p>
					<p class="calc-result-value">
						{weighting === 'frequency' ? (
							<>
								{displayCase(topLetter!)}{' '}
								<span style="font-size:0.8rem;font-weight:400;color:var(--chassis-muted)">
									({pct(probs[topIndex]!)})
								</span>
							</>
						) : (
							<span style="font-size:1rem;font-weight:400;color:var(--chassis-muted)">
								all tied at {pct(probs[topIndex]!)}
							</span>
						)}
					</p>
				</div>
				<div>
					<p class="calc-result-label">Draws this session</p>
					<p class="calc-result-value">{history.length}</p>
				</div>
				<div>
					<p class="calc-result-label">Most drawn so far</p>
					<p class="calc-result-value">
						{topDrawn ? `${displayCase(topDrawn.letter)} ×${topDrawn.count}` : '—'}
					</p>
				</div>
			</div>

			{history.length > 0 && (
				<p class="calc-note" style="margin-top:0.9rem;line-height:2;letter-spacing:0.02em">
					{history.map((l, i) => (
						<span
							key={i}
							style="display:inline-block;width:1.4em;text-align:center;font-weight:600;color:var(--op)"
						>
							{displayCase(l)}
						</span>
					))}
				</p>
			)}

			<p class="calc-note">
				{weighting === 'equal'
					? 'Every letter in the set has an equal chance on each draw.'
					: "Draws are weighted by how often each letter shows up in English text (see the frequency table below), so vowels like e and common consonants like t and n come up more than q or z."}{' '}
				Each letter is drawn independently in your browser, the same way rolling a die twice gives
				two unrelated results, so the same letter can come up more than once in one batch. Nothing
				you enter or generate is sent anywhere.
			</p>
		</div>
	);
}
