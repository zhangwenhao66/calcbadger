import { useState } from 'preact/hooks';
import { solveLinearSystem } from '../../lib/linearSystem';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

type Size = '2' | '3';

const SIZES = [
	{ value: '2' as Size, label: '2 equations' },
	{ value: '3' as Size, label: '3 equations' },
];

function fmt(n: number): string {
	return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

function toFinite(value: string): number {
	const n = parseFloat(value);
	return Number.isFinite(n) ? n : NaN;
}

export default function SystemOfEquationsSolver() {
	const [size, setSize] = useState<Size>('2');

	// 2-equation mode: a1 x + b1 y = c1 ; a2 x + b2 y = c2
	const [a1, setA1] = useState('2');
	const [b1, setB1] = useState('3');
	const [c1, setC1] = useState('8');
	const [a2, setA2] = useState('1');
	const [b2, setB2] = useState('-1');
	const [c2, setC2] = useState('-1');

	// 3-equation mode: a x + b y + c z = d, one row each
	const [r1, setR1] = useState(['1', '1', '1', '6']);
	const [r2, setR2] = useState(['0', '2', '5', '-4']);
	const [r3, setR3] = useState(['2', '5', '-1', '27']);

	function updateRow(setter: (v: string[]) => void, row: string[], index: number, value: string) {
		const next = [...row];
		next[index] = value;
		setter(next);
	}

	let coefficients: number[][] = [];
	let constants: number[] = [];
	let inputsComplete = false;

	if (size === '2') {
		coefficients = [
			[toFinite(a1), toFinite(b1)],
			[toFinite(a2), toFinite(b2)],
		];
		constants = [toFinite(c1), toFinite(c2)];
		inputsComplete = coefficients.every((row) => row.every(Number.isFinite)) && constants.every(Number.isFinite);
	} else {
		coefficients = [r1.slice(0, 3), r2.slice(0, 3), r3.slice(0, 3)].map((row) => row.map(toFinite));
		constants = [r1[3]!, r2[3]!, r3[3]!].map(toFinite);
		inputsComplete = coefficients.every((row) => row.every(Number.isFinite)) && constants.every(Number.isFinite);
	}

	const result = inputsComplete ? solveLinearSystem(coefficients, constants) : null;
	const varNames = size === '2' ? ['x', 'y'] : ['x', 'y', 'z'];

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented label="System size" value={size} onChange={setSize} options={SIZES} wide />

				{size === '2' && (
					<>
						<NumberField label="Eq 1: coefficient of x" value={a1} onChange={setA1} step={1} />
						<NumberField label="Eq 1: coefficient of y" value={b1} onChange={setB1} step={1} />
						<NumberField label="Eq 1: constant (right of =)" value={c1} onChange={setC1} step={1} />
						<NumberField label="Eq 2: coefficient of x" value={a2} onChange={setA2} step={1} />
						<NumberField label="Eq 2: coefficient of y" value={b2} onChange={setB2} step={1} />
						<NumberField label="Eq 2: constant (right of =)" value={c2} onChange={setC2} step={1} />
					</>
				)}

				{size === '3' && (
					<>
						<NumberField label="Eq 1: coeff. x" value={r1[0]!} onChange={(v) => updateRow(setR1, r1, 0, v)} step={1} />
						<NumberField label="Eq 1: coeff. y" value={r1[1]!} onChange={(v) => updateRow(setR1, r1, 1, v)} step={1} />
						<NumberField label="Eq 1: coeff. z" value={r1[2]!} onChange={(v) => updateRow(setR1, r1, 2, v)} step={1} />
						<NumberField label="Eq 1: constant" value={r1[3]!} onChange={(v) => updateRow(setR1, r1, 3, v)} step={1} />
						<NumberField label="Eq 2: coeff. x" value={r2[0]!} onChange={(v) => updateRow(setR2, r2, 0, v)} step={1} />
						<NumberField label="Eq 2: coeff. y" value={r2[1]!} onChange={(v) => updateRow(setR2, r2, 1, v)} step={1} />
						<NumberField label="Eq 2: coeff. z" value={r2[2]!} onChange={(v) => updateRow(setR2, r2, 2, v)} step={1} />
						<NumberField label="Eq 2: constant" value={r2[3]!} onChange={(v) => updateRow(setR2, r2, 3, v)} step={1} />
						<NumberField label="Eq 3: coeff. x" value={r3[0]!} onChange={(v) => updateRow(setR3, r3, 0, v)} step={1} />
						<NumberField label="Eq 3: coeff. y" value={r3[1]!} onChange={(v) => updateRow(setR3, r3, 1, v)} step={1} />
						<NumberField label="Eq 3: coeff. z" value={r3[2]!} onChange={(v) => updateRow(setR3, r3, 2, v)} step={1} />
						<NumberField label="Eq 3: constant" value={r3[3]!} onChange={(v) => updateRow(setR3, r3, 3, v)} step={1} />
					</>
				)}
			</div>

			{result ? (
				<div class="calc-results">
					{result.type === 'unique' &&
						result.solution.map((v, i) => (
							<div key={varNames[i]}>
								<p class="calc-result-label">{varNames[i]}</p>
								<p class="calc-result-value primary">{fmt(v)}</p>
							</div>
						))}
					{result.type === 'none' && (
						<div>
							<p class="calc-result-label">Result</p>
							<p class="calc-result-value primary">No solution</p>
						</div>
					)}
					{result.type === 'infinite' && (
						<div>
							<p class="calc-result-label">Result</p>
							<p class="calc-result-value primary">Infinitely many solutions</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Enter every coefficient and constant to see the solution.</p>
			)}

			{result?.type === 'none' && (
				<p class="calc-note">
					The equations are inconsistent (in 2D, this means the lines are parallel and never meet). No values of{' '}
					{varNames.join(', ')} satisfy every equation at once.
				</p>
			)}
			{result?.type === 'infinite' && (
				<p class="calc-note">
					At least one equation is a combination of the others, so the system doesn't pin down a single point (in
					2D, the lines overlap completely). Infinitely many combinations of {varNames.join(', ')} work.
				</p>
			)}

			<p class="calc-note">
				Solved by Gaussian elimination with partial pivoting, the standard numerical method for linear systems.
				Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
