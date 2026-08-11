/**
 * The 24 letters of the modern Greek alphabet, in order.
 *
 * Unicode code points come from the Greek and Coptic block (U+0370–U+03FF):
 * uppercase runs U+0391–U+03A9 with U+03A2 left unassigned (a reserved gap,
 * not a missing letter — see https://unicode.org/charts/PDF/U0370.pdf),
 * lowercase runs U+03B1–U+03C9. Sigma is the only letter with two lowercase
 * forms: U+03C3 (σ) used within a word and U+03C2 (ς), the "final sigma,"
 * used only when sigma is the last letter of a word.
 */

export interface GreekLetter {
	name: string;
	uppercase: string;
	lowercase: string;
	/** Final form, only set for sigma. */
	finalForm?: string;
	upperCodePoint: string;
	lowerCodePoint: string;
	pronunciation: string;
	commonUse: string;
}

export const GREEK_LETTERS: readonly GreekLetter[] = [
	{
		name: 'Alpha',
		uppercase: 'Α',
		lowercase: 'α',
		upperCodePoint: 'U+0391',
		lowerCodePoint: 'U+03B1',
		pronunciation: 'AL-fuh',
		commonUse: 'Angles; significance level in statistics; alpha particles in physics',
	},
	{
		name: 'Beta',
		uppercase: 'Β',
		lowercase: 'β',
		upperCodePoint: 'U+0392',
		lowerCodePoint: 'U+03B2',
		pronunciation: 'BAY-tuh',
		commonUse: 'Angles; regression coefficients in statistics; beta particles in physics',
	},
	{
		name: 'Gamma',
		uppercase: 'Γ',
		lowercase: 'γ',
		upperCodePoint: 'U+0393',
		lowerCodePoint: 'U+03B3',
		pronunciation: 'GAM-uh',
		commonUse: 'The gamma function in math; gamma rays in physics; specific weight in engineering',
	},
	{
		name: 'Delta',
		uppercase: 'Δ',
		lowercase: 'δ',
		upperCodePoint: 'U+0394',
		lowerCodePoint: 'U+03B4',
		pronunciation: 'DEL-tuh',
		commonUse: 'Uppercase Δ for change or difference (ΔT); lowercase δ for small changes and the Dirac delta function',
	},
	{
		name: 'Epsilon',
		uppercase: 'Ε',
		lowercase: 'ε',
		upperCodePoint: 'U+0395',
		lowerCodePoint: 'U+03B5',
		pronunciation: 'EP-suh-lon',
		commonUse: 'An arbitrarily small positive quantity in calculus proofs; strain in engineering',
	},
	{
		name: 'Zeta',
		uppercase: 'Ζ',
		lowercase: 'ζ',
		upperCodePoint: 'U+0396',
		lowerCodePoint: 'U+03B6',
		pronunciation: 'ZAY-tuh',
		commonUse: 'The Riemann zeta function; damping ratio in control systems',
	},
	{
		name: 'Eta',
		uppercase: 'Η',
		lowercase: 'η',
		upperCodePoint: 'U+0397',
		lowerCodePoint: 'U+03B7',
		pronunciation: 'AY-tuh',
		commonUse: 'Efficiency in physics and engineering; viscosity (dynamic viscosity)',
	},
	{
		name: 'Theta',
		uppercase: 'Θ',
		lowercase: 'θ',
		upperCodePoint: 'U+0398',
		lowerCodePoint: 'U+03B8',
		pronunciation: 'THAY-tuh',
		commonUse: 'Angles, especially in trigonometry and polar coordinates',
	},
	{
		name: 'Iota',
		uppercase: 'Ι',
		lowercase: 'ι',
		upperCodePoint: 'U+0399',
		lowerCodePoint: 'U+03B9',
		pronunciation: 'eye-OH-tuh',
		commonUse: 'Index variables in math; the source of the English phrase "not one iota" (not the smallest amount)',
	},
	{
		name: 'Kappa',
		uppercase: 'Κ',
		lowercase: 'κ',
		upperCodePoint: 'U+039A',
		lowerCodePoint: 'U+03BA',
		pronunciation: 'KAP-uh',
		commonUse: 'Curvature in geometry; spring constant in physics; dielectric constant',
	},
	{
		name: 'Lambda',
		uppercase: 'Λ',
		lowercase: 'λ',
		upperCodePoint: 'U+039B',
		lowerCodePoint: 'U+03BB',
		pronunciation: 'LAM-duh',
		commonUse: 'Wavelength in physics; eigenvalues in linear algebra; lambda calculus in computer science',
	},
	{
		name: 'Mu',
		uppercase: 'Μ',
		lowercase: 'μ',
		upperCodePoint: 'U+039C',
		lowerCodePoint: 'U+03BC',
		pronunciation: 'MEW',
		commonUse: 'The "micro-" unit prefix (µm); population mean in statistics; coefficient of friction',
	},
	{
		name: 'Nu',
		uppercase: 'Ν',
		lowercase: 'ν',
		upperCodePoint: 'U+039D',
		lowerCodePoint: 'U+03BD',
		pronunciation: 'NEW',
		commonUse: 'Frequency in physics; kinematic viscosity',
	},
	{
		name: 'Xi',
		uppercase: 'Ξ',
		lowercase: 'ξ',
		upperCodePoint: 'U+039E',
		lowerCodePoint: 'U+03BE',
		pronunciation: 'ZY or KSEE',
		commonUse: 'Random variables in probability; the Xi baryon in particle physics',
	},
	{
		name: 'Omicron',
		uppercase: 'Ο',
		lowercase: 'ο',
		upperCodePoint: 'U+039F',
		lowerCodePoint: 'U+03BF',
		pronunciation: 'OM-ih-kron',
		commonUse: 'Rarely used as a math symbol since it looks identical to the letter O',
	},
	{
		name: 'Pi',
		uppercase: 'Π',
		lowercase: 'π',
		upperCodePoint: 'U+03A0',
		lowerCodePoint: 'U+03C0',
		pronunciation: 'PIE',
		commonUse: "Lowercase π for the ratio of a circle's circumference to its diameter (≈3.14159); uppercase Π for a product series",
	},
	{
		name: 'Rho',
		uppercase: 'Ρ',
		lowercase: 'ρ',
		upperCodePoint: 'U+03A1',
		lowerCodePoint: 'U+03C1',
		pronunciation: 'ROH',
		commonUse: 'Density in physics; resistivity; the correlation coefficient in statistics',
	},
	{
		name: 'Sigma',
		uppercase: 'Σ',
		lowercase: 'σ',
		finalForm: 'ς',
		upperCodePoint: 'U+03A3',
		lowerCodePoint: 'U+03C3',
		pronunciation: 'SIG-muh',
		commonUse: 'Uppercase Σ for a summation series; lowercase σ for standard deviation and mechanical stress',
	},
	{
		name: 'Tau',
		uppercase: 'Τ',
		lowercase: 'τ',
		upperCodePoint: 'U+03A4',
		lowerCodePoint: 'U+03C4',
		pronunciation: 'TAW or TOW (rhymes with cow)',
		commonUse: 'Torque in physics; time constants in engineering; shear stress',
	},
	{
		name: 'Upsilon',
		uppercase: 'Υ',
		lowercase: 'υ',
		upperCodePoint: 'U+03A5',
		lowerCodePoint: 'U+03C5',
		pronunciation: 'UP-suh-lon',
		commonUse: 'Rare outside particle physics, where it names the upsilon meson',
	},
	{
		name: 'Phi',
		uppercase: 'Φ',
		lowercase: 'φ',
		upperCodePoint: 'U+03A6',
		lowerCodePoint: 'U+03C6',
		pronunciation: 'FEE or FY',
		commonUse: 'The golden ratio (≈1.61803); angles; electric potential and magnetic flux',
	},
	{
		name: 'Chi',
		uppercase: 'Χ',
		lowercase: 'χ',
		upperCodePoint: 'U+03A7',
		lowerCodePoint: 'U+03C7',
		pronunciation: 'KAI (rhymes with sky)',
		commonUse: 'The chi-squared statistic; magnetic susceptibility',
	},
	{
		name: 'Psi',
		uppercase: 'Ψ',
		lowercase: 'ψ',
		upperCodePoint: 'U+03A8',
		lowerCodePoint: 'U+03C8',
		pronunciation: 'SIGH or PSY',
		commonUse: "A quantum-mechanical wave function; the psi particle in physics",
	},
	{
		name: 'Omega',
		uppercase: 'Ω',
		lowercase: 'ω',
		upperCodePoint: 'U+03A9',
		lowerCodePoint: 'U+03C9',
		pronunciation: 'oh-MAY-guh or oh-MEG-uh',
		commonUse: 'Uppercase Ω for electrical resistance (ohms); lowercase ω for angular velocity',
	},
];

/** Filters the letter list by name, glyph, or common-use text (case-insensitive). */
export function filterGreekLetters(letters: readonly GreekLetter[], query: string): GreekLetter[] {
	const q = query.trim().toLowerCase();
	if (!q) return [...letters];
	return letters.filter(
		(letter) =>
			letter.name.toLowerCase().includes(q) ||
			letter.uppercase === query.trim() ||
			letter.lowercase === query.trim() ||
			letter.finalForm === query.trim() ||
			letter.commonUse.toLowerCase().includes(q),
	);
}
