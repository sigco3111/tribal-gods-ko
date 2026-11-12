/**
 * ui/hints.ts — the first few minutes, one nudge at a time.
 *
 * Instead of a wall of help text, a single small chip near the top of the
 * screen suggests the next thing worth doing. Each hint has a moment it
 * becomes relevant and a condition that means "they've got it" — then it
 * disappears by itself. Dismissed or completed hints are remembered in
 * localStorage, so nobody is taught the same thing twice. Settings can turn
 * them off altogether.
 *
 * In a story chapter (scripted events) the generic onboarding chips stand
 * aside — the narrator is already saying what to do — and the chip instead
 * says HOW to do the current objective (ui/objective-advice.ts).
 */

import { BUILD_ORDER, BUILDINGS, SPELLS } from '../sim/catalog';
import { UiContext } from './context';
import { css, h } from './dom';
import { labelFor, orderVerb } from './hotkeys';
import { icon, UiIconName } from './icons';
import { settings } from './settings';
import { currentObjective, isGuided, objectiveAdvice } from './objective-advice';
import { ritualOf } from './stones';
import { activeSpell } from './tools';
import { josa, t } from '../i18n';

interface Hint {
  id: string;
  icon: UiIconName;
  html: () => string;
  /** Should it show now? */
  when: (c: UiContext, t: number) => boolean;
  /** Has the player done it? */
  done: (c: UiContext) => boolean;
}

const KEY = 'tg.hints.v1';
const OBJECTIVE_HINT = 'objective';

css('hints', `
/* A tag of hide, its icon painted in an ochre ring. */
.hint-chip { display: flex; align-items: center; gap: 0.55rem; max-width: 100%; padding: 0.3rem 0.35rem 0.3rem 0.5rem; font-size: var(--t-sm); line-height: 1.35; font-weight: 600; color: var(--text);
  --frame: 0.3125rem; animation: hint-in 400ms var(--ease); }
.hint-chip .ic { flex: none; width: 1.85rem; height: 1.85rem; border-radius: 50%; display: grid; place-items: center; color: #7a3a10; background: rgba(211,149,55,0.2); box-shadow: inset 0 0 0 2px #b97a2c; }
.hint-chip .kbd { margin: 0 0.1rem; }
.hint-chip .tg-btn { flex: none; min-height: 1.7rem; min-width: 1.7rem; }
@keyframes hint-in { from { opacity: 0; transform: translateY(-0.5rem); } to { opacity: 1; transform: none; } }
`);

/** The player's leader's ritual, if one is under way. */
const ritualOfLeader = (c: UiContext) => {
  const l = c.world.leaderOf('player');
  return l ? ritualOf(c.world, l.id) : null;
};

const k = (a: Parameters<typeof labelFor>[0]) => `<span class="kbd">${labelFor(a)}</span>`;

export class Hints {
  private readonly seen: Set<string>;
  private readonly hints: Hint[];
  private el: HTMLDivElement | null = null;
  private textEl: HTMLSpanElement | null = null;
  private textHtml = '';
  /** Objectives whose advice chip the player closed (this game only). */
  private readonly dismissedObjectives = new Set<number>();
  /** When each objective became active (sim seconds), so the chip follows the newest step of the story. */
  private readonly activatedAt = new Map<number, number>();
  private showing: string | null = null;
  private startCam = { x: 0, z: 0 };
  private armedOnce = false;
  private learnedFrom = 0;
  private sinceStart = 0;

  constructor(private readonly ctx: UiContext, private readonly column: HTMLElement) {
    let saved: string[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[];
    } catch {
      /* fresh */
    }
    this.seen = new Set(saved);
    const moved = () => Math.hypot(ctx.view.target.x - this.startCam.x, ctx.view.target.z - this.startCam.z) > 10;
    const w = () => ctx.world;
    const ownHut = () => w().buildings.some((b) => b.tribe === 'player' && b.kind === 'hut');
    const verb = () => orderVerb(settings.leftClickOrders);
    const leader = () => w().leaderOf('player');
    /** The spell the spells hint teaches: Blast when the tribe knows it, else the first it knows. */
    const teachSpell = () => {
      const known = SPELLS.filter((s) => w().spellState('player', s.id).known || w().spellState('player', s.id).gifted > 0);
      return known.find((s) => s.id === 'blast') ?? known[0] ?? null;
    };
    const dwelling = BUILD_ORDER[0];
    this.hints = [
      {
        id: 'camera', icon: 'eye',
        html: () => t('hint.camera', { key: k('centre-leader') }),
        when: (_c, t) => t > 1.5, done: moved,
      },
      {
        id: 'dwelling', icon: 'housed',
        // Only while a Dwelling is allowed here; while the wood isn't there yet, say so rather than ask for the impossible.
        html: () => {
          const st = w().buildState('player', dwelling);
          const name = BUILDINGS[dwelling].name;
          if (!st.affordable) {
            return t('hint.dwell.poor', { name, cost: BUILDINGS[dwelling].wood, have: w().tribeSummary('player').wood, key: k(`build:${dwelling}`) });
          }
          return t('hint.dwell.ok', { name, key: k(`build:${dwelling}`) });
        },
        when: (_c, t) => t > 4 && !isGuided(w()) && w().buildState('player', dwelling).allowed && w().buildState('player', dwelling).unlocked, done: ownHut,
      },
      {
        id: 'spells', icon: 'book',
        // Never "pick Blast" while Blast has nothing to cast: say what is happening instead.
        html: () => {
          const s = teachSpell()!;
          const st = w().spellState('player', s.id);
          const key = k(`spell:${s.id}`);
          if (!leader()) return t('hint.noleader');
          if (st.charges + st.gifted > 0) return t('hint.ready', { spell: s.name, key });
          if (!st.charging) return t('hint.nocharge', { spell: s.name, p: josa(s.name, '은/는') });
          return t('hint.gather', { spell: s.name, key, eta: Number.isFinite(st.eta) ? ' ' + t('hint.eta', { n: Math.ceil(st.eta) }) : '' });
        },
        when: (_c, t) => (t > 30 || ownHut()) && !isGuided(w()) && !!teachSpell(), done: () => this.armedOnce,
      },
      {
        id: 'stones', icon: 'stone',
        html: () => t('hint.stones', { key: k('select-leader'), verb: verb() }),
        when: (c, t) => t > 90 && !isGuided(c.world) && !!leader() && c.world.monuments.some((m) => c.world.monumentAvailable(m)),
        done: (c) => (c.world.tribes.player?.known.size ?? 0) > this.learnedFrom || c.world.units.some((u) => u.tribe === 'player' && u.task === 'worship'),
      },
      {
        // In a story chapter: how to do the objective in front of you (ui/objective-advice.ts).
        // Never "seen" for good — it follows the story; dismissing it hides it for that objective.
        id: OBJECTIVE_HINT, icon: 'objective',
        html: () => {
          const cur = currentObjective(w(), this.activatedAt);
          return (cur && objectiveAdvice(w(), cur.objective, settings.leftClickOrders)) ?? '';
        },
        when: (_c, t) => {
          if (t < 2 || !isGuided(w())) return false;
          const cur = currentObjective(w(), this.activatedAt);
          return !!cur && !this.dismissedObjectives.has(cur.index) && !!objectiveAdvice(w(), cur.objective, settings.leftClickOrders);
        },
        done: () => false,
      },
      {
        id: 'ritual', icon: 'shield',
        html: () => t('hint.ritual'),
        when: (c) => !!ritualOfLeader(c), done: (c) => (c.world.tribes.player?.known.size ?? 0) > this.learnedFrom,
      },
      {
        id: 'select', icon: 'move',
        html: () => settings.leftClickOrders
          ? t('hint.select.l')
          : t('hint.select.r'),
        when: (c, t) => t > 60 && !isGuided(c.world) && c.world.units.filter((u) => u.tribe === 'player' && !u.hidden).length > 1, done: (c) => c.selection.units.size > 1,
      },
    ];
  }

  /** New game: restart the clock (completed hints stay completed). */
  reset(): void {
    this.sinceStart = 0;
    this.dismissedObjectives.clear();
    this.activatedAt.clear();
    this.startCam = { x: this.ctx.view.target.x, z: this.ctx.view.target.z };
    this.learnedFrom = this.ctx.world.tribes.player?.known.size ?? 0;
    this.hide();
  }

  private remember(id: string): void {
    this.seen.add(id);
    try {
      localStorage.setItem(KEY, JSON.stringify([...this.seen]));
    } catch {
      /* storage blocked */
    }
  }

  /** Forget everything (Settings → "Show hints again"). */
  resetSeen(): void {
    this.seen.clear();
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage blocked */
    }
  }

  private hide(): void {
    this.el?.remove();
    this.el = null;
    this.showing = null;
  }

  update(dt: number): void {
    this.sinceStart += dt;
    const w = this.ctx.world;
    w.objectives.forEach((o, i) => {
      if (o.active !== false && !this.activatedAt.has(i)) this.activatedAt.set(i, w.elapsed);
    });
    if (activeSpell()) this.armedOnce = true;
    if (!settings.hints || w.gameOver) return this.hide(); // nothing to advise on a finished game
    // Retire the one showing if it's done.
    for (const hint of this.hints) {
      if (hint.id !== OBJECTIVE_HINT && !this.seen.has(hint.id) && hint.done(this.ctx)) {
        this.remember(hint.id);
        if (this.showing === hint.id) this.hide();
      }
    }
    if (this.showing) {
      const cur = this.hints.find((x) => x.id === this.showing)!;
      // The situation changed under the hint (wood arrived, a charge filled): reword it, or
      // withdraw it if it no longer applies — a hint never asks for something impossible.
      if (!cur.when(this.ctx, this.sinceStart)) return this.hide();
      const html = cur.html();
      if (this.textEl && this.textHtml !== html) {
        this.textHtml = html;
        this.textEl.innerHTML = html;
      }
      return;
    }
    const next = this.hints.find((x) => (x.id === OBJECTIVE_HINT || !this.seen.has(x.id)) && x.when(this.ctx, this.sinceStart));
    if (!next) return;
    this.showing = next.id;
    const close = h('button.tg-btn.icon-only', { type: 'button', 'aria-label': t('hint.dismiss'), html: icon('close', 14) });
    close.addEventListener('click', () => {
      if (next.id === OBJECTIVE_HINT) {
        const cur = currentObjective(this.ctx.world, this.activatedAt);
        if (cur) this.dismissedObjectives.add(cur.index);
      } else this.remember(next.id);
      this.hide();
    });
    this.textHtml = next.html();
    this.textEl = h('span.txt', { html: this.textHtml });
    this.el = h('div.hint-chip.tg-panel.mat-hide', { role: 'status' }, h('span.ic', { html: icon(next.icon, 16) }), this.textEl, close);
    this.column.appendChild(this.el); // below the narrator line (ui/narrator.ts)
  }
}
