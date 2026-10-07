/**
 * IndexNow URL Submission Script (calcbadger.com)
 * Submits specific URLs (or, as a fallback, all sitemap URLs) to IndexNow
 * (Bing, Yandex, etc.). Single-site version, adapted from the seo-geo-trinity
 * matrix's tools/scripts/submit-indexnow.mjs -- same batching/pacing logic.
 *
 * Usage:
 *   node tools/submit-indexnow.mjs /new-guide-slug/ /another-guide/
 *   node tools/submit-indexnow.mjs --full   (resubmits entire sitemap -- exceptional use only)
 *
 * Pass the specific URL path(s) that were actually published/changed --
 * normally 1-3 URLs, not the whole site. Bing Webmaster Tools flags
 * full-sitemap batch submission as "IndexNow is in batch mode" (moderate
 * severity) -- it overloads their indexing pipeline and delays indexing
 * rather than helping. Only use --full for genuine exceptional cases (e.g.
 * a site-wide URL structure change).
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dirname, '..', 'indexnow-submit-log.json');

const SITE = {
  host: 'calcbadger.com',
  key: '419085fa3951a77b16411ed44e5ea74c',
  sitemap: 'https://calcbadger.com/sitemap-0.xml',
};

// submitted_date is the first-ever submission and must never be overwritten by a
// resubmit -- trafficsite-bing-indexnow-verify gates its 3-day wait on this field.
// last_submitted_date tracks the most recent resubmit for reference only.
function updateSubmitLog(urls, note) {
  const log = existsSync(LOG_PATH) ? JSON.parse(readFileSync(LOG_PATH, 'utf8')) : {};
  const today = new Date().toISOString().slice(0, 10);
  for (const url of urls) {
    const entry = log[url];
    if (entry) {
      entry.last_submitted_date = today;
      if (note) entry.note = entry.note ? `${entry.note} | ${note}` : note;
    } else {
      log[url] = {
        submitted_date: today,
        last_submitted_date: today,
        verified_status: 'pending',
        ...(note ? { note } : {}),
      };
    }
  }
  writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + '\n');
}

async function fetchSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Sitemap HTTP ${res.status}`);
  const xml = await res.text();
  const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
  return [...matches].map(m => m[1].trim());
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function submitBatch(endpoint, body) {
  const res = await fetch(endpoint, {
    method: 'POST',
    signal: AbortSignal.timeout(20000),
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  return { status: res.status, ok: res.status === 200 || res.status === 202 };
}

async function submitToIndexNow(site, urls) {
  const { host, key } = site;
  const BATCH_SIZE = 100;
  const acceptedUrls = [];
  const failures = [];
  const receipts = [];

  const ENDPOINTS = [
    { name: 'Bing', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Yandex', url: 'https://yandex.com/indexnow' },
  ];

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const body = {
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: batch,
    };
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    const results = await Promise.all(
      ENDPOINTS.map(async ep => {
        try {
          const { status, ok } = await submitBatch(ep.url, body);
          return { endpoint: ep.name, accepted: ok, status };
        } catch (e) {
          return { endpoint: ep.name, accepted: false, status: null, error: 'timeout/error' };
        }
      })
    );
    receipts.push({ urls: batch, results });
    if (results.some(r => r.accepted)) acceptedUrls.push(...batch);
    if (results.some(r => !r.accepted)) failures.push(...results.filter(r => !r.accepted));
    console.log(JSON.stringify({ batch: batchNum, urls: batch, results }));

    if (i + BATCH_SIZE < urls.length) await sleep(2000);
  }
  return { acceptedUrls, failures, receipts };
}

async function run() {
  const args = process.argv.slice(2);
  const fullMode = args.includes('--full');
  const noteIdx = args.indexOf('--note');
  const note = noteIdx !== -1 ? args[noteIdx + 1] : undefined;
  const explicitPaths = args.filter((a, i) =>
    a !== '--full' && a !== '--note' && !(noteIdx !== -1 && i === noteIdx + 1)
  );

  console.log(`\n📤 Submitting ${SITE.host}...`);

  let urls;
  if (explicitPaths.length > 0) {
    // Normalize each arg to a bare pathname before rebuilding the full URL.
    // A full URL passed in used to slip past the naive p.startsWith('/')
    // check and get double-prefixed into https://host/https://host/slug/
    // -- a malformed URL that was then really POSTed to Bing/Yandex as a
    // no-op submission (see factcrumbs commit 6b41fb1, 2026-09-18).
    urls = explicitPaths.map(p => {
      let path = p;
      if (/^https?:\/\//i.test(p)) {
        path = new URL(p).pathname;
      }
      return `https://${SITE.host}${path.startsWith('/') ? path : '/' + path}`;
    });
    console.log(`  Submitting ${urls.length} explicit URL(s)`);
  } else if (fullMode) {
    urls = await fetchSitemapUrls(SITE.sitemap);
    console.log(`  --full: resubmitting entire sitemap (${urls.length} URLs) -- exceptional use only`);
  } else {
    console.error(`  No URLs given. Pass specific path(s) to submit, or --full to resubmit the whole sitemap (exceptional use only).`);
    process.exit(1);
  }

  // 2026-10-07: rejected or unknown outcomes must not advance submission records.
  const result = await submitToIndexNow(SITE, urls);
  const receiptNote = [note, JSON.stringify(result.receipts)].filter(Boolean).join(' | ');
  if (result.acceptedUrls.length) updateSubmitLog(result.acceptedUrls, receiptNote);
  console.log(JSON.stringify({ accepted_urls: result.acceptedUrls, endpoint_failures: result.failures }));
  if (result.failures.length || !result.acceptedUrls.length) process.exitCode = 1;
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
