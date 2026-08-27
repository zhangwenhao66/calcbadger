/**
 * Solves a square system of linear equations (2 equations/2 unknowns or
 * 3 equations/3 unknowns) by Gaussian elimination with partial pivoting,
 * reduced all the way to diagonal form (Gauss-Jordan) so the solution can be
 * read off directly. This is the standard method for linear systems — see
 * Wikipedia: "Gaussian elimination" and "System of linear equations".
 *
 * Partial pivoting (always eliminating using the row with the largest
 * remaining coefficient in the current column) keeps the method numerically
 * stable and doubles as the mechanism that distinguishes the three possible
 * outcomes: a system with full rank has exactly one solution; a rank-deficient
 * system that stays consistent (every zero row's constant is also zero) has
 * infinitely many; a rank-deficient system with a nonzero constant on a zero
 * row is inconsistent and has none.
 */

export type SolveResult =
	| { type: 'unique'; solution: number[] }
	| { type: 'none' }
	| { type: 'infinite' };

const EPS = 1e-9;

/**
 * `coefficients` is an n×n array (row i = equation i's coefficients),
 * `constants` is the length-n right-hand side. Both must have matching
 * length n (2 or 3 in this tool, though the algorithm itself is general).
 */
export function solveLinearSystem(coefficients: number[][], constants: number[]): SolveResult {
	const n = coefficients.length;
	const m = coefficients.map((row, i) => [...row, constants[i]!]);

	let rank = 0;
	for (let col = 0; col < n && rank < n; col++) {
		let pivotRow = -1;
		let maxAbs = EPS;
		for (let row = rank; row < n; row++) {
			const v = Math.abs(m[row]![col]!);
			if (v > maxAbs) {
				maxAbs = v;
				pivotRow = row;
			}
		}
		if (pivotRow === -1) continue;

		const tmp = m[rank]!;
		m[rank] = m[pivotRow]!;
		m[pivotRow] = tmp;

		for (let row = 0; row < n; row++) {
			if (row === rank) continue;
			const factor = m[row]![col]! / m[rank]![col]!;
			if (factor === 0) continue;
			for (let k = col; k <= n; k++) {
				m[row]![k]! -= factor * m[rank]![k]!;
			}
		}
		rank++;
	}

	for (let row = rank; row < n; row++) {
		if (Math.abs(m[row]![n]!) > EPS) return { type: 'none' };
	}

	if (rank < n) return { type: 'infinite' };

	const solution = new Array(n).fill(0);
	for (let row = 0; row < n; row++) {
		let col = -1;
		for (let c = 0; c < n; c++) {
			if (Math.abs(m[row]![c]!) > EPS) {
				col = c;
				break;
			}
		}
		if (col === -1) continue;
		solution[col] = m[row]![n]! / m[row]![col]!;
	}
	return { type: 'unique', solution };
}
