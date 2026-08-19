import { useState } from 'preact/hooks';
import {
	costFromPriceAndMarkup,
	markupFromCostAndPrice,
	sellingPriceFromCostAndMarkup,
	type MarkupResult,
} from '../../lib/markup';
import NumberField from '../ui/NumberField';
import Select from '../ui/Select';

type SolveFor = 'price' | 'markup' | 'cost';

const SOLVE_FOR = [
	{ value: 'price' as SolveFor, label: 'Find the selling price' },
	{ value: 'markup' as SolveFor, label: 'Find the markup % (I know cost and price)' },
	{ value: 'cost' as SolveFor, label: 'Find the cost' },
];

function money(n: number): string {
	return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function pct(n: number): string {
	return `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
}

export default function MarkupCalculator() {
	const [solveFor, setSolveFor] = useState<SolveFor>('price');

	const [cost, setCost] = useState('40');
	const [markupPercent, setMarkupPercent] = useState('35');
	const [sellingPrice, setSellingPrice] = useState('54');

	const costNum = parseFloat(cost);
	const markupNum = parseFloat(markupPercent);
	const priceNum = parseFloat(sellingPrice);

	let result: MarkupResult | null = null;
	let error: string | null = null;

	if (solveFor === 'price') {
		if (Number.isFinite(costNum) && Number.isFinite(markupNum)) {
			result = sellingPriceFromCostAndMarkup(costNum, markupNum);
		}
	} else if (solveFor === 'markup') {
		if (Number.isFinite(costNum) && Number.isFinite(priceNum)) {
			if (costNum === 0) {
				error = 'Cost cannot be $0: markup is undefined relative to a $0 cost.';
			} else {
				result = markupFromCostAndPrice(costNum, priceNum);
			}
		}
	} else {
		if (Number.isFinite(priceNum) && Number.isFinite(markupNum)) {
			if (markupNum === -100) {
				error = 'Markup of -100% means a $0 price, which is consistent with any cost. Enter a different markup.';
			} else {
				result = costFromPriceAndMarkup(priceNum, markupNum);
			}
		}
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select label="What are you solving for?" value={solveFor} onChange={setSolveFor} options={SOLVE_FOR} wide />

				{solveFor === 'price' && (
					<>
						<NumberField label="Cost" unit="$" value={cost} onChange={setCost} min={0} step={0.01} />
						<NumberField label="Markup" unit="%" value={markupPercent} onChange={setMarkupPercent} step={1} />
					</>
				)}

				{solveFor === 'markup' && (
					<>
						<NumberField label="Cost" unit="$" value={cost} onChange={setCost} min={0} step={0.01} />
						<NumberField label="Selling price" unit="$" value={sellingPrice} onChange={setSellingPrice} min={0} step={0.01} />
					</>
				)}

				{solveFor === 'cost' && (
					<>
						<NumberField label="Selling price" unit="$" value={sellingPrice} onChange={setSellingPrice} min={0} step={0.01} />
						<NumberField label="Markup" unit="%" value={markupPercent} onChange={setMarkupPercent} step={1} />
					</>
				)}
			</div>

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Cost</p>
						<p class={`calc-result-value${solveFor === 'cost' ? ' primary' : ''}`}>{money(result.cost)}</p>
					</div>
					<div>
						<p class="calc-result-label">Selling price</p>
						<p class={`calc-result-value${solveFor === 'price' ? ' primary' : ''}`}>{money(result.sellingPrice)}</p>
					</div>
					<div>
						<p class="calc-result-label">Profit</p>
						<p class="calc-result-value">{money(result.profit)}</p>
					</div>
					<div>
						<p class="calc-result-label">Markup</p>
						<p class={`calc-result-value${solveFor === 'markup' ? ' primary' : ''}`}>
							{Number.isFinite(result.markupPercent) ? pct(result.markupPercent) : 'undefined'}
						</p>
					</div>
					<div>
						<p class="calc-result-label">Margin (gross profit %)</p>
						<p class="calc-result-value">{Number.isFinite(result.marginPercent) ? pct(result.marginPercent) : 'undefined'}</p>
					</div>
				</div>
			) : (
				<p class="calc-note">{error ?? 'Enter the two known values above.'}</p>
			)}

			<p class="calc-note">
				Markup and margin are both "profit as a percent," but they divide by different numbers: markup
				divides by cost, and margin divides by the selling price, so the same sale produces two different
				percentages. This calculator always shows both, whichever two values you started from. Calculations
				run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
