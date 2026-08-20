// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (headless scheduled task —
 * no viewer to composite frames to), so this exercises the actual
 * preset-select -> state -> render path in a real DOM instead of only
 * unit-testing the pure math functions in src/lib/rounding.ts.
 *
 * This file exists specifically because an independent audit (2026-08-20)
 * caught a sign-inversion bug that the 52 lib-only unit tests could not
 * see: the component negated the decimal-place PRESET values a second
 * time even though the presets already encode the target placeExponent
 * directly, so every non-zero preset rounded to the mathematically
 * opposite precision (e.g. the page's own default demo, 1.005 rounded to
 * "Nearest hundredth", showed 0 instead of 1.01). A lib-only test can
 * never catch a bug in the glue code between the UI and the lib; only a
 * rendered-DOM test exercising the actual preset dropdown can.
 */
import { render, fireEvent, screen, cleanup, within } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import RoundingCalculator from '../src/components/calculators/RoundingCalculator';

afterEach(cleanup);

function primaryResult(): string {
	return screen.getByText('Rounded result').parentElement!.querySelector('.calc-result-value')!.textContent!;
}

function choosePreset(label: RegExp) {
	fireEvent.click(screen.getByRole('combobox', { name: 'Round to' }));
	const listbox = screen.getByRole('listbox');
	fireEvent.click(within(listbox).getByText(label));
}

describe('RoundingCalculator (DOM)', () => {
	it('the default page-load state (1.005, Nearest hundredth, Half up) shows 1.01, not 0 or 1.00', () => {
		render(<RoundingCalculator />);
		expect(primaryResult()).toBe('1.01');
	});

	it('switching to "Nearest 10" rounds toward tens, not toward thousandths (regression test for the preset sign-inversion bug)', () => {
		render(<RoundingCalculator />);

		const input = screen.getByRole('spinbutton', { name: 'Number to round' }) as HTMLInputElement;
		fireEvent.input(input, { target: { value: '247' } });

		choosePreset(/Nearest 10$/);

		expect(primaryResult()).toBe('250');
	});

	it('switching to "Nearest 1,000" rounds to thousands, not to three decimal places', () => {
		render(<RoundingCalculator />);

		const input = screen.getByRole('spinbutton', { name: 'Number to round' }) as HTMLInputElement;
		fireEvent.input(input, { target: { value: '1234.5678' } });

		choosePreset(/Nearest 1,000/);

		expect(primaryResult()).toBe('1000');
	});

	it('custom decimal places (positive count) still rounds correctly after the preset-path fix', () => {
		render(<RoundingCalculator />);

		fireEvent.click(screen.getByRole('combobox', { name: 'Round to' }));
		fireEvent.click(within(screen.getByRole('listbox')).getByText('Custom decimal places…'));

		const customField = screen.getByRole('spinbutton', { name: 'Decimal places' }) as HTMLInputElement;
		fireEvent.input(customField, { target: { value: '3' } });

		const input = screen.getByRole('spinbutton', { name: 'Number to round' }) as HTMLInputElement;
		fireEvent.input(input, { target: { value: '3.14159' } });

		expect(primaryResult()).toBe('3.142');
	});

	it('significant-figures mode: 995 to 2 sig figs shows 1000 and flags the exact-tie note', () => {
		render(<RoundingCalculator />);

		fireEvent.click(screen.getByRole('radio', { name: 'Significant figures' }));

		const input = screen.getByRole('spinbutton', { name: 'Number to round' }) as HTMLInputElement;
		fireEvent.input(input, { target: { value: '995' } });

		const sigFigsField = screen.getByRole('spinbutton', { name: 'Significant figures' }) as HTMLInputElement;
		fireEvent.input(sigFigsField, { target: { value: '2' } });

		expect(primaryResult()).toBe('1000');
		expect(screen.getByText(/1.0 × 10\^3/)).toBeTruthy();
		expect(screen.getByText(/sits exactly halfway at this precision/)).toBeTruthy();
	});
});
