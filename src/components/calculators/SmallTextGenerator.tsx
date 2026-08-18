import { useMemo, useState } from 'preact/hooks';
import {
	clampSmallTextInput,
	convertSmallText,
	MAX_INPUT_LENGTH,
	styleCoverage,
	styleLabel,
	type SmallTextStyle,
} from '../../lib/smallText';
import Segmented from '../ui/Segmented';

const DEFAULT_TEXT = 'small text';

export default function SmallTextGenerator() {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [style, setStyle] = useState<SmallTextStyle>('superscript');
	const [copied, setCopied] = useState(false);

	const source = text.trim().length > 0 ? text : DEFAULT_TEXT;
	const result = useMemo(() => convertSmallText(source, style), [source, style]);

	async function copyOutput() {
		try {
			await navigator.clipboard.writeText(result.text);
		} catch {
			// Clipboard API can be unavailable; the output stays visible below
			// for manual selection, so this is a silent no-op.
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	return (
		<div class="calc">
			<label class="calc-field">
				<span class="calc-label">Type or paste text</span>
				<div class="glitch-textarea-shell">
					<textarea
						class="glitch-textarea"
						value={text}
						placeholder="Type something…"
						maxLength={MAX_INPUT_LENGTH}
						spellcheck={false}
						rows={2}
						onInput={(e) => setText(clampSmallTextInput((e.target as HTMLTextAreaElement).value))}
					/>
				</div>
			</label>

			<Segmented
				label="Style"
				value={style}
				onChange={(v) => setStyle(v as SmallTextStyle)}
				options={[
					{ value: 'superscript', label: 'Superscript' },
					{ value: 'smallCaps', label: 'Small caps' },
					{ value: 'subscript', label: 'Subscript' },
				]}
				wide
			/>

			<div class="glitch-output-box">
				<p class="calc-result-label">{styleLabel(style)} output</p>
				<p class="glitch-output-text">{result.text}</p>
			</div>

			<button type="button" class="op-button" style="margin-top:0.9rem" onClick={copyOutput}>
				{copied ? 'Copied!' : `Copy ${styleLabel(style).toLowerCase()} text`}
			</button>

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Characters converted</p>
					<p class="calc-result-value primary">{result.convertedCount}</p>
				</div>
				<div>
					<p class="calc-result-label">No tiny form exists</p>
					<p class="calc-result-value">{result.unsupportedCount}</p>
				</div>
				<div>
					<p class="calc-result-label">Alphabet coverage</p>
					<p class="calc-result-value">{styleCoverage(style)}</p>
				</div>
			</div>

			<p class="calc-note">
				Every character above is a real, individually-named Unicode code point (not a custom font
				or an image), so the output copies and pastes as plain text into bios, captions, comments,
				and chat apps. None of the three styles covers the full alphabet: superscript has no glyph
				for "q", small caps has none for lowercase "x", and subscript — which Unicode only built out
				for math and phonetic notation, not general text — covers 17 of 26 letters. Any letter this
				style can't convert is left as a regular character rather than dropped, and "No tiny form
				exists" above counts exactly how many that was for your text. Nothing you type is sent
				anywhere; the conversion runs entirely in your browser.
			</p>
		</div>
	);
}
