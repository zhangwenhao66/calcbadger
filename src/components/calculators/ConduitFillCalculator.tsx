import { useState } from 'preact/hooks';
import {
	AWG_LABEL,
	AWG_SIZES,
	CONDUIT_TYPE_LABEL,
	computeConduitFill,
	suggestNextSize,
	TRADE_SIZE_LABEL,
	TRADE_SIZES,
	type AwgSize,
	type ConduitType,
	type TradeSize,
	type WireEntry,
} from '../../lib/conduitFill';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

interface Row extends WireEntry {
	id: number;
}

let nextId = 2;
const DEFAULT_ROWS: Row[] = [
	{ id: 0, awg: '12', count: 3 },
	{ id: 1, awg: '10', count: 1 },
];

const CONDUIT_OPTIONS = (['emt', 'imc', 'rmc', 'pvc40'] as ConduitType[]).map((value) => ({
	value,
	label: CONDUIT_TYPE_LABEL[value],
}));

const TRADE_SIZE_OPTIONS = TRADE_SIZES.map((value) => ({ value, label: TRADE_SIZE_LABEL[value] }));

const AWG_OPTIONS = AWG_SIZES.map((value) => ({ value, label: AWG_LABEL[value] }));

function fmtArea(n: number): string {
	return n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function fmtPercent(n: number): string {
	return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function ConduitFillCalculator() {
	const [conduitType, setConduitType] = useState<ConduitType>('emt');
	const [tradeSize, setTradeSize] = useState<TradeSize>('3/4');
	const [isNipple, setIsNipple] = useState<'no' | 'yes'>('no');
	const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

	function updateRow(id: number, patch: Partial<WireEntry>) {
		setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
	}

	function addRow() {
		setRows((prev) => [...prev, { id: nextId++, awg: '12', count: 1 }]);
	}

	function removeRow(id: number) {
		setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
	}

	const nipple = isNipple === 'yes';
	const result = computeConduitFill(conduitType, tradeSize, rows, nipple);
	const suggestion = !result.passes && result.wireCount > 0 ? suggestNextSize(conduitType, rows, nipple) : null;

	return (
		<div class="calc">
			<div class="calc-grid" style={{ marginBottom: '1rem' }}>
				<Select label="Conduit type" value={conduitType} onChange={setConduitType} options={CONDUIT_OPTIONS} wide />
				<Select label="Trade size" value={tradeSize} onChange={setTradeSize} options={TRADE_SIZE_OPTIONS} />
				<Segmented
					label="Nipple (run ≤ 24 in.)?"
					value={isNipple}
					onChange={setIsNipple}
					options={[
						{ value: 'no', label: 'No' },
						{ value: 'yes', label: 'Yes, 60% fill' },
					]}
				/>
			</div>

			<div class="calc-course-list">
				{rows.map((row, i) => (
					<div class="calc-course-row" key={row.id}>
						<Select
							label={`Wire ${i + 1} size (THHN/THWN-2)`}
							value={row.awg}
							onChange={(awg: AwgSize) => updateRow(row.id, { awg })}
							options={AWG_OPTIONS}
						/>
						<NumberField
							label="Count"
							value={String(row.count)}
							onChange={(v) => updateRow(row.id, { count: parseInt(v, 10) })}
							min={0}
							max={999}
							step={1}
							inputMode="numeric"
						/>
						<button
							type="button"
							class="calc-row-remove"
							onClick={() => removeRow(row.id)}
							disabled={rows.length <= 1}
							aria-label={`Remove wire ${i + 1}`}
						>
							<svg viewBox="0 0 12 12" aria-hidden="true">
								<path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
							</svg>
						</button>
					</div>
				))}
			</div>

			<button type="button" class="op-button" onClick={addRow}>
				+ Add wire size
			</button>

			{result.wireCount > 0 ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">Fill</p>
						<p class="calc-result-value primary">{fmtPercent(result.fillPercent)}%</p>
					</div>
					<div>
						<p class="calc-result-label">Conductor area used</p>
						<p class="calc-result-value">{fmtArea(result.conductorAreaSqIn)} in&sup2;</p>
					</div>
					<div>
						<p class="calc-result-label">
							Allowed at {Math.round(result.fillFraction * 100)}% ({result.wireCount}{' '}
							{nipple ? 'conductor(s), nipple' : result.wireCount === 1 ? 'conductor' : 'conductors'})
						</p>
						<p class="calc-result-value">{fmtArea(result.allowedAreaSqIn)} in&sup2;</p>
					</div>
				</div>
			) : (
				<p class="calc-note">Give at least one wire row a positive count.</p>
			)}

			{result.wireCount > 0 && (
				<p class="calc-note" style="margin-top:0.9rem">
					{result.passes ? (
						<span class="calc-badge ok">Within NEC Chapter 9 fill limit</span>
					) : (
						<span class="calc-badge bad">Exceeds NEC Chapter 9 fill limit</span>
					)}
				</p>
			)}

			{!result.passes && result.wireCount > 0 && (
				<p class="calc-note">
					{suggestion
						? `This conductor set doesn't fit a ${TRADE_SIZE_LABEL[tradeSize]} ${CONDUIT_TYPE_LABEL[conduitType]}. The smallest size in this conduit type that fits is ${TRADE_SIZE_LABEL[suggestion]}.`
						: `This conductor set doesn't fit any ${CONDUIT_TYPE_LABEL[conduitType]} trade size up to 4 in. Split it across more than one conduit run.`}
				</p>
			)}

			<p class="calc-note">
				Based on NEC (NFPA 70) Chapter 9, Tables 1, 4, and 5, for THHN/THWN/THWN-2 copper conductors, the most
				common building-wire insulation for new circuits. Ground and neutral conductors count toward the total
				same as any other current-carrying conductor for fill purposes. This is a planning reference, not a
				substitute for the current NEC and your local electrical inspector's interpretation of it. Calculations
				run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
