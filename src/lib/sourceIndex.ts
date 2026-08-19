import type { Tool } from '../data/tools';

export interface SourceRow {
	toolCategory: string;
	toolTitle: string;
	toolSlug: string;
	sourceLabel: string;
	sourceUrl: string;
	sourceDomain: string;
	sourceType: string;
}

export const GOVERNMENT = 'Government & regulatory agency';
export const STANDARDS = 'International standards body';
export const RESEARCH = 'Peer-reviewed research';
export const REFERENCE = 'Reference work or industry source';

/**
 * Domain -> source-type map, built by hand-checking every citation across
 * the 38 tools in tools.ts. Domains not in this map fall through to
 * REFERENCE rather than throwing, so a future tool with an uncategorized
 * source still builds — but `npm run check:source-index` (below) flags any
 * unmapped domain so it gets a real classification instead of silently
 * defaulting.
 */
const DOMAIN_TYPE: Record<string, string> = {
	// Government & regulatory agencies (US federal/state and foreign national)
	'aa.usno.navy.mil': GOVERNMENT,
	'ia.iowadot.gov': GOVERNMENT,
	'www.cdc.gov': GOVERNMENT,
	'www.consumerfinance.gov': GOVERNMENT,
	'www.dol.gov': GOVERNMENT,
	'www.ecfr.gov': GOVERNMENT,
	'www.economie.gouv.fr': GOVERNMENT,
	'www.eia.gov': GOVERNMENT,
	'www.fairwork.gov.au': GOVERNMENT,
	'www.fdic.gov': GOVERNMENT,
	'www.fhwa.dot.gov': GOVERNMENT,
	'www.investor.gov': GOVERNMENT,
	'www.itis.gov': GOVERNMENT,
	'www.itl.nist.gov': GOVERNMENT,
	'physics.nist.gov': GOVERNMENT,
	'www.nist.gov': GOVERNMENT,
	'www.niddk.nih.gov': GOVERNMENT,
	'www.niaaa.nih.gov': GOVERNMENT,
	'pubchem.ncbi.nlm.nih.gov': GOVERNMENT,
	'www.law.cornell.edu': GOVERNMENT,
	'www.legislation.gov.uk': GOVERNMENT,
	'www.japan.travel': GOVERNMENT,

	// International / national standards & measurement bodies
	'www.bipm.org': STANDARDS,
	'goldbook.iupac.org': STANDARDS,
	'www.unicode.org': STANDARDS,
	'tc39.es': STANDARDS,
	'www.iana.org': STANDARDS,
	'codes.iccsafe.org': STANDARDS,
	'www.iccsafe.org': STANDARDS,
	'www.thecorestandards.org': STANDARDS,
	'bigfuture.collegeboard.org': STANDARDS,
	'satsuite.collegeboard.org': STANDARDS,

	// Peer-reviewed research & academic sources
	'doi.org': RESEARCH,
	'journals.lww.com': RESEARCH,
	'www.ahajournals.org': RESEARCH,
	'www.thelancet.com': RESEARCH,
	'www.ncbi.nlm.nih.gov': RESEARCH,
	'pubmed.ncbi.nlm.nih.gov': RESEARCH,
	'www.sciencedirect.com': RESEARCH,
	'facultypsy.hope.edu': RESEARCH,
	'mathcs.clarku.edu': RESEARCH,
	'mathshistory.st-andrews.ac.uk': RESEARCH,
	'plato.stanford.edu': RESEARCH,
	'pi.math.cornell.edu': RESEARCH,
	'www.kidney.org': RESEARCH,
	'forestry.extension.wisc.edu': RESEARCH,

	// Reference works, encyclopedias, trade associations, manufacturer/consumer sources
	'en.wikipedia.org': REFERENCE,
	'www.britannica.com': REFERENCE,
	'mathworld.wolfram.com': REFERENCE,
	'www.calculatorsoup.com': REFERENCE,
	'archive.org': REFERENCE,
	'www.sizes.com': REFERENCE,
	'www.statisticshowto.com': REFERENCE,
	'www.timeanddate.com': REFERENCE,
	'support.microsoft.com': REFERENCE,
	'github.com': REFERENCE,
	'donatstudios.com': REFERENCE,
	'www.newamericancursive.com': REFERENCE,
	'www.pbk.org': REFERENCE,
	'business.scope.org.uk': REFERENCE,
	'emilypost.com': REFERENCE,
	'www.lonelyplanet.com': REFERENCE,
	'www.cathaypacific.com': REFERENCE,
	'www.rockler.com': REFERENCE,
	'www.quikrete.com': REFERENCE,
	'www.asphaltinstitute.org': REFERENCE,
	'www.homeinnovation.com': REFERENCE,
	'www.taxfoundation.org': REFERENCE,
	'taxfoundation.org': REFERENCE,
	'sdzwildlifeexplorers.org': REFERENCE,
};

export function sourceDomain(url: string): string {
	try {
		return new URL(url).hostname;
	} catch {
		return 'unknown';
	}
}

export function sourceType(url: string): string {
	return DOMAIN_TYPE[sourceDomain(url)] ?? REFERENCE;
}

export function buildSourceIndex(tools: Tool[]): SourceRow[] {
	const rows: SourceRow[] = [];
	for (const tool of tools) {
		for (const source of tool.sources) {
			rows.push({
				toolCategory: tool.category,
				toolTitle: tool.title,
				toolSlug: tool.slug,
				sourceLabel: source.label,
				sourceUrl: source.url,
				sourceDomain: sourceDomain(source.url),
				sourceType: sourceType(source.url),
			});
		}
	}
	return rows;
}

export function summarizeByType(rows: SourceRow[]): { type: string; count: number; domains: number }[] {
	const order = [GOVERNMENT, STANDARDS, RESEARCH, REFERENCE];
	return order.map((type) => {
		const matching = rows.filter((r) => r.sourceType === type);
		return {
			type,
			count: matching.length,
			domains: new Set(matching.map((r) => r.sourceDomain)).size,
		};
	});
}

function csvEscape(value: string): string {
	if (/[",\n]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export function toCsv(rows: SourceRow[]): string {
	const header = [
		'tool_category',
		'tool_title',
		'tool_slug',
		'source_label',
		'source_url',
		'source_domain',
		'source_type',
	];
	const lines = [header.join(',')];
	for (const r of rows) {
		lines.push(
			[
				r.toolCategory,
				r.toolTitle,
				r.toolSlug,
				r.sourceLabel,
				r.sourceUrl,
				r.sourceDomain,
				r.sourceType,
			]
				.map(csvEscape)
				.join(','),
		);
	}
	return lines.join('\n') + '\n';
}
