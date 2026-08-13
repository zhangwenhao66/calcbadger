import { useEffect, useRef, useState } from 'preact/hooks';
import {
	circleToSchematic,
	generateCircle,
	MAX_RADIUS,
	MIN_RADIUS,
	type CircleMode,
} from '../../lib/minecraftCircle';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const FILL_COLOR = '#ea580c';
const EMPTY_COLOR = '#26262b';
const GRID_LINE_COLOR = '#3c3c44';
const MAX_CANVAS_PX = 420;
const MIN_CELL_PX = 6;

export default function MinecraftCircleGenerator() {
	const [radiusStr, setRadiusStr] = useState('8');
	const [mode, setMode] = useState<CircleMode>('filled');
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [copied, setCopied] = useState(false);

	const radiusNum = parseInt(radiusStr, 10);
	const radius = Number.isFinite(radiusNum)
		? Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, radiusNum))
		: MIN_RADIUS;

	const result = generateCircle(radius, mode);
	const schematic = circleToSchematic(result);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		const cellPx = Math.max(MIN_CELL_PX, Math.floor(MAX_CANVAS_PX / result.diameter));
		const cssSize = cellPx * result.diameter;

		canvas.style.width = `${cssSize}px`;
		canvas.style.height = `${cssSize}px`;
		canvas.width = cssSize * dpr;
		canvas.height = cssSize * dpr;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.scale(dpr, dpr);
		ctx.fillStyle = EMPTY_COLOR;
		ctx.fillRect(0, 0, cssSize, cssSize);

		for (let r = 0; r < result.diameter; r++) {
			for (let c = 0; c < result.diameter; c++) {
				if (result.grid[r]![c]) {
					ctx.fillStyle = FILL_COLOR;
					ctx.fillRect(c * cellPx, r * cellPx, cellPx, cellPx);
				}
			}
		}

		if (cellPx >= 8) {
			ctx.strokeStyle = GRID_LINE_COLOR;
			ctx.lineWidth = 1;
			for (let i = 0; i <= result.diameter; i++) {
				ctx.beginPath();
				ctx.moveTo(i * cellPx + 0.5, 0);
				ctx.lineTo(i * cellPx + 0.5, cssSize);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(0, i * cellPx + 0.5);
				ctx.lineTo(cssSize, i * cellPx + 0.5);
				ctx.stroke();
			}
		}
	}, [result]);

	async function copySchematic() {
		try {
			await navigator.clipboard.writeText(schematic);
		} catch {
			// Clipboard API can be unavailable; the text stays visible below
			// for manual selection, so this is a silent no-op.
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField
					label="Radius"
					unit="blocks"
					value={radiusStr}
					onChange={setRadiusStr}
					min={MIN_RADIUS}
					max={MAX_RADIUS}
					step={1}
					inputMode="numeric"
				/>
				<Segmented
					label="Mode"
					value={mode}
					onChange={(v) => setMode(v as CircleMode)}
					options={[
						{ value: 'filled', label: 'Filled' },
						{ value: 'outline', label: 'Outline' },
					]}
				/>
			</div>

			<div class="circle-stage">
				<canvas ref={canvasRef} class="circle-canvas" aria-hidden="true" />
			</div>

			<div class="calc-results" style="margin-top:0.9rem">
				<div>
					<p class="calc-result-label">Diameter</p>
					<p class="calc-result-value">{result.diameter} blocks</p>
				</div>
				<div>
					<p class="calc-result-label">Total blocks</p>
					<p class="calc-result-value primary">{result.blockCount}</p>
				</div>
			</div>

			<button type="button" class="op-button" style="margin-top:0.9rem" onClick={copySchematic}>
				{copied ? 'Copied!' : 'Copy build schematic'}
			</button>

			<div class="circle-rows" aria-label="Row-by-row block layout">
				<pre class="circle-rows-text">{schematic}</pre>
			</div>

			<p class="calc-note">
				Radius counts outward from the center block, so a radius of {result.radius} gives a{' '}
				{result.diameter}×{result.diameter} footprint with one true center block — Minecraft
				circles use an odd diameter (2 × radius + 1) for exactly that reason. Outline mode keeps
				only the blocks on the surface of the shape, which can look sparse at very small radii
				since there is no interior left to hollow out. Row offsets in the schematic count from
				the center row (0), negative above it and positive below; column offsets do the same
				left to right. Everything above runs in your browser; nothing you enter is sent anywhere.
			</p>
		</div>
	);
}
