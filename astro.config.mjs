// @ts-check

import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { sitemapConfig } from './vendor/site-toolkit/packages/sitemap-config/src/index.ts';

// https://astro.build/config
export default defineConfig({

	site: 'https://calcbadger.com',
	integrations: [
		preact(),
		// /embed/ pages are crawlable (they carry the powered-by backlink and canonical
		// to the main tool page) but stay out of the sitemap so they never compete with
		// the canonical tool pages.
		sitemap(sitemapConfig({ excludePaths: ['/embed/'] })),
	],
	build: {
		inlineStylesheets: 'always',
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
