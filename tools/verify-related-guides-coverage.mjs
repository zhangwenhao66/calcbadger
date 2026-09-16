#!/usr/bin/env node
// Bootstrap only -- see verify-related-guides-coverage-impl.mjs for what this
// actually checks.
//
// src/data/tools.ts intentionally imports several ../lib/* modules without a
// file extension (kept as-is on purpose -- see the comment at the top of
// tools.ts about the Aug 2026 pruned generator pages). Astro's Vite bundler
// resolves that fine, but plain `node` does not: its native ESM resolver
// requires explicit extensions on relative specifiers, so any standalone
// Node script that imports tools.ts (directly or transitively, as this
// coverage check does via src/lib/relatedGuides.ts) fails with
// ERR_MODULE_NOT_FOUND. Registering a resolve hook that retries with `.ts`
// appended fixes that without touching tools.ts's intentionally-preserved
// imports -- but the hook must be registered *before* the failing import is
// linked, which a static `import` at the top of this same file would not
// satisfy (static imports resolve before any of the module's own code runs).
// Hence the bootstrap/impl split: register the hook, then dynamically import
// the real implementation.
//
// Usage:
//   node tools/verify-related-guides-coverage.mjs
//   node tools/verify-related-guides-coverage.mjs --json > coverage.json
import { register } from 'node:module';

register('./ts-ext-resolve-hook-loader.mjs', import.meta.url);
await import('./verify-related-guides-coverage-impl.mjs');
