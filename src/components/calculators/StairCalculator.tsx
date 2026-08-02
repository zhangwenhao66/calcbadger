import { useState } from 'preact/hooks';
import { IRC_MAX_RISER_IN, IRC_MIN_TREAD_IN, stairLayout, toNearestFraction } from '../../lib/stairs';
import NumberField from '../ui/NumberField';

function fraction(inches: number): string {
	const f = toNearestFraction(inches);
	if (f.num === 0) return `${f.whole}"`;
	return `${f.whole} ${f.num}/${f.den}"`;
}

export default function StairCalculator() {
	const [riseFt, setRiseFt] = useState('9');
	const [riseIn, setRiseIn] = useState('0');
	const [tread, setTread] = useState(String(IRC_MIN_TREAD_IN));
	const [maxRiser, setMaxRiser] = useState(String(IRC_MAX_RISER_IN));

	const totalRise = (parseFloat(riseFt) || 0) * 12 + (parseFloat(riseIn) || 0);
	const treadNum = parseFloat(tread);
	const maxRiserNum = parseFloat(maxRiser);
	const valid = totalRise > 0 && treadNum > 0 && maxRiserNum > 0;
	const s = valid ? stairLayout(totalRise, treadNum, maxRiserNum) : null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<NumberField label="Total rise" unit="ft" value={riseFt} onChange={setRiseFt} min={0} step={1} />
				<NumberField label="plus" unit="in" value={riseIn} onChange={setRiseIn} min={0} step={0.25} />
				<NumberField label="Tread depth" unit="in" value={tread} onChange={setTread} min={0} step={0.25} />
				<NumberField
					label="Max riser height"
					unit="in"
					value={maxRiser}
					onChange={setMaxRiser}
					min={0}
					step={0.25}
				/>
			</div>

			{s ? (
				<>
					<div class="calc-results">
						<div>
							<p class="calc-result-label">Risers</p>
							<p class="calc-result-value primary">{s.riserCount}</p>
						</div>
						<div>
							<p class="calc-result-label">Riser height</p>
							<p class="calc-result-value">
								{fraction(s.riserHeightIn)}
								<span style="font-size:0.8rem;font-weight:400;color:var(--chassis-muted)">
									{' '}
									({s.riserHeightIn.toFixed(3)}")
								</span>
							</p>
						</div>
						<div>
							<p class="calc-result-label">Treads</p>
							<p class="calc-result-value">{s.treadCount}</p>
						</div>
						<div>
							<p class="calc-result-label">Total run</p>
							<p class="calc-result-value">{fraction(s.totalRunIn)}</p>
						</div>
						<div>
							<p class="calc-result-label">Stringer length</p>
							<p class="calc-result-value">{fraction(s.stringerLengthIn)}</p>
						</div>
						<div>
							<p class="calc-result-label">Stair angle</p>
							<p class="calc-result-value">{s.angleDeg.toFixed(1)}°</p>
						</div>
					</div>
					<p class="calc-note" style="margin-top:0.9rem">
						{s.ircCompliant ? (
							<span class="calc-badge ok">Meets IRC R311.7.5 riser/tread limits</span>
						) : (
							<span class="calc-badge bad">Outside IRC R311.7.5 limits: check riser/tread values</span>
						)}
					</p>
				</>
			) : (
				<p class="calc-note">Enter the total rise (floor to floor) to lay out the stair.</p>
			)}

			<p class="calc-note">
				Defaults follow the 2021 IRC residential limits: riser height ≤ {IRC_MAX_RISER_IN}", tread
				depth ≥ {IRC_MIN_TREAD_IN}". Measure total rise finished floor to finished floor. Always
				confirm with your local building department, since amendments vary. Calculations run in your
				browser; nothing you type is sent anywhere.
			</p>
		</div>
	);
}
