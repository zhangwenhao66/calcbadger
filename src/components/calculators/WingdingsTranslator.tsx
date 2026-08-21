import { useMemo, useState } from 'preact/hooks';
import {
	clampWingdingsInput,
	convertWingdings,
	MAX_INPUT_LENGTH,
	modeLabel,
	UPPERCASE_LEGEND,
	type WingdingsMode,
} from '../../lib/wingdingsTranslator';
import Segmented from '../ui/Segmented';

const DEFAULT_TEXT: Record<WingdingsMode, string> = {
	symbolPreview: 'hello badger',
	fontCode: 'hello badger',
	decode: convertWingdings('hello badger', 'fontCode').text,
};

export default function WingdingsTranslator() {
	const [mode, setMode] = useState<WingdingsMode>('symbolPreview');
	const [textByMode, setTextByMode] = useState(DEFAULT_TEXT);
	const [copied, setCopied] = useState(false);
	const [copiedLegend, setCopiedLegend] = useState<string | null>(null);

	const text = textByMode[mode];
	const source = text.length > 0 ? text : DEFAULT_TEXT[mode];
	const result = useMemo(() => convertWingdings(source, mode), [source, mode]);

	function setText(next: string) {
		setTextByMode((prev) => ({ ...prev, [mode]: clampWingdingsInput(next) }));
	}

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

	async function copyLegendSymbol(char: string, symbol: string) {
		try {
			await navigator.clipboard.writeText(symbol);
		} catch {
			// Same silent no-op as the main copy button above.
		}
		setCopiedLegend(char);
		setTimeout(() => setCopiedLegend((current) => (current === char ? null : current)), 1200);
	}

	const placeholder =
		mode === 'decode' ? 'Paste Wingdings symbol text to decode…' : 'Type something…';

	return (
		<div class="calc">
			<Segmented
				label="Mode"
				value={mode}
				onChange={(v) => setMode(v as WingdingsMode)}
				options={[
					{ value: 'symbolPreview', label: 'Symbol preview' },
					{ value: 'fontCode', label: 'Windows font code' },
					{ value: 'decode', label: 'Decode to text' },
				]}
				wide
			/>

			<label class="calc-field" style="margin-top:0.9rem">
				<span class="calc-label">
					{mode === 'decode' ? 'Wingdings symbol text to decode' : 'Type or paste text'}
				</span>
				<div class="glitch-textarea-shell">
					<textarea
						class="glitch-textarea"
						value={text}
						placeholder={placeholder}
						maxLength={MAX_INPUT_LENGTH}
						spellcheck={false}
						rows={2}
						onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
					/>
				</div>
			</label>

			<div class="glitch-output-box">
				<p class="calc-result-label">{modeLabel(mode)} output</p>
				<p
					class="glitch-output-text"
					style={mode === 'fontCode' ? "font-family:'Wingdings','Wingdings 2','Wingdings 3',sans-serif;" : undefined}
				>
					{result.text}
				</p>
			</div>

			<button type="button" class="op-button" style="margin-top:0.9rem" onClick={copyOutput}>
				{copied ? 'Copied!' : `Copy ${modeLabel(mode).toLowerCase()} output`}
			</button>

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Characters converted</p>
					<p class="calc-result-value primary">{result.convertedCount}</p>
				</div>
				<div>
					<p class="calc-result-label">Left unconverted</p>
					<p class="calc-result-value">{result.unsupportedCount}</p>
				</div>
				<div>
					<p class="calc-result-label">Coverage</p>
					<p class="calc-result-value">Full printable ASCII (95 characters)</p>
				</div>
			</div>

			{mode === 'fontCode' && (
				<p class="calc-note">
					This mode reproduces the real Wingdings font trick: every character is shifted to
					0xF000 + its ASCII code, the exact Private Use Area offset Microsoft's OpenType
					specification documents for symbol fonts. It only displays as symbols on a device that
					has the Wingdings font — Windows ships it by default, so most Windows browsers and Word
					show it correctly, while Mac, Linux, and most mobile browsers will show boxes here
					instead. The copied text is correct either way; paste it somewhere with Wingdings
					installed and the symbols appear.
				</p>
			)}
			{mode === 'symbolPreview' && (
				<p class="calc-note">
					This default mode swaps each character for its closest standalone Unicode symbol instead
					of a Wingdings font code point, so it renders the same everywhere — no Wingdings
					installation required. It's an equivalent, not a pixel-identical copy of the original
					font's artwork.
				</p>
			)}
			{mode === 'decode' && (
				<p class="calc-note">
					Paste text that looks like empty boxes or private-use symbols — copied from this tool's
					"Windows font code" mode, or from anywhere else that encoded text the same way — and this
					reads the underlying character codes back out as plain text, whether or not your own
					device can display the symbols.
				</p>
			)}

			<div class="calc-field" style="margin-top:1.4rem">
				<span class="calc-label">A–Z symbol legend (click to copy one symbol)</span>
				<div class="greek-grid">
					{UPPERCASE_LEGEND.map(({ char, glyph }) => (
						<button
							type="button"
							class="greek-cell"
							key={char}
							onClick={() => copyLegendSymbol(char, glyph.symbol)}
							aria-label={`Copy the symbol for ${char}: ${glyph.name}`}
						>
							<span class="greek-cell-glyphs">
								{char} → {glyph.symbol}
							</span>
							<span class="greek-cell-name">{glyph.name}</span>
							<span class="greek-cell-copied" aria-live="polite">
								{copiedLegend === char ? 'Copied!' : ''}
							</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
