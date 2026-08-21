/**
 * Click-speed (CPS) test math and classification.
 *
 * Classification bands draw on two different, non-interchangeable bodies of
 * evidence and say so explicitly rather than presenting one invented "good
 * score" scale:
 *  - The clinical Finger Tapping Test (Halstead, 1947; standardized by
 *    Reitan & Wolfson, 1985), a validated neuropsychological measure of
 *    continuous single-finger tapping speed. Its most commonly cited
 *    normative figures (Ruff & Parker, 1993, "Gender- and age-specific
 *    changes in motor speed and eye-hand coordination in adults,"
 *    Perceptual and Motor Skills 76) put young adults' dominant-hand average
 *    at roughly 50-55 taps per 10-second trial, i.e. about 5.0-5.5 taps per
 *    second, using one finger tapping naturally and continuously.
 *  - Click-speed-test communities, where scores well above that clinical
 *    range are attributed to alternating multi-finger clicking or named
 *    techniques (jitter clicking, butterfly clicking) rather than a single
 *    finger tapping continuously. These technique names are widely
 *    documented but the specific score thresholds are community convention,
 *    not a peer-reviewed measurement, and are described as such.
 */

export interface ClickTestResult {
	clicks: number;
	durationSeconds: number;
	cps: number;
	cpm: number;
}

export function computeClickSpeed(clicks: number, durationSeconds: number): ClickTestResult {
	const safeClicks = Number.isFinite(clicks) && clicks > 0 ? clicks : 0;
	if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
		return { clicks: safeClicks, durationSeconds: 0, cps: 0, cpm: 0 };
	}
	const cps = safeClicks / durationSeconds;
	return { clicks: safeClicks, durationSeconds, cps, cpm: cps * 60 };
}

export interface CpsBand {
	label: string;
	note: string;
}

export function classifyCps(cps: number): CpsBand {
	if (!Number.isFinite(cps) || cps < 0) {
		return { label: 'N/A', note: '' };
	}
	if (cps < 5) {
		return {
			label: 'Below the typical sustained single-finger tapping range',
			note: 'Below the roughly 5.0-5.5 taps-per-second average (50-55 taps per 10 seconds) that Ruff & Parker (1993) and later replications report for dominant-hand performance on the clinical Finger Tapping Test, a validated single-finger tapping task, not a click-speed-test leaderboard figure.',
		};
	}
	if (cps <= 7) {
		return {
			label: 'In the typical single-finger tapping range',
			note: 'Within the roughly 5-7 taps-per-second range commonly reported for continuous single-finger tapping in Finger Tapping Test normative studies (Ruff & Parker, 1993, and later replications).',
		};
	}
	if (cps <= 15) {
		return {
			label: 'Above the natural single-finger tapping range',
			note: "Above the roughly 5-7 taps-per-second range documented for one finger tapping continuously. Scores in this range are typically produced by alternating two fingers or a fast wrist motion rather than a single finger clicking on its own.",
		};
	}
	return {
		label: 'In the range of specialized clicking techniques',
		note: 'Above roughly 15 clicks per second, a rate click-speed-test communities generally attribute to techniques such as jitter clicking (using arm tension to vibrate a finger against the mouse button) or butterfly clicking (alternating two fingers rapidly on one button) rather than natural single-finger tapping. These technique names are widely documented, but the specific speed thresholds are community convention, not a peer-reviewed measurement.',
	};
}
