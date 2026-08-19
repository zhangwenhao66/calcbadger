import { useMemo, useState } from 'preact/hooks';
import { analyzeText, clampTextInput, readingEaseBand } from '../../lib/sentenceCounter';

const DEFAULT_TEXT =
	'Read the instructions first. Then fill in each blank. Check your answers before you submit the form.';

function formatReadingTime(minutes: number): string {
	if (minutes <= 0) return '0 sec';
	const totalSeconds = Math.round(minutes * 60);
	if (totalSeconds < 60) return `${totalSeconds} sec`;
	const wholeMinutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	if (wholeMinutes < 1) return `${seconds} sec`;
	return seconds === 0 ? `${wholeMinutes} min` : `${wholeMinutes} min ${seconds} sec`;
}

export default function SentenceCounter() {
	const [text, setText] = useState(DEFAULT_TEXT);

	const stats = useMemo(() => analyzeText(text), [text]);

	const fre = stats.fleschReadingEase;
	const fkg = stats.fleschKincaidGrade;

	return (
		<div class="calc">
			<label class="calc-field">
				<span class="calc-label">Paste or type your text</span>
				<div class="glitch-textarea-shell">
					<textarea
						class="glitch-textarea"
						value={text}
						placeholder="Paste a paragraph, an essay, an email draft…"
						spellcheck={false}
						rows={8}
						onInput={(e) => setText(clampTextInput((e.target as HTMLTextAreaElement).value))}
					/>
				</div>
			</label>

			<button type="button" class="op-button" style="margin-top:0.7rem" onClick={() => setText('')}>
				Clear
			</button>

			<div class="calc-results">
				<div>
					<p class="calc-result-label">Sentences</p>
					<p class="calc-result-value primary">{stats.sentences.toLocaleString('en-US')}</p>
				</div>
				<div>
					<p class="calc-result-label">Words</p>
					<p class="calc-result-value">{stats.words.toLocaleString('en-US')}</p>
				</div>
				<div>
					<p class="calc-result-label">Characters (with spaces)</p>
					<p class="calc-result-value">{stats.charactersWithSpaces.toLocaleString('en-US')}</p>
				</div>
				<div>
					<p class="calc-result-label">Characters (no spaces)</p>
					<p class="calc-result-value">{stats.charactersNoSpaces.toLocaleString('en-US')}</p>
				</div>
				<div>
					<p class="calc-result-label">Paragraphs</p>
					<p class="calc-result-value">{stats.paragraphs.toLocaleString('en-US')}</p>
				</div>
				<div>
					<p class="calc-result-label">Avg. words / sentence</p>
					<p class="calc-result-value">
						{stats.sentences > 0 ? stats.avgWordsPerSentence.toFixed(1) : '—'}
					</p>
				</div>
			</div>

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Estimated reading time</p>
					<p class="calc-result-value">{formatReadingTime(stats.readingTimeMinutes)}</p>
				</div>
				<div>
					<p class="calc-result-label">Flesch Reading Ease</p>
					<p class="calc-result-value">
						{fre !== null ? `${fre.toFixed(1)} · ${readingEaseBand(fre)}` : '—'}
					</p>
				</div>
				<div>
					<p class="calc-result-label">Flesch-Kincaid grade level</p>
					<p class="calc-result-value">{fkg !== null ? fkg.toFixed(1) : '—'}</p>
				</div>
			</div>

			<p class="calc-note">
				Sentence counting treats a run of . ! or ? as the end of a sentence, except when a single
				period sits inside a decimal number, follows a recognized abbreviation ("Dr.", "approx.",
				"Inc."), or follows a lone capital letter used as an initial. No punctuation rule gets
				every case right, so this one always reads an abbreviation's period as continuing the
				sentence, even on the rare occasion it actually ends one. Reading time uses 238 words per
				minute, the average adult silent non-fiction reading rate from Brysbaert's 2019
				meta-analysis of 190 studies.<sup>1</sup> The Flesch scores use the syllable-count formulas
				below; syllables are estimated from vowel groups, so an unusual word can be off by a
				syllable or two, which can shift the score by a couple of points without changing the
				reading-level band.
				Nothing typed here leaves your browser.
			</p>
		</div>
	);
}
