/**
 * Body Mass Index.
 *
 * Formula authority: CDC, "About Adult BMI" (cdc.gov/bmi/adult-calculator,
 * cdc.gov/bmi/faq) — BMI = weight(kg) / height(m)^2; the imperial shortcut
 * 703 * weight(lb) / height(in)^2 is CDC's own rounded conversion factor
 * (exact factor is 1 lb-in^-2 = kg-m^-2 * 703.07..., so the two unit paths
 * differ by a few thousandths of a BMI point — expected, not a bug).
 *
 * Classification authority:
 * - "who" (also CDC's adult categories): underweight <18.5, healthy weight
 *   18.5–24.9, overweight 25–29.9, obesity >=30 (Class 1 30–34.9, Class 2
 *   35–39.9, Class 3 >=40). Same cutoffs for adults regardless of sex.
 * - "asian": WHO Expert Consultation, "Appropriate body-mass index for
 *   Asian populations and its implications for policy and intervention
 *   strategies," Lancet 2004;363:157-63 — public health action points at
 *   23.0 (overweight/increased risk) and 27.5 (obese/high risk).
 */

export type Standard = 'who' | 'asian';

export function bmiMetric(weightKg: number, heightCm: number): number {
	const heightM = heightCm / 100;
	return weightKg / (heightM * heightM);
}

export function bmiImperial(weightLb: number, heightIn: number): number {
	return (703 * weightLb) / (heightIn * heightIn);
}

export interface BmiCategory {
	label: string;
	className: 'underweight' | 'healthy' | 'overweight' | 'obese';
}

const WHO_CUTOFFS: [number, BmiCategory][] = [
	[18.5, { label: 'Underweight', className: 'underweight' }],
	[25, { label: 'Healthy weight', className: 'healthy' }],
	[30, { label: 'Overweight', className: 'overweight' }],
	[35, { label: 'Obesity (Class 1)', className: 'obese' }],
	[40, { label: 'Obesity (Class 2)', className: 'obese' }],
	[Infinity, { label: 'Obesity (Class 3)', className: 'obese' }],
];

const ASIAN_CUTOFFS: [number, BmiCategory][] = [
	[18.5, { label: 'Underweight', className: 'underweight' }],
	[23, { label: 'Healthy weight', className: 'healthy' }],
	[27.5, { label: 'Overweight (increased risk)', className: 'overweight' }],
	[Infinity, { label: 'Obese (high risk)', className: 'obese' }],
];

export function classifyBmi(bmi: number, standard: Standard): BmiCategory {
	const table = standard === 'asian' ? ASIAN_CUTOFFS : WHO_CUTOFFS;
	for (const [ceiling, category] of table) {
		if (bmi < ceiling) return category;
	}
	return table[table.length - 1]![1];
}

/** The BMI band CDC/WHO label "healthy weight" for a given standard. */
function healthyBand(standard: Standard): { min: number; max: number } {
	return standard === 'asian' ? { min: 18.5, max: 22.9 } : { min: 18.5, max: 24.9 };
}

export function healthyWeightRangeKg(
	heightCm: number,
	standard: Standard,
): { min: number; max: number } {
	const heightM = heightCm / 100;
	const { min, max } = healthyBand(standard);
	return { min: min * heightM * heightM, max: max * heightM * heightM };
}

export function healthyWeightRangeLb(
	heightIn: number,
	standard: Standard,
): { min: number; max: number } {
	const { min, max } = healthyBand(standard);
	return { min: (min * heightIn * heightIn) / 703, max: (max * heightIn * heightIn) / 703 };
}
