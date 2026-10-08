import { useState } from 'preact/hooks';
import {
	DICE_TYPES,
	rollDice,
	rollD20WithAdvantage,
	expectedValueSum,
	stdDevSum,
	probabilityExactly,
	probabilityAtLeast,
	probabilityAtMost,
	minSum,
	type RollResult,
} from '../../lib/diceRoller';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';
import Select from '../ui/Select';

const MAX_DICE = 20;
const MAX_TARGET = 2000;

function boundedInteger(input: string, min: number, max: number): number | null {
	const value = input.trim() === '' ? NaN : Number(input);
	return Number.isInteger(value) && value >= min && value <= max ? value : null;
}

function pct(x: number): string {
	return `${(x * 100).toFixed(x < 0.001 && x > 0 ? 4 : 2)}%`;
}

const diceOptions = DICE_TYPES.map((d) => ({ value: String(d), label: `d${d}` }));

export default function DiceRoller() {
	const [mode, setMode] = useState<'roll' | 'probability'>('roll');

	// --- roll state ---
	const [sides, setSides] = useState('20');
	const [count, setCount] = useState('1');
	const [modifier, setModifier] = useState('0');
	const [rollMode, setRollMode] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');
	const [result, setResult] = useState<RollResult | null>(null);

	const sidesNum = parseInt(sides, 10) || 0;
	const countNum = boundedInteger(count, 1, MAX_DICE);
	const modifierNum = boundedInteger(modifier, -100, 100);
	const isD20 = sidesNum === 20;
	const validRoll = countNum !== null && modifierNum !== null && DICE_TYPES.includes(sidesNum as never);

	function roll() {
		if (!validRoll || countNum === null || modifierNum === null) return;
		if (isD20 && rollMode !== 'normal') {
			setResult(rollD20WithAdvantage(rollMode, modifierNum));
		} else {
			setResult(rollDice(countNum, sidesNum, modifierNum));
		}
	}

	// --- probability state ---
	const [probCount, setProbCount] = useState('2');
	const [probSides, setProbSides] = useState('6');
	const [probModifier, setProbModifier] = useState('0');
	const [target, setTarget] = useState('7');

	const pCount = boundedInteger(probCount, 1, MAX_DICE);
	const pSides = parseInt(probSides, 10) || 0;
	const pModifier = boundedInteger(probModifier, -100, 100);
	const pTarget = boundedInteger(target, -MAX_TARGET, MAX_TARGET);
	const validProb =
		pCount !== null && pModifier !== null && pTarget !== null &&
		DICE_TYPES.includes(pSides as never);

	const isD20Single = pSides === 20 && pCount === 1;

	return (
		<div class="calc">
			<Segmented
				label="Mode"
				value={mode}
				onChange={setMode}
				options={[
					{ value: 'roll', label: 'Roll dice' },
					{ value: 'probability', label: 'Probability calculator' },
				]}
			/>

			{mode === 'roll' ? (
				<>
					<div class="calc-grid">
						<Select
							label="Dice type"
							value={sides}
							onChange={(v) => {
								setSides(v);
								setResult(null);
								if (parseInt(v, 10) !== 20) setRollMode('normal');
							}}
							options={diceOptions}
						/>
						<NumberField
							label="Number of dice"
							value={count}
							onChange={(v) => { setCount(v); setResult(null); }}
							min={1}
							max={MAX_DICE}
							step={1}
							inputMode="numeric"
						/>
						<NumberField
							label="Modifier"
							value={modifier}
							onChange={(v) => { setModifier(v); setResult(null); }}
							min={-100}
							max={100}
							step={1}
							inputMode="numeric"
						/>
					</div>

					{isD20 && (
						<Segmented
							label="Roll mode"
							value={rollMode}
							onChange={(v) => { setRollMode(v); setResult(null); }}
							options={[
								{ value: 'normal', label: 'Normal' },
								{ value: 'advantage', label: 'Advantage' },
								{ value: 'disadvantage', label: 'Disadvantage' },
							]}
							wide
						/>
					)}

					{!validRoll && (
						<p class="calc-note">Enter a whole number of dice from 1 to {MAX_DICE} and a whole-number modifier from −100 to 100.</p>
					)}

					<button type="button" class="op-button" onClick={roll} disabled={!validRoll}>
						{isD20 && rollMode !== 'normal'
							? `Roll with ${rollMode}`
							: `Roll ${countNum !== null ? countNum : ''}d${sidesNum || ''}`}
					</button>

					{result && (
						<>
							<div class="calc-results" style="margin-top:0.9rem">
								<div>
									<p class="calc-result-label">Total</p>
									<p class="calc-result-value primary">{result.total}</p>
								</div>
								<div>
									<p class="calc-result-label">
										{isD20 && rollMode !== 'normal' ? 'Both d20 rolls' : 'Individual rolls'}
									</p>
									<p class="calc-result-value" style="font-size:1rem">
										{result.rolls.join(', ')}
									</p>
								</div>
							</div>
							{isD20 && rollMode !== 'normal' && (
								<p class="calc-note">
									{rollMode === 'advantage'
										? `Advantage: two d20s are rolled and the higher result is kept (${Math.max(...result.rolls)}).`
										: `Disadvantage: two d20s are rolled and the lower result is kept (${Math.min(...result.rolls)}).`}
								</p>
							)}
						</>
					)}

					<p class="calc-note">
						Each die is an independent, equally-likely draw over its faces. Calculations, including
						the random draws, run in your browser; nothing you enter or roll is sent anywhere.
					</p>
				</>
			) : (
				<>
					<div class="calc-grid">
						<NumberField
							label="Number of dice"
							value={probCount}
							onChange={setProbCount}
							min={1}
							max={MAX_DICE}
							step={1}
							inputMode="numeric"
						/>
						<Select
							label="Dice type"
							value={probSides}
							onChange={setProbSides}
							options={diceOptions}
						/>
						<NumberField
							label="Modifier"
							value={probModifier}
							onChange={setProbModifier}
							min={-100}
							max={100}
							step={1}
							inputMode="numeric"
						/>
						<NumberField
							label="Target total"
							value={target}
							onChange={setTarget}
							min={-2000}
							max={MAX_TARGET}
							step={1}
							inputMode="numeric"
						/>
					</div>

					{validProb && pCount !== null && pModifier !== null && pTarget !== null ? (
						<>
							<div class="calc-results" style="margin-top:0.9rem">
								<div>
									<p class="calc-result-label">P(exactly {pTarget})</p>
									<p class="calc-result-value primary">
										{pct(probabilityExactly(pCount, pSides, pModifier, pTarget))}
									</p>
								</div>
								<div>
									<p class="calc-result-label">P(at least {pTarget})</p>
									<p class="calc-result-value">
										{pct(probabilityAtLeast(pCount, pSides, pModifier, pTarget))}
									</p>
								</div>
								<div>
									<p class="calc-result-label">P(at most {pTarget})</p>
									<p class="calc-result-value">
										{pct(probabilityAtMost(pCount, pSides, pModifier, pTarget))}
									</p>
								</div>
								<div>
									<p class="calc-result-label">Expected total</p>
									<p class="calc-result-value">
										{(expectedValueSum(pCount, pSides) + pModifier).toFixed(2)}
										<span style="font-size:0.8rem;font-weight:400;color:var(--chassis-muted)">
											{' '}
											± {stdDevSum(pCount, pSides).toFixed(2)}
										</span>
									</p>
								</div>
							</div>
							<p class="calc-note">
								Range: {minSum(pCount) + pModifier} to {pCount * pSides + pModifier}.
							</p>
							{isD20Single && (
								<div class="calc-results" style="margin-top:0.6rem">
									<div>
										<p class="calc-result-label">Normal, hit {pTarget}+</p>
										<p class="calc-result-value">{pct(probabilityAtLeast(1, 20, pModifier, pTarget))}</p>
									</div>
									<div>
										<p class="calc-result-label">Advantage, hit {pTarget}+</p>
										<p class="calc-result-value">
											{pct(
												1 -
													Math.pow(
														1 - probabilityAtLeast(1, 20, pModifier, pTarget),
														2,
													),
											)}
										</p>
									</div>
									<div>
										<p class="calc-result-label">Disadvantage, hit {pTarget}+</p>
										<p class="calc-result-value">
											{pct(Math.pow(probabilityAtLeast(1, 20, pModifier, pTarget), 2))}
										</p>
									</div>
								</div>
							)}
						</>
					) : (
						<p class="calc-note">
							Enter whole numbers: 1 to {MAX_DICE} dice, a modifier from −100 to 100, and a target from −{MAX_TARGET} to {MAX_TARGET}.
						</p>
					)}

					<p class="calc-note">
						Exact odds from the full sum distribution (every die is an independent, equally-likely
						draw; the distribution is a repeated convolution of that per-die uniform distribution),
						not an approximation.
					</p>
				</>
			)}
		</div>
	);
}
