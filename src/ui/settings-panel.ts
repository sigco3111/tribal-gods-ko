/**
 * ui/settings-panel.ts — the Settings form (main menu and in-game menu).
 *
 * Sound (volume, mute), graphics quality, interface size, edge panning,
 * left-click orders and hints. Each control writes its setting and applies at once — graphics
 * too (main.ts rebuilds the post chain live; only the terrain mesh's
 * detail waits for the next load, and the panel says so when it matters).
 */

import { getVolume, isMuted, setMuted, setVolume, uiClick } from '../core/audio';
import { css, h } from './dom';
import { applyUiScale, QualitySetting, saveSettings, setQuality, settings } from './settings';
import { getLang, Lang, setLang, t } from '../i18n';

css('settings-panel', `
.set { display: grid; gap: 1.05rem; }
.set-row { display: grid; grid-template-columns: 10rem 1fr; gap: 1rem; align-items: center; }
.set-row .name { font: 700 var(--t-md)/1.2 var(--font-display); color: var(--text); }
.set-row .desc { grid-column: 2; margin-top: -0.6rem; font-size: var(--t-xs); color: var(--text-3); font-weight: 600; }
.seg { justify-self: start; display: inline-flex; gap: 0.3rem; flex-wrap: wrap; }
.seg .tg-btn { min-height: 1.9rem; padding: 0 0.8rem; }
/* A switch: a peg slid along a groove. */
.switch { position: relative; width: 2.8rem; height: 1.5rem; border: 0; border-radius: 0.8rem; cursor: pointer; padding: 0;
  background: #3a2414; box-shadow: inset 0 2px 4px rgba(0,0,0,0.7), 0 0 0 1px #1a0e06, 0 1px 0 1px rgba(255,236,200,0.4); }
.switch::after { content: ''; position: absolute; top: 0.17rem; left: 0.17rem; width: 1.16rem; height: 1.16rem; border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #e9d3a6, #a7774a 60%, #4a2c14); box-shadow: 0 1px 2px rgba(0,0,0,0.7); transition: transform var(--fast) var(--ease); }
.switch.on { background: repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 5px), linear-gradient(var(--tribe-light), var(--tribe) 45%, var(--tribe-dark)); }
.switch.on::after { transform: translateX(1.3rem); }
.set-note { font-size: var(--t-sm); color: var(--text-3); display: flex; align-items: center; gap: 0.6rem; }
.vol { display: flex; align-items: center; gap: 0.75rem; }
.vol input[type=range] { width: 12rem; accent-color: #9a5a12; }
.vol .pct { min-width: 2.6rem; font-variant-numeric: tabular-nums; color: var(--text-2); font-size: var(--t-sm); font-weight: 700; }
@media (max-width: 640px) { .set-row { grid-template-columns: 1fr; } .set-row .desc { grid-column: 1; margin-top: -0.6rem; } }
`);

export interface SettingsHooks {
  /** True while a game is running (quality then asks before reloading). */
  inGame(): boolean;
  onEdgePan(on: boolean): void;
  onResetHints(): void;
  /** Apply a new graphics tier now. Returns true if the terrain detail still needs a reload. */
  onQuality?(q: QualitySetting): boolean;
}

function seg<T extends string | number>(options: Array<[T, string]>, current: () => T, pick: (v: T) => void): HTMLDivElement {
  const el = h('div.seg', { role: 'radiogroup' });
  const paint = () => {
    for (const b of el.children) b.classList.toggle('on', (b as HTMLElement).dataset.v === String(current()));
  };
  for (const [v, label] of options) {
    const b = h('button.tg-btn', { type: 'button', role: 'radio', text: label });
    b.dataset.v = String(v);
    b.addEventListener('click', () => {
      pick(v);
      paint();
    });
    el.appendChild(b);
  }
  paint();
  return el;
}

function toggle(on: () => boolean, set: (v: boolean) => void, label: string): HTMLButtonElement {
  const b = h('button.switch', { type: 'button', role: 'switch', 'aria-label': label });
  const paint = () => {
    b.classList.toggle('on', on());
    b.setAttribute('aria-checked', String(on()));
  };
  b.addEventListener('click', () => {
    set(!on());
    paint();
  });
  paint();
  return b;
}

export function settingsPanel(hooks: SettingsHooks): HTMLDivElement {
  const root = h('div.set');
  const row = (name: string, control: HTMLElement, desc: string) =>
    root.append(h('div.set-row', {}, h('div.name', { text: name }), control, h('div.desc', { text: desc })));

  // Language: stored in localStorage; the page reloads to rebuild the HUD (in a running game the change waits for the next load).
  const langNote = h('div.set-note');
  langNote.hidden = true;
  row(t('set.language'), seg<string>([['ko', '한국어'], ['en', 'English']], () => getLang(), (v) => {
    if (v === getLang()) return;
    setLang(v as Lang);
    if (hooks.inGame()) {
      langNote.hidden = false;
      langNote.textContent = t('set.language.saved');
    } else location.reload();
  }), t('set.language.desc'));
  root.appendChild(langNote);

  // Sound: master volume + mute (core/audio.ts remembers both).
  const pct = h('span.pct');
  const slider = h('input', { type: 'range', min: '0', max: '100', step: '1', 'aria-label': t('set.volume') });
  slider.value = String(Math.round(getVolume() * 100));
  const paintVol = () => (pct.textContent = isMuted() ? t('set.muted') : `${slider.value}%`);
  slider.addEventListener('input', () => {
    setVolume(Number(slider.value) / 100);
    if (isMuted()) setMuted(false);
    paintVol();
    paintMute();
  });
  slider.addEventListener('change', () => uiClick());
  slider.addEventListener('keydown', (e) => e.stopPropagation());
  const mute = toggle(() => !isMuted(), (on) => {
    setMuted(!on);
    paintVol();
  }, t('set.soundon'));
  const paintMute = () => {
    mute.classList.toggle('on', !isMuted());
    mute.setAttribute('aria-checked', String(!isMuted()));
  };
  paintVol();
  row(t('set.sound'), h('div.vol', {}, mute, slider, pct), t('set.sound.desc'));

  const note = h('div.set-note');
  note.hidden = true;
  row(t('set.graphics'), seg<QualitySetting>([['auto', t('set.auto')], ['low', t('set.low')], ['medium', t('set.medium')], ['high', t('set.high')]], () => settings.quality, (q) => {
    setQuality(q);
    const needsReload = hooks.onQuality?.(q) ?? true;
    note.hidden = !needsReload;
    if (needsReload) {
      note.replaceChildren(
        h('span', { text: t('set.graphics.applied') }),
      );
    }
  }), t('set.graphics.desc'));
  root.appendChild(note);

  row(t('set.uiscale'), seg<string>([['auto', t('set.auto')], ['0.9', '90%'], ['1', '100%'], ['1.15', '115%'], ['1.3', '130%']], () => String(settings.uiScale), (v) => {
    settings.uiScale = v === 'auto' ? 'auto' : Number(v);
    saveSettings();
    applyUiScale();
  }), t('set.uiscale.desc'));

  row(t('set.edgepan'), toggle(() => settings.edgePan, (v) => {
    settings.edgePan = v;
    saveSettings();
    hooks.onEdgePan(v);
  }, t('set.edgepan')), t('set.edgepan.desc'));

  row(t('set.leftclick'), toggle(() => settings.leftClickOrders, (v) => {
    settings.leftClickOrders = v;
    saveSettings();
  }, t('set.leftclick')), t('set.leftclick.desc'));

  const hintsRow = h('div', { style: 'display:flex;gap:0.75rem;align-items:center' },
    toggle(() => settings.hints, (v) => {
      settings.hints = v;
      saveSettings();
    }, t('set.hints')),
    h('button.tg-btn', { type: 'button', text: t('set.hints.reset'), onclick: () => hooks.onResetHints() }),
  );
  row(t('set.hints'), hintsRow, t('set.hints.desc'));
  return root;
}
