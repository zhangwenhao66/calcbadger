import { useState } from 'preact/hooks';
import {
	applyDiscount,
	partAsPercentOfWhole,
	percentChange,
	percentDifference,
	percentOfWhole,
	wholeFromPartAndPercent,
} from '../../lib/percentage';
import NumberField from '../ui/NumberField';
import Select from '../ui/Select';

type Mode = 'find' | 'change' | 'discount' | 'diff';
type SolveFor = 'part' | 'percent' | 'whole';

// Full descriptive labels — a Select (not Segmented) because these are
// distinct calculators, not a short key row; a 4-way Segmented with labels
// this long would ellipsis-truncate below the 560px two-column breakpoint.
const MODES = [
	{ value: 'find' as Mode, label: 'Basic percentage' },
	{ value: 'change' as Mode, label: 'Percentage change' },
	{ value: 'discount' as Mode, label: 'Percent off (discount)' },
	{ value: 'diff' as Mode, label: 'Percent difference' },
];

const SOLVE_FOR = [
	{ value: 'part' as SolveFor, label: 'Find the part' },
	{ value: 'percent' as SolveFor, label: 'Find the percent' },
	{ value: 'whole' as SolveFor, label: 'Find the whole' },
];

function fmt(n: number, digits = 2): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function PercentageCalculator() {
	const [mode, setMode] = useState<Mode>('find');

	// "Find a Value" mode
	const [solveFor, setSolveFor] = useState<SolveFor>('part');
	const [findPercent, setFindPercent] = useState('20');
	const [findPart, setFindPart] = useState('10');
	const [findWhole, setFindWhole] = useState('50');

	// "% Change" mode
	const [oldValue, setOldValue] = useState('50');
	const [newValue, setNewValue] = useState('60');

	// "% Off" mode
	const [originalPrice, setOriginalPrice] = useState('100');
	const [discountPercent, setDiscountPercent] = useState('20');

	// "% Difference" mode
	const [diffA, setDiffA] = useState('10');
	const [diffB, setDiffB] = useState('12');

	const percentNum = parseFloat(findPercent);
	const partNum = parseFloat(findPart);
	const wholeNum = parseFloat(findWhole);

	let findResult: { label: string; value: number | null; suffix: string } | null = null;
	if (solveFor === 'part' && Number.isFinite(percentNum) && Number.isFinite(wholeNum)) {
		findResult = { label: 'Part', value: percentOfWhole(percentNum, wholeNum), suffix: '' };
	} else if (solveFor === 'percent' && Number.isFinite(partNum) && Number.isFinite(wholeNum)) {
		findResult = { label: 'Percent', value: partAsPercentOfWhole(partNum, wholeNum), suffix: '%' };
	} else if (solveFor === 'whole' && Number.isFinite(partNum) && Number.isFinite(percentNum)) {
		findResult = { label: 'Whole', value: wholeFromPartAndPercent(partNum, percentNum), suffix: '' };
	}

	const oldNum = parseFloat(oldValue);
	const newNum = parseFloat(newValue);
	const changeResult =
		Number.isFinite(oldNum) && Number.isFinite(newNum) ? percentChange(oldNum, newNum) : null;

	const originalNum = parseFloat(originalPrice);
	const discountNum = parseFloat(discountPercent);
	// A discount over 100% (or a negative price) would produce a negative sale
	// price, which isn't a real discount — the min/max on NumberField only
	// clamps the +/- steppers, not typed/pasted input, so this is validated
	// again here before the result is computed.
	const discountValid =
		Number.isFinite(originalNum) && originalNum >= 0 && Number.isFinite(discountNum) && discountNum <= 100;
	const discountResult = discountValid ? applyDiscount(originalNum, discountNum) : null;

	const aNum = parseFloat(diffA);
	const bNum = parseFloat(diffB);
	const diffResult = Number.isFinite(aNum) && Number.isFinite(bNum) ? percentDifference(aNum, bNum) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select label="Calculator" value={mode} onChange={setMode} options={MODES} wide />

				{mode === 'find' && (
					<>
						<Select label="Solve for" value={solveFor} onChange={setSolveFor} options={SOLVE_FOR} wide />
						{solveFor !== 'percent' && (
							<NumberField label="Percent" unit="%" value={findPercent} onChange={setFindPercent} step={1} />
						)}
						{solveFor !== 'part' && (
							<NumberField label="Part" value={findPart} onChange={setFindPart} step={1} />
						)}
						{solveFor !== 'whole' && (
							<NumberField label="Whole" value={findWhole} onChange={setFindWhole} step={1} />
						)}
					</>
				)}

				{mode === 'change' && (
					<>
						<NumberField label="Old value" value={oldValue} onChange={setOldValue} step={1} />
						<NumberField label="New value" value={newValue} onChange={setNewValue} step={1} />
					</>
				)}

				{mode === 'discount' && (
					<>
						<NumberField
							label="Original price"
							unit="$"
							value={originalPrice}
							onChange={setOriginalPrice}
							min={0}
							step={1}
						/>
						<NumberField
							label="Discount"
							unit="%"
							value={discountPercent}
							onChange={setDiscountPercent}
							min={0}
							max={100}
							step={1}
						/>
					</>
				)}

				{mode === 'diff' && (
					<>
						<NumberField label="Value A" value={diffA} onChange={setDiffA} step={1} />
						<NumberField label="Value B" value={diffB} onChange={setDiffB} step={1} />
					</>
				)}
			</div>

			{mode === 'find' &&
				(findResult && findResult.value !== null ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">{findResult.label}</p>
							<p class="calc-result-value primary">
								{fmt(findResult.value, 4)}
								{findResult.suffix}
							</p>
						</div>
					</div>
				) : (
					<p class="calc-note">
						{solveFor === 'percent'
							? 'Whole cannot be 0 — enter a non-zero whole.'
							: solveFor === 'whole'
								? 'Percent cannot be 0 — enter a non-zero percent.'
								: 'Enter the two known values.'}
					</p>
				))}

			{mode === 'change' &&
				(changeResult !== null ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">{changeResult >= 0 ? 'Increase' : 'Decrease'}</p>
							<p class="calc-result-value primary">
								{changeResult >= 0 ? '+' : ''}
								{fmt(changeResult, 4)}%
							</p>
						</div>
						<div>
							<p class="calc-result-label">Difference</p>
							<p class="calc-result-value">{fmt(newNum - oldNum, 4)}</p>
						</div>
					</div>
				) : (
					<p class="calc-note">Old value cannot be 0 — there is no base to measure a change from.</p>
				))}

			{mode === 'discount' &&
				(discountResult ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Sale price</p>
							<p class="calc-result-value primary">${fmt(discountResult.salePrice)}</p>
						</div>
						<div>
							<p class="calc-result-label">{discountResult.amountSaved >= 0 ? 'Amount saved' : 'Amount added'}</p>
							<p class="calc-result-value">${fmt(Math.abs(discountResult.amountSaved))}</p>
						</div>
					</div>
				) : (
					<p class="calc-note">
						{Number.isFinite(originalNum) && originalNum < 0
							? 'Original price cannot be negative.'
							: Number.isFinite(discountNum) && discountNum > 100
								? "Discount can't exceed 100% — that would make the sale price negative."
								: 'Enter the original price and discount percentage.'}
					</p>
				))}

			{mode === 'diff' &&
				(diffResult !== null ? (
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Percent difference</p>
							<p class="calc-result-value primary">{fmt(diffResult, 4)}%</p>
						</div>
					</div>
				) : (
					<p class="calc-note">
						Values that sum to 0 (like 5 and -5) have no defined percent difference.
					</p>
				))}

			<p class="calc-note">
				"Basic percentage" solves the classic percent relationship (part = percent × whole) for
				whichever piece you don't have. "Percentage change" and "Percent off" both use the
				earlier value or sticker price as the base. "Percent difference" is symmetric — it
				treats neither value as the reference, which is why it gives a different answer than
				percentage change for the same two numbers. Calculations run in your browser; nothing you
				type is sent anywhere.
			</p>
		</div>
	);
}
