import { describe, expect, it } from 'vitest';
import {
	MATH_MAX_RAW,
	mathScoreRange,
	RW_MAX_RAW,
	rwScoreRange,
	totalScoreRange,
} from '../src/lib/satScore';

/**
 * Fixture: the "Raw Score Conversion Table: Section Scores" from College
 * Board, "Scoring Your Paper SAT Practice Test #4" ((c) 2023 College Board,
 * 2324-BB-852), extracted verbatim with `pdftotext -layout` on 2026-08-02 —
 * an independent copy of the authoritative table, NOT derived from the
 * implementation. Each line: raw, RW lower, RW upper[, Math lower, Math upper]
 * (Math column ends at raw 54).
 */
const COLLEGE_BOARD_TABLE = `
0 200 200 200 200
1 200 200 200 200
2 200 200 200 200
3 200 200 200 200
4 200 200 200 200
5 200 200 200 200
6 200 200 200 200
7 200 210 200 220
8 200 220 200 230
9 210 230 220 250
10 230 250 250 280
11 240 260 280 310
12 250 270 290 320
13 260 280 300 330
14 280 300 310 340
15 290 310 320 350
16 320 340 330 360
17 340 360 330 360
18 350 370 340 370
19 360 380 350 380
20 370 390 360 390
21 370 390 370 400
22 380 400 370 400
23 390 410 380 410
24 400 420 390 420
25 410 430 400 430
26 420 440 420 450
27 420 440 430 460
28 430 450 440 470
29 440 460 460 490
30 450 470 470 500
31 460 480 480 510
32 460 480 500 530
33 470 490 510 540
34 480 500 520 550
35 490 510 530 560
36 490 510 550 580
37 500 520 560 590
38 510 530 570 600
39 520 540 580 610
40 530 550 590 620
41 540 560 600 630
42 540 560 620 650
43 550 570 630 660
44 560 580 650 680
45 570 590 670 700
46 580 600 690 720
47 590 610 710 740
48 590 610 730 760
49 600 620 740 770
50 610 630 750 780
51 620 640 760 790
52 630 650 770 800
53 630 650 780 800
54 640 660 790 800
55 650 670
56 660 680
57 670 690
58 680 700
59 690 710
60 700 720
61 710 730
62 720 740
63 730 750
64 750 770
65 770 790
66 790 800
`
	.trim()
	.split('\n')
	.map((line) => line.trim().split(/\s+/).map(Number));

describe('full-table cross-check against the College Board PDF extraction', () => {
	it('covers the full raw ranges (RW 0-66, Math 0-54)', () => {
		expect(RW_MAX_RAW).toBe(66);
		expect(MATH_MAX_RAW).toBe(54);
		expect(COLLEGE_BOARD_TABLE).toHaveLength(67);
	});

	for (const row of COLLEGE_BOARD_TABLE) {
		const [raw, rwLower, rwUpper, mathLower, mathUpper] = row;
		it(`raw ${raw} matches the published row`, () => {
			expect(rwScoreRange(raw!)).toEqual({ lower: rwLower, upper: rwUpper });
			if (mathLower !== undefined) {
				expect(mathScoreRange(raw!)).toEqual({ lower: mathLower, upper: mathUpper });
			}
		});
	}
});

describe('totalScoreRange (College Board worksheet: sum lowers, sum uppers)', () => {
	it('perfect raw scores -> 1580-1600', () => {
		expect(totalScoreRange(66, 54)).toEqual({ lower: 1580, upper: 1600 });
	});

	it('zero raw scores -> 400-400', () => {
		expect(totalScoreRange(0, 0)).toEqual({ lower: 400, upper: 400 });
	});

	it('mid-range: RW raw 40, Math raw 30 -> 1000-1050', () => {
		// RW 530-550 + Math 470-500, straight from the published rows above
		expect(totalScoreRange(40, 30)).toEqual({ lower: 1000, upper: 1050 });
	});
});

describe('input validation', () => {
	it('rejects out-of-range and non-integer raw scores', () => {
		expect(() => rwScoreRange(-1)).toThrow(RangeError);
		expect(() => rwScoreRange(67)).toThrow(RangeError);
		expect(() => mathScoreRange(55)).toThrow(RangeError);
		expect(() => rwScoreRange(12.5)).toThrow(RangeError);
	});
});
