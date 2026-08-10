import { useEffect, useRef, useState } from 'preact/hooks';
import { classifyReactionTime, summarizeTrials } from '../../lib/reactionTime';
import Segmented from '../ui/Segmented';

type Phase = 'idle' | 'waiting' | 'go' | 'early' | 'trial-done' | 'summary';

const MIN_DELAY_MS = 1200;
const MAX_DELAY_MS = 3500;

function randomDelay(): number {
	return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}

function fmt(ms: number): string {
	return `${Math.round(ms)} ms`;
}

export default function ReactionTimeTest() {
	const [trialsOption, setTrialsOption] = useState<'3' | '5' | '7'>('5');
	const [phase, setPhase] = useState<Phase>('idle');
	const [times, setTimes] = useState<number[]>([]);
	const [falseStarts, setFalseStarts] = useState(0);
	const [lastTrialMs, setLastTrialMs] = useState<number | null>(null);

	const stimulusStartRef = useRef(0);
	const timeoutRef = useRef<number | null>(null);

	const trialCount = parseInt(trialsOption, 10);

	function clearPendingTimeout() {
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}

	// Stop the pending stimulus timer if the component unmounts mid-wait.
	useEffect(() => clearPendingTimeout, []);

	function armTrial() {
		clearPendingTimeout();
		setPhase('waiting');
		timeoutRef.current = window.setTimeout(() => {
			stimulusStartRef.current = performance.now();
			setPhase('go');
		}, randomDelay());
	}

	function startTest() {
		clearPendingTimeout();
		setTimes([]);
		setFalseStarts(0);
		setLastTrialMs(null);
		armTrial();
	}

	function handleBoxClick() {
		if (phase === 'idle' || phase === 'summary') {
			startTest();
			return;
		}
		if (phase === 'waiting') {
			clearPendingTimeout();
			setFalseStarts((f) => f + 1);
			setPhase('early');
			return;
		}
		if (phase === 'early' || phase === 'trial-done') {
			armTrial();
			return;
		}
		if (phase === 'go') {
			const elapsed = performance.now() - stimulusStartRef.current;
			const next = [...times, elapsed];
			setTimes(next);
			setLastTrialMs(elapsed);
			setPhase(next.length >= trialCount ? 'summary' : 'trial-done');
		}
	}

	const summary = phase === 'summary' ? summarizeTrials(times) : null;
	const band = summary ? classifyReactionTime(summary.mean) : null;

	let boxLabel: string;
	let boxStateClass = '';
	if (phase === 'idle') {
		boxLabel = 'Click to start';
	} else if (phase === 'waiting') {
		boxLabel = 'Wait for green…';
		boxStateClass = 'rt-wait';
	} else if (phase === 'go') {
		boxLabel = 'Click now!';
		boxStateClass = 'rt-go';
	} else if (phase === 'early') {
		boxLabel = 'Too soon, click to try again';
		boxStateClass = 'rt-early';
	} else if (phase === 'trial-done') {
		boxLabel = `Trial ${times.length} of ${trialCount}: ${fmt(lastTrialMs ?? 0)}, click to continue`;
	} else {
		boxLabel = 'Click to run again';
	}

	return (
		<div class="calc">
			{phase === 'idle' && (
				<Segmented
					label="Trials"
					value={trialsOption}
					onChange={setTrialsOption}
					options={[
						{ value: '3', label: '3' },
						{ value: '5', label: '5' },
						{ value: '7', label: '7' },
					]}
				/>
			)}

			<button
				type="button"
				class={`rt-box${boxStateClass ? ` ${boxStateClass}` : ''}`}
				onClick={handleBoxClick}
				style="margin-top:0.9rem"
			>
				{boxLabel}
			</button>

			{(phase === 'waiting' || phase === 'go' || phase === 'early' || phase === 'trial-done') && (
				<p class="calc-note">
					Trial {Math.min(times.length + 1, trialCount)} of {trialCount}
					{falseStarts > 0
						? `, ${falseStarts} false start${falseStarts === 1 ? '' : 's'} so far (not counted)`
						: ''}
				</p>
			)}

			{summary && band && (
				<>
					<div class="calc-results" style="margin-top:0.9rem">
						<div>
							<p class="calc-result-label">Average</p>
							<p class="calc-result-value primary">{fmt(summary.mean)}</p>
						</div>
						<div>
							<p class="calc-result-label">Best</p>
							<p class="calc-result-value">{fmt(summary.best)}</p>
						</div>
						<div>
							<p class="calc-result-label">Median</p>
							<p class="calc-result-value">{fmt(summary.median)}</p>
						</div>
						<div>
							<p class="calc-result-label">Consistency (std. dev.)</p>
							<p class="calc-result-value">{fmt(summary.stdDev)}</p>
						</div>
					</div>

					<p class="calc-note" style="margin-top:0.7rem">
						<strong>{band.label}.</strong> {band.note}
					</p>

					<p class="calc-note">
						Individual trials: {times.map((t) => fmt(t)).join(' · ')}
						{falseStarts > 0
							? ` (plus ${falseStarts} false start${falseStarts === 1 ? '' : 's'}, not counted in the average)`
							: ''}
					</p>
				</>
			)}

			<p class="calc-note">
				Timed with the browser's performance clock from the moment the box turns green to your
				click. Nothing you do here is sent anywhere. The timer runs entirely on your device.
			</p>
		</div>
	);
}
