# CalcBadger — SERP-ranked outreach drafts

This file is specific to the `serp-ranked-outreach` task (SERP-verified target selection). Do not merge with `outreach-drafts.md` (guest-post-outreach) or `broken-link-outreach-log.md` — keeping these separate is the point, per the task's design (horizontal comparison of conversion rates across the three targeting logics).

CalcBadger is one of the two sites (with DialWick) under the 2026-09-04 "capacity concentration" rule's fixed rotating slot — every outreach task gives CalcBadger or DialWick one guaranteed name per run, alternating by whichever was least recently touched. This is the first time `serp-ranked-outreach` has processed CalcBadger; `broken-link-outreach-log.md` last gave it a fixed slot on 2026-09-09 (embed-component angle). This run continues that same angle (embed outreach) since it's the one CalcBadger's own capacity rule specifies, but sourced through this task's own SERP-search methodology rather than a resource-page sweep.

---

## 2026-09-12 — BarrierBoss (barrierbossusa.com) — concrete-per-fence-post guide — embed-offer pitch

**Target keyword:** `how many bags of concrete for a fence post` (real DataForSEO SERP query, not CalcBadger's own GSC position — CalcBadger's concrete-calculator page GSC position wasn't checked for this specific query since the site's capacity-rule angle is proactive embed placement, not a striking-distance content page).

**SERP classification (8 organic results):** reddit.com (r/FenceBuilding — no viable Reddit account, matrix automation frozen, see memory `reddit-account-good-conflict4752-risk`), mudmixer.com (checked — has its own interactive calculator widget already, disqualified), barrierbossusa.com (candidate, pursued), quikrete.com (the actual manufacturer's own calculator, skipped as an unrealistic outreach target), quora.com (skipped, Q&A social), diy.stackexchange.com (skipped, Q&A social, no realistic single contact), sakrete.com (competing manufacturer's own project guide, skipped), community.screwfix.com (UK forum thread, skipped — different national market, no realistic fit).

Also checked and disqualified two candidates from the related keyword `how to calculate stair rise and run` (tried first, before switching to concrete): firgelliauto.com/blogs/engineering-calculators/stair-calculator-rise-run-number-of-steps (fresh, `dateModified` 2026-09-05, but the page's own JSON-LD description says "Interactive tool with diagram, formulas, and worked examples" — they already built their own stair calculator as part of an entire "engineering-calculators" content hub, not a genuine embed target), hansenpolebuildings.com/2025/09/calculating-stairs-rise-and-run-2/ (`datePublished` 2025-09-04, just over the 12-month freshness gate as of 2026-09-12).

**The gap:** BarrierBoss's article title literally promises "Step-by-Step Calculator" but the body is a static text walkthrough with one worked example (10 in. diameter hole, 30 in. deep → ~3 bags after subtracting a 4×4 post's displacement). No `<input>` field or iframe calculator is actually embedded in the article body (verified by isolating the `<article>` HTML and searching for `<input>`/`<iframe>` — found none inside the article content, only in unrelated site chrome/nav). Anyone with a different hole size has to redo the πr²h arithmetic by hand. The article's own numbers (0.375 ft³ per 50 lb bag) match CalcBadger's own published bag-yield table exactly (QUIKRETE Concrete Mix 1101 spec, `apps/calcbadger/src/data/tools.ts` `concrete-calculator` entry) — confirmed independently accurate, not a discrepancy to point out, just a shared fact to build the pitch on.

**Contribution offered:** CalcBadger's live concrete calculator (https://calcbadger.com/concrete-calculator/), which has a dedicated post-hole mode using the same 3×-diameter QUIKRETE rule and bag-yield numbers the target article already cites, plus an embeddable iframe version (https://calcbadger.com/embed/concrete-calculator/) offered as a straight swap-in for the article's static example — not requiring the target to rewrite anything, just optionally add a live tool.

**Recipient:** orders@barrierbossusa.com (the only public contact email found on the site — checked `/pages/contact-us`, `/pages/about-us`, and the site footer; author byline "Barrier Bob" appears to be a brand persona, not a named individual, so the email is addressed to that byline as displayed on the site, not to a fabricated real name)

**Prior-contact check:** `gmail_send.py list --query "to:barrierbossusa.com"` returned empty. `grep -ril "barrierbossusa"` across the whole matrix found no prior outreach mention (only a raw DataForSEO SERP-cache JSON file from this same run).

**Subject:** A number to plug into your fence-post concrete guide

**Body:**

Hi Barrier Bob,

I build calculators for a living and landed on your concrete-per-fence-post guide while checking post-hole math against installer numbers. It's more careful than most of what's out there: you work through V = πr²h, subtract the post's own displacement, and land on real bag counts instead of a vague range.

The one thing I noticed: you've got a single worked example (10 in. hole, 30 in. deep, about 3 bags), so anyone with a different hole size has to redo that arithmetic by hand or drop your formula into a spreadsheet.

I run CalcBadger, and we've got a free concrete calculator with a dedicated post-hole mode using the same numbers your guide already cites (0.375 ft³ per 50 lb bag, QUIKRETE's 3x-diameter rule): https://calcbadger.com/concrete-calculator/. There's also an embeddable version if you'd rather drop a live tool into that section instead of the static example: https://calcbadger.com/embed/concrete-calculator/. Happy to send over the iframe snippet if that's useful. Either way, you clearly did the harder part of the math already, so it felt like a waste not to mention it.

Best,
Owen
CalcBadger

**Checks done:** Passed through Skill(humanizer) and Skill(avoid-ai-writing) — two rounds of edits (cut "real installer numbers"→"installer numbers", cut "you actually work through"→"you work through", reworded the "worth flagging" closer which is a flagged vague-endorsement construction). No em dashes, no curly quotes, no AI-vocabulary words, no rule-of-three padding. Both calculator URLs (`/concrete-calculator/` and `/embed/concrete-calculator/`) confirmed live (HTTP 200) before sending.

**Status: SENT.** Independent review agent verdict: "可以发送" — verified live: the article body has exactly one worked example and no embedded calculator widget (the site's own "Fence Calculator" nav pill is a separate delivery-pricing tool, unrelated); byline and contact email confirmed; CalcBadger's own bag-yield numbers confirmed to match `tools.ts` verbatim; both calculator URLs returned HTTP 200; dedup clean. Sent 2026-09-12 via `gmail_send.py send --from calcbadger`, Message ID `1a095db9ce686bc2`. Delivery confirmed via `gmail_send.py list` — From header arrived as `CalcBadger <contact@calcbadger.com>`.
