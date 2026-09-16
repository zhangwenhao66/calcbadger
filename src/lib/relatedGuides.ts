import { pickRelatedGuides } from '../../vendor/site-toolkit/packages/related-guides/src/index.ts';
import type { Tool } from '../data/tools';

const MAX = 6;

/**
 * Adds a cross-category fallback on top of site-toolkit's same-category
 * `pickRelatedGuides`, so singleton/thin categories still get a populated
 * related-tools sidebar (used by src/pages/[slug].astro).
 *
 * True singletons (the only tool in their category) get a fixed
 * front-of-queue spot in every fallback instead of competing in the
 * rotation. Without this, a plain rotating cross-category fill can still
 * leave a singleton with zero inbound links if no triggering page's
 * rotation happens to land on it -- see trinity CLAUDE.md "单例分类需要跨
 * 分类兜底" for the gamma/deel-vs-rippling case this mirrors, and UmberLore's
 * src/lib/relatedGuides.ts for the same fix on that site. Verified with
 * `verifyRelatedGuidesFallbackCoverage` below (2026-09-16: CalcBadger's 2
 * singleton categories -- Real Estate, Sports -- both reach 100% coverage
 * with this priority queue in place; the pre-fix rotation-only fallback
 * left both at 0 inbound links despite the [slug].astro comment claiming
 * "verified: 9/9 coverage" -- that check predated these two categories).
 */
export function pickRelatedGuidesWithFallback<T extends Tool>(
	allTools: T[],
	current: T,
	max = MAX,
): T[] {
	const related = pickRelatedGuides(allTools, current, max);
	const crossCategoryPool = allTools.filter((t) => t.slug !== current.slug && !related.includes(t));
	const remaining = max - related.length;
	const globalIndex = allTools.findIndex((t) => t.slug === current.slug);

	const categoryCounts = new Map<string, number>();
	for (const t of allTools) categoryCounts.set(t.category, (categoryCounts.get(t.category) ?? 0) + 1);
	const isSingleton = (t: T) => categoryCounts.get(t.category) === 1;

	const singletonPool = crossCategoryPool.filter(isSingleton);
	const rotationPool = crossCategoryPool.filter((t) => !isSingleton(t));
	const singletonPicks = singletonPool.slice(0, remaining);
	const rotationRemaining = remaining - singletonPicks.length;
	const rotationPicks =
		rotationRemaining > 0
			? Array.from(
					{ length: Math.min(rotationRemaining, rotationPool.length) },
					(_, k) => rotationPool[(globalIndex + k) % rotationPool.length],
				)
			: [];
	const crossCategory = remaining > 0 ? [...singletonPicks, ...rotationPicks] : [];
	return [...related, ...crossCategory];
}

export interface RelatedGuidesCoverageReport {
	total: number;
	linkedTo: number;
	coveragePct: number;
	emptySidebar: string[];
	neverLinked: string[];
}

/**
 * Verification helper: run after any change to `pickRelatedGuidesWithFallback`
 * (or `pickRelatedGuides` in site-toolkit) before shipping. `emptySidebar`
 * must be empty (every page renders a related-tools section) and
 * `neverLinked` must be empty (every tool gets at least one inbound link
 * from someone else's sidebar, so nothing is an orphan page).
 */
export function verifyRelatedGuidesFallbackCoverage<T extends Tool>(
	allTools: T[],
	max = MAX,
): RelatedGuidesCoverageReport {
	const linkedTo = new Set<string>();
	const emptySidebar: string[] = [];
	for (const tool of allTools) {
		const relatedFinal = pickRelatedGuidesWithFallback(allTools, tool, max);
		if (relatedFinal.length === 0) emptySidebar.push(tool.slug);
		for (const r of relatedFinal) linkedTo.add(r.slug);
	}
	const neverLinked = allTools.map((t) => t.slug).filter((slug) => !linkedTo.has(slug));
	return {
		total: allTools.length,
		linkedTo: linkedTo.size,
		coveragePct: allTools.length > 0 ? (linkedTo.size / allTools.length) * 100 : 100,
		emptySidebar,
		neverLinked,
	};
}
