/**
 * Reaction-time trial statistics and classification.
 *
 * Classification bands use three figures actually reported in the cited
 * sources, not a single invented "typical range":
 *  - 190 ms: the non-computer baseline Kosinski, R.J. (Clemson University,
 *    "A Literature Review on Reaction Time," last updated September 2013)
 *    says was the accepted figure for light-stimulus simple reaction time in
 *    college-age adults for roughly 120 years, tracing to Galton's 19th
 *    century studies.
 *  - 213 ms: the hardware-delay-corrected mean simple reaction time from
 *    Woods, D.L. et al. (2015), "Factors influencing the latency of simple
 *    reaction time," Frontiers in Human Neuroscience 9:131, a community
 *    sample of 1,469 people ages 18-65 (raw mean was 231 ms).
 *  - 268 ms: the computer-measured figure Kosinski's review cites from
 *    Eckner et al. (2010) (NCAA athletes averaged 0.268 s on a computer test
 *    vs. 0.203 s on a falling-meter-stick test) and says is typical of
 *    computer-measured reaction times at Clemson generally.
 * A browser test adds its own jitter on top of any of these, so results are
 * described relative to these documented figures rather than as precise
 * percentiles.
 */

export interface TrialSummary {
	mean: number;
	median: number;
	best: number;
	worst: number;
	stdDev: number;
}

export function mean(values: number[]): number {
	if (values.length === 0) return 0;
	return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Population standard deviation of the observed trials (describes the spread of this run, not an estimate of a wider population). */
export function stdDev(values: number[]): number {
	if (values.length === 0) return 0;
	const m = mean(values);
	const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
	return Math.sqrt(variance);
}

export function summarizeTrials(times: number[]): TrialSummary {
	if (times.length === 0) {
		return { mean: 0, median: 0, best: 0, worst: 0, stdDev: 0 };
	}
	return {
		mean: mean(times),
		median: median(times),
		best: Math.min(...times),
		worst: Math.max(...times),
		stdDev: stdDev(times),
	};
}

export interface ReactionBand {
	label: string;
	note: string;
}

export function classifyReactionTime(ms: number): ReactionBand {
	if (!Number.isFinite(ms) || ms < 0) {
		return { label: 'N/A', note: '' };
	}
	if (ms < 190) {
		return {
			label: 'Faster than the historic baseline',
			note: "Below the roughly 190ms figure Kosinski's review says was the accepted simple-reaction-time baseline for about 120 years, before computer-based testing became common. A very fast time can also mean the click landed right as the screen changed rather than after seeing it, so if every trial feels effortless, run it again.",
		};
	}
	if (ms <= 213) {
		return {
			label: 'Faster than the modern computer-measured average',
			note: 'At or below 213ms, the hardware-delay-corrected mean simple reaction time Woods et al. (2015) measured in a 1,469-person community sample using a calibrated computer test.',
		};
	}
	if (ms <= 268) {
		return {
			label: 'Within the range of modern computer-based studies',
			note: "Between the roughly 213-231ms average Woods et al. (2015) measured and the 268ms figure Kosinski's review cites from computer-based testing (Eckner et al., 2010, and typical results at Clemson).",
		};
	}
	return {
		label: 'Slower than the studies cited here',
		note: "Above the roughly 268ms figure Kosinski's review cites as typical of computer-measured reaction time. Fatigue, a distracted moment, an older input device, or age (Woods et al., 2015 found simple reaction time lengthens about 0.55ms per year of age, mainly from slower motor output) can all push a trial slower.",
	};
}
