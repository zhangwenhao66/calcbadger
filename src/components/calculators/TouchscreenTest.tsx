import { useEffect, useRef, useState } from 'preact/hooks';
import {
	GRID_COLS,
	GRID_ROWS,
	cellAt,
	cellsForSegment,
	classifyTouchPoints,
	coveragePercent,
	formatEventLine,
} from '../../lib/touchscreenTest';

const TOTAL_CELLS = GRID_COLS * GRID_ROWS;
const LOG_LIMIT = 6;

interface Point {
	x: number;
	y: number;
}

export default function TouchscreenTest() {
	const surfaceRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const paintedRef = useRef<Uint8Array>(new Uint8Array(TOTAL_CELLS));
	const lastPointRef = useRef<Map<number, Point>>(new Map());
	const activeRef = useRef<Map<number, Point>>(new Map());

	const [paintedCount, setPaintedCount] = useState(0);
	const [peak, setPeak] = useState(0);
	const [activeCount, setActiveCount] = useState(0);
	const [maxTouchPoints, setMaxTouchPoints] = useState(0);
	const [counts, setCounts] = useState({ down: 0, move: 0, up: 0 });
	const [log, setLog] = useState<string[]>([]);

	function draw() {
		const surface = surfaceRef.current;
		const canvas = canvasRef.current;
		if (!surface || !canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const width = surface.clientWidth;
		const height = surface.clientHeight;
		if (!(width > 0) || !(height > 0)) return;

		const targetW = Math.round(width * dpr);
		const targetH = Math.round(height * dpr);
		if (canvas.width !== targetW || canvas.height !== targetH) {
			canvas.width = targetW;
			canvas.height = targetH;
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, width, height);

		const cellW = width / GRID_COLS;
		const cellH = height / GRID_ROWS;

		ctx.fillStyle = 'rgba(74, 222, 128, 0.26)';
		for (let i = 0; i < TOTAL_CELLS; i += 1) {
			if (!paintedRef.current[i]) continue;
			const col = i % GRID_COLS;
			const row = Math.floor(i / GRID_COLS);
			ctx.fillRect(col * cellW, row * cellH, cellW, cellH);
		}

		ctx.strokeStyle = 'rgba(161, 161, 170, 0.3)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let c = 1; c < GRID_COLS; c += 1) {
			ctx.moveTo(c * cellW, 0);
			ctx.lineTo(c * cellW, height);
		}
		for (let r = 1; r < GRID_ROWS; r += 1) {
			ctx.moveTo(0, r * cellH);
			ctx.lineTo(width, r * cellH);
		}
		ctx.stroke();

		const radius = Math.max(10, Math.min(cellW, cellH) * 0.55);
		for (const [id, p] of activeRef.current) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(234, 88, 12, 0.32)';
			ctx.fill();
			ctx.strokeStyle = 'rgba(234, 88, 12, 0.95)';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.fillStyle = '#fafafa';
			ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(String(id), p.x, p.y);
		}
	}

	useEffect(() => {
		const reported = typeof navigator !== 'undefined' && typeof navigator.maxTouchPoints === 'number'
			? navigator.maxTouchPoints
			: 0;
		setMaxTouchPoints(reported);
		draw();
		const onResize = () => draw();
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	function localPoint(e: PointerEvent): Point {
		const surface = surfaceRef.current;
		if (!surface) return { x: 0, y: 0 };
		const rect = surface.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function markCells(indices: number[]): number {
		let added = 0;
		for (const i of indices) {
			if (i >= 0 && i < TOTAL_CELLS && !paintedRef.current[i]) {
				paintedRef.current[i] = 1;
				added += 1;
			}
		}
		return added;
	}

	function pushLog(line: string) {
		setLog((prev) => [line, ...prev].slice(0, LOG_LIMIT));
	}

	function onPointerDown(e: PointerEvent) {
		e.preventDefault();
		const surface = surfaceRef.current;
		if (!surface) return;
		try {
			surface.setPointerCapture(e.pointerId);
		} catch {
			/* capture is a nicety; the test still works without it */
		}
		const p = localPoint(e);
		activeRef.current.set(e.pointerId, p);
		lastPointRef.current.set(e.pointerId, p);

		const added = markCells([cellAt(p.x, p.y, surface.clientWidth, surface.clientHeight, GRID_COLS, GRID_ROWS)]);
		if (added) setPaintedCount((c) => c + added);

		setCounts((c) => ({ ...c, down: c.down + 1 }));
		pushLog(formatEventLine(performance.now(), 'down', e.pointerType, e.pointerId));
		setActiveCount(activeRef.current.size);
		setPeak((p2) => Math.max(p2, activeRef.current.size));
		draw();
	}

	function onPointerMove(e: PointerEvent) {
		const surface = surfaceRef.current;
		if (!surface) return;
		// A mouse or pen hovering across the surface fires pointermove with no
		// button held. Counting those would paint cells nobody pressed and
		// inflate the simultaneous-touch peak, so a move only counts when that
		// pointer is already down (tracked from pointerdown) or a button is
		// genuinely held.
		if (!activeRef.current.has(e.pointerId) && e.buttons === 0) return;
		const p = localPoint(e);
		const previous = lastPointRef.current.get(e.pointerId);
		const width = surface.clientWidth;
		const height = surface.clientHeight;

		const cells = previous
			? cellsForSegment(previous.x, previous.y, p.x, p.y, width, height, GRID_COLS, GRID_ROWS)
			: [cellAt(p.x, p.y, width, height, GRID_COLS, GRID_ROWS)];
		const added = markCells(cells);
		if (added) setPaintedCount((c) => c + added);

		activeRef.current.set(e.pointerId, p);
		lastPointRef.current.set(e.pointerId, p);
		setCounts((c) => ({ ...c, move: c.move + 1 }));
		setActiveCount(activeRef.current.size);
		setPeak((p2) => Math.max(p2, activeRef.current.size));
		draw();
	}

	function endPointer(e: PointerEvent, kind: string) {
		activeRef.current.delete(e.pointerId);
		lastPointRef.current.delete(e.pointerId);
		setCounts((c) => ({ ...c, up: c.up + 1 }));
		pushLog(formatEventLine(performance.now(), kind, e.pointerType, e.pointerId));
		setActiveCount(activeRef.current.size);
		draw();
	}

	function reset() {
		paintedRef.current = new Uint8Array(TOTAL_CELLS);
		activeRef.current.clear();
		lastPointRef.current.clear();
		setPaintedCount(0);
		setPeak(0);
		setActiveCount(0);
		setCounts({ down: 0, move: 0, up: 0 });
		setLog([]);
		draw();
	}

	const coverage = coveragePercent(paintedCount, GRID_COLS, GRID_ROWS);
	const tier = classifyTouchPoints(peak, maxTouchPoints);

	return (
		<div class="calc">
			<div
				class="touchtest-surface"
				ref={surfaceRef}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={(e) => endPointer(e, 'up')}
				onPointerCancel={(e) => endPointer(e, 'cancel')}
				onContextMenu={(e) => e.preventDefault()}
				aria-label="Touch test surface: drag a finger across it and watch which grid cells light up"
			>
				<canvas class="touchtest-canvas" ref={canvasRef} aria-hidden="true" />
			</div>

			<div class="calc-results" style="margin-top:1rem">
				<div>
					<p class="calc-result-label">Cells covered</p>
					<p class="calc-result-value primary">
						{paintedCount} / {TOTAL_CELLS}
					</p>
					<p class="calc-note" style="margin-top:0.2rem">
						{coverage}% of the grid
					</p>
				</div>
				<div>
					<p class="calc-result-label">Most fingers at once</p>
					<p class="calc-result-value">{peak > 0 ? peak : '—'}</p>
					<p class="calc-note" style="margin-top:0.2rem">
						Device reports {maxTouchPoints > 0 ? `${maxTouchPoints} points` : 'no touchscreen'}
					</p>
				</div>
				<div>
					<p class="calc-result-label">Touching right now</p>
					<p class="calc-result-value">{activeCount}</p>
				</div>
				<div>
					<p class="calc-result-label">Events since load</p>
					<p class="calc-result-value">
						{counts.down} / {counts.move} / {counts.up}
					</p>
					<p class="calc-note" style="margin-top:0.2rem">
						down / move / up
					</p>
				</div>
			</div>

			<p class="calc-note" style="margin-top:0.6rem">{tier.tier}. {tier.description}</p>

			<div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.8rem">
				<button type="button" class="touchtest-btn" onClick={reset}>
					Reset test
				</button>
			</div>

			{log.length > 0 && (
				<div class="touchtest-log" aria-live="off">
					<p class="calc-result-label" style="margin-bottom:0.35rem">
						Most recent events (newest first)
					</p>
					{log.map((line, i) => (
						<p key={`${line}-${i}`} class="touchtest-log-line">
							{line}
						</p>
					))}
				</div>
			)}

			<p class="calc-note" style="margin-top:0.7rem">
				Everything runs in your browser tab: no touch coordinates leave the page, and nothing is uploaded or
				stored. Sweep the whole surface once, then look for any cell you dragged across that stayed dark.
			</p>
		</div>
	);
}
