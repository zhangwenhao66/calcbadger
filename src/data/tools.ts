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
					'A certificate of deposit pays compound interest: each time the bank credits interest, the next round of interest is calculated on the bigger balance. The standard formula is **A = P(1 + r/n)^(nt)**: P is your deposit, r the nominal annual rate as a decimal, n the number of compounding periods per year, and t the term in years.',
					"Banks compound daily, monthly, or quarterly depending on the product. The differences are smaller than people expect. On a $10,000 deposit at a 4.5% nominal rate for one year, daily compounding earns $460.25 and monthly compounding earns $459.40, about 85 cents apart. The rate itself matters far more than the compounding schedule, which is exactly why banks advertise APY instead of the nominal rate.",
				],
			},
			{
				heading: 'APY vs. APR: which number did your bank give you?',
				body: [
					'Almost every CD ad in the US quotes an **APY** (annual percentage yield). APY already includes the effect of compounding; it is defined in Regulation DD (12 CFR 1030, Appendix A) as (1 + r/n)^n − 1, and it is the number banks must disclose under the Truth in Savings Act. If you have an APY, the balance after t years is just P(1 + APY)^t; picking a compounding frequency on top of it would double-count.',
					'The nominal rate (sometimes loosely called APR) is the raw annual rate before compounding. A 4.5% nominal rate compounded monthly works out to a 4.594% APY. This calculator has a toggle for which one you were quoted, so the math matches the disclosure instead of quietly inflating it.',
				],
			},
			{
				heading: 'Worked example: $10,000 in a 3-year CD at 4.50% APY',
				body: [
					'Deposit $10,000 into a 36-month CD paying 4.50% APY. Balance at maturity = 10,000 × (1.045)³ = 10,000 × 1.141166 = **$11,411.66**, so the CD earns $1,411.66 in interest. Note that it beats the naive 3 × $450 = $1,350 estimate by about $62. That gap is the compounding, interest earning interest in years two and three.',
					'One thing the formula will not tell you: that $1,411.66 is taxable as ordinary income in the years the bank credits it, not when the CD matures. On a multi-year CD you will get a 1099-INT each year even though you cannot touch the money yet.',
				],
			},
			{
				heading: 'Early withdrawal penalties change the math',
				body: [
					'Pull money out before maturity and the bank charges a penalty, most commonly several months of interest (90 days is typical on short CDs, 180 days or more on longer terms; it is set by the bank and printed in the account disclosure). A penalty can eat into principal if you withdraw very early, since it can exceed the interest earned so far.',
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
				label: 'Regulation DD (12 CFR Part 1030), Appendix A: APY calculation',
				url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1030/appendix-Appendix%20A%20to%20Part%201030',
			},
			{
				label: 'Investor.gov (SEC): compound interest calculator and formula',
				url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
			},
			{
				label: 'FDIC: deposit insurance coverage',
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
			'Calculate the square footage of a room or area from its measurements, with conversions to square meters, square yards, and acres, plus a cost estimate.',
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
					'Run a tape measure along the two walls at floor level, not across furniture, and write the numbers down in one unit. A room that measures 12 ft 6 in is 12.5 ft: divide the inches by 12 before multiplying, because 12 ft 6 in × 10 ft is 125 sq ft, not 126. Mixed-unit slips like that are the single most common way people end up a box short of flooring.',
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
					'The foot is defined as exactly 0.3048 meters, which makes one square meter 10.7639 sq ft and one square foot 0.0929 m². A square yard is exactly 9 sq ft, and an acre is exactly 43,560 sq ft: a 100 ft × 100 ft lot is 10,000 sq ft, just under a quarter acre.',
					'Carpet in the US is often priced per square yard while tile and laminate are priced per square foot. Divide sq ft by 9 for sq yd before comparing quotes, or a $30/yd² carpet will look nine times pricier than a $3.30/ft² one that costs the same.',
				],
			},
			{
				heading: 'From area to a shopping list',
				body: [
					'Flooring is not bought at exactly the room area. Cuts, breakage, and pattern matching waste material, so the working rule is to order 5-10% extra, closer to 10% for tile laid diagonally or planks in a small room with many doorways. For a 288 sq ft floor, that means ordering 300–320 sq ft and keeping the leftovers for repairs.',
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
					'Add 5–10% to the measured area for cutting waste: the low end for straightforward plank layouts in big rooms, the high end for tile, diagonal patterns, or rooms with lots of corners and doorways.',
			},
			{
				question: 'Is square footage measured from inside or outside the walls?',
				answer:
					'For flooring and paint, measure the inside of the room, since that is the surface you are covering. Real-estate listing conventions differ (they often use exterior dimensions and follow standards like ANSI Z765), which is why a listed home size rarely matches the sum of its rooms.',
			},
		],
		sources: [
			{
				label: 'NIST Special Publication 811: unit definitions and conversion factors',
				url: 'https://www.nist.gov/pml/special-publication-811',
			},
			{
				label: 'ANSI Z765: square footage method for calculating residential area',
				url: 'https://www.homeinnovation.com/services/national_standards/square_footage_method_for_calculating',
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
			'Calculate stair layout from total rise: riser count, riser height in carpenter fractions, tread run, stringer length, and angle — checked against IRC limits.',
		updated: '2026-08-02',
		coreSummary:
			'Divide the total rise (floor to floor) by the code maximum riser height of 7¾ in and round up. That is your riser count. Riser height = total rise ÷ riser count, treads = risers − 1, total run = treads × tread depth, and stringer length is the diagonal: √(rise² + run²). A 9 ft rise needs 14 risers of 7 11/16 in each.',
		queries: ['stair calculator', 'stair stringer calculator', 'stair rise and run calculator'],
		sections: [
			{
				heading: 'What the code lets you build',
				body: [
					'For US residential stairs, the 2021 International Residential Code sets the two numbers everything else follows from: riser height no more than **7¾ in** (R311.7.5.1) and tread depth no less than **10 in** (R311.7.5.2). The same section caps the variation between the tallest and shortest riser in a flight at 3/8 in, which in practice means every riser gets cut identical.',
					'Commercial work under the IBC is stricter: 7 in maximum risers and 11 in minimum treads. The calculator defaults to the residential limits and lets you type in the commercial ones. Either way, local amendments override the model codes, so the number that finally matters is the one your building department enforces.',
				],
			},
			{
				heading: 'The riser-first method, worked through',
				body: [
					'Say the finished floor to finished floor rise is 9 ft, or 108 in. Divide by the 7.75 in maximum: 108 ÷ 7.75 = 13.94, round **up** to 14 risers. Rounding down would leave risers over the legal limit, which is why the direction of rounding is not a style choice.',
					'Each riser is then 108 ÷ 14 = 7.714 in ≈ **7 11/16 in**. A standard mount puts the top "tread" level with the upper floor, so a 14-riser stair has 13 treads. At a 10 in tread depth the total run is 130 in, and the stringer diagonal is √(108² + 130²) ≈ 169 in. Call it 14 ft 1 in of 2×12 before waste, so you are buying 16-footers.',
					'The angle comes out to arctan(108/130) ≈ 39.7°, on the steep side of comfortable but fully legal. Deeper treads flatten the stair at the cost of run length.',
				],
			},
			{
				heading: 'Marking and cutting stringers',
				body: [
					'Set a framing square to riser height on one leg and tread depth on the other (stair gauges make this repeatable), then step it down the stringer once per tread. Two details catch first-timers: drop the bottom of the stringer by one tread-material thickness so the first step is not taller than the rest once treads go on, and keep the notches shallow enough that solid wood remains behind them; over-notched stringers are the classic wobbly-stair failure, and span tables assume the uncut depth.',
					'Cut one stringer, test-fit it against the actual floors, and only then use it as the template for the rest. A stringer that is 1/4 in off multiplies its error across every step.',
				],
			},
			{
				heading: 'Legal is not the same as comfortable',
				body: [
					'Carpenters have used the rule attributed to François Blondel since the 1600s: twice the riser plus the tread should land near 24–25 in, matching a natural walking gait. The 7 11/16 in riser with a 10 in tread from the example gives 2(7.71) + 10 = 25.4 in, acceptable but slightly steep. A 7 in riser with an 11 in tread hits exactly 25 in and is noticeably easier to climb.',
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
					'7¾ inches under IRC R311.7.5.1, with no more than 3/8 in variation between risers in a flight. Some states amend this (Massachusetts, for example, has used different limits), so check the locally adopted code.',
			},
			{
				question: 'How many steps do I need for a 9 ft ceiling?',
				answer:
					'Floor-to-floor rise for a 9 ft ceiling is more than 108 in once joists and subfloor are added, so measure the actual rise. At exactly 108 in you need 14 risers (13 treads); at a typical 119 in floor-to-floor you need 16.',
			},
			{
				question: 'Why does a stair have one more riser than treads?',
				answer:
					'The top riser lands on the upper floor itself, which acts as the final tread. Fourteen risers therefore stand on thirteen treads in a standard mount. A flush mount (stringer hung below the upper floor) uses equal counts; the calculator assumes standard.',
			},
			{
				question: 'What size lumber do stringers need?',
				answer:
					'2×12 is the standard stringer stock, because notching a smaller board leaves too little continuous wood. How far a cut stringer can span depends on the remaining (throat) depth, so check the span guidance in your code or with your inspector rather than eyeballing it.',
			},
			{
				question: 'Do these numbers work for deck stairs?',
				answer:
					'Yes, same IRC limits. Measure total rise from the deck surface to where the stair lands (which may be a pad poured after the fact; account for its height), and remember treads built from two 5.5 in deck boards give an 11 in tread that beats the 10 in minimum comfortably.',
			},
		],
		sources: [
			{
				label: '2021 IRC R311.7.5: stair risers, treads and dimensional limits (ICC)',
				url: 'https://codes.iccsafe.org/content/IRC2021P2/chapter-3-building-planning#IRC2021P2_Pt03_Ch03_SecR311.7',
			},
			{
				label: 'ICC: International Residential Code overview',
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
					'That is why no single raw-to-scaled table can exactly reproduce an official digital score. The number of correct answers alone genuinely does not contain enough information: two students with the same raw count on different module routes can earn different scaled scores.',
				],
			},
			{
				heading: 'Where this estimate comes from',
				body: [
					'College Board publishes paper versions of its digital practice tests, and those come with an official self-scoring worksheet: count correct answers per section, then look the raw score up in a conversion table that maps it to a lower and upper scaled score. This calculator implements the table from the scoring guide for **Practice Test #4** exactly as published: 67 Reading & Writing rows and 55 Math rows, nothing interpolated.',
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
					'The adaptive digital SAT in Bluebook has 54 Reading & Writing questions and 44 Math questions across two modules per section. The paper practice tests this calculator scores are longer (66 and 54) because a non-adaptive test needs more questions to measure the same range.',
			},
			{
				question: 'Why do I get a score range instead of one number?',
				answer:
					'Because the official paper-test worksheet reports ranges. The real test is adaptive, so a raw count maps to a span of plausible scaled scores depending on module difficulty; College Board publishes that span rather than pretending to more precision.',
			},
			{
				question: 'Can I score a Bluebook practice test with this?',
				answer:
					'No. Bluebook tests have different question counts and are scored in the app, which knows your module route. This calculator matches the printable paper practice tests.',
			},
			{
				question: 'What raw score do I need for a 1400?',
				answer:
					'On this table, a raw 58 in Reading & Writing (680–700) plus a raw 46 in Math (690–720) gives a combined 1370–1420, straddling 1400. Other practice tests will differ by a few raw points either way.',
			},
		],
		sources: [
			{
				label: 'College Board: Scoring Your Paper SAT Practice Test #4 (PDF, © 2023)',
				url: 'https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-4-digital.pdf',
			},
			{
				label: 'College Board: SAT practice tests',
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
			'Convert between mass, molar mass, volume, and molar concentration: solve for molarity, grams of solute, solution volume, or molar mass, with common compound values built in.',
		updated: '2026-08-02',
		coreSummary:
			'Molarity (M) is moles of solute per liter of solution: M = mass ÷ (molar mass × volume). Dissolving 58.44 g of NaCl (one mole) in water to a final volume of 1 L gives a 1.000 M solution. The same relation rearranges to find the mass to weigh out, the volume to dilute to, or an unknown molar mass.',
		queries: ['molarity calculator', 'molar concentration calculator', 'grams to moles to molarity'],
		sections: [
			{
				heading: 'One formula, four unknowns',
				body: [
					'Molar concentration is defined as the amount of substance per volume of solution, c = n/V (IUPAC), and the amount in moles is mass divided by molar mass, n = m/M. Put together: **molarity = mass ÷ (molar mass × volume)**. Every question this calculator answers is that one relation solved for a different variable.',
					'Units matter more than the algebra. Mass goes in grams, molar mass in g/mol, and volume in liters of final solution. The most common slip in a lab notebook is using 250 instead of 0.250 for a 250 mL flask, a factor-of-1000 error that survives dimensional analysis only because nobody wrote the units down.',
				],
			},
			{
				heading: 'Worked example: 500 mL of 0.5 M NaCl',
				body: [
					'How much salt do you weigh out? Mass = molarity × molar mass × volume = 0.5 mol/L × 58.44 g/mol × 0.5 L = **14.61 g**. Dissolve it in less water than the target, then top up to the 500 mL line in a volumetric flask.',
					'The order matters: dissolving 14.61 g of NaCl in 500 mL of water gives slightly more than 500 mL of solution, and therefore slightly less than 0.5 M. Molarity is per liter of solution, not per liter of solvent added; that distinction is the whole reason volumetric flasks exist.',
				],
			},
			{
				heading: 'Molarity, molality, percent: not interchangeable',
				body: [
					'Molarity (mol per liter of solution) is convenient because volumes are easy to measure with glassware, but it shifts slightly with temperature as the solution expands or contracts. Molality, moles per kilogram of *solvent* written m, ignores volume entirely and stays constant with temperature, which is why colligative-property calculations (freezing point depression, boiling point elevation) use it.',
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
					'Moles measure an amount of substance; molarity measures how concentrated it is: moles per liter of solution. Half a mole in half a liter and one mole in one liter are different amounts at the same 1 M concentration.',
			},
			{
				question: 'Is molarity affected by temperature?',
				answer:
					'Slightly, yes. Warming a solution expands its volume, so the same moles sit in more liters and molarity drops a little. Molality (per kg of solvent) does not change with temperature, which is why it is preferred for temperature-dependent property calculations.',
			},
			{
				question: 'Why use a volumetric flask instead of a beaker?',
				answer:
					'Because molarity is defined per liter of final solution. A volumetric flask lets you dissolve the solute first and then fill to a calibrated line, so the final volume, not the added water, is exactly right. Beaker graduations are far less accurate.',
			},
			{
				question: 'What does a 1 M solution mean in practice?',
				answer:
					'One mole of solute in every liter of solution. For table salt that is 58.44 g per liter; seawater, for comparison, is roughly 0.5 M in NaCl.',
			},
		],
		sources: [
			{
				label: 'IUPAC Gold Book: amount concentration',
				url: 'https://goldbook.iupac.org/terms/view/A00295',
			},
			{
				label: 'PubChem (NIH): compound molar masses',
				url: 'https://pubchem.ncbi.nlm.nih.gov/',
			},
		],
		embedHeight: 700,
	},
	{
		slug: 'bmi-calculator',
		category: 'Health',
		title: 'BMI Calculator',
		shortTitle: 'BMI Calculator',
		description:
			'Calculate BMI from weight and height in US or metric units, see your CDC/WHO category and healthy-weight range, plus an optional Asian-population cutoff.',
		updated: '2026-08-02',
		coreSummary:
			'BMI = weight(kg) ÷ height(m)², or 703 × weight(lb) ÷ height(in)² in US units. CDC/WHO categories for adults are underweight below 18.5, healthy weight 18.5–24.9, overweight 25–29.9, and obesity at 30 or above (split into Class 1, 2, and 3 at 35 and 40). The same formula and cutoffs apply to men and women; for adults of Asian ancestry, the WHO recommends lower cutoffs of 23 for overweight and 27.5 for obesity.',
		queries: ['bmi calculator', 'bmi calculator for women', 'bmi chart', 'body mass index calculator'],
		sections: [
			{
				heading: 'The formula, and why two unit systems don’t match exactly',
				body: [
					'BMI is defined as weight divided by height squared, using kilograms and meters: **BMI = kg ÷ m²**. A 70 kg adult who is 1.75 m tall has a BMI of 70 ÷ 1.75² = 22.9.',
					'CDC’s US-units shortcut is **BMI = 703 × lb ÷ in²**, where 703 is a rounded conversion factor (the exact value is closer to 703.07). Run the same person through both formulas and the results differ by a few thousandths of a point. That gap is the rounding at work, and it never moves anyone across a category boundary.',
					'The formula does not change for sex or age past 20; CDC states plainly that adults use "standard BMI categories regardless of age, sex, or race." What differs between a BMI calculator "for men" and "for women" online is almost always just which example numbers the page uses, not the math underneath.',
				],
			},
			{
				heading: 'What the categories mean',
				body: [
					'CDC and WHO split adult BMI into four bands: **underweight** below 18.5, **healthy weight** 18.5–24.9, **overweight** 25–29.9, and **obesity** at 30 and above. Obesity is further split into Class 1 (30–34.9), Class 2 (35–39.9), and Class 3 or "severe obesity" (40 and above), which is the breakdown clinicians use to decide how urgently weight-related risk needs addressing.',
					'These bands come from population studies linking BMI to the risk of conditions like type 2 diabetes and cardiovascular disease, rather than from any single ideal number. CDC is explicit that BMI is "a screening measure" and "not intended to diagnose disease." It flags who might benefit from a closer look, without passing judgment on any one person’s health.',
				],
			},
			{
				heading: 'Worked examples',
				body: [
					"**5'9\", 160 lb**: total height is 69 in, so BMI = 703 × 160 ÷ 69² = 703 × 160 ÷ 4,761 ≈ 23.6, healthy weight and comfortably inside the 18.5–24.9 band.",
					'**175 cm, 95 kg**: BMI = 95 ÷ 1.75² = 95 ÷ 3.0625 ≈ 31.0, Class 1 obesity, just past the 30 threshold. The healthy-weight range for that same height is about 56.7–76.3 kg, so getting back into that range would take a loss of roughly 19 kg at minimum, more if the target is the middle of the band rather than its upper edge.',
					"**5'0\", 95 lb**: 60 in tall, BMI = 703 × 95 ÷ 3,600 ≈ 18.6, just inside healthy weight and only a tenth of a point above the underweight cutoff.",
				],
			},
			{
				heading: 'Where BMI gets the wrong answer',
				body: [
					'BMI cannot tell fat from muscle or bone, because it never measures either; it only relates total mass to height. CDC’s own FAQ says this outright: BMI "cannot distinguish fat mass from lean body mass." A muscular adult with low body fat can score "overweight" or "obese" on BMI while being metabolically healthy, and the reverse also happens: a sedentary adult with normal BMI but high visceral fat ("normal weight obesity") can carry real metabolic risk that BMI misses entirely.',
					'BMI also says nothing about where fat is stored, and abdominal fat carries more cardiovascular risk than fat carried elsewhere at the same total BMI. Waist circumference or waist-to-height ratio catch this distinction; a BMI number by itself does not. For adults under 20, pregnant women, and older adults with age-related muscle loss, CDC directs people to age-specific tools instead of the adult calculator.',
				],
			},
			{
				heading: 'Asian population cutoffs: a real distinction, backed by a specific study',
				body: [
					'In 2004 a WHO expert consultation reviewed evidence that Asian populations develop diabetes and cardiovascular risk at lower BMIs than the original WHO cutoffs assumed. At a given BMI, Asian adults tend to carry more body fat than European adults, which is the underlying reason the cutoffs shift. Published in *The Lancet* (2004;363:157–63), the consultation set out additional "public health action points" at BMI 23.0 and 27.5, plus 32.5 and 37.5 further along the same continuum, while keeping the original WHO/CDC cutoffs as the international default.',
					'This calculator defaults to the standard WHO/CDC bands and offers the Asian cutoffs as an explicit toggle instead of picking one silently. Which standard fits best depends on the population being assessed, and several national health agencies, including Singapore’s and Japan’s, have adopted the lower thresholds for exactly that reason.',
				],
			},
		],
		referenceTables: [
			{
				title: 'BMI chart: weight ranges by height (WHO/CDC standard)',
				headers: ['Height', 'Underweight', 'Healthy weight', 'Overweight', 'Obese'],
				rows: [
					["4'10\"", 'below 89 lb', '89–120 lb', '120–144 lb', 'above 144 lb'],
					["5'0\"", 'below 95 lb', '95–128 lb', '128–154 lb', 'above 154 lb'],
					["5'2\"", 'below 101 lb', '101–137 lb', '137–164 lb', 'above 164 lb'],
					["5'4\"", 'below 108 lb', '108–146 lb', '146–175 lb', 'above 175 lb'],
					["5'6\"", 'below 115 lb', '115–155 lb', '155–186 lb', 'above 186 lb'],
					["5'8\"", 'below 122 lb', '122–164 lb', '164–197 lb', 'above 197 lb'],
					["5'10\"", 'below 129 lb', '129–174 lb', '174–209 lb', 'above 209 lb'],
					["6'0\"", 'below 136 lb', '136–184 lb', '184–221 lb', 'above 221 lb'],
					["6'2\"", 'below 144 lb', '144–195 lb', '195–234 lb', 'above 234 lb'],
				],
				note: 'Boundaries computed at BMI 18.5 / 25.0 / 30.0 using 703 × lb ÷ in² (rounded to the nearest pound). Use the calculator above for metric or exact heights.',
			},
		],
		faq: [
			{
				question: 'Is BMI calculated differently for men and women?',
				answer:
					'No. The formula and the CDC/WHO category cutoffs are identical for adult men and women. Body fat percentage does differ by sex at the same BMI, but standard BMI itself does not adjust for it.',
			},
			{
				question: 'What is a normal BMI for my height?',
				answer:
					"Healthy weight is a BMI of 18.5–24.9. Enter your height in the calculator above to see the exact weight range that falls in that band; for example, a healthy weight at 5'9\" is roughly 125–169 lb.",
			},
			{
				question: 'Is BMI an accurate measure of health?',
				answer:
					'It is a useful population-level screening tool, not an individual diagnosis. CDC describes it as "one potential indicator" to be weighed alongside blood pressure, blood sugar, and other findings, since BMI cannot distinguish muscle from fat or account for where fat is stored.',
			},
			{
				question: 'Why does this calculator have an "Asian population" option?',
				answer:
					'A 2004 WHO expert consultation found that Asian populations face elevated diabetes and cardiovascular risk at lower BMIs than the original WHO cutoffs assumed, and proposed overweight starting at 23 and obesity at 27.5 instead of 25 and 30. Several Asian countries have adopted these lower thresholds in national guidelines.',
			},
			{
				question: 'Does BMI account for muscle mass?',
				answer:
					'No. BMI only relates total body weight to height, so it cannot separate muscle from fat. Very muscular people are routinely classified "overweight" or "obese" by BMI despite low body fat, which is the formula’s best-known limitation.',
			},
		],
		sources: [
			{
				label: 'CDC: About Adult BMI',
				url: 'https://www.cdc.gov/bmi/adult-calculator/index.html',
			},
			{
				label: 'CDC: BMI Frequently Asked Questions',
				url: 'https://www.cdc.gov/bmi/faq/index.html',
			},
			{
				label: 'WHO Expert Consultation, "Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies," The Lancet 2004;363:157-63',
				url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(03)15268-3/abstract',
			},
		],
		embedHeight: 760,
	},
	{
		slug: 'coin-flip-simulator',
		category: 'Games',
		title: 'Coin Flip Simulator & Probability Calculator',
		shortTitle: 'Coin Flip',
		description:
			'Flip 1 to 500 virtual coins at once (fair or weighted) and see the heads/tails split and longest streaks, or switch to the probability calculator to get the exact chance of any heads count using the binomial distribution.',
		updated: '2026-08-03',
		coreSummary:
			'A single fair coin flip is 50/50, but the chance of an exact result over many flips follows the binomial distribution: P(exactly k heads in n flips) = C(n,k) × p^k × (1−p)^(n−k), where C(n,k) is the number of ways to choose which k flips landed heads. Flipping 10 fair coins and getting exactly 5 heads happens 24.6% of the time, not 50%, because there are many more ways to land close to half-and-half than to land on all heads or all tails.',
		queries: [
			'flip a coin',
			'coin flip',
			'coin flip simulator',
			'coin toss probability',
			'binomial probability calculator',
		],
		sections: [
			{
				heading: 'A fair flip is 50/50, but a run of flips is not',
				body: [
					'Any single flip of a fair coin has a 50% chance of heads and a 50% chance of tails, full stop. What surprises people is that flipping several coins and getting an even split is not itself a 50/50 event. Flip 10 fair coins and the chance of landing exactly 5 heads and 5 tails is 24.6%, not 50%. The reason is combinatorial: there is only one way to get all 10 heads, but there are 252 different sequences of heads and tails that add up to exactly 5 heads, so that outcome is far more likely to occur even though no individual sequence is more likely than any other.',
					'That count of sequences is the binomial coefficient C(n,k) = n! / (k!(n−k)!), read "n choose k." Multiply it by the probability of one specific sequence with k heads, p^k × (1−p)^(n−k), and the result is the binomial probability mass function: **P(x; p, n) = C(n,x) × p^x × (1−p)^(n−x)**, the formula published in the NIST/SEMATECH Engineering Statistics Handbook. It applies to any fixed number of independent yes/no trials at a constant success probability, not just coins: free throws, quality-control pass rates, and A/B test conversions all follow the same shape.',
				],
			},
			{
				heading: 'Worked example: exactly 5 heads in 10 flips',
				body: [
					'n = 10, k = 5, p = 0.5. C(10,5) = 10!/(5!5!) = 252. P = 252 × 0.5⁵ × 0.5⁵ = 252 × (1/1024) = **24.6%**. Compare that to exactly 0 heads (all tails): C(10,0) = 1, so P = 1/1024 ≈ 0.10%, about 250 times rarer than the 5-heads outcome despite both being single, equally-likely coefficients away from a "special" result. This is why casino and lottery intuition about "streaks evening out" is subtly wrong: the evening-out is a fact about the count of nearby outcomes, not a force pulling future flips toward balance.',
				],
			},
			{
				heading: 'Worked example: is this coin actually fair?',
				body: [
					'Flip a coin 20 times and count 15 heads. Suspicious? Assume the coin is fair (p = 0.5) and ask how likely 15-or-more heads would be anyway: P(at least 15 of 20) = Σ, summing the binomial probability for k = 15 through 20, comes to 21,700⁄1,048,576 ≈ **2.07%**. That is well under the common 5% significance threshold researchers use to call a result "statistically significant," so 15-of-20 is mild evidence the coin is biased toward heads, though it would take considerably more flips (or a starker split) to be confident rather than merely suspicious. A single run of 15 heads out of 20 is unusual for a fair coin, but at 2% odds it still happens about 1 time in every 48 sittings: evidence, not proof.',
				],
			},
			{
				heading: 'Weighted coins and loaded dice logic',
				body: [
					'Everything above assumes p = 0.5, but the same formula works for any constant probability: a coin bent to land heads 60% of the time, a basketball player who makes 70% of free throws, or a manufacturing line with a 2% defect rate. Set p to whatever the per-trial probability actually is and C(n,x) × p^x × (1−p)^(n−x) still gives the exact chance of x successes in n trials. The calculator above accepts any chance of heads from 0% to 100%, which is what makes it useful beyond novelty coin flips: the same math answers "what are the odds of 3 or more defects in a batch of 50 at a 2% defect rate" (swap "heads" for "defect").',
				],
			},
		],
		referenceTables: [
			{
				title: 'Exact probability of each outcome, 10 fair coin flips',
				headers: ['Heads', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
				rows: [
					[
						'Probability',
						'0.10%',
						'0.98%',
						'4.39%',
						'11.72%',
						'20.51%',
						'24.61%',
						'20.51%',
						'11.72%',
						'4.39%',
						'0.98%',
						'0.10%',
					],
				],
				note: 'C(10,k) × 0.5^10 for k = 0…10. The distribution peaks at 5 (the middle), not because 5 is "favored," but because more sequences produce it.',
			},
			{
				title: 'Chance of at least one head, fair coin, by number of flips',
				headers: ['Flips', '1', '2', '3', '5', '10', '20'],
				rows: [['P(at least one head)', '50%', '75%', '87.5%', '96.9%', '99.90%', '99.9999%']],
				note: 'P(at least one head in n flips) = 1 − 0.5^n: the only way to get zero heads is all-tails, which shrinks fast as flips add up.',
			},
		],
		faq: [
			{
				question: 'What is the probability of flipping heads 10 times in a row?',
				answer:
					'0.5^10 = 1/1024 ≈ 0.098%. Each flip is independent, so the probabilities of a specific sequence multiply. That is the chance of one exact all-heads sequence, not the chance of "getting some result": every other specific 10-flip sequence is exactly as unlikely as that one.',
			},
			{
				question: 'Why is it not 50/50 to get an even split of heads and tails?',
				answer:
					'A single flip is 50/50, but a set of flips landing exactly half-and-half is a different question: it depends on how many distinct sequences produce that count. There are 252 ten-flip sequences with exactly 5 heads versus only 1 with all 10 heads, which is why 5-5 (24.6%) is far more likely than 10-0 (0.098%) even though no single sequence is favored over another.',
			},
			{
				question: 'How do I calculate the odds of a weighted or biased coin?',
				answer:
					'Use the same binomial formula P(x) = C(n,x) × p^x × (1−p)^(n−x), substituting the actual chance of heads for p instead of 0.5. This calculator accepts any probability from 0% to 100%, so the same math answers a weighted coin, a biased die face, or any other fixed-probability trial.',
			},
			{
				question: 'How many coin flips does it take to prove a coin is unfair?',
				answer:
					'There is no fixed number: it comes down to how unlikely the observed result would be under a fair coin. 15 heads out of 20 has about a 2% chance under fairness (mild evidence); to get below the stricter 1-in-1,000 threshold often used in quality control, you would need either a larger sample or a more lopsided split. More flips shrink the probability of a fair coin producing an extreme result by chance.',
			},
			{
				question: 'What is the longest heads streak I should expect in 100 flips?',
				answer:
					'Long streaks are far more common in a long run of flips than intuition suggests. A run of 5+ heads in a row shows up in most 100-flip sessions purely by chance. This calculator reports the actual longest streak from each simulated run rather than a single "expected" number, since streak length varies a lot from session to session even at the same flip count.',
			},
		],
		sources: [
			{
				label: 'NIST/SEMATECH e-Handbook of Statistical Methods: Binomial Distribution',
				url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm',
			},
			{
				label: 'NIST/SEMATECH e-Handbook: Are the Data Consistent with the Assumed Process Mean? (binomial significance testing)',
				url: 'https://www.itl.nist.gov/div898/handbook/prc/section2/prc23.htm',
			},
		],
		embedHeight: 780,
	},
	{
		slug: 'temperature-converter',
		category: 'Science',
		title: 'Temperature Converter',
		shortTitle: 'Temperature Converter',
		description:
			'Convert between Celsius, Fahrenheit, and Kelvin instantly, with reference tables for oven temperatures, fever/body-temperature readings, and everyday weather values.',
		updated: '2026-08-04',
		coreSummary:
			'°F = °C × 9/5 + 32 and K = °C + 273.15 are exact conversions by definition in the SI system (NIST SP 811), not measured approximations — so there is no rounding error in the formula itself, only in how many decimal places you choose to display. Enter a value on any of the three scales and this tool fills in the other two.',
		queries: [
			'celsius to fahrenheit',
			'fahrenheit to celsius',
			'temperature converter',
			'c to f',
			'f to c',
			'celsius to kelvin',
			'kelvin to celsius',
			'180 c to f',
			'40 c to f',
			'37 c to f',
			'what is normal body temperature in fahrenheit',
		],
		sections: [
			{
				heading: 'Why three temperature scales exist',
				body: [
					'Celsius, Fahrenheit, and Kelvin were built for three different jobs, which is why none of them lines up neatly with the others. Celsius (originally proposed in 1742) was defined so that water freezes at 0° and boils at 100° at standard atmospheric pressure — a scale built around a lab reference. Fahrenheit predates it by about three decades and uses a finer-grained scale where water freezes at 32° and boils at 212°, still the everyday standard in the US for weather and cooking.',
					'Kelvin is different in kind, not just in offset: it is the SI base unit for temperature, and 0 K is absolute zero — the point where a substance has the least thermal energy physically possible. Celsius and Fahrenheit both allow negative numbers because they are anchored to arbitrary reference points (water\'s freezing point); Kelvin never goes negative because it is anchored to a physical floor. Scientists default to Kelvin specifically to avoid negative temperatures breaking formulas like the ideal gas law, which require an absolute scale.',
				],
			},
			{
				heading: 'The conversion formulas',
				body: [
					'All three conversions are exact definitions, not measured constants: **°F = °C × 9/5 + 32**, **°C = (°F − 32) × 5/9**, and **K = °C + 273.15**. Because the offset between Celsius and Kelvin is fixed at exactly 273.15, a Kelvin reading is just a Celsius reading with the negative numbers pushed out of the way — a 1-degree change means the same amount of thermal energy on both scales, only the zero point moves.',
					'Fahrenheit and Celsius also change at different rates: a 1°C change equals a 1.8°F change (the 9/5 factor), so converting a *difference* between two temperatures uses a different multiplication than converting a single reading. A day that warms up "by 10°C" gets 18°F warmer, not 10°F warmer — a common mix-up between converting a point on the scale and converting a change along it.',
				],
			},
			{
				heading: 'Worked example: converting an oven temperature',
				body: [
					"A recipe from a European or Australian source calls for a 180°C oven. Converting: 180 × 9/5 + 32 = 324 + 32 = 356°F. Most US ovens dial in 25°F increments, so 356°F rounds to the nearest common setting — typically down to 350°F, which most bakers treat as close enough for the recipe to work, since a home oven's actual cavity temperature already swings several degrees around its setpoint during a bake.",
					"That rounding is a kitchen convention, not part of the math: this calculator always shows the exact converted value (356°F, not the rounded 350°F) so you can decide how much precision your oven and recipe actually need.",
				],
			},
			{
				heading: 'Worked example: reading a fever off a Celsius thermometer',
				body: [
					'A digital thermometer reads 38.5°C. Converting: 38.5 × 9/5 + 32 = 69.3 + 32 = 101.3°F. The CDC defines fever as a measured temperature of 100.4°F (38°C) or greater, so 38.5°C/101.3°F is above that threshold. Normal body temperature is commonly cited as 37°C/98.6°F, though individual baseline temperature varies by about ±0.5°C through the day and between people, which is why a single reading a few tenths above 37°C is not automatically a fever.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Oven temperatures: Celsius, Fahrenheit, Kelvin',
				headers: ['°C', '°F', 'K'],
				rows: [
					['120°C', '248°F', '393.15 K'],
					['140°C', '284°F', '413.15 K'],
					['150°C', '302°F', '423.15 K'],
					['160°C', '320°F', '433.15 K'],
					['170°C', '338°F', '443.15 K'],
					['180°C', '356°F', '453.15 K'],
					['190°C', '374°F', '463.15 K'],
					['200°C', '392°F', '473.15 K'],
					['210°C', '410°F', '483.15 K'],
					['220°C', '428°F', '493.15 K'],
					['230°C', '446°F', '503.15 K'],
					['240°C', '464°F', '513.15 K'],
					['250°C', '482°F', '523.15 K'],
				],
				note: 'Exact conversions via °F = °C×9/5+32. Home ovens are usually dialed in 25°F steps, so recipes round the converted value to the nearest common setting.',
			},
			{
				title: 'Body temperature and fever reference',
				headers: ['°C', '°F', 'Note'],
				rows: [
					['35.0°C', '95.0°F', 'Hypothermia range'],
					['36.0°C', '96.8°F', ''],
					['36.5°C', '97.7°F', ''],
					['36.6°C', '97.9°F', ''],
					['37.0°C', '98.6°F', 'Commonly cited normal temperature'],
					['37.2°C', '99.0°F', ''],
					['37.5°C', '99.5°F', ''],
					['37.8°C', '100.0°F', ''],
					['38.0°C', '100.4°F', 'CDC fever threshold'],
					['38.5°C', '101.3°F', ''],
					['39.0°C', '102.2°F', ''],
					['39.5°C', '103.1°F', ''],
					['40.0°C', '104.0°F', 'High fever'],
					['41.0°C', '105.8°F', ''],
					['42.0°C', '107.6°F', 'Hyperpyrexia — seek care'],
				],
				note: 'Exact conversions via °F = °C×9/5+32. Fever threshold per CDC (cdc.gov/port-health); "normal" varies by person, time of day, and measurement site (oral/rectal/tympanic/axillary).',
			},
			{
				title: 'Everyday reference points',
				headers: ['°C', '°F', 'K', 'Reference'],
				rows: [
					['-273.15°C', '-459.67°F', '0 K', 'Absolute zero'],
					['-40°C', '-40°F', '233.15 K', 'The one point where the scales cross'],
					['-20°C', '-4°F', '253.15 K', 'Deep freezer'],
					['-10°C', '14°F', '263.15 K', 'Cold winter day'],
					['0°C', '32°F', '273.15 K', 'Water freezes'],
					['10°C', '50°F', '283.15 K', 'Cool day'],
					['20°C', '68°F', '293.15 K', 'Room temperature'],
					['25°C', '77°F', '298.15 K', 'Mild/warm day'],
					['30°C', '86°F', '303.15 K', 'Hot day'],
					['37°C', '98.6°F', '310.15 K', 'Human body temperature'],
					['100°C', '212°F', '373.15 K', 'Water boils (at sea level)'],
				],
				note: 'Boiling and freezing points are for pure water at standard atmospheric pressure (1 atm); both shift at altitude.',
			},
		],
		faq: [
			{
				question: 'How do you convert Celsius to Fahrenheit?',
				answer:
					'Multiply the Celsius value by 9/5 (1.8) and add 32: °F = °C × 9/5 + 32. For example, 20°C × 1.8 = 36, plus 32 = 68°F. This is an exact conversion, not an approximation.',
			},
			{
				question: 'How do you convert Fahrenheit to Celsius?',
				answer:
					'Subtract 32 from the Fahrenheit value, then multiply by 5/9: °C = (°F − 32) × 5/9. For example, (68°F − 32) × 5/9 = 36 × 5/9 = 20°C.',
			},
			{
				question: 'What is 180°C in Fahrenheit?',
				answer:
					'180°C = 356°F exactly (180 × 9/5 + 32 = 356). It is a common oven-temperature conversion; most US ovens round it to the nearest dial setting, typically 350°F.',
			},
			{
				question: 'Is 38°C a fever?',
				answer:
					'Yes. The CDC defines fever as a measured temperature of 100.4°F (38°C) or greater. Normal body temperature is commonly cited around 37°C/98.6°F, but it varies somewhat by person and time of day, so a reading in between (37.5–37.9°C) is sometimes called a low-grade fever depending on the source.',
			},
			{
				question: 'What is absolute zero in Fahrenheit and Celsius?',
				answer:
					'Absolute zero is 0 Kelvin, which equals −273.15°C and −459.67°F. It is the coldest temperature theoretically possible — the point at which a system has minimum thermal energy — and is the reason the Kelvin scale never has negative numbers.',
			},
			{
				question: 'Why does Kelvin not use the degree symbol?',
				answer:
					'Kelvin is an absolute scale tied to a physical zero point rather than an arbitrary reference like water freezing, so the SI convention writes it as a plain unit ("300 K"), not a degree ("300°K"). Celsius and Fahrenheit keep the degree symbol because they are relative scales built around chosen reference points.',
			},
			{
				question: 'Does a 1-degree change mean the same thing on every scale?',
				answer:
					'No — this trips people up specifically when converting a *change* in temperature rather than a single reading. A 1°C change equals a 1.8°F change (or 1 K, since Kelvin and Celsius move at the same rate). Converting a temperature difference uses only the multiplier (×9/5 or ×5/9), not the +32/−32 offset, which only applies to single-point readings.',
			},
		],
		sources: [
			{
				label: 'NIST Special Publication 811 — Guide for the Use of the International System of Units (SI)',
				url: 'https://physics.nist.gov/cuu/pdf/sp811.pdf',
			},
			{
				label: 'CDC — Definitions of Signs, Symptoms, and Conditions of Ill Travelers (fever threshold)',
				url: 'https://www.cdc.gov/port-health/php/definitions-symptoms-reportable-illness/index.html',
			},
		],
		embedHeight: 420,
	},
	{
		slug: 'length-converter',
		category: 'Conversion',
		title: 'Length Converter',
		shortTitle: 'Length Converter',
		description:
			'Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles instantly, with reference tables for heights, tool sizes, and race distances.',
		updated: '2026-08-04',
		coreSummary:
			'1 inch equals exactly 2.54 centimeters, 1 foot equals exactly 0.3048 meters, and 1 mile equals exactly 1,609.344 meters, fixed by international agreement in 1959, not rounded from a measurement. Enter a length in any of eight units and this tool converts it to the other seven at once.',
		queries: [
			'cm to inches',
			'inches to cm',
			'mm to inches',
			'length converter',
			'km to miles',
			'miles to km',
			'meters to feet',
			'feet to meters',
			'inches to mm',
			'how many feet in a mile',
			'how many inches in a foot',
			'convert cm to inches',
			'30 cm in inches',
		],
		sections: [
			{
				heading: 'Two systems, one exact bridge',
				body: [
					"Metric length units scale by powers of ten from the meter (a millimeter is a thousandth, a kilometer is a thousand of them), so converting within the metric system is just moving a decimal point. Imperial units evolved separately, from body parts and land-measurement customs (a foot, a pace, the distance a team of oxen could plow before resting), which is why 12 inches make a foot but 3 feet make a yard and 1,760 yards make a mile. There was no consistent base, because none was designed in.",
					"Until 1959, the exact size of an inch even differed slightly between the US and UK, since each country had calibrated its own physical standard bar over time and the two had drifted apart by a few parts per million. The 1959 International Yard and Pound Agreement, signed by the US, UK, Canada, Australia, New Zealand, and South Africa, ended that by redefining the yard as exactly 0.9144 meters. That legal fix, not a new measurement, is where every imperial-to-metric length conversion used today ultimately comes from.",
				],
			},
			{
				heading: 'The exact factors this converter uses',
				body: [
					'Millimeters, centimeters, meters, and kilometers convert to each other by exact powers of ten (1 m = 1,000 mm = 100 cm = 0.001 km), since that is how the SI system is built. The imperial-to-metric bridge is exact by legal definition rather than by measurement: 1 in = 2.54 cm, 1 ft = 0.3048 m, 1 yd = 0.9144 m, and 1 mi = 1,609.344 m (NIST Handbook 44, Appendix C, marks each of these "exact"). Within the imperial system itself, 1 ft = 12 in, 1 yd = 3 ft, and 1 mi = 5,280 ft are also exact, unchanged since well before 1959.',
					'Because none of those factors is a round number in the other system, converted results almost never land on a clean decimal (1 cm is 0.393701 in, not 0.4). This tool shows results to 6 significant figures so the display is precise without turning into a wall of digits; the underlying arithmetic carries full floating-point precision regardless of what is shown.',
				],
			},
			{
				heading: 'Worked example: a height measurement',
				body: [
					'A form asks for height in centimeters, and the only figure on hand is 5 feet 9 inches. Converting: 5 ft 9 in is 69 inches total (5 × 12 + 9), and 69 × 2.54 = 175.26 cm. Going the other way, a doctor\'s chart reading of 175 cm converts to 175 ÷ 2.54 = 68.9 inches, or 5 feet 8.9 inches, which most height charts round to 5\'9" since a tenth of an inch is smaller than typical measurement error anyway.',
				],
			},
			{
				heading: 'Worked example: a race distance',
				body: [
					'A 10K race is defined as exactly 10 kilometers. In miles: 10 × 1,000 ÷ 1,609.344 = 6.2137 miles, which is why 10K races are sometimes advertised as "6.2 miles" in the US. A full marathon, defined as 42.195 km, works out to 26.2188 miles. The "26.2" bumper-sticker number is that value rounded to one decimal place, not a separately defined distance.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Centimeters to inches — quick reference',
				headers: ['cm', 'in'],
				rows: [
					['1 cm', '0.3937 in'],
					['2 cm', '0.7874 in'],
					['3 cm', '1.1811 in'],
					['4 cm', '1.5748 in'],
					['5 cm', '1.9685 in'],
					['6 cm', '2.3622 in'],
					['7 cm', '2.7559 in'],
					['8 cm', '3.1496 in'],
					['9 cm', '3.5433 in'],
					['10 cm', '3.9370 in'],
					['11 cm', '4.3307 in'],
					['12 cm', '4.7244 in'],
				],
				note: 'Exact conversion via 1 in = 2.54 cm. Useful for ruler/tape-measure readings and paper or screen sizes given in centimeters.',
			},
			{
				title: 'Height chart: feet & inches to centimeters',
				headers: ['ft/in', 'total inches', 'cm'],
				rows: [
					["5'0\"", '60 in', '152.4 cm'],
					["5'2\"", '62 in', '157.5 cm'],
					["5'4\"", '64 in', '162.6 cm'],
					["5'6\"", '66 in', '167.6 cm'],
					["5'8\"", '68 in', '172.7 cm'],
					["5'9\"", '69 in', '175.3 cm'],
					["5'10\"", '70 in', '177.8 cm'],
					["6'0\"", '72 in', '182.9 cm'],
					["6'2\"", '74 in', '188.0 cm'],
					["6'4\"", '76 in', '193.0 cm'],
					["6'6\"", '78 in', '198.1 cm'],
				],
				note: 'Exact conversion via 1 in = 2.54 cm, rounded to one decimal place.',
			},
			{
				title: 'Common race distances: kilometers vs. miles',
				headers: ['Distance', 'km', 'mi'],
				rows: [
					['400 m', '0.4 km', '0.2485 mi'],
					['1 mile', '1.6093 km', '1 mi'],
					['5K', '5 km', '3.1069 mi'],
					['10K', '10 km', '6.2137 mi'],
					['Half marathon', '21.0975 km', '13.1094 mi'],
					['Marathon', '42.195 km', '26.2188 mi'],
				],
				note: 'The mile row shows 1 mile in km for comparison; every other row starts from the km distance and converts to miles via 1 mi = 1,609.344 m.',
			},
		],
		faq: [
			{
				question: 'How many inches are in a centimeter?',
				answer:
					'1 centimeter equals 0.393701 inches (1 ÷ 2.54). To convert centimeters to inches, divide by 2.54; to go the other way, multiply inches by 2.54.',
			},
			{
				question: 'How many centimeters are in an inch?',
				answer: '1 inch equals exactly 2.54 centimeters. This has been the legal, exact definition since the 1959 International Yard and Pound Agreement.',
			},
			{
				question: 'How many feet are in a mile?',
				answer: 'There are exactly 5,280 feet in a mile (1 mile = 1,760 yards = 5,280 feet), a relationship that predates and is unchanged by the 1959 metric redefinition.',
			},
			{
				question: 'How do you convert kilometers to miles?',
				answer:
					'Divide the kilometer value by 1.609344, or multiply by roughly 0.621371 for a quick estimate. For example, 10 km ÷ 1.609344 ≈ 6.2137 miles.',
			},
			{
				question: 'How many millimeters are in an inch?',
				answer: '1 inch equals exactly 25.4 millimeters. This is the same 1959-defined exact relationship as the centimeter conversion, just expressed at a finer scale (2.54 cm × 10).',
			},
			{
				question: 'Is a mile longer than a kilometer?',
				answer: 'Yes. 1 mile equals 1.609344 kilometers, so a mile is about 60% longer than a kilometer. A "10K" race (10 kilometers) is shorter than a 10-mile race.',
			},
			{
				question: 'How many yards are in a mile?',
				answer: 'There are exactly 1,760 yards in a mile (5,280 feet ÷ 3 feet per yard).',
			},
		],
		sources: [
			{
				label: 'NIST — SI Units: Length (1959 Federal Register Notice, inch = 25.4 mm exactly)',
				url: 'https://www.nist.gov/pml/owm/si-units-length',
			},
			{
				label: 'NIST Handbook 44 (2026), Appendix C — General Tables of Units of Measurement',
				url: 'https://www.nist.gov/system/files/documents/2025/12/30/appc-26-HB44-20251222.pdf',
			},
		],
		embedHeight: 720,
	},
	{
		slug: 'weight-converter',
		category: 'Conversion',
		title: 'Weight Converter',
		shortTitle: 'Weight Converter',
		description:
			'Convert between micrograms, milligrams, grams, kilograms, ounces, pounds, and US tons instantly, with reference tables for body weight, cooking, newborn weight, and dosing.',
		updated: '2026-08-04',
		coreSummary:
			'1 pound equals exactly 0.45359237 kilograms and 1 ounce equals exactly 28.349523125 grams, fixed by international agreement in 1959, not rounded from a measurement. Enter a weight in any of seven units and this tool converts it to the other six at once.',
		queries: [
			'kg to lbs',
			'lbs to kg',
			'weight converter',
			'how many ounces in a pound',
			'how many grams in an ounce',
			'grams to lbs',
			'oz to lbs',
			'how many grams in a pound',
			'lbs to oz',
			'oz to grams',
			'grams to oz',
			'mg to g',
			'mcg to mg',
			'tons to lbs',
			'how many grams in a kilogram',
			'how many mg in a gram',
			'70 kg to lbs',
			'150 lbs to kg',
			'convert kg to lbs',
		],
		sections: [
			{
				heading: 'Two systems, one exact bridge',
				body: [
					'The metric side of this converter is pure arithmetic: a milligram is a thousandth of a gram and a kilogram is a thousand of them, so moving between mcg, mg, g, and kg is just sliding a decimal point. The pound and ounce come from a different lineage entirely: the avoirdupois system (from the French "aveir de pois," roughly "goods of weight"), which English wool and produce merchants adopted in the late Middle Ages for everyday trade goods. It is a separate system from troy weight, the older standard still used today only for precious metals: a troy ounce (31.1034768 g) is about 9.7% heavier than the avoirdupois ounce this converter uses, which is why a "one-ounce" gold coin is not the same mass as a "one-ounce" bag of flour. Avoirdupois displaced troy for general commerce partly because its 16-ounce pound splits evenly into halves, quarters, and eighths, where troy\'s 12-ounce pound does not.',
					'The 1959 International Yard and Pound Agreement (US, UK, Canada, Australia, New Zealand, and South Africa) is why this converter can treat "pound" as one unambiguous number: it fixed the avoirdupois pound at exactly 0.45359237 kg in all six countries, replacing figures each had previously calibrated to its own physical standard weight. That agreement did not erase every US/UK mass difference, though: a US "short ton" (2,000 lb, the one this tool uses) and a British "long ton" (2,240 lb) remain genuinely different units today, and neither equals a metric tonne (1,000 kg). Mixing them up is a real source of errors in freight and shipping paperwork.',
				],
			},
			{
				heading: 'The exact factors this converter uses',
				body: [
					'Micrograms, milligrams, grams, and kilograms convert to each other by exact powers of ten (1 kg = 1,000 g = 1,000,000 mg = 1,000,000,000 mcg), since that is how the SI system is built. The imperial bridge is fixed by legal definition rather than by measurement: 1 lb = 453.59237 g exactly (NIST Handbook 44, Appendix C, marks this "exact"). Neither the ounce nor the US ton has its own independent definition — both are derived arithmetically from that same fixed pound: 1 oz = 1 lb ÷ 16 = 28.349523125 g, and 1 US ton = 2,000 lb = 907,184.74 g.',
					"Because grams and pounds share no common round factor, most conversions land on a long decimal rather than a clean number (1 kg is 2.204623 lb, not 2.2). That matters more here than it might for a length or volume conversion: a nurse converting a dose between mg and mcg, or a lab weighing a reagent in g versus oz, is working with a figure where a rounding shortcut can shift the result by a meaningful margin. This tool carries the full floating-point calculation internally and rounds only for display, to 6 significant figures, so the number you copy is accurate even though the underlying arithmetic never actually stops at that many digits.",
				],
			},
			{
				heading: 'Worked example: body weight',
				body: [
					'A gym scale reads 68 kg, and a US fitness app wants pounds. Converting: 68 × (1,000 ÷ 453.59237) = 149.914 lb, which most trackers round to 149.9 lb. Going the other way, a US doctor\'s chart listing 150 lb converts to 150 × 0.45359237 = 68.0389 kg, close to but not exactly the 68 kg the scale first showed. The two figures were never meant to round-trip to the same decimal.',
				],
			},
			{
				heading: 'Worked example: a newborn\'s weight',
				body: [
					'A US hospital records a birth weight as 8 lb 6 oz, and a family abroad wants it in metric. Converting: 8 lb 6 oz is 134 oz total (8 × 16 + 6), and 134 × 28.349523125 = 3,798.84 g, or 3.799 kg. Baby-weight trackers usually show this as "3.8 kg," which is that figure rounded to one decimal place.',
				],
			},
			{
				heading: 'Worked example: a medication dose',
				body: [
					'A prescription label reads "levothyroxine 200 mcg," and a pharmacy reference lists the same drug in milligrams. Since 1 mg = 1,000 mcg exactly, 200 mcg = 0.2 mg. That distinction matters clinically: typing "200" into a field expecting milligrams instead of micrograms would be a 1,000-fold dosing error. Always convert dosing units explicitly rather than assuming the number carries over.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Kilograms to pounds: body weight range',
				headers: ['kg', 'lb'],
				rows: [
					['40 kg', '88.18 lb'],
					['50 kg', '110.23 lb'],
					['60 kg', '132.28 lb'],
					['70 kg', '154.32 lb'],
					['80 kg', '176.37 lb'],
					['90 kg', '198.42 lb'],
					['100 kg', '220.46 lb'],
				],
				note: 'Exact conversion via 1 lb = 0.45359237 kg, rounded to two decimal places.',
			},
			{
				title: 'Pounds to kilograms: body weight range',
				headers: ['lb', 'kg'],
				rows: [
					['100 lb', '45.36 kg'],
					['120 lb', '54.43 kg'],
					['140 lb', '63.50 kg'],
					['150 lb', '68.04 kg'],
					['160 lb', '72.57 kg'],
					['180 lb', '81.65 kg'],
					['200 lb', '90.72 kg'],
				],
				note: 'Exact conversion via 1 lb = 0.45359237 kg, rounded to two decimal places.',
			},
			{
				title: 'Ounces to grams: cooking measures',
				headers: ['oz', 'g'],
				rows: [
					['1 oz', '28.35 g'],
					['2 oz', '56.70 g'],
					['4 oz', '113.40 g'],
					['8 oz', '226.80 g'],
					['12 oz', '340.19 g'],
					['16 oz (1 lb)', '453.59 g'],
				],
				note: 'Exact conversion via 1 oz = 28.349523125 g, rounded to two decimal places. Common in recipes that mix US and metric measures.',
			},
			{
				title: 'Newborn weight: ounces to pounds & ounces',
				headers: ['Total oz', 'lb / oz'],
				rows: [
					['96 oz', '6 lb 0 oz'],
					['112 oz', '7 lb 0 oz'],
					['120 oz', '7 lb 8 oz'],
					['128 oz', '8 lb 0 oz'],
					['134 oz', '8 lb 6 oz'],
					['144 oz', '9 lb 0 oz'],
					['160 oz', '10 lb 0 oz'],
				],
				note: 'Splits total ounces into whole pounds plus remaining ounces, the format most US birth records use.',
			},
		],
		faq: [
			{
				question: 'How many pounds are in a kilogram?',
				answer: '1 kilogram equals approximately 2.204623 pounds. To convert kilograms to pounds, divide by 0.45359237; to go the other way, multiply pounds by 0.45359237.',
			},
			{
				question: 'How many kilograms are in a pound?',
				answer: '1 pound equals exactly 0.45359237 kilograms. This has been the legal, exact definition since the 1959 International Yard and Pound Agreement.',
			},
			{
				question: 'How many ounces are in a pound?',
				answer: 'There are exactly 16 ounces in an avoirdupois pound, a relationship that predates and is unchanged by the 1959 metric redefinition.',
			},
			{
				question: 'How do you convert kilograms to pounds?',
				answer: 'Multiply the kilogram value by 2.204623, or divide by 0.45359237 for the exact figure. For example, 70 kg × 2.204623 ≈ 154.32 lb.',
			},
			{
				question: 'How many grams are in an ounce?',
				answer: '1 ounce equals exactly 28.349523125 grams (1 pound ÷ 16, and 1 pound is fixed at 453.59237 g by the 1959 agreement).',
			},
			{
				question: 'Is a US ton the same as a metric tonne?',
				answer: 'No. A US (short) ton is exactly 2,000 pounds, or 907.18474 kg. A metric tonne is exactly 1,000 kg, about 10% heavier than a US ton. This converter uses the US short ton, the one used in US freight, agriculture, and construction contexts.',
			},
			{
				question: 'How many milligrams are in a gram?',
				answer: 'There are exactly 1,000 milligrams in a gram, and 1,000 micrograms in a milligram. Both are SI decimal prefixes, not measured relationships.',
			},
		],
		sources: [
			{
				label: 'NIST — SI Units: Mass',
				url: 'https://www.nist.gov/pml/owm/si-units-mass',
			},
			{
				label: 'NIST Handbook 44 (2026), Appendix C — General Tables of Units of Measurement',
				url: 'https://www.nist.gov/system/files/documents/2025/12/30/appc-26-HB44-20251222.pdf',
			},
		],
		embedHeight: 720,
	},
	{
		slug: 'mortgage-calculator',
		category: 'Finance',
		title: 'Mortgage Calculator',
		shortTitle: 'Mortgage Calculator',
		description:
			'Estimate your monthly mortgage payment (principal, interest, taxes, insurance, PMI and HOA) plus total interest over the life of the loan, for any home price, down payment, rate and term.',
		updated: '2026-08-05',
		coreSummary:
			'A fixed-rate mortgage payment is level for the life of the loan: M = P[r(1+r)^n]/[(1+r)^n−1], where P is the loan amount, r the monthly interest rate, and n the number of monthly payments. Early payments are mostly interest; later payments are mostly principal, even though the total check stays the same size every month. This calculator solves that formula for principal & interest, then adds taxes, insurance, PMI and HOA as flat monthly amounts on top to show the full payment.',
		queries: [
			'mortgage calculator',
			'home loan calculator',
			'monthly mortgage payment calculator',
			'how much is my mortgage payment',
			'mortgage payment calculator with taxes and insurance',
			'amortization calculator',
			'30 year mortgage calculator',
			'15 year mortgage calculator',
		],
		sections: [
			{
				heading: 'Why the payment never changes (but what it buys does)',
				body: [
					'A fixed-rate mortgage is "amortized": every payment is the same size, but the mix behind it shifts every month. On the first payment of a 30-year loan, the overwhelming majority of the check is interest on the full remaining balance; on the last payment, almost all of it is principal, because there is almost no balance left to charge interest on. This is not a lender trick; it falls straight out of the algebra of a level payment against a shrinking balance, consistent with the actuarial method Regulation Z (12 CFR Part 1026, Appendix J) prescribes for closed-end credit.',
					'The formula itself, M = P[r(1+r)ⁿ]/[(1+r)ⁿ−1], only produces the principal & interest (P&I) portion. It has no idea what your county charges in property tax or what your insurer charges for a policy. Those get added on afterward as flat monthly amounts, which is why this calculator asks for them separately rather than folding them into the rate.',
				],
			},
			{
				heading: 'Worked example: $400,000 home, 20% down, 6.5%, 30 years',
				body: [
					'Down payment: $400,000 × 20% = $80,000. Loan amount: $400,000 − $80,000 = $320,000. Plugging P = $320,000, r = 6.5%/12 = 0.0054167, n = 360 into the formula gives a principal & interest payment of $2,022.62/month. Over 360 payments that totals $728,142.36, of which $408,142.36 (more than the original loan amount) is interest, not principal.',
					'After exactly one year of on-time payments, the balance has dropped only to $316,423.28, barely 1.1% of the original loan, even though $24,271.44 has been paid in that year. That gap is the amortization curve at its steepest: interest still dominates every payment in year one. By year 15 (halfway through the term) the balance is $232,189.25, still 72.6% of the original loan, and it does not fall below half until shortly after year 20.',
				],
			},
			{
				heading: '15-year vs. 30-year: the same loan, two different trades',
				body: [
					'Take that same $320,000 loan and compare terms at rates typical of each (lenders generally price shorter terms lower, since they carry the loan for less time and less rate risk). At 30 years and 6.5%, the payment is $2,022.62/month with $408,142 in lifetime interest. At 15 years and a representative 5.85%, the payment rises to $2,674.48/month, about $652 more, but lifetime interest drops to $161,406, a savings of roughly $246,700 versus the 30-year loan.',
					"There is no universally correct choice here: the 15-year path builds equity faster and costs far less in total, but only if the higher payment fits the budget with room for emergencies. The 30-year path is more forgiving month to month, and the difference can be invested or used to pay down higher-interest debt instead. Some borrowers split the difference by taking a 30-year loan and voluntarily paying extra toward principal, which shortens the effective term without the higher payment being contractually required.",
				],
			},
			{
				heading: 'PMI: what it is, and when it goes away automatically',
				body: [
					'Private mortgage insurance (PMI) protects the lender, not the borrower, and typically applies to conventional loans with a down payment under 20%. It is usually priced as an annual percentage of the loan (roughly 0.5–1.5%, driven by credit score and down payment size) and billed monthly, which is why this calculator treats it as a flat monthly add-on rather than computing it.',
					'PMI is not permanent. Under the Homeowners Protection Act of 1998 (Public Law 105-216), a lender must automatically terminate PMI on a conventional loan once the balance is first scheduled to reach 78% of the home\'s original value, with no request required as long as the borrower is current on payments. A borrower can also request cancellation earlier, once the balance reaches 80% of original value, subject to the servicer\'s conditions. Extra principal payments reach that threshold sooner than the amortization schedule alone would.',
				],
			},
			{
				heading: 'Property tax, insurance and HOA: why they are flat, not amortized',
				body: [
					'Unlike principal & interest, property tax and homeowners insurance are not loan terms. They are recurring local-government and insurance-market costs that a lender typically collects monthly into an escrow account and pays on the borrower\'s behalf when the annual bills come due. This calculator simply divides whatever annual figures are entered by 12 and adds them to the P&I payment; it does not attempt to project future tax reassessments or insurance premium increases, both of which are common over a 30-year term and are the usual reason a "fixed" mortgage payment still changes year to year.',
					'HOA dues, where they apply, are billed directly by the association rather than through the lender\'s escrow account in most cases, but they still belong in a realistic monthly budget figure, which is why the calculator includes them in the total payment even though they never touch the amortization schedule itself.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Remaining balance by year: $320,000 loan at 6.5%, 30-year term',
				headers: ['End of year', 'Remaining balance', '% of original loan'],
				rows: [
					['1', '$316,423.28', '98.9%'],
					['5', '$299,555.13', '93.6%'],
					['10', '$271,283.60', '84.8%'],
					['15', '$232,189.25', '72.6%'],
					['20', '$178,128.90', '55.7%'],
					['25', '$103,373.32', '32.3%'],
					['30', '$0.00', '0%'],
				],
				note: 'Computed from the standard amortization formula; assumes every payment is made on time with no extra principal.',
			},
			{
				title: '15-year vs. 30-year term, same $320,000 loan',
				headers: ['Term', 'Rate', 'Monthly P&I', 'Total interest'],
				rows: [
					['30 years', '6.5%', '$2,022.62', '$408,142.36'],
					['15 years', '5.85%', '$2,674.48', '$161,406.06'],
				],
				note: 'Rates are illustrative: 15-year loans are typically priced lower than 30-year loans for the same borrower. Enter your own quoted rate for each term to compare precisely.',
			},
		],
		faq: [
			{
				question: 'How is a monthly mortgage payment calculated?',
				answer:
					'Principal & interest use the level-payment amortization formula M = P[r(1+r)ⁿ]/[(1+r)ⁿ−1], where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of monthly payments. Property tax, homeowners insurance, PMI and HOA dues are added on top as flat monthly amounts; they are not part of the amortization formula itself.',
			},
			{
				question: 'What down payment do I need to avoid PMI?',
				answer:
					'On a conventional loan, putting down at least 20% of the home price generally avoids private mortgage insurance. Below 20%, PMI is standard, but the Homeowners Protection Act requires it to be automatically canceled once the loan balance is first scheduled to reach 78% of the home\'s original value, provided payments are current.',
			},
			{
				question: 'Should I choose a 15-year or 30-year mortgage?',
				answer:
					'A 30-year term has a lower required monthly payment and more flexibility; a 15-year term has a higher payment but typically a lower rate and dramatically less total interest, since less time means less interest accrues and more of each payment is principal from the start. On a $320,000 loan, the difference in lifetime interest can exceed $240,000.',
			},
			{
				question: 'Why does my total payment include more than principal and interest?',
				answer:
					'Most US lenders collect property tax and homeowners insurance monthly through an escrow account and pay the annual bills on your behalf, and PMI (if required) and HOA dues are billed on the same monthly cycle. Principal & interest is fixed by the loan terms; the escrow and PMI portions can change if tax assessments, insurance premiums, or PMI eligibility change.',
			},
			{
				question: 'Does paying extra toward principal actually save money?',
				answer:
					'Yes. Because interest is charged on the outstanding balance each month, any extra amount applied directly to principal reduces every subsequent month\'s interest charge for the rest of the loan, which is why voluntary extra payments shorten a loan\'s effective payoff time without refinancing.',
			},
		],
		sources: [
			{
				label: 'Regulation Z, 12 CFR Part 1026, Appendix J — actuarial method for closed-end credit',
				url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/j/',
			},
			{
				label: 'CFPB — How do mortgage lenders calculate monthly payments?',
				url: 'https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/',
			},
			{
				label: 'CFPB — Homeowners Protection Act (HPA / PMI Cancellation Act) examination procedures',
				url: 'https://www.consumerfinance.gov/compliance/supervision-examinations/homeowners-protection-act-hpa-or-pmi-cancellation-act-examination-procedures/',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'time-converter',
		category: 'Conversion',
		title: 'Time Converter',
		shortTitle: 'Time Converter',
		description:
			'Convert between seconds, minutes, hours, days, weeks, months, and years instantly, with reference tables for "how many hours/minutes/seconds in a year" and worked examples for ages, projects, and countdowns.',
		updated: '2026-08-05',
		coreSummary:
			'A day is exactly 24 hours (86,400 seconds) and a week is exactly 7 days, both fixed by definition. A calendar month or year has no single fixed length (28-31 days per month, 365 or 366 days per year), so this converter uses the mean Gregorian month (30.436875 days) and mean Gregorian year (365.2425 days), the exact average over the calendar\'s 400-year leap cycle, not an estimate. Enter a duration in any of seven units and this tool converts it to the other six at once.',
		queries: [
			'time converter',
			'time unit converter',
			'how many weeks in a year',
			'how many seconds in a day',
			'how many days in a year',
			'how many hours in a year',
			'how many hours in a week',
			'how many minutes in a day',
			'how many seconds in a year',
			'how many weeks in a month',
			'how many minutes in a year',
			'convert days to weeks',
			'convert hours to days',
			'convert minutes to hours',
		],
		sections: [
			{
				heading: 'Exact units, and units with no fixed length',
				body: [
					'Seconds through weeks convert by whole, unchanging numbers: an hour is always 60 minutes, a day is always 24 hours, and a week is always 7 days. The BIPM SI Brochure (the document that defines the modern metric system) lists minute, hour, and day among the non-SI units "accepted for use with the SI," fixed at exactly those ratios. There is nothing to average or estimate here.',
					'Months and years are different: a calendar month runs anywhere from 28 to 31 days, and a calendar year is 365 days most of the time but 366 in a leap year, so "1 month" or "1 year" is not a single number of seconds the way "1 week" is. This converter uses the *mean* Gregorian month and year instead of picking one calendar year arbitrarily. The Gregorian calendar\'s own leap-year rule (a year divisible by 4 is a leap year, except century years, which are leap years only if divisible by 400) produces exactly 97 leap years in every 400-year span, per the US Naval Observatory\'s leap-year explainer, so 400 years always contain exactly 146,097 days. Dividing that cycle evenly gives a mean year of 365.2425 days and a mean month (one-twelfth of that) of 30.436875 days. Both are exact arithmetic consequences of the calendar\'s own rule, not estimates or rounded guesses.',
				],
			},
			{
				heading: 'The seconds-per-unit behind this converter',
				body: [
					'1 minute = 60 s, 1 hour = 3,600 s, 1 day = 86,400 s, and 1 week = 604,800 s, all exact. The mean month is 2,629,746 s (30.436875 days) and the mean year is 31,556,952 s (365.2425 days), both derived from the 146,097-day, 400-year Gregorian cycle. Because months and years don\'t divide evenly into whole days, converting "1 year" to days gives 365.2425 rather than a round 365. That 0.2425-day remainder is exactly what leap days exist to correct for, spread out as one extra day roughly every four years instead of applied all at once.',
					'Where an exact conversion isn\'t possible (there is no whole number of weeks in a month, for instance), this tool reports the mean-calendar figure to six significant figures rather than rounding to a convenient but less accurate number like "4 weeks."',
				],
			},
			{
				heading: 'Worked example: a project timeline',
				body: [
					'A project is quoted as taking "8 months." Converting: 8 × 4.348125 = 34.785 weeks, or roughly 34 weeks and 5-6 days depending on which actual calendar months the project spans. Because real calendar months vary in length, a project that starts on a long-month boundary (like starting in a 31-day month) will run slightly longer in calendar days than one measured purely by the mean-month figure. Treat it as a rough estimate, not a substitute for counting the actual calendar dates involved.',
				],
			},
			{
				heading: "Worked example: someone's age in seconds",
				body: [
					'A person turning 30 today has been alive for roughly 30 × 31,556,952 = 946,708,560 seconds, or 30 × 365.2425 = 10,957.275 days. The extra 0.2425 days per year is the accumulated effect of the roughly 7 or 8 leap days they lived through. This is why "how many seconds old am I" calculators that just multiply by a plain 365 will drift off by about 7.3 days worth of seconds (around 628,560 seconds) by age 30, versus the mean-year figure used here.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Exact conversions (no averaging)',
				headers: ['Unit', 'Equals'],
				rows: [
					['1 minute', '60 seconds'],
					['1 hour', '60 minutes = 3,600 seconds'],
					['1 day', '24 hours = 1,440 minutes = 86,400 seconds'],
					['1 week', '7 days = 168 hours = 10,080 minutes = 604,800 seconds'],
				],
				note: 'Minute, hour, and day are fixed by definition (BIPM SI Brochure); a week\'s 7 days is a near-universal calendar convention rather than a BIPM-listed unit. All four ratios above are exact and unchanging, with no calendar involved.',
			},
			{
				title: '"How many X in a year" — three conventions compared',
				headers: ['Basis', 'Days', 'Hours', 'Minutes', 'Seconds'],
				rows: [
					['Common (non-leap) calendar year', '365', '8,760', '525,600', '31,536,000'],
					['Leap calendar year', '366', '8,784', '527,040', '31,622,400'],
					['Mean Gregorian year (this converter)', '365.2425', '8,765.82', '525,949.2', '31,556,952'],
				],
				note: 'The "quick fact" figures most searches expect (e.g. 8,760 hours) use the plain 365-day count; the mean Gregorian figure accounts for leap years averaged over the calendar\'s 400-year cycle.',
			},
			{
				title: 'Months and weeks',
				headers: ['Duration', 'In weeks'],
				rows: [
					['1 mean month (30.436875 days)', '4.348125 weeks'],
					['3 mean months (1 quarter)', '13.04 weeks'],
					['6 mean months', '26.09 weeks'],
					['1 mean year', '52.1775 weeks'],
				],
				note: 'A calendar year has 52 weeks plus 1 extra day (2 in a leap year), not an even 52; that\'s why the weeks-per-year figure isn\'t a round number.',
			},
		],
		faq: [
			{
				question: 'How many seconds are in a day?',
				answer: 'Exactly 86,400, from 24 hours × 60 minutes × 60 seconds. This is fixed by definition and never varies.',
			},
			{
				question: 'How many hours are in a week?',
				answer: 'Exactly 168 (7 days × 24 hours), the same fixed relationship used for seconds in a day.',
			},
			{
				question: 'How many minutes are in a day?',
				answer: 'Exactly 1,440, from 24 hours × 60 minutes.',
			},
			{
				question: 'How many days are in a year?',
				answer:
					'365 in a common calendar year, 366 in a leap year. Averaged over the Gregorian calendar\'s 400-year leap cycle, the mean works out to 365.2425 days. That\'s the figure this converter uses for "1 year."',
			},
			{
				question: 'How many hours are in a year?',
				answer:
					'8,760 in a 365-day year, 8,784 in a leap year (366 days). Using the mean Gregorian year (365.2425 days), it works out to 8,765.82 hours.',
			},
			{
				question: 'How many seconds are in a year?',
				answer:
					'31,536,000 in a 365-day year, 31,622,400 in a leap year. The mean Gregorian year (365.2425 days) works out to 31,556,952 seconds.',
			},
			{
				question: 'How many minutes are in a year?',
				answer:
					'525,600 in a 365-day year, 527,040 in a leap year. The mean Gregorian year works out to 525,949.2 minutes.',
			},
			{
				question: 'How many weeks are in a year?',
				answer:
					'52 weeks plus 1 extra day in a common year (2 extra days in a leap year), since 365 ÷ 7 = 52.14. ISO 8601\'s week-numbering calendar assigns most years 52 weeks but designates certain years as 53-week "long years."',
			},
			{
				question: 'How many weeks are in a month?',
				answer:
					'About 4.3, or precisely 4.348125 weeks using the mean Gregorian month (30.436875 days). Individual calendar months range from exactly 4 weeks (28-day February) to 4 weeks and 3 days (31-day months).',
			},
		],
		sources: [
			{
				label: 'BIPM SI Brochure — Annex 1: Units of time accepted for use with the SI',
				url: 'https://www.bipm.org/en/publications/si-brochure/annex-1/time',
			},
			{
				label: 'US Naval Observatory — Leap Years FAQ',
				url: 'https://aa.usno.navy.mil/faq/leap_years',
			},
		],
		embedHeight: 740,
	},
];
