import { useEffect, useRef, useState } from 'preact/hooks';
import { classifyCps, computeClickSpeed } from '../../lib/clickSpeedTest';
import Segmented from '../ui/Segmented';

type Phase = 'idle' | 'running' | 'done';
type DurationOption = '1' | '5' | '10' | '30' | '60';

const TICK_MS = 100;

function fmtSeconds(ms: number): string {
	return `${Math.max(0, ms / 1000).toFixed(1)}s`;
}

export default function ClickSpeedTest() {
	const [durationOption, setDurationOption] = useState<DurationOption>('10');
	const [phase, setPhase] = useState<Phase>('idle');
	const [clicks, setClicks] = useState(0);
	const [remainingMs, setRemainingMs] = useState(0);
	const [finalResult, setFinalResult] = useState<ReturnType<typeof computeClickSpeed> | null>(null);

	const durationSeconds = parseInt(durationOption, 10);
	const clicksRef = useRef(0);
	const endTimeRef = useRef(0);
	const timeoutRef = useRef<number | null>(null);
	const intervalRef = useRef<number | null>(null);
	// Gates handleBoxClick on the actual current phase rather than the `phase`
	// state variable: several clicks can fire synchronously faster than Preact
	// re-renders, so a closure reading stale state would treat each one as the
	// "start a new test" click and never accumulate a count.
	const phaseRef = useRef<Phase>('idle');

	function clearTimers() {
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (intervalRef.current !== null) {
			window.clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}

	// Stop any pending timer/interval if the component unmounts mid-test.
	useEffect(() => clearTimers, []);

	function finishTest() {
		clearTimers();
		phaseRef.current = 'done';
		setFinalResult(computeClickSpeed(clicksRef.current, durationSeconds));
		setPhase('done');
	}

	function startTest() {
		clearTimers();
		clicksRef.current = 0;
		phaseRef.current = 'running';
		setClicks(0);
		setFinalResult(null);
		setPhase('running');
		endTimeRef.current = performance.now() + durationSeconds * 1000;
		setRemainingMs(durationSeconds * 1000);
		intervalRef.current = window.setInterval(() => {
			setRemainingMs(Math.max(0, endTimeRef.current - performance.now()));
		}, TICK_MS);
		timeoutRef.current = window.setTimeout(finishTest, durationSeconds * 1000);
	}

	function handleBoxClick() {
		if (phaseRef.current === 'idle' || phaseRef.current === 'done') {
			startTest();
			return;
		}
		clicksRef.current += 1;
		setClicks(clicksRef.current);
	}

	const band = finalResult ? classifyCps(finalResult.cps) : null;

	let boxLabel: string;
	if (phase === 'idle') {
		boxLabel = 'Click to start';
	} else if (phase === 'running') {
		boxLabel = `Click! ${clicks} · ${fmtSeconds(remainingMs)} left`;
	} else {
		boxLabel = 'Click to try again';
	}

	return (
		<div class="calc">
			{phase === 'idle' && (
				<Segmented
					label="Test duration"
					value={durationOption}
					onChange={setDurationOption}
					wide
					options={[
						{ value: '1', label: '1s' },
						{ value: '5', label: '5s' },
						{ value: '10', label: '10s' },
						{ value: '30', label: '30s' },
						{ value: '60', label: '60s' },
					]}
				/>
			)}

			<button
				type="button"
				class={`rt-box${phase === 'running' ? ' rt-go' : ''}`}
				onClick={handleBoxClick}
				style="margin-top:0.9rem"
			>
				{boxLabel}
			</button>

			{finalResult && band && (
				<>
					<div class="calc-results" style="margin-top:0.9rem">
						<div>
							<p class="calc-result-label">Clicks per second</p>
							<p class="calc-result-value primary">{finalResult.cps.toFixed(2)}</p>
						</div>
						<div>
							<p class="calc-result-label">Clicks per minute</p>
							<p class="calc-result-value">{Math.round(finalResult.cpm)}</p>
						</div>
						<div>
							<p class="calc-result-label">Total clicks</p>
							<p class="calc-result-value">{finalResult.clicks}</p>
						</div>
						<div>
							<p class="calc-result-label">Test duration</p>
							<p class="calc-result-value">{finalResult.durationSeconds}s</p>
						</div>
					</div>

					<p class="calc-note" style="margin-top:0.7rem">
						<strong>{band.label}.</strong> {band.note}
					</p>
				</>
			)}

			<p class="calc-note">
				Timed with the browser's performance clock. Nothing you click here is sent anywhere; the
				timer and counter run entirely on your device.
			</p>
		</div>
	);
}
