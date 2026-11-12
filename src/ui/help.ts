/**
 * ui/help.ts — the How to play page, built from the real data.
 *
 * Concepts: a handful of illustrated cards (icons from ui/icons.ts) — the
 * tribe, mana and charges, the leader, standing stones, buildings and
 * training, winning. Controls: printed straight from ui/hotkeys.ts, with
 * each spell and building shown by its icon and catalog name, so this page
 * can never disagree with the keys the game actually listens to.
 */

import { BUILDINGS, BuildingKind, SPELLS, SpellId } from '../sim/catalog';
import { css, escapeHtml } from './dom';
import { describedControls, HOTKEYS, HotkeyGroup, keyLabel, orderVerb } from './hotkeys';
import { buildingIcon, icon, spellIcon, UiIconName } from './icons';
import { carve } from './lettering';
import { settings } from './settings';
import { t } from '../i18n';

css('help', `
.help { display: grid; gap: 1.4rem; }
.help h3 { margin: 0 0 0.6rem; font-size: 1.05rem; line-height: 1; }
.help-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(14.5rem, 1fr)); gap: 0.6rem; }
.help-card { display: flex; gap: 0.7rem; padding: 0.7rem; border-radius: 0.3rem 0.5rem; background: rgba(70,40,15,0.07); box-shadow: inset 0 0 0 1.5px rgba(70,40,15,0.25); }
.help-card .ic { flex: none; width: 2.4rem; height: 2.4rem; border-radius: 50%; display: grid; place-items: center; color: #7a3a10; background: rgba(211,149,55,0.2); box-shadow: inset 0 0 0 2px #b97a2c; }
.help-card b { display: block; color: var(--text); margin-bottom: 0.15rem; font: 700 var(--t-md)/1.2 var(--font-display); }
.help-card p { margin: 0; color: var(--text-2); font-size: var(--t-sm); line-height: 1.45; }
.help-keys { display: grid; grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr)); gap: 0.25rem 1.5rem; }
.help-group { break-inside: avoid; }
.help-group h4 { margin: 0.6rem 0 0.3rem; font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-3); font-weight: 800; }
.help-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.24rem 0; font-size: var(--t-sm); color: var(--text-2); border-bottom: 1px dashed rgba(70,40,15,0.25); }
.help-row .keys { flex: none; min-width: 5.5rem; display: flex; gap: 0.2rem; flex-wrap: wrap; }
.help-row .kbd { height: 1.3rem; min-width: 1.3rem; font-size: 0.6875rem; padding: 0 0.3rem; }
.help-row svg { flex: none; color: var(--text); }
.help-group.compact .keys { min-width: 2.2rem; }
`);

const concepts = (): Array<{ icon: UiIconName; title: string; text: string }> => [
  { icon: 'population', title: t('help.c1.t'), text: t('help.c1.d') },
  { icon: 'mana', title: t('help.c2.t'), text: t('help.c2.d') },
  { icon: 'leader', title: t('help.c3.t'), text: t('help.c3.d') },
  { icon: 'stone', title: t('help.c4.t'), text: t('help.c4.d', { verb: orderVerb(settings.leftClickOrders) }) },
  { icon: 'hammer', title: t('help.c5.t'), text: t('help.c5.d') },
  { icon: 'trophy', title: t('help.c6.t'), text: t('help.c6.d') },
];

const GROUPS: HotkeyGroup[] = ['Camera', 'Selection', 'Spells', 'Build', 'Game'];

function row(keys: string[], label: string, ic = ''): string {
  return `<div class="help-row"><span class="keys">${keys.map((k) => `<span class="kbd">${escapeHtml(k)}</span>`).join('')}</span>${ic}<span>${label}</span></div>`;
}

export function helpHtml(): string {
  let html = `<div class="help"><section><h3>${carve(t('help.idea'))}</h3><div class="help-cards">`;
  for (const c of concepts()) html += `<div class="help-card"><span class="ic">${icon(c.icon, 20)}</span><div><b>${c.title}</b><p>${c.text}</p></div></div>`;
  html += `</div></section><section><h3>${carve(t('help.controls'))}</h3><div class="help-keys">`;
  for (const g of GROUPS) {
    html += `<div class="help-group${g === 'Spells' || g === 'Build' ? ' compact' : ''}"><h4>${t(`hk.group.${g}`)}</h4>`;
    for (const d of describedControls(settings.leftClickOrders).filter((x) => x.group === g)) html += row(d.keys, d.desc);
    if (g === 'Selection') {
      html += row(['1', '–', '9'], t('help.sel'));
      html += row(['Ctrl', '1', '–', '9'], t('help.set'));
    }
    for (const hk of HOTKEYS.filter((x) => x.group === g && !x.action.startsWith('group-') && x.code !== 'Backspace')) {
      if (hk.action.startsWith('spell:')) {
        const id = hk.action.slice(6) as SpellId;
        html += row([keyLabel(hk)], `${escapeHtml(SPELLS.find((s) => s.id === id)!.name)} <span style="color:var(--text-3)">· ${t('help.tier', { n: SPELLS.find((s) => s.id === id)!.tier })}</span>`, spellIcon(id, 18));
      } else if (hk.action.startsWith('build:')) {
        const kind = hk.action.slice(6) as BuildingKind;
        html += row([keyLabel(hk)], escapeHtml(BUILDINGS[kind].name), buildingIcon(kind, 18));
      } else html += row([keyLabel(hk)], escapeHtml(hk.desc));
    }
    html += `</div>`;
  }
  html += `</div></section></div>`;
  return html;
}
