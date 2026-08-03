// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (headless scheduled task —
 * no viewer to composite frames to), so this exercises the actual click →
 * state → render path in a real DOM instead of only unit-testing the pure
 * math functions.
 */
import { render, fireEvent, screen, cleanup } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import CoinFlipCalculator from '../src/components/calculators/CoinFlipCalculator';

afterEach(cleanup);

describe('CoinFlipCalculator (DOM)', () => {
	it('shows no results before the first flip, then shows a summary that accounts for every coin after clicking', () => {
		render(<CoinFlipCalculator />);

		expect(screen.queryByText('Heads')).toBeNull();

		const flipButton = screen.getByRole('button', { name: /Flip 20 coins/i });
		fireEvent.click(flipButton);

		const headsLabel = screen.getByText('Heads');
		const tailsLabel = screen.getByText('Tails');
		const headsValue = headsLabel.parentElement!.querySelector('.calc-result-value')!;
		const tailsValue = tailsLabel.parentElement!.querySelector('.calc-result-value')!;

		const heads = parseInt(headsValue.textContent!, 10);
		const tails = parseInt(tailsValue.textContent!, 10);
		expect(heads + tails).toBe(20);
		expect(heads).toBeGreaterThanOrEqual(0);
		expect(tails).toBeGreaterThanOrEqual(0);
	});

	it('an always-heads bias (100%) produces an all-heads result with a full-length streak', () => {
		render(<CoinFlipCalculator />);

		const biasInput = screen.getByRole('spinbutton', { name: /Chance of heads/ }) as HTMLInputElement;
		fireEvent.input(biasInput, { target: { value: '100' } });

		const flipButton = screen.getByRole('button', { name: /Flip 20 coins/i });
		fireEvent.click(flipButton);

		const headsLabel = screen.getByText('Heads');
		const headsValue = headsLabel.parentElement!.querySelector('.calc-result-value')!;
		expect(parseInt(headsValue.textContent!, 10)).toBe(20);

		const streakLabel = screen.getByText('Longest heads streak');
		const streakValue = streakLabel.parentElement!.querySelector('.calc-result-value')!;
		expect(parseInt(streakValue.textContent!, 10)).toBe(20);
	});

	it('switches to the probability calculator and shows the known 10-flip, 5-heads answer (24.61%)', () => {
		render(<CoinFlipCalculator />);

		fireEvent.click(screen.getByRole('radio', { name: 'Probability calculator' }));

		const nInput = screen.getByRole('spinbutton', { name: 'Number of flips (n)' }) as HTMLInputElement;
		const kInput = screen.getByRole('spinbutton', { name: 'Heads count (k)' }) as HTMLInputElement;
		fireEvent.input(nInput, { target: { value: '10' } });
		fireEvent.input(kInput, { target: { value: '5' } });

		const exactLabel = screen.getByText('P(exactly 5)');
		const exactValue = exactLabel.parentElement!.querySelector('.calc-result-value')!;
		expect(exactValue.textContent).toBe('24.61%');
	});

	it('rejects k greater than n instead of showing a nonsense result', () => {
		render(<CoinFlipCalculator />);

		fireEvent.click(screen.getByRole('radio', { name: 'Probability calculator' }));

		const nInput = screen.getByRole('spinbutton', { name: 'Number of flips (n)' }) as HTMLInputElement;
		const kInput = screen.getByRole('spinbutton', { name: 'Heads count (k)' }) as HTMLInputElement;
		fireEvent.input(nInput, { target: { value: '5' } });
		fireEvent.input(kInput, { target: { value: '9' } });

		expect(screen.getByText(/must be between 0 and the number of flips/i)).toBeTruthy();
		expect(screen.queryByText('P(exactly 9)')).toBeNull();
	});
});
