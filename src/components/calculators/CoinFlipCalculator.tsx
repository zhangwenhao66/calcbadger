import { useState } from 'preact/hooks';
import {
	binomialAtLeast,
	binomialAtMost,
	binomialExpectedValue,
	binomialProbability,
	binomialStdDev,
	simulateFlips,
	summarizeFlips,
} from '../../lib/coinFlip';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

const MAX_FLIPS = 500;
const MAX_PROB_N = 2000;

function pct(x: number): string {
	return `${(x * 100).toFixed(x < 0.001 && x > 0 ? 4 : 2)}%`;
}

export default function CoinFlipCalculator() {
	const [mode, setMode] = useState<'simulate' | 'probability'>('simulate');

	// --- simulate state ---
	const [flipCount, setFlipCount] = useState('20');
	const [simBias, setSimBias] = useState('50');
	const [results, setResults] = useState<boolean[] | null>(null);

	const n = Math.round(parseFloat(flipCount) || 0);
	const simBiasNum = parseFloat(simBias) || 0;
	const simP = Math.min(1, Math.max(0, simBiasNum / 100));
	const validSim = n >= 1 && n <= MAX_FLIPS && simBiasNum >= 0 && simBiasNum <= 100;

	function flip() {
		if (!validSim) return;
		setResults(simulateFlips(n, simP));
	}

	const summary = results ? summarizeFlips(results) : null;

	// --- probability state ---
	const [probN, setProbN] = useState('10');
	const [probK, setProbK] = useState('5');
	const [probBias, setProbBias] = useState('50');

	const pn = Math.round(parseFloat(probN) || 0);
	const pk = Math.round(parseFloat(probK) || 0);
	const probBiasNum = parseFloat(probBias) || 0;
	const pp = Math.min(1, Math.max(0, probBiasNum / 100));
	const validProb =
		pn >= 0 && pn <= MAX_PROB_N && pk >= 0 && pk <= pn && probBiasNum >= 0 && probBiasNum <= 100;

	return (
		<div class="calc">
			<Segmented
				label="Mode"
				value={mode}
				onChange={setMode}
				options={[
					{ value: 'simulate', label: 'Flip coins' },
					{ value: 'probability', label: 'Probability calculator' },
				]}
			/>

			{mode === 'simulate' ? (
				<>
					<div class="calc-grid">
						<NumberField
							label="Number of coins"
							value={flipCount}
							onChange={setFlipCount}
							min={1}
							max={MAX_FLIPS}
							step={1}
							inputMode="numeric"
						/>
						<NumberField
							label="Chance of heads"
							unit="%"
							value={simBias}
							onChange={setSimBias}
							min={0}
							max={100}
							step={1}
							inputMode="numeric"
						/>
					</div>

					{!validSim && (
						<p class="calc-note">
						Enter between 1 and {MAX_FLIPS} coins, and a chance of heads between 0% and 100%.
					</p>
					)}

					<button type="button" class="op-button" onClick={flip} disabled={!validSim}>
						Flip {n > 0 ? n : ''} coin{n === 1 ? '' : 's'}
					</button>

					{summary && (
						<>
							<div class="calc-results" style="margin-top:0.9rem">
								<div>
									<p class="calc-result-label">Heads</p>
									<p class="calc-result-value primary">
										{summary.heads}
										<span style="font-size:0.8rem;font-weight:400;color:var(--chassis-muted)">
											{' '}
											({summary.headsPct.toFixed(1)}%)
										</span>
									</p>
								</div>
								<div>
									<p class="calc-result-label">Tails</p>
									<p class="calc-result-value">{summary.tails}</p>
								</div>
								<div>
									<p class="calc-result-label">Longest heads streak</p>
									<p class="calc-result-value">{summary.longestHeadsStreak}</p>
								</div>
								<div>
									<p class="calc-result-label">Longest tails streak</p>
									<p class="calc-result-value">{summary.longestTailsStreak}</p>
								</div>
							</div>
							<p class="calc-note" style="margin-top:0.7rem;line-height:2;letter-spacing:0.02em">
								{results!.map((r, i) => (
									<span
										key={i}
										style={`display:inline-block;width:1.4em;text-align:center;font-weight:600;color:${
											r ? 'var(--op)' : 'var(--chassis-muted)'
										}`}
									>
										{r ? 'H' : 'T'}
									</span>
								))}
							</p>
						</>
					)}

					<p class="calc-note">
						Each coin is an independent random draw against the chance of heads you set (50% for a
						fair coin). Calculations, including the random draws, run in your browser; nothing you
						type or flip is sent anywhere.
					</p>
				</>
			) : (
				<>
					<div class="calc-grid">
						<NumberField
							label="Number of flips (n)"
							value={probN}
							onChange={setProbN}
							min={0}
							max={MAX_PROB_N}
							step={1}
							inputMode="numeric"
						/>
						<NumberField
							label="Heads count (k)"
							value={probK}
							onChange={setProbK}
							min={0}
							max={MAX_PROB_N}
							step={1}
							inputMode="numeric"
						/>
						<NumberField
							label="Chance of heads"
							unit="%"
							value={probBias}
							onChange={setProbBias}
							min={0}
							max={100}
							step={1}
							inputMode="numeric"
						/>
					</div>

					{validProb ? (
						<div class="calc-results" style="margin-top:0.9rem">
							<div>
								<p class="calc-result-label">P(exactly {pk})</p>
								<p class="calc-result-value primary">{pct(binomialProbability(pn, pk, pp))}</p>
							</div>
							<div>
								<p class="calc-result-label">P(at least {pk})</p>
								<p class="calc-result-value">{pct(binomialAtLeast(pn, pk, pp))}</p>
							</div>
							<div>
								<p class="calc-result-label">P(at most {pk})</p>
								<p class="calc-result-value">{pct(binomialAtMost(pn, pk, pp))}</p>
							</div>
							<div>
								<p class="calc-result-label">Expected heads</p>
								<p class="calc-result-value">
									{binomialExpectedValue(pn, pp).toFixed(2)}
									<span style="font-size:0.8rem;font-weight:400;color:var(--chassis-muted)">
										{' '}
										± {binomialStdDev(pn, pp).toFixed(2)}
									</span>
								</p>
							</div>
						</div>
					) : (
						<p class="calc-note">
						Heads count (k) must be between 0 and the number of flips (n), and chance of heads must
						be between 0% and 100%.
					</p>
					)}

					<p class="calc-note">
						Uses the binomial probability formula P(x) = C(n,x) · p<sup>x</sup> · (1−p)
						<sup>n−x</sup>, the standard model for a fixed number of independent yes/no trials at a
						constant success probability p.
					</p>
				</>
			)}
		</div>
	);
}
