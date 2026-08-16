import { useState } from 'preact/hooks';
import {
	CALLIGRAPHY_STYLES,
	DEFAULT_PRACTICE_TEXT,
	getCalligraphyStyle,
	LOWERCASE_LETTERS,
	MAX_LENGTH,
	sanitizePracticeText,
	UPPERCASE_LETTERS,
} from '../../lib/calligraphyAlphabet';
import Segmented from '../ui/Segmented';

export default function CalligraphyAlphabetGenerator() {
	const [styleKey, setStyleKey] = useState<string>('blackletter');
	const [text, setText] = useState(DEFAULT_PRACTICE_TEXT);

	const style = getCalligraphyStyle(styleKey);
	const preview = text.trim().length > 0 ? text : DEFAULT_PRACTICE_TEXT;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Style"
					value={styleKey}
					onChange={setStyleKey}
					options={CALLIGRAPHY_STYLES.map((s) => ({
						value: s.key,
						label: s.shortLabel,
						title: s.label,
					}))}
					wide
				/>
			</div>

			<label class="calc-field">
				<span class="calc-label">Type a word or your name</span>
				<div class="nf">
					<input
						class="nf-input calligraphy-text-input"
						type="text"
						value={text}
						placeholder="Try your name"
						maxLength={MAX_LENGTH}
						autocomplete="off"
						spellcheck={false}
						onInput={(e) => setText(sanitizePracticeText((e.target as HTMLInputElement).value))}
					/>
				</div>
			</label>

			<div class="calligraphy-preview-box">
				<p class="calc-result-label">{style.label} preview</p>
				<p class={`calligraphy-preview ${style.fontClass}`}>{preview}</p>
			</div>

			<p class="calc-note">
				This preview uses a display font standing in for {style.label.toLowerCase()} calligraphy,
				not a stroke-by-stroke pen guide. Letters, spaces, apostrophes, and hyphens only, up to{' '}
				{MAX_LENGTH} characters.
			</p>

			<div class="calligraphy-chart">
				<AlphabetRow letters={UPPERCASE_LETTERS} caseLabel="Uppercase" fontClass={style.fontClass} />
				<AlphabetRow letters={LOWERCASE_LETTERS} caseLabel="Lowercase" fontClass={style.fontClass} />
			</div>
		</div>
	);
}

function AlphabetRow({
	letters,
	caseLabel,
	fontClass,
}: {
	letters: readonly string[];
	caseLabel: string;
	fontClass: string;
}) {
	return (
		<div class="calligraphy-alphabet-row">
			<p class="calc-result-label calligraphy-row-label">{caseLabel}</p>
			<div class="calligraphy-alphabet-grid">
				{letters.map((letter) => (
					<div class="calligraphy-cell" key={letter}>
						<span class={`calligraphy-cell-glyph ${fontClass}`}>{letter}</span>
						<span class="calligraphy-cell-print">{letter}</span>
					</div>
				))}
			</div>
		</div>
	);
}
