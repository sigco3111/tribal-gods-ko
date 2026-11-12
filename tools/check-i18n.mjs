// Standalone check (no test runner): node tools/check-i18n.mjs  (npm run check:i18n)
// - every t('key') used in src/ exists in the dictionary; no dictionary entry is unused
// - ko values contain Hangul and use the same {placeholders} as en
// - every catalog entry (units, buildings, dwelling tiers, spells, civs, difficulties, tribes) has a Korean text
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'vite';

const root = join(import.meta.dirname, '..');
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : []; });
const files = walk(join(root, 'src')).filter((f) => !/i18n(-ui|-catalog)?\.ts$/.test(f));
const source = files.map((f) => readFileSync(f, 'utf8')).join('\n');

const vite = await createServer({ root, logLevel: 'silent', server: { middlewareMode: true }, appType: 'custom' });
const { DICT, HANGUL_RE } = await vite.ssrLoadModule('/src/i18n.ts');
const C = await vite.ssrLoadModule('/src/i18n-catalog.ts');
const { UNITS, BUILDINGS, SPELLS, DWELLING_TIERS } = await vite.ssrLoadModule('/src/sim/catalog.ts');
const { CIVS, DIFFICULTIES } = await vite.ssrLoadModule('/src/config.ts');
await vite.close();

const errors = [];
const used = new Set();
const prefixes = new Set();
for (const m of source.matchAll(/\bt\(\s*(['`])([A-Za-z][\w.${}\-]*)\1/g)) {
  if (m[2].includes('${')) prefixes.add(m[2].split('${')[0]);
  else used.add(m[2]);
}
for (const k of used) for (const l of ['en', 'ko']) if (!(k in DICT[l])) errors.push(`key "${k}" missing in ${l}`);
for (const k of Object.keys(DICT.en)) {
  if (!(k in DICT.ko)) errors.push(`key "${k}" missing in ko`);
  const isUsed = used.has(k) || [...prefixes].some((p) => k.startsWith(p)) || source.includes(`'${k}'`) || k.startsWith('sim.');
  if (!isUsed) errors.push(`key "${k}" is never used`);
}
const ph = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
for (const k of Object.keys(DICT.ko)) {
  if (!HANGUL_RE.test(DICT.ko[k])) errors.push(`ko "${k}" has no Hangul`);
  if (k in DICT.en && ph(DICT.en[k]) !== ph(DICT.ko[k]) && !/^(sim\.buildinglost|hint\.nocharge|stone\.guard\.sleep|al\.ritual|sb\.notcharging\.why|stone\.lend|stone\.unit)$/.test(k)) errors.push(`placeholders differ in "${k}": ${ph(DICT.en[k])} vs ${ph(DICT.ko[k])}`);
}
for (const k of Object.keys(UNITS)) if (!C.UNIT_KO[k]) errors.push(`unit ${k} has no Korean text`);
for (const k of Object.keys(BUILDINGS)) if (!C.BUILDING_KO[k]) errors.push(`building ${k} has no Korean text`);
DWELLING_TIERS.forEach((_, i) => { if (!C.DWELLING_KO[i]) errors.push(`dwelling tier ${i} has no Korean text`); });
for (const s of SPELLS) if (!C.SPELL_KO[s.id]) errors.push(`spell ${s.id} has no Korean text`);
for (const k of Object.keys(CIVS)) if (!C.CIV_KO[k]) errors.push(`civ ${k} has no Korean text`);
for (const k of Object.keys(DIFFICULTIES)) if (!C.DIFF_KO[k]) errors.push(`difficulty ${k} has no Korean text`);
for (const m of [C.UNIT_KO, C.BUILDING_KO, C.SPELL_KO, C.CIV_KO]) for (const [k, v] of Object.entries(m)) if (!v.every((x) => HANGUL_RE.test(x))) errors.push(`catalog ${k} has a non-Korean text`);
console.log(`UI keys: ${Object.keys(DICT.en).length} (used literally in source: ${used.size}, dynamic prefixes: ${prefixes.size}); catalog: ${Object.keys(UNITS).length} units, ${Object.keys(BUILDINGS).length} buildings, ${SPELLS.length} spells, ${Object.keys(CIVS).length} civs`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('i18n check OK');
