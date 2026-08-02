import { useCallback, useEffect, useRef } from 'preact/hooks';

/**
 * A number entry that looks like it belongs on the instrument: the browser's
 * native spinner is hidden (it is tiny, OS-styled, and lands on top of the
 * value), replaced by a stepper pair sized to WCAG 2.5.8's 24px minimum, with
 * the unit printed inside the field so labels stay short.
 *
 * Press-and-hold repeats the way a keypad does: 400ms before the first repeat,
 * then every 60ms.
 *
 * Stopping the repeat is the part that has to be airtight. A handler on the
 * button alone is not enough -- if the release lands anywhere else (finger
 * slides off, the tab loses focus, the browser drops the event) the interval
 * would keep firing and spin the number forever, which is exactly what
 * happened in testing and froze the renderer. So the release is caught on the
 * window, on pointercancel, on blur and on tab-hide, and even if every one of
 * those failed the run is capped at MAX_REPEATS.
 */
interface Props {
	label: string;
	value: string;
	onChange: (next: string) => void;
	/** Printed inside the field, right of the number: in, ft, kg, $, %. */
	unit?: string;
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	/** 'decimal' shows a keypad with a dot on mobile; 'numeric' omits it. */
	inputMode?: 'decimal' | 'numeric';
}

const REPEAT_DELAY = 400;
const REPEAT_EVERY = 60;
/** ~12s of held repeat. A backstop, not a limit anyone should reach. */
const MAX_REPEATS = 200;

export default function NumberField({
	label,
	value,
	onChange,
	unit,
	min,
	max,
	step = 1,
	placeholder,
	inputMode = 'decimal',
}: Props) {
	const holdTimer = useRef<number | null>(null);
	const repeatTimer = useRef<number | null>(null);
	const valueRef = useRef(value);
	valueRef.current = value;

	const stop = useCallback(() => {
		if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
		if (repeatTimer.current !== null) window.clearInterval(repeatTimer.current);
		holdTimer.current = null;
		repeatTimer.current = null;
		window.removeEventListener('pointerup', stop);
		window.removeEventListener('pointercancel', stop);
		window.removeEventListener('blur', stop);
		document.removeEventListener('visibilitychange', stop);
	}, []);

	// Also stops if the component unmounts mid-press (the field can disappear
	// when a calculator switches unit systems).
	useEffect(() => stop, [stop]);

	const nudge = useCallback(
		(direction: 1 | -1) => {
			const current = parseFloat(valueRef.current);
			const base = Number.isFinite(current) ? current : (min ?? 0);
			let next = base + direction * step;
			if (min !== undefined && next < min) next = min;
			if (max !== undefined && next > max) next = max;
			// Re-round to the step's precision so 0.1 + 0.2 never surfaces as
			// 0.30000000000000004.
			const decimals = (String(step).split('.')[1] ?? '').length;
			onChange(decimals > 0 ? next.toFixed(decimals) : String(next));
		},
		[min, max, step, onChange],
	);

	const startHold = useCallback(
		(direction: 1 | -1) => (event: PointerEvent) => {
			if (event.button !== undefined && event.button !== 0) return;
			stop(); // never stack two repeats
			nudge(direction);

			window.addEventListener('pointerup', stop);
			window.addEventListener('pointercancel', stop);
			window.addEventListener('blur', stop);
			document.addEventListener('visibilitychange', stop);

			holdTimer.current = window.setTimeout(() => {
				let ticks = 0;
				repeatTimer.current = window.setInterval(() => {
					if (++ticks > MAX_REPEATS) {
						stop();
						return;
					}
					nudge(direction);
				}, REPEAT_EVERY);
			}, REPEAT_DELAY);
		},
		[nudge, stop],
	);

	return (
		<label class="calc-field">
			<span class="calc-label">{label}</span>
			<div class="nf">
				<input
					class="nf-input"
					type="number"
					inputMode={inputMode}
					min={min}
					max={max}
					step={step}
					value={value}
					placeholder={placeholder}
					onInput={(e) => onChange((e.target as HTMLInputElement).value)}
				/>
				{unit && <span class="nf-unit">{unit}</span>}
				<span class="nf-steppers">
					<button
						type="button"
						class="nf-step"
						aria-label={`Increase ${label}`}
						tabIndex={-1}
						onPointerDown={startHold(1)}
						onPointerUp={stop}
						onPointerCancel={stop}
						onPointerLeave={stop}
					>
						<svg viewBox="0 0 10 6" aria-hidden="true">
							<path d="M1 5 L5 1 L9 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
					<button
						type="button"
						class="nf-step"
						aria-label={`Decrease ${label}`}
						tabIndex={-1}
						onPointerDown={startHold(-1)}
						onPointerUp={stop}
						onPointerCancel={stop}
						onPointerLeave={stop}
					>
						<svg viewBox="0 0 10 6" aria-hidden="true">
							<path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</span>
			</div>
		</label>
	);
}
