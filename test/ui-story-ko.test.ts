/**
 * Korean campaign story (chapters 1–10): every title / tagline / narrator line / objective / briefing text of
 * src/level/campaign/c01..c10 has a Korean entry (tx()), the objective advice has Korean templates, and the
 * briefing screen shows the chapter in Korean (jsdom; skipped when jsdom is not installed: `npm i --no-save jsdom`).
 */
import { describe, expect, it, vi } from 'vitest';
import { extract } from '../tools/campaign-strings.mjs';

let JSDOM: typeof import('jsdom').JSDOM | null = null;
try {
  JSDOM = (await import('jsdom')).JSDOM;
} catch {
  JSDOM = null;
}

function install(url: string): void {
  const dom = new JSDOM!('<!doctype html><html lang="en"><head><title>x</title></head><body></body></html>', { url, pretendToBeVisual: true });
  const g = globalThis as Record<string, unknown>;
  for (const k of ['window', 'document', 'localStorage', 'location', 'HTMLElement', 'Node', 'Text', 'URLSearchParams', 'requestAnimationFrame', 'cancelAnimationFrame', 'getComputedStyle']) {
    const v = (dom.window as unknown as Record<string, unknown>)[k];
    try {
      g[k] = v;
    } catch {
      Object.defineProperty(globalThis, k, { value: v, configurable: true });
    }
  }
}

const HANGUL = /[\uAC00-\uD7A3]/;
const CHAPTERS = ['c01-landfall', 'c02-speaking-stones', 'c03-smoke-over-the-ridge', 'c04-scattered-shallows', 'c05-vigil-at-the-caldera', 'c06-barefoot-road', 'c07-two-banners', 'c08-firemount-race', 'c09-when-the-tide-came', 'c10-the-crown'];

describe.skipIf(!JSDOM)('campaign story in Korean (c01–c10)', () => {
  it('tx() translates every player-visible chapter string, English passes through in en', async () => {
    vi.resetModules();
    install('http://localhost/');
    const { tx, t } = await import('../src/i18n');
    for (const c of CHAPTERS) {
      for (const en of extract(`src/level/campaign/${c}.ts`)) {
        if (en.includes('${}')) continue;
        expect(HANGUL.test(tx(en)), en).toBe(true);
      }
    }
    expect(tx('Raise 4 Dwellings')).toBe('거처 4채를 지어라');
    expect(tx('Landfall')).toBe('상륙');
    // strings that are not in the dictionary pass through unchanged
    expect(tx('Something not in the dictionary.')).toBe('Something not in the dictionary.');
    expect(t('adv.gathering', { name: '번개', p: '는', eta: ' (약 5초)', k: '', where: '클릭하세요' })).toBe('번개는 힘을 모으는 중입니다 (약 5초). 돌이 빛나면 키를 누르고 클릭하세요.');
    vi.resetModules();
    install('http://localhost/?lang=en');
    const en = await import('../src/i18n');
    expect(en.tx('Landfall')).toBe('Landfall');
  });

  it('every adv.* template has the same placeholders in both languages and no stray braces after filling', async () => {
    vi.resetModules();
    install('http://localhost/');
    const { DICT } = await import('../src/i18n');
    for (const k of Object.keys(DICT.en).filter((x) => x.startsWith('adv.'))) {
      const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
      expect(ph(DICT.ko[k]), k).toBe(ph(DICT.en[k]));
    }
  });

  it('briefing screen of chapter 1–10 shows Korean title, body, tips and objectives', async () => {
    vi.resetModules();
    install('http://localhost/');
    await import('../src/i18n-catalog');
    const { campaignScenario } = await import('../src/level/campaign');
    const { BriefingScreen } = await import('../src/ui/campaign-screens');
    for (let n = 1; n <= 10; n++) {
      const sc = campaignScenario(['c01_landfall', 'c02_speaking_stones', 'c03_smoke_over_the_ridge', 'c04_scattered_shallows', 'c05_vigil_at_the_caldera', 'c06_barefoot_road', 'c07_two_banners', 'c08_firemount_race', 'c09_when_the_tide_came', 'c10_the_crown'][n - 1])!;
      const level = await sc.build();
      const screen = new BriefingScreen({ onPlay() {}, onBack() {} });
      screen.show({ chapter: sc.chapter, level, rules: level.rules!, boons: [] });
      const root = document.querySelector('.tgc-title')!.closest('div')!.parentElement!;
      expect(root.querySelector('.tgc-title')!.textContent).toMatch(HANGUL);
      expect(root.querySelector('.tgc-body')!.textContent).toMatch(HANGUL);
      for (const li of root.querySelectorAll('li')) expect(li.textContent).toMatch(HANGUL);
      const objs = [...root.querySelectorAll('.tgc-obj')].map((e) => e.textContent ?? '');
      expect(objs.length).toBeGreaterThan(0);
      // '✕ …' lines are generic defeat conditions from campaign-screens.ts (chrome, still English: NOTES.md)
      for (const o of objs.filter((x) => !x.startsWith('✕'))) expect(o).toMatch(HANGUL);
      document.body.innerHTML = '';
    }
  });
});
