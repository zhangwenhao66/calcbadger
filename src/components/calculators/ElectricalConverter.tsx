import { useState } from 'preact/hooks';
import {
	ampsFrom,
	round2,
	voltsFrom,
	wattsFrom,
	type CircuitType,
	type ThreePhaseVoltageType,
} from '../../lib/electrical';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

type SolveFor = 'watts' | 'amps' | 'volts';

function fmt(n: number): string {
	return round2(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export default function ElectricalConverter() {
	const [solveFor, setSolveFor] = useState<SolveFor>('watts');
	const [circuit, setCircuit] = useState<CircuitType>('ac1');
	const [voltageType, setVoltageType] = useState<ThreePhaseVoltageType>('line-to-line');
	const [watts, setWatts] = useState('1800');
	const [amps, setAmps] = useState('15');
	const [volts, setVolts] = useState('120');
	const [pf, setPf] = useState('1');

	const isDc = circuit === 'dc';
	const wattsN = parseFloat(watts);
	const ampsN = parseFloat(amps);
	const voltsN = parseFloat(volts);
	const pfN = isDc ? 1 : parseFloat(pf);

	const pfValid = isDc || (Number.isFinite(pfN) && pfN > 0 && pfN <= 1);

	let result: number | null = null;
	let error: string | null = null;

	if (!pfValid) {
		error = 'Power factor must be greater than 0 and no more than 1.';
	} else if (solveFor === 'watts') {
		if (!Number.isFinite(voltsN) || !Number.isFinite(ampsN)) {
			error = 'Enter voltage and current.';
		} else {
			result = wattsFrom(voltsN, ampsN, pfN, circuit, voltageType);
		}
	} else if (solveFor === 'amps') {
		if (!Number.isFinite(wattsN) || !Number.isFinite(voltsN)) {
			error = 'Enter power and voltage.';
		} else if (voltsN === 0) {
			error = 'Voltage cannot be 0 — current would be undefined.';
		} else {
			result = ampsFrom(wattsN, voltsN, pfN, circuit, voltageType);
		}
	} else {
		if (!Number.isFinite(wattsN) || !Number.isFinite(ampsN)) {
			error = 'Enter power and current.';
		} else if (ampsN === 0) {
			error = 'Current cannot be 0 — voltage would be undefined.';
		} else {
			result = voltsFrom(wattsN, ampsN, pfN, circuit, voltageType);
		}
	}

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Solve for"
					value={solveFor}
					onChange={setSolveFor}
					options={[
						{ value: 'watts', label: 'Watts' },
						{ value: 'amps', label: 'Amps' },
						{ value: 'volts', label: 'Volts' },
					]}
				/>
				<Segmented
					label="Circuit"
					value={circuit}
					onChange={setCircuit}
					options={[
						{ value: 'dc', label: 'DC' },
						{ value: 'ac1', label: 'AC 1-phase' },
						{ value: 'ac3', label: 'AC 3-phase' },
					]}
					wide
				/>
				{circuit === 'ac3' && (
					<Segmented
						label="Three-phase voltage measured as"
						value={voltageType}
						onChange={setVoltageType}
						options={[
							{ value: 'line-to-line', label: 'Line-to-line' },
							{ value: 'line-to-neutral', label: 'Line-to-neutral' },
						]}
						wide
					/>
				)}

				{solveFor !== 'watts' && (
					<NumberField label="Power" unit="W" value={watts} onChange={setWatts} min={0} step={1} />
				)}
				{solveFor !== 'amps' && (
					<NumberField label="Current" unit="A" value={amps} onChange={setAmps} min={0} step={0.1} />
				)}
				{solveFor !== 'volts' && (
					<NumberField label="Voltage" unit="V" value={volts} onChange={setVolts} min={0} step={1} />
				)}
				{!isDc && (
					<NumberField
						label="Power factor"
						value={pf}
						onChange={setPf}
						min={0}
						max={1}
						step={0.01}
						placeholder="1"
					/>
				)}
			</div>

			{result !== null ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">
							{solveFor === 'watts' ? 'Power' : solveFor === 'amps' ? 'Current' : 'Voltage'}
						</p>
						<p class="calc-result-value primary">
							{fmt(result)} {solveFor === 'watts' ? 'W' : solveFor === 'amps' ? 'A' : 'V'}
						</p>
					</div>
				</div>
			) : (
				<p class="calc-note">{error}</p>
			)}

			<p class="calc-note">
				DC and AC single-phase: P = V x I x PF. AC three-phase: P = sqrt(3) x V x I x PF for a
				line-to-line voltage, or P = 3 x V x I x PF for a line-to-neutral voltage. Power factor is
				fixed at 1 for DC (there is no phase to be out of); for AC it defaults to 1 for a purely
				resistive load like a heater and is typically 0.8-0.95 for motors and other inductive
				loads. Calculations run in your browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
