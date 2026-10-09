// @vitest-environment happy-dom
import { render, fireEvent, screen, cleanup } from '@testing-library/preact';
import { describe, it, expect, afterEach } from 'vitest';
import MouseTest from '../src/components/calculators/MouseTest';

afterEach(cleanup);
const ticks = () => screen.getByText('Scroll ticks (up / down)').parentElement!.querySelector('.calc-result-value')!.textContent!.replace(/\s/g, '');
describe('MouseTest scroll counts', () => {
 it('ignores horizontal and zero movement, counts both vertical directions, and resets', () => {
  const { container } = render(<MouseTest />); const area = container.querySelector('.mousetest-area')!;
  fireEvent.wheel(area, { deltaX: 50, deltaY: 0 }); fireEvent.wheel(area, { deltaY: 0 }); expect(ticks()).toBe('0/0');
  fireEvent.wheel(area, { deltaY: -1 }); fireEvent.wheel(area, { deltaY: 1 }); expect(ticks()).toBe('1/1');
  fireEvent.wheel(area, { deltaX: 10, deltaY: 2 }); expect(ticks()).toBe('1/2');
  fireEvent.click(screen.getByRole('button', { name: /Reset test/ })); expect(ticks()).toBe('0/0');
 });
});
