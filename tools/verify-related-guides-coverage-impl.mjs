// Verifies src/lib/relatedGuides.ts's pickRelatedGuidesWithFallback() gives
// every tool a non-empty related-tools sidebar AND at least one inbound
// link from someone else's sidebar (no orphan pages), across the full
// current tools.ts. Run after any change to the selection/fallback logic,
// or to related-guides/site-toolkit, before shipping.
//
// Loaded dynamically by verify-related-guides-coverage.mjs after that
// bootstrap registers the .ts-extension resolve hook -- do not run this
// file directly with plain `node` (its `../src/data/tools.ts` import will
// fail resolving tools.ts's own extensionless ../lib/* imports).
import { tools } from '../src/data/tools.ts';
import { verifyRelatedGuidesFallbackCoverage } from '../src/lib/relatedGuides.ts';

const report = verifyRelatedGuidesFallbackCoverage(tools);
const asJson = process.argv.includes('--json');

if (asJson) {
	console.log(JSON.stringify(report, null, 2));
} else {
	console.log(
		`total=${report.total} linkedTo=${report.linkedTo} coverage=${report.coveragePct.toFixed(1)}%`,
	);
	console.log('emptySidebar (page renders no related-tools section):', report.emptySidebar);
	console.log('neverLinked (orphan: nobody links to this tool):', report.neverLinked);
}

const ok = report.emptySidebar.length === 0 && report.neverLinked.length === 0;
if (!asJson) {
	console.log(ok ? '\nPASS: 100% coverage, no orphan pages.' : '\nFAIL: see lists above.');
}
process.exit(ok ? 0 : 1);
