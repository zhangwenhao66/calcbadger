import { useCallback, useEffect, useId, useRef, useState } from 'preact/hooks';

/**
 * A listbox for choices too long or too many for a key row (compounding
 * schedules, solve-for modes, compound presets).
 *
 * A native <select> was the first thing here and it was the single worst
 * detail on the site: the browser paints the popup with OS chrome, so a
 * light-grey menu opened over the dark instrument. This draws the menu in
 * the instrument's own language instead.
 *
 * Follows the WAI-ARIA combobox/listbox pattern: Enter, Space, Alt+Down or a
 * click opens; arrows move the active option; Enter or Space commits; Escape
 * closes without committing; Home/End jump; typing letters jumps to the first
 * match. Focus returns to the button on close, and the menu flips above the
 * button when there is not enough room below (it lives inside a short iframe
 * on embed pages).
 */
export interface SelectOption<T extends string> {
	value: T;
	label: string;
}

interface Props<T extends string> {
	label: string;
	value: T;
	options: SelectOption<T>[];
	onChange: (next: T) => void;
	/** Take two grid columns; use it when the longest label would truncate. */
	wide?: boolean;
}

export default function Select<T extends string>({ label, value, options, onChange, wide }: Props<T>) {
	const uid = useId();
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);
	const [flip, setFlip] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const listRef = useRef<HTMLUListElement | null>(null);
	const typeahead = useRef({ buffer: '', at: 0 });

	const selectedIndex = Math.max(
		0,
		options.findIndex((o) => o.value === value),
	);
	const current = options[selectedIndex];

	const close = useCallback((refocus = true) => {
		setOpen(false);
		if (refocus) buttonRef.current?.focus();
	}, []);

	const openMenu = useCallback(() => {
		const rect = buttonRef.current?.getBoundingClientRect();
		// Roughly how tall the menu will be; flip up when the space below is short.
		const estimated = Math.min(options.length, 6) * 38 + 12;
		if (rect) setFlip(window.innerHeight - rect.bottom < estimated && rect.top > estimated);
		setActive(selectedIndex);
		setOpen(true);
	}, [options.length, selectedIndex]);

	// Close on outside pointer down and on scroll of an ancestor.
	useEffect(() => {
		if (!open) return;
		function onDocPointerDown(event: PointerEvent) {
			const target = event.target as Node;
			if (!buttonRef.current?.contains(target) && !listRef.current?.contains(target)) {
				setOpen(false);
			}
		}
		document.addEventListener('pointerdown', onDocPointerDown, true);
		return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
	}, [open]);

	// Keep the active option in view when arrowing through a long list.
	useEffect(() => {
		if (!open) return;
		const node = listRef.current?.children[active] as HTMLElement | undefined;
		node?.scrollIntoView({ block: 'nearest' });
	}, [open, active]);

	function commit(index: number) {
		const option = options[index];
		if (option) onChange(option.value);
		close();
	}

	function jumpToTyped(key: string) {
		const now = Date.now();
		const buffer = now - typeahead.current.at > 800 ? key : typeahead.current.buffer + key;
		typeahead.current = { buffer, at: now };
		const found = options.findIndex((o) => o.label.toLowerCase().startsWith(buffer.toLowerCase()));
		if (found >= 0) {
			if (open) setActive(found);
			else onChange(options[found]!.value);
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!open) {
			if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				openMenu();
			} else if (event.key.length === 1 && /\S/.test(event.key)) {
				jumpToTyped(event.key);
			}
			return;
		}
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				setActive((i) => (i + 1) % options.length);
				break;
			case 'ArrowUp':
				event.preventDefault();
				setActive((i) => (i - 1 + options.length) % options.length);
				break;
			case 'Home':
				event.preventDefault();
				setActive(0);
				break;
			case 'End':
				event.preventDefault();
				setActive(options.length - 1);
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				commit(active);
				break;
			case 'Escape':
				event.preventDefault();
				close();
				break;
			case 'Tab':
				close(false);
				break;
			default:
				if (event.key.length === 1 && /\S/.test(event.key)) jumpToTyped(event.key);
		}
	}

	return (
		<div class={`calc-field${wide ? ' is-wide' : ''}`}>
			<span class="calc-label" id={`${uid}-label`}>
				{label}
			</span>
			<div class="sel">
				<button
					type="button"
					ref={buttonRef}
					class={`sel-button${open ? ' is-open' : ''}`}
					role="combobox"
					aria-expanded={open}
					aria-controls={`${uid}-list`}
					aria-labelledby={`${uid}-label`}
					aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
					onClick={() => (open ? close() : openMenu())}
					onKeyDown={(e) => onKeyDown(e as unknown as KeyboardEvent)}
				>
					<span class="sel-value">{current?.label}</span>
					<svg class="sel-chevron" viewBox="0 0 10 6" aria-hidden="true">
						<path
							d="M1 1 L5 5 L9 1"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"></path>
					</svg>
				</button>

				{open && (
					<ul
						id={`${uid}-list`}
						ref={listRef}
						class={`sel-pop${flip ? ' is-up' : ''}`}
						role="listbox"
						aria-labelledby={`${uid}-label`}>
						{options.map((option, i) => (
							<li
								id={`${uid}-opt-${i}`}
								role="option"
								aria-selected={option.value === value}
								class={`sel-opt${i === active ? ' is-active' : ''}${option.value === value ? ' is-on' : ''}`}
								onPointerEnter={() => setActive(i)}
								onClick={() => commit(i)}>
								<span>{option.label}</span>
								{option.value === value && (
									<svg class="sel-tick" viewBox="0 0 12 10" aria-hidden="true">
										<path
											d="M1 5 L4.5 8.5 L11 1.5"
											fill="none"
											stroke="currentColor"
											stroke-width="1.8"
											stroke-linecap="round"
											stroke-linejoin="round"></path>
									</svg>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
