import { useState } from 'preact/hooks';
import {
	CATEGORY_ORDER,
	OBJECTS,
	categoryCounts,
	drawObjects,
	objectsForFilter,
	type CategoryFilter,
	type DrawableObject,
} from '../../lib/randomObject';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const MAX_COUNT = 10;
const HISTORY_LIMIT = 40;

function pct(x: number): string {
	return `${(x * 100).toFixed(1)}%`;
}

export default function RandomObjectGenerator() {
	const [filter, setFilter] = useState<CategoryFilter>('all');
	const [unique, setUnique] = useState(true);
	const [countStr, setCountStr] = useState('5');
	const [result, setResult] = useState<DrawableObject[] | null>(null);
	const [history, setHistory] = useState<DrawableObject[]>([]);

	const countNum = Math.round(parseFloat(countStr) || 0);
	const valid = countNum >= 1 && countNum <= MAX_COUNT;

	const pool = objectsForFilter(filter);

	function generate() {
		if (!valid) return;
		const drawn = drawObjects(countNum, pool, unique, Math.random);
		setResult(drawn);
		setHistory((h) => [...h, ...drawn].slice(-HISTORY_LIMIT));
	}

	// The pool changes size and membership when the category filter changes,
	// so a result/history drawn from the old pool would be stale and
	// inconsistent with the newly active pool's own stats once a different
	// filter is chosen.
	function changeFilter(next: CategoryFilter) {
		setFilter(next);
		setHistory([]);
		setResult(null);
	}

	const counts = categoryCounts();
	const uniqueCapped = unique && countNum > pool.length;

	return (
		<div class="calc">
			<Select
				label="Category"
				value={filter}
				onChange={(v) => changeFilter(v as CategoryFilter)}
				options={[
					{ value: 'all', label: `All categories (${OBJECTS.length})` },
					...counts.map((c) => ({
						value: c.category,
						label: `${c.category} (${c.count})`,
					})),
				]}
				wide
			/>

			<Segmented
				label="Repeats"
				value={unique ? 'unique' : 'repeats'}
				onChange={(v) => setUnique(v === 'unique')}
				options={[
					{ value: 'unique', label: 'Unique only', title: 'No object appears twice in one draw' },
					{ value: 'repeats', label: 'Allow repeats', title: 'Each pick is independent' },
				]}
			/>

			<div class="calc-grid">
				<NumberField
					label="How many objects"
					value={countStr}
					onChange={setCountStr}
					min={1}
					max={MAX_COUNT}
					step={1}
					inputMode="numeric"
				/>
			</div>

			{!valid && <p class="calc-note">Enter between 1 and {MAX_COUNT} objects.</p>}
			{valid && uniqueCapped && (
				<p class="calc-note">
					Only {pool.length} object{pool.length === 1 ? '' : 's'} match this filter, so a unique
					draw is capped at {pool.length}.
				</p>
			)}

			<button type="button" class="op-button" onClick={generate} disabled={!valid}>
				Generate {countNum > 0 ? countNum : ''} object{countNum === 1 ? '' : 's'}
			</button>

			{result && result.length > 0 && (
				<ul class="calc-note" style="margin-top:0.9rem;list-style:none;padding:0">
					{result.map((o, i) => (
						<li
							key={i}
							style="padding:0.6rem 0;border-bottom:1px solid var(--chassis-border, rgba(255,255,255,0.08))"
						>
							<span class="calc-result-value primary" style="font-size:1.15rem">
								{o.name}
							</span>{' '}
							<span style="font-size:0.85rem;color:var(--chassis-muted)">
								{o.category} · {o.difficulty} to draw
							</span>
						</li>
					))}
				</ul>
			)}

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Objects in this pool</p>
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
					? 'Unique only removes each object from the pool once it\'s drawn, so no name repeats within a single batch.'
					: 'Allow repeats draws each object independently, the same way rolling a die twice gives two unrelated results, so the same object can come up more than once in one batch.'}{' '}
				Every object in the active pool has an equal chance on each draw. Nothing you generate is sent anywhere.
			</p>
		</div>
	);
}
