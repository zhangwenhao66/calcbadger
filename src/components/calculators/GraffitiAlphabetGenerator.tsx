import { useState } from 'preact/hooks';
import {
	DEFAULT_PRACTICE_TEXT,
	LOWERCASE_LETTERS,
	MAX_LENGTH,
	sanitizePracticeText,
	UPPERCASE_LETTERS,
} from '../../lib/graffitiText';

export default function GraffitiAlphabetGenerator() {
	const [text, setText] = useState(DEFAULT_PRACTICE_TEXT);

	const preview = text.trim().length > 0 ? text : DEFAULT_PRACTICE_TEXT;

	return (
		<div class="calc">
			<label class="calc-field">
				<span class="calc-label">Type a name, tag, or short word</span>
				<div class="nf">
					<input
						class="nf-input graffiti-text-input"
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

			<div class="graffiti-preview-box">
				<p class="calc-result-label">Graffiti preview</p>
				<p class="graffiti-preview">{preview}</p>
			</div>

			<p class="calc-note">
				This preview uses a spray-paint display font, not a hand-drawn piece. It's a way to see a
				word or name in a graffiti-style letterform, not a stroke-by-stroke guide for painting one.
				Letters, digits, spaces, and exclamation marks only, up to {MAX_LENGTH} characters.
			</p>

			<div class="graffiti-chart">
				<AlphabetRow letters={UPPERCASE_LETTERS} caseLabel="Uppercase" />
				<AlphabetRow letters={LOWERCASE_LETTERS} caseLabel="Lowercase" />
			</div>
		</div>
	);
}

function AlphabetRow({ letters, caseLabel }: { letters: readonly string[]; caseLabel: string }) {
	return (
		<div class="graffiti-alphabet-row">
			<p class="calc-result-label graffiti-row-label">{caseLabel}</p>
			<div class="graffiti-alphabet-grid">
				{letters.map((letter) => (
					<div class="graffiti-cell" key={letter}>
						<span class="graffiti-cell-glyph">{letter}</span>
						<span class="graffiti-cell-print">{letter}</span>
					</div>
				))}
			</div>
		</div>
	);
}
