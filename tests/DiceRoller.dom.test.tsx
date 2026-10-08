// @vitest-environment happy-dom
import { render, fireEvent, screen, cleanup, within } from '@testing-library/preact';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DiceRoller from '../src/components/calculators/DiceRoller';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function roll() { fireEvent.click(screen.getByRole('button', { name: /^Roll / })); }
function change(name: string, value: string) { fireEvent.input(screen.getByRole('spinbutton', { name }), { target: { value } }); }
function result(label: string) { return screen.getByText(label).parentElement!.querySelector('.calc-result-value')!.textContent; }

describe('DiceRoller configuration and input boundaries', () => {
 it('requires a fresh roll after normal, advantage, disadvantage, or die-type changes', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.1);
  render(<DiceRoller />); roll(); expect(result('Total')).toBe('3');
  fireEvent.click(screen.getByRole('radio', { name: 'Advantage' }));
  expect(screen.queryByText('Total')).toBeNull(); expect(screen.queryByText('Both d20 rolls')).toBeNull();
  roll(); expect(result('Both d20 rolls')).toBe('3, 3');
  fireEvent.click(screen.getByRole('radio', { name: 'Disadvantage' })); expect(screen.queryByText('Total')).toBeNull();
  roll(); fireEvent.click(screen.getByRole('combobox', { name: 'Dice type' }));
  fireEvent.click(within(screen.getByRole('listbox')).getByText('d6'));
  expect(screen.queryByText('Total')).toBeNull(); roll(); expect(result('Total')).toBe('1');
  expect(result('Individual rolls')).toBe('1');
 });
 it('clears stale results after count or modifier edits and still computes the new total', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.1);
  render(<DiceRoller />); roll(); change('Number of dice', '2'); expect(screen.queryByText('Total')).toBeNull();
  roll(); expect(result('Total')).toBe('6'); change('Modifier', '4'); expect(screen.queryByText('Total')).toBeNull();
  roll(); expect(result('Total')).toBe('10');
 });
 it.each(['', '0', '21', '1.5', '1000000000'])('rejects invalid dice count %s', (value) => {
  render(<DiceRoller />); change('Number of dice', value);
  expect((screen.getByRole('button', { name: /^Roll / }) as HTMLButtonElement).disabled).toBe(true);
 });
 it.each(['', '-101', '101', '0.5'])('rejects invalid modifiers %s instead of silently rounding', (value) => {
  render(<DiceRoller />); change('Modifier', value);
  expect((screen.getByRole('button', { name: /^Roll / }) as HTMLButtonElement).disabled).toBe(true);
 });
 it('keeps advantage and disadvantage calculations correct after reroll', () => {
  const random = vi.spyOn(Math, 'random'); render(<DiceRoller />);
  fireEvent.click(screen.getByRole('radio', { name: 'Advantage' }));
  random.mockReturnValueOnce(0.1).mockReturnValueOnce(0.8); roll(); expect(result('Total')).toBe('17');
  fireEvent.click(screen.getByRole('radio', { name: 'Disadvantage' }));
  random.mockReturnValueOnce(0.1).mockReturnValueOnce(0.8); roll(); expect(result('Total')).toBe('3');
 });
 it('rejects fractional probability inputs and recovers with valid integers', () => {
  render(<DiceRoller />); fireEvent.click(screen.getByRole('radio', { name: 'Probability calculator' }));
  const target = screen.getByRole('spinbutton', { name: /Target/ });
  fireEvent.input(target, { target: { value: '7.5' } }); expect(screen.queryByText('Expected total')).toBeNull();
  fireEvent.input(target, { target: { value: '7' } }); expect(screen.getByText('Expected total')).toBeTruthy();
 });
});
