import { useState } from 'preact/hooks';
import {
	DEFAULT_PRACTICE_TEXT,
	LOWERCASE_LETTERS,
	MAX_LENGTH,
	sanitizePracticeText,
	UPPERCASE_LETTERS,
} from '../../lib/cursiveText';

export default function CursiveAlphabetGenerator() {
	const [text, setText] = useState(DEFAULT_PRACTICE_TEXT);

	const preview = text.trim().length > 0 ? text : DEFAULT_PRACTICE_TEXT;

	return (
		<div class="calc">
			<label class="calc-field">
				<span class="calc-label">Type a word or your name</span>
				<div class="nf">
					<input
						class="nf-input cursive-text-input"
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

			<div class="cursive-preview-box">
				<p class="calc-result-label">Cursive preview</p>
				<p class="cursive-preview">{preview}</p>
			</div>

			<p class="calc-note">
				This preview uses a cursive display font, not real handwriting strokes. It's a way to see a
				word or name in a cursive style before you (or a student) write it out by hand. Letters,
				spaces, apostrophes, and hyphens only, up to {MAX_LENGTH} characters.
			</p>

			<div class="cursive-chart">
				<AlphabetRow letters={UPPERCASE_LETTERS} caseLabel="Uppercase" />
				<AlphabetRow letters={LOWERCASE_LETTERS} caseLabel="Lowercase" />
			</div>
		</div>
	);
}

function AlphabetRow({ letters, caseLabel }: { letters: readonly string[]; caseLabel: string }) {
	return (
		<div class="cursive-alphabet-row">
			<p class="calc-result-label cursive-row-label">{caseLabel}</p>
			<div class="cursive-alphabet-grid">
				{letters.map((letter) => (
					<div class="cursive-cell" key={letter}>
						<span class="cursive-cell-glyph">{letter}</span>
						<span class="cursive-cell-print">{letter}</span>
					</div>
				))}
			</div>
		</div>
	);
}
