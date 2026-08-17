import { useMemo, useState } from 'preact/hooks';
import {
	clampGlitchInput,
	directionLabel,
	glitchify,
	intensityLabel,
	MAX_INPUT_LENGTH,
	type Direction,
	type Intensity,
} from '../../lib/glitchText';
import Segmented from '../ui/Segmented';

const DEFAULT_TEXT = 'glitch';

export default function GlitchTextGenerator() {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [intensity, setIntensity] = useState<Intensity>('medium');
	const [direction, setDirection] = useState<Direction>('both');
	const [seed, setSeed] = useState(0);
	const [copied, setCopied] = useState(false);

	const source = text.trim().length > 0 ? text : DEFAULT_TEXT;

	// seed is only in the dependency list to force a fresh random draw when
	// the "Shuffle" button is pressed; the value itself isn't used.
	const result = useMemo(
		() => glitchify(source, { intensity, direction }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[source, intensity, direction, seed]
	);

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

	const charCount = [...source].length;
	const avgMarksPerChar = charCount > 0 ? result.marksAdded / charCount : 0;

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
						rows={3}
						onInput={(e) => setText(clampGlitchInput((e.target as HTMLTextAreaElement).value))}
					/>
				</div>
			</label>

			<div class="calc-grid">
				<Segmented
					label="Intensity"
					value={intensity}
					onChange={(v) => setIntensity(v as Intensity)}
					options={[
						{ value: 'mild', label: 'Mild' },
						{ value: 'medium', label: 'Medium' },
						{ value: 'heavy', label: 'Heavy' },
						{ value: 'extreme', label: 'Extreme' },
					]}
					wide
				/>
				<Segmented
					label="Marks"
					value={direction}
					onChange={(v) => setDirection(v as Direction)}
					options={[
						{ value: 'up', label: 'Up only' },
						{ value: 'down', label: 'Down only' },
						{ value: 'both', label: 'Up + down' },
					]}
					wide
				/>
			</div>

			<div class="glitch-output-box">
				<p class="calc-result-label">Glitched output</p>
				<p class="glitch-output-text">{result.text}</p>
			</div>

			<button type="button" class="op-button" style="margin-top:0.9rem" onClick={copyOutput}>
				{copied ? 'Copied!' : 'Copy glitched text'}
			</button>
			<button
				type="button"
				class="op-button"
				style="margin-top:0.5rem"
				onClick={() => setSeed((s) => s + 1)}
			>
				Shuffle (same text, new marks)
			</button>

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Base characters</p>
					<p class="calc-result-value">{charCount}</p>
				</div>
				<div>
					<p class="calc-result-label">Marks added</p>
					<p class="calc-result-value primary">{result.marksAdded}</p>
				</div>
				<div>
					<p class="calc-result-label">Avg. marks / character</p>
					<p class="calc-result-value">{avgMarksPerChar.toFixed(1)}</p>
				</div>
				<div>
					<p class="calc-result-label">Style</p>
					<p class="calc-result-value">
						{intensityLabel(intensity)} · {directionLabel(direction)}
					</p>
				</div>
			</div>

			<p class="calc-note">
				Every extra squiggle is a real Unicode combining mark (from the block Unicode reserves at
				U+0300-U+036F) stacked onto the character right before it, not a special font or an image —
				that's why it copies and pastes anywhere as plain text. "Marks added" counts how many of
				those combining characters got attached across the whole string; letters, digits, and most
				symbols each get their own random batch, while spaces and line breaks are left alone since
				there's no glyph underneath them to hang a mark on. Each click of Shuffle re-rolls which
				specific marks land, without changing your text or settings. Nothing you type is sent
				anywhere — the marks are generated and combined in your browser.
			</p>
		</div>
	);
}
