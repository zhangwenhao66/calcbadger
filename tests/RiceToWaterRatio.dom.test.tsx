// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (unattended session -- no
 * viewer to composite frames to, per the project's scheduled-task
 * constraints), so this exercises the actual amount-input / unit-toggle /
 * rice-type-select -> state -> render path in a real DOM, the same
 * fallback pattern used by RoundingCalculator.dom.test.tsx and
 * ShapeVolumeCalculator.dom.test.tsx when the same constraint applied to
 * those runs. This catches glue-code bugs between the UI and
 * src/lib/riceToWaterRatio.ts that the lib-only unit tests cannot see
 * (wrong field wired to wrong prop, wrong rounding applied at render time,
 * NaN slipping through on a fresh mount, etc).
 *
 * Expected values are the same independently Python-computed figures used
 * in tests/riceToWaterRatio.test.ts, not copied from this component's own
 * rendered output.
 */
import { render, fireEvent, screen, cleanup, within } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import RiceToWaterRatio from '../src/components/calculators/RiceToWaterRatio';

afterEach(cleanup);

function resultValue(label: string): string {
	return screen.getByText(label).parentElement!.querySelector('.calc-result-value')!.textContent!;
}

function chooseRiceType(label: RegExp) {
	fireEvent.click(screen.getByRole('combobox', { name: 'Rice type' }));
	const listbox = screen.getByRole('listbox');
	fireEvent.click(within(listbox).getByText(label));
}

describe('RiceToWaterRatio (DOM)', () => {
	it('default page-load state (2 cups, White rice long grain) shows 4 cups / 946.4 ml water, 6 cups / 48 oz cooked', () => {
		render(<RiceToWaterRatio />);
		expect(resultValue('Water needed')).toBe('4 cups');
		expect(resultValue('Water needed (ml)')).toBe('946.4 ml');
		expect(resultValue('Est. cooked yield')).toBe('6 cups');
		expect(resultValue('Est. cooked yield (oz)')).toBe('48 oz');
	});

	it('switching rice type to brown (2.25:1) recomputes water and yield for the same 2-cup amount', () => {
		render(<RiceToWaterRatio />);
		chooseRiceType(/Brown rice, medium or long grain/);

		expect(resultValue('Water needed')).toBe('4.5 cups');
		expect(resultValue('Est. cooked yield')).toBe('6.5 cups');
		expect(resultValue('Est. cooked yield (oz)')).toBe('52 oz');
	});

	it('switching to grams and entering 200g of wild rice matches the independently computed figures', () => {
		render(<RiceToWaterRatio />);

		fireEvent.click(screen.getByRole('radio', { name: 'Grams (dry)' }));

		const amountInput = screen.getByRole('spinbutton', { name: 'Amount of dry rice' }) as HTMLInputElement;
		fireEvent.input(amountInput, { target: { value: '200' } });

		chooseRiceType(/Wild rice/);

		// Python-verified (see tests/riceToWaterRatio.test.ts): riceCups~=1.0078,
		// waterCups~=3.023, waterMl~=715.3, cookedCups~=4.031, cookedOz~=32.25.
		expect(resultValue('Water needed')).toBe('3.023 cups');
		expect(resultValue('Water needed (ml)')).toBe('715.3 ml');
		expect(resultValue('Est. cooked yield')).toBe('4.031 cups');
		expect(resultValue('Est. cooked yield (oz)')).toBe('32.25 oz');
	});

	it('zero or blank amount shows the empty-state note instead of NaN', () => {
		render(<RiceToWaterRatio />);

		const amountInput = screen.getByRole('spinbutton', { name: 'Amount of dry rice' }) as HTMLInputElement;
		fireEvent.input(amountInput, { target: { value: '0' } });

		expect(screen.getByText(/Enter an amount of dry rice greater than 0/)).toBeTruthy();
		expect(screen.queryByText('Water needed')).toBeNull();
	});

	it('footer discloses that calculations run locally', () => {
		render(<RiceToWaterRatio />);
		expect(screen.getByText(/nothing you type is sent anywhere/i)).toBeTruthy();
	});
});
