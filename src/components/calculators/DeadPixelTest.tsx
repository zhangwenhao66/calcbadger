import { useEffect, useRef, useState } from 'preact/hooks';
import {
	ISO_13406_2_CLASSES,
	RESOLUTION_PRESETS,
	TEST_COLORS,
	computeFlashSchedule,
	nextColorIndex,
	panelPixelCount,
	prevColorIndex,
	scaleAllowance,
} from '../../lib/deadPixelTest';
import Segmented from '../ui/Segmented';

type Mode = 'off' | 'colorTest' | 'refresh';
type DurationOption = '30' | '60' | '120';
type ResolutionValue = '0' | '1' | '2' | '3';

const REFRESH_HZ = 8;

export default function DeadPixelTest() {
	const [mode, setMode] = useState<Mode>('off');
	const [colorIndex, setColorIndex] = useState(0);
	const [durationOption, setDurationOption] = useState<DurationOption>('60');
	const [resolutionValue, setResolutionValue] = useState<ResolutionValue>('1');
	const [remainingMs, setRemainingMs] = useState(0);

	const flashIndexRef = useRef(0);
	const intervalRef = useRef<number | null>(null);
	const timeoutRef = useRef<number | null>(null);
	const tickRef = useRef<number | null>(null);

	function clearTimers() {
		if (intervalRef.current !== null) {
			window.clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (tickRef.current !== null) {
			window.clearInterval(tickRef.current);
			tickRef.current = null;
		}
	}

	useEffect(() => clearTimers, []);

	function startColorTest() {
		setColorIndex(0);
		setMode('colorTest');
	}

	function startRefresh() {
		clearTimers();
		const durationSeconds = parseInt(durationOption, 10);
		const { intervalMs, totalFlashes } = computeFlashSchedule(durationSeconds, REFRESH_HZ);
		flashIndexRef.current = 0;
		setColorIndex(0);
		setMode('refresh');
		setRemainingMs(durationSeconds * 1000);

		const endTime = performance.now() + durationSeconds * 1000;
		tickRef.current = window.setInterval(() => {
			setRemainingMs(Math.max(0, endTime - performance.now()));
		}, 100);

		intervalRef.current = window.setInterval(() => {
			flashIndexRef.current = (flashIndexRef.current + 1) % TEST_COLORS.length;
			setColorIndex(flashIndexRef.current);
		}, intervalMs);

		timeoutRef.current = window.setTimeout(() => {
			clearTimers();
			setMode('off');
		}, totalFlashes * intervalMs);
	}

	function exitOverlay() {
		clearTimers();
		setMode('off');
	}

	useEffect(() => {
		if (mode !== 'colorTest') return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				exitOverlay();
			} else if (e.key === 'ArrowRight' || e.key === ' ') {
				e.preventDefault();
				setColorIndex((i) => nextColorIndex(i, TEST_COLORS.length));
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				setColorIndex((i) => prevColorIndex(i, TEST_COLORS.length));
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [mode]);

	useEffect(() => {
		if (mode !== 'refresh') return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') exitOverlay();
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [mode]);

	const activeColor = TEST_COLORS[colorIndex]!;
	const preset = RESOLUTION_PRESETS[parseInt(resolutionValue, 10)]!;
	const totalPixels = panelPixelCount(preset.width, preset.height);

	return (
		<div class="calc">
			{mode === 'off' && (
				<>
					<button type="button" class="pixel-test-launch" onClick={startColorTest}>
						<span>Start solid-color test</span>
						<span style="font-weight:400;font-size:0.85rem;opacity:0.75">
							Fills the screen with 6 solid colors, one at a time, so you can look for dots that don't
							change
						</span>
					</button>

					<div style="margin-top:0.9rem">
						<Segmented
							label="Pixel-refresh flash duration"
							value={durationOption}
							onChange={setDurationOption}
							options={[
								{ value: '30', label: '30s' },
								{ value: '60', label: '60s' },
								{ value: '120', label: '120s' },
							]}
						/>
					</div>
					<button type="button" class="pixel-test-launch" style="margin-top:0.7rem" onClick={startRefresh}>
						<span>Start pixel-refresh flash</span>
						<span style="font-weight:400;font-size:0.85rem;opacity:0.75">
							Rapidly cycles colors at {REFRESH_HZ}Hz, the "flashing" technique sometimes reported to help
							dislodge a stuck sub-pixel
						</span>
					</button>

					<div style="margin-top:0.9rem">
						<Segmented
							label="Panel resolution (for the allowance table below)"
							value={resolutionValue}
							onChange={setResolutionValue}
							wide
							options={RESOLUTION_PRESETS.map((p, i) => ({ value: String(i) as ResolutionValue, label: p.label }))}
						/>
					</div>

					<div class="calc-results" style="margin-top:0.9rem">
						{ISO_13406_2_CLASSES.map((c) => (
							<div key={c.class}>
								<p class="calc-result-label">Class {c.class} allows on {preset.label}</p>
								<p class="calc-result-value">
									{scaleAllowance(c.type1HotPixel, totalPixels)} hot /{' '}
									{scaleAllowance(c.type2DeadPixel, totalPixels)} dead /{' '}
									{scaleAllowance(c.type3StuckSubpixel, totalPixels)} stuck sub-px
								</p>
							</div>
						))}
					</div>

					<p class="calc-note">
						Figures above scale the historical ISO 13406-2 fault-class table (faults allowed per 1 million
						pixels) to the selected resolution's real pixel count. Most manufacturers have referenced Class
						II; the standard itself was withdrawn and revised by ISO 9241-307:2008, and individual
						manufacturer return policies vary, so check the maker's own published policy before relying on
						this for a warranty claim.
					</p>
				</>
			)}

			{mode === 'colorTest' && (
				<div
					class="pixel-test-overlay"
					style={`background:${activeColor.hex}`}
					onClick={() => setColorIndex((i) => nextColorIndex(i, TEST_COLORS.length))}
				>
					<button type="button" class="pixel-test-exit" onClick={(e) => { e.stopPropagation(); exitOverlay(); }}>
						Exit (Esc)
					</button>
					<p class="pixel-test-overlay-hint">
						{activeColor.name} · {colorIndex + 1}/{TEST_COLORS.length} · tap or press space/→ for next, ← for
						back
					</p>
				</div>
			)}

			{mode === 'refresh' && (
				<div class="pixel-test-overlay" style={`background:${activeColor.hex}`}>
					<button type="button" class="pixel-test-exit" onClick={exitOverlay}>
						Stop (Esc)
					</button>
					<p class="pixel-test-overlay-hint">Flashing · {Math.ceil(remainingMs / 1000)}s left</p>
				</div>
			)}

			<p class="calc-note" style="margin-top:0.7rem">
				Runs entirely in your browser tab: nothing is recorded, uploaded, or saved. Fixed sub-pixels don't
				react to light the same way as your screen's actual pixels, so photos of the screen won't show a
				defect that's visible in person.
			</p>
		</div>
	);
}
