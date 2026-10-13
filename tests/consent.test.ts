import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Execute the actual inline gate with inert script nodes, not a duplicate policy function.
const layout = readFileSync(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8');
const script = layout.match(/<script is:inline define:vars=\{\{ GA4_ID, CLARITY_ID \}\}>([\s\S]*?)<\/script>/)![1];

function scenario(gpc: boolean, stored = '', timezone = 'Europe/London') {
  const loaded: string[] = [];
  const events: (() => void)[] = [];
  const clicks: Record<string, () => void> = {};
  let saved = stored;
  const nodes: Record<string, any> = {};
  for (const id of ['consent-bar', 'consent-accept', 'consent-decline']) {
    nodes[id] = { hidden: true, focus() {}, addEventListener(_event: string, fn: () => void) { clicks[id] = fn; } };
  }
  const ad = { attributes: [{ name: 'src', value: 'https://ad.example/invoke.js' }], src: 'https://ad.example/invoke.js', parentNode: {
    replaceChild(node: any) { loaded.push(node.src); node.onload?.(); }
  } };
  const document = {
    readyState: 'loading',
    documentElement: { classList: { add() {}, remove() {} } },
    createElement() { return { setAttribute(key: string, value: string) { (this as any)[key] = value; } }; },
    querySelectorAll(selector: string) { return selector.includes('script[') ? [ad] : []; },
    getElementById(id: string) { return nodes[id]; },
    getElementsByTagName() { return [{ parentNode: { insertBefore(node: any) { loaded.push(node.src); } } }]; },
    head: { appendChild(node: any) { loaded.push(node.src); } },
    addEventListener(_event: string, fn: () => void) { events.push(fn); }
  };
  runInNewContext(script, {
    document, window: {}, navigator: { globalPrivacyControl: gpc },
    location: { hostname: 'calcbadger.com', reload() {} },
    Intl: { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone: timezone }) }) },
    localStorage: { getItem: () => saved, setItem: (_key: string, value: string) => { saved = value; } },
    GA4_ID: 'test-ga', CLARITY_ID: 'test-clarity'
  });
  events.forEach(fn => fn());
  return { loaded, nodes, clickAccept: () => clicks['consent-accept'](), saved: () => saved };
}

describe('production consent gate', () => {
  it.each(['', 'granted', 'denied'])('GPC blocks ad/analytics loaders with stored=%s', stored => {
    const s = scenario(true, stored);
    expect(s.loaded).toEqual([]);
    s.clickAccept();
    expect(s.loaded).toEqual([]);
    expect(s.saved()).toBe('denied');
  });
  it('asks a new European visitor and loads only after acceptance', () => {
    const s = scenario(false);
    expect(s.loaded).toEqual([]);
    expect(s.nodes['consent-bar'].hidden).toBe(false);
    s.clickAccept();
    expect(s.loaded).toHaveLength(3);
  });
  it('honors a stored denial outside Europe', () => {
    expect(scenario(false, 'denied', 'America/New_York').loaded).toEqual([]);
  });
  it('retains a saved grant without GPC', () => {
    expect(scenario(false, 'granted').loaded).toHaveLength(3);
  });
  it('retains the declared default outside Europe without GPC', () => {
    expect(scenario(false, '', 'America/New_York').loaded).toHaveLength(3);
  });
});
