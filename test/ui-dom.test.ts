/**
 * DOM-level test of the localized UI with jsdom (no WebGL): builds the real menu screens and HUD, checks the Korean
 * texts, that English is kept with ?lang=en, and that no stray English words are left in the Korean screens.
 * Skipped when jsdom is not installed (it is not a project dependency: `npm i --no-save jsdom`).
 */
import { describe, expect, it, vi } from 'vitest';

let JSDOM: typeof import('jsdom').JSDOM | null = null;
try {
  JSDOM = (await import('jsdom')).JSDOM;
} catch {
  JSDOM = null;
}

/** Latin words allowed in Korean screens (brand, key names, units, proper nouns). */
const ALLOWED = new Set(['Tribal', 'Gods', 'F1', 'Esc', 'Shift', 'Ctrl', 'Space', 'W', 'A', 'S', 'D', 'Q', 'E', 'C', 'P', 'L', 'R', 'T', 'Y', 'U', 'I', 'F', 'G', 'H', 'J', 'K', 'V', 'B', 'N', 'M', 'Del', 'Bksp', 'English', 'Language', 'br3nt', 'github', 'com', 'tribal', 'gods', 'tribal-gods', 'x', 'kbd', 'span', 'class', 'WASD', 'Mac', 'TribalGods']);

function install(url: string): void {
  const dom = new JSDOM!('<!doctype html><html lang="en"><head><title>x</title></head><body></body></html>', { url, pretendToBeVisual: true });
  const g = globalThis as Record<string, unknown>;
  for (const k of ['window', 'document', 'localStorage', 'location', 'HTMLElement', 'HTMLButtonElement', 'HTMLCanvasElement', 'Node', 'Text', 'KeyboardEvent', 'MouseEvent', 'PointerEvent', 'URLSearchParams', 'requestAnimationFrame', 'cancelAnimationFrame', 'innerWidth', 'innerHeight', 'getComputedStyle']) {
    const v = (dom.window as unknown as Record<string, unknown>)[k];
    try {
      g[k] = v;
    } catch {
      Object.defineProperty(globalThis, k, { value: v, configurable: true });
    }
  }
  Object.defineProperty(globalThis, 'devicePixelRatio', { value: 1, configurable: true });
  // jsdom has no canvas: a context whose every method is a no-op is enough for the HUD to build and update.
  const noop = new Proxy(function () {}, { get: (_t, k) => (k === 'canvas' ? {} : k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : k === 'measureText' ? () => ({ width: 10 }) : noop), set: () => true, apply: () => noop });
  (dom.window.HTMLCanvasElement.prototype as unknown as { getContext: () => unknown }).getContext = () => noop;
  Object.defineProperty(globalThis, 'addEventListener', { value: dom.window.addEventListener.bind(dom.window), configurable: true });
  Object.defineProperty(globalThis, 'matchMedia', { value: () => ({ matches: false, addEventListener() {} }), configurable: true });
}

/** Latin words (3+ letters) in the visible text that are not whitelisted. */
function englishWords(text: string): string[] {
  return (text.match(/[A-Za-z][A-Za-z'’-]{2,}/g) ?? []).filter((w) => !ALLOWED.has(w) && !/^[A-Z]+$/.test(w)); // all-caps runs are key caps / roman numerals
}

describe.skipIf(!JSDOM)('UI DOM (jsdom)', () => {
  it('menu screens are Korean by default and leave no English words', async () => {
    vi.resetModules();
    install('http://localhost/');
    await import('../src/i18n-catalog');
    const i18n = await import('../src/i18n');
    const { Menu } = await import('../src/ui/menu');
    expect(i18n.getLang()).toBe('ko');
    const menu = new Menu();
    menu.onCampaign = () => {};
    menu.show('title');
    const overlay = () => document.querySelector('.menu') as HTMLElement;
    const labels = [...overlay().querySelectorAll('.menu-nav .tg-btn')].map((b) => b.textContent?.trim());
    expect(labels).toEqual(['캠페인', '자유 대전', '레벨', '편집기', '설정', '게임 방법', '언어 · 한국어']);
    expect(overlay().querySelector('.menu-credit')?.textContent).toContain('br3nt');
    expect(overlay().querySelector('.menu-logo p')?.textContent).toContain('주술사');
    const seen: Array<[string, string[]]> = [];
    for (const s of ['title', 'skirmish', 'settings', 'help', 'pause'] as const) {
      menu.show(s);
      seen.push([s, englishWords(overlay().textContent ?? '')]);
    }
    expect(seen.filter(([, w]) => w.length)).toEqual([]);
    menu.show('settings');
    expect(overlay().textContent).toContain('언어 / Language');
    menu.show('skirmish');
    expect(overlay().textContent).toContain('숲 부족');
    expect(overlay().textContent).toContain('쉬움');
  });

  it('keeps English with ?lang=en', async () => {
    vi.resetModules();
    install('http://localhost/?lang=en');
    await import('../src/i18n-catalog');
    const i18n = await import('../src/i18n');
    const { Menu } = await import('../src/ui/menu');
    expect(i18n.getLang()).toBe('en');
    const menu = new Menu();
    const labels = [...(document.querySelector('.menu') as HTMLElement).querySelectorAll('.menu-nav .tg-btn')].map((b) => b.textContent?.trim());
    expect(labels).toContain('Skirmish');
    expect(labels).toContain('How to play');
    const { UNITS } = await import('../src/sim/catalog');
    expect(UNITS.shaman.name).toBe('Leader');
    void menu;
  });

  it('HUD (top bar, build menu, spell book, objectives) is Korean', async () => {
    vi.resetModules();
    install('http://localhost/');
    await import('../src/i18n-catalog');
    const THREE = await import('three');
    const { World } = await import('../src/sim/world-state');
    const { appState } = await import('../src/ui/app-state');
    const { GameUi } = await import('../src/ui/game-ui');
    const world = new World();
    world.reset(7);
    appState.mode = 'game';
    const canvas = document.createElement('canvas');
    const camera = new THREE.PerspectiveCamera(50, 1.6, 0.1, 1000);
    const ui = new GameUi(world, { camera, target: { x: 20, z: 20 } as never, map: world.map }, new THREE.Scene(), canvas, { fps: 60, tickCount: 0 }, {
      openMenu() {}, openHelp() {}, restart() {}, quitToMenu() {}, isBlocked: () => false,
    }, () => 3);
    ui.reset();
    for (let i = 0; i < 15 * 5; i++) world.tick(1 / 15);
    ui.update(0.2);
    ui.update(0.2);
    const root = document.getElementById('ui')!;
    const text = root.textContent ?? '';
    expect(text).toContain('목재');
    expect(text).toContain('마나');
    expect(text).toContain('건설');
    expect(text).toContain('목표');
    const slots = [...root.querySelectorAll('.sb-slot')].map((b) => b.getAttribute('aria-label'));
    expect(slots).toContain('폭발');
    expect(slots).toContain('화산');
    expect(englishWords(text.replace(/\u00a0/g, ' '))).toEqual([]);
  });
});
