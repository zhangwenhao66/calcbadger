import { describe, expect, it } from 'vitest';
import { bandForWpm, computeTypingSpeed, WPM_BENCHMARKS } from '../src/lib/wordsPerMinuteAverage';

/**
 * Expected values below are hand-computed independently from the formulas
 * documented in the module header (gross WPM = words / minutes, or
 * (characters / 5) / minutes; net WPM = gross - errorWords / minutes;
 * accuracy = (amount - errors) / amount * 100), not copied from this
 * module's own output.
 */
describe('computeTypingSpeed — word-count mode', () => {
	it('90 words in 2 minutes, 3 error words: gross 45, net 43.5, accuracy 96.7%', () => {
		// gross = 90/2 = 45; net = 45 - 3/2 = 43.5; accuracy = 87/90*100 = 96.666... -> 96.7
		const r = computeTypingSpeed({ mode: 'words', amount: 90, minutes: 2, errors: 3 });
		expect(r).not.toBeNull();
		expect(r!.grossWpm).toBe(45);
		expect(r!.netWpm).toBe(43.5);
		expect(r!.accuracyPct).toBe(96.7);
	});

	it('40 words in 1 minute, 0 errors: gross 40, net 40, accuracy 100%', () => {
		const r = computeTypingSpeed({ mode: 'words', amount: 40, minutes: 1, errors: 0 });
		expect(r).not.toBeNull();
		expect(r!.grossWpm).toBe(40);
		expect(r!.netWpm).toBe(40);
		expect(r!.accuracyPct).toBe(100);
	});

	it('5 words in 1 minute, all 5 wrong: net WPM clamps to 0, accuracy 0%', () => {
		// gross = 5; errorWords = 5; net = max(0, 5-5) = 0
		const r = computeTypingSpeed({ mode: 'words', amount: 5, minutes: 1, errors: 5 });
		expect(r).not.toBeNull();
		expect(r!.grossWpm).toBe(5);
		expect(r!.netWpm).toBe(0);
		expect(r!.accuracyPct).toBe(0);
	});
});

describe('computeTypingSpeed — character-count mode', () => {
	it('250 characters in 1 minute, 0 errors: gross 50 WPM (the textbook example)', () => {
		// words = 250/5 = 50; gross = 50/1 = 50
		const r = computeTypingSpeed({ mode: 'characters', amount: 250, minutes: 1, errors: 0 });
		expect(r).not.toBeNull();
		expect(r!.grossWpm).toBe(50);
		expect(r!.netWpm).toBe(50);
		expect(r!.accuracyPct).toBe(100);
	});

	it('600 characters in 2 minutes, 25 error characters: gross 60, net 57.5, accuracy 95.8%', () => {
		// words = 600/5 = 120; gross = 120/2 = 60; errorWords = 25/5 = 5; net = 60 - 5/2 = 57.5
		// accuracy = (600-25)/600*100 = 95.8333... -> 95.8
		const r = computeTypingSpeed({ mode: 'characters', amount: 600, minutes: 2, errors: 25 });
		expect(r).not.toBeNull();
		expect(r!.grossWpm).toBe(60);
		expect(r!.netWpm).toBe(57.5);
		expect(r!.accuracyPct).toBe(95.8);
	});

	it('1,000 characters in 4.5 minutes, 10 errors: gross 44.4, net 43.9', () => {
		// words = 200; gross = 200/4.5 = 44.444... -> 44.4
		// errorWords = 10/5 = 2; net = 44.444... - 2/4.5 = 44.444 - 0.444 = 44.0 -> but round separately per spec:
		// grossWpm rounded first for display = 44.4; net computed from unrounded gross then rounded:
		// net = 44.4444... - 0.4444... = 44.0 exactly (both terms have the same repeating fraction)
		const r = computeTypingSpeed({ mode: 'characters', amount: 1000, minutes: 4.5, errors: 10 });
		expect(r).not.toBeNull();
		expect(r!.grossWpm).toBe(44.4);
		expect(r!.netWpm).toBe(44);
	});
});

describe('computeTypingSpeed — invalid input', () => {
	it('returns null for zero amount', () => {
		expect(computeTypingSpeed({ mode: 'words', amount: 0, minutes: 1, errors: 0 })).toBeNull();
	});
	it('returns null for negative minutes', () => {
		expect(computeTypingSpeed({ mode: 'words', amount: 40, minutes: -1, errors: 0 })).toBeNull();
	});
	it('returns null for zero minutes', () => {
		expect(computeTypingSpeed({ mode: 'words', amount: 40, minutes: 0, errors: 0 })).toBeNull();
	});
	it('returns null for negative errors', () => {
		expect(computeTypingSpeed({ mode: 'words', amount: 40, minutes: 1, errors: -1 })).toBeNull();
	});
	it('returns null when errors exceed amount', () => {
		expect(computeTypingSpeed({ mode: 'words', amount: 10, minutes: 1, errors: 11 })).toBeNull();
	});
	it('returns null for non-finite amount', () => {
		expect(computeTypingSpeed({ mode: 'words', amount: NaN, minutes: 1, errors: 0 })).toBeNull();
	});
});

describe('bandForWpm', () => {
	it('30 WPM falls inside the hunt-and-peck band (27-37)', () => {
		expect(bandForWpm(30)?.label).toBe('Hunt-and-peck (two-finger) typist');
	});
	it('37 WPM (upper edge) still matches hunt-and-peck', () => {
		expect(bandForWpm(37)?.label).toBe('Hunt-and-peck (two-finger) typist');
	});
	it('70 WPM falls inside the skilled/professional band (60-80)', () => {
		expect(bandForWpm(70)?.label).toBe('Skilled/professional typist');
	});
	it('60 WPM (lower edge) matches the skilled/professional band', () => {
		expect(bandForWpm(60)?.label).toBe('Skilled/professional typist');
	});
	it('40 WPM falls inside the 911 dispatcher minimum-requirement band (35-45)', () => {
		expect(bandForWpm(40)?.label).toBe('911 dispatcher / emergency operator, typical minimum requirement');
	});
	it('360 WPM matches the stenotype world-record band exactly', () => {
		expect(bandForWpm(360)?.label).toBe('Stenotype (court reporting) world record');
	});
	it('regression: 241-359 WPM (between the advanced and stenotype point-values) stays in advanced, not stenotype', () => {
		// Previously the nearest-neighbor fallback picked whichever of the two point-value
		// bands (120, 360) was arithmetically closer, so anything past the 240 midpoint
		// was mislabeled "stenotype world record" even though it's an ordinary (if very
		// fast) standard-keyboard reading, not a stenotype score. Independent audit finding, 2026-09-11.
		expect(bandForWpm(240)?.label).toBe('Advanced/highly skilled typist');
		expect(bandForWpm(241)?.label).toBe('Advanced/highly skilled typist');
		expect(bandForWpm(300)?.label).toBe('Advanced/highly skilled typist');
		expect(bandForWpm(359)?.label).toBe('Advanced/highly skilled typist');
	});
	it('10 WPM (below every band) falls back to the nearest band by midpoint (average composing, mid 19)', () => {
		// Midpoints: hunt-and-peck 32, composing 19, transcribing 32.5, mobile 36.2,
		// dispatcher 40, professional 70, advanced 120, stenotype 360.
		// Distances from 10: 22, 9, 22.5, 26.2, 30, 60, 110, 350. Closest is composing (9).
		expect(bandForWpm(10)?.label).toBe('Average computer user, composing text');
	});
	it('returns null for zero or negative WPM', () => {
		expect(bandForWpm(0)).toBeNull();
		expect(bandForWpm(-5)).toBeNull();
	});
	it('every benchmark has low <= high', () => {
		for (const b of WPM_BENCHMARKS) {
			expect(b.low).toBeLessThanOrEqual(b.high);
		}
	});
});
