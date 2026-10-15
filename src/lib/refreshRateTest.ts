/**
 * Refresh rate test: measures how often the browser is actually presenting a
 * new frame, from the timestamps requestAnimationFrame hands out.
 *
 * MDN describes the method this relies on: requestAnimationFrame asks the
 * browser "to call a user-supplied callback function before the next repaint",
 * and "the frequency of calls to the callback function will generally match the
 * display refresh rate". One gap between consecutive callbacks is therefore one
 * screen refresh period, and the rate is 1000 / gap. The same page names 60Hz as
 * the most common rate, "though 75hz, 120hz, and 144hz are also widely used".
 *
 * Two consequences are handled in code rather than left to the copy:
 *
 *   - MDN warns that "requestAnimationFrame() calls are paused in most browsers
 *     when running in background tabs or hidden iframes". A sample taken while
 *     the tab is hidden measures that throttling, not the panel, so the caller
 *     checks document.visibilityState and discards such a run.
 *   - A machine that cannot keep up produces gaps longer than the display
 *     period (a garbage collection pause, a competing tab). Those are slow
 *     frames, not display behaviour, so they are dropped before the median is
 *     taken. Only the slow tail is filtered: nothing can make the browser
 *     present faster than the panel allows, so a short gap is never discarded.
 *
 * The refresh-rate/frame-rate distinction comes from Wikipedia's "Refresh rate"
 * article, which defines refresh rate as "the number of times per second that a
 * raster-based display device displays a new image" and notes it "can be
 * independent of frame rate". A web page can only observe the rate the browser
 * presents at; it cannot see the frame rate rendered underneath.
 */

/**
 * Rates that appear on real hardware. MDN names 60, 75, 120 and 144 as widely
 * used. Wikipedia's "Refresh rate" article documents the progression beyond
 * those: 144 Hz arrived in 2012, 240 Hz in 2017, 360 Hz in 2020.
 */
export const STANDARD_RATES = [24, 30, 50, 60, 75, 90, 100, 120, 144, 165, 180, 240, 360];

/** Fewer kept intervals than this is not enough for a median worth reporting. */
export const MIN_SAMPLES = 20;

/** An interval longer than this multiple of the median is a slow frame, not the panel. */
export const OUTLIER_FACTOR = 2.5;

/** The measured rate has to land within this share of a standard rate to count as that rate. */
export const MATCH_TOLERANCE_PERCENT = 3;

/**
 * No display refreshes below this. A median period longer than 50 ms does not
 * mean a 5Hz panel; it means most frames stalled, so there is no reading to
 * report.
 */
export const MIN_PLAUSIBLE_HZ = 20;

/**
 * Above the fastest overclocked gaming panels Wikipedia documents (540 Hz), so
 * anything higher is a broken measurement rather than a display.
 */
export const MAX_PLAUSIBLE_HZ = 600;

/** Relative spread at or below this reads as a steady rate rather than a varying one. */
export const STEADY_RATIO = 1.1;

function finitePositive(values: number[]): number[] {
	return values.filter((v) => Number.isFinite(v) && v > 0);
}

/**
 * Median of the finite values, or NaN when there are none. Even counts average
 * the two middle values.
 */
export function median(values: number[]): number {
	const v = finitePositive(values).sort((a, b) => a - b);
	if (v.length === 0) return NaN;
	const mid = v.length / 2;
	if (v.length % 2 === 1) return v[Math.floor(mid)];
	return (v[mid - 1] + v[mid]) / 2;
}

/**
 * Percentile using linear interpolation between closest ranks (the
 * PERCENTILE.INC convention). `p` is a fraction, 0 to 1. Returns NaN when there
 * are no finite values.
 */
export function percentile(values: number[], p: number): number {
	const v = finitePositive(values).sort((a, b) => a - b);
	if (v.length === 0) return NaN;
	const clamped = Math.max(0, Math.min(1, Number.isFinite(p) ? p : 0));
	const rank = clamped * (v.length - 1);
	const lo = Math.floor(rank);
	const hi = Math.ceil(rank);
	if (lo === hi) return v[lo];
	const frac = rank - lo;
	return v[lo] + frac * (v[hi] - v[lo]);
}

/**
 * Gaps between consecutive requestAnimationFrame timestamps, in milliseconds.
 * Non-finite and non-positive gaps are discarded, so a reset timestamp or a
 * repeated value cannot contribute a phantom period.
 */
export function intervalsFrom(timestamps: number[]): number[] {
	const out: number[] = [];
	for (let i = 1; i < timestamps.length; i += 1) {
		const gap = timestamps[i] - timestamps[i - 1];
		if (Number.isFinite(gap) && gap > 0) out.push(gap);
	}
	return out;
}

export interface OutlierResult {
	/** The intervals kept, in the order they arrived. */
	kept: number[];
	/** How many intervals were dropped as slow frames. */
	droppedCount: number;
}

/**
 * Splits intervals into the ones that describe the display and the ones that
 * describe a stalled machine. The centre is the median of the whole input,
 * computed once (not iteratively), and anything longer than
 * `factor × centre` is dropped. The short side is left alone: the browser
 * cannot present faster than the panel allows.
 */
export function filterOutlierIntervals(intervals: number[], factor: number = OUTLIER_FACTOR): OutlierResult {
	const valid = finitePositive(intervals);
	const centre = median(valid);
	if (!Number.isFinite(centre)) return { kept: [], droppedCount: 0 };
	const ceiling = centre * (Number.isFinite(factor) && factor > 0 ? factor : OUTLIER_FACTOR);
	const kept: number[] = [];
	let droppedCount = 0;
	for (const value of valid) {
		if (value > ceiling) droppedCount += 1;
		else kept.push(value);
	}
	return { kept, droppedCount };
}

export interface RefreshSummary {
	/** Intervals that survived outlier filtering. */
	sampleCount: number;
	/** Intervals dropped as slow frames. */
	droppedCount: number;
	/** Total time covered by the kept intervals, in milliseconds. */
	spanMs: number;
	medianMs: number;
	minMs: number;
	maxMs: number;
	p95Ms: number;
	/** Refresh rate implied by the median interval: 1000 / medianMs. */
	hz: number;
	/** p95 / median — how far the slow tail sits from the typical period. */
	jitterRatio: number;
	/** True when jitterRatio is at or below STEADY_RATIO. */
	steady: boolean;
}

/**
 * Turns raw frame intervals into a reading, or null when the sample is too
 * small to report. Slow frames are removed first, then the median of what
 * remains becomes the period.
 */
export function summarize(intervals: number[]): RefreshSummary | null {
	const valid = finitePositive(intervals);
	if (valid.length < MIN_SAMPLES) return null;

	const { kept, droppedCount } = filterOutlierIntervals(valid, OUTLIER_FACTOR);
	if (kept.length < MIN_SAMPLES) return null;

	const medianMs = median(kept);
	const p95Ms = percentile(kept, 0.95);
	const hz = 1000 / medianMs;

	// Once most frames are stalls the median stops describing a display period,
	// and the outlier filter cannot see it because it is anchored on the same
	// corrupted median. A rate outside anything a panel can produce is the
	// signal that the sample never settled, so report nothing rather than a
	// number the user would act on.
	if (!(hz >= MIN_PLAUSIBLE_HZ && hz <= MAX_PLAUSIBLE_HZ)) return null;

	const jitterRatio = p95Ms / medianMs;

	return {
		sampleCount: kept.length,
		droppedCount,
		spanMs: kept.reduce((sum, v) => sum + v, 0),
		medianMs,
		minMs: Math.min(...kept),
		maxMs: Math.max(...kept),
		p95Ms,
		hz,
		jitterRatio,
		steady: jitterRatio <= STEADY_RATIO,
	};
}

export interface StandardRateMatch {
	/** The standard rate that sits closest to the measured value. */
	rate: number;
	/** measured − rate, in Hz. */
	deltaHz: number;
	/** (measured − rate) / rate, as a percentage. */
	deltaPercent: number;
}

/**
 * The standard rate nearest a measured value, with the signed difference. Null
 * when the measurement is not a finite positive number.
 */
export function nearestStandardRate(hz: number, rates: number[] = STANDARD_RATES): StandardRateMatch | null {
	if (!Number.isFinite(hz) || hz <= 0 || rates.length === 0) return null;
	let rate = rates[0];
	let best = Math.abs(rates[0] - hz);
	for (const candidate of rates) {
		const distance = Math.abs(candidate - hz);
		if (distance < best) {
			best = distance;
			rate = candidate;
		}
	}
	const deltaHz = hz - rate;
	return { rate, deltaHz, deltaPercent: (deltaHz / rate) * 100 };
}

export type RefreshVerdict = 'match' | 'below' | 'above';

/**
 * Whether the measured rate counts as the nearest standard rate. Within the
 * tolerance it is a match; otherwise the reading sits below or above it.
 */
export function verdict(
	hz: number,
	match: StandardRateMatch | null,
	tolerancePercent: number = MATCH_TOLERANCE_PERCENT,
): RefreshVerdict {
	if (!match || !Number.isFinite(hz)) return 'match';
	if (Math.abs(match.deltaPercent) <= tolerancePercent) return 'match';
	return match.deltaHz < 0 ? 'below' : 'above';
}

export interface IntervalBucket {
	/** Interval length rounded to a tenth of a millisecond. */
	ms: number;
	count: number;
	/** Share of the sample, 0 to 1. */
	share: number;
}

/**
 * The most frequent interval lengths, longest run first. Intervals are grouped
 * at 0.1 ms, which is fine enough to separate 60Hz (16.7) from 75Hz (13.3) and
 * coarse enough that measurement noise does not split one period across many
 * buckets. Ties break toward the shorter interval so the order is stable.
 */
export function commonIntervals(intervals: number[], topN: number = 6): IntervalBucket[] {
	const kept = finitePositive(intervals);
	if (kept.length === 0 || topN < 1) return [];

	const counts = new Map<number, number>();
	for (const value of kept) {
		const ms = Math.round(value * 10) / 10;
		counts.set(ms, (counts.get(ms) ?? 0) + 1);
	}

	return [...counts.entries()]
		.map(([ms, count]) => ({ ms, count, share: count / kept.length }))
		.sort((a, b) => (b.count === a.count ? a.ms - b.ms : b.count - a.count))
		.slice(0, topN);
}

/** A rate for display: whole numbers bare, everything else to one decimal. */
export function formatHz(hz: number): string {
	if (!Number.isFinite(hz)) return '—';
	const rounded = Math.round(hz * 10) / 10;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** One frame period for a given rate, in milliseconds. */
export function intervalForRate(hz: number): number {
	return Number.isFinite(hz) && hz > 0 ? 1000 / hz : NaN;
}
