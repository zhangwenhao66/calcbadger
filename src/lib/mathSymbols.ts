/**
 * Common math symbols with meaning, typical use, and a short verified
 * history note. Restricted to symbols with independently corroborated
 * origin stories. See sources cited in tools.ts for this page.
 */

export interface MathSymbol {
	name: string;
	symbol: string;
	codePoint: string;
	meaning: string;
	commonUse: string;
	history: string;
}

export const MATH_SYMBOLS: readonly MathSymbol[] = [
	{
		name: 'Plus-Minus',
		symbol: '±',
		codePoint: 'U+00B1',
		meaning: 'Plus or minus: two values, one added and one subtracted',
		commonUse: 'Margins of error and engineering tolerances, and the quadratic formula, where it produces both roots at once',
		history:
			'Introduced by William Oughtred in his 1631 book Clavis Mathematicae, the same book that gave math the × sign.',
	},
	{
		name: 'Multiplication',
		symbol: '×',
		codePoint: 'U+00D7',
		meaning: 'Times, or multiplied by',
		commonUse: 'Multiplication in printed math, chosen over a plain letter x to avoid confusion with the variable x',
		history:
			"First appears in a 1618 appendix (attributed to Oughtred) to an edition of Napier's logarithm tables, then in Oughtred's own 1631 Clavis Mathematicae.",
	},
	{
		name: 'Division',
		symbol: '÷',
		codePoint: 'U+00F7',
		meaning: 'Divided by',
		commonUse: 'Division in arithmetic, especially in US and UK schooling (many other countries prefer a colon or a fraction slash)',
		history:
			'Johann Rahn repurposed the obelus, until then a subtraction sign, for division in his 1659 book Teutsche Algebra. Historians still debate whether Rahn or his collaborator John Pell deserves the credit.',
	},
	{
		name: 'Greater Than or Equal To',
		symbol: '≥',
		codePoint: 'U+2265',
		meaning: 'The left value is greater than or equal to the right value',
		commonUse: 'Setting a minimum in an inequality, and in code as a comparison operator (some languages spell it >= instead)',
		history:
			"French mathematician Pierre Bouguer added a line under Thomas Harriot's 1631 greater-than sign to create this combined symbol in 1734.",
	},
	{
		name: 'Less Than or Equal To',
		symbol: '≤',
		codePoint: 'U+2264',
		meaning: 'The left value is less than or equal to the right value',
		commonUse: 'Setting a maximum in an inequality, or checking that a value falls inside a range',
		history: "Introduced alongside ≥ by Pierre Bouguer in 1734, using the same under-the-symbol line on Harriot's less-than sign.",
	},
	{
		name: 'Approximately Equal To',
		symbol: '≈',
		codePoint: 'U+2248',
		meaning: 'The two values are close but not exactly equal',
		commonUse: 'Rounded results and physical constants, as in π ≈ 3.14159',
		history:
			'Mathematicians marked "approximately" with dots, dashes, or a single wavy line for centuries before the double-wavy-line ≈ settled into standard use in the late 1800s.',
	},
	{
		name: 'Square Root',
		symbol: '√',
		codePoint: 'U+221A',
		meaning: 'The radical sign, asking what number times itself gives this value',
		commonUse: 'Finding a side length from a known area, and inside the quadratic formula',
		history:
			'German mathematician Christoff Rudolff introduced this symbol in his 1525 algebra textbook Die Coss. Most historians trace its hook shape to a stylized lowercase "r," for the Latin radix, meaning root.',
	},
	{
		name: 'Squared',
		symbol: '²',
		codePoint: 'U+00B2',
		meaning: 'Superscript 2: a value raised to the second power',
		commonUse: 'Area units such as m² or ft², and the Pythagorean theorem',
		history:
			'René Descartes introduced writing exponents as small superscript numbers in his 1637 La Géométrie, though Descartes himself usually still wrote "zz" rather than "z²" for a squared term.',
	},
	{
		name: 'Cubed',
		symbol: '³',
		codePoint: 'U+00B3',
		meaning: 'Superscript 3: a value raised to the third power',
		commonUse: 'Volume units such as m³ or ft³, cubic equations',
		history: 'Part of the same superscript exponent notation Descartes introduced in his 1637 La Géométrie.',
	},
	{
		name: 'Degree',
		symbol: '°',
		codePoint: 'U+00B0',
		meaning: 'One 360th of a full turn, or a degree of temperature',
		commonUse: 'Angles in geometry and navigation, temperature scales like °F and °C, and geographic coordinates',
		history:
			'The 360-degree circle traces back to Babylonian base-60 astronomy. The small raised circle for "degree" became standard in European mathematical printing by the 17th century.',
	},
	{
		name: 'Infinity',
		symbol: '∞',
		codePoint: 'U+221E',
		meaning: 'An unbounded, never-ending quantity',
		commonUse: 'Limits in calculus, the size of infinite sets, unbounded ranges in interval notation',
		history:
			"John Wallis introduced this symbol in his 1655 treatise De sectionibus conicis. Its horizontal figure-eight shape is usually explained as a stylized Roman numeral for 1,000 or the Greek letter omega (ω), the last letter of that alphabet.",
	},
	{
		name: 'Therefore',
		symbol: '∴',
		codePoint: 'U+2234',
		meaning: 'Introduces a logical conclusion: "it follows that"',
		commonUse: 'Proofs in logic and mathematics, and informal shorthand notes',
		history:
			'Johann Rahn used this three-dot triangle in the same 1659 Teutsche Algebra that introduced ÷. One book, two symbols still in daily use.',
	},
];

/** Filters the symbol list by name, glyph, meaning, or common-use text (case-insensitive). */
export function filterMathSymbols(symbols: readonly MathSymbol[], query: string): MathSymbol[] {
	const q = query.trim().toLowerCase();
	if (!q) return [...symbols];
	return symbols.filter(
		(s) =>
			s.name.toLowerCase().includes(q) ||
			s.symbol === query.trim() ||
			s.meaning.toLowerCase().includes(q) ||
			s.commonUse.toLowerCase().includes(q),
	);
}
