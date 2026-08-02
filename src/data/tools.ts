export interface ToolSection {
	heading: string;
	body: string[];
}

export interface ReferenceTable {
	title: string;
	headers: string[];
	rows: string[][];
	note?: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface Source {
	label: string;
	url: string;
}

export interface Tool {
	slug: string;
	category: string;
	title: string;
	/** Short name for cards and related-tool lists. */
	shortTitle: string;
	description: string;
	updated: string;
	published?: string;
	/** One or two sentences surfaced above the fold for GEO/AI-search extraction. */
	coreSummary: string;
	/** Search phrasings this page covers; woven into headings/FAQ, also used for meta. */
	queries?: string[];
	sections: ToolSection[];
	referenceTables?: ReferenceTable[];
	faq: FaqItem[];
	sources: Source[];
	/** Suggested iframe height for the embed snippet, px. */
	embedHeight: number;
}

export function categorySlug(category: string): string {
	return category
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export const tools: Tool[] = [
	{
		slug: 'cd-calculator',
		category: 'Finance',
		title: 'CD Calculator',
		shortTitle: 'CD Calculator',
		description:
			'Work out what a certificate of deposit will be worth at maturity: final balance, total interest, and the effective APY for any rate, compounding schedule, and term.',
		updated: '2026-08-02',
		coreSummary:
			'A CD grows by compound interest: final balance = deposit × (1 + rate/n)^(n × years), where n is how often the bank compounds. If the bank quotes an APY, compounding is already baked in and the balance is simply deposit × (1 + APY)^years. This calculator handles both quote styles and shows the interest you actually walk away with at maturity.',
		queries: ['cd calculator', 'certificate of deposit calculator', 'cd interest calculator'],
		sections: [
			{
				heading: 'How CD interest actually compounds',
				body: [
					'A certificate of deposit pays compound interest: each time the bank credits interest, the next round of interest is calculated on the bigger balance. The standard formula is **A = P(1 + r/n)^(nt)** — P is your deposit, r the nominal annual rate as a decimal, n the number of compounding periods per year, and t the term in years.',
					"Banks compound daily, monthly, or quarterly depending on the product. The differences are smaller than people expect. On a $10,000 deposit at a 4.5% nominal rate for one year, daily compounding earns $460.25 and monthly compounding earns $459.40 — about 85 cents apart. The rate itself matters far more than the compounding schedule, which is exactly why banks advertise APY instead of the nominal rate.",
				],
			},
			{
				heading: 'APY vs. APR: which number did your bank give you?',
				body: [
					'Almost every CD ad in the US quotes an **APY** (annual percentage yield). APY already includes the effect of compounding — it is defined in Regulation DD (12 CFR 1030, Appendix A) as (1 + r/n)^n − 1, and it is the number banks must disclose under the Truth in Savings Act. If you have an APY, the balance after t years is just P(1 + APY)^t; picking a compounding frequency on top of it would double-count.',
					'The nominal rate (sometimes loosely called APR) is the raw annual rate before compounding. A 4.5% nominal rate compounded monthly works out to a 4.594% APY. This calculator has a toggle for which one you were quoted, so the math matches the disclosure instead of quietly inflating it.',
				],
			},
			{
				heading: 'Worked example: $10,000 in a 3-year CD at 4.50% APY',
				body: [
					'Deposit $10,000 into a 36-month CD paying 4.50% APY. Balance at maturity = 10,000 × (1.045)³ = 10,000 × 1.141166 = **$11,411.66**, so the CD earns $1,411.66 in interest. Note that it beats the naive 3 × $450 = $1,350 estimate by about $62 — that gap is the compounding, interest earning interest in years two and three.',
					'One thing the formula will not tell you: that $1,411.66 is taxable as ordinary income in the years the bank credits it, not when the CD matures. On a multi-year CD you will get a 1099-INT each year even though you cannot touch the money yet.',
				],
			},
			{
				heading: 'Early withdrawal penalties change the math',
				body: [
					'Pull money out before maturity and the bank charges a penalty, most commonly several months of interest (90 days is typical on short CDs, 180 days or more on longer terms — it is set by the bank and printed in the account disclosure). A penalty can eat into principal if you withdraw very early, since it can exceed the interest earned so far.',
					'If there is a real chance you will need the cash, compare the after-penalty result against a high-yield savings account before committing. A CD paying 0.5 percentage points more than a savings account stops being the better deal the moment a 6-month interest penalty lands on it.',
				],
			},
		],
		referenceTables: [
			{
				title: 'What $10,000 grows to at common APYs',
				headers: ['APY', '1 year', '2 years', '3 years', '5 years'],
				rows: [
					['3.0%', '$10,300.00', '$10,609.00', '$10,927.27', '$11,592.74'],
					['4.0%', '$10,400.00', '$10,816.00', '$11,248.64', '$12,166.53'],
					['4.5%', '$10,450.00', '$10,920.25', '$11,411.66', '$12,461.82'],
					['5.0%', '$10,500.00', '$11,025.00', '$11,576.25', '$12,762.82'],
				],
				note: 'Computed as 10,000 × (1 + APY)^years, interest left to compound until maturity.',
			},
		],
		faq: [
			{
				question: 'What is the difference between APY and interest rate on a CD?',
				answer:
					'The interest rate (nominal rate) is the raw annual rate before compounding. APY is the rate after compounding is included, defined by Regulation DD as (1 + r/n)^n − 1. Banks must disclose APY, so that is almost always the number in the ad. Compare CDs by APY and the compounding schedule stops mattering.',
			},
			{
				question: 'Is CD interest taxed?',
				answer:
					'Yes. Interest is ordinary income for federal tax in the year the bank credits it to the CD, even if the term has not ended. The bank reports it on a 1099-INT. CDs held inside an IRA follow the retirement account rules instead.',
			},
			{
				question: 'Are CDs FDIC insured?',
				answer:
					'CDs at FDIC-member banks are insured up to $250,000 per depositor, per bank, per ownership category, the same as checking and savings. Credit union CDs (share certificates) get equivalent NCUA coverage.',
			},
			{
				question: 'What happens when a CD matures?',
				answer:
					'Most banks give a grace period, commonly around 10 days, to withdraw or move the money. Do nothing and the CD typically auto-renews at the current rate for the same term, which may be far worse than the rate you signed up at. Put the maturity date on your calendar.',
			},
			{
				question: 'Does daily vs. monthly compounding matter much?',
				answer:
					'Barely. At 4.5% on $10,000 for a year, daily compounding beats monthly by less than a dollar. A 0.1 percentage point difference in APY matters more than any compounding schedule, which is why comparing APY directly is the sane way to shop.',
			},
		],
		sources: [
			{
				label: 'Regulation DD (12 CFR Part 1030), Appendix A — APY calculation',
				url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1030/appendix-Appendix%20A%20to%20Part%201030',
			},
			{
				label: 'Investor.gov (SEC) — compound interest calculator and formula',
				url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
			},
			{
				label: 'FDIC — deposit insurance coverage',
				url: 'https://www.fdic.gov/resources/deposit-insurance/',
			},
		],
		embedHeight: 660,
	},
	{
		slug: 'square-footage-calculator',
		category: 'Home Improvement',
		title: 'Square Footage Calculator',
		shortTitle: 'Square Footage',
		description:
			'Calculate the square footage of a room or area from its measurements — rectangles, L-shapes, circles, and triangles — with automatic conversion to square meters, square yards, and acres, plus a cost estimate.',
		updated: '2026-08-02',
		coreSummary:
			'Square footage is length × width measured in feet. A 12 ft × 10 ft room is 120 sq ft. For L-shaped rooms, split the floor into two rectangles and add them; for circles use π × (diameter/2)²; for triangles use base × height ÷ 2. One square meter equals 10.764 sq ft.',
		queries: [
			'square footage calculator',
			'sq ft calculator',
			'how to calculate square feet',
			'room square footage calculator',
		],
		sections: [
			{
				heading: 'Measuring a room without lying to yourself',
				body: [
					'Run a tape measure along the two walls at floor level, not across furniture, and write the numbers down in one unit. A room that measures 12 ft 6 in is 12.5 ft — divide the inches by 12 before multiplying, because 12 ft 6 in × 10 ft is 125 sq ft, not 126. Mixed-unit slips like that are the single most common way people end up a box short of flooring.',
					'Measure each room separately rather than pacing off the whole floor plan. Walls, closets and hallways make "the whole upstairs" much harder to estimate in one go than three rooms added together.',
				],
			},
			{
				heading: 'The formulas, shape by shape',
				body: [
					'**Rectangle or square:** length × width. This covers most rooms, decks, and lawns.',
					'**L-shape:** draw one line splitting the L into two rectangles, calculate each, and add them. A 20 × 12 living room with an 8 × 6 nook is 240 + 48 = 288 sq ft. Any straight-walled floor plan, however lumpy, breaks into rectangles the same way.',
					'**Circle:** π × radius², and the radius is half the diameter. A 10 ft diameter patio is π × 5² ≈ 78.5 sq ft.',
					'**Triangle:** base × height ÷ 2, where height is the straight-line distance from the base to the opposite corner, not the length of the slanted side.',
				],
			},
			{
				heading: 'Converting between units',
				body: [
					'The foot is defined as exactly 0.3048 meters, which makes one square meter 10.7639 sq ft and one square foot 0.0929 m². A square yard is exactly 9 sq ft, and an acre is exactly 43,560 sq ft — a 100 ft × 100 ft lot is 10,000 sq ft, just under a quarter acre.',
					'Carpet in the US is often priced per square yard while tile and laminate are priced per square foot. Divide sq ft by 9 for sq yd before comparing quotes, or a $30/yd² carpet will look nine times pricier than a $3.30/ft² one that costs the same.',
				],
			},
			{
				heading: 'From area to a shopping list',
				body: [
					'Flooring is not bought at exactly the room area. Cuts, breakage, and pattern matching waste material, so the working rule is to order 5–10% extra — closer to 10% for tile laid diagonally or planks in a small room with many doorways. For a 288 sq ft floor, that means ordering 300–320 sq ft and keeping the leftovers for repairs.',
					'Paint works from wall area instead: perimeter × wall height, minus windows and doors. A gallon of interior paint covers roughly 350–400 sq ft per coat, per the coverage figure printed on the can.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Common room sizes',
				headers: ['Room', 'Square feet', 'Square meters'],
				rows: [
					['10 × 10 ft', '100 sq ft', '9.3 m²'],
					['10 × 12 ft', '120 sq ft', '11.1 m²'],
					['12 × 12 ft', '144 sq ft', '13.4 m²'],
					['12 × 15 ft', '180 sq ft', '16.7 m²'],
					['15 × 20 ft', '300 sq ft', '27.9 m²'],
					['20 × 20 ft', '400 sq ft', '37.2 m²'],
				],
				note: 'Square meters rounded to one decimal (1 sq ft = 0.09290304 m² exactly).',
			},
		],
		faq: [
			{
				question: 'How many square feet is a 12x12 room?',
				answer: 'A 12 ft × 12 ft room is 144 square feet (about 13.4 m²).',
			},
			{
				question: 'How do I convert square feet to square meters?',
				answer:
					'Multiply by 0.0929. Going the other way, multiply square meters by 10.764. The factor is exact because a foot is defined as exactly 0.3048 m.',
			},
			{
				question: 'How do I calculate square footage of an odd-shaped room?',
				answer:
					'Split the floor into rectangles (and triangles if walls run at an angle), calculate each piece, and add them up. Any straight-walled shape can be decomposed this way; only genuinely curved walls need the circle formula.',
			},
			{
				question: 'How much extra flooring should I buy?',
				answer:
					'Add 5–10% to the measured area for cutting waste — the low end for straightforward plank layouts in big rooms, the high end for tile, diagonal patterns, or rooms with lots of corners and doorways.',
			},
			{
				question: 'Is square footage measured from inside or outside the walls?',
				answer:
					'For flooring and paint, measure the inside of the room — that is the surface you are covering. Real-estate listing conventions differ (they often use exterior dimensions and follow standards like ANSI Z765), which is why a listed home size rarely matches the sum of its rooms.',
			},
		],
		sources: [
			{
				label: 'NIST Special Publication 811 — unit definitions and conversion factors',
				url: 'https://www.nist.gov/pml/special-publication-811',
			},
			{
				label: 'ANSI Z765 — square footage method for calculating residential area',
				url: 'https://www.homeinnovation.com/services/accreditation/ansi_z765_square_footage_standard',
			},
		],
		embedHeight: 700,
	},
	{
		slug: 'stair-calculator',
		category: 'Construction',
		title: 'Stair Calculator',
		shortTitle: 'Stair Calculator',
		description:
			'Lay out a straight run of stairs from the total rise: number of risers and treads, exact riser height in carpenter-friendly fractions, total run, stringer length, and stair angle, checked against IRC limits.',
		updated: '2026-08-02',
		coreSummary:
			'Divide the total rise (floor to floor) by the code maximum riser height of 7¾ in and round up — that is your riser count. Riser height = total rise ÷ riser count, treads = risers − 1, total run = treads × tread depth, and stringer length is the diagonal: √(rise² + run²). A 9 ft rise needs 14 risers of 7 11/16 in each.',
		queries: ['stair calculator', 'stair stringer calculator', 'stair rise and run calculator'],
		sections: [
			{
				heading: 'What the code lets you build',
				body: [
					'For US residential stairs, the 2021 International Residential Code sets the two numbers everything else follows from: riser height no more than **7¾ in** (R311.7.5.1) and tread depth no less than **10 in** (R311.7.5.2). The same section caps the variation between the tallest and shortest riser in a flight at 3/8 in, which in practice means every riser gets cut identical.',
					'Commercial work under the IBC is stricter — 7 in maximum risers and 11 in minimum treads. The calculator defaults to the residential limits and lets you type in the commercial ones. Either way, local amendments override the model codes, so the number that finally matters is the one your building department enforces.',
				],
			},
			{
				heading: 'The riser-first method, worked through',
				body: [
					'Say the finished floor to finished floor rise is 9 ft, or 108 in. Divide by the 7.75 in maximum: 108 ÷ 7.75 = 13.94, round **up** to 14 risers. Rounding down would leave risers over the legal limit, which is why the direction of rounding is not a style choice.',
					'Each riser is then 108 ÷ 14 = 7.714 in ≈ **7 11/16 in**. A standard mount puts the top "tread" level with the upper floor, so a 14-riser stair has 13 treads. At a 10 in tread depth the total run is 130 in, and the stringer diagonal is √(108² + 130²) ≈ 169 in — call it 14 ft 1 in of 2×12 before waste, so you are buying 16-footers.',
					'The angle comes out to arctan(108/130) ≈ 39.7°, on the steep side of comfortable but fully legal. Deeper treads flatten the stair at the cost of run length.',
				],
			},
			{
				heading: 'Marking and cutting stringers',
				body: [
					'Set a framing square to riser height on one leg and tread depth on the other (stair gauges make this repeatable), then step it down the stringer once per tread. Two details catch first-timers: drop the bottom of the stringer by one tread-material thickness so the first step is not taller than the rest once treads go on, and keep the notches shallow enough that solid wood remains behind them — over-notched stringers are the classic wobbly-stair failure, and span tables assume the uncut depth.',
					'Cut one stringer, test-fit it against the actual floors, and only then use it as the template for the rest. A stringer that is 1/4 in off multiplies its error across every step.',
				],
			},
			{
				heading: 'Legal is not the same as comfortable',
				body: [
					'Carpenters have used the rule attributed to François Blondel since the 1600s: twice the riser plus the tread should land near 24–25 in, matching a natural walking gait. The 7 11/16 in riser with a 10 in tread from the example gives 2(7.71) + 10 = 25.4 in — acceptable, slightly steep. A 7 in riser with an 11 in tread hits exactly 25 in and is noticeably easier to climb.',
					'If the run space allows it, aim below the code maximums rather than at them. Stairs cut to the legal limit are the steepest stairs anyone is allowed to build, and they feel like it.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Riser counts at the IRC 7¾ in limit',
				headers: ['Total rise', 'Risers', 'Riser height', 'Run @ 10 in treads'],
				rows: [
					['24 in (2 ft)', '4', '6"', '30 in'],
					['36 in (3 ft)', '5', '7.2" (7 3/16")', '40 in'],
					['48 in (4 ft)', '7', '6.857" (6 7/8")', '60 in'],
					['60 in (5 ft)', '8', '7.5" (7 1/2")', '70 in'],
					['72 in (6 ft)', '10', '7.2" (7 3/16")', '90 in'],
					['96 in (8 ft)', '13', '7.385" (7 3/8")', '120 in'],
					['108 in (9 ft)', '14', '7.714" (7 11/16")', '130 in'],
					['120 in (10 ft)', '16', '7.5" (7 1/2")', '150 in'],
				],
				note: 'Risers = ceil(rise ÷ 7.75). Fractions rounded to the nearest 1/16 in.',
			},
		],
		faq: [
			{
				question: 'What is the maximum riser height for residential stairs?',
				answer:
					'7¾ inches under IRC R311.7.5.1, with no more than 3/8 in variation between risers in a flight. Some states amend this — Massachusetts, for example, has used different limits — so check the locally adopted code.',
			},
			{
				question: 'How many steps do I need for a 9 ft ceiling?',
				answer:
					'Floor-to-floor rise for a 9 ft ceiling is more than 108 in once joists and subfloor are added — measure the actual rise. At exactly 108 in you need 14 risers (13 treads); at a typical 119 in floor-to-floor you need 16.',
			},
			{
				question: 'Why does a stair have one more riser than treads?',
				answer:
					'The top riser lands on the upper floor itself, which acts as the final tread. Fourteen risers therefore stand on thirteen treads in a standard mount. A flush mount (stringer hung below the upper floor) uses equal counts — the calculator assumes standard.',
			},
			{
				question: 'What size lumber do stringers need?',
				answer:
					'2×12 is the standard stringer stock, because notching a smaller board leaves too little continuous wood. How far a cut stringer can span depends on the remaining (throat) depth — check the span guidance in your code or with your inspector rather than eyeballing it.',
			},
			{
				question: 'Do these numbers work for deck stairs?',
				answer:
					'Yes — same IRC limits. Measure total rise from the deck surface to where the stair lands (which may be a pad poured after the fact; account for its height), and remember treads built from two 5.5 in deck boards give an 11 in tread that beats the 10 in minimum comfortably.',
			},
		],
		sources: [
			{
				label: '2021 IRC R311.7.5 — stair risers, treads and dimensional limits (ICC)',
				url: 'https://codes.iccsafe.org/content/IRC2021P2/chapter-3-building-planning#IRC2021P2_Pt03_Ch03_SecR311.7',
			},
			{
				label: 'ICC — International Residential Code overview',
				url: 'https://www.iccsafe.org/products-and-services/i-codes/2021-i-codes/irc/',
			},
		],
		embedHeight: 700,
	},
	{
		slug: 'sat-score-calculator',
		category: 'Education',
		title: 'SAT Score Calculator',
		shortTitle: 'SAT Score',
		description:
			'Convert raw scores on a paper SAT practice test into scaled section scores and a 400–1600 total, using College Board’s official conversion table for Practice Test #4.',
		updated: '2026-08-02',
		coreSummary:
			'Count correct answers in each section of a paper SAT practice test (Reading & Writing out of 66, Math out of 54), then read the scaled score off College Board’s published conversion table. Answering everything right converts to 1580–1600; the scores come out as ranges because the real digital SAT is adaptive and a raw count alone cannot pin down one exact score.',
		queries: ['sat score calculator', 'sat raw score conversion', 'digital sat score calculator'],
		sections: [
			{
				heading: 'How the digital SAT is actually scored',
				body: [
					'The digital SAT gives two section scores, Reading & Writing and Math, each on a 200–800 scale, summing to a 400–1600 total. Each section runs in two modules, and the test adapts: how you do on the first module decides whether the second module is the harder or easier set. Your scaled score depends on both how many questions you got right and which questions they were.',
					'That is why no single raw-to-scaled table can exactly reproduce an official digital score. The number of correct answers alone genuinely does not contain enough information — two students with the same raw count on different module routes can earn different scaled scores.',
				],
			},
			{
				heading: 'Where this estimate comes from',
				body: [
					'College Board publishes paper versions of its digital practice tests, and those come with an official self-scoring worksheet: count correct answers per section, then look the raw score up in a conversion table that maps it to a lower and upper scaled score. This calculator implements the table from the scoring guide for **Practice Test #4** exactly as published — 67 Reading & Writing rows and 55 Math rows, nothing interpolated.',
					'The paper tests are linear rather than adaptive, which is also why they are longer: 66 Reading & Writing questions and 54 Math questions, against 54 and 44 on the adaptive digital test taken in the Bluebook app. If you practiced in Bluebook, the app scores you itself; this page is for the printable tests, or for getting a feel of how raw performance maps to the 1600 scale.',
				],
			},
			{
				heading: 'Reading the range honestly',
				body: [
					'A raw 50 in Reading & Writing converts to 610–630, and a raw 40 in Math to 590–620, for a 1200–1250 total. Treat the whole range as the estimate. Practice-test curves differ slightly from test to test (that is normal equating, not error), so a midpoint carried to single-point precision would be false confidence.',
					'The useful signal is movement between practice tests: going from 1150–1200 to 1250–1300 across a month of practice is real information, regardless of where in each range the true score would have landed.',
				],
			},
			{
				heading: 'Answer everything: there is no guessing penalty',
				body: [
					'The SAT stopped deducting points for wrong answers in 2016. Raw score is purely the count of correct answers, so a blank and a wrong answer cost exactly the same. On the digital test each remaining minute of a section is better spent eliminating one option and guessing than leaving anything unanswered.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Selected rows from the official conversion table (Practice Test #4)',
				headers: ['Raw score', 'Reading & Writing', 'Math'],
				rows: [
					['20', '370–390', '360–390'],
					['30', '450–470', '470–500'],
					['40', '530–550', '590–620'],
					['45', '570–590', '670–700'],
					['50', '610–630', '750–780'],
					['54', '640–660', '790–800 (max raw)'],
					['60', '700–720', '—'],
					['66', '790–800 (max raw)', '—'],
				],
				note: 'Full table: College Board, “Scoring Your Paper SAT Practice Test #4” (© 2023 College Board). Math raw scores end at 54.',
			},
		],
		faq: [
			{
				question: 'Does the SAT take points off for wrong answers?',
				answer:
					'No. Since 2016 the raw score is simply the number of correct answers. Never leave a question blank.',
			},
			{
				question: 'How many questions is the digital SAT?',
				answer:
					'The adaptive digital SAT in Bluebook has 54 Reading & Writing questions and 44 Math questions across two modules per section. The paper practice tests this calculator scores are longer — 66 and 54 — because a non-adaptive test needs more questions to measure the same range.',
			},
			{
				question: 'Why do I get a score range instead of one number?',
				answer:
					'Because the official paper-test worksheet reports ranges. The real test is adaptive, so a raw count maps to a span of plausible scaled scores depending on module difficulty; College Board publishes that span rather than pretending to more precision.',
			},
			{
				question: 'Can I score a Bluebook practice test with this?',
				answer:
					'No — Bluebook tests have different question counts and are scored in the app, which knows your module route. This calculator matches the printable paper practice tests.',
			},
			{
				question: 'What raw score do I need for a 1400?',
				answer:
					'On this table, a raw 58 in Reading & Writing (680–700) plus a raw 46 in Math (690–720) gives a combined 1370–1420, straddling 1400. Other practice tests will differ by a few raw points either way.',
			},
		],
		sources: [
			{
				label: 'College Board — Scoring Your Paper SAT Practice Test #4 (PDF, © 2023)',
				url: 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf',
			},
			{
				label: 'College Board — SAT practice tests',
				url: 'https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests',
			},
		],
		embedHeight: 560,
	},
	{
		slug: 'molarity-calculator',
		category: 'Science',
		title: 'Molarity Calculator',
		shortTitle: 'Molarity',
		description:
			'Convert between mass, molar mass, volume, and molar concentration — solve for molarity, grams of solute, solution volume, or molar mass, with common compound values built in.',
		updated: '2026-08-02',
		coreSummary:
			'Molarity (M) is moles of solute per liter of solution: M = mass ÷ (molar mass × volume). Dissolving 58.44 g of NaCl (one mole) in water to a final volume of 1 L gives a 1.000 M solution. The same relation rearranges to find the mass to weigh out, the volume to dilute to, or an unknown molar mass.',
		queries: ['molarity calculator', 'molar concentration calculator', 'grams to moles to molarity'],
		sections: [
			{
				heading: 'One formula, four unknowns',
				body: [
					'Molar concentration is defined as the amount of substance per volume of solution, c = n/V (IUPAC), and the amount in moles is mass divided by molar mass, n = m/M. Put together: **molarity = mass ÷ (molar mass × volume)**. Every question this calculator answers is that one relation solved for a different variable.',
					'Units matter more than the algebra. Mass goes in grams, molar mass in g/mol, and volume in liters of final solution. The most common slip in a lab notebook is using 250 instead of 0.250 for a 250 mL flask — a factor-of-1000 error that survives dimensional analysis only because nobody wrote the units down.',
				],
			},
			{
				heading: 'Worked example: 500 mL of 0.5 M NaCl',
				body: [
					'How much salt do you weigh out? Mass = molarity × molar mass × volume = 0.5 mol/L × 58.44 g/mol × 0.5 L = **14.61 g**. Dissolve it in less water than the target, then top up to the 500 mL line in a volumetric flask.',
					'The order matters: dissolving 14.61 g of NaCl in 500 mL of water gives slightly more than 500 mL of solution, and therefore slightly less than 0.5 M. Molarity is per liter of solution, not per liter of solvent added — that distinction is the whole reason volumetric flasks exist.',
				],
			},
			{
				heading: 'Molarity, molality, percent: not interchangeable',
				body: [
					'Molarity (mol per liter of solution) is convenient because volumes are easy to measure with glassware, but it shifts slightly with temperature as the solution expands or contracts. Molality — moles per kilogram of *solvent*, written m — ignores volume entirely and stays constant with temperature, which is why colligative-property calculations (freezing point depression, boiling point elevation) use it.',
					'Mass percent (g of solute per 100 g of solution) is how concentrated stock chemicals are usually labeled. Converting a bottle labeled "37% HCl" to molarity requires its density; the conversion is routine but not automatic, and it is a separate calculation from the one on this page.',
				],
			},
			{
				heading: 'Dilutions with C₁V₁ = C₂V₂',
				body: [
					'Diluting changes the volume but not the moles of solute, so concentration × volume stays equal before and after: C₁V₁ = C₂V₂. To make 500 mL of 0.5 M solution from a 6 M stock: V₁ = (0.5 × 500) ÷ 6 = 41.7 mL of stock, topped up to 500 mL.',
					'For strong acids, the safety rule rides along with the math: add the concentrated acid to the water, never water to the acid, so the heat of mixing is absorbed by the larger volume.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Molar masses of common lab compounds (PubChem)',
				headers: ['Compound', 'Formula', 'Molar mass', 'Grams for 1 L of 1 M'],
				rows: [
					['Sodium chloride', 'NaCl', '58.44 g/mol', '58.44 g'],
					['Sodium hydroxide', 'NaOH', '40.00 g/mol', '40.00 g'],
					['Potassium chloride', 'KCl', '74.55 g/mol', '74.55 g'],
					['Glucose', 'C₆H₁₂O₆', '180.16 g/mol', '180.16 g'],
					['Sodium bicarbonate', 'NaHCO₃', '84.01 g/mol', '84.01 g'],
					['Calcium carbonate', 'CaCO₃', '100.09 g/mol', '100.09 g'],
				],
				note: 'For 1 L of 0.1 M, divide the last column by 10.',
			},
		],
		faq: [
			{
				question: 'How do I calculate molarity from grams?',
				answer:
					'Divide the mass in grams by the molar mass to get moles, then divide by the solution volume in liters. 20 g of NaOH (molar mass 40.00 g/mol) in 500 mL: 20 ÷ 40 = 0.5 mol, then 0.5 ÷ 0.5 L = 1.0 M.',
			},
			{
				question: 'What is the difference between molarity and moles?',
				answer:
					'Moles measure an amount of substance; molarity measures how concentrated it is — moles per liter of solution. Half a mole in half a liter and one mole in one liter are different amounts at the same 1 M concentration.',
			},
			{
				question: 'Is molarity affected by temperature?',
				answer:
					'Slightly, yes. Warming a solution expands its volume, so the same moles sit in more liters and molarity drops a little. Molality (per kg of solvent) does not change with temperature, which is why it is preferred for temperature-dependent property calculations.',
			},
			{
				question: 'Why use a volumetric flask instead of a beaker?',
				answer:
					'Because molarity is defined per liter of final solution. A volumetric flask lets you dissolve the solute first and then fill to a calibrated line, so the final volume — not the added water — is exactly right. Beaker graduations are far less accurate.',
			},
			{
				question: 'What does a 1 M solution mean in practice?',
				answer:
					'One mole of solute in every liter of solution. For table salt that is 58.44 g per liter; seawater, for comparison, is roughly 0.5 M in NaCl.',
			},
		],
		sources: [
			{
				label: 'IUPAC Gold Book — amount concentration',
				url: 'https://goldbook.iupac.org/terms/view/A00295',
			},
			{
				label: 'PubChem (NIH) — compound molar masses',
				url: 'https://pubchem.ncbi.nlm.nih.gov/',
			},
		],
		embedHeight: 700,
	},
];
