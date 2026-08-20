import { useState } from 'preact/hooks';
import { roundToPlaceValue, roundToSignificantFigures, toExponentialForm, type RoundingMethod } from '../../lib/rounding';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

type Mode = 'decimal' | 'sigfig';

const MODES = [
	{ value: 'decimal' as Mode, label: 'Decimal places' },
	{ value: 'sigfig' as Mode, label: 'Significant figures' },
];

const PLACE_PRESETS = [
	{ value: '3', label: 'Nearest 1,000' },
	{ value: '2', label: 'Nearest 100' },
	{ value: '1', label: 'Nearest 10' },
	{ value: '0', label: 'Nearest whole number' },
	{ value: '-1', label: 'Nearest tenth (0.1)' },
	{ value: '-2', label: 'Nearest hundredth (0.01)' },
	{ value: '-3', label: 'Nearest thousandth (0.001)' },
	{ value: 'custom', label: 'Custom decimal places…' },
];

const METHODS: Array<{ value: RoundingMethod; label: string }> = [
	{ value: 'half-up', label: 'Half up (ties toward +∞), most common default' },
	{ value: 'half-away-from-zero', label: 'Half away from zero (symmetric, common in finance)' },
	{ value: 'half-to-even', label: "Half to even, banker's rounding (IEEE 754 default)" },
	{ value: 'half-down', label: 'Half down (ties toward −∞)' },
	{ value: 'ceiling', label: 'Always up (ceiling)' },
	{ value: 'floor', label: 'Always down (floor)' },
	{ value: 'truncate', label: 'Truncate (chop, toward zero)' },
];

function methodLabel(method: RoundingMethod): string {
	return METHODS.find((m) => m.value === method)?.label ?? method;
}

export default function RoundingCalculator() {
	const [mode, setMode] = useState<Mode>('decimal');
	const [inputValue, setInputValue] = useState('1.005');
	const [placePreset, setPlacePreset] = useState('-2');
	const [customPlaces, setCustomPlaces] = useState('4');
	const [sigFigs, setSigFigs] = useState('3');
	const [method, setMethod] = useState<RoundingMethod>('half-up');

	// PLACE_PRESETS values are already the target placeExponent (e.g. '-2' =
	// "Nearest hundredth" = round to 10^-2). Only the Custom field is a
	// decimal-places COUNT, which needs negating to become an exponent.
	const placeExponent = placePreset === 'custom' ? -parseInt(customPlaces, 10) : parseInt(placePreset, 10);
	const sigFigsNum = parseInt(sigFigs, 10);

	const result =
		mode === 'decimal'
			? Number.isFinite(placeExponent)
				? roundToPlaceValue(inputValue, placeExponent, method)
				: null
			: Number.isFinite(sigFigsNum) && sigFigsNum >= 1
				? roundToSignificantFigures(inputValue, sigFigsNum, method)
				: null;

	const requestedButUnavailable = result !== null && mode === 'decimal' && result.placeExponent !== placeExponent;

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField label="Number to round" value={inputValue} onChange={setInputValue} step={0.001} inputMode="decimal" />
				<Segmented label="Round by" value={mode} onChange={setMode} options={MODES} />

				{mode === 'decimal' && (
					<>
						<Select label="Round to" value={placePreset} onChange={setPlacePreset} options={PLACE_PRESETS} wide />
						{placePreset === 'custom' && (
							<NumberField label="Decimal places" value={customPlaces} onChange={setCustomPlaces} min={-6} max={10} step={1} />
						)}
					</>
				)}

				{mode === 'sigfig' && (
					<NumberField label="Significant figures" value={sigFigs} onChange={setSigFigs} min={1} max={15} step={1} />
				)}

				<Select label="Rounding method" value={method} onChange={setMethod} options={METHODS} wide />
			</div>

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Rounded result</p>
						<p class="calc-result-value primary">{result.formatted}</p>
					</div>
					<div>
						<p class="calc-result-label">Original value</p>
						<p class="calc-result-value">{inputValue}</p>
					</div>
					<div>
						<p class="calc-result-label">Method used</p>
						<p class="calc-result-value">{methodLabel(method)}</p>
					</div>
					{mode === 'sigfig' && (
						<div>
							<p class="calc-result-label">Scientific notation ({sigFigsNum} sig figs)</p>
							<p class="calc-result-value">{toExponentialForm(result, sigFigsNum)}</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Enter a plain number (no scientific notation) and choose a precision above.</p>
			)}

			{result !== null && requestedButUnavailable && (
				<p class="calc-note">
					"{inputValue}" already has fewer digits than the precision you asked for, so there is nothing to round away.
					The value is shown as entered rather than padded with digits that were never given.
				</p>
			)}

			{result !== null && result.wasExactTie && (
				<p class="calc-note">
					{inputValue} sits exactly halfway at this precision, so the result depends entirely on the tie-breaking
					method chosen above. Switch methods to see the other valid answer.
				</p>
			)}

			<p class="calc-note">
				This calculator rounds the exact decimal digits you type, not a binary floating-point approximation of
				them, so results always match what the digits themselves say, even in the classic 1.005-to-2-decimals
				case where naive floating-point math gets it wrong. Calculations run in your browser; nothing you type is
				sent anywhere.
			</p>
		</div>
	);
}
