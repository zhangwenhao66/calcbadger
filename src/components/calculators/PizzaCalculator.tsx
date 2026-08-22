import { useState } from 'preact/hooks';
import { computePizzaOrder, peopleFedBySize, type Appetite, type PizzaSize } from '../../lib/pizza';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const SIZE_OPTIONS: { value: PizzaSize; label: string; title: string }[] = [
	{ value: 'small', label: 'Small', title: '10" pizza, 6 slices' },
	{ value: 'medium', label: 'Medium', title: '12" pizza, 8 slices' },
	{ value: 'large', label: 'Large', title: '14" pizza, 8 slices' },
	{ value: 'xlarge', label: 'X-Large', title: '16" pizza, 12 slices' },
];

const APPETITE_OPTIONS: { value: Appetite; label: string; title: string }[] = [
	{ value: 'light', label: 'Light', title: '2 slices per adult' },
	{ value: 'average', label: 'Average', title: '3 slices per adult' },
	{ value: 'hearty', label: 'Hearty', title: '4 slices per adult' },
];

export default function PizzaCalculator() {
	const [adults, setAdults] = useState('10');
	const [children, setChildren] = useState('0');
	const [appetite, setAppetite] = useState<Appetite>('average');
	const [size, setSize] = useState<PizzaSize>('large');
	const [heavySides, setHeavySides] = useState<'no' | 'yes'>('no');

	const adultsNum = parseFloat(adults);
	const childrenNum = children.trim() === '' ? 0 : parseFloat(children);

	const validAdults = Number.isFinite(adultsNum) && adultsNum >= 0;
	const validChildren = Number.isFinite(childrenNum) && childrenNum >= 0;
	const valid = validAdults && validChildren && (adultsNum > 0 || childrenNum > 0);

	const result = valid
		? computePizzaOrder(adultsNum, childrenNum, appetite, size, heavySides === 'yes')
		: null;

	const fedLight = peopleFedBySize(size, 'light');
	const fedAverage = peopleFedBySize(size, 'average');
	const fedHearty = peopleFedBySize(size, 'hearty');

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField label="Adults" value={adults} onChange={setAdults} min={0} step={1} inputMode="numeric" />
				<NumberField
					label="Children (ages ~3-10)"
					value={children}
					onChange={setChildren}
					min={0}
					step={1}
					inputMode="numeric"
					placeholder="0"
				/>
				<Segmented label="Appetite" value={appetite} onChange={setAppetite} options={APPETITE_OPTIONS} wide />
				<Segmented label="Pizza size" value={size} onChange={setSize} options={SIZE_OPTIONS} wide />
				<Segmented
					label="Serving heavy sides (wings, pasta, big salad)?"
					value={heavySides}
					onChange={setHeavySides}
					options={[
						{ value: 'no', label: 'No' },
						{ value: 'yes', label: 'Yes, cut order ~25%' },
					]}
					wide
				/>
			</div>

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Pizzas to order</p>
						<p class="calc-result-value primary">{result.pizzasNeeded}</p>
					</div>
					<div>
						<p class="calc-result-label">Slices needed</p>
						<p class="calc-result-value">{result.slicesNeeded}</p>
					</div>
					<div>
						<p class="calc-result-label">Slices provided</p>
						<p class="calc-result-value">{result.slicesProvided}</p>
					</div>
					<div>
						<p class="calc-result-label">Leftover slices</p>
						<p class="calc-result-value">{result.leftoverSlices}</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Enter at least one adult or child to see how many pizzas to order.</p>
			)}

			{result !== null && (
				<p class="calc-note">
					{result.pizzasNeeded} {size === 'xlarge' ? 'extra-large' : size} pizza
					{result.pizzasNeeded === 1 ? '' : 's'} ({result.slicesPerPizza} slices each) covers {adultsNum}{' '}
					adult{adultsNum === 1 ? '' : 's'}
					{childrenNum > 0 ? ` and ${childrenNum} child${childrenNum === 1 ? '' : 'ren'}` : ''} at a{' '}
					{appetite} appetite
					{heavySides === 'yes' ? ', with the order cut by 25% for heavy sides' : ''}.
				</p>
			)}

			<p class="calc-note">
				One {size === 'xlarge' ? 'extra-large' : size} pizza on its own feeds about {fedHearty}-{fedLight}{' '}
				people ({fedHearty} at a hearty appetite, {fedAverage} average, {fedLight} light). This is the
				reverse of the question above: how many people a pizza you already have will feed.
			</p>

			<p class="calc-note">Calculations run in your browser; nothing you type is sent anywhere.</p>
		</div>
	);
}
