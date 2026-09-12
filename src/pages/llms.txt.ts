import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_ORIGIN, SITE_TITLE } from '../consts';
import { tools as entries } from '../data/tools';

export const GET: APIRoute = () => {
	const sorted = [...entries].sort(
		(a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
	);
	const lines = [
		`# ${SITE_TITLE}`,
		'',
		`> ${SITE_DESCRIPTION}`,
		'',
		'## Pages',
		...sorted.map((e) => `- [${e.title}](${SITE_ORIGIN}/${e.slug}/): ${e.description}`),
		'',
		`RSS feed: ${SITE_ORIGIN}/rss.xml`,
	];
	return new Response(lines.join('\n') + '\n', {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
