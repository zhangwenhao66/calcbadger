import { useEffect, useRef, useState } from 'preact/hooks';
import {
	MIN_PLAUSIBLE_HZ,
	commonIntervals,
	filterOutlierIntervals,
	formatHz,
	intervalsFrom,
	nearestStandardRate,
	summarize,
	verdict,
} from '../../lib/refreshRateTest';

/** How long a single measurement runs. Long enough for a stable median at 24Hz. */
const DURATION_MS = 4000;

/** How often the live progress readout refreshes, so the loop is not re-rendering per frame. */
const PROGRESS_INTERVAL_MS = 100;

type Status = 'idle' | 'running' | 'done' | 'refused';

export default function RefreshRateTest() {
	const timestampsRef = useRef<number[]>([]);
	const rafRef = useRef<number | null>(null);
	const startRef = useRef(0);
	const lastProgressRef = useRef(0);
	const abortRef = useRef<() => void>(() => {});
	const runningRef = useRef(false);

	const [status, setStatus] = useState<Status>('idle');
	const [elapsedMs, setElapsedMs] = useState(0);
	const [frameCount, setFrameCount] = useState(0);
	const [message, setMessage] = useState('');
	const [result, setResult] = useState<ReturnType<typeof summarize>>(null);
	const [keptIntervals, setKeptIntervals] = useState<number[]>([]);

	useEffect(() => {
		const onVisibility = () => {
			// Only a run in progress can be spoiled by the tab going away. Once a
			// reading exists, switching tabs must not wipe it.
			if (runningRef.current && document.visibilityState === 'hidden') abortRef.current();
		};
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			document.removeEventListener('visibilitychange', onVisibility);
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	function stopLoop() {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
	}

	function refuse(reason: string) {
		stopLoop();
		runningRef.current = false;
		timestampsRef.current = [];
		setResult(null);
		setKeptIntervals([]);
		setStatus('refused');
		setMessage(reason);
		setElapsedMs(0);
		setFrameCount(0);
	}

	function finish() {
		stopLoop();
		runningRef.current = false;
		const intervals = intervalsFrom(timestampsRef.current);
		const summary = summarize(intervals);
		if (!summary) {
			refuse(
				'No usable reading came back. The tab may have been in the background, another program may have starved the browser of time, or the run was too short. Close heavy tabs and try again.',
			);
			return;
		}
		setResult(summary);
		setKeptIntervals(filterOutlierIntervals(intervals).kept);
		setStatus('done');
		setMessage('');
		setFrameCount(timestampsRef.current.length);
	}

	function tick(timestamp: number) {
		timestampsRef.current.push(timestamp);
		const elapsed = timestamp - startRef.current;

		if (elapsed - lastProgressRef.current >= PROGRESS_INTERVAL_MS) {
			lastProgressRef.current = elapsed;
			setElapsedMs(elapsed);
			setFrameCount(timestampsRef.current.length);
		}

		if (elapsed >= DURATION_MS) {
			finish();
			return;
		}
		rafRef.current = requestAnimationFrame(tick);
	}

	function start() {
		if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
			refuse('This tab is not in front, so the browser is not drawing frames for it. Bring the tab forward and start again.');
			return;
		}

		stopLoop();
		runningRef.current = true;
		timestampsRef.current = [];
		lastProgressRef.current = 0;
		setResult(null);
		setKeptIntervals([]);
		setMessage('');
		setElapsedMs(0);
		setFrameCount(0);
		setStatus('running');

		abortRef.current = () =>
			refuse('The tab went to the background mid-run, which pauses frame drawing. Keep this tab in front for the whole four seconds.');

		startRef.current = performance.now();
		rafRef.current = requestAnimationFrame(tick);
	}

	function reset() {
		stopLoop();
		runningRef.current = false;
		timestampsRef.current = [];
		setResult(null);
		setKeptIntervals([]);
		setMessage('');
		setElapsedMs(0);
		setFrameCount(0);
		setStatus('idle');
	}

	const match = result ? nearestStandardRate(result.hz) : null;
	const reading = result && match ? verdict(result.hz, match) : 'match';
	const readingLabel =
		reading === 'match'
			? `${formatHz(result?.hz ?? NaN)} Hz`
			: reading === 'below'
				? `${formatHz(result!.hz)} Hz (below ${match!.rate} Hz)`
				: `${formatHz(result!.hz)} Hz (above ${match!.rate} Hz)`;
	const distribution = result ? commonIntervals(keptIntervals, 5) : [];

	return (
		<div class="calc">
			<div class="rr-stage">
				<div class="rr-readout" aria-live="polite">
					<p class="calc-result-label">Measured refresh rate</p>
					<p class="rr-hz">{status === 'done' && result ? formatHz(result.hz) : '—'}</p>
					<p class="rr-unit">Hz</p>
				</div>
				<p class="calc-note rr-status">
					{status === 'idle' && 'Press start and keep this tab in front for four seconds.'}
					{status === 'running' && `Measuring… ${(elapsedMs / 1000).toFixed(1)}s / ${(DURATION_MS / 1000).toFixed(0)}s · ${frameCount} frames`}
					{status === 'done' && result && readingLabel}
					{status === 'refused' && message}
				</p>
				<div class="rr-progress" aria-hidden="true">
					<span style={`width:${Math.min(100, (status === 'done' ? DURATION_MS : elapsedMs) / DURATION_MS * 100)}%`} />
				</div>
			</div>

			<div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.9rem">
				<button type="button" class="rr-btn" onClick={start} disabled={status === 'running'}>
					{status === 'running' ? 'Measuring…' : status === 'idle' ? 'Start the test' : 'Run it again'}
				</button>
				<button type="button" class="rr-btn rr-btn-quiet" onClick={reset} disabled={status === 'running'}>
					Reset
				</button>
			</div>

			{result && (
				<>
					<div class="calc-results" style="margin-top:1rem">
						<div>
							<p class="calc-result-label">Frame period (median)</p>
							<p class="calc-result-value">{result.medianMs.toFixed(2)} ms</p>
							<p class="calc-note" style="margin-top:0.2rem">1000 ÷ period = rate</p>
						</div>
						<div>
							<p class="calc-result-label">95th percentile</p>
							<p class="calc-result-value">{result.p95Ms.toFixed(2)} ms</p>
							<p class="calc-note" style="margin-top:0.2rem">
								{result.steady ? 'Steady rate' : 'Widely varying'}
							</p>
						</div>
						<div>
							<p class="calc-result-label">Slow frames dropped</p>
							<p class="calc-result-value">{result.droppedCount}</p>
						</div>
						<div>
							<p class="calc-result-label">Frames sampled</p>
							<p class="calc-result-value">{result.sampleCount}</p>
							<p class="calc-note" style="margin-top:0.2rem">over {(result.spanMs / 1000).toFixed(1)}s of frames</p>
						</div>
					</div>

					{match && (
						<p class="calc-note" style="margin-top:0.6rem">
							Closest standard rate: <strong>{match.rate} Hz</strong>
							{reading === 'match'
								? ` — the reading sits ${Math.abs(match.deltaPercent).toFixed(1)}% off it, normal measurement noise.`
								: ` — the reading sits ${Math.abs(match.deltaPercent).toFixed(1)}% ${reading} it.`}
						</p>
					)}

					{distribution.length > 0 && (
						<div class="rr-dist">
							<p class="calc-result-label">Most common frame periods in this sample</p>
							{distribution.map((bucket) => (
								<div class="rr-dist-row" key={bucket.ms}>
									<span class="rr-dist-ms">{bucket.ms.toFixed(1)} ms</span>
									<span class="rr-dist-bar" aria-hidden="true">
										<span style={`width:${Math.round(bucket.share * 100)}%`} />
									</span>
									<span class="rr-dist-count">
										{bucket.count} · {Math.round(bucket.share * 100)}%
									</span>
								</div>
							))}
						</div>
					)}
				</>
			)}

			<p class="calc-note" style="margin-top:0.8rem">
				Every frame timestamp stays in this tab. Nothing is uploaded, and no reading is stored after you close
				the page. Measurements below {MIN_PLAUSIBLE_HZ} Hz are discarded rather than reported, because a period
				that long means the browser stalled rather than that a display is running at that rate.
			</p>
		</div>
	);
}
