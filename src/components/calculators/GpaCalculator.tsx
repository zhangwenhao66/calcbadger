import { useState } from 'preact/hooks';
import { computeGpa, GRADE_POINTS, GRADES, LEVELS, type Course, type Grade, type Level } from '../../lib/gpa';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const LEVEL_LABEL: Record<Level, string> = {
	regular: 'Regular',
	honors: 'Honors',
	ap: 'AP / IB',
};

interface Row extends Course {
	id: number;
}

let nextId = 4;
const DEFAULT_ROWS: Row[] = [
	{ id: 0, grade: 'A', credits: 3, level: 'regular' },
	{ id: 1, grade: 'B+', credits: 4, level: 'honors' },
	{ id: 2, grade: 'A-', credits: 3, level: 'ap' },
	{ id: 3, grade: 'B', credits: 3, level: 'regular' },
];

function fmt(n: number): string {
	return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function GpaCalculator() {
	const [weighted, setWeighted] = useState<'unweighted' | 'weighted'>('unweighted');
	const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

	function updateRow(id: number, patch: Partial<Course>) {
		setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
	}

	function addRow() {
		setRows((prev) => [...prev, { id: nextId++, grade: 'A', credits: 3, level: 'regular' }]);
	}

	function removeRow(id: number) {
		setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
	}

	const isWeighted = weighted === 'weighted';
	const result = computeGpa(rows, isWeighted);

	const gradeOptions = GRADES.map((g) => ({ value: g, label: `${g} (${GRADE_POINTS[g].toFixed(1)})` }));
	const levelOptions = LEVELS.map((l) => ({ value: l, label: LEVEL_LABEL[l] }));

	return (
		<div class="calc">
			<div class="calc-grid" style={{ marginBottom: '1rem' }}>
				<Segmented
					label="GPA type"
					value={weighted}
					onChange={setWeighted}
					options={[
						{ value: 'unweighted', label: 'Unweighted (4.0 scale)' },
						{ value: 'weighted', label: 'Weighted (Honors/AP boost)' },
					]}
					wide
				/>
			</div>

			<div class="calc-course-list">
				{rows.map((row, i) => (
					<div class="calc-course-row" key={row.id}>
						<Select
							label={`Course ${i + 1} grade`}
							value={row.grade}
							onChange={(g: Grade) => updateRow(row.id, { grade: g })}
							options={gradeOptions}
						/>
						<NumberField
							label="Credit hours"
							unit="cr"
							value={String(row.credits)}
							onChange={(v) => updateRow(row.id, { credits: parseFloat(v) })}
							min={0}
							max={20}
							step={0.5}
							inputMode="decimal"
						/>
						{isWeighted && (
							<Segmented
								label="Level"
								value={row.level}
								onChange={(l: Level) => updateRow(row.id, { level: l })}
								options={levelOptions}
							/>
						)}
						<button
							type="button"
							class="calc-row-remove"
							onClick={() => removeRow(row.id)}
							disabled={rows.length <= 1}
							aria-label={`Remove course ${i + 1}`}
						>
							<svg viewBox="0 0 12 12" aria-hidden="true">
								<path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
							</svg>
						</button>
					</div>
				))}
			</div>

			<button type="button" class="op-button" onClick={addRow}>
				+ Add course
			</button>

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">{isWeighted ? 'Weighted' : 'Unweighted'} GPA</p>
						<p class="calc-result-value primary">{fmt(result.gpa)}</p>
					</div>
					<div>
						<p class="calc-result-label">Total credit hours</p>
						<p class="calc-result-value">{result.totalCredits}</p>
					</div>
					<div>
						<p class="calc-result-label">Total quality points</p>
						<p class="calc-result-value">{fmt(result.qualityPoints)}</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Give at least one course a positive number of credit hours.</p>
			)}

			{isWeighted && (
				<p class="calc-note">
					Weighted mode adds a level boost to each course's base grade points before averaging: Honors +0.5, AP or
					IB +1.0, Regular +0.0. That's why a GPA built from advanced courses can rise above the unweighted 4.0
					ceiling.
				</p>
			)}

			<p class="calc-note">
				Grade points use the standard 4.0-scale chart (A/A+ = 4.0 down to F = 0.0). Individual schools sometimes
				round or step this differently, so treat the result as a close estimate of your official GPA, not a
				replacement for your registrar's calculation. Calculations run in your browser; nothing you type is sent
				anywhere.
			</p>
		</div>
	);
}
