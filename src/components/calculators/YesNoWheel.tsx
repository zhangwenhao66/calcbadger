import { useEffect, useRef, useState } from 'preact/hooks';
import {
	expectedSpinsUntilFirst,
	rotationForLanding,
	segmentAngles,
	spinWheel,
	streakProbability,
	summarizeSpins,
} from '../../lib/yesNoWheel';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

type Mode = 'two' | 'three';

const TWO_LABELS = ['Yes', 'No'];
const THREE_LABELS = ['Yes', 'No', 'Maybe'];
const SEGMENT_COLORS = ['var(--good)', 'var(--warn)', 'var(--chassis-muted)'];
const EXTRA_SPINS_MIN = 4;
const EXTRA_SPINS_RANGE = 2;
/** Backstop in case `transitionend` never fires (e.g. some reduced-motion setups skip it). */
const FALLBACK_REVEAL_MS = 4500;
const HISTORY_LIMIT = 30;

function pct(x: number): string {
	return `${(x * 100).toFixed(1)}%`;
}

export default function YesNoWheel() {
	const [mode, setMode] = useState<Mode>('two');
	const [biasStr, setBiasStr] = useState('50');
	const [rotation, setRotation] = useState(0);
	const [spinning, setSpinning] = useState(false);
	const [pendingIndex, setPendingIndex] = useState<number | null>(null);
	const [lastResultIndex, setLastResultIndex] = useState<number | null>(null);
	const [history, setHistory] = useState<number[]>([]);

	const discRef = useRef<HTMLDivElement>(null);
	const fallbackTimer = useRef<number | null>(null);

	const labels = mode === 'two' ? TWO_LABELS : THREE_LABELS;
	const biasNum = Math.min(100, Math.max(0, parseFloat(biasStr) || 0));
	const weights = mode === 'two' ? [biasNum, 100 - biasNum] : [1, 1, 1];
	const segments = segmentAngles(weights);
	const probs = segments.map((_, i) => weights[i]! / weights.reduce((a, b) => a + b, 0));

	// Switching between 2-way and 3-way wheels changes what the spin history's
	// indices even mean, so it resets rather than mixing segment counts. It
	// also cancels any spin in flight: pendingIndex refers to a segment index
	// in the wheel that's about to disappear, so leaving `spinning` true here
	// would strand the button in "Spinning…" forever (the transitionend
	// listener and fallback timer both key their reveal on pendingIndex).
	function changeMode(next: Mode) {
		setMode(next);
		setHistory([]);
		setLastResultIndex(null);
		setPendingIndex(null);
		setSpinning(false);
	}

	function clearFallback() {
		if (fallbackTimer.current !== null) {
			window.clearTimeout(fallbackTimer.current);
			fallbackTimer.current = null;
		}
	}

	function reveal(idx: number) {
		clearFallback();
		setSpinning(false);
		setLastResultIndex(idx);
		setHistory((h) => [...h, idx].slice(-HISTORY_LIMIT));
	}

	useEffect(() => {
		if (!spinning) return;
		const el = discRef.current;
		function onTransitionEnd(e: TransitionEvent) {
			if (e.propertyName !== 'transform') return;
			if (pendingIndex !== null) reveal(pendingIndex);
		}
		el?.addEventListener('transitionend', onTransitionEnd);
		// Belt-and-suspenders: prefers-reduced-motion setups can skip the
		// transition entirely and never fire transitionend.
		fallbackTimer.current = window.setTimeout(() => {
			if (pendingIndex !== null) reveal(pendingIndex);
		}, FALLBACK_REVEAL_MS);
		return () => {
			el?.removeEventListener('transitionend', onTransitionEnd);
			clearFallback();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [spinning, pendingIndex]);

	function spin() {
		if (spinning) return;
		const idx = spinWheel(weights);
		const seg = segments[idx]!;
		const extraSpins = EXTRA_SPINS_MIN + Math.floor(Math.random() * (EXTRA_SPINS_RANGE + 1));
		const next = rotationForLanding(rotation, seg.mid, extraSpins);
		setPendingIndex(idx);
		setSpinning(true);
		setRotation(next);
	}

	const summary = summarizeSpins(history, labels.length);
	const totalSpins = history.length;

	return (
		<div class="calc">
			<Segmented
				label="Wheel"
				value={mode}
				onChange={(v) => changeMode(v as Mode)}
				options={[
					{ value: 'two', label: 'Yes / No' },
					{ value: 'three', label: 'Yes / No / Maybe' },
				]}
			/>

			{mode === 'two' && (
				<div class="calc-grid">
					<NumberField
						label="Chance of Yes"
						unit="%"
						value={biasStr}
						onChange={setBiasStr}
						min={0}
						max={100}
						step={1}
						inputMode="numeric"
					/>
				</div>
			)}

			<div class="wheel-stage">
				<div class="wheel-pointer" aria-hidden="true" />
				<div
					class="wheel-disc"
					ref={discRef}
					style={`transform: rotate(${rotation}deg); background: conic-gradient(${segments
						.map((seg, i) => `${SEGMENT_COLORS[i]} ${seg.start}deg ${seg.end}deg`)
						.join(', ')})`}
				>
					{segments.map((seg, i) => (
						<div
							key={`label-${i}`}
							class="wheel-label"
							style={`transform: rotate(${seg.mid}deg)`}
						>
							{labels[i]}
						</div>
					))}
				</div>
				<div class="wheel-hub" aria-hidden="true" />
			</div>

			<button type="button" class="op-button" onClick={spin} disabled={spinning}>
				{spinning ? 'Spinning…' : 'Spin the wheel'}
			</button>

			{lastResultIndex !== null && !spinning && (
				<p class="calc-note" style="margin-top:0.9rem">
					<span class="calc-result-label">Result</span>
					<br />
					<span class="calc-result-value primary">{labels[lastResultIndex]}</span>
				</p>
			)}

			<div class="calc-results" style="margin-top:0.9rem">
				{labels.map((label, i) => (
					<div key={label}>
						<p class="calc-result-label">P({label})</p>
						<p class="calc-result-value">{pct(probs[i]!)}</p>
					</div>
				))}
				<div>
					<p class="calc-result-label">Avg. spins until Yes</p>
					<p class="calc-result-value">
						{Number.isFinite(expectedSpinsUntilFirst(probs[0]!))
							? expectedSpinsUntilFirst(probs[0]!).toFixed(2)
							: '∞'}
					</p>
				</div>
				<div>
					<p class="calc-result-label">P(same answer twice running)</p>
					<p class="calc-result-value">{pct(streakProbability(probs[0]!, 2))}</p>
				</div>
			</div>

			{totalSpins > 0 && (
				<>
					<p class="calc-note" style="margin-top:0.9rem;line-height:2;letter-spacing:0.02em">
						{history.map((idx, i) => (
							<span
								key={i}
								style={`display:inline-block;padding:0 0.4em;font-weight:600;color:${SEGMENT_COLORS[idx]}`}
							>
								{labels[idx]![0]}
							</span>
						))}
					</p>
					<p class="calc-note">
						This session: {summary.counts.map((c, i) => `${labels[i]} ${c}`).join(', ')}. Longest
						streak: {labels[summary.longestStreaks.indexOf(Math.max(...summary.longestStreaks))]}{' '}
						×{Math.max(...summary.longestStreaks)}.
					</p>
				</>
			)}

			<p class="calc-note">
				Each spin is an independent weighted random draw, done in your browser. Nothing you type
				or spin is sent anywhere. The wheel is not "due" for a different answer after any streak;
				every spin has the same odds regardless of what came before.
			</p>
		</div>
	);
}
