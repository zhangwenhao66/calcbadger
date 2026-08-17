import { useState } from 'preact/hooks';
import {
	ANIMALS,
	CLASS_ORDER,
	animalsForFilter,
	classCounts,
	drawAnimals,
	type Animal,
	type ClassFilter,
} from '../../lib/randomAnimal';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const MAX_COUNT = 10;
const HISTORY_LIMIT = 40;

function pct(x: number): string {
	return `${(x * 100).toFixed(1)}%`;
}

export default function RandomAnimalGenerator() {
	const [filter, setFilter] = useState<ClassFilter>('all');
	const [unique, setUnique] = useState(true);
	const [countStr, setCountStr] = useState('5');
	const [result, setResult] = useState<Animal[] | null>(null);
	const [history, setHistory] = useState<Animal[]>([]);

	const countNum = Math.round(parseFloat(countStr) || 0);
	const valid = countNum >= 1 && countNum <= MAX_COUNT;

	const pool = animalsForFilter(filter);

	function generate() {
		if (!valid) return;
		const drawn = drawAnimals(countNum, pool, unique, Math.random);
		setResult(drawn);
		setHistory((h) => [...h, ...drawn].slice(-HISTORY_LIMIT));
	}

	// The pool changes size and membership when the class filter changes, so a
	// result/history drawn from the old pool (e.g. a Reptile drawn while
	// "Reptiles" was selected) would be stale and inconsistent with the newly
	// active pool's own stats once a different filter is chosen.
	function changeFilter(next: ClassFilter) {
		setFilter(next);
		setHistory([]);
		setResult(null);
	}

	const counts = classCounts();
	const uniqueCapped = unique && countNum > pool.length;

	return (
		<div class="calc">
			<Select
				label="Animal type"
				value={filter}
				onChange={(v) => changeFilter(v as ClassFilter)}
				options={[
					{ value: 'all', label: `All animals (${ANIMALS.length})` },
					...counts.map((c) => ({
						value: c.animalClass,
						label: `${c.animalClass}s (${c.count})`,
					})),
				]}
				wide
			/>

			<Segmented
				label="Repeats"
				value={unique ? 'unique' : 'repeats'}
				onChange={(v) => setUnique(v === 'unique')}
				options={[
					{ value: 'unique', label: 'Unique only', title: 'No animal appears twice in one draw' },
					{ value: 'repeats', label: 'Allow repeats', title: 'Each pick is independent' },
				]}
			/>

			<div class="calc-grid">
				<NumberField
					label="How many animals"
					value={countStr}
					onChange={setCountStr}
					min={1}
					max={MAX_COUNT}
					step={1}
					inputMode="numeric"
				/>
			</div>

			{!valid && <p class="calc-note">Enter between 1 and {MAX_COUNT} animals.</p>}
			{valid && uniqueCapped && (
				<p class="calc-note">
					Only {pool.length} animal{pool.length === 1 ? '' : 's'} match this filter, so a unique
					draw is capped at {pool.length}.
				</p>
			)}

			<button type="button" class="op-button" onClick={generate} disabled={!valid}>
				Generate {countNum > 0 ? countNum : ''} animal{countNum === 1 ? '' : 's'}
			</button>

			{result && result.length > 0 && (
				<ul class="calc-note" style="margin-top:0.9rem;list-style:none;padding:0">
					{result.map((a, i) => (
						<li
							key={i}
							style="padding:0.6rem 0;border-bottom:1px solid var(--chassis-border, rgba(255,255,255,0.08))"
						>
							<span class="calc-result-value primary" style="font-size:1.15rem">
								{a.name}
							</span>{' '}
							<span style="font-size:0.85rem;color:var(--chassis-muted)">
								{a.animalClass} · {a.region}
							</span>
						</li>
					))}
				</ul>
			)}

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Animals in this pool</p>
					<p class="calc-result-value">{pool.length}</p>
				</div>
				<div>
					<p class="calc-result-label">Chance per draw</p>
					<p class="calc-result-value">{pool.length > 0 ? pct(1 / pool.length) : '—'}</p>
				</div>
				<div>
					<p class="calc-result-label">Draws this session</p>
					<p class="calc-result-value">{history.length}</p>
				</div>
			</div>

			<p class="calc-note">
				{unique
					? 'Unique only removes each animal from the pool once it\'s drawn, so no name repeats within a single batch.'
					: 'Allow repeats draws each animal independently, the same way rolling a die twice gives two unrelated results, so the same animal can come up more than once in one batch.'}{' '}
				Every animal in the active pool has an equal chance on each draw. Nothing you enter or generate is sent anywhere.
			</p>
		</div>
	);
}
