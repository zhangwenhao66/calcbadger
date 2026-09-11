/**
 * Typing speed (WPM) calculator: turns a manual word/character count, a time
 * taken, and an error count into gross WPM, net WPM, and accuracy, then
 * places the result against published typing-speed research.
 *
 * This is a calculator, not a live typing test: it does not present a
 * passage to type or run a timer. You measure your own words/characters,
 * time, and mistakes (from any typing test, a work sample, or a class
 * exercise) and enter them here to get the standard scoring plus context for
 * what that number means.
 *
 * Formula authority — the "5 characters = 1 word" convention and the
 * gross-WPM formula are the standard used in text-entry research:
 *
 *   Arif, A.S. & Stuerzlinger, W. (2009). "Analysis of Text Entry
 *   Performance Metrics." Proceedings of the IEEE Toronto International
 *   Conference: Science and Technology for Humanity (TIC-STH '09), pp.
 *   100-105. Gross WPM = (transcribed-text length in characters / 5) /
 *   time in minutes. The paper credits the 5-character-per-word figure to
 *   the standard used across text-entry studies (its own citation [3]) as
 *   the accepted average English word length including spaces and
 *   punctuation, confirmed independently on Wikipedia's "Words per minute"
 *   article (2026-09-11), which cites Arif & Stuerzlinger by name for the
 *   same convention.
 *
 * Net WPM (deducting uncorrected errors from gross WPM, prorated by time)
 * is the scoring method used across typing-certification and workplace
 * typing tests; it is an industry convention rather than a single
 * institution's standard, so this module treats it as a widely used method
 * rather than attributing it to one source.
 *
 * Benchmark bands (see WPM_BENCHMARKS below) are sourced individually; see
 * that constant for citations per band.
 */

export type EntryMode = 'words' | 'characters';

/** Standard convention: one "word" = 5 characters/keystrokes, including spaces and punctuation. */
export const CHARS_PER_WORD = 5;

export interface TypingSpeedInput {
	mode: EntryMode;
	/** Words typed (mode = 'words') or characters typed (mode = 'characters'). */
	amount: number;
	/** Time taken, in minutes (decimals allowed, e.g. 1.5 for 90 seconds). */
	minutes: number;
	/** Uncorrected errors, counted in the same unit as `amount` (error words or error characters). */
	errors: number;
}

export interface TypingSpeedResult {
	grossWpm: number;
	netWpm: number;
	accuracyPct: number;
}

export function computeTypingSpeed(input: TypingSpeedInput): TypingSpeedResult | null {
	const { mode, amount, minutes, errors } = input;
	if (!Number.isFinite(amount) || amount <= 0) return null;
	if (!Number.isFinite(minutes) || minutes <= 0) return null;
	if (!Number.isFinite(errors) || errors < 0) return null;
	if (errors > amount) return null;

	const words = mode === 'words' ? amount : amount / CHARS_PER_WORD;
	const errorWords = mode === 'words' ? errors : errors / CHARS_PER_WORD;

	const grossWpm = words / minutes;
	const netWpm = Math.max(0, grossWpm - errorWords / minutes);
	const accuracyPct = ((amount - errors) / amount) * 100;

	return {
		grossWpm: roundTo(grossWpm, 1),
		netWpm: roundTo(netWpm, 1),
		accuracyPct: roundTo(accuracyPct, 1),
	};
}

function roundTo(n: number, decimals: number): number {
	const f = 10 ** decimals;
	return Math.round(n * f) / f;
}

export interface WpmBenchmark {
	label: string;
	low: number;
	high: number;
	note: string;
}

/**
 * Reference bands, each with its own source (net/typical WPM, not a specific
 * test's gross score). Ranges reflect the cited study or record, not a house
 * estimate.
 */
export const WPM_BENCHMARKS: WpmBenchmark[] = [
	{
		label: 'Hunt-and-peck (two-finger) typist',
		low: 27,
		high: 37,
		note: 'Copying text (27) vs. memorized text (37) — Brown, C.M. (1988), Human-Computer Interface Design Guidelines, Ablex Publishing.',
	},
	{
		label: 'Average computer user, composing text',
		low: 19,
		high: 19,
		note: 'Composition (writing as you go, not copying) — Karat et al. (1999), CHI \'99 Proceedings, ACM.',
	},
	{
		label: 'Average computer user, transcribing text',
		low: 32.5,
		high: 32.5,
		note: 'Copying from a source document — Karat et al. (1999), CHI \'99 Proceedings, ACM.',
	},
	{
		label: 'Average smartphone typing (two thumbs)',
		low: 36.2,
		high: 36.2,
		note: '37,000-participant mobile study, 2.3% uncorrected error rate — Palin et al. (2019), MobileHCI \'19 Proceedings, ACM.',
	},
	{
		label: '911 dispatcher / emergency operator, typical minimum requirement',
		low: 35,
		high: 45,
		note: 'This is a hiring-test floor, not an achieved average: cross-checked across multiple current dispatcher job-readiness resources (e.g. PrepOpedia, Climb the Ladder, CriticalTest Prep), which converge on 35-45 net WPM as the typical posted minimum, with experienced dispatchers commonly typing 50-60+ WPM day to day.',
	},
	{
		label: 'Skilled/professional typist',
		low: 60,
		high: 80,
		note: 'Cross-checked across multiple typing-education sources reporting professional/touch-typist speeds in roughly this band; cited ranges vary by source (some report up to 100+ WPM for specialized transcription roles), so treat this as a rough middle rather than a fixed cutoff.',
	},
	{
		label: 'Advanced/highly skilled typist',
		low: 120,
		// Open-ended in the source ("above 120 WPM"); bounded here at just under the
		// stenotype record below so the two point/near-point bands don't overlap and
		// a value like 240-359 (a standard-keyboard reading, not stenotype) isn't
		// misclassified into the stenotype band by the nearest-neighbor fallback.
		high: 359.9,
		note: 'Ayres, R.U. & Martinás, K. (2005), On the Reappraisal of Microeconomics, Edward Elgar Publishing — cited (via Wikipedia\'s "Words per minute" article) for the specific figure of 120 WPM marking a very skilled typist. The source states this as a floor ("above 120 WPM"), not a range; the upper bound here is this module\'s own cutoff so it doesn\'t overlap the stenotype record below, not a sourced ceiling.',
	},
	{
		label: 'Stenotype (court reporting) world record',
		low: 360,
		high: 360,
		note: 'Mark Kislingbury, 360 WPM at 97.23% accuracy, 2004 — Guinness World Records, "Fastest realtime court reporter (stenotype writing)."',
	},
];

export function bandForWpm(wpm: number): WpmBenchmark | null {
	if (!Number.isFinite(wpm) || wpm <= 0) return null;
	// Find the closest band by midpoint distance so a value between two bands
	// still returns a sensible neighbor rather than nothing.
	let best: WpmBenchmark | null = null;
	let bestDist = Infinity;
	for (const b of WPM_BENCHMARKS) {
		if (wpm >= b.low && wpm <= Math.max(b.high, b.low)) return b;
		const mid = (b.low + b.high) / 2;
		const dist = Math.abs(wpm - mid);
		if (dist < bestDist) {
			bestDist = dist;
			best = b;
		}
	}
	return best;
}
