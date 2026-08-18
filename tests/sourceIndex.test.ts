import { describe, expect, it } from 'vitest';
import { tools } from '../src/data/tools';
import {
	buildSourceIndex,
	GOVERNMENT,
	REFERENCE,
	RESEARCH,
	STANDARDS,
	sourceType,
	summarizeByType,
	toCsv,
} from '../src/lib/sourceIndex';

describe('buildSourceIndex', () => {
	it('produces one row per source across every tool', () => {
		const totalSources = tools.reduce((sum, t) => sum + t.sources.length, 0);
		const rows = buildSourceIndex(tools);
		expect(rows.length).toBe(totalSources);
	});

	it('classifies every domain into one of the four known buckets, none falls through unmapped', () => {
		const rows = buildSourceIndex(tools);
		const known = new Set([GOVERNMENT, STANDARDS, RESEARCH, REFERENCE]);
		const unmapped = rows.filter((r) => !known.has(r.sourceType));
		expect(unmapped).toEqual([]);
	});

	it('known reference-heavy domains classify as expected (spot check)', () => {
		expect(sourceType('https://www.nist.gov/pml/special-publication-811')).toBe(GOVERNMENT);
		expect(sourceType('https://www.bipm.org/en/publications/si-brochure/annex-1/time')).toBe(STANDARDS);
		expect(sourceType('https://doi.org/10.1056/NEJM198710223171717')).toBe(RESEARCH);
		expect(sourceType('https://en.wikipedia.org/wiki/Cursive')).toBe(REFERENCE);
	});
});

describe('summarizeByType', () => {
	it('counts sum to the total row count', () => {
		const rows = buildSourceIndex(tools);
		const summary = summarizeByType(rows);
		const total = summary.reduce((sum, s) => sum + s.count, 0);
		expect(total).toBe(rows.length);
	});

	it('every bucket has at least one source (headline stat depends on all four)', () => {
		const rows = buildSourceIndex(tools);
		const summary = summarizeByType(rows);
		for (const s of summary) {
			expect(s.count).toBeGreaterThan(0);
		}
	});
});

describe('toCsv', () => {
	it('emits a header row plus one row per source, comma-safe', () => {
		const rows = buildSourceIndex(tools);
		const csv = toCsv(rows);
		const lines = csv.trim().split('\n');
		expect(lines.length).toBe(rows.length + 1);
		expect(lines[0]).toBe(
			'tool_category,tool_title,tool_slug,source_label,source_url,source_domain,source_type',
		);
	});

	it('quotes fields containing commas', () => {
		const csv = toCsv([
			{
				toolCategory: 'Finance',
				toolTitle: 'Test',
				toolSlug: 'test',
				sourceLabel: 'A, B, and C',
				sourceUrl: 'https://example.com',
				sourceDomain: 'example.com',
				sourceType: REFERENCE,
			},
		]);
		expect(csv).toContain('"A, B, and C"');
	});
});
