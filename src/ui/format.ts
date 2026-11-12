/**
 * ui/format.ts — numbers and states turned into words a player reads.
 *
 * Every panel formats time, rates and "what is this person doing?" the
 * same way because they all come through here. Pure functions (tested in
 * test/ui-format.test.ts).
 */

import { BUILDINGS, DWELLING_TIERS, spellDef, UNITS } from '../sim/catalog';
import type { Building, Unit } from '../sim/world-state';
import { t } from '../i18n';

/** 75 → "1:15", 3725 → "1:02:05". */
export function fmtClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return hh > 0 ? `${hh}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`;
}

/** A countdown: 4.2 → "5s", 95 → "1m 35s", Infinity → "—". */
export function fmtEta(seconds: number): string {
  if (!Number.isFinite(seconds)) return '—';
  const s = Math.max(0, Math.ceil(seconds));
  if (s < 60) return t('fmt.s', { n: s });
  const m = Math.floor(s / 60);
  return t('fmt.ms', { m, s: String(s % 60).padStart(2, '0') });
}

/** ETA that fits a spell slot: "45s", "2m 05s", then whole minutes from ten ("14m"). */
export function fmtEtaShort(seconds: number): string {
  if (Number.isFinite(seconds) && seconds >= 600) return `${Math.ceil(seconds / 60)}m`;
  return fmtEta(seconds);
}

/** Mana per second, one decimal: 1.53 → "+1.5/s". */
export function fmtRate(perSecond: number): string {
  return `+${(Math.round(perSecond * 10) / 10).toFixed(1)}/s`;
}

/** 1 → "1 tile", 4.5 → "4.5 tiles". */
export function fmtTiles(n: number): string {
  const v = Math.round(n * 10) / 10;
  return t(v === 1 ? 'fmt.tile' : 'fmt.tiles', { n: v });
}

/** 0 → "Instant", 2.5 → "2.5s". */
export function fmtSeconds(n: number): string {
  return n <= 0 ? t('fmt.instant') : t('fmt.s', { n: Math.round(n * 10) / 10 });
}

/** Player-facing name of a building (dwellings by their tier). */
export function buildingName(b: Pick<Building, 'kind' | 'tier'>): string {
  return b.kind === 'hut' ? DWELLING_TIERS[Math.max(0, Math.min(2, b.tier))].name : BUILDINGS[b.kind].name;
}

type ActivityUnit = Pick<
  Unit,
  'kind' | 'state' | 'task' | 'carrying' | 'castSpell' | 'garrison' | 'hidden' | 'pacified' | 'lifted' | 'hp'
>;

/**
 * "What is this person doing?" in a few words. `buildingKindOf` resolves
 * the building a garrisoned unit is inside (null if unknown).
 */
export function activityText(u: ActivityUnit, insideKind: string | null = null): string {
  if (u.hp <= 0) return t('act.fallen');
  if (u.lifted > 0) return t('act.lifted');
  if (u.pacified > 0) return t('act.pacified');
  if (u.castSpell) return u.state === 'working' ? t('act.cast', { spell: spellDef(u.castSpell).name }) : t('act.cast.go', { spell: spellDef(u.castSpell).name });
  if (u.garrison >= 0 || (u.hidden && u.state === 'inside')) {
    if (insideKind === 'shrine') return t('act.shrine');
    if (insideKind === 'tower') return t('act.tower');
    if (insideKind && BUILDINGS[insideKind as keyof typeof BUILDINGS]?.trains) return t('act.training');
    return t('act.home');
  }
  switch (u.task) {
    case 'chop':
      return u.state === 'working' ? t('act.chop') : t('act.chop.go');
    case 'deliverWood':
      return t('act.haul');
    case 'build':
      return u.state === 'working' ? t('act.build') : t('act.build.go');
    case 'goHome':
      return t('act.gohome');
    case 'train':
      return t('act.train.go');
    case 'attack':
      return u.state === 'fighting' ? t('act.fight') : t('act.charge');
    case 'attackBuilding':
      return u.state === 'fighting' ? t('act.wreck') : t('act.wreck.go');
    case 'worship':
      return u.state === 'working' ? t('act.commune') : t('act.commune.go');
    case 'garrison':
      return t('act.garrison.go');
    case 'chant':
      return t('act.chant');
    default:
      break;
  }
  if (u.state === 'fighting') return t('act.fight');
  if (u.state === 'moving') return u.carrying ? t('act.haul') : t('act.walk');
  if (u.kind === 'brave') return t('act.idle');
  if (u.kind === 'shaman') return t('act.ready');
  return UNITS[u.kind].sight > 0 ? t('act.guard') : t('act.wait');
}
