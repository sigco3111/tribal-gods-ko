/**
 * i18n.ts — the small translation layer of the Korean localization (tribal-gods-ko).
 *
 * - `t(key, params?)` looks a key up in the active language ("{name}" placeholders are filled from params).
 * - Korean is the default; English is kept. The choice is stored in localStorage and can be forced with ?lang=en|ko.
 * - Switching the language reloads the page (the HUD is built once), so every module just calls t() when it renders.
 * - Catalog content (unit / building / spell / tribe names and blurbs) is patched in place once at start-up by
 *   `localizeCatalog()` (see i18n-catalog.ts), so all the code that reads `.name` / `.blurb` follows the language.
 *   The headless sim and its tests never call it and stay English.
 */

import { PAIRS } from './i18n-ui';

export type Lang = 'ko' | 'en';
export const LANGS: Lang[] = ['ko', 'en'];
export const LANG_KEY = 'tribal-gods-ko.lang';
export const HANGUL_RE = /[\uAC00-\uD7A3\u3131-\u318E]/;

/** key → [English, Korean]. */
export const DICT: Record<Lang, Record<string, string>> = { en: {}, ko: {} };
for (const [k, [en, ko]] of Object.entries(PAIRS)) {
  DICT.en[k] = en;
  DICT.ko[k] = ko;
}

function detect(): Lang {
  if (typeof window === 'undefined') return 'en'; // headless (tests, node checks): English
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'ko') return q;
    const s = localStorage.getItem(LANG_KEY);
    if (s === 'en' || s === 'ko') return s;
  } catch {
    /* no window / storage (headless tests): fall through */
  }
  return 'ko';
}

let lang: Lang = detect();
if (typeof document !== 'undefined') document.documentElement.lang = lang;

export const getLang = (): Lang => lang;

/** Remember the language. The caller reloads (or re-renders) afterwards. */
export function setLang(l: Lang): void {
  lang = l;
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  if (typeof document !== 'undefined') document.documentElement.lang = l;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const s = DICT[lang][key] ?? DICT.en[key] ?? key;
  return params ? s.replace(/\{(\w+)\}/g, (m, p) => (p in params ? String(params[p]) : m)) : s;
}

/** Korean particle helper: picks 은/는, 이/가, 을/를 by whether the word ends in a final consonant. English: returns ''. */
export function josa(word: string, pair: '은/는' | '이/가' | '을/를' | '과/와'): string {
  if (lang !== 'ko') return '';
  const [a, b] = pair.split('/');
  const c = word.replace(/[^가-힣A-Za-z0-9]+$/, '').slice(-1).charCodeAt(0);
  if (c >= 0xac00 && c <= 0xd7a3) return (c - 0xac00) % 28 ? a : b;
  return b;
}

/** Reverse index English → key for the strings the headless sim produces ("sim.*" keys). */
let simIndex: Map<string, string> | null = null;
const PATTERNS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^Needs a (.+)$/, (m) => t('sim.needs', { names: m[1].split(' and a ').join(', ') })],
  [/^Needs (\d+) more wood$/, (m) => t('sim.morewood', { n: m[1] })],
  [/^Your (.+) was lost\.$/, (m) => t('sim.buildinglost', { name: m[1], p: josa(m[1], '을/를') })],
  [/^(.+) — done\.$/, (m) => t('sim.done', { text: tx(m[1]) })],
  [/^One planet, (\d+) gods\. Only one tribe walks away\.$/, (m) => t('sim.skirmish.many', { n: m[1] })],
];

/**
 * Translate an English string produced by the sim (failure reasons, objective texts, scenario briefings).
 * Unknown strings (campaign story text not yet translated) come back unchanged.
 */
export function tx(text: string): string {
  if (lang === 'en' || !text) return text;
  if (!simIndex) {
    simIndex = new Map();
    for (const [k, en] of Object.entries(DICT.en)) if (k.startsWith('sim.')) simIndex.set(en, k);
  }
  const k = simIndex.get(text);
  if (k) return t(k);
  for (const [re, f] of PATTERNS) {
    const m = text.match(re);
    if (m) return f(m);
  }
  return text;
}
