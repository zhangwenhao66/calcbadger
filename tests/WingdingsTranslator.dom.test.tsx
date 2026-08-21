// @vitest-environment happy-dom
/**
 * Component-level interaction test standing in for a live browser check.
 * The Browser pane was unavailable in this run (headless scheduled task —
 * no viewer to composite frames to), so this exercises the actual
 * mode-switch -> per-mode text state -> render path in a real DOM instead of
 * only unit-testing the pure conversion functions in
 * src/lib/wingdingsTranslator.ts. Pattern follows RoundingCalculator.dom.test.tsx,
 * which caught a real glue-code bug that lib-only tests missed.
 */
import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import WingdingsTranslator from '../src/components/calculators/WingdingsTranslator';

afterEach(cleanup);

function outputText(container: HTMLElement): string {
	return container.querySelector('.glitch-output-text')!.textContent!;
}

function convertedCount(container: HTMLElement): string {
	return container.querySelector('.calc-result-value.primary')!.textContent!;
}

describe('WingdingsTranslator (DOM)', () => {
	it('defaults to symbol preview mode and converts the default sample text', () => {
		const { container } = render(<WingdingsTranslator />);
		// "hello badger" is 12 characters, all printable ASCII -> all convert.
		expect(convertedCount(container)).toBe('12');
		expect(outputText(container).length).toBeGreaterThan(0);
		expect(outputText(container)).not.toBe('hello badger');
	});

	it('switching to "Windows font code" mode shifts every character into the 0xF020-0xF07E private-use band', () => {
		const { container } = render(<WingdingsTranslator />);
		fireEvent.click(screen.getByRole('radio', { name: 'Windows font code' }));

		const out = outputText(container);
		expect([...out].length).toBe('hello badger'.length);
		for (const ch of out) {
			const code = ch.codePointAt(0)!;
			expect(code).toBeGreaterThanOrEqual(0xf020);
			expect(code).toBeLessThanOrEqual(0xf07e);
		}
	});

	it('switching to "Decode to text" mode is pre-filled and decodes back to the original sample text', () => {
		const { container } = render(<WingdingsTranslator />);
		fireEvent.click(screen.getByRole('radio', { name: 'Decode to text' }));
		expect(outputText(container)).toBe('hello badger');
	});

	it('typing custom text in symbol preview mode updates the conversion live', () => {
		const { container } = render(<WingdingsTranslator />);
		const textarea = screen.getByPlaceholderText('Type something…') as HTMLTextAreaElement;
		fireEvent.input(textarea, { target: { value: 'Hi!' } });

		expect(convertedCount(container)).toBe('3'); // "Hi!" is 3 printable-ASCII characters
		expect(outputText(container).length).toBeGreaterThan(0);
	});

	it('keeps separate text per mode: editing symbol-preview text does not change font-code mode text', () => {
		render(<WingdingsTranslator />);
		const textarea = screen.getByPlaceholderText('Type something…') as HTMLTextAreaElement;
		fireEvent.input(textarea, { target: { value: 'zzz' } });

		fireEvent.click(screen.getByRole('radio', { name: 'Windows font code' }));
		const fontCodeTextarea = screen.getByPlaceholderText('Type something…') as HTMLTextAreaElement;
		expect(fontCodeTextarea.value).toBe('hello badger'); // untouched, mode-local state
	});

	it('clicking a legend button flips its label to "Copied!"', async () => {
		render(<WingdingsTranslator />);
		const legendButton = screen.getByRole('button', { name: /Copy the symbol for A:/ });
		fireEvent.click(legendButton);
		await waitFor(() => expect(legendButton.textContent).toContain('Copied!'));
	});

	it('clicking the main copy button flips its label to "Copied!" without throwing', async () => {
		render(<WingdingsTranslator />);
		const copyButton = screen.getByRole('button', { name: /Copy symbol preview output/ });
		expect(() => fireEvent.click(copyButton)).not.toThrow();
		await waitFor(() => expect(copyButton.textContent).toBe('Copied!'));
	});

	it('renders all 26 A-Z legend cells', () => {
		render(<WingdingsTranslator />);
		const cells = screen.getAllByRole('button', { name: /^Copy the symbol for [A-Z]:/ });
		expect(cells.length).toBe(26);
	});
});
