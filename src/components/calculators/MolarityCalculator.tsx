import { useState } from 'preact/hooks';
import {
	massForMolarity,
	molarity,
	molarMassFromMolarity,
	molesOfSolute,
	volumeForMolarity,
} from '../../lib/molarity';

type SolveFor = 'molarity' | 'mass' | 'volume' | 'molarMass';

/** Molar masses from PubChem compound records. */
const COMPOUNDS: { label: string; mw: number }[] = [
	{ label: 'NaCl · 58.44 g/mol', mw: 58.44 },
	{ label: 'NaOH · 40.00 g/mol', mw: 40.0 },
	{ label: 'KCl · 74.55 g/mol', mw: 74.55 },
	{ label: 'Glucose (C₆H₁₂O₆) · 180.16 g/mol', mw: 180.16 },
	{ label: 'NaHCO₃ · 84.01 g/mol', mw: 84.01 },
	{ label: 'CaCO₃ · 100.09 g/mol', mw: 100.09 },
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
		result = { label: 'Molar mass', value: fmt(molarMassFromMolarity(massG, concNum, volL)), unit: 'g/mol' };
		moles = molesOfSolute(concNum, volL);
	}

	const needsMass = solveFor === 'molarity' || solveFor === 'volume' || solveFor === 'molarMass';
	const needsMw = solveFor !== 'molarMass';
	const needsVol = solveFor !== 'volume';
	const needsConc = solveFor !== 'molarity';

	return (
		<div class="calc">
			<div class="calc-grid">
				<label class="calc-field">
					<span class="calc-label">Solve for</span>
					<select
						class="calc-select"
						value={solveFor}
						onChange={(e) => setSolveFor((e.target as HTMLSelectElement).value as SolveFor)}
					>
						<option value="molarity">Molarity (M)</option>
						<option value="mass">Mass of solute</option>
						<option value="volume">Volume of solution</option>
						<option value="molarMass">Molar mass</option>
					</select>
				</label>
				{needsMw && (
					<label class="calc-field">
						<span class="calc-label">Molar mass (g/mol)</span>
						<input
							class="calc-input"
							type="number"
							inputMode="decimal"
							min="0"
							step="0.01"
							value={mw}
							onInput={(e) => setMw((e.target as HTMLInputElement).value)}
						/>
					</label>
				)}
				{needsMw && (
					<label class="calc-field">
						<span class="calc-label">Common compounds</span>
						<select
							class="calc-select"
							onChange={(e) => {
								const v = (e.target as HTMLSelectElement).value;
								if (v) setMw(v);
							}}
						>
							<option value="">Pick to fill molar mass…</option>
							{COMPOUNDS.map((c) => (
								<option value={String(c.mw)}>{c.label}</option>
							))}
						</select>
					</label>
				)}
				{needsMass && (
					<label class="calc-field">
						<span class="calc-label">Mass of solute</span>
						<div style="display:flex;gap:0.4rem">
							<input
								class="calc-input"
								type="number"
								inputMode="decimal"
								min="0"
								step="0.01"
								value={mass}
								onInput={(e) => setMass((e.target as HTMLInputElement).value)}
							/>
							<select
								class="calc-select"
								style="width:5.5rem;flex:none"
								value={massUnit}
								onChange={(e) => setMassUnit((e.target as HTMLSelectElement).value as keyof typeof MASS_UNITS)}
							>
								<option value="g">g</option>
								<option value="mg">mg</option>
								<option value="kg">kg</option>
							</select>
						</div>
					</label>
				)}
				{needsVol && (
					<label class="calc-field">
						<span class="calc-label">Volume of solution</span>
						<div style="display:flex;gap:0.4rem">
							<input
								class="calc-input"
								type="number"
								inputMode="decimal"
								min="0"
								step="0.01"
								value={volume}
								onInput={(e) => setVolume((e.target as HTMLInputElement).value)}
							/>
							<select
								class="calc-select"
								style="width:5.5rem;flex:none"
								value={volUnit}
								onChange={(e) => setVolUnit((e.target as HTMLSelectElement).value as keyof typeof VOL_UNITS)}
							>
								<option value="L">L</option>
								<option value="mL">mL</option>
							</select>
						</div>
					</label>
				)}
				{needsConc && (
					<label class="calc-field">
						<span class="calc-label">Molarity (mol/L)</span>
						<input
							class="calc-input"
							type="number"
							inputMode="decimal"
							min="0"
							step="0.01"
							value={conc}
							onInput={(e) => setConc((e.target as HTMLInputElement).value)}
						/>
					</label>
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
				Formula: molarity = mass ÷ (molar mass × volume), from the definition c = n/V. Molar
				masses in the dropdown are PubChem values. Calculations run in your browser; nothing you
				type is sent anywhere.
			</p>
		</div>
	);
}
