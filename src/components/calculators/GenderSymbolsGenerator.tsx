import { useMemo, useState } from 'preact/hooks';
import { filterGenderSymbols, GENDER_SYMBOLS, type GenderSymbol } from '../../lib/genderSymbols';

export default function GenderSymbolsGenerator() {
	const [query, setQuery] = useState('');
	const [copiedName, setCopiedName] = useState<string | null>(null);

	const results = useMemo(() => filterGenderSymbols(GENDER_SYMBOLS, query), [query]);

	async function copySymbol(entry: GenderSymbol) {
		try {
			await navigator.clipboard.writeText(entry.symbol);
		} catch {
			// Clipboard API can be unavailable (older browsers, insecure
			// context). The glyph is still visible and selectable by hand,
			// so this is a silent no-op rather than an error state.
		}
		setCopiedName(entry.name);
		setTimeout(() => {
			setCopiedName((current) => (current === entry.name ? null : current));
		}, 1200);
	}

	return (
		<div class="calc">
			<label class="calc-field">
				<span class="calc-label">Search by name or meaning</span>
				<div class="nf">
					<input
						class="nf-input gender-symbols-search-input"
						type="text"
						value={query}
						placeholder='Try "female", "lesbian", or "transgender"'
						autocomplete="off"
						spellcheck={false}
						onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
					/>
				</div>
			</label>

			<p class="calc-note">
				Click any symbol to copy it. Showing {results.length} of {GENDER_SYMBOLS.length} symbols.
			</p>

			<div class="gender-symbols-grid">
				{results.map((entry) => (
					<button
						type="button"
						class="gender-symbols-cell"
						key={entry.name}
						onClick={() => copySymbol(entry)}
						aria-label={`Copy ${entry.name}: ${entry.symbol}`}
					>
						<span class="gender-symbols-cell-glyph">{entry.symbol}</span>
						<span class="gender-symbols-cell-name">{entry.name}</span>
						<span class="gender-symbols-cell-copied" aria-live="polite">
							{copiedName === entry.name ? 'Copied!' : ''}
						</span>
					</button>
				))}
			</div>

			{results.length === 0 && (
				<p class="calc-note">No symbols match "{query}". Try a different search, like a symbol's name or meaning.</p>
			)}
		</div>
	);
}
