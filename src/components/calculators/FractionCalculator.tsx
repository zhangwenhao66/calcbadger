import { useState } from 'preact/hooks';
import {
	addFractions,
	decimalStringToFraction,
	divideFractions,
	fractionToDecimal,
	fractionToPercent,
	improperToMixed,
	mixedToImproper,
	multiplyFractions,
	simplifyFraction,
	subtractFractions,
	type Fraction,
} from '../../lib/fractions';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

type Mode = 'operate' | 'simplify' | 'convert';
type Operator = 'add' | 'subtract' | 'multiply' | 'divide';
type ConvertDirection = 'mixedToImproper' | 'improperToMixed' | 'decimalToFraction';

const MODES = [
	{ value: 'operate' as Mode, label: 'Add, subtract, multiply, divide' },
	{ value: 'simplify' as Mode, label: 'Simplify a fraction' },
	{ value: 'convert' as Mode, label: 'Convert (mixed / improper / decimal)' },
];

const OPERATORS = [
	{ value: 'add' as Operator, label: '+' },
	{ value: 'subtract' as Operator, label: '−' },
	{ value: 'multiply' as Operator, label: '×' },
	{ value: 'divide' as Operator, label: '÷' },
];

const CONVERT_DIRECTIONS = [
	{ value: 'mixedToImproper' as ConvertDirection, label: 'Mixed → improper' },
	{ value: 'improperToMixed' as ConvertDirection, label: 'Improper → mixed' },
	{ value: 'decimalToFraction' as ConvertDirection, label: 'Decimal → fraction' },
];

function fmtFraction(f: Fraction): string {
	return `${f.numerator}/${f.denominator}`;
}

function fmtMixed(whole: number, numerator: number, denominator: number): string {
	if (whole === 0) return `${numerator}/${denominator}`;
	return `${whole} ${Math.abs(numerator)}/${denominator}`;
}

function fmtDecimal(n: number, digits = 6): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

function toFinite(value: string, fallback = 0): number {
	const n = parseFloat(value);
	return Number.isFinite(n) ? n : fallback;
}

/** For modes where a blank numerator is treated as invalid (not defaulted to 0), name whichever field is actually missing or invalid, rather than always blaming the denominator. */
function fractionInputNote(numeratorStr: string, denominatorStr: string): string {
	const numeratorOk = Number.isFinite(parseFloat(numeratorStr));
	const denominator = parseFloat(denominatorStr);
	const denominatorOk = Number.isFinite(denominator);
	if (!numeratorOk && !denominatorOk) return 'Enter a numerator and a denominator.';
	if (!numeratorOk) return 'Enter a numerator.';
	if (!denominatorOk) return 'Enter a denominator.';
	if (denominator === 0) return 'Denominator cannot be 0.';
	return 'Enter a numerator and a denominator.';
}

export default function FractionCalculator() {
	const [mode, setMode] = useState<Mode>('operate');

	// "Operate" mode — each fraction can carry an optional whole-number part
	// so mixed numbers (e.g. 2 1/2) work without a separate calculator.
	const [aWhole, setAWhole] = useState('0');
	const [aNum, setANum] = useState('1');
	const [aDenom, setADenom] = useState('2');
	const [operator, setOperator] = useState<Operator>('add');
	const [bWhole, setBWhole] = useState('0');
	const [bNum, setBNum] = useState('1');
	const [bDenom, setBDenom] = useState('3');

	// "Simplify" mode
	const [sNum, setSNum] = useState('8');
	const [sDenom, setSDenom] = useState('12');

	// "Convert" mode
	const [direction, setDirection] = useState<ConvertDirection>('mixedToImproper');
	const [cWhole, setCWhole] = useState('2');
	const [cNum, setCNum] = useState('3');
	const [cDenom, setCDenom] = useState('4');
	const [cImpNum, setCImpNum] = useState('11');
	const [cImpDenom, setCImpDenom] = useState('4');
	const [cDecimal, setCDecimal] = useState('0.75');

	// --- Operate ---
	const aFraction = mixedToImproper(toFinite(aWhole), toFinite(aNum), toFinite(aDenom, NaN));
	const bFraction = mixedToImproper(toFinite(bWhole), toFinite(bNum), toFinite(bDenom, NaN));
	let opResult: Fraction | null = null;
	if (aFraction && bFraction) {
		if (operator === 'add') opResult = addFractions(aFraction, bFraction);
		else if (operator === 'subtract') opResult = subtractFractions(aFraction, bFraction);
		else if (operator === 'multiply') opResult = multiplyFractions(aFraction, bFraction);
		else opResult = divideFractions(aFraction, bFraction);
	}
	const opMixed = opResult ? improperToMixed(opResult.numerator, opResult.denominator) : null;
	const opDecimal = opResult ? fractionToDecimal(opResult.numerator, opResult.denominator) : null;

	// --- Simplify ---
	const simplifyResult = simplifyFraction(toFinite(sNum, NaN), toFinite(sDenom, NaN));
	const simplifyDecimal = simplifyResult ? fractionToDecimal(simplifyResult.numerator, simplifyResult.denominator) : null;
	const simplifyPercent = simplifyResult ? fractionToPercent(simplifyResult.numerator, simplifyResult.denominator) : null;

	// --- Convert ---
	const mixedToImproperResult =
		direction === 'mixedToImproper' ? mixedToImproper(toFinite(cWhole), toFinite(cNum), toFinite(cDenom, NaN)) : null;
	const improperToMixedResult =
		direction === 'improperToMixed' ? improperToMixed(toFinite(cImpNum, NaN), toFinite(cImpDenom, NaN)) : null;
	const decimalResult = direction === 'decimalToFraction' ? decimalStringToFraction(cDecimal) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select label="Calculator" value={mode} onChange={setMode} options={MODES} wide />

				{mode === 'operate' && (
					<>
						<NumberField label="Fraction A: whole" value={aWhole} onChange={setAWhole} step={1} />
						<NumberField label="Fraction A: numerator" value={aNum} onChange={setANum} step={1} />
						<NumberField label="Fraction A: denominator" value={aDenom} onChange={setADenom} step={1} />
						<Segmented label="Operation" value={operator} onChange={setOperator} options={OPERATORS} wide />
						<NumberField label="Fraction B: whole" value={bWhole} onChange={setBWhole} step={1} />
						<NumberField label="Fraction B: numerator" value={bNum} onChange={setBNum} step={1} />
						<NumberField label="Fraction B: denominator" value={bDenom} onChange={setBDenom} step={1} />
					</>
				)}

				{mode === 'simplify' && (
					<>
						<NumberField label="Numerator" value={sNum} onChange={setSNum} step={1} />
						<NumberField label="Denominator" value={sDenom} onChange={setSDenom} step={1} />
					</>
				)}

				{mode === 'convert' && (
					<>
						<Select label="Direction" value={direction} onChange={setDirection} options={CONVERT_DIRECTIONS} wide />
						{direction === 'mixedToImproper' && (
							<>
								<NumberField label="Whole" value={cWhole} onChange={setCWhole} step={1} />
								<NumberField label="Numerator" value={cNum} onChange={setCNum} step={1} />
								<NumberField label="Denominator" value={cDenom} onChange={setCDenom} step={1} />
							</>
						)}
						{direction === 'improperToMixed' && (
							<>
								<NumberField label="Numerator" value={cImpNum} onChange={setCImpNum} step={1} />
								<NumberField label="Denominator" value={cImpDenom} onChange={setCImpDenom} step={1} />
							</>
						)}
						{direction === 'decimalToFraction' && (
							<NumberField label="Decimal" value={cDecimal} onChange={setCDecimal} step={0.01} />
						)}
					</>
				)}
			</div>

			{mode === 'operate' &&
				(opResult ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Result</p>
							<p class="calc-result-value primary">{fmtFraction(opResult)}</p>
						</div>
						{opMixed && opMixed.whole !== 0 && (
							<div>
								<p class="calc-result-label">As a mixed number</p>
								<p class="calc-result-value">{fmtMixed(opMixed.whole, opMixed.numerator, opMixed.denominator)}</p>
							</div>
						)}
						{opDecimal !== null && (
							<div>
								<p class="calc-result-label">As a decimal</p>
								<p class="calc-result-value">{fmtDecimal(opDecimal)}</p>
							</div>
						)}
					</div>
				) : (
					<p class="calc-note">
						{operator === 'divide' && bFraction?.numerator === 0
							? 'Dividing by zero is undefined. Fraction B cannot equal 0.'
							: 'Denominators cannot be 0. Enter a non-zero denominator for both fractions.'}
					</p>
				))}

			{mode === 'simplify' &&
				(simplifyResult ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Simplified</p>
							<p class="calc-result-value primary">{fmtFraction(simplifyResult)}</p>
						</div>
						{simplifyDecimal !== null && (
							<div>
								<p class="calc-result-label">Decimal</p>
								<p class="calc-result-value">{fmtDecimal(simplifyDecimal)}</p>
							</div>
						)}
						{simplifyPercent !== null && (
							<div>
								<p class="calc-result-label">Percent</p>
								<p class="calc-result-value">{fmtDecimal(simplifyPercent, 4)}%</p>
							</div>
						)}
					</div>
				) : (
					<p class="calc-note">{fractionInputNote(sNum, sDenom)}</p>
				))}

			{mode === 'convert' && (
				<>
					{direction === 'mixedToImproper' &&
						(mixedToImproperResult ? (
							<div class="calc-results">
								<div>
									<p class="calc-result-label">Improper fraction</p>
									<p class="calc-result-value primary">{fmtFraction(mixedToImproperResult)}</p>
								</div>
							</div>
						) : (
							<p class="calc-note">Denominator cannot be 0.</p>
						))}
					{direction === 'improperToMixed' &&
						(improperToMixedResult ? (
							<div class="calc-results">
								<div>
									<p class="calc-result-label">Mixed number</p>
									<p class="calc-result-value primary">
										{fmtMixed(improperToMixedResult.whole, improperToMixedResult.numerator, improperToMixedResult.denominator)}
									</p>
								</div>
							</div>
						) : (
							<p class="calc-note">{fractionInputNote(cImpNum, cImpDenom)}</p>
						))}
					{direction === 'decimalToFraction' &&
						(decimalResult ? (
							<div class="calc-results">
								<div>
									<p class="calc-result-label">Fraction</p>
									<p class="calc-result-value primary">{fmtFraction(decimalResult)}</p>
								</div>
							</div>
						) : (
							<p class="calc-note">Enter a plain decimal number, e.g. 0.75 or -2.5.</p>
						))}
				</>
			)}

			<p class="calc-note">
				Every result is reduced to lowest terms by dividing both terms by their greatest common
				divisor, found with the Euclidean algorithm. Mixed-number inputs are converted to an
				improper fraction first, so 2 1/2 and 5/2 behave identically in every mode. Calculations
				run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
