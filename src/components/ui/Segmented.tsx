import { useRef } from 'preact/hooks';

/**
 * A key row for choices that are short and few (units, metric vs imperial,
 * APY vs APR). Every option stays visible, so picking one is a single tap
 * instead of open-menu-then-pick, and the control reads as a bank of keys
 * rather than a form widget.
 *
 * Radiogroup semantics with a roving tabindex: Tab reaches the group once,
 * then the arrow keys move between options, per the WAI-ARIA radio pattern.
 */
export interface SegmentedOption<T extends string> {
	value: T;
	label: string;
	/** Spoken by screen readers when the visible label is an abbreviation. */
	title?: string;
}

interface Props<T extends string> {
	label: string;
	value: T;
	options: SegmentedOption<T>[];
	onChange: (next: T) => void;
	/** Take two grid columns; use it when 4+ options would otherwise truncate. */
	wide?: boolean;
}

export default function Segmented<T extends string>({ label, value, options, onChange, wide }: Props<T>) {
	const refs = useRef<(HTMLButtonElement | null)[]>([]);

	function focusAndSelect(index: number) {
		const wrapped = (index + options.length) % options.length;
		onChange(options[wrapped]!.value);
		refs.current[wrapped]?.focus();
	}

	function onKeyDown(event: KeyboardEvent, index: number) {
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				event.preventDefault();
				focusAndSelect(index + 1);
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				event.preventDefault();
				focusAndSelect(index - 1);
				break;
			case 'Home':
				event.preventDefault();
				focusAndSelect(0);
				break;
			case 'End':
				event.preventDefault();
				focusAndSelect(options.length - 1);
				break;
		}
	}

	return (
		<div class={`calc-field${wide ? ' is-wide' : ''}`}>
			<span class="calc-label" id={`seg-${label.replace(/\W+/g, '-')}`}>
				{label}
			</span>
			<div class="seg" role="radiogroup" aria-labelledby={`seg-${label.replace(/\W+/g, '-')}`}>
				{options.map((option, i) => {
					const selected = option.value === value;
					return (
						<button
							type="button"
							role="radio"
							aria-checked={selected}
							aria-label={option.title}
							class={`seg-item${selected ? ' is-on' : ''}`}
							tabIndex={selected ? 0 : -1}
							ref={(el) => (refs.current[i] = el as HTMLButtonElement | null)}
							onClick={() => onChange(option.value)}
							onKeyDown={(e) => onKeyDown(e as unknown as KeyboardEvent, i)}
						>
							{option.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
