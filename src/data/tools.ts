import { GENDER_SYMBOLS } from '../lib/genderSymbols';
import { GREEK_LETTERS } from '../lib/greekAlphabet';
import { MATH_SYMBOLS } from '../lib/mathSymbols';

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
		published: '2026-08-02',
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
		published: '2026-08-02',
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
		published: '2026-08-02',
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
		published: '2026-08-02',
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
		published: '2026-08-02',
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
		published: '2026-08-02',
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
			'Flip 1-500 virtual coins (fair or weighted) and see the heads/tails split and longest streak, or use the probability calculator for exact binomial odds.',
		updated: '2026-08-03',
		published: '2026-08-03',
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
		published: '2026-08-04',
		coreSummary:
			'°F = °C × 9/5 + 32 and K = °C + 273.15 are exact conversions by definition in the SI system (NIST SP 811), not measured approximations. There is no rounding error in the formula itself, only in how many decimal places you choose to display. Enter a value on any of the three scales and this tool fills in the other two.',
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
					'Celsius, Fahrenheit, and Kelvin were built for three different jobs, which is why none of them lines up neatly with the others. Celsius (originally proposed in 1742) was defined so that water freezes at 0° and boils at 100° at standard atmospheric pressure, a scale built around a lab reference. Fahrenheit predates it by about three decades and uses a finer-grained scale where water freezes at 32° and boils at 212°, still the everyday standard in the US for weather and cooking.',
					'Kelvin is different in kind, not just in offset: it is the SI base unit for temperature, and 0 K is absolute zero, the point where a substance has the least thermal energy physically possible. Celsius and Fahrenheit both allow negative numbers because they are anchored to arbitrary reference points (water\'s freezing point); Kelvin never goes negative because it is anchored to a physical floor. Scientists default to Kelvin specifically to avoid negative temperatures breaking formulas like the ideal gas law, which require an absolute scale.',
				],
			},
			{
				heading: 'The conversion formulas',
				body: [
					'All three conversions are exact definitions, not measured constants: **°F = °C × 9/5 + 32**, **°C = (°F − 32) × 5/9**, and **K = °C + 273.15**. Because the offset between Celsius and Kelvin is fixed at exactly 273.15, a Kelvin reading is just a Celsius reading with the negative numbers pushed out of the way. A 1-degree change means the same amount of thermal energy on both scales, only the zero point moves.',
					'Fahrenheit and Celsius also change at different rates: a 1°C change equals a 1.8°F change (the 9/5 factor), so converting a *difference* between two temperatures uses a different multiplication than converting a single reading. A day that warms up "by 10°C" gets 18°F warmer, not 10°F warmer, a common mix-up between converting a point on the scale and converting a change along it.',
				],
			},
			{
				heading: 'Worked example: converting an oven temperature',
				body: [
					"A recipe from a European or Australian source calls for a 180°C oven. Converting: 180 × 9/5 + 32 = 324 + 32 = 356°F. Most US ovens dial in 25°F increments, so 356°F rounds to the nearest common setting, typically down to 350°F, which most bakers treat as close enough for the recipe to work, since a home oven's actual cavity temperature already swings several degrees around its setpoint during a bake.",
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
					['42.0°C', '107.6°F', 'Hyperpyrexia: seek care'],
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
					'Absolute zero is 0 Kelvin, which equals −273.15°C and −459.67°F. It is the coldest temperature theoretically possible, the point at which a system has minimum thermal energy, and is the reason the Kelvin scale never has negative numbers.',
			},
			{
				question: 'Why does Kelvin not use the degree symbol?',
				answer:
					'Kelvin is an absolute scale tied to a physical zero point rather than an arbitrary reference like water freezing, so the SI convention writes it as a plain unit ("300 K"), not a degree ("300°K"). Celsius and Fahrenheit keep the degree symbol because they are relative scales built around chosen reference points.',
			},
			{
				question: 'Does a 1-degree change mean the same thing on every scale?',
				answer:
					'No. This trips people up specifically when converting a *change* in temperature rather than a single reading. A 1°C change equals a 1.8°F change (or 1 K, since Kelvin and Celsius move at the same rate). Converting a temperature difference uses only the multiplier (×9/5 or ×5/9), not the +32/−32 offset, which only applies to single-point readings.',
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
			'Convert millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles, with reference tables for heights, tool sizes, and race distances.',
		updated: '2026-08-04',
		published: '2026-08-04',
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
			'Convert between micrograms, milligrams, grams, kilograms, ounces, pounds, and US tons instantly, with reference tables for body weight, cooking, and dosing.',
		updated: '2026-08-16',
		published: '2026-08-04',
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
					'Micrograms, milligrams, grams, and kilograms convert to each other by exact powers of ten (1 kg = 1,000 g = 1,000,000 mg = 1,000,000,000 mcg), since that is how the SI system is built. The imperial bridge is fixed by legal definition rather than by measurement: 1 lb = 453.59237 g exactly (NIST Handbook 44, Appendix C, marks this "exact"). Neither the ounce nor the US ton has its own independent definition. Both are derived arithmetically from that same fixed pound: 1 oz = 1 lb ÷ 16 = 28.349523125 g, and 1 US ton = 2,000 lb = 907,184.74 g.',
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
			'Estimate your monthly mortgage payment (principal, interest, taxes, insurance, PMI, HOA) and total interest, for any home price, down payment or rate.',
		updated: '2026-08-17',
		published: '2026-08-05',
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
			'Convert between seconds, minutes, hours, days, weeks, months, and years instantly, with reference tables and worked examples for ages, projects, and countdowns.',
		updated: '2026-08-19',
		published: '2026-08-05',
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
		published: '2026-08-05',
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
		published: '2026-08-06',
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
		published: '2026-08-06',
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
		published: '2026-08-06',
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
		published: '2026-08-09',
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
		published: '2026-08-09',
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
	{
		slug: 'tip-calculator',
		category: 'Finance',
		title: 'Tip Calculator',
		shortTitle: 'Tip Calculator',
		description:
			'Work out the tip and per-person total on a restaurant bill, with a toggle for tipping on the pre-tax subtotal vs. the tax-inclusive total and an even split across the table.',
		updated: '2026-08-10',
		published: '2026-08-10',
		coreSummary:
			'Tip = base amount × (tip percent / 100). The "base amount" is where most tip calculators quietly guess wrong: etiquette authorities like the Emily Post Institute recommend tipping on the pre-tax subtotal, not the tax-inclusive total printed at the bottom of the receipt, since sales tax is a government charge that has nothing to do with the service. This calculator backs the subtotal out of a tax-inclusive total, computes the tip both ways so you can see the actual dollar gap, and splits the resulting total evenly across the table.',
		queries: ['tip calculator', 'how much to tip', 'tip calculator split bill', 'do you tip before or after tax'],
		sections: [
			{
				heading: 'How the tip is actually calculated',
				body: [
					'The math itself is one line: **tip = base × (tip percent / 100)**, then **grand total = bill + tip**, then **per person = grand total / number of people**. The arithmetic is trivial. What actually causes confusion is which number counts as the "base."',
					'The total printed at the bottom of a US restaurant receipt almost always already includes sales tax. This calculator treats the number you enter as that tax-inclusive total, then uses the sales tax rate you supply to back out the pre-tax subtotal: **subtotal = total / (1 + tax rate / 100)**. Leave the tax rate at 0% and the subtotal and total collapse to the same number, which is the right answer if you already know you are looking at a pre-tax subtotal or your state charges no sales tax on restaurant meals.',
				],
			},
			{
				heading: 'Pre-tax or post-tax: which base is correct',
				body: [
					"The etiquette convention favors tipping on the pre-tax subtotal. The Emily Post Institute's tipping guide treats sales tax as a government charge that has nothing to do with the quality of service, so it should not inflate the tip base. Servers themselves often prefer the opposite, tipping on the tax-inclusive total, since it pays out slightly more, though the published guidance still sides with the pre-tax convention over the server's preference.",
					"In practice the dollar difference is small at typical US sales tax rates. Combined state and local rates run from 0% (five states charge no statewide sales tax at all) up to just over 10% in the highest-tax states, with a population-weighted national average around 7.5% (Tax Foundation). On a $106 tax-inclusive total with a 6% tax rate and a 20% tip, pre-tax tipping comes to $20.00 and post-tax tipping comes to $21.20, a $1.20 gap. It grows with the tax rate and the bill size, which is why this calculator shows both numbers instead of picking one silently.",
				],
			},
			{
				heading: 'Worked example: $106 bill, 6% tax, 20% tip, split two ways',
				body: [
					'Start from a $106.00 total already including 6% sales tax. Backing out the tax: subtotal = 106 / 1.06 = $100.00, so $6.00 of the $106.00 was tax. A 20% tip on that $100.00 subtotal is $20.00 (versus $21.20 on the full $106.00 total). Using the pre-tax tip, the grand total is $106.00 + $20.00 = $126.00, and split evenly two ways that is $63.00 each.',
					'If the table decides to round each share up to the next $5 instead of paying the exact $63.00, that adds $2.00 more per person ($4.00 total) beyond the calculated tip, which the calculator reports separately so it is clear how much of the extra came from rounding rather than from the tip percentage itself.',
				],
			},
			{
				heading: 'How much to tip, by service',
				body: [
					"There is no legal minimum tip percentage in the US the way there is a minimum wage. The figures below are the Emily Post Institute's published conventions, the closest thing to a US etiquette standard, not a rule anyone can enforce.",
				],
			},
			{
				heading: 'Tipping customs outside the US',
				body: [
					'Tipping norms are not universal, and applying US percentages abroad can misfire in either direction, undertipping where a service charge is legally already included, or overtipping in a country where it reads as awkward rather than generous.',
				],
			},
		],
		referenceTables: [
			{
				title: 'US tipping conventions by service (Emily Post Institute)',
				headers: ['Service', 'Typical tip'],
				rows: [
					['Sit-down restaurant, wait service', '15-20% of the bill'],
					['Food delivery', '10-15% of the bill'],
					['Takeout / counter service', 'Discretionary, often ~10% or a few dollars'],
					['Bar / bartender', '$1-2 per drink, or 15-20% of the tab'],
					['Rideshare / taxi', '15-20% of the fare, plus $1 per bag handled'],
					['Hair salon, spa, massage, personal training', '15-20% of the service price'],
					['Hotel housekeeping', '$2-5 per day, left daily rather than only at checkout'],
				],
			},
			{
				title: 'Tipping customs by country',
				headers: ['Country', 'Convention'],
				rows: [
					['United States', 'Expected: 15-20% at sit-down restaurants; base pay for many servers assumes tips'],
					['United Kingdom', 'A ~10-12.5% service charge is often already on the bill; by law, all tips and service charges must be passed to staff in full'],
					['France', 'Service is included in the menu price by law (service compris, in effect since 1987); tipping further is optional, not expected'],
					['Japan', 'Not customary and can come across as odd rather than generous; excellent service is standard, not tip-incentivized'],
					['China (mainland)', 'Generally not customary at restaurants; tour guides for foreign visitors are a common exception'],
					['Australia', 'Not expected; a national minimum wage covers hospitality staff, so a tip reads as a bonus, not a wage top-up'],
				],
				note: 'Conventions, not laws (except where noted for the UK and France). Always check for an already-included service charge before adding a tip on top of it.',
			},
		],
		faq: [
			{
				question: 'Do you tip before or after tax?',
				answer:
					'Etiquette authorities including the Emily Post Institute recommend tipping on the pre-tax subtotal, since sales tax is a government charge unrelated to the service. The dollar difference is usually small at typical US sales tax rates, but it grows with the bill size and the tax rate, so this calculator shows both numbers.',
			},
			{
				question: 'How much should I tip at a restaurant?',
				answer:
					'15-20% of the bill for standard sit-down service is the conventional US range (Emily Post Institute). Delivery runs 10-15%, and takeout tipping is discretionary, often around 10% or a few dollars.',
			},
			{
				question: 'Is tipping required by law in the US?',
				answer:
					"No. There is no federal or state law requiring a customer to tip a set percentage. What US law does regulate is who the tip belongs to once given: employers generally cannot keep tips that customers intend for staff. The tip percentage itself is a social convention, not a legal requirement.",
			},
			{
				question: "Do I have to tip if the bill already includes a service charge?",
				answer:
					"Check the receipt before adding more. In the UK, a service charge (commonly around 10-12.5%) is frequently already added, and by law it must be passed on to staff in full, so an extra tip on top is optional. France legally bakes service into the listed menu price, so no further tip is expected. Adding a full second tip on top of an included service charge over-tips the staff without meaning to.",
			},
			{
				question: 'Is it rude to tip in Japan?',
				answer:
					"It is not considered rude exactly, but it is unusual and can create an awkward moment; staff may try to return the money. Japan's tourism authority describes tipping as simply not customary there, since excellent service is treated as standard rather than something extra payment buys.",
			},
			{
				question: 'How do I split a tip evenly among a group?',
				answer:
					'Enter the total party size and this calculator divides the grand total (bill plus tip) evenly across everyone. If the group prefers clean per-person amounts instead of exact cents, the round-up option bumps each share to the next $1 or $5 and reports how much extra that adds on top of the calculated tip.',
			},
		],
		sources: [
			{
				label: 'The Emily Post Institute — "Tipping Etiquette 101: A Comprehensive Guide on Tipping" (US tip percentages by service)',
				url: 'https://emilypost.com/advice/general-tipping-guide',
			},
			{
				label: "UK Government legislation — Employment (Allocation of Tips) Act 2023 (legal requirement to pass tips to workers in full)",
				url: 'https://www.legislation.gov.uk/ukpga/2023/13',
			},
			{
				label: 'French Ministry for the Economy (DGCCRF) — "Pourboire" (service compris legally included in menu prices since 1987)',
				url: 'https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/pourboire',
			},
			{
				label: 'Japan Travel (official Japan National Tourism Organization site) — "Tipping in Japan"',
				url: 'https://www.japan.travel/en/plan/tipping-in-japan/',
			},
			{
				label: 'Fair Work Ombudsman (Australian Government) — national minimum wage rates',
				url: 'https://www.fairwork.gov.au/pay-and-wages/minimum-wages',
			},
			{
				label: 'Lonely Planet — "Tipping customs in Asia" (mainland China conventions)',
				url: 'https://www.lonelyplanet.com/articles/tipping-customs-asia',
			},
			{
				label: 'Cathay Pacific — "A complete guide to tipping in the Chinese Mainland" (tour guides as the common exception)',
				url: 'https://www.cathaypacific.com/cx/en_ID/inspiration/travel/tipping-in-china.html',
			},
			{
				label: 'U.S. Department of Labor, Wage and Hour Division — Fact Sheet #15A: Ownership of Tips Under the FLSA',
				url: 'https://www.dol.gov/agencies/whd/fact-sheets/15a-flsa-tip-ownership',
			},
			{
				label: 'Tax Foundation — 2026 State Sales Tax Rates (range and population-weighted average)',
				url: 'https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/',
			},
		],
		embedHeight: 760,
	},
	{
		slug: 'gpa-calculator',
		category: 'Education',
		title: 'GPA Calculator',
		shortTitle: 'GPA Calculator',
		description:
			'Calculate your unweighted or weighted GPA from letter grades and credit hours, using the standard 4.0-scale grade-point chart and the common Honors/AP weighting convention.',
		updated: '2026-08-10',
		published: '2026-08-10',
		coreSummary:
			"This calculator converts each course's letter grade to grade points on the standard 4.0 scale, multiplies by credit hours, and averages the total across all credits. Switching to weighted mode adds a level boost (Honors +0.5, AP/IB +1.0) to each course before averaging, which is why a weighted GPA can climb past 4.0.",
		queries: [
			'gpa calculator',
			'how to calculate gpa',
			'weighted gpa calculator',
			'unweighted gpa calculator',
			'high school gpa calculator',
			'college gpa calculator',
		],
		sections: [
			{
				heading: 'How this calculator works',
				body: [
					"Add one row per course: pick the letter grade you earned, enter the credit hours it's worth, and the calculator converts that grade to points on the standard 4.0 scale shown in the table below. Each course's points get multiplied by its credit hours, those totals are added up, and the sum is divided by your total credit hours. That's the same credit-weighted average method most registrars use, so a 4-credit class counts more than a 1-credit one.",
					"Use \"Add course\" to build out a full semester or year, and the trash-can button to drop a row you added by mistake. Every field updates the result immediately; there's no submit button because nothing here leaves your browser.",
				],
			},
			{
				heading: 'Weighted vs. unweighted GPA',
				body: [
					"Unweighted GPA treats every course the same regardless of difficulty: an A is worth 4.0 whether it came from a standard class or an AP class. Weighted GPA adds a level boost before averaging: the common convention is +0.5 for Honors and +1.0 for AP or IB courses, so a student who took harder classes can end up with a higher number than a straight 4.0, even without earning a single grade above an A. That's a real, intended feature of weighting, not a rounding artifact: an A in an AP class is scored as a 5.0 in weighted mode.",
					"There's no single official weighting standard. Some schools use a different boost, some cap weighted GPA at 5.0, and some don't weight at all. Colleges are aware of this and often recompute applicants' GPA on their own consistent scale during admissions review rather than comparing weighted numbers across different high schools directly, so treat whichever number your school reports as the one that actually appears on your transcript.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Standard 4.0 grade-point scale (College Board BigFuture)',
				headers: ['Letter grade', 'Grade points'],
				rows: [
					['A+ / A', '4.0'],
					['A-', '3.7'],
					['B+', '3.3'],
					['B', '3.0'],
					['B-', '2.7'],
					['C+', '2.3'],
					['C', '2.0'],
					['C-', '1.7'],
					['D+', '1.3'],
					['D', '1.0'],
					['D-', '0.7'],
					['F', '0.0'],
				],
				note: "One commonly used conversion chart, not a universal law: some schools round or step letter grades differently. Check your registrar's scale if you need an exact official figure.",
			},
			{
				title: 'Weighted level boost (common school convention)',
				headers: ['Course level', 'Boost added', 'An A grade becomes'],
				rows: [
					['Regular', '+0.0', '4.0'],
					['Honors', '+0.5', '4.5'],
					['AP / IB', '+1.0', '5.0'],
				],
				note: 'The boost is added to the base grade points before averaging across credit hours, not applied as a flat bonus to the final GPA.',
			},
		],
		faq: [
			{
				question: 'What is the formula for GPA?',
				answer:
					"GPA = total quality points ÷ total credit hours, where each course's quality points equal its grade points (from the 4.0 scale) multiplied by its credit hours. A 3-credit A (4.0 points) contributes 12 quality points; a 1-credit A contributes 4. Add up quality points and credit hours across every course, then divide, to get the credit-weighted average.",
			},
			{
				question: "What's the difference between weighted and unweighted GPA?",
				answer:
					"Unweighted GPA scores every course on the same 4.0 scale regardless of difficulty. Weighted GPA adds a level boost (commonly +0.5 for Honors and +1.0 for AP or IB) to each course's grade points before averaging, so tougher courses can push the result above 4.0. Both describe the same grades; they just answer different questions (raw grade average vs. grade average adjusted for course difficulty).",
			},
			{
				question: 'Can a weighted GPA go above 4.0?',
				answer:
					"Yes, and that's expected. An A in an AP or IB class scores 5.0 in weighted mode (4.0 base + 1.0 boost), so a student with mostly A's in advanced courses can land well above 4.0. An unweighted GPA cannot exceed 4.0 (or 4.3 at schools that give A+ a bonus decimal), since it has no mechanism to add extra points for course difficulty.",
			},
			{
				question: 'Do colleges look at weighted or unweighted GPA?',
				answer:
					"Both, generally. Many colleges recalculate applicants' GPA on their own consistent scale during admissions review, since high schools use different weighting policies, so a weighted GPA from one school isn't directly comparable to another's. Reporting both numbers, and letting your transcript and school profile explain the weighting policy behind them, is standard practice.",
			},
			{
				question: 'Does a Pass/Fail or Incomplete grade count toward GPA?',
				answer:
					"Typically not: most schools exclude Pass/Fail, Credit/No Credit, Incomplete, and Withdrawal grades from the GPA calculation entirely, since there's no letter grade to convert to points. Leave those courses out of this calculator rather than assigning them a grade, the same way your registrar's office would.",
			},
		],
		sources: [
			{
				label: 'College Board BigFuture — "How to Calculate Your GPA on a 4.0 Scale"',
				url: 'https://bigfuture.collegeboard.org/plan-for-college/get-started/how-to-calculate-gpa-4.0-scale',
			},
			{
				label: 'College Board BigFuture — "Does GPA Need to Be Weighted or Unweighted?"',
				url: 'https://bigfuture.collegeboard.org/help-center/does-gpa-need-be-weighted-or-unweighted',
			},
		],
		embedHeight: 980,
	},
	{
		slug: 'reaction-time-test',
		category: 'Games',
		title: 'Reaction Time Test',
		shortTitle: 'Reaction Time Test',
		description:
			'Test your simple reaction time over several trials, then compare your average, best, median, and consistency against reaction-time figures from published research.',
		updated: '2026-08-10',
		published: '2026-08-10',
		coreSummary:
			"Simple reaction time measures how fast you can respond to a single expected signal, no choice involved, just detect and click. Published averages vary by measurement method: a Clemson University literature review cites roughly 190 ms as the accepted non-computer figure for over a century, and cites a further study putting computer-measured results around 268 ms. Woods et al. (2015) separately measured a 231 ms raw average (213 ms after correcting for hardware delay) across 1,469 people on a calibrated computer test. This tool runs a short series of trials, times each one with the browser's performance clock from stimulus onset to click, and compares your average against those documented figures.",
		queries: [
			'reaction time test',
			'reaction time',
			'simple reaction time test',
			'how fast are your reflexes',
			'reflex test',
		],
		sections: [
			{
				heading: 'What "simple reaction time" actually measures',
				body: [
					'Reaction time research splits into a few distinct tasks, and this tool measures the simplest one. Simple reaction time is the gap between a single, expected stimulus and a single response: one signal, one action, no decision to make. That is different from choice reaction time (respond differently depending on which of several signals appears) and further still from the kind of split-second decisions a driver or athlete makes mid-play, which layer judgment on top of raw detection speed.',
					'That narrower definition is exactly why simple reaction time is useful as a baseline: there is nothing to think about, so the number mostly reflects how fast a signal travels from your eye through your nervous system to your finger. It is also, as the next section explains, a number that depends heavily on exactly how it gets measured.',
				],
			},
			{
				heading: 'How the test times each trial',
				body: [
					"Each trial waits a random 1.2 to 3.5 seconds before the box turns green, so there is nothing to count down and anticipate. Click before the box turns green and it counts as a false start: the trial resets and does not count toward your average, but it is tallied separately so you can see how many times you jumped the gun. Click after the box turns green and the elapsed time is measured with the browser's performance clock (performance.now()), which reports sub-millisecond timestamps, from the moment the color changes to the moment your click registers.",
					'Running several trials instead of one matters because a single click is noisy: attention lapses, a finger already mid-motion, or a moment of hesitation can all swing one result by 50 ms or more. Averaging trials, and separately reporting the best, the median, and the spread (standard deviation) between them, gives a steadier picture than any single click.',
				],
			},
			{
				heading: 'Why the "right" number depends on how you measure it',
				body: [
					"A literature review by Robert Kosinski at Clemson University notes that for roughly 120 years, the textbook figure for simple visual reaction time in college-age adults was about 190 ms, a number tracing back to Francis Galton's studies in the 1800s. The same review cites Eckner et al. (2010), who timed the same NCAA football players two ways: 203 ms on a falling-meter-stick test and 268 ms on a computer test, and notes that computer-measured results at Clemson typically land close to that higher figure. The gap is not really about people getting slower. It is about the test.",
					"Woods et al. (2015) tested a community sample of 1,469 people ages 18 to 65 with a calibrated computer-based test and measured a 231 ms average, or 213 ms once they subtracted the delay their own hardware and software introduced. Their paper's conclusion is direct: processing speed in a modern sample is not slower than a century ago, once you account for the fact that computer equipment, theirs included, adds its own lag on top of a person's true reaction time. This tool runs in a browser, on whatever device you happen to be using, so it inherits that same kind of measurement lag, and then some.",
				],
			},
			{
				heading: 'Why your own trials vary, and what to do about it',
				body: [
					'Fatigue, a distracting notification, or simply not being warmed up can each add tens of milliseconds to a single trial, which is exactly why the tool reports median and best alongside the average: the median is less pulled around by one slow outlier, and the best trial shows what you are capable of when everything lines up. A large gap between your best and worst trial (a high standard deviation) says more about how consistent your attention was during the test than a single average ever could.',
					"Reaction time is also known to change with age. Woods et al. (2015) measured it lengthening by about 0.55 ms per year of age across their 1,469-person sample, and traced most of that increase to slower motor output rather than slower mental processing. This tool has no way to know your age and does not attempt to adjust for it.",
				],
			},
		],
		referenceTables: [
			{
				title: 'How this tool classifies your average',
				headers: ['Average', 'Band', 'What it means'],
				rows: [
					['Under 190 ms', 'Faster than the historic baseline', "Below the ~190ms figure Kosinski's review cites as the pre-computer-testing baseline; could also mean a click landed right as the screen changed"],
					['190-213 ms', 'Faster than the modern computer-measured average', "At or below Woods et al. (2015)'s hardware-corrected 213ms mean"],
					['214-268 ms', 'Within the range of modern computer-based studies', "Between Woods et al.'s ~213-231ms average and the 268ms figure Kosinski's review cites from computer-based testing"],
					['Over 268 ms', 'Slower than the studies cited here', 'Above the 268ms figure, often from fatigue, distraction, or hardware lag'],
				],
				note: 'These are the actual figures reported in the sources below, not a single agreed-on "normal range." Different measurement methods produce meaningfully different numbers, and a browser test adds its own timing jitter on top of any of them.',
			},
		],
		faq: [
			{
				question: 'What is a good reaction time?',
				answer:
					"It depends on how the test measures it. A Clemson University literature review cites roughly 190ms as the century-old, non-computer baseline for college-age adults, and cites a further study putting computer-measured results around 268ms. Woods et al. (2015) separately measured a 231ms average (213ms after correcting for hardware delay) across 1,469 people on a calibrated computer test. A browser-based score anywhere in that range is ordinary; the reaction-time literature does not agree on one single number.",
			},
			{
				question: 'What is the difference between simple and choice reaction time?',
				answer:
					'Simple reaction time is one expected signal and one response, which is what this tool measures. Choice reaction time adds a decision (click one button for a red light, a different button for a blue one) and is consistently slower, because the brain has to identify which stimulus appeared before it can select the matching response.',
			},
			{
				question: 'Why does my reaction time change every time I take the test?',
				answer:
					"Trial-to-trial variation is normal, not a sign the test is broken. Attention drifts, small motor delays, and momentary distraction all add noise to any single click. That's why this tool reports an average, median, best, and standard deviation across several trials rather than a single number.",
			},
			{
				question: 'Does age affect reaction time?',
				answer:
					'Yes. Woods et al. (2015) measured simple reaction time lengthening by about 0.55ms per year of age across a 1,469-person sample spanning ages 18 to 65, and found the increase was mainly due to slower motor output rather than slower mental processing. This tool does not ask for or adjust by age.',
			},
			{
				question: 'Why might a browser-based test run slower than a lab study?',
				answer:
					"Woods et al. (2015) found that measured reaction times differ across laboratories partly because of timing delays introduced by the specific computer hardware and software used to measure them, not because the people being tested are actually slower. A browser test adds its own hardware and software on top of whatever device you happen to be using, so a slower-than-expected result may say more about your setup than about your actual reaction speed.",
			},
			{
				question: 'Can this test diagnose ADHD, concussion, or a neurological condition?',
				answer:
					'No. This is a descriptive comparison against figures from published research, run on uncontrolled consumer hardware, not a validated clinical instrument. Reaction time is one symptom clinicians consider, but only inside a controlled, calibrated testing environment. A single browser-based score cannot diagnose anything.',
			},
		],
		sources: [
			{
				label: 'Kosinski, R.J. "A Literature Review on Reaction Time," Clemson University (last updated September 2013)',
				url: 'https://facultypsy.hope.edu/psychlabs/exp/reactiontime/docs/RT_Literature_Review.pdf',
			},
			{
				label: 'Woods, D.L. et al. (2015). "Factors influencing the latency of simple reaction time," Frontiers in Human Neuroscience 9:131',
				url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4374455/',
			},
		],
		embedHeight: 620,
	},
	{
		slug: 'cursive-alphabet',
		category: 'Reference',
		title: 'Cursive Alphabet',
		shortTitle: 'Cursive Alphabet',
		description:
			'See every uppercase and lowercase letter in a cursive display font, preview any word or name in cursive, and learn the basic strokes cursive letters are built from.',
		updated: '2026-08-10',
		published: '2026-08-10',
		coreSummary:
			'This tool renders all 26 uppercase and 26 lowercase letters in a cursive display font, and previews any word or name you type the same way. Cursive letters within a word are typically joined in one continuous stroke built from a small set of basic connecting strokes (under-curves, over-curves, and ascending or descending loops); capital letters usually start a word without connecting to whatever came before them.',
		queries: [
			'cursive alphabet',
			'cursive alphabet chart',
			'cursive letters',
			'cursive abc',
			'how to write in cursive',
		],
		sections: [
			{
				heading: 'How to use this tool',
				body: [
					"Type a word, name, or short phrase into the box and it previews instantly below in a cursive display font (letters, spaces, apostrophes, and hyphens only, up to 24 characters). The full alphabet chart underneath shows every uppercase and lowercase letter the same way, each one labeled with its ordinary print letter so it's easy to match up.",
					"This is a display font standing in for handwritten cursive, not a stroke-by-stroke tracing guide: it won't show you the pen-lift order or exact loop shapes a teacher would demonstrate. The practical use is as a model. See what a word looks like in a cursive style, then copy it out by hand on paper, the same way you'd copy a model word from a worksheet.",
				],
			},
			{
				heading: 'How cursive letters connect',
				body: [
					"Cursive letters within a word are normally joined in one continuous, flowing stroke rather than lifted and placed separately the way printed (manuscript) letters are. Those connections are built from a handful of basic strokes reused across many letters: an under-curve, which starts low and curves upward, like the beginning of a lowercase i, and an over-curve, which starts high and curves downward, like the top of a lowercase u. Letters with tall stems (b, d, h, k, l, t) rise above the midline in an ascending stroke, and letters with tails (g, j, p, q, y) drop below the baseline in a descending stroke.",
					"Capital letters are the exception to the joining rule: they typically don't connect to whatever letter came before them, since a capital usually starts a fresh word, but they're shaped so the pen can flow smoothly into the lowercase letter that follows.",
				],
			},
			{
				heading: 'There is no single official cursive alphabet',
				body: [
					"Cursive charts vary a little from book to book because there's no single federally mandated cursive alphabet in the US. Schools and publishers choose from several long-running teaching styles, each shaping letters a bit differently (see the comparison table below). If you're matching a specific worksheet or a teacher's handwriting, use that source as the reference rather than assuming every cursive chart online agrees letter-for-letter.",
				],
			},
			{
				heading: 'Is cursive still taught in schools?',
				body: [
					"It depends on the state and the school. The Common Core State Standards, adopted by most US states starting in 2010, don't specifically require cursive instruction, and many schools scaled it back or dropped it after adopting Common Core. Since the mid-2010s, though, a growing number of states have passed their own laws adding a cursive-writing requirement back into their standards, and that list keeps changing year to year, so it's worth checking your own state's or district's current requirement rather than assuming either way.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Common cursive teaching styles',
				headers: ['Style', 'Background', 'What makes it different'],
				rows: [
					[
						'Palmer Method',
						'Developed around 1888',
						'Simplified the more ornate Spencerian style of the 1800s for faster, everyday handwriting',
					],
					[
						'Zaner-Bloser',
						'One of the longest-running commercial handwriting programs in the US',
						'Teaches print letters first, then introduces cursive forms built from matching strokes',
					],
					[
						"D'Nealian",
						'Developed by educator Donald Thurber in the 1960s',
						'Manuscript letters are shaped to already resemble cursive, so the jump to joined writing is smaller',
					],
					[
						'Getty-Dubay (Italic)',
						'An italic-based teaching model',
						'Uses simpler, less looped letterforms than traditional cursive',
					],
					[
						'New American Cursive',
						'Created by handwriting specialist Iris Hatfield',
						'Marketed as simplified, with fewer pen strokes than the most widely used traditional cursive programs',
					],
				],
				note: "Schools and publishers pick their own curriculum, so exact letterforms vary by source; this table is background on the major styles in circulation, not a ranking. Each style is individually cited in Sources & Standards.",
			},
		],
		faq: [
			{
				question: 'Is this real handwritten cursive?',
				answer:
					"No. The preview and chart use a cursive-style display font rendered in your browser, not a record of actual pen strokes. It's meant as a model to look at (what does this word look like in a cursive style?) before writing it out by hand on paper, similar to how a worksheet shows a printed model word to copy.",
			},
			{
				question: "Why don't the capital letters connect to the rest of the word?",
				answer:
					"In most cursive teaching styles, capital letters don't connect to whatever letter came before them, since a capital typically starts a new word rather than continuing one. They're still shaped to flow smoothly into the lowercase letter that follows, so the pen doesn't have to lift again right away.",
			},
			{
				question: 'Is cursive still taught in schools?',
				answer:
					"It varies by state. Common Core, adopted by most states starting in 2010, doesn't require cursive instruction, and many schools cut back on it afterward. Since the mid-2010s, a number of states have passed their own laws reinstating a cursive requirement, and the list of which states require it keeps changing, so check your own state's or district's current standards rather than assuming.",
			},
			{
				question: "What's the difference between cursive and print handwriting?",
				answer:
					'Print (manuscript) letters are written as separate, disconnected strokes, lifting the pen between letters. Cursive letters within a word are normally joined into one continuous, flowing stroke. Many US handwriting programs teach print first and introduce cursive later, once basic letterforms are established.',
			},
			{
				question: 'Which cursive style should I learn?',
				answer:
					"There's no single official standard: Palmer, Zaner-Bloser, D'Nealian, Getty-Dubay, and newer styles like New American Cursive all shape letters a little differently. If you're a student, match whatever your teacher or textbook uses; if you're learning on your own, any style is fine as long as you're consistent with it.",
			},
		],
		sources: [
			{
				label: 'Wikipedia — "Cursive"',
				url: 'https://en.wikipedia.org/wiki/Cursive',
			},
			{
				label: 'Wikipedia — "Cursive handwriting instruction in the United States"',
				url: 'https://en.wikipedia.org/wiki/Cursive_handwriting_instruction_in_the_United_States',
			},
			{
				label: 'Wikipedia — "Zaner-Bloser (teaching script)"',
				url: 'https://en.wikipedia.org/wiki/Zaner-Bloser_(teaching_script)',
			},
			{
				label: 'Wikipedia — "Palmer Method"',
				url: 'https://en.wikipedia.org/wiki/Palmer_Method',
			},
			{
				label: "Wikipedia — \"D'Nealian\"",
				url: "https://en.wikipedia.org/wiki/D'Nealian",
			},
			{
				label: 'Wikipedia — "Getty-Dubay Italic"',
				url: 'https://en.wikipedia.org/wiki/Getty-Dubay_Italic',
			},
			{
				label: 'New American Cursive — official program site (Iris Hatfield)',
				url: 'https://www.newamericancursive.com/',
			},
		],
		embedHeight: 1080,
	},
	{
		slug: 'fraction-calculator',
		category: 'Math',
		title: 'Fraction Calculator',
		shortTitle: 'Fraction Calculator',
		description:
			'Add, subtract, multiply, or divide two fractions (including mixed numbers), simplify a fraction to lowest terms, or convert between mixed numbers, improper fractions, decimals, and percents.',
		updated: '2026-08-11',
		published: '2026-08-11',
		coreSummary:
			'Adding or subtracting fractions requires a common denominator first: a/b + c/d = (a×d + c×b) ÷ (b×d). Multiplying and dividing do not need one. Multiply straight across (a/b × c/d = a×c ÷ b×d), and divide by multiplying by the reciprocal (a/b ÷ c/d = a×d ÷ b×c). Every result is then reduced to lowest terms by dividing both terms by their greatest common divisor, found with the Euclidean algorithm. A mixed number like 2 3/4 is the same value as the improper fraction 11/4 (2×4+3 over 4), so operations on mixed numbers work by converting to an improper fraction first and converting back afterward.',
		queries: [
			'fraction calculator',
			'mixed fraction calculator',
			'adding fractions calculator',
			'simplify fractions calculator',
			'improper fraction to mixed number',
			'fraction to percent calculator',
			'fraction to decimal',
		],
		sections: [
			{
				heading: 'Adding and subtracting need a common denominator',
				body: [
					'Fractions only add or subtract directly when they already share a denominator. You cannot combine "3 of something cut into 4 pieces" with "1 of something cut into 6 pieces" until both are re-cut into the same size piece. The fix is to rewrite each fraction as an equivalent fraction over a shared denominator (multiplying a fraction\'s numerator and denominator by the same number never changes its value), then add or subtract the numerators. The Common Core State Standards for Mathematics describe exactly this in the Grade 5 fractions domain, standard 5.NF.A.1: "replacing given fractions with equivalent fractions… to produce an equivalent sum or difference of fractions with like denominators." Their own worked example is 2/3 + 5/4 = 8/12 + 15/12 = 23/12, found by cross-multiplying the two denominators (3×4=12) instead of hunting for the least common multiple by hand.',
					'A subtraction example: 3/4 − 1/6. The shared denominator is 4×6=24, so 3/4 becomes 18/24 and 1/6 becomes 4/24, leaving 18/24 − 4/24 = 14/24, which simplifies to 7/12 (dividing both terms by their greatest common divisor, 2).',
				],
			},
			{
				heading: 'Multiplying and dividing skip the common denominator entirely',
				body: [
					'Multiplication of fractions is a straight-across operation: multiply the two numerators together, multiply the two denominators together, and simplify. 2/3 × 3/4 = (2×3)/(3×4) = 6/12, which reduces to 1/2. No common denominator is needed, because multiplication is not measuring "how many of the same-size piece" the way addition is. It is scaling one fraction by another.',
					'Division works by flipping the second fraction (its reciprocal) and multiplying: 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2. That matches the intuitive version too: "how many 1/4-cup scoops fit in 1/2 cup" is 2. Multiplying by a fraction\'s reciprocal is how division is formally defined for fractions in the Common Core standards (6.NS.A.1 extends this to dividing any fraction by any fraction). Dividing by a fraction that equals zero, like 0/5, has no defined answer, the same way dividing by the whole number 0 does not.',
				],
			},
			{
				heading: 'Simplifying to lowest terms',
				body: [
					'A fraction is in "lowest terms" when its numerator and denominator share no common factor greater than 1. Finding that shared factor, the greatest common divisor (GCD), is done here with the Euclidean algorithm: repeatedly replace the larger number with the remainder of dividing it by the smaller, until the remainder is 0. The last non-zero remainder is the GCD. This method is over two thousand years old. Euclid\'s *Elements* (Book VII, Proposition 2) describes it as a way to find the "greatest common measure" of two numbers, and it is still the standard algorithm computers use for this today. For 36/48, the GCD of 36 and 48 is 12, so dividing both terms by 12 gives 3/4.',
					'A fraction where the numerator is 0, like 0/9, always simplifies to 0/1. Zero pieces of anything is zero, regardless of the denominator.',
				],
			},
			{
				heading: 'Mixed numbers are fractions in disguise',
				body: [
					'A mixed number like 2 3/4 means "2 whole units, plus 3/4 of another unit," which is the same quantity as the improper fraction 11/4 (an improper fraction is simply one whose numerator is larger than its denominator). To convert a mixed number to an improper fraction, multiply the whole number by the denominator, add the numerator, and keep the same denominator: (2×4)+3=11, over 4. To go the other way, divide the numerator by the denominator. The whole-number quotient becomes the whole part, and the remainder becomes the new numerator over the same denominator: 11÷4 is 2 remainder 3, so 11/4 becomes 2 3/4.',
					'A recipe example: a batch of bread dough calls for 2 3/4 cups of flour and you want to double it. Convert to an improper fraction first (2 3/4 = 11/4), then multiply by 2/1: 11/4 × 2/1 = 22/4, which simplifies to 11/2, or 5 1/2 cups. Trying to double "2 3/4" directly, without converting to an improper fraction first, is where most doubled-recipe arithmetic mistakes happen.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Eighths ladder: fraction, decimal, percent',
				headers: ['Fraction', 'Decimal', 'Percent'],
				rows: [
					['1/8', '0.125', '12.5%'],
					['1/4 (2/8)', '0.25', '25%'],
					['3/8', '0.375', '37.5%'],
					['1/2 (4/8)', '0.5', '50%'],
					['5/8', '0.625', '62.5%'],
					['3/4 (6/8)', '0.75', '75%'],
					['7/8', '0.875', '87.5%'],
					['1 (8/8)', '1', '100%'],
				],
				note: 'Eighths are the increments printed on most tape measures and measuring cups, which is why this ladder shows up constantly in cooking and carpentry conversions.',
			},
			{
				title: 'Simplifying common fractions',
				headers: ['Fraction', 'Greatest common divisor', 'Simplified'],
				rows: [
					['4/8', '4', '1/2'],
					['6/9', '3', '2/3'],
					['9/12', '3', '3/4'],
					['10/15', '5', '2/3'],
					['12/16', '4', '3/4'],
					['15/20', '5', '3/4'],
					['18/24', '6', '3/4'],
					['20/30', '10', '2/3'],
				],
				note: 'Dividing numerator and denominator by their GCD is the only way to reach lowest terms. Dividing by any smaller common factor leaves the fraction only partly simplified.',
			},
		],
		faq: [
			{
				question: 'How do you add fractions with different denominators?',
				answer:
					'Rewrite both fractions over a shared denominator, then add the numerators. The simplest shared denominator is the product of the two original denominators: for a/b + c/d, use (a×d + c×b) ÷ (b×d). For example, 2/3 + 5/4 = (2×4 + 5×3) ÷ (3×4) = 23/12.',
			},
			{
				question: 'How do you divide fractions?',
				answer:
					'Multiply the first fraction by the reciprocal (flip) of the second: a/b ÷ c/d = a/b × d/c. For example, 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2. Dividing by a fraction that equals zero is undefined.',
			},
			{
				question: 'How do you simplify a fraction to lowest terms?',
				answer:
					'Find the greatest common divisor (GCD) of the numerator and denominator, then divide both by it. 8/12 has a GCD of 4, so it simplifies to 2/3. The Euclidean algorithm (repeatedly dividing and taking the remainder) is the standard way to find the GCD without listing every factor.',
			},
			{
				question: 'How do you convert a mixed number to an improper fraction?',
				answer:
					'Multiply the whole number by the denominator, add the numerator, and keep the same denominator. 2 3/4 becomes (2×4 + 3) ÷ 4 = 11/4.',
			},
			{
				question: 'How do you convert an improper fraction to a mixed number?',
				answer:
					'Divide the numerator by the denominator. The whole-number part of the quotient is the mixed number\'s whole part; the remainder becomes the new numerator over the same denominator. 11/4 is 2 remainder 3, so it becomes 2 3/4.',
			},
			{
				question: 'How do you convert a fraction to a decimal or a percent?',
				answer:
					'Divide the numerator by the denominator to get a decimal (3/4 = 0.75); multiply that decimal by 100 to get a percent (0.75 = 75%). A fraction whose denominator has prime factors other than 2 or 5 (like 1/3) produces a repeating decimal rather than a terminating one.',
			},
		],
		sources: [
			{
				label:
					'Common Core State Standards for Mathematics, Grade 5 Number and Operations, Fractions domain (5.NF.A.1, 5.NF.B.4)',
				url: 'https://www.thecorestandards.org/Math/Content/5/NF/',
			},
			{
				label:
					'Common Core State Standards for Mathematics, Grade 6 The Number System (6.NS.A.1): dividing any fraction by any fraction',
				url: 'https://www.thecorestandards.org/Math/Content/6/NS/',
			},
			{
				label: 'Euclid, Elements, Book VII, Proposition 2: the Euclidean algorithm for the greatest common divisor',
				url: 'https://mathcs.clarku.edu/~djoyce/elements/bookVII/propVII2.html',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'time-duration-calculator',
		category: 'Date & Time',
		title: 'Time Duration Calculator',
		shortTitle: 'Duration Calculator',
		description:
			'Find the elapsed time between two clock times, add or subtract hours and minutes from a time, or calculate the duration between two full dates and times, with automatic overnight rollover.',
		updated: '2026-08-11',
		published: '2026-08-11',
		coreSummary:
			'An hour equals exactly 60 minutes and a minute equals exactly 60 seconds, fixed ratios from the BIPM SI Brochure, not estimates. When the end time entered is earlier than or the same as the start time, this calculator assumes the end falls on the next day, the standard convention for an overnight span such as a 10 PM to 6 AM shift, so the result is always a positive duration instead of a negative one.',
		queries: [
			'time duration calculator',
			'time between two times calculator',
			'elapsed time calculator',
			'add time calculator',
			'hours and minutes calculator',
			'how many hours between two times',
			'time duration',
		],
		sections: [
			{
				heading: 'Three ways to measure elapsed time',
				body: [
					'"Between two times" answers the most common version of the question: given a start and an end clock reading, how much time passed. "Add/subtract" answers a different question: given one time and a duration, what time results, useful for figuring out when a task that started at 2:15 PM and runs for 3 hours 40 minutes will finish. "Two date-times" is for spans longer than a single day: enter a full start date and time and a full end date and time, and the result includes a day count along with hours and minutes.',
					"All three modes convert clock readings into whole seconds first, then do the arithmetic in seconds before converting back, so a result of \"8h 30m\" and a result of \"8.5 hours\" always describe the identical span, just in two common formats.",
				],
			},
			{
				heading: 'Why an earlier end time means the next day',
				body: [
					'A search for the time between two clock readings almost always means a single continuous span, not a full day minus that span. If the end time entered is earlier than or equal to the start time, this calculator assumes the missing hours belong to the next calendar day rather than returning a negative number. A shift that runs from 10:00 PM to 6:00 AM, for instance, is 8 hours: the clock passes midnight partway through, and 6:00 AM only reads as "earlier" than 10:00 PM because it belongs to the following day.',
					'This is the convention every general-purpose elapsed-time tool uses for the same reason: on a plain 24-hour clock with no date attached, there is no way to distinguish "2 hours" from "26 hours" without picking one interpretation, and the overnight-span reading matches how the question is normally asked.',
				],
			},
			{
				heading: 'Worked example: a 9:15 AM to 5:45 PM workday',
				body: [
					'Start at 9:15 AM (33,300 seconds after midnight) and end at 5:45 PM (63,900 seconds after midnight). The difference is 30,600 seconds, which breaks down to 8 hours and 30 minutes, or 8.5 hours exactly, since 30 minutes is precisely half of 60. A workday quoted as "9 to 5" with a half-hour added on either end lands on this same 8.5-hour figure.',
					'Payroll and time-tracking software often display both formats side by side because they serve different purposes: decimal hours multiply cleanly against an hourly rate (8.5 hours at $20/hour is $170.00 with no further conversion), while hours and minutes reads naturally off a clock.',
				],
			},
			{
				heading: 'When to use "Two date-times" instead',
				body: [
					'"Between two times" and "Add/subtract" both work on a single abstract 24-hour clock with no calendar date attached, which is enough for anything within one day or one overnight rollover. "Two date-times" is for a longer span: a project that starts at 9:00 AM on January 1 and finishes at 9:00 AM on January 3 is exactly 48 hours, 2 full days, a figure the single-clock modes cannot express since they only ever assume at most one day has passed.',
					'The two calculations agree wherever they overlap. An overnight span entered as 10:00 PM to 6:00 AM in "Between two times," and the same span entered as two full date-times one calendar day apart, both return 8 hours, because both ultimately convert the clock readings to seconds and subtract.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Minutes as decimal hours',
				headers: ['Minutes', 'Decimal hours'],
				rows: [
					['0', '0.00'],
					['15', '0.25'],
					['30', '0.50'],
					['45', '0.75'],
					['60', '1.00'],
				],
				note: 'Exact fractions of 60, not rounded. Useful for reading a timesheet total like "8h 15m" as 8.25 hours.',
			},
			{
				title: 'Example elapsed times',
				headers: ['Start', 'End', 'Elapsed'],
				rows: [
					['9:00 AM', '5:00 PM', '8h 0m'],
					['9:15 AM', '5:45 PM', '8h 30m'],
					['8:30 AM', '12:15 PM', '3h 45m'],
					['10:00 PM', '6:00 AM', '8h 0m (overnight)'],
				],
				note: 'Each figure is a plain clock-to-clock difference; the overnight row assumes an end time at or before the start time falls on the next day.',
			},
		],
		faq: [
			{
				question: 'How do I calculate the time between two clock times?',
				answer:
					'Use "Between two times," enter the start and end hour and minute, and the calculator returns the elapsed duration in hours and minutes, decimal hours, and total minutes at once.',
			},
			{
				question: 'What happens if the end time is earlier than the start time?',
				answer:
					'The calculator assumes the end time falls on the next day rather than returning a negative result. A 10:00 PM to 6:00 AM entry is treated as an 8-hour overnight span, not negative 16 hours.',
			},
			{
				question: 'How do I add or subtract hours and minutes from a time?',
				answer:
					'Use "Add/subtract," enter a starting time and a duration in hours and minutes, and choose Add or Subtract. If the result crosses midnight, the calculator reports how many days forward or back it lands.',
			},
			{
				question: 'What is the difference between "Between two times" and "Two date-times" modes?',
				answer:
					'"Between two times" works on a single 24-hour clock and assumes at most one overnight rollover. "Two date-times" takes a full calendar date alongside each time, so it correctly reports spans of several days, not just a same-day or overnight difference.',
			},
			{
				question: 'How do I convert 8 hours 30 minutes into decimal hours?',
				answer:
					'Divide the minutes by 60 and add it to the hours: 30 minutes is 30/60 = 0.5, so 8 hours 30 minutes is 8.5 decimal hours. The calculator does this automatically and shows the decimal-hours figure alongside the hours-and-minutes figure.',
			},
			{
				question: 'Does this calculator account for time zones or daylight saving time?',
				answer:
					'No. This tool treats every day as exactly 24 hours on an abstract clock with no time zone attached. If two real-world clock readings fall on opposite sides of a daylight-saving transition, the actual elapsed wall-clock time will differ by an hour from what this calculator reports; this site\'s World Clock converter handles time-zone-aware conversions instead.',
			},
		],
		sources: [
			{
				label: 'BIPM SI Brochure — Annex 1: Units of time accepted for use with the SI (minute, hour, day as exact fixed ratios)',
				url: 'https://www.bipm.org/en/publications/si-brochure/annex-1/time',
			},
			{
				label: 'ECMA-262, the ECMAScript Language Specification — §21.4 "Date Objects" (proleptic Gregorian calendar convention used for the date-time mode)',
				url: 'https://tc39.es/ecma262/#sec-date-objects',
			},
		],
		embedHeight: 860,
	},
	{
		slug: 'greek-alphabet',
		category: 'Reference',
		title: 'Greek Alphabet',
		shortTitle: 'Greek Alphabet',
		description:
			'Search or browse all 24 letters of the Greek alphabet with names, Unicode code points, and their common uses in math, science, and engineering, and copy any letter with one click.',
		updated: '2026-08-11',
		published: '2026-08-11',
		coreSummary:
			'The modern Greek alphabet has 24 letters, from alpha (Α, α) to omega (Ω, ω). Sigma is the only letter with two lowercase forms: σ inside a word and ς only when sigma is the last letter of a word. Search this tool by letter name (like "pi") or by what it is used for (like "standard deviation") and click any result to copy it.',
		queries: [
			'greek alphabet',
			'greek letters',
			'greek alphabet symbols',
			'greek alphabet in order',
			'greek alphabet copy and paste',
			'pi symbol',
			'delta symbol',
			'sigma symbol',
			'alpha symbol',
		],
		sections: [
			{
				heading: 'How to use this tool',
				body: [
					'Type a letter name or a use case into the search box (try "pi," "angle," or "standard deviation") to narrow the grid, or leave it blank to browse all 24 letters at once. Click any letter to copy it, along with its lowercase form and name, to your clipboard.',
					'Each entry shows the uppercase and lowercase forms side by side, and sigma also shows its special word-final form. The full reference table below adds Unicode code points, a rough pronunciation guide, and where each letter commonly turns up in math, science, or engineering.',
				],
			},
			{
				heading: 'Where the Greek alphabet comes from',
				body: [
					"Greek writing developed from the Phoenician alphabet around the 9th or 8th century BCE, adding the first true vowel letters along the way, a change the Phoenician consonant-only script didn't have. Early Greek city-states used regional variants with a few extra letters that later dropped out of everyday use: digamma (Ϝ), qoppa (Ϙ), and sampi (Ϡ) all disappeared from the alphabet used to write Greek but survive as numeral symbols, standing for 6, 90, and 900 in the traditional Greek numbering system.",
					'The 24-letter alphabet used today became the Athenian standard during the archonship of Eucleides in 403 BCE, when Athens officially adopted the Ionic alphabet (the version with eta, phi, psi, and omega) in place of its older local Attic script. Other Greek city-states had already been using versions of the Ionic alphabet for some time; Athens\' adoption is what fixed the 24-letter form that spread from there.',
				],
			},
			{
				heading: 'Greek letters in math, science, and engineering',
				body: [
					'Scientists and mathematicians reach for Greek letters mainly because the Latin alphabet runs out of obvious, unambiguous symbols long before an equation does. π, Σ, Δ, and the rest give a second full alphabet of symbols to draw on, and a few have stuck around specifically because of what they originally meant in Greek. π is the clearest example: the Welsh mathematician William Jones introduced π for the ratio of a circle\'s circumference to its diameter in 1706, likely because π is the first letter of "perimetros" (perimeter). The symbol only caught on widely after Leonhard Euler started using it in his own work in the 1730s and 40s, and Euler\'s influence is largely why it became the standard.',
					"Other letters carry more than one meaning depending on the field: uppercase Δ (delta) usually means a change or difference in a quantity, while lowercase σ (sigma) is standard deviation in statistics but mechanical stress in engineering. Context, not the letter alone, tells you which meaning applies. The reference table below lists a letter's most common uses, not an exhaustive list of every field that borrows it.",
				],
			},
			{
				heading: 'The sigma exception: σ vs. ς',
				body: [
					'Sigma is the only Greek letter with two different lowercase shapes. The regular form, σ (U+03C3), is used everywhere within a word. The moment sigma is the last letter of a word, it switches to a hooked final form, ς (U+03C2). In the Greek word for "wisdom," σοφός, for example, the first two sigmas are the regular σ and the last one is the final ς. This positional rule is a feature of Greek spelling itself, not a font quirk or a typo, and it has no equivalent among the other 23 letters.',
				],
			},
			{
				heading: 'Greek letters in fraternity and sorority names',
				body: [
					'Phi Beta Kappa, founded on December 5, 1776 by five students at the College of William & Mary in Williamsburg, Virginia, was the first organization to take a Greek-letter name: Φ Β Κ stood for the initials of its Greek motto, "Love of learning is the guide of life." The naming convention it started (Greek initials standing in for a Latin or Greek motto) became the template that later college fraternities and sororities across the US adopted for their own names.',
				],
			},
			{
				heading: 'How to type Greek letters',
				body: [
					'The Unicode code points in the table below (like U+03C0 for π) work directly in any app that accepts Unicode input by code point. In Microsoft Word specifically, type the hex code point without the "U+" prefix (just 3C0) immediately followed by the Alt+X keyboard shortcut, and Word converts it to the character automatically. On a phone, most iOS and Android keyboards offer a Greek keyboard layout under keyboard settings that types the letters directly. For quick one-off use on any device, this tool\'s copy button is the simplest route: search for the letter, click it, and paste.',
				],
			},
		],
		referenceTables: [
			{
				title: 'The 24 Greek letters',
				headers: ['Letter', 'Glyphs', 'Unicode (upper / lower)', 'Pronunciation', 'Common use'],
				rows: GREEK_LETTERS.map((letter) => [
					letter.name,
					`${letter.uppercase} ${letter.lowercase}${letter.finalForm ? ` ${letter.finalForm}` : ''}`,
					letter.finalForm
						? `${letter.upperCodePoint} / ${letter.lowerCodePoint} (final: U+03C2)`
						: `${letter.upperCodePoint} / ${letter.lowerCodePoint}`,
					letter.pronunciation,
					letter.commonUse,
				]),
				note: 'Uppercase code points run U+0391–U+03A9 with U+03A2 left unassigned in Unicode (a reserved gap, not a 25th letter). Lowercase code points run U+03B1–U+03C9, skipping U+03C2 in the regular sequence because that slot is reserved for the sigma final form.',
			},
		],
		faq: [
			{
				question: 'How many letters are in the Greek alphabet?',
				answer:
					'24. Three older letters (digamma, qoppa, and sampi) dropped out of the alphabet used to write Greek but are still used as numeral symbols (6, 90, and 900) in the traditional Greek numbering system, so they sometimes show up in alphabet history but not in the modern 24-letter list.',
			},
			{
				question: 'What is the pi symbol?',
				answer:
					'Lowercase π (U+03C0) is the 16th letter of the Greek alphabet, and in math it represents the ratio of a circle\'s circumference to its diameter, approximately 3.14159. Uppercase Π is used for a product series in math, unrelated to the circle constant. Search "pi" above to find and copy it.',
			},
			{
				question: 'What is the delta symbol?',
				answer:
					'Delta is the 4th Greek letter. Uppercase Δ (U+0394) most commonly means "change in" a quantity (as in ΔT for a change in temperature). Lowercase δ (U+03B4) is used for smaller or more specific changes, and in advanced math for the Dirac delta function. Search "delta" above to find and copy either form.',
			},
			{
				question: 'What is the sigma symbol?',
				answer:
					'Sigma is the 18th Greek letter and the only one with two lowercase forms: σ (U+03C3) within a word and ς (U+03C2) only when sigma ends a word. Uppercase Σ (U+03A3) is the summation symbol in math. Lowercase σ is standard deviation in statistics and mechanical stress in engineering. Search "sigma" above to find and copy any of the three forms.',
			},
			{
				question: 'What is the alpha symbol?',
				answer:
					'Alpha is the first Greek letter. Lowercase α (U+03B1) commonly denotes an angle, a significance level in statistics, or an alpha particle in nuclear physics; uppercase Α (U+0391) is used less often since it looks identical to the Latin capital A. Search "alpha" above to find and copy it.',
			},
			{
				question: 'Why does sigma have two different lowercase shapes?',
				answer:
					'Because Greek spelling rules give sigma a different shape depending on where it falls in a word: the regular σ is used everywhere except the very end of a word, where it switches to the hooked final form ς. No other Greek letter has this positional rule.',
			},
			{
				question: 'Is omicron the same as the letter O?',
				answer:
					"They look almost identical, but they're different letters from different alphabets: omicron (Ο, ο) is the 15th Greek letter, while O is Latin. Because they're so visually similar, omicron is rarely used as a math or science symbol, unlike most of the other 23 Greek letters.",
			},
			{
				question: 'How do I type a Greek letter on my keyboard?',
				answer:
					'In Microsoft Word, type the hex Unicode code point (for example, 3C0 for π) and press Alt+X to convert it to the character. On iOS or Android, add a Greek keyboard layout in your keyboard settings. For a one-off letter on any device, search for it above and click to copy.',
			},
		],
		sources: [
			{
				label: 'Wikipedia — "Greek alphabet"',
				url: 'https://en.wikipedia.org/wiki/Greek_alphabet',
			},
			{
				label: 'Unicode Consortium — "Greek and Coptic" code chart (U+0370–U+03FF), showing the U+03A2 reserved gap',
				url: 'https://www.unicode.org/charts/PDF/U0370.pdf',
			},
			{
				label: 'Wikipedia — "Eucleides" (archon during whose year Athens adopted the Ionic alphabet, 403 BCE)',
				url: 'https://en.wikipedia.org/wiki/Eucleides',
			},
			{
				label: 'Wikipedia — "Digamma," "Koppa (letter)," and "Sampi" (archaic letters retained as Greek numerals)',
				url: 'https://en.wikipedia.org/wiki/Digamma',
			},
			{
				label: 'MacTutor History of Mathematics (University of St Andrews) — "Earliest Uses of Symbols for Constants" (William Jones, 1706; Euler\'s adoption)',
				url: 'https://mathshistory.st-andrews.ac.uk/Miller/mathsym/constants/',
			},
			{
				label: 'The Phi Beta Kappa Society — official history (founded December 5, 1776, College of William & Mary)',
				url: 'https://www.pbk.org/about/history',
			},
		],
		embedHeight: 920,
	},
	{
		slug: 'shape-volume-calculator',
		category: 'Math',
		title: 'Shape Volume & Surface Area Calculator',
		shortTitle: 'Shape Volume Calculator',
		description:
			'Find the volume and surface area of a rectangular prism, cylinder, sphere, or cone. Enter the dimensions in ft, in, yd, m, or cm and get both numbers at once.',
		updated: '2026-08-12',
		published: '2026-08-12',
		coreSummary:
			'Volume and surface area both come from the same handful of dimensions. Rectangular prism: volume = length × width × height, surface area = 2(lw + lh + wh). Cylinder: volume = πr²h, surface area = 2πr(r + h). Sphere: volume = (4/3)πr³, surface area = 4πr². Cone: volume = (1/3)πr²h, surface area = πr² + πrl, where l is the slant height, √(r² + h²). This tool takes the dimensions for whichever shape is selected and returns both figures at once.',
		queries: [
			'volume of a rectangular prism',
			'surface area of a sphere',
			'surface area of a cylinder',
			'volume of a cylinder calculator',
			'volume of a sphere calculator',
			'volume of a cone calculator',
			'shape volume calculator',
		],
		sections: [
			{
				heading: 'The four formulas',
				body: [
					'A rectangular prism, a box, has volume length × width × height. Its surface area is the sum of the areas of all six rectangular faces: 2(lw + lh + wh), since opposite faces come in matching pairs.',
					'A cylinder\'s volume is πr²h: the area of the circular base, πr², times the height. Its total surface area covers both circular ends plus the curved side wrapped around them, 2πr² + 2πrh, usually written 2πr(r + h).',
					'A sphere\'s volume is (4/3)πr³, and its surface area is 4πr², a result attributed to Archimedes: a sphere\'s surface area equals exactly four times the area of its largest circular cross-section.',
					'A cone\'s volume is (1/3)πr²h, one third of a cylinder sharing the same base and height. Its total surface area is the flat base circle plus the slanted side: πr² + πrl, where the slant height l is √(r² + h²) by the Pythagorean theorem, since the slant is the hypotenuse of a right triangle formed by the radius and the height.',
				],
			},
			{
				heading: 'Worked examples',
				body: [
					'A shipping box 2 ft long, 1.5 ft wide, and 1 ft tall: volume = 2 × 1.5 × 1 = 3 cubic feet. Surface area = 2(2×1.5 + 2×1 + 1.5×1) = 2(3 + 2 + 1.5) = 13 square feet, the amount of cardboard the box is made from.',
					'A cylindrical drum with a 2 ft radius and 6 ft height: volume = π × 2² × 6 = 24π ≈ 75.4 cubic feet. Surface area = 2π × 2 × (2 + 6) = 32π ≈ 100.5 square feet, counting the top and bottom lids plus the wrapped side.',
				],
			},
			{
				heading: 'Radius, not diameter',
				body: [
					'Every formula above uses the radius, the distance from the center to the edge. Product listings and everyday measurements more often give the diameter, the distance all the way across, so if that is what is on hand, halve it before entering a value here.',
					"The cone result is the total surface area: base plus the slanted side. A party hat or a paper cone rolled with no bottom only has the slanted portion, so subtract πr² from the total shown here to get that lateral-only figure.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Formula reference',
				headers: ['Shape', 'Volume', 'Surface area'],
				rows: [
					['Rectangular prism', 'l × w × h', '2(lw + lh + wh)'],
					['Cylinder', 'πr²h', '2πr(r + h)'],
					['Sphere', '(4/3)πr³', '4πr²'],
					['Cone', '(1/3)πr²h', 'πr² + πrl, l = √(r² + h²)'],
				],
			},
			{
				title: 'Example calculations',
				headers: ['Shape', 'Dimensions', 'Volume', 'Surface area'],
				rows: [
					['Rectangular prism', '3 × 4 × 5 ft', '60 ft³', '94 ft²'],
					['Cylinder', 'radius 3 ft, height 10 ft', '282.74 ft³', '245.04 ft²'],
					['Sphere', 'radius 5 ft', '523.60 ft³', '314.16 ft²'],
					['Cone', 'radius 3 ft, height 4 ft', '37.70 ft³', '75.40 ft²'],
				],
				note: 'Volume and surface area figures are rounded to two decimal places; the calculator above shows more precision.',
			},
		],
		faq: [
			{
				question: 'How do you find the volume of a rectangular prism?',
				answer:
					'Multiply length × width × height. All three measurements need to be in the same unit; a 3 ft × 4 ft × 5 ft box has a volume of 60 cubic feet.',
			},
			{
				question: 'What is the formula for the surface area of a sphere?',
				answer:
					'4πr², where r is the radius. A sphere with a 5 ft radius has a surface area of 4π × 25 = 100π, about 314.16 square feet.',
			},
			{
				question: 'How do you find the volume of a cylinder?',
				answer:
					'Volume = πr²h: the area of the circular base (πr²) times the height. A cylinder with a 3 ft radius and 10 ft height has a volume of π × 9 × 10 = 90π, about 282.74 cubic feet.',
			},
			{
				question: "What is a cone's surface area formula?",
				answer:
					'Total surface area = πr² + πrl, where l is the slant height, √(r² + h²). The πr² term is the flat circular base and πrl is the slanted side. For a lateral-only figure (no base), use just πrl.',
			},
			{
				question: 'Does this calculator use radius or diameter?',
				answer:
					'Radius for the cylinder, sphere, and cone fields. If a product spec gives the diameter instead, divide it by two before entering it here.',
			},
			{
				question: "Why is a cone's volume one third of a cylinder's?",
				answer:
					"Because (1/3)πr²h versus πr²h for a cylinder sharing the same base and height. This is a general result for any cone or pyramid against a prism with a matching base and height, not something specific to circular cones.",
			},
		],
		sources: [
			{
				label: 'Wolfram MathWorld — "Cuboid" (rectangular prism volume and surface area)',
				url: 'https://mathworld.wolfram.com/Cuboid.html',
			},
			{
				label: 'Wolfram MathWorld — "Cylinder"',
				url: 'https://mathworld.wolfram.com/Cylinder.html',
			},
			{
				label: 'Wolfram MathWorld — "Sphere"',
				url: 'https://mathworld.wolfram.com/Sphere.html',
			},
			{
				label: 'Wolfram MathWorld — "Cone"',
				url: 'https://mathworld.wolfram.com/Cone.html',
			},
			{
				label: 'CalculatorSoup — "Cone Calculator" (cross-check for the cone total surface area formula)',
				url: 'https://www.calculatorsoup.com/calculators/geometry-solids/cone.php',
			},
		],
		embedHeight: 800,
	},
	{
		slug: 'yes-or-no-wheel',
		category: 'Games',
		title: 'Yes or No Wheel: Weighted Decision Spinner',
		shortTitle: 'Yes or No Wheel',
		description:
			'Spin a weighted yes/no wheel (or add a Maybe segment) for a quick decision, plus the odds behind it: how likely each outcome is and how many spins it usually takes to land on Yes.',
		updated: '2026-08-12',
		published: '2026-08-12',
		coreSummary:
			'A yes-or-no wheel is a weighted random draw dressed up as a spinning circle: split the circle into arcs sized to each option\'s share of the total, draw one random number from 0 to 1, and see which arc it falls into. At an even 50/50 split, each spin behaves like a coin flip: a 50% chance of Yes and a 50% chance of No. Bias the wheel to 70% Yes, 30% No, and Yes lands on 70% of spins, cutting the average wait for a Yes down to 1 ÷ 0.7 ≈ 1.43 spins instead of 2.',
		queries: [
			'yes or no wheel',
			'yes no wheel',
			'decision wheel',
			'random yes or no',
			'spin the wheel yes or no',
		],
		sections: [
			{
				heading: 'How a weighted wheel actually picks an answer',
				body: [
					'Behind the spinning graphic, the wheel is doing one thing: converting each option\'s weight into an arc of the circle, then drawing a single random number to see which arc it lands in. With Yes and No both weighted equally, each gets a 180-degree arc, so the draw is exactly a coin flip with extra visual flair. Slide the "Chance of Yes" control to 70% and the Yes arc grows to 252 degrees (70% of 360) while No shrinks to 108 degrees, so the same one random number now favors Yes without the wheel doing anything different mechanically.',
					'This is the standard cumulative-weight method for sampling from a weighted discrete outcome set: line up the options\' probabilities end to end from 0 to 1, draw a uniform random number, and take whichever option\'s slice the draw fell into. It is the same technique behind inverse transform sampling in probability theory, just applied to a small, fixed list of outcomes instead of a continuous curve.',
				],
			},
			{
				heading: 'Worked example: a 65/35 wheel',
				body: [
					"Set the Chance of Yes to 65%. The probability of No landing three times in a row is 0.35 × 0.35 × 0.35 = 0.042875, about 4.3%, because each spin is independent and the chances multiply. The average number of spins before Yes first appears is 1 ÷ 0.65 ≈ 1.54, a result from the geometric distribution: for a per-spin success probability p, the expected number of tries until the first success is 1/p.",
					'That 1/p relationship is why a heavily lopsided wheel (say 90% Yes) still occasionally takes several spins to hit the 10% side, and also why a fair 50/50 wheel needs 2 spins on average to land Yes at least once, not 1: half the time the first spin is No, and the wait keeps stacking from there.',
				],
			},
			{
				heading: "A streak doesn't mean the wheel is 'due' for the other answer",
				body: [
					'Every spin draws its own independent random number, so the wheel has no memory of what it landed on before. Three Yes spins in a row on a fair wheel does not raise or lower the odds of the fourth spin. Each still has an even 50% chance of either outcome, exactly like the spin before it, because the arcs on the wheel never change between draws unless the weight is changed.',
					"The chance of a specific streak happening is not the same question as whether the next spin is influenced by the streak. P(4 Yes in a row, fair wheel) = 0.5⁴ = 6.25% describes how rare that whole sequence is going in, before any of the spins happen; it says nothing about spin number 5 once spins 1 through 4 have already landed. That confusion between the two is the gambler's fallacy, and it applies to a decision wheel exactly as it does to a roulette wheel or a coin.",
				],
			},
			{
				heading: 'The three-way Yes / No / Maybe wheel',
				body: [
					'Switching to the three-segment wheel splits the circle into equal 120-degree thirds rather than a Yes/No bias, since a "Maybe" option in most everyday use is meant as a genuine third possibility, not a weighted alternative. Each segment lands 1-in-3 spins (33.3%), the average wait for any specific one of the three is 3 spins, and the chance of the same segment landing twice in a row is (1/3)² ≈ 11.1%, noticeably rarer than the roughly 1-in-4 chance of a repeat on the two-segment wheel.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Average spins until Yes, by bias',
				headers: ['Chance of Yes', 'Chance of No', 'Avg. spins until Yes', 'P(Yes twice in a row)'],
				rows: [
					['50%', '50%', '2.00', '25.0%'],
					['60%', '40%', '1.67', '36.0%'],
					['70%', '30%', '1.43', '49.0%'],
					['75%', '25%', '1.33', '56.3%'],
					['80%', '20%', '1.25', '64.0%'],
					['90%', '10%', '1.11', '81.0%'],
				],
				note: 'Avg. spins until Yes = 1 ÷ P(Yes) (geometric distribution mean). P(Yes twice in a row) = P(Yes)² for two independent spins.',
			},
		],
		faq: [
			{
				question: 'Is a yes or no wheel actually random?',
				answer:
					"It runs on the browser's built-in pseudorandom number generator (Math.random), which is not truly random in a cryptographic sense but is statistically even and unpredictable enough for a decision wheel, a game, or any other everyday use where nothing is riding on defeating a deliberate attacker. Each spin draws a fresh number independent of every spin before it.",
			},
			{
				question: 'Can I make the wheel favor Yes or No?',
				answer:
					'Yes, the "Chance of Yes" control resizes the wheel\'s arcs to match: set it to 70% and Yes occupies 70% of the circle (252 of 360 degrees), so it lands on roughly 7 of every 10 spins over the long run, though any single spin can still go either way.',
			},
			{
				question: 'How is this different from just flipping a coin?',
				answer:
					'A fair 50/50 wheel and a fair coin are mathematically identical: both are a single draw between two equally likely outcomes. The wheel adds three things a coin does not: an adjustable bias so the odds do not have to be 50/50, a "Maybe" third option, and a running spin history so a streak (or the lack of one) is visible at a glance.',
			},
			{
				question: 'What is the chance of landing the same answer three times in a row?',
				answer:
					"Multiply that answer's per-spin probability by itself three times, since each spin is independent: on a fair 50/50 wheel, 0.5³ = 12.5%. On a wheel biased 70% toward Yes, three Yes spins in a row happen 0.7³ = 34.3% of the time, while three No spins in a row happen only 0.3³ = 2.7% of the time.",
			},
			{
				question: 'Does adding a Maybe option split the odds evenly?',
				answer:
					'Yes, the three-segment wheel splits Yes, No, and Maybe into equal thirds (33.3% each) rather than reusing the Yes/No bias slider, since a genuine third option is treated as its own even choice rather than a weighted variant of the two-way wheel.',
			},
		],
		sources: [
			{
				label: 'Wikipedia, "Geometric distribution" (expected number of trials until first success, E[X] = 1/p)',
				url: 'https://en.wikipedia.org/wiki/Geometric_distribution',
			},
			{
				label: 'Wikipedia, "Inverse transform sampling" (cumulative-probability method for drawing from a weighted discrete distribution)',
				url: 'https://en.wikipedia.org/wiki/Inverse_transform_sampling',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'steps-to-miles-calculator',
		category: 'Health',
		title: 'Steps to Miles Calculator',
		shortTitle: 'Steps to Miles',
		description:
			'Convert steps to miles or kilometers using a stride length estimated from your height and gender, not a flat 2,000-steps-per-mile guess. Also converts a distance back into steps.',
		updated: '2026-08-12',
		published: '2026-08-12',
		coreSummary:
			'Steps convert to distance through stride length, not a fixed ratio: distance = steps × step length. Step length itself is estimated from height using the regression Hoeger et al. (2008) fit across walking and running speeds: step length ≈ height × 0.415 for men or height × 0.413 for women. At the U.S. average adult height (68.9in men, 63.5in women, CDC NHANES), 10,000 steps works out to about 4.51 miles for men and 4.14 miles for women. The "10,000 steps ≈ 5 miles" rule of thumb only holds for someone near that average height and overshoots for a shorter stride.',
		queries: [
			'how many miles is 10000 steps',
			'steps to miles',
			'how many steps in a mile',
			'how many steps is 5 miles',
			'how many miles is 8000 steps',
			'steps to miles calculator',
			'how many miles is 6000 steps',
		],
		sections: [
			{
				heading: 'Why height changes the answer',
				body: [
					"A step count on its own doesn't set a distance; it's steps times step length, and step length scales with leg length, which scales with height. Hoeger et al. measured step length across a range of walking and running speeds and found it averages about 41.5% of height for men and 41.3% for women, published as \"One-Mile Step Count at Walking and Running Speeds\" in ACSM's Health & Fitness Journal (2008). A 5'2\" walker and a 6'2\" walker covering the same 10,000 steps end up roughly a mile apart, because the taller stride eats more ground per step.",
					'This calculator multiplies that estimated step length by the step count entered (or divides a distance by it, in reverse) rather than assuming everyone takes about 2,000 steps to cover a mile, a number that only holds near the population-average height.',
				],
			},
			{
				heading: 'Worked examples',
				body: [
					"A 5'9\" (69in) man walking 10,000 steps: step length = 69 × 0.415 = 28.635in. Distance = 10,000 × 28.635 ÷ 63,360 (inches per mile) ≈ 4.52 miles.",
					"A 5'4\" (64in) woman covering the same 10,000 steps: step length = 64 × 0.413 = 26.432in, giving 10,000 × 26.432 ÷ 63,360 ≈ 4.17 miles, a third of a mile less than the man above at the same step count, purely from the height difference.",
					"Reverse direction: how many steps cover 5 miles for that same 5'9\" man? Steps = 5 miles × 63,360in ÷ 28.635in ≈ 11,063 steps.",
				],
			},
			{
				heading: "The '10,000 steps ≈ 5 miles' rule only fits average height",
				body: [
					"That rule of thumb comes from roughly 2,000-2,200 steps per mile, which lines up with a step length around 28-31in, close to the U.S. average adult male height (68.9in) but noticeably longer than the average adult female stride (about 26.2in at 63.5in height, CDC NHANES 2021-2023). Below-average height compounds over thousands of steps: a half-inch-shorter step length changes a 10,000-step walk by roughly 0.08 miles, so the gap between a short and tall walker's actual distance for the same step count is real, not rounding noise.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Steps to distance at average adult height',
				headers: ['Steps', 'Men (68.9in avg. height)', 'Women (63.5in avg. height)'],
				rows: [
					['2,000', '0.90 mi', '0.83 mi'],
					['3,000', '1.35 mi', '1.24 mi'],
					['5,000', '2.26 mi', '2.07 mi'],
					['6,000', '2.71 mi', '2.48 mi'],
					['8,000', '3.61 mi', '3.31 mi'],
					['9,000', '4.06 mi', '3.73 mi'],
					['10,000', '4.51 mi', '4.14 mi'],
					['11,000', '4.96 mi', '4.55 mi'],
					['12,000', '5.42 mi', '4.97 mi'],
					['13,000', '5.87 mi', '5.38 mi'],
					['14,000', '6.32 mi', '5.79 mi'],
					['15,000', '6.77 mi', '6.21 mi'],
					['16,000', '7.22 mi', '6.62 mi'],
					['18,000', '8.12 mi', '7.45 mi'],
					['20,000', '9.03 mi', '8.28 mi'],
				],
				note: 'Based on the Hoeger et al. (2008) step-length regression at CDC NHANES 2021-2023 average adult heights. Enter your own height above for a personalized figure.',
			},
			{
				title: 'Estimated step length by height (average of men and women)',
				headers: ['Height', 'Est. step length', 'Distance for 10,000 steps'],
				rows: [
					["5'0\"", '24.84 in', '3.92 mi'],
					["5'2\"", '25.67 in', '4.05 mi'],
					["5'4\"", '26.50 in', '4.18 mi'],
					["5'6\"", '27.32 in', '4.31 mi'],
					["5'8\"", '28.15 in', '4.44 mi'],
					["5'10\"", '28.98 in', '4.57 mi'],
					["6'0\"", '29.81 in', '4.70 mi'],
				],
				note: 'Uses the midpoint of the male (0.415) and female (0.413) coefficients for a single-column estimate; the calculator above uses the gender-specific figure.',
			},
		],
		faq: [
			{
				question: 'How many miles is 10,000 steps?',
				answer:
					'About 4.5-5 miles for most adults, but it depends on height: roughly 4.51 miles at the U.S. average male height (68.9in) and 4.14 miles at the average female height (63.5in), using a step length of 0.415 × height for men and 0.413 × height for women.',
			},
			{
				question: 'How many steps are in a mile?',
				answer:
					"Around 2,000-2,300 steps per mile for most adults, again driven by height: a 5'9\" man averages about 2,213 steps per mile (63,360 ÷ 28.635in step length), while a shorter stride needs more steps to cover the same mile.",
			},
			{
				question: 'How many steps is 5 miles?',
				answer:
					"Around 11,000-12,000 steps depending on height and stride: about 11,079 steps at the U.S. average male height (68.9in), or roughly 12,080 steps at the average female height (63.5in).",
			},
			{
				question: 'Why not just use 2,000 steps per mile for everyone?',
				answer:
					"Because that ratio only holds near the population-average height. It comes from an average step length around 28-31in, which fits a roughly 5'9\"-6'0\" stride but overstates the distance for someone with a shorter stride, sometimes by close to half a mile over a 10,000-step walk.",
			},
			{
				question: 'Does this account for running instead of walking?',
				answer:
					"Not directly. The 0.415/0.413 coefficients here come from the walking-and-running-combined regression in the source study, so they land close to a moderate walking pace. Running stride lengthens with speed, so a runner's actual steps-per-mile will usually be lower (fewer, longer steps) than this estimate.",
			},
		],
		sources: [
			{
				label:
					'Hoeger, W.W.K. et al., "One-Mile Step Count at Walking and Running Speeds," ACSM\'s Health & Fitness Journal, Vol. 12, No. 1, pp. 14-19 (2008) — source of the 0.415 (men) / 0.413 (women) step-length-to-height regression',
				url: 'https://journals.lww.com/acsm-healthfitness/Fulltext/2008/01000/ONE_MILE_STEP_COUNT_AT_WALKING_AND_RUNNING_SPEEDS.7.aspx',
			},
			{
				label: 'CDC/NCHS, "Body Measurements" (FastStats) — U.S. average adult height, ages 20+, NHANES 2021-2023',
				url: 'https://www.cdc.gov/nchs/fastats/body-measurements.htm',
			},
		],
		embedHeight: 820,
	},
	{
		slug: 'math-symbols',
		category: 'Reference',
		title: 'Math Symbols',
		shortTitle: 'Math Symbols',
		description:
			'Search or browse common math symbols like ± × ÷ ≥ ≤ ≈ √ ² ³ ° ∞ ∴ with meanings, Unicode code points, and a short verified history, and copy any symbol with one click.',
		updated: '2026-08-13',
		published: '2026-08-13',
		coreSummary:
			'This tool covers 12 common math symbols that do not have their own keyboard key: ± × ÷ ≥ ≤ ≈ √ ² ³ ° ∞ ∴. Search by name or by what a symbol is used for (like "inequality" or "quadratic formula") and click any result to copy it.',
		queries: [
			'math symbols',
			'math symbols copy and paste',
			'greater than or equal to symbol',
			'less than or equal to symbol',
			'plus minus symbol',
			'division symbol',
			'multiplication symbol',
			'approximately symbol',
			'degree symbol',
			'infinity symbol',
			'squared symbol',
			'cubed symbol',
			'square root symbol',
			'therefore symbol',
		],
		sections: [
			{
				heading: 'How to use this tool',
				body: [
					'Search by a symbol\'s name ("infinity") or by what it\'s for ("quadratic formula," "inequality") and the grid narrows to matches; an empty search box shows all 12. Clicking a result copies the bare glyph, nothing else, to your clipboard.',
					"These 12 symbols don't share one origin the way an alphabet does. Each was put into print separately, sometimes centuries apart, so the reference table below pairs every symbol with its own Unicode code point and the specific book and year it first appeared in.",
				],
			},
			{
				heading: 'Two textbooks, four symbols',
				body: [
					"Two of the oldest symbols here trace back to the same two textbooks, each contributing an unrelated pair. English mathematician William Oughtred's 1631 Clavis Mathematicae (\"The Key of Mathematics\") introduced both × for multiplication and ± for plus-or-minus, though × itself first appears thirteen years earlier, in a 1618 appendix now attributed to Oughtred. Oughtred chose × over a plain letter x specifically to keep it from being confused with a variable.",
					'Almost three decades later, Swiss mathematician Johann Rahn did the same trick with a different pair. His 1659 Teutsche Algebra took the obelus, a symbol earlier writers had used for subtraction, and repurposed it as ÷ for division. The same book introduced the three-dot triangle ∴ for "therefore" (its upside-down twin, ∵, later came to mean "because"). Historians still debate how much credit belongs to Rahn\'s collaborator John Pell, but no evidence favors Pell over Rahn as the inventor.',
				],
			},
			{
				heading: 'Where √ and ∞ actually come from',
				body: [
					'The square root sign √ is older than either of those textbooks: German mathematician Christoff Rudolff put it into print in 1525, in his algebra textbook Die Coss. Most historians trace its hooked shape to a stylized lowercase "r," standing for the Latin radix, meaning root. That specific theory is more "probable" than certain, though, since the symbol\'s earliest appearances look more like isolated dots than letters.',
					'The infinity symbol ∞ has a firmer origin: English mathematician John Wallis introduced it in his 1655 treatise De sectionibus conicis, using it to represent unbounded quantities. Wallis never explained the shape himself, but it\'s usually read as either a stylized Roman numeral for 1,000 or the Greek letter omega (ω), the final letter of that alphabet, which fits a symbol that means "without end."',
				],
			},
			{
				heading: 'How ≤ and ≥ got their line',
				body: [
					'The plain < and > signs for "less than" and "greater than" appeared in English mathematician Thomas Harriot\'s Artis Analyticae Praxis, published posthumously in 1631. It took another century for someone to combine them with equality: French mathematician and hydrographer Pierre Bouguer added a line underneath each symbol in 1734, giving math ≤ and ≥ as a single combined "or equal to" mark instead of writing out both cases separately.',
				],
			},
			{
				heading: 'Superscript exponents, and where the degree sign fits',
				body: [
					'Writing an exponent as a small raised number (x², x³) comes from René Descartes\'s 1637 La Géométrie, which introduced superscript notation to streamline algebra that had previously repeated a term out in full, like x·x for a square. Descartes\'s own habits lagged behind his invention: he usually still wrote "zz" instead of "z²" for a squared term, even in the same book that introduced the notation.',
					'The degree sign ° is older and comes from a different tradition entirely. Dividing a circle into 360 parts traces back to Babylonian base-60 astronomy, and the small raised circle for marking those parts became standard in European mathematical printing by the 17th century. It now does double duty for angles (45°) and for temperature scales (98.6°F), two uses that share nothing but the symbol.',
				],
			},
			{
				heading: 'How to type these symbols',
				body: [
					"Six of these symbols (± × ÷ ° ² ³) sit in the Latin-1 range, so on Windows you can hold Alt and type a four-digit decimal code on the numpad: Alt+0177 for ±, Alt+0215 for ×, Alt+0247 for ÷, Alt+0176 for °, Alt+0178 for ², Alt+0179 for ³. The other six (≥ ≤ ≈ √ ∞ ∴) live outside that range and don't have a numpad shortcut.",
					'For any of the 12, typing the hex Unicode code point from the table below and then pressing Alt+X works in Microsoft Word (for ∞, that\'s typing 221E and pressing Alt+X). On any other device, this tool\'s copy button skips the code point entirely: search, click, paste.',
				],
			},
		],
		referenceTables: [
			{
				title: 'The 12 symbols',
				headers: ['Symbol', 'Name', 'Meaning', 'Unicode', 'Common use'],
				rows: MATH_SYMBOLS.map((s) => [s.symbol, s.name, s.meaning, s.codePoint, s.commonUse]),
			},
		],
		faq: [
			{
				question: 'What is the plus-minus symbol used for?',
				answer:
					'± (U+00B1) means "plus or minus": two possible values, one found by adding and one by subtracting. It shows up in margins of error, engineering tolerances, and the quadratic formula, where it produces both roots of an equation at once. Search "plus minus" above to find and copy it.',
			},
			{
				question: 'What is the infinity symbol?',
				answer:
					'∞ (U+221E) represents an unbounded, never-ending quantity. English mathematician John Wallis introduced it in 1655; the horizontal figure-eight shape is usually explained as a stylized Roman numeral for 1,000 or the Greek letter omega. Search "infinity" above to find and copy it.',
			},
			{
				question: 'What is the square root symbol called, and where did it come from?',
				answer:
					'√ (U+221A) is called the radical sign. Christoff Rudolff put it into print in 1525; most historians trace its hooked shape to a stylized lowercase "r" for the Latin radix, meaning root. Search "square root" above to find and copy it.',
			},
			{
				question: 'Why do ≤ and ≥ have a line under them?',
				answer:
					'The plain < and > signs date to 1631. In 1734, French mathematician Pierre Bouguer added an underline to each one to create a single combined symbol meaning "or equal to," instead of writing out "less than, or equal to" as two separate comparisons.',
			},
			{
				question: 'What is the difference between × and a lowercase x?',
				answer:
					'× (U+00D7) is a dedicated multiplication symbol, distinct from the letter x. William Oughtred introduced × specifically so multiplication would not be confused with a variable named x, a mix-up that only gets worse once algebra starts using x, y, and z for unknowns.',
			},
			{
				question: 'Why is ÷ called an obelus, and why do some countries not use it for division?',
				answer:
					"The ÷ symbol is a repurposed obelus, a mark earlier writers used for subtraction before Johann Rahn assigned it to division in 1659. Division notation was never fully standardized worldwide: many countries outside the US and UK write division with a colon (a : b) or a fraction slash instead.",
			},
			{
				question: 'How do I type a math symbol like ∞ or ≤ on my keyboard?',
				answer:
					'In Microsoft Word, type the hex Unicode code point (for example, 2264 for ≤) and press Alt+X to convert it to the character. For a one-off symbol on any device, search for it above and click to copy.',
			},
			{
				question: 'Is the degree symbol (°) the same whether it means angle or temperature?',
				answer:
					'Yes, it is the same Unicode character (U+00B0) either way. Only the letter that follows changes the meaning, as in 45° for an angle versus 98.6°F for a temperature. The symbol itself traces back to the Babylonian 360-part division of the circle.',
			},
		],
		sources: [
			{
				label: 'Wikipedia — "Clavis mathematicae" (Oughtred, 1631; introduced × and ±)',
				url: 'https://en.wikipedia.org/wiki/Clavis_mathematicae',
			},
			{
				label: 'MacTutor History of Mathematics (University of St Andrews) — "Earliest Uses of Symbols of Operation"',
				url: 'https://mathshistory.st-andrews.ac.uk/Miller/mathsym/operation/',
			},
			{
				label: 'Wikipedia — "Division sign" (Rahn, Teutsche Algebra, 1659)',
				url: 'https://en.wikipedia.org/wiki/Division_sign',
			},
			{
				label: 'Wikipedia — "Therefore sign" (Rahn, 1659; ∴ and ∵)',
				url: 'https://en.wikipedia.org/wiki/Therefore_sign',
			},
			{
				label: 'MacTutor History of Mathematics (University of St Andrews) — "Earliest Uses of Symbols of Relation" (Harriot 1631; Bouguer 1734)',
				url: 'https://mathshistory.st-andrews.ac.uk/Miller/mathsym/relation/',
			},
			{
				label: 'Wikipedia — "John Wallis" (introduced ∞, 1655)',
				url: 'https://en.wikipedia.org/wiki/John_Wallis',
			},
			{
				label: 'Encyclopaedia Britannica — "Infinity | Definition, Symbol, Types, & Facts"',
				url: 'https://www.britannica.com/science/infinity-mathematics',
			},
			{
				label: 'MacTutor History of Mathematics (University of St Andrews) — Biography of Christoff Rudolff (√ symbol, 1525)',
				url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Rudolff/',
			},
			{
				label: 'Stanford Encyclopedia of Philosophy — "Descartes\' Mathematics" (superscript exponent notation, 1637)',
				url: 'https://plato.stanford.edu/entries/descartes-mathematics/',
			},
			{
				label: 'Unicode Consortium — "Latin-1 Supplement" code chart (U+0080–U+00FF)',
				url: 'https://www.unicode.org/charts/PDF/U0080.pdf',
			},
			{
				label: 'Unicode Consortium — "Mathematical Operators" code chart (U+2200–U+22FF)',
				url: 'https://www.unicode.org/charts/PDF/U2200.pdf',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'minecraft-circle-generator',
		category: 'Games',
		title: 'Minecraft Circle Generator',
		shortTitle: 'Circle Generator',
		description:
			'Pick a radius from 1 to 30 and get a pixel-perfect block grid for a Minecraft circle, filled or outline, plus a row-by-row list of how many blocks go in each row and where.',
		updated: '2026-08-13',
		published: '2026-08-13',
		coreSummary:
			'A block belongs in the circle when the straight-line distance from its center to the true center is at most the radius: sqrt(row² + col²) ≤ radius. Because Minecraft blocks are a grid, a radius of r always produces an odd diameter of 2r + 1 blocks, giving the shape one true center block instead of splitting it across four. Outline mode keeps only blocks that touch at least one empty neighbor, leaving a one-block-thick ring instead of a solid disc.',
		queries: [
			'minecraft circle generator',
			'minecraft circle chart',
			'how to build a circle in minecraft',
			'pixel circle generator',
			'minecraft circle blueprint',
		],
		sections: [
			{
				heading: 'How a block ends up inside the circle',
				body: [
					'The generator lays a grid over the radius you enter, with one block sitting dead center. For every other block, it measures the straight-line distance from that block\'s center to the true center using the Pythagorean theorem: distance = sqrt(row² + col²), where row and col are how many blocks over and up/down that block sits from the middle. If that distance is at most the radius, the block is part of the circle.',
					"This is the same rule the Minecraft-building community has used since Jesse Donat published the original Pixel Circle / Oval Generator at Donat Studios in 2012. He built it because he couldn't find a decent chart or generator for variable-size Minecraft circles at the time, and most later circle tools in this niche copy his approach. It's a simpler cousin of the incremental digital-circle-rasterization techniques computer graphics has used for decades to draw circles on pixel grids; the underlying goal is the same either way, approximating a smooth circle on a grid that only has square cells to work with.",
					'One consequence of measuring from block centers: the diameter always comes out odd, equal to 2 × radius + 1. A radius of 5 gives an 11×11 footprint, not 10×10, because an even-width grid has no single center block: the middle would fall between four blocks instead of on one.',
				],
			},
			{
				heading: 'Filled vs. outline, worked through radius 5',
				body: [
					'In filled mode, every block within the radius gets placed, which is what you want for a solid floor or platform. Take the block 3 over and 4 up from center: distance = sqrt(3² + 4²) = sqrt(25) = 5, exactly equal to the radius, so it is included. The block 4 over and 4 up sits at distance sqrt(32) ≈ 5.66, past the radius, so it is left out.',
					'Outline mode starts from that same filled disc, then drops any block whose four orthogonal neighbors (up, down, left, right) are all also filled. Those are interior blocks with nothing to hollow out around them. What is left is a one-block-thick ring, meant for walls, towers, or a rim around a pond rather than a solid fill.',
					'At very small radii the outline rule can look odd rather than round. At radius 1 the circle is just a five-block plus sign, and the single center block is fully boxed in by its four neighbors, so outline mode drops it, leaving four separate arm blocks with a gap in the middle. That is the rule working as intended: a plus sign that small has no interior left to hollow out, not a bug in the generator.',
				],
			},
			{
				heading: 'Using the row list to build it',
				body: [
					'The row breakdown below the grid lists, for every row from top to bottom, how many blocks that row needs and which columns they span, both counted as offsets from the center (row 0, column 0). A positive row offset means below center, negative means above; the same goes for columns, left and right. The "Copy build schematic" button grabs the whole list as plain text so you can paste it next to your build.',
					'For a filled circle the row spans are contiguous: "columns -3 to 3" means every block from -3 through 3 in that row. For an outline circle a row can have two separate stretches (the left and right edges of the ring), and the tool still reports one combined leftmost-to-rightmost span plus the total block count for that row, so check the count against the span width if the row has a gap in the middle.',
				],
			},
		],
		referenceTables: [
			{
				title: 'Common radius sizes',
				headers: ['Radius', 'Diameter', 'Filled blocks', 'Outline blocks'],
				rows: [
					['5', '11', '81', '28'],
					['8', '17', '197', '44'],
					['10', '21', '317', '56'],
					['15', '31', '709', '84'],
					['20', '41', '1,257', '112'],
					['30', '61', '2,821', '168'],
				],
				note: 'Counts come from applying the distance rule above to every block in the grid, independently verified with a Python script rather than read off the live tool.',
			},
		],
		faq: [
			{
				question: 'What does "radius" mean in this generator?',
				answer:
					'The distance in blocks from the center block outward to the edge, not counting the center block itself. A radius of 8 gives a 17×17 grid: the center block plus 8 blocks in every direction.',
			},
			{
				question: 'Why is the diameter always an odd number?',
				answer:
					'Because the grid is built around one true center block. Diameter = 2 × radius + 1, which is always odd. An even-width grid would have no single center block: the middle would fall on the seam between four blocks instead.',
			},
			{
				question: "What's the difference between filled and outline mode?",
				answer:
					'Filled places every block within the radius, for a solid floor or platform. Outline keeps only the blocks on the surface of that shape (anything with all four orthogonal neighbors also filled gets dropped) for a hollow ring to use as a wall or rim.',
			},
			{
				question: 'Why does the radius-1 outline circle have a gap in the middle?',
				answer:
					"At radius 1 the filled shape is a five-block plus sign, and the center block's four neighbors are all filled, so the surface rule drops it. What's left is four blocks that only touch at the corners, with a visible gap on each side. That's the rule behaving correctly on a shape too small to have anything to hollow out. The silhouette still gets more circular as the radius grows, reading as a diamond at radius 2 and rounder from there, even though individual outline blocks generally touch corner-to-corner rather than edge-to-edge at any radius, not just at radius 1.",
			},
			{
				question: 'How do I actually build the circle in-game?',
				answer:
					'Read the row list from top to bottom (or bottom to top), and for each row place blocks across the column span it lists, counting outward from wherever you decide your center block is. The copy button grabs the full list as plain text.',
			},
			{
				question: 'What is the largest circle this tool can generate?',
				answer:
					'Radius 30, a 61×61 grid with up to 2,821 blocks in filled mode. That covers most arena floors and tower bases; bigger domes are usually assembled from repeated or scaled-up sections rather than one single circle.',
			},
		],
		sources: [
			{
				label: 'Donat Studios — "Pixel Circle / Oval Generator (Minecraft)" (the 2012 tool that established the radius/diameter convention and distance-based fill rule this niche still uses)',
				url: 'https://donatstudios.com/PixelCircleGenerator',
			},
			{
				label: 'Wikipedia — "Midpoint circle algorithm" (general mathematical background on rasterizing circles onto a grid)',
				url: 'https://en.wikipedia.org/wiki/Midpoint_circle_algorithm',
			},
		],
		embedHeight: 1050,
	},
	{
		slug: 'board-foot-calculator',
		category: 'Construction',
		title: 'Board Foot Calculator',
		shortTitle: 'Board Foot Calculator',
		description:
			'Work out board feet for lumber from actual thickness, width, and length, with a rough-sawn quarter-thickness shortcut, waste allowance, and cost estimate.',
		updated: '2026-08-13',
		published: '2026-08-13',
		coreSummary:
			'Board feet is the standard volume unit for sawed lumber: board feet = (thickness in inches x width in inches x length in feet) / 12, since one board foot equals 144 cubic inches (a 1"x12"x12" block). The formula needs the piece\'s actual measured dimensions, not the nominal size on the price tag. A rough-sawn "4/4" board is nominally 1 inch thick, but a surfaced one is usually thinner once the mill planes it smooth.',
		queries: [
			'board foot calculator',
			'board footage calculator',
			'how to calculate board feet',
			'lumber board foot formula',
			'4/4 lumber calculator',
		],
		sections: [
			{
				heading: 'The board-foot formula, and why lumber isn\'t priced like plywood',
				body: [
					'A board foot is a volume, not a length: one piece of wood measuring 1 inch thick by 12 inches wide by 12 inches long, equal to 144 cubic inches. For sawed lumber, the University of Wisconsin-Madison\'s Division of Extension forestry program gives the working formula: board feet = (thickness in inches × width in inches × length in feet) / 12. Plug in a piece\'s actual thickness and width in inches and its length in feet, and the /12 converts the length term so the whole thing comes out in cubic-foot-sized units instead of cubic inches.',
					'Framing lumber (2x4s, 2x6s) skips this entirely because it\'s milled to standardized sizes under the American Softwood Lumber Standard (Voluntary Product Standard PS 20, administered by NIST) and sold by the piece or the linear foot: every stud is the same cross-section, so there\'s nothing to normalize. Hardwood and specialty lumber come in random widths and odd lengths off the saw, so board feet gives buyer and seller a volume-based price that works no matter how wide or long any individual board happens to be.',
				],
			},
			{
				heading: 'Worked examples: a hobby board and a table-top order',
				body: [
					'A single rough 1"×6"×8\' pine board: board feet = (1 × 6 × 8) / 12 = 4 board feet. At $6.50 per board foot that one board runs 4 × $6.50 = $26.00.',
					'A woodworker orders six pieces of 8/4 walnut (2 inches actual thickness), each 8 inches wide and 6 feet long, for a table build. Per piece: (2 × 8 × 6) / 12 = 8 board feet. Six pieces: 6 × 8 = 48 board feet. Add a 10% allowance for knots, checks, and cutting waste: 48 × 1.10 = 52.8 board feet. At $9.25 per board foot: 52.8 × $9.25 = $488.40.',
				],
			},
			{
				heading: 'Nominal quarters vs. what you should actually measure',
				body: [
					'Rough-sawn hardwood is traded in "quarters," a National Hardwood Lumber Association convention where the number of quarter-inches gives the nominal thickness: 4/4 is 1 inch, 5/4 is 1.25 inches, 8/4 is 2 inches, and so on. That works directly as a thickness input when a board is still rough off the saw, before any surfacing.',
					"Once a board is surfaced (S2S or S4S), the mill has planed material off both faces, and how much varies by supplier. Retailers describe results anywhere from about an eighth to a quarter inch under nominal for 4/4 stock, and it isn't the same number everywhere. Rather than guess, measure the board with calipers and enter that actual thickness; the quarter buttons on this calculator are a rough-lumber shortcut, not a substitute for measuring surfaced stock.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Board feet for common actual sizes',
				headers: ['Thickness x width x length', 'Board feet'],
				rows: [
					['1" x 4" x 8\'', '2.67'],
					['1" x 6" x 8\'', '4.00'],
					['1" x 8" x 8\'', '5.33'],
					['1" x 10" x 8\'', '6.67'],
					['1" x 12" x 8\'', '8.00'],
					['2" x 4" x 8\'', '5.33'],
					['2" x 6" x 8\'', '8.00'],
					['2" x 8" x 10\'', '13.33'],
					['2" x 10" x 12\'', '20.00'],
					['2" x 12" x 16\'', '32.00'],
				],
				note: 'Computed directly from (thickness × width × length) / 12 using actual dimensions, not nominal.',
			},
		],
		faq: [
			{
				question: 'What is a board foot?',
				answer:
					'A unit of lumber volume: a piece 1 inch thick, 12 inches wide, and 12 inches long, equal to 144 cubic inches. Any board\'s footage is (thickness in. × width in. × length ft.) / 12, regardless of its actual shape.',
			},
			{
				question: 'Is a board foot the same as a linear foot or square foot?',
				answer:
					'No. A linear foot only measures length, ignoring thickness and width entirely. A square foot measures area (width × length) with no thickness term. Board feet is a volume, which is why it\'s the unit lumber yards use to price boards that vary in both thickness and width.',
			},
			{
				question: 'Do I use nominal or actual dimensions in the formula?',
				answer:
					'Actual, measured dimensions. Nominal sizes (like "4/4" or a framing "2x4") describe the board before milling or as a trade label, not what you\'re holding. Measure thickness and width with calipers or a tape measure and enter those numbers.',
			},
			{
				question: 'How much waste should I add for defects and cutting?',
				answer:
					'There\'s no single official figure. It depends on the wood\'s grade and how many joints, knots, or checks you\'re cutting around. Shop rules of thumb commonly range from about 10% for clean, straight stock to 20%+ for highly figured or lower-grade material. Add whatever allowance your supplier or project plan calls for in the waste field.',
			},
			{
				question: 'Why is hardwood priced by the board foot but a 2x4 isn\'t?',
				answer:
					'Softwood framing lumber (2x4s, 2x6s) is milled to standardized cross-sections under the American Softwood Lumber Standard (PS 20), so every stud of a given nominal size is priced the same way, by the piece or linear foot. Hardwood and specialty lumber come in random widths and lengths off the saw, so board feet gives a volume-based price that works regardless of any individual board\'s dimensions.',
			},
			{
				question: 'Can I use this for plywood or sheet goods?',
				answer:
					'Sheet goods are conventionally sold by the sheet or by square footage, not board feet, since their thickness is fixed and standardized (like 3/4" plywood). This calculator will still compute a mathematically correct board-foot figure if you enter a sheet\'s dimensions, but it isn\'t how sheet goods are normally priced.',
			},
		],
		sources: [
			{
				label: 'University of Wisconsin-Madison Division of Extension, Forestry, FEM-042 — "What Is A Board Foot?" (the sawed-lumber board-foot formula and definition)',
				url: 'https://forestry.extension.wisc.edu/files/2023/05/fem_042.pdf',
			},
			{
				label: 'Wikipedia — "Board foot" (definition and formula, for general corroboration)',
				url: 'https://en.wikipedia.org/wiki/Board_foot',
			},
			{
				label: 'NIST — DOC Voluntary Product Standard PS 20-20, "American Softwood Lumber Standard"',
				url: 'https://www.nist.gov/document/doc-ps-20-20-american-softwood-lumber-standard',
			},
			{
				label: 'Rockler — "What Does the Quarter System of Lumber Thickness Mean?"',
				url: 'https://www.rockler.com/learn/what-does-quarter-system-of-lumber-thickness-mean',
			},
		],
		embedHeight: 760,
	},
	{
		slug: 'random-letter-generator',
		category: 'Games',
		title: 'Random Letter Generator',
		shortTitle: 'Random Letter Generator',
		description:
			'Draw 1 to 20 random letters from A to Z, vowels only, or consonants only, either with an equal chance per letter or weighted by real English letter frequency.',
		updated: '2026-08-16',
		published: '2026-08-16',
		coreSummary:
			'Each draw is an independent weighted random pick: with equal weighting every letter in the chosen set has the same odds; with English-frequency weighting, a letter\'s odds match how often it actually appears in English text (e at 12.7%, versus z at 0.074%), so common letters like e, t, and a come up far more than q, x, or z. Draws are made with replacement, the same way rolling a die twice gives two independent results, so the same letter can appear more than once in one batch.',
		queries: [
			'random letter generator',
			'random letter picker',
			'pick a random letter',
			'random vowel generator',
			'random consonant generator',
		],
		sections: [
			{
				heading: 'How the generator picks a letter',
				body: [
					'Every draw uses the cumulative-weight method: each letter in the active set (all 26, vowels only, or consonants only) gets a weight, the weights are normalized so they sum to 1, and a single random number decides which letter\'s slice of that 0-to-1 range gets hit. Under "Equal chance," every letter in the set gets the same weight, so a draw from all 26 letters gives each one exactly 1/26 ≈ 3.8% odds.',
					'Under "English frequency," each letter\'s weight comes from how often it actually shows up in English writing, not an equal split. The letter e carries about 12.7% of the weight on its own, roughly 3.3 times its 3.8% equal-chance odds, while z sits at just 0.074%, about 52 times rarer than an equal draw would make it and over 170 times rarer than e under this same weighting. This is the same fitness-proportionate ("roulette wheel") sampling method used by this site\'s Yes/No decision wheel, just applied to 26 (or fewer, in the vowels/consonants sets) letters instead of 2 or 3 outcomes.',
				],
			},
			{
				heading: 'Worked examples: turning the weights into real odds',
				body: [
					'All 26 letters, equal chance: the 5 vowels (a, e, i, o, u) make up 5/26 ≈ 19.2% of the set, so a single draw lands on a vowel about 1 time in 5. Across 3 independent draws, the chance of getting at least one vowel is 1 minus the chance of missing every time: 1 − (21/26)³ = 1 − 0.527 ≈ 47.3%.',
					'All 26 letters, English-frequency weighted: the same 5 vowels carry a combined 38.1% of the weight (their frequencies add to roughly 38.2% of the table below, which itself sums to about 100.15% due to independent rounding in the source), about double their 19.2% equal-chance share, because e, a, i, and o are all individually common letters. A single frequency-weighted draw is close to a coin flip between "vowel" and "consonant," even though vowels are only 5 of the 26 letters on the keyboard.',
				],
			},
			{
				heading: 'Why offer vowels-only, consonants-only, and two weighting modes',
				body: [
					'Word games are the main reason to restrict the letter set: picking a target letter for a name game, generating consonant clusters for a made-up word, or drilling vowel sounds for early readers all call for one subset or the other, not the full alphabet.',
					'The two weighting modes serve different purposes. Equal chance is the right default for anything where fairness matters, like a random pick for "who goes first," a coin-flip-style tiebreaker, or a classroom name-a-letter drill. English-frequency weighting is closer to how words in Scrabble, hangman, or Wordle actually behave, since it mirrors which letters are genuinely likelier to appear in a real English word rather than a mathematically fair coin toss between 26 equally weighted options.',
				],
			},
		],
		referenceTables: [
			{
				title: 'English letter frequency (Wikipedia "Letter frequency," Texts column)',
				headers: ['Letter', 'Frequency', 'Letter', 'Frequency'],
				rows: [
					['E', '12.7%', 'N', '6.7%'],
					['T', '9.1%', 'S', '6.3%'],
					['A', '8.2%', 'H', '6.1%'],
					['O', '7.5%', 'R', '6.0%'],
					['I', '7.0%', 'D', '4.3%'],
					['L', '4.0%', 'C', '2.8%'],
					['U', '2.8%', 'M', '2.4%'],
					['W', '2.4%', 'F', '2.2%'],
					['G', '2.0%', 'Y', '2.0%'],
					['P', '1.9%', 'B', '1.5%'],
					['V', '0.98%', 'K', '0.77%'],
					['J', '0.16%', 'X', '0.15%'],
					['Q', '0.12%', 'Z', '0.074%'],
				],
				note: 'This is the weighting used by the "English frequency" mode above. Percentages are Wikipedia\'s reported figures and sum to about 100.15% due to independent rounding at the source; a second corpus-based table (Cornell\'s Math Explorers\' Club, 40,000-word sample) agrees on the top 7 letters and most percentages, though the two sources rank a few letters differently further down the alphabet (for example, Wikipedia has h just ahead of r, Cornell has r just ahead of h).',
			},
		],
		faq: [
			{
				question: 'How does this generator decide which letter to pick?',
				answer:
					'It normalizes the weights of every letter in the active set so they sum to 1, then draws one random number and finds which letter\'s slice of that range it falls into (the cumulative-weight, or "roulette wheel," sampling method). Under equal chance every letter\'s slice is the same size; under English frequency the slices are sized by how often each letter appears in English text.',
			},
			{
				question: 'What\'s the difference between "Equal chance" and "English frequency"?',
				answer:
					'Equal chance gives every letter in the set identical odds, for example 1/26 ≈ 3.8% each across the full alphabet. English frequency instead weights each letter by how often it shows up in real English writing, so e (about 12.7%) comes up roughly 3.3 times more often than under equal chance, while rare letters like q and z come up far less.',
			},
			{
				question: 'Can the same letter come up more than once in one batch?',
				answer:
					'Yes. Each letter in a batch is drawn independently, the same way rolling a die twice can land on the same number twice. It does not remove a letter from the pool once it\'s been drawn, so a run of 5 letters could include the same letter two or three times.',
			},
			{
				question: 'Why would I restrict the draw to vowels or consonants only?',
				answer:
					'Word games and language drills often call for one subset specifically, like picking consonant clusters for a made-up word, choosing a vowel sound for an early-reading exercise, or narrowing a name-picking game to consonant-only initials.',
			},
			{
				question: 'What is a random letter generator actually used for?',
				answer:
					'Common uses include picking a starting letter for word games like hangman, Scrabble tile practice, or category games ("name a fruit that starts with…"), classroom random-call drills, and icebreaker or naming exercises where any letter needs to come up fairly.',
			},
			{
				question: 'Where does the English letter frequency data come from?',
				answer:
					'The Texts column of Wikipedia\'s "Letter frequency" article, cross-checked against Cornell University\'s Math Explorers\' Club frequency table (based on a 40,000-word English sample). The two agree on the 7 most common letters (e, t, a, o, i, n, s) and on most individual percentages, with some reordering further down the alphabet between sources.',
			},
		],
		sources: [
			{
				label: 'Wikipedia — "Letter frequency" (Texts column: relative frequency of each letter in English)',
				url: 'https://en.wikipedia.org/wiki/Letter_frequency',
			},
			{
				label: 'Cornell University, Math Explorers\' Club — "Frequency Table" (40,000-word English corpus, corroborating source)',
				url: 'https://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html',
			},
		],
		embedHeight: 820,
	},
	{
		slug: 'calligraphy-alphabet',
		category: 'Reference',
		title: 'Calligraphy Alphabet',
		shortTitle: 'Calligraphy Alphabet',
		description:
			'Preview any word or all 52 letters in three real calligraphy traditions (Blackletter, Chancery Italic, and Modern Brush) and learn what actually separates one from another.',
		updated: '2026-08-16',
		published: '2026-08-16',
		coreSummary:
			'"Calligraphy alphabet" is not one alphabet. It covers several unrelated lettering traditions from different centuries and different parts of the world. This tool previews three of them: Blackletter (the dense, angular Gothic book hand behind Gutenberg\'s 1450s printing type), Chancery Italic (the slanted, oval Renaissance hand used in 16th- and 17th-century Italian chancery offices), and Modern Brush script (a freehand, pointed-pen style from the recent brush-lettering revival, with no fixed standard alphabet). Type a word to preview it in any of the three, or browse the full A–Z chart below.',
		queries: [
			'calligraphy alphabet',
			'calligraphy letters',
			'calligraphy alphabet chart',
			'calligraphy fonts alphabet',
			'how to write in calligraphy',
			'blackletter alphabet',
			'chancery script',
		],
		sections: [
			{
				heading: 'How to use this tool',
				body: [
					'Pick a style (Blackletter, Chancery Italic, or Modern Brush), then type a word, name, or short phrase into the box to preview it instantly. The full alphabet chart underneath shows every uppercase and lowercase letter in that same style, each one labeled with its ordinary print letter so it\'s easy to match up.',
					"None of the three fonts invents its letterforms from scratch: UnifrakturMaguntia digitizes a documented 1901 Fraktur typeface, Tangerine draws on historical Italian chancery hands, and Alex Brush is one specific artist's take on brush lettering, so what shows up here is closer to a historical specimen than a generic script font.",
					"What this tool cannot do is teach the handwriting itself. A display font has no nib angle, no pressure changes, and no stroke order, so anyone actually learning to write Blackletter, Chancery Italic, or brush calligraphy by hand needs a pen diagram or a demonstration video, not this page.",
				],
			},
			{
				heading: 'There is no single "calligraphy alphabet"',
				body: [
					"Unlike the Latin alphabet itself, calligraphy doesn't have one standard letterform set. It's an umbrella term for hand-lettering traditions that developed independently, centuries or even a thousand years apart, for different practical reasons: copying books before printing existed, writing fast and legibly in a Renaissance office, engraving elegant handwriting samples for 18th-century copybooks, or just looking striking on a wedding invitation today. A chart built for one tradition (say, Blackletter) shares almost nothing with a chart built for another (say, modern brush lettering) beyond both being called \"calligraphy.\"",
					"That's why this tool offers three distinct styles instead of one: picking a single font and calling it \"the\" calligraphy alphabet would misrepresent how varied the category actually is.",
				],
			},
			{
				heading: 'Blackletter: from medieval book hands to Gutenberg\'s printing press',
				body: [
					'Blackletter, also called Gothic script, developed in northwestern Europe in the 12th century as a more compressed, angular evolution of the earlier Carolingian minuscule hand, driven partly by the cost of parchment: tighter, narrower letters fit more text on an expensive page. Scribes held a broad-nibbed quill nearly perpendicular to the writing line, which produced the thick, uniform, "broken" strokes the style is known for. The most formal, calligraphic version of blackletter, called textualis or textura, became the standard book hand across much of medieval Europe.',
					"Blackletter's best-known appearance came a few centuries later: when Johannes Gutenberg built his printing press in the 1440s and produced the Gutenberg Bible by the mid-1450s, he cut metal type modeled directly on textura, because that was the handwriting style readers already recognized as a proper book. In the early 16th century, Holy Roman Emperor Maximilian I commissioned a new, more ornamented blackletter design, drawn by Hieronymus Andreae, for a set of imperial works including the Triumphal Arch woodcut and his own 1513 prayer book (Gebetbuch). That design became known as Fraktur, and it went on to dominate German-language printing for roughly the next four hundred years.",
				],
			},
			{
				heading: 'Chancery Italic: a Renaissance hand built for speed',
				body: [
					"Chancery Italic descends from the italic hands used in Italian chancery offices (government and papal writing bureaus) during the 16th and 17th centuries. Writing masters of the period pushed the style toward faster, more practical letterforms: in his 1579 manual Il perfetto cancellaresco corsivo (\"The Perfect Cursive Chancery\"), Vatican scribe Giovanni Francesco Cresci criticized earlier chancery models as too slow to write and proposed a steeper-sloped, narrower-nibbed hand better suited to everyday correspondence and bookkeeping, a different goal from blackletter's slow, formal book-copying purpose. The tall ascenders and open, rhythmic letter spacing typical of chancery hands are a direct result of that speed-and-legibility design.",
					"This tool's Chancery Italic style uses the open-license font Tangerine, released through Google Fonts in 2010, which is itself modeled on those 16th- and 17th-century Italian chancery hands rather than on any single historical exemplar.",
				],
			},
			{
				heading: 'Modern Brush calligraphy has no fixed alphabet',
				body: [
					"Modern brush (or pointed-pen) calligraphy is the newest of the three styles here, part of a lettering revival that picked up through the 2010s alongside social media and hand-lettered wedding stationery. Structurally, it's freehand pointed-pen or brush-pen cursive: thick downstrokes from pressing the brush or flexible nib, thin upstrokes from releasing pressure, similar in principle to how a pointed Copperplate pen worked, but without Copperplate's engraved, standardized exemplars behind it.",
					"That's the key difference from the other two styles on this page: Blackletter and Chancery Italic both trace back to specific historical teaching hands with identifiable letterforms, while modern brush calligraphy is explicitly shaped by whoever is writing it. There's no single authoritative brush-calligraphy alphabet the way there's a recognizable textura or chancery hand: every practitioner's version looks a little different, and the font used here (Alex Brush, released in 2011) is one designer's take on the style, not a definitive standard.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Three calligraphy traditions compared',
				headers: ['Style', 'Era & origin', 'Defining trait'],
				rows: [
					[
						'Blackletter',
						'Textualis: 12th-century northwestern Europe. Fraktur: commissioned early 16th century under Emperor Maximilian I, first used for his 1513 prayer book',
						'Dense, angular "broken" strokes from a broad-nib quill held nearly perpendicular to the page',
					],
					[
						'Chancery Italic',
						'16th- and 17th-century Italian chancery (government/papal) offices',
						'Slanted, oval letterforms designed for writing official correspondence quickly and legibly',
					],
					[
						'Modern Brush',
						'Lettering revival, roughly 2010s to present',
						'Freehand pointed-pen or brush strokes with no single fixed standard; shaped by the individual writer',
					],
				],
				note: 'This table covers the three styles rendered in this tool, not every calligraphy tradition. Copperplate (the engraved, thick-and-thin script based on English Round Hand, developed from the 1660s and popularized in copybooks through the 1700s) is a related but distinct tradition not previewed here; see the FAQ below.',
			},
		],
		faq: [
			{
				question: 'What is a calligraphy alphabet?',
				answer:
					'It\'s a catch-all term for any alphabet chart drawn in a decorative hand-lettering style, but there is no single calligraphy alphabet: it covers several unrelated traditions (Blackletter, Chancery Italic, Copperplate, modern brush lettering, and others) that developed independently, sometimes centuries apart. This tool previews three of the most distinct ones: Blackletter, Chancery Italic, and Modern Brush.',
			},
			{
				question: "What's the difference between calligraphy and cursive?",
				answer:
					"Cursive, in the everyday US sense, refers to the joined-up handwriting taught in American schools, following one of a handful of teaching programs like Palmer or Zaner-Bloser. Calligraphy is a broader umbrella covering multiple decorative lettering traditions that developed independently, for different purposes: Blackletter was a slow, formal book hand built for durability rather than speed, while Chancery Italic was deliberately reworked in the 16th century to be fast enough for everyday correspondence. Both predate American cursive by centuries.",
			},
			{
				question: 'What is Blackletter script?',
				answer:
					'Blackletter (also called Gothic script) is the dense, angular medieval book hand that developed in northwestern Europe starting in the 12th century. Its most formal form, textura, is the handwriting style Johannes Gutenberg modeled his printing type on for the Gutenberg Bible in the mid-1450s. Fraktur, a more ornamented blackletter variant, followed in the early 16th century and dominated German-language printing for centuries.',
			},
			{
				question: 'What is Copperplate calligraphy?',
				answer:
					"Copperplate is a slanted, thick-and-thin script based on Round Hand, a style of English handwriting that writing masters John Ayres and William Banson developed starting in the 1660s. It gets the name \"Copperplate\" from copybooks like George Bickham the Elder's The Universal Penman (published in parts between 1733 and 1741) that reproduced model handwriting by engraving it onto copper printing plates. Copperplate isn't one of the three styles rendered in this tool, but it's the tradition most people picture when they think of formal wedding-invitation-style script.",
			},
			{
				question: 'Is there one official calligraphy alphabet I should learn?',
				answer:
					"No. Which style is worth learning depends on what you're doing with it: Blackletter for a medieval or Gothic-themed project, Chancery Italic for a classic formal-document look, Copperplate or modern brush for wedding stationery and hand lettering. They use different tools and different letterforms, so picking a style before practicing matters more than finding a single \"correct\" calligraphy alphabet.",
			},
			{
				question: 'What tools do real calligraphers use, versus this preview?',
				answer:
					"This tool renders letters in a display font on screen, not real ink strokes. Blackletter and Chancery Italic are traditionally written with a broad-nib (chisel-edge) pen held at a fairly consistent angle, which naturally produces their thick and thin strokes. Copperplate and modern brush calligraphy instead use a flexible pointed pen or a brush, where the thick/thin contrast comes from how much pressure the writer applies, not the nib's fixed shape.",
			},
		],
		sources: [
			{
				label: 'Wikipedia — "Blackletter" (12th-century origin, textualis/textura, and Gutenberg\'s use of the style for printing type)',
				url: 'https://en.wikipedia.org/wiki/Blackletter',
			},
			{
				label: 'Wikipedia — "Fraktur" (Emperor Maximilian I\'s early-16th-century commission, designer Hieronymus Andreae, and the 1513 prayer book)',
				url: 'https://en.wikipedia.org/wiki/Fraktur',
			},
			{
				label: 'Wikipedia — "Round hand" (Round Hand developed in England in the 1660s by writing masters John Ayres and William Banson)',
				url: 'https://en.wikipedia.org/wiki/Round_hand',
			},
			{
				label: 'Wikipedia — "Copperplate script" (the "Copperplate" name comes from copybooks reproduced by engraving onto copper plates)',
				url: 'https://en.wikipedia.org/wiki/Copperplate_script',
			},
			{
				label: 'Wikipedia — "George Bickham the Elder" (The Universal Penman, published 1733–1741, and its role popularizing Round Hand)',
				url: 'https://en.wikipedia.org/wiki/George_Bickham_the_Elder',
			},
			{
				label: 'Internet Archive — Giovanni Francesco Cresci, "Il perfetto cancellaresco corsivo" (1579), the manual that introduced a faster, steeper chancery cursive for everyday correspondence',
				url: 'https://archive.org/details/ilperfettocancel00cres',
			},
			{
				label: 'Google Fonts (google/fonts repository) — "Tangerine" description (inspired by 16th- and 17th-century Italian chancery hands; designer Toshi Omagari)',
				url: 'https://github.com/google/fonts/blob/main/ofl/tangerine/DESCRIPTION.en_us.html',
			},
			{
				label: 'Google Fonts (google/fonts repository) — "Alex Brush" metadata (designer Robert Leuschke, added 2011)',
				url: 'https://github.com/google/fonts/blob/main/ofl/alexbrush/METADATA.pb',
			},
			{
				label: 'Google Fonts (google/fonts repository) — "UnifrakturMaguntia" description (based on Peter Wiegel\'s digitization of an 1901 Fraktur typeface by Carl Albert Fahrenwaldt, first published 2010)',
				url: 'https://github.com/google/fonts/blob/main/ofl/unifrakturmaguntia/DESCRIPTION.en_us.html',
			},
		],
		embedHeight: 1250,
	},
	{
		slug: 'asphalt-calculator',
		category: 'Construction',
		title: 'Asphalt Calculator',
		shortTitle: 'Asphalt Calculator',
		description:
			'Estimate tons of hot mix or recycled asphalt for a driveway, lot, or base repair from paved area and compacted depth, with an optional material cost estimate.',
		updated: '2026-08-17',
		published: '2026-08-17',
		coreSummary:
			'Asphalt is ordered by weight, not area, because plants batch and truck it by the ton. The formula: volume (length x width x compacted depth) converts to weight using the mix\'s density, then weight in pounds divides by 2,000 to get tons. This calculator defaults to 145 lb/ft³ for hot mix asphalt, the planning unit weight the Iowa DOT\'s Standard Specifications use, and 112 lb/ft³ for reclaimed asphalt pavement (RAP), near the midpoint of the compacted-density range FHWA documents for recycled material.',
		queries: [
			'asphalt calculator',
			'asphalt tonnage calculator',
			'how much asphalt do i need',
			'driveway asphalt calculator',
			'asphalt density lb per cubic foot',
		],
		sections: [
			{
				heading: 'Why asphalt is measured in tons, and how the tonnage formula works',
				body: [
					"Concrete and gravel are commonly ordered by volume (cubic yards), but asphalt plants batch and deliver hot mix by weight, so paving estimates need a weight figure, not just an area. The path there has three steps: find the volume (length x width x compacted depth, all in the same length unit), convert that volume to weight using the mix's density, then divide the weight in pounds by 2,000 to get short tons.",
					"The density term is doing the real work, and it isn't one fixed number. The Iowa Department of Transportation's Standard Specifications, Section 2303, use 145 lb/ft³ as the unit weight for converting hot-mix bid quantities to tons, and that figure sits inside the 142-148 lb/ft³ range the Asphalt Institute's Engineering FAQ gives for in-place asphalt mixture. Reclaimed asphalt pavement (RAP), asphalt milled up and reused typically as a base or shoulder material rather than a wearing surface, compacts to a lower density; FHWA's guideline on waste and byproduct materials in pavement construction documents a compacted range of 1,600-2,000 kg/m³, which is 100-125 lb/ft³. This calculator defaults to a figure near that range's midpoint, 112 lb/ft³, for RAP, and leaves a density field you can fill in yourself for anything else: cold patch, a blended base, or a supplier's lab-tested figure.",
				],
			},
			{
				heading: 'Two worked examples: a driveway overlay and a RAP base',
				body: [
					'A 24 ft by 12 ft driveway getting a 2 in hot-mix overlay: volume = 24 x 12 x (2/12) = 48 ft³. At 145 lb/ft³, that\'s 48 x 145 = 6,960 lb, or 3.48 tons before any waste allowance. Add a 5% allowance for compaction loss and truck-bed residue: 48 x 1.05 = 50.4 ft³, 50.4 x 145 = 7,308 lb, which is 3.654 tons; round up to whatever increment the supplier sells in, usually a half or quarter ton.',
					'A 150 ft by 40 ft gravel lot getting a 4 in RAP base repair: volume = 150 x 40 x (4/12) = 2,000 ft³. At the 112 lb/ft³ RAP default, that\'s 2,000 x 112 = 224,000 lb, exactly 112 tons. Because RAP\'s real density depends on how finely it was milled and how well it compacts on site, treat that 112-ton figure as a planning estimate and confirm against a delivered load ticket once the job starts, or enter a supplier-provided density in the custom field if one is available.',
				],
			},
			{
				heading: 'Picking a density: hot mix, RAP, or a custom figure',
				body: [
					"Use the hot mix preset for new pavement or an overlay: a driveway, parking lot, or road surface course. Use RAP for a base or sub-base layer built from milled, recycled asphalt rather than virgin mix; it's lighter per cubic foot than hot mix and is priced and sold differently (often by the ton at a lower rate, sometimes by the load). Neither preset covers bagged cold-patch material, since published cold-patch densities vary widely by product formulation and aren't consistently documented by a single standards body. That's what the custom density field is for. If a supplier or lab report gives you a specific unit weight, entering it directly will be more accurate than either preset.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Hot mix asphalt (145 lb/ft³): tons per 100 sq ft by compacted depth',
				headers: ['Compacted depth', 'Tons per 100 sq ft'],
				rows: [
					['1 in', '0.60'],
					['1.5 in', '0.91'],
					['2 in', '1.21'],
					['2.5 in', '1.51'],
					['3 in', '1.81'],
					['4 in', '2.42'],
				],
				note: 'Computed directly from (100 sq ft x depth in feet x 145 lb/ft³) / 2,000, before any waste allowance. Scale linearly for other areas.',
			},
		],
		faq: [
			{
				question: 'What density does this calculator use for hot mix asphalt?',
				answer:
					'145 lb/ft³ by default, the unit weight the Iowa DOT\'s Standard Specifications (Section 2303) use for converting hot-mix bid quantities to tons, which falls inside the 142-148 lb/ft³ in-place range published in the Asphalt Institute\'s Engineering FAQ. Real mixes vary within that range depending on aggregate type and air voids.',
			},
			{
				question: 'Why is asphalt priced by the ton instead of by area?',
				answer:
					"Asphalt plants mix and load material by weight, and delivery trucks are weighed at the scale house going out, so tonnage is what both the plant and the paving crew actually measure. Area and depth are how you plan the order; tons are how it gets billed.",
			},
			{
				question: 'What is RAP, and why does it use a different density?',
				answer:
					"RAP (reclaimed asphalt pavement) is old asphalt that's been milled up and reused, most often as base or shoulder material rather than a finished driving surface. It compacts less densely than fresh hot mix: FHWA documents a compacted range of 100-125 lb/ft³ for RAP, versus 142-148 lb/ft³ for hot mix, so using the hot-mix density on a RAP order would overstate the tonnage you need.",
			},
			{
				question: 'How much waste or compaction allowance should I add?',
				answer:
					"There's no single official figure; contractors commonly plan for roughly 5-10% to cover compaction loss, minor grade variation, and material left in the truck bed or on the ground after spreading. Tighter, well-graded jobs can run closer to 5%; irregular areas or a first-time crew often plan closer to 10%.",
			},
			{
				question: 'Does this calculator include the aggregate base layer?',
				answer:
					"No. This calculates the asphalt layer only. A driveway or lot typically sits on a separate compacted aggregate base (often 4-8 in of crushed stone), which is priced and ordered separately, usually by the cubic yard rather than by the ton.",
			},
			{
				question: 'Can I use this for patching a pothole?',
				answer:
					"You can, for the volume-to-weight math, but small patch jobs are usually bought in pre-bagged cold-patch units rather than bulk tons, and cold-patch density varies by product. Enter the patch's dimensions and use the custom density field with a figure from the product's packaging or data sheet, since neither the hot-mix nor RAP preset represents cold patch.",
			},
		],
		sources: [
			{
				label: 'Iowa Department of Transportation — Standard Specifications, Section 2303, "Hot Mix Asphalt Mixtures" (145 lb/ft³ unit weight for tonnage conversion)',
				url: 'https://ia.iowadot.gov/erl/current/gs/content/2303.htm',
			},
			{
				label: 'Asphalt Institute — Engineering FAQs (142-148 lb/ft³ in-place density range for asphalt mixture)',
				url: 'https://www.asphaltinstitute.org/engineering/frequently-asked-questions/asphalt-pavement-thickness-and-mix-design/',
			},
			{
				label: 'Federal Highway Administration — FHWA-RD-97-148, "User Guidelines for Waste and Byproduct Materials in Pavement Construction," Reclaimed Asphalt Pavement material description (100-125 lb/ft³ compacted density range)',
				url: 'https://www.fhwa.dot.gov/publications/research/infrastructure/pavements/97148/046.cfm',
			},
		],
		embedHeight: 820,
	},
	{
		slug: 'glitch-text-generator',
		category: 'Text Tools',
		title: 'Glitch Text Generator',
		shortTitle: 'Glitch Text Generator',
		description:
			'Turn plain text into glitched, "cursed" zalgo text by stacking random Unicode combining marks above, below, or through each letter, at four intensity levels, with a one-click copy.',
		updated: '2026-08-17',
		published: '2026-08-17',
		coreSummary:
			'Every visible character in your text gets a random batch of Unicode combining marks (U+0300 to U+036F) stacked above it, below it, or both, with the batch size drawn from a range set by the intensity you pick, from 0-2 marks per direction at Mild up to 10-18 at Extreme. Because those marks are ordinary Unicode characters riding on your original letters rather than an image or a custom font, the result copies and pastes as plain text into any app or field that can display Unicode.',
		queries: [
			'glitch text generator',
			'zalgo text generator',
			'cursed text generator',
			'glitch text copy and paste',
			'weird text generator',
		],
		sections: [
			{
				heading: 'How each character gets its marks',
				body: [
					"The generator walks through your text one character at a time. Spaces and line breaks are skipped, since there's no letter underneath them to attach a mark to; every other character gets its own independent roll. For each direction you have switched on (up, down, or both), it draws a random whole number from the range your chosen intensity sets, then picks that many marks, one at a time and with repeats allowed, from Unicode's Combining Diacritical Marks block. Up marks and down marks are drawn from separate pools, so a Medium-intensity, up-only pass and a Medium-intensity, down-only pass pull from the same range of counts but never share which specific marks land.",
					'Run the same word through it twice at the same settings and you\'ll get two different results: the ranges are fixed, but which count gets drawn inside that range, and which specific marks fill it, are both re-rolled every time. That\'s also what the Shuffle button does on purpose, it re-runs the same text through the same settings with a fresh set of rolls, without touching what you typed.',
					'Turning on both up and down marks (the "Up + down" option) also adds a third, smaller batch of strikethrough-style marks that cut through the letter itself rather than sitting above or below it, at roughly a third of the up/down count. Those come from a much smaller table (5 marks in the whole Unicode block fit this description), so they show up less often and read as an accent to the up/down stacking rather than the main effect.',
				],
			},
			{
				heading: 'Why it pastes as real text, not a font or an image',
				body: [
					'Combining marks are a normal part of Unicode, the same mechanism that puts the accent on café or the tilde on niño: a base letter followed by one or more marks that render attached to it. Zalgo or "glitch" text just uses far more of them per letter than any real-world language does, which is why it looks broken instead of merely accented. Because the output is still plain Unicode text (not a picture, not a font swap), you can select it, copy it, and paste it into a text field, chat app, or document, and it carries the same combining characters with it.',
					"How chaotic it actually looks depends partly on the app or font displaying it, not just on how many marks got attached. Some apps and websites cap how many combining marks they'll render stacked on one base character, whether for performance or specifically to blunt this effect, so the same Extreme-intensity output can look denser in one app than another even though the underlying text is identical. If you're aiming for a specific look in a specific place, paste a short test run there before committing to a long caption.",
				],
			},
			{
				heading: 'Picking an intensity for where the text is going',
				body: [
					'Mild keeps every letter easy to identify at a glance, useful anywhere the text still needs to be read quickly, like a display name that should look a little "off" without becoming a puzzle. Medium is a middle ground: noticeably glitchy, but each letter is still recoverable if someone looks for a second. Heavy and Extreme obscure most or all of the base letters under the stacked marks, which is the look most people mean by "cursed text": horror-themed captions, meme text, or image overlays where illegibility is part of the effect rather than a problem with it.',
					"One practical thing to check before pasting a long caption at Heavy or Extreme: many platforms count each combining mark as its own character toward a length limit, the same way they'd count any other character. A 40-letter sentence that reads fine in plain text can turn into several hundred characters once heavily glitched, which can push it over a bio, comment, or caption limit that the plain version would have cleared easily.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Marks added per character, by intensity',
				headers: ['Intensity', 'Marks per active direction', 'Typical use'],
				rows: [
					['Mild', '0-2', 'Subtly "off" while staying easy to read'],
					['Medium', '2-5', 'Clearly glitchy, letters still identifiable'],
					['Heavy', '5-10', 'Heavy stacking, most letters partly buried'],
					['Extreme', '10-18', 'Full cursed-text look, letters mostly buried'],
				],
				note: 'Each row is the random range the generator draws a fresh count from for every single character, separately for up and down; it is not one fixed count applied to the whole string.',
			},
		],
		faq: [
			{
				question: 'What is glitch text, and why is it also called Zalgo text?',
				answer:
					'It\'s digital text with large numbers of Unicode combining marks stacked onto the letters so it reads as corrupted or glitching. The "Zalgo" name comes from a 2004 Something Awful forum meme, in which a forum member posted image macros of cartoon characters (Garfield among them) exclaiming "Zalgo!" with distorted art and captions, attributed to an unnamed eldritch, apocalyptic figure the community named Zalgo. The distorted-text style used in those captions is what later became known as Zalgo text.',
			},
			{
				question: 'Is this a special font?',
				answer:
					"No. It's your original letters plus standard Unicode combining marks (the same character block used for accents in languages like Vietnamese or Yoruba), just far more of them per letter than any real accent uses. That's why the result copies and pastes as plain text into any Unicode-aware app instead of needing a font to be installed.",
			},
			{
				question: 'Why does the same glitched text look different when I paste it somewhere else?',
				answer:
					"Some apps and websites limit how many combining marks they'll render stacked on one base letter, so the same text can look denser in one place than another even though the underlying characters are identical. Font choice also affects how tightly the marks stack. If you need a specific look in a specific app, paste a short test line there first.",
			},
			{
				question: 'Can I use glitch text as a username?',
				answer:
					"It depends on the platform. Many apps allow Unicode combining marks in a display name or bio field but restrict actual usernames or handles to plain letters, numbers, and a few symbols, so glitch text placed in a username field may get rejected or silently stripped. Each combining mark also typically counts as its own character toward any length limit, so a short glitched name can use up a lot more of that limit than the same word in plain text.",
			},
			{
				question: 'Can heavily glitched text break or crash an app?',
				answer:
					"Historically, yes, in a narrow way: older versions of Apple's Messages app (before iOS 8.4, patched in mid-2015) could crash trying to render certain Unicode strings, including some Zalgo-style text, which is part of why Zalgo text picked up a reputation for \"breaking\" devices. That specific rendering bug has been fixed for close to a decade on any remotely current iOS version. Even so, dropping a wall of Heavy or Extreme text into someone's inbox unannounced is more of a courtesy problem than a technical one.",
			},
			{
				question: 'Does this tool store or send my text anywhere?',
				answer:
					'No. The text you type and the glitched output are both generated and combined entirely in your browser; nothing is uploaded or logged.',
			},
		],
		sources: [
			{
				label:
					'Unicode Consortium, Unicode Character Database, UnicodeData.txt (source for the Combining Diacritical Marks block, U+0300-U+036F, used to build this tool\'s mark tables)',
				url: 'https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt',
			},
			{
				label: 'Wikipedia, "Zalgo text" (2004 Something Awful origin of the name)',
				url: 'https://en.wikipedia.org/wiki/Zalgo_text',
			},
			{
				label:
					'Wikipedia, "SpringBoard," "effective power" bug section (pre-iOS 8.4 Messages crash, patched with the June 30, 2015 iOS 8.4 release)',
				url: 'https://en.wikipedia.org/wiki/SpringBoard#%22effective_power%22_bug',
			},
		],
		embedHeight: 1120,
	},
	{
		slug: 'random-animal-generator',
		category: 'Games',
		title: 'Random Animal Generator',
		shortTitle: 'Random Animal Generator',
		description:
			'Draw 1 to 10 random animals from a 131-species list spanning mammals, birds, reptiles, amphibians, fish, and invertebrates, with a unique-only or repeats-allowed draw mode.',
		updated: '2026-08-17',
		published: '2026-08-17',
		coreSummary:
			'Each draw picks uniformly at random from the active pool (the full 131-animal list, or just one class if you filter by type): every animal in that pool has an equal chance on every pick, there is no weighting toward "more common" or "more famous" animals. "Unique only" removes each animal from the pool once it is drawn, a partial Fisher-Yates shuffle, so no name repeats within a single batch; "Allow repeats" draws each pick independently, the same way rolling a die twice gives two unrelated results, so the same animal can come up more than once.',
		queries: [
			'random animal generator',
			'random animal picker',
			'pick a random animal',
			'random animal name generator',
			'random animal wheel',
		],
		sections: [
			{
				heading: 'How the generator picks an animal',
				body: [
					'Filtering by animal type first narrows the pool (for example, "Birds" shrinks it from 131 animals down to the 26 birds in the list), then a single random draw picks uniformly from whatever pool is active. Under "Unique only," each pick removes that animal from the pool before the next one is drawn, the same partial-shuffle method a deck of cards uses when you deal without putting cards back, so a batch of 5 always contains 5 different animals (capped at the pool size: filtering to Amphibians, which has 10 entries, and asking for more than 10 unique animals will return all 10 rather than erroring).',
					'Under "Allow repeats," each pick is drawn independently from the full active pool every time, so nothing is removed between picks. That is the same mechanism this site\'s random letter generator and coin flip simulator use for independent draws: each pick has no memory of the picks before it, so the same animal, letter, or coin face can land again immediately.',
				],
			},
			{
				heading: 'Worked example: why unique and repeats give slightly different odds',
				body: [
					'Mammals make up 52 of the 131 animals in the full list (39.7%). Drawing 5 animals from the full list with "Unique only" on, the chance all five happen to be mammals is (52/131) x (51/130) x (50/129) x (49/128) x (48/127), about 0.87%. With "Allow repeats" on, that same all-five-mammals event is (52/131)^5, about 0.99%, a little higher.',
					'The gap exists because removing a drawn mammal always leaves the remaining pool very slightly less mammal-heavy than before (52/131, then 51/130, then 50/129...), a property of sampling without replacement that holds no matter what share of the pool mammals start out as, majority or minority. Under "Allow repeats," nothing is ever removed, so the odds reset to the same flat 39.7% on every single pick. That is why stacking the same class several times in a row is always at least a little less likely under "Unique only" than under "Allow repeats," never more likely.',
				],
			},
			{
				heading: 'When to use unique picks vs. allowing repeats',
				body: [
					'"Unique only" fits anything where a repeat would be wasted or confusing: assigning one animal to each student in a class activity, filling out a scavenger-hunt or bingo card, seeding a "guess the animal" party game, or pulling a short list of writing prompts where you want 5 distinct ideas rather than the same animal twice.',
					'"Allow repeats" fits situations where independence matters more than variety: running a long series of draws to see how often each class shows up over time, or drawing more times than a narrow filter can supply (asking for 8 unique fish from a 12-fish pool works fine, but asking for 15 does not; switching to "Allow repeats" removes that ceiling entirely, since there is no pool to run out of).',
				],
			},
		],
		referenceTables: [
			{
				title: 'Animals by class (full 131-animal list)',
				headers: ['Class', 'Count', 'Share of the list'],
				rows: [
					['Mammal', '52', '39.7%'],
					['Bird', '26', '19.8%'],
					['Reptile', '16', '12.2%'],
					['Invertebrate', '15', '11.5%'],
					['Fish', '12', '9.2%'],
					['Amphibian', '10', '7.6%'],
				],
				note: 'Percentages are the class\'s share of this tool\'s own 131-animal list, not of all animal species on Earth.',
			},
		],
		faq: [
			{
				question: 'Can the same animal come up twice in one batch?',
				answer:
					'Only if "Allow repeats" is selected. With "Unique only" (the default), each animal is removed from the pool as soon as it is drawn, so a single batch never contains the same name twice.',
			},
			{
				question: 'How many animals are in the generator, and how were they chosen?',
				answer:
					'131 well-known species, split across six classes: 52 mammals, 26 birds, 16 reptiles, 15 invertebrates, 12 fish, and 10 amphibians. It is a curated sample of widely recognized animals for games, prompts, and classroom use, not an exhaustive database of every known species.',
			},
			{
				question: 'What do "Mammal," "Bird," "Reptile," and "Amphibian" mean here, and what about "Fish" and "Invertebrate"?',
				answer:
					'Mammal, Bird, Reptile, and Amphibian match the formal taxonomic classes Mammalia, Aves, Reptilia, and Amphibia. "Fish" and "Invertebrate" are broader, informal umbrella labels, the same way general wildlife references group them, since fish alone actually span several formal classes and invertebrates span many phyla rather than a single class.',
			},
			{
				question: "Is the region shown for each animal its only habitat?",
				answer:
					"No, it is the animal's primary or best-known native range, not an exhaustive list of everywhere it lives. Many species (foxes, honeybees, several birds of prey) are naturally widespread across multiple regions, and some have been introduced well outside their native range by human activity.",
			},
			{
				question: 'Can I generate only one type of animal, like just reptiles?',
				answer:
					'Yes. Use the "Animal type" dropdown to filter the pool to one class before generating; the pool size and per-draw odds shown below the button update to match your filter.',
			},
			{
				question: 'Does this tool store or send my draws anywhere?',
				answer:
					'No. Every draw happens in your browser using the built-in random number generator; nothing you generate is uploaded or logged.',
			},
		],
		sources: [
			{
				label: 'Integrated Taxonomic Information System (ITIS), U.S. Geological Survey, Report: Mammalia (Taxonomic Rank: Class)',
				url: 'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=179913',
			},
			{
				label: 'Integrated Taxonomic Information System (ITIS), U.S. Geological Survey, Report: Aves (Taxonomic Rank: Class)',
				url: 'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=174371',
			},
			{
				label: 'Integrated Taxonomic Information System (ITIS), U.S. Geological Survey, Report: Reptilia (Taxonomic Rank: Class)',
				url: 'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=173747',
			},
			{
				label: 'Integrated Taxonomic Information System (ITIS), U.S. Geological Survey, Report: Amphibia (Taxonomic Rank: Class)',
				url: 'https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=173420',
			},
			{
				label: 'San Diego Zoo Wildlife Explorers, "Animals" (general-audience grouping into amphibians, arthropods, birds, fish, mammals, and reptiles, corroborating the "Fish" and "Invertebrate" umbrella labels used on this page)',
				url: 'https://sdzwildlifeexplorers.org/animals',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'body-surface-area-calculator',
		category: 'Health',
		title: 'Body Surface Area (BSA) Calculator',
		shortTitle: 'BSA Calculator',
		description:
			'Calculate body surface area from height and weight using the Mosteller or Du Bois formula, in US or metric units, with both results shown side by side.',
		updated: '2026-08-17',
		published: '2026-08-17',
		coreSummary:
			'Body surface area (BSA) estimates total skin surface from height and weight. The Mosteller formula (1987) is BSA(m²) = √(height(cm) × weight(kg) ÷ 3600); the older Du Bois formula (1916) is BSA(m²) = 0.007184 × height(cm)^0.725 × weight(kg)^0.425. For a person of average adult build the two agree within about 1%; they diverge more at the extremes of height and weight. BSA is used clinically to normalize kidney function (GFR "per 1.73 m²"), scale chemotherapy doses, and compute cardiac index, rather than to screen weight the way BMI does.',
		queries: [
			'body surface area calculator',
			'bsa calculator',
			'du bois formula calculator',
			'mosteller formula body surface area',
		],
		sections: [
			{
				heading: 'Two formulas, one measurement',
				body: [
					'Body surface area estimates the total area of skin covering a person, in square meters, from just height and weight. Nobody wraps a tape measure around a patient before dosing chemotherapy, so BSA is always estimated, and two formulas dominate clinical use. The older one comes from Du Bois and Du Bois, who in 1916 took direct surface measurements of nine people (wrapping strips of paper over their bodies and totaling the area) and fit a power-law equation to that small dataset: **BSA = 0.007184 × height(cm)^0.725 × weight(kg)^0.425**.',
					'Seventy-one years later, statistician Richard Mosteller proposed a simpler alternative: **BSA = √(height(cm) × weight(kg) ÷ 3600)**, a single square root instead of two fractional exponents. Mosteller validated it by checking how closely it tracked Du Bois\'s numbers, not by remeasuring anyone directly, and it has since become the more commonly used formula in US clinical practice specifically because it is faster to compute by hand.',
				],
			},
			{
				heading: 'Where the two formulas diverge',
				body: [
					'For a person of average build, the two formulas land within roughly half a percent of each other. A 170 cm, 65 kg adult gets 1.754 m² from Du Bois and 1.752 m² from Mosteller, a difference too small to matter for any practical purpose. Run the same height at 100 kg instead of 65, though, and Mosteller starts running ahead: at 170 cm and 150 kg, Du Bois gives 2.502 m² while Mosteller gives 2.661 m², a gap of about 6%.',
					"That spread traces back to how each formula was built. Du Bois derived his equation from just nine people of unstated build, and Mosteller's formula was fit to track Du Bois's numbers rather than measured against anyone directly, so neither one was calibrated on someone who looks like a 170 cm, 150 kg adult. This calculator shows both results side by side so that gap is visible rather than hidden: when the two formulas land close together, either number is fine to trust; when they start pulling apart, that's a sign the person being measured is outside the range either formula was really built for.",
				],
			},
			{
				heading: 'What BSA gets used for',
				body: [
					'BSA is not a weight-screening number the way BMI is. It does not have "healthy" or "overweight" categories. Its main clinical uses are all about scaling something else to body size more precisely than raw weight allows. Kidney function (glomerular filtration rate, GFR) is conventionally reported "per 1.73 m²" because 1.73 m² was the average adult BSA measured when that convention was set, and normalizing to it lets a small person\'s and a large person\'s kidney function be compared on the same scale. National Kidney Foundation guidance notes that this indexed number is what gets compared against normal ranges, while a non-indexed GFR (not divided by 1.73 m²) is what actually gets used for drug dosing, since dosing adequacy depends on absolute filtration capacity rather than filtration capacity scaled to a hypothetical 1.73 m² body.',
					'Chemotherapy is the other major use: many regimens specify a dose "per m²" of BSA rather than a flat milligram amount, on the theory that BSA tracks blood volume and metabolic rate better than weight alone. Cardiac index (cardiac output divided by BSA) is a third, used to compare heart pump performance across differently sized patients. None of these uses require picking one formula as objectively "correct." Mosteller and Du Bois are both accepted, and a clinician\'s protocol usually specifies which one to use.',
				],
			},
		],
		referenceTables: [
			{
				title: 'BSA by height and weight: Du Bois vs. Mosteller',
				headers: ['Height', 'Weight', 'Du Bois (m²)', 'Mosteller (m²)', 'Difference'],
				rows: [
					['150 cm (4\'11")', '45 kg (99 lb)', '1.370', '1.369', '−0.03%'],
					['160 cm (5\'3")', '55 kg (121 lb)', '1.563', '1.563', '+0.02%'],
					['170 cm (5\'7")', '65 kg (143 lb)', '1.754', '1.752', '−0.09%'],
					['175 cm (5\'9")', '75 kg (165 lb)', '1.903', '1.909', '+0.33%'],
					['180 cm (5\'11")', '85 kg (187 lb)', '2.049', '2.062', '+0.64%'],
					['190 cm (6\'3")', '100 kg (220 lb)', '2.283', '2.297', '+0.64%'],
				],
				note: 'Computed directly from both formulas (0.007184 × H^0.725 × W^0.425 for Du Bois, √(H×W/3600) for Mosteller); imperial weights rounded to the nearest pound. Use the calculator above for exact figures at any height and weight.',
			},
		],
		faq: [
			{
				question: 'Should I use the Mosteller or Du Bois formula?',
				answer:
					'For most adults it barely matters: the two typically agree within about 1%. Mosteller is the one more commonly used in US clinical practice today because it is simpler to compute, but Du Bois is still widely accepted and is what many older studies and drug labels reference. If a specific protocol or drug label names one formula, use that one.',
			},
			{
				question: 'Why do the two formulas give slightly different numbers?',
				answer:
					"Du Bois fit a power-law curve to direct surface measurements of nine people in 1916. Mosteller's 1987 formula is a simpler square-root approximation that was checked against Du Bois's results rather than measured independently. They track each other closely for average-size adults but diverge more (Mosteller running higher) at higher weights, which is a known limitation of both formulas rather than a bug in either one.",
			},
			{
				question: 'Is body surface area the same as BMI?',
				answer:
					"No. BMI (weight ÷ height²) is a weight-screening number with defined categories like \"healthy weight\" or \"obese.\" BSA estimates total skin surface area in square meters and has no such categories. It exists to scale drug doses and clinical measurements to body size, not to assess weight. See our [BMI calculator](/bmi-calculator/) for weight screening.",
			},
			{
				question: 'Why is kidney function reported "per 1.73 m²"?',
				answer:
					'1.73 m² was the average adult body surface area measured when that reporting convention was established, so dividing GFR by a patient\'s own BSA and multiplying by 1.73 m² puts everyone on a common scale for comparing against normal ranges. The National Kidney Foundation notes that drug dosing works the other way around: it is normally based on the non-indexed GFR (not divided by BSA), since a dose needs to match a patient\'s actual filtration capacity rather than a capacity scaled to a hypothetical 1.73 m² body.',
			},
			{
				question: 'Can I use this calculator to figure out my own chemotherapy dose?',
				answer:
					"No. Use it to understand or double-check the BSA number a clinician has already calculated, not to determine a dose yourself. Drug dosing also depends on the specific regimen, dose-capping rules, and clinical judgment that this calculator does not account for.",
			},
		],
		sources: [
			{
				label:
					'Du Bois D, Du Bois EF, "A formula to estimate the approximate surface area if height and weight be known," Archives of Internal Medicine 17(6):863-871 (1916)',
				url: 'https://doi.org/10.1001/archinte.1916.00080130010002',
			},
			{
				label: 'Mosteller RD, "Simplified calculation of body-surface area," New England Journal of Medicine 317(17):1098 (1987)',
				url: 'https://doi.org/10.1056/NEJM198710223171717',
			},
			{
				label:
					'National Kidney Foundation, "Frequently Asked Questions About GFR Estimates" (2022), Q6 (1.73 m² indexing, Du Bois formula) and Q44 (indexed vs. non-indexed eGFR for drug dosing)',
				url: 'https://www.kidney.org/sites/default/files/441-8491_2202_faqs_aboutgfr_v5.pdf',
			},
		],
		embedHeight: 700,
	},
	{
		slug: 'small-text-generator',
		category: 'Text Tools',
		title: 'Small Text Generator',
		shortTitle: 'Small Text Generator',
		description:
			'Convert text into superscript, small caps, or subscript Unicode characters for bios, captions, and comments, with an exact count of which letters have no dedicated tiny glyph in that style.',
		updated: '2026-08-18',
		published: '2026-08-18',
		coreSummary:
			'Each style swaps letters, digits, and a few symbols for individually-named Unicode code points from blocks the Unicode Consortium built for chemistry, algebra, and phonetic transcription, not for social media styling. None of the three covers the full alphabet: superscript has no code point for "q" (25 of 26 letters), small caps has none for lowercase "x" (25 of 26), and subscript, which Unicode only ever extended for math and IPA notation, covers 17 of 26. Unmapped letters are left as regular characters rather than dropped, and this tool reports exactly how many that was for your text.',
		queries: [
			'small text generator',
			'tiny text generator',
			'superscript text generator',
			'small caps generator',
			'subscript text generator',
		],
		sections: [
			{
				heading: 'How each style pulls real Unicode characters, not a font',
				body: [
					'There is no way to shrink font size in a platform bio field, a comment box, or most chat apps. Those fields accept plain text and render it at whatever size the platform sets. What these three styles do instead is character substitution: each letter, digit, or symbol you type gets swapped for a different, individually-named Unicode code point that happens to render small or raised or lowered in most fonts, then the result is copied as ordinary text. Superscript output uses the Unicode block built at U+2070-209F plus scattered code points named "MODIFIER LETTER SMALL ⟨letter⟩" elsewhere in the standard; small caps pulls from "LATIN LETTER SMALL CAPITAL ⟨letter⟩" code points; subscript uses the "LATIN SUBSCRIPT SMALL LETTER ⟨letter⟩" set. Because every one of these is a real character with its own code point, not a custom font file or an image, the output pastes correctly into any field that accepts Unicode text, and it keeps working even in apps that strip formatting or block custom fonts entirely.',
					'The three styles handle uppercase input differently, on purpose. Superscript and subscript convert both cases to the same small-form glyph, since Unicode\'s separate capital-height superscript table (the "MODIFIER LETTER CAPITAL ⟨letter⟩" set) has more gaps than the lowercase one used here, and there is no capital subscript table at all. Small caps does the opposite. Lowercase input converts to a small capital glyph, while letters you already typed in uppercase are left untouched, matching how small caps works in real typography: full capitals stay full size, only lowercase letters get reduced.',
				],
			},
			{
				heading: 'Why none of the three styles covers the full alphabet',
				body: [
					'These code points were never designed as a decorative alphabet. The superscript and subscript digits and symbols at U+2070-209F were added, according to a W3C technical note on their intended use, so that "chemical and algebraic formulas could be written without markup": H₂O with a real subscript 2, not HTML\'s <sub> tag. The letter forms for both styles mostly came later and for a narrower reason: subscript letters like ᵢ, ⱼ, ₐ exist for variable notation in math and phonetics (xᵢ, a subscripted index), which is why only 17 of 26 exist. B, c, d, f, g, q, w, y, and z were simply never requested for that use case. The small caps and lowercase-height superscript letters mostly live in the Phonetic Extensions block, added to Unicode in 2003-2005 specifically to support the Uralic Phonetic Alphabet, historical Americanist transcription, and dictionary pronunciation guides. Using them for Instagram bios repurposes characters that were built for linguists.',
					'The gaps are real, not an oversight this tool works around. Superscript "q" and small caps "x" have no dedicated code point anywhere in the current Unicode standard, so this tool leaves them as plain letters and counts them separately below rather than silently substituting a look-alike character or dropping them. Subscript is missing nine letters for the same reason, though three of them are already scheduled to close: the Unicode Consortium\'s public character pipeline currently reserves code points U+209D, U+209E, and U+209F for subscript w, y, and z, provisionally approved but not yet part of a released Unicode version.',
				],
			},
			{
				heading: 'Where this text works, and where it breaks down',
				body: [
					'Superscript, small caps, and subscript Unicode text pastes cleanly into any plain-text field: bios, captions, comments, direct messages, chat apps, spreadsheet cells. It generally will not work as an actual username or account handle, since most platforms restrict handles to a fixed ASCII character set specifically to prevent look-alike impersonation, even where they allow the same characters freely in a bio or display name.',
					'Screen readers frequently mishandle these code points, because assistive technology reads by the character\'s official Unicode name, not by how it looks to a sighted reader. Scope, a UK disability charity, found that screen readers either skip stylized Unicode letters entirely or read out their technical names one by one, so a short stylized word can take noticeably longer to process than the same word in plain text, or vanish from what a screen reader user hears altogether. That does not make these characters unusable, but it argues for keeping stylized runs short (a name, a heading, a few words for emphasis) rather than converting a full paragraph, and for making sure the plain-text meaning is not the only place any critical information appears.',
				],
			},
		],
		referenceTables: [
			{
				title: 'a-z coverage by style',
				headers: ['Letter', 'Superscript', 'Small caps', 'Subscript'],
				rows: [
					['a', 'ᵃ', 'ᴀ', 'ₐ'],
					['b', 'ᵇ', 'ʙ', '—'],
					['c', 'ᶜ', 'ᴄ', '—'],
					['d', 'ᵈ', 'ᴅ', '—'],
					['e', 'ᵉ', 'ᴇ', 'ₑ'],
					['f', 'ᶠ', 'ꜰ', '—'],
					['g', 'ᵍ', 'ɢ', '—'],
					['h', 'ʰ', 'ʜ', 'ₕ'],
					['i', 'ⁱ', 'ɪ', 'ᵢ'],
					['j', 'ʲ', 'ᴊ', 'ⱼ'],
					['k', 'ᵏ', 'ᴋ', 'ₖ'],
					['l', 'ˡ', 'ʟ', 'ₗ'],
					['m', 'ᵐ', 'ᴍ', 'ₘ'],
					['n', 'ⁿ', 'ɴ', 'ₙ'],
					['o', 'ᵒ', 'ᴏ', 'ₒ'],
					['p', 'ᵖ', 'ᴘ', 'ₚ'],
					['q', '— (no code point)', 'ꞯ', '—'],
					['r', 'ʳ', 'ʀ', 'ᵣ'],
					['s', 'ˢ', 'ꜱ', 'ₛ'],
					['t', 'ᵗ', 'ᴛ', 'ₜ'],
					['u', 'ᵘ', 'ᴜ', 'ᵤ'],
					['v', 'ᵛ', 'ᴠ', 'ᵥ'],
					['w', 'ʷ', 'ᴡ', '— (reserved, unreleased)'],
					['x', 'ˣ', '— (no code point)', 'ₓ'],
					['y', 'ʸ', 'ʏ', '— (reserved, unreleased)'],
					['z', 'ᶻ', 'ᴢ', '— (reserved, unreleased)'],
				],
				note: 'Generated directly from this tool\'s conversion table. "Reserved, unreleased" means the Unicode Consortium has set aside a code point (U+209D/209E/209F) for that character but it is not yet part of a released Unicode version.',
			},
		],
		faq: [
			{
				question: 'Why does converting "q" to superscript just show a regular q?',
				answer:
					'Unicode has no dedicated superscript code point for the letter q, unlike every other letter a-z. This tool leaves it as a plain lowercase q rather than substituting an unrelated look-alike character, and counts it toward "No tiny form exists" so you know it happened.',
			},
			{
				question: 'Why do capital letters stay full-size in small caps mode, but not in superscript?',
				answer:
					"It matches how each style is actually used. Small caps typography is defined as shrinking lowercase letters to capital-height while leaving true capitals alone, so that's what this tool does. Superscript and subscript don't have that convention, and Unicode's separate capital-height superscript table has even more missing letters than the lowercase one, so both cases route through the same small-form glyphs.",
			},
			{
				question: 'Will subscript ever support the full alphabet?',
				answer:
					'Closer than it used to be. The Unicode Consortium\'s public character pipeline lists code points U+209D, U+209E, and U+209F as reserved for subscript w, y, and z, provisionally approved but not yet part of a released Unicode version. Even after those ship, b, c, d, f, g, and q would still have no subscript form.',
			},
			{
				question: 'Can I use this styled text as my username or account handle?',
				answer:
					"Usually not, even on platforms where it works fine in a bio or display name. Most platforms restrict actual handles to a fixed set of plain ASCII characters, partly to stop look-alike characters from being used to impersonate another account.",
			},
			{
				question: 'Is this text accessible to screen reader users?',
				answer:
					"Not reliably. Screen readers announce a character by its official Unicode name rather than by how it looks, and the UK disability charity Scope has documented screen readers either skipping stylized Unicode letters or reading out each one's technical name in sequence, which can make a short phrase slow to process or drop it from what a screen reader user hears entirely. Keeping stylized text short, and not relying on it for anything essential, avoids the worst of this.",
			},
			{
				question: 'Does this tool store or send my text anywhere?',
				answer:
					'No. The conversion runs entirely in your browser using the mapping tables above; nothing you type is uploaded or logged.',
			},
		],
		sources: [
			{
				label:
					'Unicode Consortium, Unicode Character Database, UnicodeData.txt (source for every code point and official character name used in this tool\'s mapping tables)',
				url: 'https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt',
			},
			{
				label:
					'Wikipedia, "Unicode subscripts and superscripts" (intended use for chemical/algebraic notation; U+209D-209F reserved for subscript w/y/z)',
				url: 'https://en.wikipedia.org/wiki/Unicode_subscripts_and_superscripts',
			},
			{
				label: 'Unicode Consortium, Character Pipeline (public allocation list confirming U+209D-209F reserved for LATIN SUBSCRIPT SMALL LETTER W/Y/Z)',
				url: 'https://www.unicode.org/alloc/Pipeline.html',
			},
			{
				label: 'Wikipedia, "Phonetic Extensions" (Unicode block background; added in Unicode 4.0-4.1, 2003-2005, for the Uralic Phonetic Alphabet and related transcription systems)',
				url: 'https://en.wikipedia.org/wiki/Phonetic_Extensions',
			},
			{
				label: 'Holly Tuke, "How special characters and symbols affect screen reader accessibility," Scope for Business (2021)',
				url: 'https://business.scope.org.uk/accessibility-screen-readers-special-characters-and-unicode-symbols/',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'gender-symbols',
		category: 'Reference',
		title: 'Gender Symbols',
		shortTitle: 'Gender Symbols',
		description:
			'Search or browse 7 gender symbols, including ♀ ♂ ⚧ ⚢ ⚣, with meanings, Unicode code points, and verified history, and copy any symbol with one click.',
		updated: '2026-08-18',
		published: '2026-08-18',
		coreSummary:
			"The female (♀) and male (♂) signs began as astrological shorthand for Venus and Mars long before Carl Linnaeus repurposed them for plant sex in 1751. The other five symbols here are far newer: activists built the doubled lesbian (⚢) and gay (⚣) signs from the same Venus and Mars glyphs for a 1970 UK newspaper cover, Holly Boswell drew the transgender symbol (⚧) by hand in 1993, and the Unicode Consortium did not formally assign code points to any of the five until version 4.1 in 2005. Search this tool by name or meaning and click any result to copy it.",
		queries: [
			'female symbol',
			'male symbol',
			'gender symbol',
			'gender symbols copy and paste',
			'transgender symbol',
			'lesbian symbol',
			'gay symbol',
			'intersex symbol',
			'venus symbol',
			'mars symbol',
			'hermaphrodite symbol',
		],
		sections: [
			{
				heading: 'How to use this tool',
				body: [
					'Most searches that land here are looking for one specific glyph to paste into a bio, a form, or a chat message, not to browse a full set. Type what you\'re after ("female," "transgender," "gay") into the search box and the grid narrows to matches, or leave it blank to see all 7 at once. Clicking a result copies just the character, ready to paste anywhere.',
					"A word of caution on the five newer symbols (everything except ♀ and ♂): several combine visually in ways that render inconsistently across fonts and operating systems, and screen readers don't reliably announce them the same way twice. If you're publishing text where the symbol has to be unambiguous, for example a form that records legal sex versus gender identity, spell the word out instead of relying on the glyph.",
				],
			},
			{
				heading: 'Two symbols from astrology, repurposed for biology',
				body: [
					"♀ and ♂ are the oldest symbols on this page by a wide margin. Astrologers used them for the planets Venus and Mars, and alchemists borrowed the same glyphs for the metals each planet was thought to govern: copper for Venus, iron for Mars. A popular story reads the shapes as a stylized hand mirror for Venus and a spear and shield for Mars, but botanist William T. Stearn's 1962 survey of the evidence found that historians who study the symbols reject that reading; Stearn favored an older theory that both glyphs are compressed Greek letters standing for the planets' Greek names, though later manuscript evidence has left even that account short of settled.",
					"Swedish botanist Carl Linnaeus gave the pair their modern meaning. He first used ♀ for the female parent and ♂ for the male parent of hybrid plants in his 1751 dissertation Plantae hybridae, then carried the same convention into his 1753 book Species Plantarum, the work that fixed the modern rules for naming species. Zoologists adopted the pair soon after for animal sex, and the symbols have marked \"female\" and \"male\" in science, and later on restroom doors and dating profiles, ever since.",
				],
			},
			{
				heading: 'Doubled signs from a 1970 newspaper cover',
				body: [
					'⚢ and ⚣ are not ancient at all. The UK\'s Gay Liberation Front started printing two interlocked Venus signs and two interlocked Mars signs on the cover of its newspaper, Come Together, starting in late 1970, using the doubled female sign for lesbians and the doubled male sign for gay men. The idea took the existing astrological pair and doubled each one rather than inventing anything new, which is likely why it caught on quickly as a recognizable community shorthand.',
					"The Unicode Consortium did not give either doubled sign an official code point until version 4.1 in March 2005, well over three decades after they first appeared in print. Before that, anyone who wanted to type them was out of luck; a plain word or an image was the only option.",
				],
			},
			{
				heading: 'The transgender symbol, drawn by one activist in 1993',
				body: [
					'⚧ has a documented single author. Transgender activist Holly Boswell sketched the design in 1993, adding a third branch, an arrow crossed by a stroke, to the combined female-and-male shape to represent identities outside the binary. Wendy Parker and Nancy R. Nangeroni helped refine and circulate the drawing before it reached Unicode 4.1 in 2005 under the plain descriptive name "male with stroke and male and female sign." The Unicode Consortium\'s CLDR project separately labels it "transgender symbol" specifically so screen readers announce it correctly.',
					'The remaining two symbols, ⚤ (interlocked female and male, for heterosexual pairings) and ⚥ (combined female and male, used for intersex, androgynous, or hermaphroditic meanings), joined the same 2005 batch without a single named creator. ⚥ is easy to mix up with the older astrological symbol for Mercury (☿), which Linnaeus separately used for hermaphroditic flowers; the two glyphs look alike but are unrelated Unicode characters.',
				],
			},
		],
		referenceTables: [
			{
				title: 'The 7 symbols',
				headers: ['Symbol', 'Name', 'Meaning', 'Unicode', 'Common use'],
				rows: GENDER_SYMBOLS.map((s) => [s.symbol, s.name, s.meaning, s.codePoint, s.commonUse]),
			},
		],
		faq: [
			{
				question: 'What is the female symbol (♀) and where did it come from?',
				answer:
					'♀ (U+2640) marks a woman, girl, or biologically female organism. It began as the astrological symbol for Venus and the alchemical symbol for copper; the popular reading of the shape as a stylized hand mirror is widely repeated but disputed by historians. Carl Linnaeus adopted it for female plants in 1751 and 1753, and biology, medicine, and everyday signage have used it ever since. Search "female" above to find and copy it.',
			},
			{
				question: 'What is the male symbol (♂) and where did it come from?',
				answer:
					"♂ (U+2642) marks a man, boy, or biologically male organism. It began as the astrological symbol for Mars and the alchemical symbol for iron; the popular reading of the shape as a spear and shield is widely repeated but disputed by historians. Carl Linnaeus paired it with the female sign for male plants in 1751 and 1753. Search \"male\" above to find and copy it.",
			},
			{
				question: 'What is the transgender symbol (⚧) and who created it?',
				answer:
					'⚧ (U+26A7) represents transgender or gender-nonconforming identity. Activist Holly Boswell drew it in 1993 by adding a crossed third branch to the combined female-and-male sign, with help from Wendy Parker and Nancy R. Nangeroni in refining and circulating it. It entered Unicode in version 4.1 (2005).',
			},
			{
				question: 'What do the doubled female (⚢) and doubled male (⚣) symbols mean?',
				answer:
					"⚢ (U+26A2) represents lesbians, and ⚣ (U+26A3) represents gay men. Both come from two interlocked copies of the female and male astrological signs, first printed on the cover of the UK newspaper Come Together starting in late 1970. Neither had a Unicode code point until version 4.1 in 2005.",
			},
			{
				question: 'What is the difference between ⚤ and ⚥?',
				answer:
					'⚤ (U+26A4) interlocks the female and male signs and is generally used for heterosexuality or a male-female pairing. ⚥ (U+26A5) overlaps them into a single combined glyph and is generally used for intersex, androgynous, or (in botany) hermaphroditic meanings. Both joined Unicode in version 4.1 (2005) without a single named creator.',
			},
			{
				question: 'Is ⚥ the same symbol Linnaeus used for hermaphroditic plants?',
				answer:
					'No. Linnaeus used the older astrological symbol for Mercury (☿) for hermaphroditic flowers in his later botanical works. ⚥ (U+26A5) looks similar but is a separate, much newer Unicode character, added in 2005.',
			},
			{
				question: 'Why do gender symbols sometimes look different or fail to display?',
				answer:
					'The five newer symbols on this page combine multiple glyph elements, and not every font or operating system renders that combination the same way. Screen readers can also announce them inconsistently. For text where the meaning has to be unambiguous, spelling the word out is more reliable than the symbol.',
			},
		],
		sources: [
			{
				label: 'Wikipedia, "Gender symbol"',
				url: 'https://en.wikipedia.org/wiki/Gender_symbol',
			},
			{
				label: 'Encyclopaedia Britannica, "Gender symbol | Description, Examples, & History"',
				url: 'https://www.britannica.com/topic/gender-symbol',
			},
			{
				label: 'William T. Stearn, "The Origin of the Male and Female Symbols of Biology," Taxon, Vol. 11, No. 4 (May 1962), pp. 109 to 113',
				url: 'https://iapt-taxon.org/historic/Congress/IBC_1964/male_fem.pdf',
			},
			{
				label: 'LSE History Blog, "LGBTQI+ symbols and their meanings" (Gay Liberation Front, Come Together, 1970)',
				url: 'https://blogs.lse.ac.uk/lsehistory/2024/05/15/lgbtqi-symbols-and-their-meanings/',
			},
			{
				label: 'LGBTQ Nation, "History And Meaning Of The Trans Symbol" (Holly Boswell, 1993)',
				url: 'https://www.lgbtqnation.com/2022/07/all-about-the-transgender-symbol/',
			},
			{
				label: 'codepoints.net, U+26A7 MALE WITH STROKE AND MALE AND FEMALE SIGN (Unicode version and CLDR name)',
				url: 'https://codepoints.net/U+26A7',
			},
			{
				label: 'Unicode Consortium, "Miscellaneous Symbols" code chart, current (U+2600 to U+26FF)',
				url: 'https://www.unicode.org/charts/PDF/U2600.pdf',
			},
			{
				label: 'Unicode Consortium, "Miscellaneous Symbols" code chart, Unicode 4.1 (March 2005, confirms addition of ⚢ ⚣ ⚤ ⚥ ⚧)',
				url: 'https://unicode.org/charts/PDF/Unicode-4.1/U41-2600.pdf',
			},
		],
		embedHeight: 900,
	},
	{
		slug: 'topsoil-calculator',
		category: 'Construction',
		title: 'Topsoil Calculator',
		shortTitle: 'Topsoil Calculator',
		description:
			'Work out cubic yards, weight, and bag count for a lawn, garden bed, or raised bed from its shape, area, and fill depth, with soil-texture density presets sourced from USDA soil science.',
		updated: '2026-08-18',
		published: '2026-08-18',
		coreSummary:
			'Topsoil is ordered by volume: length x width x depth (or, for a round bed, pi x radius squared x depth), converted from cubic feet to cubic yards by dividing by 27. Weight is harder to pin to one number because it depends on both moisture and soil texture, so this calculator uses the USDA NRCS Soil Health Educators Guide\'s ideal bulk-density ceiling for sandy, loam, and clay-heavy soils, converted to pounds per cubic yard, as a texture-specific planning estimate rather than a single flat figure.',
		queries: [
			'topsoil calculator',
			'how much topsoil do i need',
			'topsoil cubic yards calculator',
			'topsoil weight calculator',
			'how many bags of topsoil do i need',
		],
		sections: [
			{
				heading: 'The volume formula, and why topsoil is priced by the cubic yard',
				body: [
					"Bulk topsoil suppliers sell by the cubic yard, so the first step is area times depth. For a rectangular bed or lawn section, that's length times width times fill depth, all converted to the same unit, usually feet. For a round bed or tree ring, swap the rectangle for a circle: pi times the radius squared, times depth. Either way, the result comes out in cubic feet. A cubic yard holds 27 cubic feet, so the last step is dividing by 27, which lands on the unit a supplier's price sheet is actually written in.",
					"Bagged topsoil is priced differently: by the bag, at a fixed cubic-foot size per bag. Scotts Premium Topsoil, sold at Home Depot, Lowe's, and Amazon, ships in 0.75 cubic foot bags, but sizes vary by brand from roughly 0.5 to 2 cubic feet, so this calculator lets you pick the bag size on the label rather than assuming one universal number.",
				],
			},
			{
				heading: 'A new lawn and a raised bed: the math behind both',
				body: [
					"A 1,200 sq ft yard getting fresh topsoil worked into the top 4 inches, the till depth the University of Maryland Extension's lawn-establishment guide recommends for blending amendments into existing soil: volume = 1,200 x (4/12) = 400 cu ft, which is 14.81 cu yd. Using the loam density preset (87.2 lb/ft³), that's 34,880 lb, or 17.44 tons, before any settling allowance. Add a 10% allowance for the soil compacting once it's spread and watered in: 400 x 1.10 = 440 cu ft, 16.30 cu yd, 38,368 lb (19.18 tons).",
					"A 4 ft by 8 ft raised bed on a patio, filled to the 8 in minimum the University of Maryland Extension gives for growing leafy greens, beans, or cucumbers in a bed sitting on a hard surface: volume = 32 x (8/12) = 21.33 cu ft, or 0.79 cu yd. At the loam density, that's 1,860 lb (0.93 tons), and at 0.75 cu ft per bag, 29 bags before settling, 32 bags with a 10% allowance. For a bed shallower than 16 inches, the same Extension guidance caps straight topsoil at 20% of the mix by volume, so most of that fill would come from compost and a soilless growing medium rather than topsoil alone.",
				],
			},
			{
				heading: 'Why the weight estimate depends on soil texture, not just volume',
				body: [
					"A cubic yard of topsoil doesn't have one fixed weight, because bulk density (mass per unit volume) changes with how much sand, silt, clay, and organic matter the soil contains, plus how wet it is when it's weighed. Rather than pick one number and call it universal, this calculator's three texture presets come from the USDA NRCS Soil Health Educators Guide (2023), which publishes an ideal bulk-density ceiling for each texture group, the density a soil should stay at or under for roots to grow through it freely. Converted to pounds per cubic yard: sand and loamy sand top out around 2,692 lb, sandy loam through silt loam around 2,354 lb, and clay-heavy textures around 1,850 lb.",
					"That NRCS table describes undisturbed or tilled soil in the ground, not necessarily loose, screened topsoil sitting in a supplier's stockpile, which tends to stay looser, and lighter per cubic yard, until it settles. Moisture matters too: wet soil can weigh noticeably more than the same soil dry, sometimes enough to swamp the difference between texture presets. Treat the preset as a planning estimate, and if a supplier gives you a lab-tested or load-ticket density, enter it directly with the custom option instead.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Fill depth by project (University of Maryland Extension)',
				headers: ['Project', 'Recommended depth', 'Source guidance'],
				rows: [
					['Covering grass seed', '1/4-1/2 in', "Light cover to aid germination, not a full soil layer"],
					['New lawn, tilling in amendments', '4-6 in', 'Depth a rototiller mixes soil and amendments to'],
					['Raised bed on hard surface: leafy greens, beans, cucumbers', '8 in minimum', 'Roots need this much rooting depth above the hard surface'],
					['Raised bed on hard surface: peppers, tomatoes, squash', '12-24 in', 'Deeper-rooting crops need more depth for the same reason'],
					['Raised bed straight-topsoil limit', 'Up to 20% of mix by volume', 'Applies unless the bed is at least 16 in deep'],
				],
				note: 'Source: University of Maryland Extension, "Starting a New Lawn" and "Soil to Fill Raised Beds."',
			},
			{
				title: 'Soil texture density presets (USDA NRCS ideal bulk density ceiling)',
				headers: ['Texture preset', 'Density (g/cm³)', 'Density (lb/ft³)', 'Weight per cu yd'],
				rows: [
					['Sandy blend (sand, loamy sand)', '< 1.6', '99.7', '~2,692 lb'],
					['Loam (sandy loam through silt loam)', '< 1.4', '87.2', '~2,354 lb'],
					['Clay-heavy (sandy clay, silty clay, clay)', '< 1.1', '68.5', '~1,850 lb'],
				],
				note: 'Source: USDA NRCS Soil Health Educators Guide (2023), as tabulated by SDSU Extension. These are ceilings for healthy root growth in soil already in the ground, not a measured weight of bagged or bulk-delivered topsoil.',
			},
		],
		faq: [
			{
				question: 'How much topsoil do I need for a given area and depth?',
				answer:
					"Multiply the area in square feet by the fill depth in feet, then divide by 27 to get cubic yards. For a 500 sq ft bed at 6 inches: 500 x 0.5 = 250 cu ft, divided by 27 is 9.26 cu yd. This calculator does that conversion and adds a settling allowance and weight estimate on top.",
			},
			{
				question: 'How much does a cubic yard of topsoil weigh?',
				answer:
					"There's no single official figure, because weight depends on soil texture and moisture. This calculator uses USDA NRCS's ideal bulk-density ceiling for each texture: roughly 2,692 lb/cu yd for sandy soil, 2,354 lb/cu yd for loam, and 1,850 lb/cu yd for clay-heavy soil. Wetter soil weighs more than these dry-basis figures; a supplier's load ticket, if you have one, is more accurate than any preset.",
			},
			{
				question: 'Should I buy topsoil in bags or bulk by the cubic yard?',
				answer:
					"Bags make sense for small jobs, generally under a cubic yard or two, since bulk delivery minimums and per-load fees often make a small bulk order cost more per unit than bags. For a full cubic yard (about 36 bags at 0.75 cu ft each), bulk delivery is almost always cheaper if a supplier in your area offers it and the volume clears their minimum order.",
			},
			{
				question: 'How much extra should I order for settling?',
				answer:
					"Freshly spread topsoil compacts once it's walked on and watered in, so ordering exactly the calculated volume tends to leave you short once it settles. There's no single official percentage; this calculator defaults to a 10% allowance, which you can adjust, as a middle-of-the-road planning figure rather than a guarantee.",
			},
			{
				question: 'How deep should topsoil be for a new lawn versus a raised bed?',
				answer:
					"For working amendments into an existing lawn area, University of Maryland Extension's guidance points to tilling the top 4-6 inches. Raised beds need more: at least 8 inches for shallow-rooting crops like leafy greens and beans, and 12-24 inches for deeper-rooting crops like tomatoes and peppers, per the same Extension's raised-bed guidance.",
			},
			{
				question: 'Can I fill a raised bed with 100% topsoil?',
				answer:
					"University of Maryland Extension caps straight topsoil at about 20% of the mix by volume unless the bed is at least 16 inches deep, recommending compost and a soilless growing mix for the rest. Straight topsoil alone tends to compact and drain poorly in a contained bed compared with a blended mix.",
			},
			{
				question: 'Why does the calculator ask for soil texture instead of using one weight for everyone?',
				answer:
					"Bulk density differs by texture: sandier soils pack denser than clay-heavy soils at the same moisture level, per USDA NRCS's published bulk-density figures. Picking the closest texture preset, or entering a custom density if you know one, gets you a closer weight estimate than a single flat number would.",
			},
			{
				question: 'Does the price estimate include delivery?',
				answer:
					"No, the optional price field multiplies your cubic-yard total by a per-cubic-yard material price you enter, so it estimates material cost only. Delivery fees, minimum-order charges, and any spreading labor are separate and vary by supplier.",
			},
		],
		sources: [
			{
				label: 'SDSU Extension (Hans Klopp & Anthony Bly), "Bulk Density is an Indicator of Soil Health," updated September 22, 2023 (tabulates USDA NRCS Soil Health Educators Guide 2023 ideal bulk-density ceilings by soil texture)',
				url: 'https://extension.sdstate.edu/bulk-density-indicator-soil-health',
			},
			{
				label: 'University of Maryland Extension, "Starting a New Lawn" (4-6 in till depth for soil amendments)',
				url: 'https://extension.umd.edu/resource/starting-new-lawn',
			},
			{
				label: 'University of Maryland Extension, "Soil to Fill Raised Beds" (8 in and 12-24 in depth minimums, 20% topsoil-by-volume guidance)',
				url: 'https://extension.umd.edu/resource/soil-fill-raised-beds',
			},
		],
		embedHeight: 980,
	},
	{
		slug: 'keg-calculator',
		category: 'Food & Drink',
		title: 'Keg Calculator',
		shortTitle: 'Keg Calculator',
		description:
			'Work out how many 12 oz beers, US pints, or custom pours a keg holds for any standard US or metric keg size, plus how many kegs a party needs, using the federally defined keg sizes and standard-drink serving reference.',
		updated: '2026-08-19',
		published: '2026-08-19',
		coreSummary:
			'Servings per keg = keg volume divided by serving size, rounded down. Keg volumes come from the fractional-barrel sizes the US Alcohol and Tobacco Tax and Trade Bureau authorizes under 27 CFR 25.11 and 25.156 (half barrel = 15.5 gal, quarter barrel = 7.75 gal, sixth barrel = 31/6 gal), plus the 5-gallon and metric kegs the same regulation covers. The default 12 oz serving is the NIAAA\'s standard-drink reference volume for beer near 5% ABV.',
		queries: [
			'keg calculator',
			'how many beers in a keg',
			'how many beers in a keg calculator',
			'keg size calculator',
			'how many kegs do i need for a party',
		],
		sections: [
			{
				heading: 'Where keg sizes actually come from',
				body: [
					"A \"keg\" isn't one fixed size; it's a fraction of a barrel, and the barrel itself is a legal unit of measure. The US Alcohol and Tobacco Tax and Trade Bureau defines a barrel as 31 gallons for beer-tax purposes (27 CFR 25.11), and separately authorizes the fractional and metric container sizes breweries actually fill (27 CFR 25.156): halves, thirds, quarters, sixths, and eighths of that 31-gallon barrel, plus straight 5-gallon kegs and metric 30 L and 50 L kegs. The everyday keg names come straight out of those fractions: a half barrel (the size most people mean by \"a keg\") is 15.5 gallons, a quarter barrel or pony keg is 7.75 gallons, and a sixth barrel or sixtel is 31/6, about 5.17 gallons.",
					'Two sizes on this calculator sit outside that legal fraction system. A "corny" or Cornelius keg is a 5-gallon container that TTB separately authorizes as a keg size, but the name comes from its original use as a soda-fountain syrup keg that homebrewers repurposed; it isn\'t a clean fraction of 31. A mini or party keg, the small stainless container sold at grocery and liquor stores for a single gathering, typically holds 5 liters, the metric size several import brands use for retail party kegs.',
				],
			},
			{
				heading: 'Two worked examples',
				body: [
					"A half barrel filled with a standard 12 oz can-equivalent pour: 15.5 gal converts to 58,673.9 mL (using the exact US-gallon-to-milliliter factor), and a 12 oz serving is 354.9 mL, so 58,673.9 / 354.9 = 165.3, which rounds down to 165 full servings. Switch the same half barrel to 16 oz US pint pours instead, and the math comes out exact: a half barrel is 1,984 US fluid ounces, and 1,984 / 16 = 124 pints, no rounding needed.",
					"A sixth barrel (sixtel), the size a lot of taprooms use for a rotating tap, holds 31/6 gallons, which is 19,558 mL. At a 12 oz serving that's 55.1, so 55 full pours, matching the same figure published by keg-size guides like Kegerator's Learning Center. Swap in a 20 oz UK imperial pint instead and the count drops to 34, because a UK pint pour holds more liquid than a US pint, not because the keg got smaller.",
				],
			},
			{
				heading: 'US pint vs. UK pint, and how much to budget for waste',
				body: [
					'A "pint" isn\'t a single measurement worldwide. A US pint pour is 16 US fluid ounces (473.2 mL); a UK or Irish imperial pint is 20 imperial fluid ounces (568.3 mL). The imperial fluid ounce is actually the smaller of the two units, about 3.9% less than a US fluid ounce, but a UK pint counts 20 of them against the US pint\'s 16, a 25% bigger count that more than makes up the difference. Net result: an imperial pint holds about 20% more liquid than a US pint. Pick the wrong one and a keg-servings estimate is off by a fifth before anything else changes.',
					"None of the numbers above account for foam and spillage, which is why this calculator has a separate waste-allowance field defaulted to zero rather than baking in an assumed loss. For commercial draft systems, draft-technology vendor BevTeq puts typical bar and restaurant draft-beer waste in the 15-25% range, mostly from foam; the Siebel Institute of Technology's draft-loss guidance points the same direction (a pour that's mostly foam wastes most of its liquid beer) without naming a percentage of its own. Well-maintained systems do better than that range. A home kegerator or party pump, poured by hand into varied glassware, doesn't have a published equivalent figure, so treat that industry range as context for setting your own waste allowance rather than a number this calculator assumes for you.",
				],
			},
		],
		referenceTables: [
			{
				title: 'Standard keg sizes and how many pours they hold',
				headers: ['Keg size', 'Volume', '12 oz servings', '16 oz US pints'],
				rows: [
					['Half barrel ("full keg")', '15.5 gal (58.67 L)', '165', '124'],
					['Quarter barrel (pony keg)', '7.75 gal (29.34 L)', '82', '62'],
					['Sixth barrel (sixtel)', '31/6 gal (19.56 L)', '55', '41'],
					['Corny keg (homebrew)', '5 gal (18.93 L)', '53', '40'],
					['Mini keg (party keg)', '5 L (1.32 gal)', '14', '10'],
				],
				note: 'Source: 27 CFR 25.11 and 25.156 for the half barrel, quarter barrel, sixth barrel, and corny keg volumes; the mini keg\'s 5 L is a common import-brand party-keg size, not a TTB-authorized fraction. Servings independently calculated as floor(volume / serving size) using NIST\'s exact US-gallon and US-fluid-ounce conversion factors, cross-checked against the ~165/~82/~55 figures published by Kegerator\'s Learning Center and The Calculator Site.',
			},
			{
				title: 'Serving size reference',
				headers: ['Serving', 'Fluid ounces', 'Milliliters'],
				rows: [
					['12 oz can/bottle (NIAAA standard drink)', '12 US fl oz', '354.9'],
					['16 oz US pint', '16 US fl oz', '473.2'],
					['20 oz UK/Irish imperial pint', '20 imperial fl oz', '568.3'],
				],
				note: 'US and imperial fluid ounces are different units (1 imperial fl oz = 28.41 mL vs. 1 US fl oz = 29.57 mL), so the milliliter column, not the ounce count, is what actually compares serving sizes across the two systems.',
			},
		],
		faq: [
			{
				question: 'How many beers are in a keg?',
				answer:
					"It depends on the keg size and the serving size. A standard half barrel (15.5 gal, what most people mean by \"a keg\") holds about 165 twelve-ounce beers or 124 sixteen-ounce pints. A quarter barrel holds about 82 twelve-ounce beers, and a sixth barrel (sixtel) holds about 55.",
			},
			{
				question: 'What\'s the difference between a keg and a barrel?',
				answer:
					'A barrel is the legal unit, 31 gallons under 27 CFR 25.11. A keg is a container holding some authorized fraction of that barrel, most commonly a half barrel (15.5 gal) or a quarter barrel (7.75 gal), plus some sizes like the 5-gallon corny keg and metric 30 L/50 L kegs that TTB authorizes separately rather than as a barrel fraction.',
			},
			{
				question: 'How many kegs do I need for a party?',
				answer:
					"Multiply your guest count by expected drinks per guest, then divide by the servings a single keg holds (after any waste allowance), and round up, since a partial keg still means buying the whole thing. This calculator's guest and drinks-per-guest fields do that math automatically once a keg size and serving size are set.",
			},
			{
				question: 'Is a UK pint the same as a US pint?',
				answer:
					'No. A US pint pour is 16 US fluid ounces (473.2 mL). A UK or Irish imperial pint is 20 imperial fluid ounces (568.3 mL). Even though each imperial fluid ounce is slightly smaller than a US one, counting 20 of them instead of 16 still lands an imperial pint about 20% bigger than a US pint, not just "4 more ounces."',
			},
			{
				question: 'Why do keg-serving numbers differ between calculators?',
				answer:
					"Most of the spread comes from rounding conventions and whether a site accounts for foam waste. This calculator rounds full servings down (a partial pour past the last full serving doesn't count) and lets you dial in your own waste percentage instead of assuming one, so a 0% waste result compares directly against the reference figures other keg-size guides publish.",
			},
			{
				question: 'What is a corny keg, and why is it 5 gallons instead of a barrel fraction?',
				answer:
					'A Cornelius or "corny" keg is a 5-gallon stainless container, originally built for soda-fountain syrup, that homebrewers adopted because it\'s cheap, easy to clean, and fits a standard kegerator. TTB authorizes it as a keg size, but it isn\'t a fraction of the 31-gallon barrel the way half, quarter, and sixth barrels are.',
			},
			{
				question: 'How much beer should I budget for foam and spillage?',
				answer:
					"There's no single official figure, and it depends heavily on the dispensing setup. Draft-technology vendor BevTeq puts typical commercial bar and restaurant draft-beer waste in the 15-25% range, mostly from foam, with well-run systems doing better; the Siebel Institute of Technology's draft-loss guidance covers the same foam-waste mechanism without giving its own percentage. A home kegerator or party pump doesn't have a published equivalent, so this calculator defaults its waste field to 0% and leaves the allowance up to you rather than assuming a number.",
			},
		],
		sources: [
			{
				label: '27 CFR § 25.11, Definition of "barrel" (31 US gallons), eCFR (Electronic Code of Federal Regulations)',
				url: 'https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-25/subpart-B/section-25.11',
			},
			{
				label: '27 CFR § 25.156, Determination of tax on keg beer (authorized keg fractions and metric sizes), eCFR',
				url: 'https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-25/subpart-K/subject-group-ECFR13ed4f8cf706222/section-25.156',
			},
			{
				label: 'National Institute on Alcohol Abuse and Alcoholism, "What Is A Standard Drink?" (12 oz beer at ~5% ABV reference)',
				url: 'https://www.niaaa.nih.gov/alcohols-effects-health/overview-alcohol-consumption/what-standard-drink',
			},
			{
				label: 'Siebel Institute of Technology, "How much does wasting draught beer cost a Retailer?" (draft-beer waste range)',
				url: 'https://www.siebelinstitute.com/news/business-and-management/how-much-does-wasting-draught-beer-cost-a-retailer',
			},
		],
		embedHeight: 940,
	},
];
