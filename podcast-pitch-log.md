# Podcast guest-pitch research — calcbadger.com

First-ever pass for CalcBadger (this tactic is validated on the sister seo-geo-trinity sites but has never been run for the traffic-site matrix before). Research date: 2026-08-04. No emails sent — nothing cleared both vetting bars.

## Pitch angle used to ground the search

CalcBadger currently has 9 calculators (`src/data/tools.ts`, `src/components/calculators/`): CD Calculator (Finance), Square Footage Calculator (Home Improvement), Stair Calculator (Construction), SAT Score Calculator (Education), Molarity Calculator (Science), BMI Calculator (Health), Coin Flip Simulator (Games), Temperature Converter (Science). Each one:
- Traces its formula to a named primary source (2021 IRC R311.7.5 for stairs, NIST SP 811 for unit conversions, CDC/WHO for BMI, IUPAC Gold Book + PubChem for molarity, College Board's official Practice Test #4 scoring tables for SAT, Regulation DD/12 CFR 1030 for CD APY, NIST/SEMATECH for the coin-flip binomial stats) rather than being copied from another calculator site.
- Is checked by a vitest suite (`tests/*.test.ts`) whose expected values are hand-worked or independently computed from the source document, not derived from the implementation itself (see the fixture comments in `tests/stairs.test.ts` and `tests/satScore.test.ts` — e.g. the SAT table was extracted verbatim with `pdftotext -layout` from the official PDF as an independent copy).
- Ships with an embeddable widget at `/embed/<slug>/`.

Angle used: "independent tool-builder who sources every formula from a primary authority and verifies it with tests computed independently of the code, not just re-derived from it" — a maker/verification story, not a generic trivia-site pitch. Adapted from the validated style in `seo-geo-trinity/podcast-pitches-beta.md`.

## Podcasts checked (12) — verdicts

| Podcast | Status found | Verdict |
|---|---|---|
| Profitable Founder (Florian Darroman) | Active, twice weekly, latest episode Aug 3 2026 | **Skipped — guest bar mismatch.** Show's stated criterion is bootstrapped founders at $100K–$10M/yr revenue. CalcBadger is days old with zero revenue/traffic; pitching would misrepresent fit or require fabricating numbers. |
| Going Indie w/ Antoine van der Lee | Last episode Apr 2025 | **Skipped — 太久没更新** (>1 year dark) |
| Code and Conquer (Tobias Arweiler) | Last episode Feb 2025 | **Skipped — 太久没更新** (>1.5 years dark) |
| Indie Founder (Tiago Ferreira) | Latest Jun 2 2026, but mostly solo diary episodes about his own SaaS (Podsqueeze); outside guests rare | **Skipped — format mismatch.** Not really a guest-interview show anymore; cadence also thinning (3-month gap before the June ep) |
| Indie Hackers Podcast (official, Transistor feed) | Feed returned June 2023 as latest | **Skipped — couldn't reliably confirm current activity**; treated as "can't verify" rather than assuming it's still running on that feed |
| Software Social (Hansen/Schnettler) | Active, latest Jul 18 2026 | **Skipped — format mismatch.** Primarily two co-hosts talking to each other; outside guests are occasional exceptions, not an open guest slot |
| The Bootstrapped Founder (Arvid Kahl) | Active, weekly | **Skipped — audience tier mismatch.** Mostly solo monologue episodes; on the rare guest episode, tier is established multi-million-dollar exits |
| Startups For the Rest of Us (Rob Walling) | Active, 2026 guests include Eric Ries, Help Scout co-founder Nick Francis | **Skipped — audience tier mismatch.** Guests are proven, established founders; a zero-traction brand-new tool site is a poor cold-pitch fit here |
| Tests and the Rest: College Admissions Podcast | Active, weekly, episode numbers ~700-709 in 2026 | **Skipped — guest-fit mismatch.** Guest bar is credentialed educators/counselors/test-prep professionals discussing pedagogy, not tool builders; pitching a calculator would be a structural stretch bordering on self-promotion |
| Your Project Shepherd Construction Podcast (Curtis Lawson) | Was previously weekly (Fridays) through Mar 6 2026, but nothing since — confirmed via both Spotify creator page and Apple Podcasts | **Skipped — 太久没更新.** ~5-month gap after a previously stable weekly cadence; this was otherwise the best topical fit (occasionally brings on non-contractor guests like a marketing consultant, so a "free IRC-code-checking stair calculator" angle could plausibly have worked had it still been active) |
| Toolbox for the Trades (ServiceTitan) | Active | **Skipped — structural conflict of interest.** Vendor-owned show that books its own software's customers, same pattern as "Conversations with Zendesk" flagged as a bad fit in the beta project's research |
| Build In Public Podcast / Solo Founders / The New Build | Active | **Skipped — scale/celebrity mismatch.** Past or stated guests are either celebrity-tier (Gary Vaynerchuk, Alexis Ohanian) or explicitly gated to founders "operating at serious scale" / "reaching millions" |

## Outcome

0 of 12 candidates cleared both bars (active + genuinely fitting). **0 pitches drafted, 0 sent.** Per task instructions, this is a valid honest outcome, not a failure to try hard enough.

## Why this niche is thin right now

Two compounding structural problems, not a search-effort problem:
1. **Revenue/scale gate.** Nearly every guest-interview podcast in the indie-maker/SaaS-founder space (Profitable Founder, Bootstrapped Founder, Startups For the Rest of Us, Build In Public, Solo Founders) explicitly or implicitly requires guests to already have proven revenue or user scale. CalcBadger is brand new with 9 tools and no traffic yet — it has nothing to show on that axis, and claiming otherwise would violate the no-fabrication rule.
2. **Niche-specific shows want credentialed professionals, not tool-builders.** The construction and test-prep podcasts checked book contractors/builders or credentialed educators as guests, not people who built a calculator. The one show where a tools angle looked plausible (Your Project Shepherd, which had featured a non-builder marketing-consultant guest before) has gone dark for ~5 months.

Recommendation for a future pass: revisit once CalcBadger has real traffic/usage numbers to point to (removes the revenue-gate problem for maker podcasts), and/or look specifically for construction/DIY or personal-finance podcasts that run a recurring "tools and resources" segment rather than a pure guest-interview format — that structure doesn't require the guest to be an industry professional themselves.
