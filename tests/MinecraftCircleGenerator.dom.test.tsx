// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (headless scheduled task —
 * no viewer to composite frames to), so this exercises the actual
 * radius/mode input and result-display path in a real DOM instead of only
 * unit-testing the pure grid-generation function.
 */
import { render, fireEvent, screen, cleanup } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import MinecraftCircleGenerator from '../src/components/calculators/MinecraftCircleGenerator';

afterEach(cleanup);

function resultValue(label: string): string {
	return screen.getByText(label).parentElement!.querySelector('.calc-result-value')!.textContent!;
}

describe('MinecraftCircleGenerator (DOM)', () => {
	it('defaults to radius 8: diameter 17 blocks, 197 total blocks', () => {
		render(<MinecraftCircleGenerator />);
		expect(resultValue('Diameter')).toBe('17 blocks');
		expect(resultValue('Total blocks')).toBe('197');
	});

	it('radius 3 filled: diameter 7 blocks, 29 total blocks, matches the hand-verified grid', () => {
		render(<MinecraftCircleGenerator />);
		const radiusInput = screen.getByRole('spinbutton', { name: /^Radius/ }) as HTMLInputElement;
		fireEvent.input(radiusInput, { target: { value: '3' } });

		expect(resultValue('Diameter')).toBe('7 blocks');
		expect(resultValue('Total blocks')).toBe('29');
	});

	it('switching to outline mode at radius 3 drops the count to 16', () => {
		render(<MinecraftCircleGenerator />);
		const radiusInput = screen.getByRole('spinbutton', { name: /^Radius/ }) as HTMLInputElement;
		fireEvent.input(radiusInput, { target: { value: '3' } });
		fireEvent.click(screen.getByRole('radio', { name: 'Outline' }));

		expect(resultValue('Total blocks')).toBe('16');
	});

	it('clamps a radius above the 30 maximum down to 30 (2,821 blocks filled)', () => {
		render(<MinecraftCircleGenerator />);
		const radiusInput = screen.getByRole('spinbutton', { name: /^Radius/ }) as HTMLInputElement;
		fireEvent.input(radiusInput, { target: { value: '999' } });

		expect(resultValue('Diameter')).toBe('61 blocks');
		expect(resultValue('Total blocks')).toBe('2821');
	});

	it('renders the row-breakdown schematic text with the block total in the header', () => {
		render(<MinecraftCircleGenerator />);
		const radiusInput = screen.getByRole('spinbutton', { name: /^Radius/ }) as HTMLInputElement;
		fireEvent.input(radiusInput, { target: { value: '2' } });

		expect(screen.getByText(/13 blocks total/)).toBeTruthy();
		expect(screen.getByText(/Row \+0: 5 blocks, columns -2 to 2/)).toBeTruthy();
	});
});
