// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (headless scheduled task —
 * no viewer to composite frames to), so this exercises the actual
 * size-toggle / input / render path in a real DOM instead of only
 * unit-testing the pure solveLinearSystem function.
 */
import { render, fireEvent, screen, cleanup } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import SystemOfEquationsSolver from '../src/components/calculators/SystemOfEquationsSolver';

afterEach(cleanup);

describe('SystemOfEquationsSolver (DOM)', () => {
	it('defaults to the 2x2 example (2x+3y=8, x-y=-1) and shows x=1, y=2', () => {
		render(<SystemOfEquationsSolver />);
		expect(screen.getByText('x').nextElementSibling!.textContent).toBe('1');
		expect(screen.getByText('y').nextElementSibling!.textContent).toBe('2');
	});

	it('updating a coefficient recomputes the solution (x+y=2, x-y=0 -> x=1, y=1)', () => {
		render(<SystemOfEquationsSolver />);
		const b1 = screen.getByRole('spinbutton', { name: 'Eq 1: coefficient of y' }) as HTMLInputElement;
		const c1 = screen.getByRole('spinbutton', { name: 'Eq 1: constant (right of =)' }) as HTMLInputElement;
		const c2 = screen.getByRole('spinbutton', { name: 'Eq 2: constant (right of =)' }) as HTMLInputElement;
		fireEvent.input(b1, { target: { value: '1' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 1: coefficient of x' }), { target: { value: '1' } });
		fireEvent.input(c1, { target: { value: '2' } });
		fireEvent.input(c2, { target: { value: '0' } });

		expect(screen.getByText('x').nextElementSibling!.textContent).toBe('1');
		expect(screen.getByText('y').nextElementSibling!.textContent).toBe('1');
	});

	it('flags parallel 2x2 lines as no solution (x+y=2, x+y=5)', () => {
		render(<SystemOfEquationsSolver />);
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 1: coefficient of x' }), { target: { value: '1' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 1: coefficient of y' }), { target: { value: '1' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 1: constant (right of =)' }), { target: { value: '2' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 2: coefficient of x' }), { target: { value: '1' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 2: coefficient of y' }), { target: { value: '1' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 2: constant (right of =)' }), { target: { value: '5' } });

		expect(screen.getByText('No solution')).toBeTruthy();
	});

	it('flags a doubled 2x2 equation as infinitely many solutions (2x+y=5, 4x+2y=10)', () => {
		render(<SystemOfEquationsSolver />);
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 1: coefficient of x' }), { target: { value: '2' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 1: coefficient of y' }), { target: { value: '1' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 1: constant (right of =)' }), { target: { value: '5' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 2: coefficient of x' }), { target: { value: '4' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 2: coefficient of y' }), { target: { value: '2' } });
		fireEvent.input(screen.getByRole('spinbutton', { name: 'Eq 2: constant (right of =)' }), { target: { value: '10' } });

		expect(screen.getByText('Infinitely many solutions')).toBeTruthy();
	});

	it('switches to 3x3 mode and solves the worked example (x+y+z=6, 2y+5z=-4, 2x+5y-z=27 -> x=5, y=3, z=-2)', () => {
		render(<SystemOfEquationsSolver />);
		fireEvent.click(screen.getByRole('radio', { name: '3 equations' }));

		expect(screen.getByText('x').nextElementSibling!.textContent).toBe('5');
		expect(screen.getByText('y').nextElementSibling!.textContent).toBe('3');
		expect(screen.getByText('z').nextElementSibling!.textContent).toBe('-2');
	});

	it('prompts for input instead of a result when a field is left blank', () => {
		render(<SystemOfEquationsSolver />);
		const a1 = screen.getByRole('spinbutton', { name: 'Eq 1: coefficient of x' }) as HTMLInputElement;
		fireEvent.input(a1, { target: { value: '' } });

		expect(screen.queryByText('No solution')).toBeNull();
		expect(screen.getByText(/Enter every coefficient/i)).toBeTruthy();
	});
});
