// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (headless scheduled task —
 * no viewer to composite frames to), so this exercises the actual
 * mode-select / bias-input / spin-and-reveal path in a real DOM instead of
 * only unit-testing the pure math functions. The CSS spin transition itself
 * cannot run in jsdom/happy-dom, so tests simulate its completion by
 * dispatching a synthetic `transitionend` event on the wheel disc, which is
 * exactly the event the component's own reveal logic listens for.
 */
import { render, fireEvent, screen, cleanup } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import YesNoWheel from '../src/components/calculators/YesNoWheel';

afterEach(cleanup);

function resultValue(label: string): string {
	return screen.getByText(label).parentElement!.querySelector('.calc-result-value')!.textContent!;
}

function settleSpin(container: HTMLElement) {
	const disc = container.querySelector('.wheel-disc')!;
	const event = new Event('transitionend', { bubbles: true });
	Object.defineProperty(event, 'propertyName', { value: 'transform' });
	fireEvent(disc, event);
}

describe('YesNoWheel (DOM)', () => {
	it('defaults to a fair 50/50 wheel with the correct probability stats', () => {
		render(<YesNoWheel />);
		expect(resultValue('P(Yes)')).toBe('50.0%');
		expect(resultValue('P(No)')).toBe('50.0%');
		expect(resultValue('Avg. spins until Yes')).toBe('2.00');
		expect(resultValue('P(same answer twice running)')).toBe('25.0%');
	});

	it('shows no result before the first spin', () => {
		render(<YesNoWheel />);
		expect(screen.queryByText('Result')).toBeNull();
	});

	it('spinning shows a "Spinning…" state, then reveals a result once the disc transition ends', () => {
		const { container } = render(<YesNoWheel />);

		const spinButton = screen.getByRole('button', { name: /Spin the wheel/i });
		fireEvent.click(spinButton);

		expect(screen.getByRole('button', { name: /Spinning/i })).toBeTruthy();
		expect(screen.getByRole('button', { name: /Spinning/i }).hasAttribute('disabled')).toBe(true);

		settleSpin(container);

		const resolvedButton = screen.getByRole('button', { name: /Spin the wheel/i });
		expect(resolvedButton.hasAttribute('disabled')).toBe(false);

		const resultText = resultValue('Result');
		expect(['Yes', 'No']).toContain(resultText);
	});

	it('a wheel forced to 100% Yes always lands Yes, regardless of the random draw', () => {
		const { container } = render(<YesNoWheel />);

		const biasInput = screen.getByRole('spinbutton', { name: /Chance of Yes/ }) as HTMLInputElement;
		fireEvent.input(biasInput, { target: { value: '100' } });
		expect(resultValue('P(Yes)')).toBe('100.0%');

		fireEvent.click(screen.getByRole('button', { name: /Spin the wheel/i }));
		settleSpin(container);

		expect(resultValue('Result')).toBe('Yes');
	});

	it('a wheel forced to 0% Yes always lands No, and reports an infinite average wait for Yes', () => {
		const { container } = render(<YesNoWheel />);

		const biasInput = screen.getByRole('spinbutton', { name: /Chance of Yes/ }) as HTMLInputElement;
		fireEvent.input(biasInput, { target: { value: '0' } });
		expect(resultValue('Avg. spins until Yes')).toBe('∞');

		fireEvent.click(screen.getByRole('button', { name: /Spin the wheel/i }));
		settleSpin(container);

		expect(resultValue('Result')).toBe('No');
	});

	it('switching to the three-way wheel splits the odds into equal thirds and resets any prior result', () => {
		const { container } = render(<YesNoWheel />);

		fireEvent.click(screen.getByRole('button', { name: /Spin the wheel/i }));
		settleSpin(container);
		expect(screen.getByText('Result')).toBeTruthy();

		fireEvent.click(screen.getByRole('radio', { name: 'Yes / No / Maybe' }));

		expect(resultValue('P(Yes)')).toBe('33.3%');
		expect(resultValue('P(No)')).toBe('33.3%');
		expect(resultValue('P(Maybe)')).toBe('33.3%');
		expect(screen.queryByText('Result')).toBeNull();
		// The Chance-of-Yes bias field only applies to the two-way wheel.
		expect(screen.queryByRole('spinbutton', { name: /Chance of Yes/ })).toBeNull();
	});

	it('switching modes mid-spin (before the transition settles) does not strand the button in "Spinning…"', () => {
		render(<YesNoWheel />);

		fireEvent.click(screen.getByRole('button', { name: /Spin the wheel/i }));
		expect(screen.getByRole('button', { name: /Spinning/i })).toBeTruthy();

		// Switch mode before settleSpin() ever fires a transitionend for the
		// in-flight spin, so the pending segment index it would resolve to no
		// longer means anything in the new (2-way vs. 3-way) segment layout.
		fireEvent.click(screen.getByRole('radio', { name: 'Yes / No / Maybe' }));

		const button = screen.getByRole('button', { name: /Spin the wheel/i });
		expect(button.hasAttribute('disabled')).toBe(false);
		expect(screen.queryByText('Result')).toBeNull();
	});

	it('tracks spin history across repeated spins on a wheel forced to 100% Yes', () => {
		const { container } = render(<YesNoWheel />);

		const biasInput = screen.getByRole('spinbutton', { name: /Chance of Yes/ }) as HTMLInputElement;
		fireEvent.input(biasInput, { target: { value: '100' } });

		for (let i = 0; i < 3; i++) {
			fireEvent.click(screen.getByRole('button', { name: /Spin the wheel/i }));
			settleSpin(container);
		}

		expect(screen.getByText(/This session: Yes 3, No 0/)).toBeTruthy();
	});
});
