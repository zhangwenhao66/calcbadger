/**
 * SAT raw-to-scaled score estimation.
 *
 * Data authority: College Board, "Scoring Your Paper SAT Practice Test #4"
 * (satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf,
 * (c) 2023 College Board, doc 2324-BB-852), "Raw Score Conversion Table:
 * Section Scores". The table was machine-extracted from that PDF, not
 * re-derived. Each raw score maps to a LOWER and UPPER scaled score because
 * the paper worksheet expresses digital-SAT scores as a range — the real
 * digital SAT is section-adaptive, so a single raw count cannot pin down one
 * exact score. This module therefore ESTIMATES a range; it is not an official
 * score report.
 *
 * Reading & Writing raw: 0-66 (two 33-question modules).
 * Math raw: 0-54 (two 27-question modules).
 */

export interface ScoreRange {
	lower: number;
	upper: number;
}

/** Index = raw score. [lower, upper] pairs, College Board PT#4 table, RW column. */
const RW_TABLE: ReadonlyArray<readonly [number, number]> = [
	[200, 200], [200, 200], [200, 200], [200, 200], [200, 200], // 0-4
	[200, 200], [200, 200], [200, 210], [200, 220], [210, 230], // 5-9
	[230, 250], [240, 260], [250, 270], [260, 280], [280, 300], // 10-14
	[290, 310], [320, 340], [340, 360], [350, 370], [360, 380], // 15-19
	[370, 390], [370, 390], [380, 400], [390, 410], [400, 420], // 20-24
	[410, 430], [420, 440], [420, 440], [430, 450], [440, 460], // 25-29
	[450, 470], [460, 480], [460, 480], [470, 490], [480, 500], // 30-34
	[490, 510], [490, 510], [500, 520], [510, 530], [520, 540], // 35-39
	[530, 550], [540, 560], [540, 560], [550, 570], [560, 580], // 40-44
	[570, 590], [580, 600], [590, 610], [590, 610], [600, 620], // 45-49
	[610, 630], [620, 640], [630, 650], [630, 650], [640, 660], // 50-54
	[650, 670], [660, 680], [670, 690], [680, 700], [690, 710], // 55-59
	[700, 720], [710, 730], [720, 740], [730, 750], [750, 770], // 60-64
	[770, 790], [790, 800], // 65-66
];

/** Index = raw score. [lower, upper] pairs, College Board PT#4 table, Math column. */
const MATH_TABLE: ReadonlyArray<readonly [number, number]> = [
	[200, 200], [200, 200], [200, 200], [200, 200], [200, 200], // 0-4
	[200, 200], [200, 200], [200, 220], [200, 230], [220, 250], // 5-9
	[250, 280], [280, 310], [290, 320], [300, 330], [310, 340], // 10-14
	[320, 350], [330, 360], [330, 360], [340, 370], [350, 380], // 15-19
	[360, 390], [370, 400], [370, 400], [380, 410], [390, 420], // 20-24
	[400, 430], [420, 450], [430, 460], [440, 470], [460, 490], // 25-29
	[470, 500], [480, 510], [500, 530], [510, 540], [520, 550], // 30-34
	[530, 560], [550, 580], [560, 590], [570, 600], [580, 610], // 35-39
	[590, 620], [600, 630], [620, 650], [630, 660], [650, 680], // 40-44
	[670, 700], [690, 720], [710, 740], [730, 760], [740, 770], // 45-49
	[750, 780], [760, 790], [770, 800], [780, 800], [790, 800], // 50-54
];

export const RW_MAX_RAW = RW_TABLE.length - 1; // 66
export const MATH_MAX_RAW = MATH_TABLE.length - 1; // 54

function lookup(table: ReadonlyArray<readonly [number, number]>, raw: number): ScoreRange {
	if (!Number.isInteger(raw) || raw < 0 || raw >= table.length) {
		throw new RangeError(`raw score must be an integer between 0 and ${table.length - 1}`);
	}
	const [lower, upper] = table[raw]!;
	return { lower, upper };
}

export function rwScoreRange(raw: number): ScoreRange {
	return lookup(RW_TABLE, raw);
}

export function mathScoreRange(raw: number): ScoreRange {
	return lookup(MATH_TABLE, raw);
}

/** Total = RW lower + Math lower to RW upper + Math upper (College Board worksheet method). */
export function totalScoreRange(rwRaw: number, mathRaw: number): ScoreRange {
	const rw = rwScoreRange(rwRaw);
	const math = mathScoreRange(mathRaw);
	return { lower: rw.lower + math.lower, upper: rw.upper + math.upper };
}
