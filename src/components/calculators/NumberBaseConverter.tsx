import { useState } from 'preact/hooks';
import { BASES, convertAll, filterDigitsForBase, MAX_DIGITS, sanitizeForBase, type NumBase } from '../../lib/numberBase';
import Segmented from '../ui/Segmented';

const BASE_LABEL: Record<NumBase, string> = {
	binary: 'Binary',
	octal: 'Octal',
	decimal: 'Decimal',
	hex: 'Hex',
};

const BASE_PREFIX: Record<NumBase, string> = {
	binary: '0b',
	octal: '0o',
	decimal: '',
	hex: '0x',
};

const DEFAULT_VALUE: Record<NumBase, string> = {
	binary: '11001010',
	octal: '312',
	decimal: '202',
	hex: 'ca',
};

export default function NumberBaseConverter() {
	const [from, setFrom] = useState<NumBase>('decimal');
	const [value, setValue] = useState(DEFAULT_VALUE.decimal);
	const [truncated, setTruncated] = useState(false);

	// Switching bases re-expresses the same integer in the new radix, the same
	// pattern LengthConverter/WeightConverter use when switching units —
	// otherwise the same typed digits would be silently reinterpreted under a
	// different base instead of converted.
	function switchTo(next: NumBase) {
		if (next === from) return;
		const results = convertAll(value, from);
		setValue(results ? results[next] : DEFAULT_VALUE[next]);
		setTruncated(false);
		setFrom(next);
	}

	function handleInput(raw: string) {
		setTruncated(filterDigitsForBase(raw, from).length > MAX_DIGITS);
		setValue(sanitizeForBase(raw, from));
	}

	const results = convertAll(value, from);
	const others = BASES.filter((b) => b !== from);

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="From base"
					value={from}
					onChange={switchTo}
					options={BASES.map((b) => ({ value: b, label: BASE_LABEL[b] }))}
					wide
				/>
				<label class="calc-field">
					<span class="calc-label">{BASE_LABEL[from]} value</span>
					<div class="glitch-textarea-shell">
						<textarea
							class="glitch-textarea"
							rows={1}
							value={value}
							onInput={(e) => handleInput((e.target as HTMLTextAreaElement).value)}
							placeholder={`Type a ${BASE_LABEL[from].toLowerCase()} number…`}
							spellcheck={false}
						/>
					</div>
				</label>
			</div>

			{truncated && (
				<p class="calc-note">Only the first {MAX_DIGITS} valid digits were kept; anything past that was cut off.</p>
			)}

			{results ? (
				<div class="calc-results">
					{others.map((b) => (
						<div key={b}>
							<p class="calc-result-label">{BASE_LABEL[b]}</p>
							<p class="calc-result-value primary">
								{BASE_PREFIX[b]}
								{results[b]}
							</p>
						</div>
					))}
				</div>
			) : (
				<p class="calc-note">
					Enter a {BASE_LABEL[from].toLowerCase()} number (up to {MAX_DIGITS} digits) to convert it
					to the other three bases.
				</p>
			)}

			<p class="calc-note">
				Conversion runs on exact integer arithmetic (JavaScript BigInt), not floating-point, so a
				value larger than a standard 64-bit integer still converts exactly instead of losing
				precision. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
