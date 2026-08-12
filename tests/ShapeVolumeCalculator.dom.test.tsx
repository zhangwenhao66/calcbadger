// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (headless scheduled task —
 * no viewer to composite frames to), so this exercises the actual
 * shape-select / input / render path in a real DOM instead of only
 * unit-testing the pure math functions.
 */
import { render, fireEvent, screen, cleanup } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import ShapeVolumeCalculator from '../src/components/calculators/ShapeVolumeCalculator';

afterEach(cleanup);

function resultValue(label: string): string {
	return screen.getByText(label).parentElement!.querySelector('.calc-result-value')!.textContent!;
}

describe('ShapeVolumeCalculator (DOM)', () => {
	it('defaults to a 3x4x5 rectangular prism: volume 60 ft³, surface area 94 ft²', () => {
		render(<ShapeVolumeCalculator />);
		expect(resultValue('Volume')).toBe('60 ft³');
		expect(resultValue('Surface area')).toBe('94 ft²');
	});

	it('cylinder with radius 3, height 10: volume ~282.743 ft³, surface area ~245.044 ft²', () => {
		render(<ShapeVolumeCalculator />);
		fireEvent.click(screen.getByRole('radio', { name: 'Cylinder' }));

		const radiusInput = screen.getByRole('spinbutton', { name: /^Radius/ }) as HTMLInputElement;
		const heightInput = screen.getByRole('spinbutton', { name: /^Height/ }) as HTMLInputElement;
		fireEvent.input(radiusInput, { target: { value: '3' } });
		fireEvent.input(heightInput, { target: { value: '10' } });

		expect(resultValue('Volume')).toBe('282.743 ft³');
		expect(resultValue('Surface area')).toBe('245.044 ft²');
	});

	it('sphere with radius 5: volume ~523.599 ft³, surface area ~314.159 ft²', () => {
		render(<ShapeVolumeCalculator />);
		fireEvent.click(screen.getByRole('radio', { name: 'Sphere' }));

		const radiusInput = screen.getByRole('spinbutton', { name: /^Radius/ }) as HTMLInputElement;
		fireEvent.input(radiusInput, { target: { value: '5' } });

		expect(resultValue('Volume')).toBe('523.599 ft³');
		expect(resultValue('Surface area')).toBe('314.159 ft²');
	});

	it('cone with radius 3, height 4 (3-4-5 triangle): volume ~37.699 ft³, surface area ~75.398 ft²', () => {
		render(<ShapeVolumeCalculator />);
		fireEvent.click(screen.getByRole('radio', { name: 'Cone' }));

		const radiusInput = screen.getByRole('spinbutton', { name: /^Radius/ }) as HTMLInputElement;
		const heightInput = screen.getByRole('spinbutton', { name: /^Height/ }) as HTMLInputElement;
		fireEvent.input(radiusInput, { target: { value: '3' } });
		fireEvent.input(heightInput, { target: { value: '4' } });

		expect(resultValue('Volume')).toBe('37.699 ft³');
		expect(resultValue('Surface area')).toBe('75.398 ft²');
	});

	it('shows a prompt instead of a result when a dimension is zero', () => {
		render(<ShapeVolumeCalculator />);
		const lengthInput = screen.getByRole('spinbutton', { name: /^Length/ }) as HTMLInputElement;
		fireEvent.input(lengthInput, { target: { value: '0' } });

		expect(screen.queryByText('Volume')).toBeNull();
		expect(screen.getByText(/Enter the dimensions/i)).toBeTruthy();
	});
});
