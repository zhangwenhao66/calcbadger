import { useState } from 'preact/hooks';
import { FONT_PRESETS, SPACING_OPTIONS, pagesFromWords, wordsFromPages, wordsPerPage } from '../../lib/wordsToPages';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const fontOptions = FONT_PRESETS.map((f) => ({ value: f.id, label: f.label }));

const round1 = (n: number) => Math.round(n * 10) / 10;

export default function WordsToPagesCalculator() {
	const [mode, setMode] = useState<'words' | 'pages'>('words');
	const [wordCount, setWordCount] = useState('1000');
	const [pageCount, setPageCount] = useState('4');
	const [fontId, setFontId] = useState(FONT_PRESETS[0]!.id);
	const [spacingId, setSpacingId] = useState('double');

	const font = FONT_PRESETS.find((f) => f.id === fontId) ?? FONT_PRESETS[0]!;
	const spacing = SPACING_OPTIONS.find((s) => s.id === spacingId) ?? SPACING_OPTIONS[0]!;
	const perPage = wordsPerPage(font.singleSpacedWordsPerPage, spacing.multiplier);

	const words = parseFloat(wordCount);
	const pages = parseFloat(pageCount);

	const wordsValid = Number.isFinite(words) && words >= 0;
	const pagesValid = Number.isFinite(pages) && pages >= 0;

	const result =
		mode === 'words' ? (wordsValid ? pagesFromWords(words, perPage) : null) : pagesValid ? wordsFromPages(pages, perPage) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Direction"
					value={mode}
					onChange={setMode}
					options={[
						{ value: 'words', label: 'Words → pages' },
						{ value: 'pages', label: 'Pages → words' },
					]}
					wide
				/>
				{mode === 'words' ? (
					<NumberField label="Word count" value={wordCount} onChange={setWordCount} min={0} step={100} />
				) : (
					<NumberField label="Page count" value={pageCount} onChange={setPageCount} min={0} step={1} />
				)}
				<Select label="Font" value={fontId} onChange={setFontId} options={fontOptions} />
				<Select
					label="Line spacing"
					value={spacingId}
					onChange={setSpacingId}
					options={SPACING_OPTIONS.map((s) => ({ value: s.id, label: s.label }))}
				/>
			</div>

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">{mode === 'words' ? 'Estimated pages' : 'Estimated words'}</p>
						<p class="calc-result-value primary">{mode === 'words' ? round1(result) : Math.round(result).toLocaleString()}</p>
					</div>
					<div>
						<p class="calc-result-label">Words per page at this setting</p>
						<p class="calc-result-value">{round1(perPage)}</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter a {mode === 'words' ? 'word' : 'page'} count of 0 or more to see the estimate.</p>
			)}

			<p class="calc-note">
				Estimate based on {font.label}, {spacing.label.toLowerCase()} ({round1(perPage)} words/page). Actual page count
				varies with margins, headings, and paragraph breaks, so treat this as a planning number, not an exact count.
				Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
