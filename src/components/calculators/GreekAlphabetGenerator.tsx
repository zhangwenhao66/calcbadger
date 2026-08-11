import { useMemo, useState } from 'preact/hooks';
import { filterGreekLetters, GREEK_LETTERS, type GreekLetter } from '../../lib/greekAlphabet';

export default function GreekAlphabetGenerator() {
	const [query, setQuery] = useState('');
	const [copiedName, setCopiedName] = useState<string | null>(null);

	const results = useMemo(() => filterGreekLetters(GREEK_LETTERS, query), [query]);

	async function copyLetter(letter: GreekLetter) {
		const glyphs = letter.finalForm
			? `${letter.uppercase} ${letter.lowercase} ${letter.finalForm}`
			: `${letter.uppercase} ${letter.lowercase}`;
		const text = `${glyphs} (${letter.name})`;
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// Clipboard API can be unavailable (older browsers, insecure
			// context). The glyphs are still visible and selectable by hand,
			// so this is a silent no-op rather than an error state.
		}
		setCopiedName(letter.name);
		setTimeout(() => {
			setCopiedName((current) => (current === letter.name ? null : current));
		}, 1200);
	}

	return (
		<div class="calc">
			<label class="calc-field">
				<span class="calc-label">Search by name or use</span>
				<div class="nf">
					<input
						class="nf-input greek-search-input"
						type="text"
						value={query}
						placeholder='Try "pi", "angle", or "standard deviation"'
						autocomplete="off"
						spellcheck={false}
						onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
					/>
				</div>
			</label>

			<p class="calc-note">
				Click any letter to copy it. Showing {results.length} of {GREEK_LETTERS.length} letters.
			</p>

			<div class="greek-grid">
				{results.map((letter) => (
					<button
						type="button"
						class="greek-cell"
						key={letter.name}
						onClick={() => copyLetter(letter)}
						aria-label={`Copy ${letter.name}: ${letter.uppercase} ${letter.lowercase}`}
					>
						<span class="greek-cell-glyphs">
							{letter.uppercase} {letter.lowercase}
							{letter.finalForm ? ` ${letter.finalForm}` : ''}
						</span>
						<span class="greek-cell-name">{letter.name}</span>
						<span class="greek-cell-copied" aria-live="polite">
							{copiedName === letter.name ? 'Copied!' : ''}
						</span>
					</button>
				))}
			</div>

			{results.length === 0 && (
				<p class="calc-note">No letters match "{query}". Try a different search, like a letter name.</p>
			)}
		</div>
	);
}
