import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE_DESCRIPTION, SITE_ORIGIN, SITE_TITLE } from '../consts';
import { tools as entries } from '../data/tools';

export const GET: APIRoute = () => {
	const items = [...entries]
		.sort((a, b) => (b.published ?? b.updated).localeCompare(a.published ?? a.updated))
		.map((e) => ({
			title: e.title,
			description: e.description,
			link: `/${e.slug}/`,
			pubDate: new Date(e.published ?? e.updated),
			categories: [e.category],
		}));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: SITE_ORIGIN,
		items,
	});
};
