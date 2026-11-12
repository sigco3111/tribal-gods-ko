/**
 * ui/objective-advice.ts — "how do I do THAT?" for the objective in front of you.
 *
 * In a campaign chapter the story (narrator lines, objectives chained with
 * `after`) already says WHAT to do next; generic onboarding chips ("Build a
 * Dwelling") would argue with it. So in a guided scenario the hint chip is
 * derived from the current active objective instead, and says HOW, with
 * the real key — and, like every hint, only asks for what is possible now:
 * a spell still gathering power says so rather than "press J".
 *
 * Pure strings from data (World is only read), so it is unit-tested.
 */

import { BUILDINGS, Objective, spellDef, SpellId } from '../sim/catalog';
import type { World } from '../sim/world-state';
import { josa, t, tx } from '../i18n';
import { ActionId, labelFor, orderVerb } from './hotkeys';

const k = (a: ActionId) => {
  const l = labelFor(a);
  return l ? ` <span class="kbd">${l}</span>` : '';
};

/** A scenario that tells its own story (scripted events): generic onboarding hints stand aside. */
export function isGuided(world: World): boolean {
  return (world.rules.events?.length ?? 0) > 0;
}

/**
 * The objective the player should be working on: of the active, unfinished,
 * required ones, the one that became active MOST RECENTLY (the story moves
 * forward; it is what the narrator is talking about), the earliest-listed
 * among those that activated together. `activatedAt` (index → sim seconds)
 * is kept by the caller; without it, the first open one.
 */
export function currentObjective(world: World, activatedAt?: ReadonlyMap<number, number>): { index: number; objective: Objective; text: string } | null {
  const open = world.objectives
    .map((o, index) => ({ o, index }))
    .filter(({ o }) => o.active !== false && !o.done && !o.failed);
  const required = open.filter(({ o }) => !o.optional);
  const when = (i: number) => activatedAt?.get(i) ?? 0;
  const pick = required.reduce<(typeof required)[number] | undefined>((best, c) => (!best || when(c.index) > when(best.index) ? c : best), undefined) ?? open[0];
  return pick ? { index: pick.index, objective: pick.o.objective, text: pick.o.text } : null;
}

function spellAdvice(world: World, spell: SpellId, where: string): string {
  const def = spellDef(spell);
  const s = world.spellState('player', spell);
  const name = def.name;
  if (!s.known && s.gifted === 0) return t('adv.notyours', { name, p: josa(name, '은/는') });
  if (!world.leaderOf('player')) return t('adv.leaderaway', { name, p: josa(name, '을/를') });
  if (s.charges + s.gifted === 0) {
    if (!s.charging) return t('adv.notcharging', { name, p: josa(name, '은/는') });
    const eta = Number.isFinite(s.eta) ? t('adv.eta', { n: Math.ceil(s.eta) }) : '';
    return t('adv.gathering', { name, p: josa(name, '은/는'), eta, k: k(`spell:${spell}`), where });
  }
  return t('adv.pick', { name, k: k(`spell:${spell}`), where });
}

/**
 * Foes expected but none ashore yet: if a stone is open to you, the story
 * (and this chip) points at it — the lull is for kneeling there; else hold.
 */
function quietAdvice(world: World, click: string): string {
  if (world.landings.length) return t('adv.q.boats');
  const kneeling = world.monuments.find((m) => m.communing && m.communer === 'player');
  if (kneeling) return t('adv.q.kneeling', { name: spellDef(kneeling.spell).name });
  const open = world.monuments.find((m) => world.monumentAvailable(m) && !(m.mode === 'teach' && m.claimedBy !== null) && !world.tribes.player?.known.has(m.spell));
  if (open && world.leaderOf('player')) {
    return t('adv.q.use', { k: k('select-leader'), click, name: spellDef(open.spell).name });
  }
  return t('adv.q.none');
}

/** The leader is dead and returning: say so (never "select your leader" when there is none). */
function leaderAway(world: World, then: string): string {
  const back = world.tribeSummary('player').leaderRespawn;
  return t('adv.fallen', { in: back > 0 ? t('adv.in', { n: Math.ceil(back) }) : '', then: t(then) });
}

/** Strongest first: what to hit a host with when the leader holds it. */
const STRIKES: SpellId[] = ['volcano', 'emberfall', 'earthquake', 'lightning', 'blast'];

/** Foes in sight: name the strongest spell in hand (a stone's gift first), then the fighters. */
function strikeAdvice(world: World, click: string): string {
  const key = labelFor('select-army') || ',';
  const ready = world.leaderOf('player') && STRIKES.find((id) => {
    const s = world.spellState('player', id);
    return s.gifted > 0 || (s.known && s.charges > 0);
  });
  if (!ready) return t('adv.strike.fight', { key, click });
  return t('adv.strike.spell', { name: spellDef(ready).name, k: k(`spell:${ready}`), key, click });
}

/** The chip's text (HTML) for an objective, or null when there's nothing useful to add. */
export function objectiveAdvice(world: World, o: Objective, leftClickOrders: boolean): string | null {
  const click = orderVerb(leftClickOrders);
  switch (o.type) {
    case 'castSpell':
      return spellAdvice(world, o.spell, o.x !== undefined ? t('adv.w.marked') : t('adv.w.world'));
    case 'chargeSpell':
      return t((o.charges ?? 1) === 1 ? 'adv.charge.one' : 'adv.charge.many', { name: spellDef(o.spell).name, p: josa(spellDef(o.spell).name, '을/를'), n: o.charges ?? 1 });
    case 'convertWanderers':
      return spellAdvice(world, 'convert', t('adv.w.kindle'));
    case 'buildCount': {
      const st = world.buildState('player', o.kind);
      const name = BUILDINGS[o.kind].name;
      if (!st.allowed) return null;
      if (!st.unlocked || !st.affordable) return t('adv.build.wait', { name, why: st.reason ? tx(st.reason) : t('adv.notyet') });
      return t('adv.build.pick', { name, k: k(`build:${o.kind}`) });
    }
    case 'reachPopulation':
      return t('adv.grow', { k: k('build:hut') });
    case 'claimMonument': {
      const m = world.monuments[o.index];
      if (!world.leaderOf('player')) return leaderAway(world, 'adv.then.stone');
      const name = m ? `${spellDef(m.spell).name} ` : '';
      const c2 = { name, click };
      const pct = (p: number | undefined) => `${Math.round((p ?? 0) * 100)}%`;
      if (m?.communing && m.communer === 'player') {
        return m.contested
          ? t('adv.claim.held', { pct: pct(m.communeProgress) })
          : t('adv.claim.kneeling', { name, pct: pct(m.communeProgress) });
      }
      if (m && (m.communeProgress ?? 0) > 0.02 && m.communer !== 'player') {
        return t('adv.claim.broke', { ...c2, pct: pct(m.communeProgress), k: k('select-leader') });
      }
      const l = world.leaderOf('player')!;
      if (l.hp < l.maxHp * 0.6) {
        const bloom = world.spellState('player', 'bloom');
        const heal = bloom.gifted > 0 || (bloom.known && bloom.charges > 0) ? t('adv.claim.heal', { bloom: spellDef('bloom').name, k: k('spell:bloom') }) : '';
        return t('adv.claim.wounded', { ...c2, hp: Math.round((l.hp / l.maxHp) * 100), heal, k: k('select-leader') });
      }
      return t('adv.claim.go', { ...c2, k: k('select-leader') });
    }
    case 'leaderReach':
      if (!world.leaderOf('player')) return leaderAway(world, 'adv.then.walk');
      return t('adv.reach', { k: k('select-leader'), click });
    case 'rescueStranded': {
      const cb = world.spellState('player', 'landbridge');
      if (cb.known || cb.gifted > 0) return spellAdvice(world, 'landbridge', t('adv.w.rescue'));
      return t('adv.stranded');
    }
    case 'holdPoint':
      return t('adv.hold');
    case 'killUnits':
      if (!world.units.some((u) => u.tribe === o.tribe && !u.hidden)) return quietAdvice(world, click);
      return strikeAdvice(world, click);
    case 'destroyTribe':
    case 'destroyAll':
      return t('adv.strike.fight', { key: labelFor('select-army') || ',', click });
    default:
      return null;
  }
}
