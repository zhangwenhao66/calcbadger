import { useEffect, useRef, useState } from 'preact/hooks';
import {
	MOUSE_BUTTONS,
	classifyDoubleClickInterval,
	classifyPollingRate,
	computeAverageIntervalMs,
	hzFromAverageIntervalMs,
	type PollingMethod,
} from '../../lib/mouseTest';

const POLL_WINDOW_MS = 500;

interface LastClick {
	label: string;
	button: number;
}

function supportsCoalescedEvents(): boolean {
	return typeof PointerEvent !== 'undefined' && typeof (PointerEvent.prototype as any).getCoalescedEvents === 'function';
}

export default function MouseTest() {
	const [testedButtons, setTestedButtons] = useState<Set<number>>(new Set());
	const [lastClick, setLastClick] = useState<LastClick | null>(null);
	const [doubleClickMs, setDoubleClickMs] = useState<number>(-1);
	const [pollingHz, setPollingHz] = useState(0);
	const [scrollTicks, setScrollTicks] = useState({ up: 0, down: 0 });

	const leftClickTimestampsRef = useRef<number[]>([]);
	const pollingTimestampsRef = useRef<number[]>([]);
	const rafPendingRef = useRef(false);
	// Feature-detected once and read synchronously by the event handlers below (a ref, not
	// state, so onPointerMove always sees the current value without waiting for a re-render);
	// pollingMethod (state) mirrors it purely so the UI label updates as soon as it's known,
	// since updating a ref alone would leave the displayed text stuck at the initial guess
	// until some unrelated state change happened to trigger a re-render.
	const methodRef = useRef<PollingMethod>('raw');
	const [pollingMethod, setPollingMethod] = useState<PollingMethod>('raw');

	useEffect(() => {
		const detected = supportsCoalescedEvents() ? 'coalesced' : 'raw';
		methodRef.current = detected;
		setPollingMethod(detected);
	}, []);

	function registerButton(button: number) {
		const def = MOUSE_BUTTONS.find((b) => b.button === button);
		setLastClick({ label: def?.label ?? `Button ${button}`, button });
		setTestedButtons((prev) => (prev.has(button) ? prev : new Set(prev).add(button)));
	}

	function onMouseDown(e: MouseEvent) {
		registerButton(e.button);
		if (e.button === 0) {
			const now = e.timeStamp;
			const prev = leftClickTimestampsRef.current;
			if (prev.length > 0) {
				setDoubleClickMs(now - prev[prev.length - 1]!);
			}
			leftClickTimestampsRef.current = [now];
		}
	}

	function onContextMenu(e: MouseEvent) {
		// Let the right-click register as a button test instead of opening the OS context menu.
		e.preventDefault();
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		setScrollTicks((prev) => (e.deltaY > 0 ? { ...prev, down: prev.down + 1 } : { ...prev, up: prev.up + 1 }));
	}

	function recomputePolling() {
		const now = performance.now();
		const cutoff = now - POLL_WINDOW_MS;
		const samples = pollingTimestampsRef.current.filter((t) => t >= cutoff);
		pollingTimestampsRef.current = samples;
		const avg = computeAverageIntervalMs(samples);
		setPollingHz(avg > 0 ? hzFromAverageIntervalMs(avg) : 0);
		rafPendingRef.current = false;
	}

	function onPointerMove(e: any) {
		const events: any[] = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [e];
		const list = events.length > 0 ? events : [e];
		for (const ev of list) {
			pollingTimestampsRef.current.push(ev.timeStamp);
		}
		if (!rafPendingRef.current) {
			rafPendingRef.current = true;
			requestAnimationFrame(recomputePolling);
		}
	}

	function reset() {
		setTestedButtons(new Set());
		setLastClick(null);
		setDoubleClickMs(-1);
		setPollingHz(0);
		setScrollTicks({ up: 0, down: 0 });
		leftClickTimestampsRef.current = [];
		pollingTimestampsRef.current = [];
	}

	const dblTier = classifyDoubleClickInterval(doubleClickMs);
	const pollTier = classifyPollingRate(pollingHz, pollingMethod);
	const testedCount = testedButtons.size;

	return (
		<div class="calc">
			<p class="calc-note" style="margin-top:0">
				Move the mouse inside the gray area below, click each button at least once (including right-click,
				which is captured here instead of opening a menu), double-click, and scroll. Nothing is recorded,
				stored, or sent anywhere: everything runs in your browser tab.
			</p>

			<div
				class="mousetest-area"
				onMouseDown={onMouseDown}
				onContextMenu={onContextMenu}
				onWheel={onWheel}
				onPointerMove={onPointerMove}
			>
				<p class="mousetest-area-label">Test area — click, double-click, right-click, and scroll here</p>
				<div class="mousetest-buttons">
					{MOUSE_BUTTONS.map((b) => {
						const tested = testedButtons.has(b.button);
						const active = lastClick?.button === b.button;
						return (
							<div key={b.button} class={`mousetest-btn${tested ? ' tested' : ''}${active ? ' active' : ''}`}>
								{b.label}
							</div>
						);
					})}
				</div>
			</div>

			<div class="calc-results" style="margin-top:1rem">
				<div>
					<p class="calc-result-label">Buttons tested</p>
					<p class="calc-result-value">
						{testedCount} / {MOUSE_BUTTONS.length}
					</p>
				</div>
				<div>
					<p class="calc-result-label">Double-click interval</p>
					<p class="calc-result-value primary">{doubleClickMs >= 0 ? `${Math.round(doubleClickMs)} ms` : '—'}</p>
				</div>
				<div>
					<p class="calc-result-label">Estimated report rate</p>
					<p class="calc-result-value">{pollingHz > 0 ? pollTier.tier : '—'}</p>
				</div>
				<div>
					<p class="calc-result-label">Scroll ticks (up / down)</p>
					<p class="calc-result-value">
						{scrollTicks.up} / {scrollTicks.down}
					</p>
				</div>
			</div>

			{doubleClickMs >= 0 && <p class="calc-note">{dblTier.description}</p>}
			{pollingHz > 0 && <p class="calc-note">{pollTier.description}</p>}
			<p class="calc-note">
				Reading method: <strong>{pollingMethod === 'coalesced' ? 'coalesced pointer samples' : 'raw mousemove events'}</strong>
				{pollingMethod === 'raw' &&
					' (this browser caps the reading near your display refresh rate — see the report-rate explanation below).'}
			</p>

			<button type="button" class="pixel-test-launch" style="margin-top:0.9rem" onClick={reset}>
				<span>Reset test</span>
				<span style="font-weight:400;font-size:0.85rem;opacity:0.75">Clears tested buttons, timing, and scroll counts</span>
			</button>
		</div>
	);
}
