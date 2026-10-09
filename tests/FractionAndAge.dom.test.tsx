// @vitest-environment happy-dom
import { render, fireEvent, screen, within, cleanup } from '@testing-library/preact';
import { afterEach, describe, it, expect } from 'vitest';
import FractionCalculator from '../src/components/calculators/FractionCalculator';
import AgeDifferenceCalculator from '../src/components/calculators/AgeDifferenceCalculator';

afterEach(cleanup);
function input(label: string, value: string) { fireEvent.input(screen.getByRole('spinbutton', { name: label }), { target: { value } }); }
function choose(name: string, label: string) {
 fireEvent.click(screen.getByRole('combobox', { name }));
 fireEvent.click(within(screen.getByRole('listbox')).getByText(label));
}
function value(label: string) { return screen.getByText(label).parentElement!.querySelector('.calc-result-value')!.textContent!; }

describe('FractionCalculator integer fields', () => {
 it('rejects the reproduced decimal denominator, then recovers with a genuine lowest-terms result', () => {
  render(<FractionCalculator />); expect(value('Result')).toBe('5/6');
  input('Fraction A: denominator', '2.5'); expect(screen.queryByText('Result')).toBeNull();
  expect(screen.getByText('Fraction A: Enter an integer denominator.')).toBeTruthy();
  input('Fraction A: denominator', '2'); expect(value('Result')).toBe('5/6');
  input('Fraction A: numerator', '0.1'); input('Fraction A: denominator', '0.2');
  expect(screen.queryByText('Result')).toBeNull(); expect(screen.getByText('Fraction A: Enter an integer numerator.')).toBeTruthy();
 });
 it.each(['Fraction A: whole', 'Fraction A: numerator', 'Fraction A: denominator', 'Fraction B: whole', 'Fraction B: numerator', 'Fraction B: denominator'])('rejects decimal and blank %s without silently defaulting', (label) => {
  render(<FractionCalculator />);
  for (const invalid of ['1.5', '']) { input(label, invalid); expect(screen.queryByText('Result')).toBeNull(); }
  input(label, label.endsWith('whole') ? '0' : '2'); expect(screen.getByText('Result')).toBeTruthy();
 });
 it('distinguishes zero denominators and division by zero from invalid integers', () => {
  render(<FractionCalculator />); input('Fraction A: denominator', '0');
  expect(screen.getByText('Fraction A: Denominator cannot be 0.')).toBeTruthy();
  input('Fraction A: denominator', '2'); input('Fraction B: numerator', '0');
  fireEvent.click(screen.getByRole('radio', { name: '÷' }));
  expect(screen.getByText('Dividing by zero is undefined. Fraction B cannot equal 0.')).toBeTruthy();
 });
 it('validates simplify and mixed/improper conversion, while preserving explicit decimal conversion', () => {
  render(<FractionCalculator />); choose('Calculator', 'Simplify a fraction'); expect(value('Simplified')).toBe('2/3');
  input('Numerator', '8.5'); expect(screen.queryByText('Simplified')).toBeNull();
  input('Numerator', '8'); input('Denominator', ''); expect(screen.queryByText('Simplified')).toBeNull();
  choose('Calculator', 'Convert (mixed / improper / decimal)'); expect(value('Improper fraction')).toBe('11/4');
  input('Whole', '2.5'); expect(screen.queryByText('Improper fraction')).toBeNull();
  input('Whole', ''); expect(screen.queryByText('Improper fraction')).toBeNull();
  input('Whole', '-2'); expect(value('Improper fraction')).toBe('-11/4');
  choose('Direction', 'Improper → mixed'); input('Denominator', '2.5'); expect(screen.queryByText('Mixed number')).toBeNull();
  input('Denominator', '4'); expect(value('Mixed number')).toBe('2 3/4');
  choose('Direction', 'Decimal → fraction'); input('Decimal', '0.1'); expect(value('Fraction')).toBe('1/10');
 });
});

describe('AgeDifferenceCalculator same birth date', () => {
 function birth(person: number, month: string, day: string, year: string) {
  const prefix = `Person ${person}'s birth date — `;
  input(prefix + 'month', month); input(prefix + 'day', day); input(prefix + 'year', year);
 }
 it('labels equal leap-day birthdays as same age, and restores both ordering directions after edits', () => {
  render(<AgeDifferenceCalculator />); birth(1, '2', '29', '2000'); birth(2, '2', '29', '2000');
  expect(value('Age gap').trim()).toBe('0y 0m 0d');
  expect(value("Person 1's age today")).toContain('(same age)'); expect(value("Person 2's age today")).toContain('(same age)');
  expect(value("Person 1's age today")).not.toMatch(/older|younger/);
  expect(value("Gap as % of either person's age")).toBe('0%');
  birth(2, '3', '1', '2000'); expect(value("Person 1's age today")).toContain('(older)'); expect(value("Person 2's age today")).toContain('(younger)');
  birth(1, '3', '2', '2000'); expect(value("Person 1's age today")).toContain('(younger)'); expect(value("Person 2's age today")).toContain('(older)');
 });
 it('still rejects a nonexistent leap day', () => {
  render(<AgeDifferenceCalculator />); birth(1, '2', '29', '2001');
  expect(screen.queryByText('Age gap')).toBeNull(); expect(screen.getByText(/Enter two valid calendar dates/)).toBeTruthy();
 });
});
