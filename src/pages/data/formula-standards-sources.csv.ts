import type { APIRoute } from 'astro';
import { tools } from '../../data/tools';
import { buildSourceIndex, toCsv } from '../../lib/sourceIndex';

export const GET: APIRoute = () => {
	const csv = toCsv(buildSourceIndex(tools));
	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'inline; filename="formula-standards-sources.csv"',
		},
	});
};
