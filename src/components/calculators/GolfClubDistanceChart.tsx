import { useState } from 'preact/hooks';
import {
	CLUB_LABELS,
	CLUB_ORDER,
	SKILL_LABELS,
	clubGaps,
	personalizedDistances,
	type SkillLevel,
} from '../../lib/golfClubDistances';
import NumberField from '../ui/NumberField';
import Segmented from '../ui/Segmented';

export default function GolfClubDistanceChart() {
	const [tier, setTier] = useState<SkillLevel>('average');
	const [driverYards, setDriverYards] = useState('');

	const parsed = parseFloat(driverYards);
	const known = driverYards.trim() !== '' && Number.isFinite(parsed) ? parsed : null;
	const distances = personalizedDistances(tier, known);
	const gaps = clubGaps(distances);
	const personalized = known !== null;

	return (
		<div class="calc">
			<div class="calc-grid">
				<Segmented
					label="Skill level"
					value={tier}
					onChange={(v) => setTier(v as SkillLevel)}
					options={[
						{ value: 'beginner', label: 'Beginner' },
						{ value: 'average', label: 'Average' },
						{ value: 'good', label: 'Good' },
						{ value: 'tour', label: 'Tour' },
					]}
					wide
				/>
				<NumberField
					label="Your driver distance (optional)"
					unit="yd"
					value={driverYards}
					onChange={setDriverYards}
					min={0}
					step={1}
					placeholder={String(personalizedDistances(tier, null).driver)}
				/>
			</div>

			<div class="calc-results">
				{CLUB_ORDER.map((club) => (
					<div key={club}>
						<p class="calc-result-label">{CLUB_LABELS[club]}</p>
						<p class={`calc-result-value${club === 'driver' ? ' primary' : ''}`}>
							{distances[club]} yd
						</p>
					</div>
				))}
			</div>

			<p class="calc-note" style="margin-top:0.9rem">
				{personalized ? (
					<>
						Scaled from the {SKILL_LABELS[tier].split(' (')[0]!.toLowerCase()} baseline chart by the
						ratio of your driver distance ({known} yd) to that tier's typical driver distance. Every
						other club moves by the same ratio.
					</>
				) : (
					<>
						Typical total distances for a {SKILL_LABELS[tier].toLowerCase()} golfer, no wind, sea
						level. Enter your own driver distance above to scale the whole chart to your game.
					</>
				)}
			</p>

			<div class="calc-results" style="margin-top:0.9rem">
				{gaps.map((gap) => (
					<div key={`${gap.from}-${gap.to}`}>
						<p class="calc-result-label">
							{CLUB_LABELS[gap.from]} → {CLUB_LABELS[gap.to]}
						</p>
						<p class="calc-result-value">{gap.yards} yd</p>
					</div>
				))}
			</div>

			<p class="calc-note">
				Published gapping guides treat roughly 8-15 yards between consecutive clubs as normal,
				tightening toward the wedges. This chart only carries 9 anchor clubs (driver, 3-wood,
				5/7/9-iron, and four wedges), so a wide gap above often just means your bag has a 4-iron,
				6-iron, 8-iron, or hybrid filling the space that isn't listed here — not that you're
				missing a club. Distances are totals under normal conditions; actual carry and roll vary
				with strike quality, altitude, wind, ball, and turf. Nothing you enter leaves your browser.
			</p>
		</div>
	);
}
