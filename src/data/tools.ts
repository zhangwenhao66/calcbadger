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
			'Convert between mass, molar mass, and volume to solve for molarity, grams of solute, solution volume, or molar mass, with compound values built in.',
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
	{
		slug: 'concrete-calculator',
		category: 'Construction',
		title: 'Concrete Calculator',
		shortTitle: 'Concrete Calculator',
		description:
			'Calculate how much concrete a slab, footing, wall, column, or post hole needs in cubic feet and cubic yards, plus how many 40, 50, 60, or 80 lb bags to buy.',
		updated: '2026-08-05',
		coreSummary:
			'Concrete volume is just geometry: a slab, footing, or wall is length × width × thickness; a column, tube, or post hole is π × (diameter/2)² × depth. Divide cubic feet by 27 to get cubic yards for a ready-mix order. For bagged mix, QUIKRETE Concrete Mix (Product No. 1101) publishes exact yields — 40 lb bags give 0.30 ft³, 50 lb give 0.375 ft³, 60 lb give 0.45 ft³, and 80 lb give 0.60 ft³ — so bags needed = volume ÷ yield, rounded up.',
		queries: [
			'concrete calculator',
			'how much concrete do i need',
			'concrete bags calculator',
			'post hole concrete calculator',
			'how many bags of concrete do i need',
		],
		sections: [
			{
				heading: 'The formula: volume first, bags second',
				body: [
					'Every concrete estimate starts as a volume problem. A slab, footing, or wall is a rectangular prism: **volume = length × width × thickness**. A column, sonotube, or fence post hole is a cylinder: **volume = π × radius² × depth**, where radius is half the diameter. Get the volume in cubic feet, then divide by 27 (a cubic yard is 3 ft × 3 ft × 3 ft = 27 cubic feet) to get the number a ready-mix plant will quote you.',
					'The part people get wrong is thickness. Slab thickness is almost always specified in inches (4 in for a patio, 6 in for a driveway) while the footprint is measured in feet — mixing the two without converting is the single most common way to over- or under-order by a factor of 12.',
				],
			},
			{
				heading: 'Worked example: a 10 × 10 ft patio slab, 4 in thick',
				body: [
					'Convert 4 in to feet first: 4 ÷ 12 = 0.3333 ft. Volume = 10 × 10 × 0.3333 = **33.33 cubic feet**. Divide by 27: 33.33 ÷ 27 = **1.235 cubic yards**. Add a 10% waste allowance for an uneven sub-base and form leakage: 33.33 × 1.10 = 36.67 ft³, or about 1.36 cu yd — that is the number to hand a ready-mix dispatcher.',
					'For bags instead: 36.67 ft³ ÷ 0.60 ft³ per 80 lb bag = 61.1, rounded up to **62 bags** (4,960 lb of mix). At 60 lb bags it is 36.67 ÷ 0.45 = 81.5, rounded up to 82 bags — same concrete, more bags to carry, because each 60 lb bag holds less mix per pound than an 80 lb bag of the same product.',
				],
			},
			{
				heading: 'Bags vs. ready-mix: where the line actually is',
				body: [
					'Bagged mix is fine for anything a couple of people can comfortably wheelbarrow-mix in an afternoon — fence posts, small footings, patch repairs, slabs under roughly a cubic yard. Past that, most contractors switch to a ready-mix truck: a full load, delivered and poured in minutes, is more uniform than dozens of hand-mixed batches, and the total labor of opening, mixing, and hauling 60-plus bags usually costs more than the delivery minimum on a ready-mix order.',
					'Ready-mix trucks are quoted and billed in cubic yards, and most plants round an order up to the nearest quarter or half yard rather than delivering a fractional amount — so the cubic-yard figure from this calculator (with waste included) is exactly what to give the dispatcher.',
				],
			},
			{
				heading: 'Setting a fence post: the 3×-diameter rule',
				body: [
					"QUIKRETE's own installation instructions for setting posts specify digging the hole about **3 times the diameter of the post**, with a **hole depth equal to 1/3 of the post's overall height**. Tamp roughly 6 inches of dry mix into the bottom before setting the post plumb, then pour the rest wet and let it cure at least 24 hours before the post takes any load.",
					"That 3×-diameter rule is what the round-shape mode above uses: enter the hole diameter (not the post diameter) and the hole depth, and it returns the volume for the concrete collar around the post, not the post itself.",
				],
			},
			{
				heading: 'Why add a waste allowance at all',
				body: [
					'The math above gives the geometric volume of the finished pour, not what actually leaves the mixer. Sub-grade is rarely perfectly flat, forms flex and leak a little at the seams, and wheelbarrow spillage is real — so a 5-10% overage is standard estimating practice, higher for irregular shapes like post holes dug by hand and lower for a clean rectangular slab poured against tight forms. Order short and a job stalls waiting on a second batch or delivery; order a bit long and the leftover fills a few paver joints or a birdbath mold.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Bag yield by size (QUIKRETE Concrete Mix 1101)',
				headers: ['Bag size', 'Yield per bag', 'Bags per cubic yard'],
				rows: [
					['40 lb', '0.30 ft³', '90 bags'],
					['50 lb', '0.375 ft³', '72 bags'],
					['60 lb', '0.45 ft³', '60 bags'],
					['80 lb', '0.60 ft³', '45 bags'],
				],
				note: 'Bags per cubic yard = 27 ÷ yield per bag, before any waste allowance.',
			},
			{
				title: 'Common pours, no waste allowance added',
				headers: ['Project', 'Cubic feet', 'Cubic yards', '80 lb bags'],
				rows: [
					['10 × 10 ft slab, 4 in thick', '33.3 ft³', '1.23 yd³', '56 bags'],
					['20 × 3 ft sidewalk, 4 in thick', '20.0 ft³', '0.74 yd³', '34 bags'],
					['8 × 4 ft footing, 8 in deep', '21.3 ft³', '0.79 yd³', '36 bags'],
					['10 in dia. post hole, 24 in deep', '1.09 ft³', '0.04 yd³', '2 bags'],
				],
				note: 'Computed as length × width × depth (or π × radius² × depth for the post hole), divided by 0.60 ft³ per 80 lb bag and rounded up.',
			},
		],
		faq: [
			{
				question: 'How much concrete do I need for a 10x10 slab?',
				answer:
					'At a standard 4 in thickness, a 10 × 10 ft slab is 33.33 cubic feet, or about 1.23 cubic yards. Add a 5-10% waste allowance before ordering — roughly 1.30-1.36 cubic yards, or about 59-62 bags of 80 lb mix.',
			},
			{
				question: 'How many 80 lb bags of concrete are in a cubic yard?',
				answer:
					'45 bags. An 80 lb bag of QUIKRETE Concrete Mix yields 0.60 cubic feet, and a cubic yard is 27 cubic feet, so 27 ÷ 0.60 = 45 bags exactly, before any waste allowance.',
			},
			{
				question: 'How deep should a fence post hole be?',
				answer:
					"QUIKRETE's installation guidance calls for a hole about 3 times the post's diameter across, with a depth equal to roughly 1/3 of the post's overall height. A 6 ft fence post typically needs a hole around 2 ft deep, adjusted for frost depth and local code in cold climates.",
			},
			{
				question: 'Should I use bags or order ready-mix concrete?',
				answer:
					'Bags make sense up to roughly a cubic yard — small slabs, footings, and post holes a couple of people can mix by hand in an afternoon. Beyond that, a ready-mix truck delivers a uniform batch in one pour and usually costs less in total than the labor of opening and mixing 60-plus bags, even after the delivery minimum.',
			},
			{
				question: 'How much extra concrete should I order for waste?',
				answer:
					'5-10% above the calculated volume is standard: the low end for a clean rectangular slab poured against tight forms, the high end for irregular shapes or hand-dug post holes where the excavation is uneven.',
			},
			{
				question: 'What is the difference between 60 lb and 80 lb bags?',
				answer:
					'Both are the same QUIKRETE Concrete Mix formula, just packaged in different weights. An 80 lb bag yields 0.60 cubic feet and a 60 lb bag yields 0.45 cubic feet — the 80 lb bag delivers more concrete per bag (fewer bags to carry for the same pour) but is proportionally heavier to lift.',
			},
		],
		sources: [
			{
				label: 'QUIKRETE Concrete Mix (Product No. 1101) technical data sheet, revised October 2022',
				url: 'https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf',
			},
			{
				label: 'NIST Special Publication 811: unit definitions and conversion factors',
				url: 'https://www.nist.gov/pml/special-publication-811',
			},
		],
		embedHeight: 780,
	},
	{
		slug: 'percentage-calculator',
		category: 'Math',
		title: 'Percentage Calculator',
		shortTitle: 'Percentage Calculator',
		description:
			'Find a percentage of a number, work out what percent one number is of another, calculate percentage increase or decrease, apply a discount, or compare two values with percent difference.',
		updated: '2026-08-06',
		coreSummary:
			'Percent means "parts per hundred" (BIPM SI Brochure §5.4.7), so every percentage question is one rearrangement of part = (percent ÷ 100) × whole. "Percentage change" measures a move from an old value to a new one — (new − old) ÷ |old| × 100 — and always uses the old value as the base, which is why a 50% drop followed by a 50% rise does not return you to where you started (100 → 50 → 75, a net −25%). "Percent difference" is a different, symmetric formula — |a − b| ÷ ((a + b) ÷ 2) × 100 — used when comparing two values where neither one is the reference.',
		queries: [
			'percentage calculator',
			'percentage increase calculator',
			'percent off calculator',
			'percentage of a number calculator',
			'percent difference calculator',
			'what is 20 percent of 50',
		],
		sections: [
			{
				heading: 'One formula, three questions',
				body: [
					'Every basic percentage question is the same equation — **part = (percent ÷ 100) × whole** — asked with a different piece missing. "What is 20% of 50?" gives you the percent and the whole, and asks for the part (20 ÷ 100 × 50 = 10). "10 is what percent of 40?" gives you the part and the whole, and asks for the percent (10 ÷ 40 × 100 = 25%). "10 is 20% of what number?" gives you the part and the percent, and asks for the whole (10 ÷ (20 ÷ 100) = 50). The "Basic percentage" mode above is exactly this triangle: pick which piece you are solving for, and the other two become the inputs.',
					'The word itself tells you why the formula works: "percent" comes from the Latin *per centum*, "by the hundred," and the BIPM\'s own style guide for the SI confirms the modern usage — the % symbol is internationally recognized and, in running text, "generally takes the meaning of parts per hundred." A percentage is not a unit of anything on its own; it is always a percentage *of* some specific base number, which is the "whole" in the formula above.',
				],
			},
			{
				heading: 'Percentage change is not percentage difference',
				body: [
					'These two get mixed up constantly because they look almost identical, but they answer different questions and can give different numbers for the same pair of values. **Percentage change** — (new − old) ÷ |old| × 100 — always treats one value as the starting point. A stock at $80 that closes at $60 is down (60 − 80) ÷ 80 × 100 = −25%; the $80 is the anchor, so going back up from $60 to $80 would be a +33.3% change, not +25% — the base moved.',
					'**Percentage difference** — |a − b| ÷ ((a + b) ÷ 2) × 100 — has no anchor. It is used to compare two independent measurements when neither one is the "correct" answer, so it divides by their average instead of by either value alone. Two lab scales reading 10 g and 12 g for the same object differ by |10 − 12| ÷ ((10 + 12) ÷ 2) × 100 = 18.18%, and it would come out exactly the same if the scales had reported 12 g and 10 g in the opposite order — swap a and b in a percentage-change calculation and the answer changes sign and magnitude. If one of those two readings is actually the accepted/true value rather than a second independent measurement, that is a third, related calculation — percent error — which divides by the accepted value instead of the average: (12 − 10) ÷ 10 × 100 = 20%, a different number again for the same two readings.',
				],
			},
			{
				heading: 'Why a 50% drop and a 50% rise do not cancel out',
				body: [
					'This is the most common percentage mistake, and it is a direct consequence of "percentage change always uses the old value as its base." Take $100, apply a 50% decrease: $100 × (1 − 0.50) = $50. Apply a 50% increase to that new number: $50 × (1 + 0.50) = $75. The two 50%-magnitude moves do not cancel — you end up at $75, a net change of (75 − 100) ÷ 100 × 100 = −25% from where you started. Each percentage move is calculated against whatever the current value is at that moment, not against the original number, so a loss always needs a *larger* percentage gain to fully recover: recovering from that $50 back to $100 requires a 100% increase, not 50%.',
				],
			},
			{
				heading: 'Reading a discount tag correctly',
				body: [
					'"Percent off" mode applies a straightforward version of the same base formula: **amount saved = original price × (discount ÷ 100)**, and **sale price = original price − amount saved**. A $79.99 item marked 30% off saves 79.99 × 0.30 = $23.997, which rounds to $24.00 for display; the sale price works out to 79.99 − 23.997 = $55.993, or $55.99 at the register. Because the original price is already a whole number of cents, rounding the savings first and then subtracting, or subtracting first and then rounding, always lands on the same cent — the two don\'t drift apart. A store\'s "you saved $X!" badge that looks rounded more loosely (to the nearest dollar rather than the nearest cent) is a marketing choice, not a sign that the underlying math disagrees with a hand calculation.',
					'Stacked discounts do not add. A 20%-off sale on top of an already-30%-off clearance item is not 50% off the original price — it is 20% off the *already-discounted* price. $100 at 30% off is $70; take another 20% off that $70 and you get $56, a total discount of 44%, not 50%.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Common "percent of a number" results',
				headers: ['Question', 'Answer'],
				rows: [
					['20% of 50', '10'],
					['20% of 80', '16'],
					['20% of 100', '20'],
					['15% of 100', '15'],
					['15% of 200', '30'],
					['10% of 50', '5'],
					['10% of 100', '10'],
					['25% of 80', '20'],
					['30% of 150', '45'],
				],
				note: 'Each value is percent ÷ 100 × whole, computed directly — e.g. 15% of 200 = 0.15 × 200 = 30.',
			},
			{
				title: 'Percent, decimal, and fraction equivalents',
				headers: ['Percent', 'Decimal', 'Fraction'],
				rows: [
					['10%', '0.1', '1/10'],
					['12.5%', '0.125', '1/8'],
					['20%', '0.2', '1/5'],
					['25%', '0.25', '1/4'],
					['33.33% (repeating)', '0.3333...', '1/3'],
					['50%', '0.5', '1/2'],
					['75%', '0.75', '3/4'],
					['100%', '1', '1/1'],
				],
				note: 'To convert percent to decimal, divide by 100 (move the decimal point two places left); to go from decimal to percent, multiply by 100.',
			},
		],
		faq: [
			{
				question: 'What is 20 percent of 50?',
				answer: '10. Percent of a number is percent ÷ 100 × whole, so 20 ÷ 100 × 50 = 0.20 × 50 = 10.',
			},
			{
				question: 'How do you calculate a percentage increase?',
				answer:
					'Subtract the old value from the new value, divide by the old value, then multiply by 100: (new − old) ÷ old × 100. Going from 50 to 60 is (60 − 50) ÷ 50 × 100 = +20%. If the result is negative, it is a percentage decrease rather than an increase.',
			},
			{
				question: 'How does a percent-off (discount) calculator work?',
				answer:
					'Multiply the original price by the discount percentage to get the amount saved (original × discount ÷ 100), then subtract that from the original price to get the sale price. A $100 item at 20% off saves $20, for a sale price of $80.',
			},
			{
				question: 'What is the difference between percent change and percent difference?',
				answer:
					'Percent change compares a value to itself over time or before/after — it always divides by the earlier ("old") value, so the order of the two numbers matters. Percent difference compares two independent values where neither is a reference point — it divides by their average instead, so swapping the two numbers gives the same answer. The same pair of numbers can produce two different results depending on which formula fits the question.',
			},
			{
				question: 'How do I find what percentage one number is of another?',
				answer:
					'Divide the part by the whole and multiply by 100: part ÷ whole × 100. 10 out of 40 is 10 ÷ 40 × 100 = 25%. This is what the "Find the percent" option in a Basic percentage calculator solves for.',
			},
			{
				question: 'Does a 10% decrease followed by a 10% increase get back to the original number?',
				answer:
					'No. A 10% decrease and the following 10% increase are calculated against different base numbers, so they do not cancel. $100 minus 10% is $90; $90 plus 10% of $90 (which is $9) is $99 — one dollar short of the original $100. The gap grows with larger percentages: a 50% drop needs a 100% rise, not 50%, to fully recover.',
			},
		],
		sources: [
			{
				label:
					'BIPM SI Brochure, 9th edition, §5.4.7 "Quantities with the unit one" — definition and use of the % symbol',
				url: 'https://www.bipm.org/documents/20126/41483022/SI-Brochure-9.pdf',
			},
			{
				label: 'Statistics How To — "Percent Error / Percent Difference: Definition, Examples"',
				url: 'https://www.statisticshowto.com/percent-error-difference/',
			},
		],
		embedHeight: 760,
	},
	{
		slug: 'volume-converter',
		category: 'Conversion',
		title: 'Volume Converter',
		shortTitle: 'Volume Converter',
		description:
			'Convert between teaspoons, tablespoons, fluid ounces, cups, pints, quarts, gallons, milliliters, and liters instantly, with reference tables for cooking measures, bottle and can sizes, and larger volumes.',
		updated: '2026-08-06',
		coreSummary:
			'1 US gallon equals exactly 3.785411784 liters (NIST Handbook 44, Appendix C), and every other US customary volume unit here — quart, pint, cup, fluid ounce, tablespoon, teaspoon — is an exact legal ratio of that one figure, not a separately measured value. Enter a volume in any of nine units and this tool converts it to the other eight at once.',
		queries: [
			'volume converter',
			'how many ounces in a cup',
			'how many tablespoons in a cup',
			'how many teaspoons in a tablespoon',
			'how many cups in a quart',
			'how many cups in a gallon',
			'how many ounces in a gallon',
			'ml to oz',
			'oz to ml',
			'cups to ml',
			'liters to gallons',
			'gallons to liters',
			'how many ml in a cup',
			'how many cups in a liter',
			'how many ounces in a liter',
			'how many pints in a gallon',
			'how many quarts in a gallon',
			'how many ounces in a wine bottle',
			'how many gallons in a barrel',
			'fluid oz to cups',
		],
		sections: [
			{
				heading: 'A 1707 wine gallon, still exact today',
				body: [
					"The US gallon this converter uses traces back to England's 1707 \"Queen Anne\" wine gallon, fixed at exactly 231 cubic inches — a figure the standard-makers reportedly reached by taking a cylinder 6 inches tall and 7 inches across and approximating π as 22/7, which multiplies out to a clean 231. The United States kept that number after independence: the Weights and Measures Act of 1836 legally adopted 231 cubic inches as the US liquid gallon, and NIST still enforces that exact definition for US trade today. Britain, meanwhile, replaced its own wine gallon with the larger Imperial gallon in 1824, which is why a US gallon (3.785 L) and a UK/Imperial gallon (4.546 L) are genuinely different units — about 20% apart — despite sharing a name and a common ancestor.",
					"That 231-cubic-inch figure only became an exact metric value once the inch itself was pinned down: the 1959 International Yard and Pound Agreement fixed 1 inch at exactly 2.54 cm. Multiply 231 in³ by (2.54 cm)³ and the result is 3785.411784 cm³, or 3.785411784 liters — the exact conversion this tool runs on, inherited from two separate legal definitions three centuries and an ocean apart, not from a modern re-measurement of an actual gallon container.",
				],
			},
			{
				heading: 'The exact chain this converter uses',
				body: [
					'Every other US customary volume unit here is defined as a whole-number fraction or multiple of the gallon, so once the gallon is exact, they all are: 1 gallon = 4 quarts, 1 quart = 2 pints, 1 pint = 2 cups, 1 cup = 8 fluid ounces, 1 fluid ounce = 2 tablespoons, 1 tablespoon = 3 teaspoons. Multiplying those ratios through gives 1 US fluid ounce = 29.5735295625 mL exactly — the number this tool, and every other US-to-metric kitchen conversion, ultimately rests on.',
					"Metric liters and milliliters need no such chain: a liter is 1,000 mL by definition, since both are SI units related by a power of ten. The only genuinely uncertain step in the whole system is rounding for display — this converter carries full floating-point precision internally and rounds to 6 significant figures only when showing you a result, so copying a number for a recipe or a lab measurement doesn't compound a rounding error the underlying math never made.",
				],
			},
			{
				heading: "Fluid ounces measure volume, not weight — and that's where recipes go wrong",
				body: [
					'This is the single most common mix-up this converter exists to prevent. A "fluid ounce" (fl oz) is a unit of volume — 1/128 of a gallon — while a plain "ounce" (oz) is a unit of weight, 1/16 of a pound. They only agree for a substance with the same density as water, where 1 fl oz of water happens to weigh almost exactly 1 oz. That coincidence breaks down for anything else: 1 cup (8 fl oz) of all-purpose flour weighs roughly 4.25 oz, not 8, because flour is far less dense than water and packs with air between the grains. A recipe that says "8 oz flour" almost always means weight (usually from a scale-based, often UK-influenced recipe), while "1 cup flour" means volume — and converting one to the other by treating "oz" and "fl oz" as interchangeable will throw off a baking recipe\'s flour-to-liquid ratio. This tool only converts volume-to-volume (fl oz, cup, mL, etc.) — it does not convert to or from weight ounces, because that conversion depends on the specific ingredient\'s density and has no single universal answer.',
				],
			},
			{
				heading: 'Worked example: scaling a recipe',
				body: [
					'A recipe calls for 2/3 cup of milk and needs to be scaled using tablespoon measures because the cook only has a tablespoon on hand. Since 1 cup = 16 tablespoons exactly, 2/3 cup = 2/3 × 16 = 10.667 tbsp, which most cooks round to 10 tbsp + 2 tsp (since the remaining 0.667 tbsp × 3 tsp/tbsp = 2 tsp). Converting the same 2/3 cup to milliliters: 2/3 × 236.5882365 mL = 157.73 mL, a figure a metric kitchen scale would show directly.',
				],
			},
			{
				heading: 'Worked example: bottle and can sizes',
				body: [
					'A standard wine bottle holds 750 mL, which converts to 750 ÷ 29.5735295625 = 25.36 fl oz — not the "26 oz" figure sometimes seen, which is simply rounded more loosely. A standard US soda or beer can holds 12 fl oz, or 12 × 29.5735295625 = 354.88 mL, which is why cans are commonly labeled "355 mL" (rounded up) outside the US. A single bar "shot" is commonly poured at 1.5 fl oz in the US (44.4 mL) — this is a bartending convention, not a federal standard, and both the exact pour size and its name vary by state law and establishment.',
				],
			},
			{
				heading: 'Worked example: a 42-gallon oil barrel',
				body: [
					"The US Energy Information Administration defines a barrel of crude oil as exactly 42 US gallons — a unit from the 19th-century oil industry, unrelated to the wine-gallon lineage above except in sharing the same gallon. Converting: 42 × 3.785411784 = 158.99 liters per barrel. This is a fixed volume measure used for pricing and accounting; it has no connection to the gallon you'd use at a gas pump for the resulting refined fuel.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Kitchen measurement chain',
				headers: ['Unit', 'Equals'],
				rows: [
					['1 tablespoon', '3 teaspoons'],
					['1 fluid ounce', '2 tablespoons (6 teaspoons)'],
					['1 cup', '8 fluid ounces (16 tablespoons)'],
					['1 pint', '2 cups (16 fluid ounces)'],
					['1 quart', '2 pints (4 cups)'],
					['1 gallon', '4 quarts (16 cups)'],
				],
				note: 'Each relationship is an exact legal definition, not a rounded approximation.',
			},
			{
				title: 'Cups to milliliters and fluid ounces',
				headers: ['Cups', 'mL', 'fl oz'],
				rows: [
					['1/4 cup', '59.15 mL', '2 fl oz'],
					['1/3 cup', '78.86 mL', '2.67 fl oz'],
					['1/2 cup', '118.29 mL', '4 fl oz'],
					['2/3 cup', '157.73 mL', '5.33 fl oz'],
					['3/4 cup', '177.44 mL', '6 fl oz'],
					['1 cup', '236.59 mL', '8 fl oz'],
					['2 cups', '473.18 mL', '16 fl oz'],
				],
				note: 'Exact conversion via 1 cup = 236.5882365 mL, rounded to two decimal places.',
			},
			{
				title: 'Common bottle and can sizes',
				headers: ['Container', 'Volume', 'Fluid ounces'],
				rows: [
					['Standard soda/beer can', '355 mL (12 fl oz nominal)', '12.00 fl oz'],
					['Standard wine bottle', '750 mL', '25.36 fl oz'],
					['Magnum wine bottle', '1.5 L', '50.72 fl oz'],
					['Standard bar shot (US convention)', '44.4 mL', '1.5 fl oz'],
					['2-liter soda bottle', '2 L', '67.63 fl oz'],
				],
				note: 'Container sizes are manufacturer/industry conventions, not unit definitions — the mL-to-fl-oz math itself is exact.',
			},
			{
				title: 'Liters and gallons: larger volumes',
				headers: ['Liters', 'US gallons'],
				rows: [
					['1 L', '0.264 gal'],
					['5 L', '1.321 gal'],
					['10 L', '2.642 gal'],
					['20 L', '5.283 gal'],
					['158.99 L', '42 gal (1 oil barrel)'],
					['1,000 L', '264.17 gal'],
				],
				note: 'Exact conversion via 1 gallon = 3.785411784 liters, rounded to two/three decimal places.',
			},
		],
		faq: [
			{
				question: 'How many teaspoons are in a tablespoon?',
				answer: 'There are exactly 3 teaspoons in 1 US tablespoon.',
			},
			{
				question: 'How many tablespoons are in a cup?',
				answer: 'There are exactly 16 tablespoons in 1 US cup (8 fluid ounces × 2 tablespoons per fluid ounce).',
			},
			{
				question: 'How many ounces are in a cup?',
				answer: 'There are exactly 8 fluid ounces in 1 US cup. This is a volume measurement — it does not apply to weight ounces, which vary by ingredient density.',
			},
			{
				question: 'How many cups are in a gallon?',
				answer: 'There are exactly 16 cups in 1 US gallon (4 quarts × 4 cups per quart).',
			},
			{
				question: 'How many milliliters are in a cup?',
				answer: '1 US cup equals exactly 236.5882365 milliliters, derived from the exact 3.785411784-liter US gallon.',
			},
			{
				question: 'How many fluid ounces are in a liter?',
				answer: '1 liter equals approximately 33.814 US fluid ounces. To convert, divide the milliliter value by 29.5735295625.',
			},
			{
				question: "What's the difference between a fluid ounce and a regular ounce?",
				answer: 'A fluid ounce (fl oz) measures volume — 1/128 of a US gallon. A regular ounce (oz) measures weight — 1/16 of a pound. They only roughly coincide for water; for other substances (like flour or sugar), 1 cup by volume and 8 oz by weight are different amounts.',
			},
			{
				question: 'How many gallons are in an oil barrel?',
				answer: 'Exactly 42 US gallons, per the US Energy Information Administration — a standard fixed by the 19th-century petroleum industry, unrelated to gas-pump gallons.',
			},
		],
		sources: [
			{
				label: 'NIST Handbook 44 (2026), Appendix C — General Tables of Units of Measurement',
				url: 'https://www.nist.gov/system/files/documents/2025/12/30/appc-26-HB44-20251222.pdf',
			},
			{
				label: 'U.S. Energy Information Administration — Glossary (Barrel)',
				url: 'https://www.eia.gov/tools/glossary/index.php?id=b',
			},
			{
				label: 'Sizes, Inc. — "English wine gallon" (1707 231 in³ standard; US 1836 adoption; UK 1824 Imperial gallon split)',
				url: 'https://www.sizes.com/units/gallon_english_wine.htm',
			},
		],
		embedHeight: 780,
	},
	{
		slug: 'date-calculator',
		category: 'Date & Time',
		title: 'Date Calculator',
		shortTitle: 'Date Calculator',
		description:
			'Find the number of days between two dates, add or subtract days from a date, or count down to New Year\'s Day, Halloween, Thanksgiving, and Christmas.',
		updated: '2026-08-06',
		coreSummary:
			'Every mode here runs on the proleptic Gregorian calendar — the same calendar rule ECMAScript\'s Date object uses (ECMA-262 §21.4) — with no time-of-day component, so a "day" always means one full calendar date regardless of time zone. "Difference" reports both the exact total day count between two dates and a calendar-style years/months/days breakdown; the two can disagree by up to a day for an anniversary of February 29 measured against a non-leap year, because the breakdown follows the same "has the month-and-day been reached yet" rule Microsoft documents for Excel\'s DATEDIF function.',
		queries: [
			'date calculator',
			'days between two dates',
			'days from today',
			'add days to a date',
			'how many days until christmas',
			'how many days until halloween',
			'how many days until thanksgiving',
			'30 days from today',
			'90 days from today',
		],
		sections: [
			{
				heading: 'Three date-math questions, one calculator',
				body: [
					'"Difference" answers *how far apart are these two dates* — pick a start and end date and it returns the exact day count plus a years/months/days breakdown. "Shift date" answers *what date is N days from this one* — the calculation behind every "30 days from today," "90 days from today," or "45 days before this date" search. "Days until" answers a narrower, very common question on its own: a live countdown to the next New Year\'s Day, Halloween, Thanksgiving, and Christmas, automatically rolling to next year the moment each one passes.',
					'All three share the same underlying date arithmetic, so switching modes never produces a different answer for the same pair of dates — "Difference" from today to next Christmas and "Days until → Christmas" always agree.',
				],
			},
			{
				heading: 'Total days and the years/months/days breakdown can tell different stories',
				body: [
					'The "Total days" figure is unambiguous: a straight count of calendar days between two dates, the same number you would get counting boxes on a calendar. The "Calendar span" (Ny Nm Nd) figure is a different, more human convention: it answers "how many full years, then full months, then full days" separate the two dates, the way people describe an age or an anniversary.',
					'These two can diverge by exactly one day in a specific, well-documented edge case: an anniversary of February 29 measured against February 28 in a non-leap year. From Feb 29, 2024 to Feb 28, 2025 is 365 total days, but the calendar breakdown reads 11 months and 30 days, not a clean 1 year — because the month-and-day pair (Feb, 28) has not yet reached (Feb, 29), the same "has the anniversary date been reached" rule Microsoft documents for Excel\'s DATEDIF function. A different, equally common convention (used by Python\'s dateutil library, among others) instead clamps to the nearest valid day and calls that same pair exactly 1 year — there is no single universal answer for this specific edge case, only different documented rules for handling a date that does not exist in the target year.',
				],
			},
			{
				heading: 'Why "N days from today" has to be calculated live',
				body: [
					'A search like "30 days from today" or "90 days from today" does not have one fixed answer; it depends entirely on what day it is when you ask. The "Shift date" mode defaults to today\'s date (read from your browser) plus 30 days specifically so the calculator is useful the instant it loads, and the "Days until" mode works the same way: it reads today\'s date locally and calculates each holiday\'s distance from there, with no server round-trip and no risk of showing yesterday\'s countdown.',
					'The reference table below shows what these additions look like from one fixed anchor date (January 1, 2026) instead of "today," so the worked examples stay accurate no matter when you read this page. Enter your own start date in the calculator above for a live answer.',
				],
			},
			{
				heading: 'Where the fourth Thursday of November comes from',
				body: [
					'Christmas (December 25), Halloween (October 31), and New Year\'s Day (January 1) are fixed calendar dates that need no calculation: they land on the same month and day every year. Thanksgiving in the United States is different: it is defined not by a fixed date but by a rule. A 1941 joint resolution of Congress, now codified at 5 U.S.C. § 6103, fixes Thanksgiving as "the fourth Thursday in November," which is why it moves around the calendar (November 22 through 28) from year to year while always landing on the same weekday. This calculator applies that rule directly rather than looking up a stored date, so it works correctly for any year.',
				],
			},
		],
		referenceTables: [
			{
				title: "Holiday dates, 2026–2030",
				headers: ["Year", "New Year's Day", 'Halloween', 'Thanksgiving (US)', 'Christmas'],
				rows: [
					['2026', 'Jan 1', 'Oct 31', 'Nov 26', 'Dec 25'],
					['2027', 'Jan 1', 'Oct 31', 'Nov 25', 'Dec 25'],
					['2028', 'Jan 1', 'Oct 31', 'Nov 23', 'Dec 25'],
					['2029', 'Jan 1', 'Oct 31', 'Nov 22', 'Dec 25'],
					['2030', 'Jan 1', 'Oct 31', 'Nov 28', 'Dec 25'],
				],
				note: 'Thanksgiving is calculated as the fourth Thursday of November (5 U.S.C. § 6103); the other three are fixed calendar dates.',
			},
			{
				title: 'Adding days to a fixed start date (January 1, 2026)',
				headers: ['Days added', 'Result date'],
				rows: [
					['7', 'Jan 8, 2026'],
					['14', 'Jan 15, 2026'],
					['30', 'Jan 31, 2026'],
					['45', 'Feb 15, 2026'],
					['60', 'Mar 2, 2026'],
					['90', 'Apr 1, 2026'],
					['120', 'May 1, 2026'],
					['180', 'Jun 30, 2026'],
					['365', 'Jan 1, 2027'],
				],
				note: 'A fixed anchor date, not "today" — use the calculator above for a live result from any start date, including today.',
			},
			{
				title: 'Example calendar-span breakdowns',
				headers: ['From', 'To', 'Total days', 'Years, months, days'],
				rows: [
					['Jan 1, 2000', 'Mar 1, 2000', '60', '0y 2m 0d'],
					['Jan 1, 1970', 'Jan 1, 2000', '10,957', '30y 0m 0d'],
					['Mar 15, 1990', 'Jan 1, 2026', '13,076', '35y 9m 17d'],
				],
				note: 'Total days is an exact count; years/months/days is the calendar-style breakdown described above — the two measure the same span differently, not disagree.',
			},
		],
		faq: [
			{
				question: 'How do I find the number of days between two dates?',
				answer:
					'Use "Difference" mode and enter the start and end dates. The calculator returns the exact total day count and a calendar-style years/months/days breakdown — both measure the same span, just in different units.',
			},
			{
				question: 'How do I add or subtract days from a date?',
				answer:
					'Use "Shift date" mode, enter a date and a number of days, and choose Add or Subtract. Adding 30 days to January 1, 2026 gives January 31, 2026; the mode defaults to today\'s date so it is ready to use immediately.',
			},
			{
				question: 'Why does "days until Christmas" show a different number tomorrow?',
				answer:
					'The countdown is calculated from today\'s date in your browser, so it changes by exactly 1 every day. The moment a holiday passes, the countdown automatically rolls forward to next year\'s date instead of going negative.',
			},
			{
				question: 'How is the date of Thanksgiving calculated?',
				answer:
					'US Thanksgiving is fixed by law (5 U.S.C. § 6103) as the fourth Thursday in November, not a fixed calendar date, which is why it falls anywhere from November 22 to November 28 depending on the year. This calculator computes it from that rule rather than a stored list of dates.',
			},
			{
				question: "What's the difference between 'total days' and 'years, months, days'?",
				answer:
					'Total days is a plain count of calendar days between two dates. Years/months/days is a calendar-aware breakdown — full years, then full months, then remaining days — the same convention used to describe someone\'s age. They can disagree by a day for an anniversary of February 29 measured in a non-leap year, a documented edge case with more than one accepted convention.',
			},
			{
				question: 'Does this account for time zones or daylight saving time?',
				answer:
					'No — every calculation here works with plain calendar dates and has no time-of-day component, so time zones and daylight saving shifts never affect the result. "Days until" reads today\'s calendar date from your device, not a specific moment in time.',
			},
		],
		sources: [
			{
				label: '5 U.S.C. § 6103 — Thanksgiving Day fixed as the fourth Thursday in November (Cornell Legal Information Institute)',
				url: 'https://www.law.cornell.edu/uscode/text/5/6103',
			},
			{
				label: 'ECMA-262, the ECMAScript Language Specification — §21.4 "Date Objects" (proleptic Gregorian calendar convention)',
				url: 'https://tc39.es/ecma262/#sec-date-objects',
			},
			{
				label: 'Microsoft Support — "DATEDIF function," Excel (the year/month/day breakdown convention this calculator follows)',
				url: 'https://support.microsoft.com/en-us/office/datedif-function-25dba1a4-2812-480b-84dd-8b32a451b35c',
			},
		],
		embedHeight: 820,
	},
	{
		slug: 'calorie-calculator',
		category: 'Health',
		title: 'Calorie Calculator',
		shortTitle: 'Calorie Calculator',
		description:
			'Find your BMR, maintenance calories (TDEE), and a daily calorie target to lose, maintain, or gain weight, using the Mifflin-St Jeor equation.',
		updated: '2026-08-09',
		coreSummary:
			'Daily calorie needs break down into three separate numbers: basal metabolic rate (BMR) from the Mifflin-St Jeor equation (Am J Clin Nutr 1990;51:241-247), maintenance calories (TDEE) after multiplying BMR by an activity factor, and a goal calorie target after applying the conventional "3,500 kcal per pound" adjustment for weight loss or gain. The activity multiplier is a rough estimate of weekly movement, self-reported rather than measured, and the 500-calorie-per-pound-per-week rule is a linear approximation that runs faster than real weight change tends to, since the body\'s energy needs shift as weight changes (NIH/NIDDK Body Weight Planner research). Targets under about 1,200 cal/day for women or 1,500 cal/day for men are flagged separately, following the 2013 AHA/ACC/TOS obesity guideline\'s threshold for diets that call for medical supervision.',
		queries: [
			'calorie calculator',
			'how many calories should I eat',
			'calories to lose weight',
			'BMR calculator',
			'TDEE calculator',
			'daily calorie needs',
			'how many calories to lose 1 pound a week',
			'maintenance calories',
		],
		sections: [
			{
				heading: 'Three numbers, one calculator',
				body: [
					'Type "calorie calculator" into a search bar and three different questions come back bundled into one: how many calories do you burn just existing (BMR), how many do you burn on an average day once activity is added (TDEE, also called maintenance calories), and how many should you eat to hit a specific goal. This tool answers all three in sequence: BMR feeds into TDEE, and TDEE feeds into the goal target, so changing your activity level or your goal updates the whole chain instead of one isolated number.',
					"The Lose, Maintain, and Gain buttons don't touch the math that produces BMR or TDEE. They only decide what happens after TDEE is calculated. Maintenance is the same number no matter which goal you pick; it describes your body at rest and in motion, and the three buttons just decide what you do with it.",
				],
			},
			{
				heading: 'Why Mifflin-St Jeor and not Harris-Benedict',
				body: [
					"Harris-Benedict, published in 1919 and revised in 1984, was the default resting-metabolism formula for most of the 20th century, and plenty of older calculators still run on it. Mifflin-St Jeor came out of a 1990 study of 498 people measured by indirect calorimetry, the lab method of measuring actual gas exchange, and it was built specifically because Harris-Benedict tends to overestimate resting energy needs in a more sedentary modern population. Since then, comparison studies have repeatedly found Mifflin-St Jeor lands within about 10% of measured resting energy expenditure more often than the alternatives, which is why dietitians and most current calculators default to it.",
					"The imperial inputs here (pounds, feet, inches) don't run through a separate imperial formula. They convert to kilograms and centimeters first, using the exact international conversion factors, then go through the same equation as the metric path. That keeps the two unit systems in agreement to the decimal instead of drifting apart the way some rounded-constant shortcuts do.",
				],
			},
			{
				heading: 'The activity multiplier is a starting point, not a wearable',
				body: [
					'BMR measures your body at complete rest. TDEE adds everything else: walking, working, exercising, fidgeting. No government body sets an official conversion from a description like "moderately active" to an exact number; the 1.2 to 1.9 range used here is a long-running convention in sports-nutrition references, nothing more official than that. Two people who both call themselves lightly active can burn very different amounts of real-world energy, so treat this number as a starting point to adjust after a few weeks of tracking.',
					"If your actual weight trend after two or three weeks doesn't match what the target predicted, check the activity level first. It's usually the input that's off; the BMR formula is standard math and rarely the problem.",
				],
			},
			{
				heading: "Why a 500-calorie deficit doesn't produce exactly a pound a week, every week",
				body: [
					'The "3,500 kcal equals one pound of fat" figure goes back to a 1958 calculation by Max Wishnofsky that treats calorie deficit and weight loss as a straight line: cut 500 calories a day, lose one pound a week, indefinitely. Kevin Hall\'s group at the NIH\'s National Institute of Diabetes and Digestive and Kidney Diseases, the team behind the NIH Body Weight Planner, has since shown that relationship isn\'t actually linear. As you lose weight, your body needs fewer calories to maintain the smaller version of itself, so the same 500-calorie deficit produces less and less loss the longer you stay on it.',
					"This calculator still uses the 3,500-kcal rule because it's simple, transparent, and close enough for a short-term estimate. Just don't treat week 1's math as a promise about week 12.",
				],
			},
		],
		referenceTables: [
			{
				title: 'BMR by profile (Mifflin-St Jeor)',
				headers: ['Sex', 'Age', 'Weight', 'Height', 'BMR'],
				rows: [
					['Female', '25', '65 kg (143 lb)', "165 cm (5'5\")", '1,395 cal/day'],
					['Male', '30', '80 kg (176 lb)', "180 cm (5'11\")", '1,780 cal/day'],
					['Female', '45', '70 kg (154 lb)', "160 cm (5'3\")", '1,314 cal/day'],
					['Male', '50', '90 kg (198 lb)', "175 cm (5'9\")", '1,749 cal/day'],
				],
				note: 'Weight and height are rounded to the nearest pound or inch for reference; the calculator above works directly in either unit system without rounding through the other.',
			},
			{
				title: 'Maintenance calories (TDEE) by activity level, for a fixed BMR of 1,600',
				headers: ['Activity level', 'Multiplier', 'TDEE'],
				rows: [
					['Sedentary', '×1.2', '1,920 cal/day'],
					['Lightly active', '×1.375', '2,200 cal/day'],
					['Moderately active', '×1.55', '2,480 cal/day'],
					['Very active', '×1.725', '2,760 cal/day'],
					['Extra active', '×1.9', '3,040 cal/day'],
				],
				note: 'Same BMR, five different maintenance numbers. Activity level alone can shift the estimate by more than 1,100 calories a day.',
			},
			{
				title: 'Goal calories from a fixed TDEE of 2,400',
				headers: ['Goal', 'Rate', 'Daily adjustment', 'Target'],
				rows: [
					['Lose', '0.5 lb/week', '-250 cal', '2,150 cal/day'],
					['Lose', '1 lb/week', '-500 cal', '1,900 cal/day'],
					['Lose', '1.5 lb/week', '-750 cal', '1,650 cal/day'],
					['Lose', '2 lb/week', '-1,000 cal', '1,400 cal/day'],
					['Maintain', 'n/a', '0 cal', '2,400 cal/day'],
					['Gain', '0.5 lb/week', '+250 cal', '2,650 cal/day'],
					['Gain', '1 lb/week', '+500 cal', '2,900 cal/day'],
				],
				note: "Adjustment equals rate times 3,500 kcal, divided by 7 days. CDC's general guidance favors the 1-2 lb/week range for weight loss over faster rates, on the grounds that gradual loss holds up better over time.",
			},
		],
		faq: [
			{
				question: 'How many calories should I eat to lose weight?',
				answer:
					'Start from your maintenance calories (TDEE) and subtract 250 to 1,000 per day depending on how fast you want to lose weight. 500 fewer calories a day works out to roughly 1 lb/week under the standard 3,500-kcal estimate. This calculator does that subtraction for you once you pick a target rate.',
			},
			{
				question: "What's the difference between BMR and TDEE?",
				answer:
					'BMR is the energy your body uses at complete rest: organs, temperature regulation, basic function. TDEE, or maintenance calories, is BMR multiplied by an activity factor to account for movement and exercise. TDEE is always higher than BMR, since the activity multipliers used here start at 1.2.',
			},
			{
				question: 'Is eating 1,200 calories a day safe?',
				answer:
					'The 2013 AHA/ACC/TOS obesity guideline frames 1,200-1,500 cal/day for women and 1,500-1,800 cal/day for men as reduced-calorie diets meant to run under medical supervision, not as a default starting point. This calculator flags any "Lose" target under 1,200 cal/day for women or 1,500 cal/day for men for that reason.',
			},
			{
				question: 'Why do different calculators give me different calorie numbers?',
				answer:
					'Most of the gap comes from two places: which BMR formula is used (Mifflin-St Jeor and the older Harris-Benedict typically differ by 5-10%) and which activity multiplier you pick, since "moderately active" isn\'t a precisely defined amount of movement. Two calculators using the same formula and the same activity level should land close together.',
			},
			{
				question: 'Does this account for muscle mass or body fat percentage?',
				answer:
					"No. Mifflin-St Jeor uses weight, height, age, and sex only. Formulas that also factor in body composition, like Katch-McArdle, which uses lean body mass, can be more precise for people who are unusually muscular or lean, but they need a body-fat measurement this calculator doesn't ask for.",
			},
			{
				question: 'Why does the deficit rule "run out" over time?',
				answer:
					"The 3,500-kcal-per-pound figure assumes a fixed relationship between deficit and fat loss, and that relationship doesn't hold as your weight actually changes. A lighter body needs fewer calories to maintain itself, so the same calorie deficit produces a shrinking amount of weekly loss instead of a constant pound a week. NIH researchers built the Body Weight Planner specifically to model that curve instead of the straight line.",
			},
		],
		sources: [
			{
				label:
					'Mifflin MD, St Jeor ST, et al., "A new predictive equation for resting energy expenditure in healthy individuals," American Journal of Clinical Nutrition 1990;51(2):241-247',
				url: 'https://doi.org/10.1093/ajcn/51.2.241',
			},
			{
				label:
					'2013 AHA/ACC/TOS Guideline for the Management of Overweight and Obesity in Adults (Circulation)',
				url: 'https://www.ahajournals.org/doi/10.1161/01.cir.0000437739.71477.ee',
			},
			{
				label: 'NIDDK: NIH Body Weight Planner (Diabetes Discoveries & Practice Blog, Kevin D. Hall)',
				url: 'https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/nih-body-weight-planner',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'world-clock',
		category: 'Date & Time',
		title: 'World Clock & Time Zone Converter',
		shortTitle: 'World Clock',
		description:
			'See the current time in dozens of cities worldwide, or convert a specific date and time from one time zone to another, including the day-of-week shift and daylight-saving status.',
		updated: '2026-08-09',
		coreSummary:
			'Every offset and daylight-saving transition here is read live from the IANA time zone database built into your browser (the same source every major OS uses) rather than a stored table of UTC offsets, so results stay correct through DST changes in either zone. World clock mode shows a live, second-by-second time for a chosen city; Convert a time takes a date and time in one city and returns the exact equivalent in another, including whether the calendar date shifts forward or back a day.',
		queries: [
			'world clock',
			'time zone converter',
			'what time is it in',
			'time in india',
			'time in tokyo',
			'time in london',
			'time in new york',
			'time in sydney',
			'time in dubai',
			'time in hawaii',
			'convert time between time zones',
			'meeting time zone converter',
		],
		sections: [
			{
				heading: 'Two questions, one tool',
				body: [
					'Two different questions live under "what time is it in Tokyo." The first is simple: right now, this second, what does a clock on the wall in Tokyo read. The second comes up more often in practice: if a meeting starts at 3pm in Chicago, what time does that land in Tokyo, and is it even the same day there. World clock mode answers the first question with a live, ticking display. Convert mode answers the second: pick a date and time in one city, pick a second city, and see the exact result, including whether the date shifts forward or back a day.',
				],
			},
			{
				heading: 'Where the numbers come from',
				body: [
					"Every offset and daylight-saving transition on this page comes from your browser's IANA time zone database (the Olson database), the same source Windows, macOS, iOS, Android, and every major browser read from. That's a different approach from storing a table of UTC offsets. A stored table goes stale the moment a country changes its daylight-saving rule, which happens most years somewhere in the world. Reading the offset live from the same database the operating system uses avoids that, with nothing to update by hand.",
				],
			},
			{
				heading: 'A country name is not a time zone',
				body: [
					'"Time in Brazil" or "time in Russia" reads like one query with one answer, but both countries span multiple official time zones (Brazil has four, Russia has eleven). This page\'s country-level entries use whichever zone the large majority of that country\'s population and searches for that country actually mean: Brasília time for Brazil, Moscow time for Russia. That matches the convention most world-clock sites use, since a page trying to force one answer to cover every zone in a large country would be answering a question nobody actually asked.',
				],
			},
			{
				heading: "Daylight saving doesn't run on the same calendar everywhere",
				body: [
					"Clocks in the Northern Hemisphere spring forward around March and fall back around November, because that's when their summer falls. South of the equator the seasons are reversed, so Sydney, Auckland, and Santiago spring forward around September or October and fall back around March or April. For part of the year that makes the gap between, say, London and Sydney smaller than it is the rest of the year, simply because the two cities are adjusting their clocks in opposite directions at opposite times. The reference table below shows this directly: Sydney sits at UTC+11 in January and UTC+10 in July, the reverse pattern of New York's UTC-5 in January and UTC-4 in July.",
				],
			},
			{
				heading: "Not every offset is a whole hour",
				body: [
					'India Standard Time is UTC+5:30, fixed year-round with no daylight saving. The half-hour offset dates to 1906, when colonial authorities rejected an earlier proposal for two separate one-hour zones (GMT+5 and GMT+6) and picked the offset exactly between them instead. Nepal goes further, at UTC+5:45, and the Chatham Islands, a small New Zealand territory, sit at a standard offset of UTC+12:45 that shifts to UTC+13:45 during daylight saving. Newfoundland, Canada uses a half-hour offset too: UTC-3:30 standard, UTC-2:30 during daylight saving, a full 90 minutes off the rest of Atlantic Canada. Lord Howe Island, a small Australian island, goes further still. It\'s one of the very few daylight-saving regions anywhere that shifts its clocks by only 30 minutes instead of a full hour, moving from UTC+10:30 standard to UTC+11 during daylight saving.',
				],
			},
			{
				heading: 'Daylight-saving rules can change',
				body: [
					'Iran ended its use of daylight saving time in September 2022 and has kept a single fixed offset of UTC+3:30 year round since, after decades of switching clocks twice a year like most of its neighbors. A government sets a zone\'s daylight-saving rule and can change it whenever it wants, which is why this page reads the rule live instead of storing it.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Standard vs. daylight-saving offset by zone, 2026',
				headers: ['City / zone', 'Standard offset', 'Daylight-saving offset'],
				rows: [
					['New York', 'UTC-5', 'UTC-4'],
					['London', 'UTC+0', 'UTC+1'],
					['Sydney', 'UTC+10', 'UTC+11'],
					['Auckland', 'UTC+12', 'UTC+13'],
					['Santiago', 'UTC-4', 'UTC-3'],
				],
				note: 'Sydney, Auckland, and Santiago are in the Southern Hemisphere, so their daylight-saving period falls in the Northern Hemisphere winter (roughly October to March), the reverse of New York and London.',
			},
			{
				title: 'Non-whole-hour time zones',
				headers: ['Zone', 'Standard offset', 'Daylight-saving offset'],
				rows: [
					['India (year-round)', 'UTC+5:30', 'no DST'],
					['Nepal (year-round)', 'UTC+5:45', 'no DST'],
					['Iran (year-round, since Sept. 2022)', 'UTC+3:30', 'no DST'],
					['Newfoundland, Canada', 'UTC-3:30', 'UTC-2:30'],
					['Chatham Islands, New Zealand', 'UTC+12:45', 'UTC+13:45'],
					['Lord Howe Island, Australia', 'UTC+10:30', 'UTC+11:00 (a 30-minute shift, not a full hour)'],
				],
			},
			{
				title: 'Worked conversion examples',
				headers: ['From', 'To', 'Result'],
				rows: [
					['New York, 9:00 AM, Mar 10, 2026', 'Tokyo', '10:00 PM, same day (13-hour gap)'],
					['Los Angeles, 10:00 PM, Jun 1, 2026', 'Sydney', '3:00 PM, Jun 2, 2026 (next day)'],
					['Auckland, 12:30 AM, Jan 1, 2026', 'Honolulu', '1:30 AM, Dec 31, 2025 (previous day)'],
				],
				note: 'The last two rows cross the International Date Line: the local time of day can look similar while the calendar date shifts by a full day in either direction.',
			},
		],
		faq: [
			{
				question: 'What time is it in a specific city right now?',
				answer:
					"Switch to World clock mode above and pick the city. The display updates every second from your device's clock combined with that city's current IANA time zone rule, including whether daylight saving is currently in effect there.",
			},
			{
				question: 'How do I convert a meeting time to another time zone?',
				answer:
					'Switch to Convert a time, enter the date and time in the "From" city, and pick the "To" city. The result shows the exact local time there, plus whether the date shifts forward or back a day and how many hours apart the two zones currently are.',
			},
			{
				question: 'Why does the time difference between two cities change throughout the year?',
				answer:
					"Whenever one or both cities observe daylight saving, the gap between them shifts by an hour twice a year as each city's clocks move independently. Northern and Southern Hemisphere zones observe daylight saving in opposite seasons, so the size of that shift, and sometimes its direction, depends on which two zones you're comparing.",
			},
			{
				question: "Why isn't \"time in Brazil\" or \"time in Russia\" a single simple answer?",
				answer:
					"Both countries span several official time zones. This page's country-level entries use the zone that the large majority of that country's population and searches for it actually mean, Brasília time for Brazil and Moscow time for Russia, rather than trying to force one answer to cover zones most searchers weren't asking about.",
			},
			{
				question: 'Are half-hour and 45-minute time zones a mistake?',
				answer:
					'No. India (UTC+5:30), Nepal (UTC+5:45), and the Chatham Islands (UTC+12:45/+13:45) all use non-whole-hour offsets on purpose, usually the result of a historical decision to split the difference between neighboring whole-hour zones rather than adopt one of them outright.',
			},
			{
				question: 'Does this tool account for the International Date Line?',
				answer:
					'Yes. Converting a time near midnight between zones on opposite sides of the date line can shift the calendar date by a full day in either direction. The "day difference" result reflects that automatically instead of only showing a clock face with no date.',
			},
		],
		sources: [
			{
				label: 'IANA Time Zone Database (tzdata) — the authoritative source for UTC offset and daylight-saving rules this page reads live via the browser\'s Intl API',
				url: 'https://www.iana.org/time-zones',
			},
			{
				label: 'ECMA-402, the ECMAScript Internationalization API Specification — defines Intl.DateTimeFormat\'s time-zone-aware formatting behavior',
				url: 'https://tc39.es/ecma402/',
			},
			{
				label: 'Wikipedia — "Daylight saving time in Iran" (Iran\'s abolition of DST, effective September 2022)',
				url: 'https://en.wikipedia.org/wiki/Daylight_saving_time_in_Iran',
			},
			{
				label: 'Wikipedia — "Time in India" (the 1906 adoption of UTC+5:30 as a compromise between two proposed one-hour zones)',
				url: 'https://en.wikipedia.org/wiki/Time_in_India',
			},
			{
				label: 'timeanddate.com — "Time Zone & Clock Changes in Lord Howe Island" (the island\'s 30-minute daylight-saving shift)',
				url: 'https://www.timeanddate.com/time/zone/australia/lord-howe-island',
			},
		],
		embedHeight: 860,
	},
];
