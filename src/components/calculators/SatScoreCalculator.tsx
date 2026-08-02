import { useState } from 'preact/hooks';
import {
	MATH_MAX_RAW,
	mathScoreRange,
	RW_MAX_RAW,
	rwScoreRange,
	totalScoreRange,
} from '../../lib/satScore';
import NumberField from '../ui/NumberField';

function clampInt(value: string, max: number): number | null {
	const n = Math.round(parseFloat(value));
	if (!Number.isFinite(n)) return null;
	return Math.min(Math.max(n, 0), max);
}

export default function SatScoreCalculator() {
	const [rwRaw, setRwRaw] = useState('50');
	const [mathRaw, setMathRaw] = useState('40');

	const rw = clampInt(rwRaw, RW_MAX_RAW);
	const math = clampInt(mathRaw, MATH_MAX_RAW);

	const rwRange = rw !== null ? rwScoreRange(rw) : null;
	const mathRange = math !== null ? mathScoreRange(math) : null;
	const total = rw !== null && math !== null ? totalScoreRange(rw, math) : null;

	const showRange = (r: { lower: number; upper: number }) =>
		r.lower === r.upper ? `${r.lower}` : `${r.lower}–${r.upper}`;

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField
					label={`Reading & Writing correct (0–${RW_MAX_RAW})`}
					value={rwRaw}
					onChange={setRwRaw}
					min={0}
					max={RW_MAX_RAW}
					step={1}
					inputMode="numeric"
				/>
				<NumberField
					label={`Math correct (0–${MATH_MAX_RAW})`}
					value={mathRaw}
					onChange={setMathRaw}
					min={0}
					max={MATH_MAX_RAW}
					step={1}
					inputMode="numeric"
				/>
			</div>

			{rwRange && mathRange && total ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Total score (400–1600)</p>
						<p class="calc-result-value primary">{showRange(total)}</p>
					</div>
					<div>
						<p class="calc-result-label">Reading &amp; Writing (200–800)</p>
						<p class="calc-result-value">{showRange(rwRange)}</p>
					</div>
					<div>
						<p class="calc-result-label">Math (200–800)</p>
						<p class="calc-result-value">{showRange(mathRange)}</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter the number of correct answers in each section.</p>
			)}

			<p class="calc-note">
				Uses the official raw-score conversion table from College Board's scoring guide for paper
				SAT Practice Test #4 (66 Reading &amp; Writing questions, 54 Math questions). Scores come
				out as a range because the real digital SAT is adaptive, so treat this as an estimate, not a
				score report. Bluebook digital practice tests are scored in the app itself. Calculations run
				in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
