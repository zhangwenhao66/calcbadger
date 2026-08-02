import { useState } from 'preact/hooks';
import {
	massForMolarity,
	molarity,
	molarMassFromMolarity,
	molesOfSolute,
	volumeForMolarity,
} from '../../lib/molarity';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

type SolveFor = 'molarity' | 'mass' | 'volume' | 'molarMass';

const SOLVE_FOR = [
	{ value: 'molarity' as SolveFor, label: 'Molarity (M)' },
	{ value: 'mass' as SolveFor, label: 'Mass of solute' },
	{ value: 'volume' as SolveFor, label: 'Volume of solution' },
	{ value: 'molarMass' as SolveFor, label: 'Molar mass' },
];

/** Molar masses from PubChem compound records. */
const COMPOUNDS = [
	{ value: '', label: 'Pick to fill molar mass…' },
	{ value: '58.44', label: 'NaCl · 58.44 g/mol' },
	{ value: '40', label: 'NaOH · 40.00 g/mol' },
	{ value: '74.55', label: 'KCl · 74.55 g/mol' },
	{ value: '180.16', label: 'Glucose (C₆H₁₂O₆) · 180.16 g/mol' },
	{ value: '84.01', label: 'NaHCO₃ · 84.01 g/mol' },
	{ value: '100.09', label: 'CaCO₃ · 100.09 g/mol' },
];

const MASS_UNITS = { g: 1, mg: 0.001, kg: 1000 } as const;
const VOL_UNITS = { L: 1, mL: 0.001 } as const;

function fmt(n: number): string {
	if (!Number.isFinite(n)) return '—';
	if (n !== 0 && (Math.abs(n) < 0.001 || Math.abs(n) >= 1e6)) return n.toExponential(4);
	return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

export default function MolarityCalculator() {
	const [solveFor, setSolveFor] = useState<SolveFor>('molarity');
	const [preset, setPreset] = useState('');
	const [mass, setMass] = useState('58.44');
	const [massUnit, setMassUnit] = useState<keyof typeof MASS_UNITS>('g');
	const [mw, setMw] = useState('58.44');
	const [volume, setVolume] = useState('1');
	const [volUnit, setVolUnit] = useState<keyof typeof VOL_UNITS>('L');
	const [conc, setConc] = useState('1');

	const massG = parseFloat(mass) * MASS_UNITS[massUnit];
	const mwNum = parseFloat(mw);
	const volL = parseFloat(volume) * VOL_UNITS[volUnit];
	const concNum = parseFloat(conc);

	let result: { label: string; value: string; unit: string } | null = null;
	let moles: number | null = null;

	if (solveFor === 'molarity' && massG > 0 && mwNum > 0 && volL > 0) {
		const c = molarity(massG, mwNum, volL);
		result = { label: 'Molarity', value: fmt(c), unit: 'mol/L (M)' };
		moles = molesOfSolute(c, volL);
	} else if (solveFor === 'mass' && concNum > 0 && mwNum > 0 && volL > 0) {
		result = { label: 'Mass needed', value: fmt(massForMolarity(concNum, mwNum, volL)), unit: 'g' };
		moles = molesOfSolute(concNum, volL);
	} else if (solveFor === 'volume' && massG > 0 && mwNum > 0 && concNum > 0) {
		const v = volumeForMolarity(massG, mwNum, concNum);
		result = { label: 'Volume needed', value: fmt(v), unit: 'L' };
		moles = massG / mwNum;
	} else if (solveFor === 'molarMass' && massG > 0 && concNum > 0 && volL > 0) {
		result = {
			label: 'Molar mass',
			value: fmt(molarMassFromMolarity(massG, concNum, volL)),
			unit: 'g/mol',
		};
		moles = molesOfSolute(concNum, volL);
	}

	const needsMass = solveFor === 'molarity' || solveFor === 'volume' || solveFor === 'molarMass';
	const needsMw = solveFor !== 'molarMass';
	const needsVol = solveFor !== 'volume';
	const needsConc = solveFor !== 'molarity';

	return (
		<div class="calc">
			<div class="calc-grid">
				<Select label="Solve for" value={solveFor} onChange={setSolveFor} options={SOLVE_FOR} />
				{needsMw && (
					<Select
						label="Common compounds"
						value={preset}
						onChange={(next) => {
							setPreset(next);
							if (next) setMw(next);
						}}
						options={COMPOUNDS}
						wide
					/>
				)}
				{needsMw && (
					<NumberField label="Molar mass" unit="g/mol" value={mw} onChange={setMw} min={0} step={0.01} />
				)}
				{needsMass && (
					<>
						<NumberField label="Mass of solute" unit={massUnit} value={mass} onChange={setMass} min={0} step={0.01} />
						<Segmented
							label="Mass unit"
							value={massUnit}
							onChange={setMassUnit}
							options={[
								{ value: 'g' as const, label: 'g', title: 'grams' },
								{ value: 'mg' as const, label: 'mg', title: 'milligrams' },
								{ value: 'kg' as const, label: 'kg', title: 'kilograms' },
							]}
						/>
					</>
				)}
				{needsVol && (
					<>
						<NumberField
							label="Volume of solution"
							unit={volUnit}
							value={volume}
							onChange={setVolume}
							min={0}
							step={0.01}
						/>
						<Segmented
							label="Volume unit"
							value={volUnit}
							onChange={setVolUnit}
							options={[
								{ value: 'L' as const, label: 'L', title: 'liters' },
								{ value: 'mL' as const, label: 'mL', title: 'milliliters' },
							]}
						/>
					</>
				)}
				{needsConc && (
					<NumberField label="Molarity" unit="mol/L" value={conc} onChange={setConc} min={0} step={0.01} />
				)}
			</div>

			{result ? (
				<div class="calc-results">
					<div>
						<p class="calc-result-label">{result.label}</p>
						<p class="calc-result-value primary">
							{result.value} <span style="font-size:1rem">{result.unit}</span>
						</p>
					</div>
					{moles !== null && (
						<div>
							<p class="calc-result-label">Moles of solute</p>
							<p class="calc-result-value">{fmt(moles)} mol</p>
						</div>
					)}
				</div>
			) : (
				<p class="calc-note">Fill in the fields to solve.</p>
			)}

			<p class="calc-note">
				Formula: molarity = mass ÷ (molar mass × volume), from the definition c = n/V. Molar masses
				in the dropdown are PubChem values. Calculations run in your browser; nothing you type is
				sent anywhere.
			</p>
		</div>
	);
}
