/**
 * i18n-catalog.ts — Korean names and blurbs for the game content (units, buildings, spells, tribes, difficulties).
 *
 * Imported FIRST by main.ts (and the UI preview): when the language is Korean it patches the exported catalog
 * objects in place, so every UI that reads `.name` / `.blurb` shows Korean without being touched. The headless sim
 * and its tests never import this file and stay English.
 *
 * Glossary: tribe 부족 · villager 주민 · leader (shaman) 주술사 · wanderer 방랑자 · dwelling 거처 · standing stone 선돌 ·
 * home circle 본거지 원 · mana 마나 · charge 충전 · wood 목재.
 */

import { CIVS, DIFFICULTIES } from './config';
import { BUILDINGS, DWELLING_TIERS, SPELLS, TRIBE_LABELS, UNITS } from './sim/catalog';
import { getLang } from './i18n';

/** kind → [name, blurb] */
export const UNIT_KO: Record<string, [string, string]> = {
  brave: ['주민', '나무를 베고, 나르고, 짓고, 가정을 이루고, 기도합니다. 부족 그 자체입니다.'],
  warrior: ['전사', '창과 가죽 방패. 닿을 수만 있다면 어떤 싸움도 이깁니다.'],
  firewarrior: ['불꽃투척병', '멀리서 불타는 송진을 던집니다. 건물에 불을 붙입니다. 약합니다.'],
  warden: ['수호병', '탑 방패와 돌망치. 느리지만 거의 죽지 않고 건물을 부수며, 주문 피해의 절반을 견딥니다.'],
  chanter: ['성가꾼', '맨손입니다. 성가를 들은 적은 싸움을 멈추고 시간이 지나면 편을 바꿉니다. 다른 성가꾼이 주문을 깨뜨릴 수 있습니다.'],
  shaman: ['주술사', '세상에서 당신의 유일한 목소리. 모든 주문을 쓰며, 죽어도 부족이 남아 있는 동안 본거지 원으로 돌아옵니다.'],
  wildman: ['방랑자', '어느 부족에도 속하지 않았습니다. 아직은.'],
};
export const BUILDING_KO: Record<string, [string, string]> = {
  hut: ['거처', '집은 주민을 낳고 마나를 공급합니다. 가득 찬 거처는 두 번에 걸쳐 더 큰 집으로 자랍니다.'],
  lumberyard: ['벌목장', '목재를 내려놓는 두 번째 장소. 근처에서 일하는 주민은 나무를 3분의 1 더 빨리 베고, 벤 자리에 다시 심습니다.'],
  warriorHut: ['전사 막사', '주민을 전사로 바꿉니다.'],
  fireHut: ['불꽃 막사', '주민을 불꽃투척병으로 바꿉니다.'],
  tower: ['망루', '전투 병력 두 명까지 주둔시킵니다. 꼭대기에서는 더 멀리 보고 더 강하게 때립니다.'],
  shrine: ['사당', '이곳에 보낸 주민은 일 대신 기도합니다. 한 명마다 충전 중인 모든 주문이 빨라집니다.'],
  wardenHall: ['수호병 전당', '주민을 수호병으로 바꿉니다.'],
  chantHall: ['성가의 전당', '주민을 성가꾼으로 바꿉니다.'],
};
export const DWELLING_KO = ['작은 거처', '거처', '큰 거처'];
/** spell id → [name, blurb] */
export const SPELL_KO: Record<string, [string, string]> = {
  blast: ['폭발', '구덩이를 파고 근처의 모두를 날려 버립니다.'],
  convert: ['불씨', '원 안의 방랑자가 당신의 부족이 됩니다.'],
  flatten: ['평탄화', '땅을 평평하게 고릅니다. 건물 지을 자리를 만들지만 언덕 방어선은 무너집니다.'],
  bloom: ['개화', '벤 나무가 즉시 되살아나고 새 나무가 돋으며, 원 안의 내 부족민이 치유됩니다.'],
  ward: ['돌의 가호', '원 안의 내 부족민과 건물이 한동안 받는 피해가 절반이 됩니다.'],
  lightning: ['번개', '번개 한 줄기. 맞은 것을 죽이고 두 곳으로 더 튀며 나무에 불을 붙입니다.'],
  warsong: ['전쟁가', '원 안의 내 전투 병력이 3분의 1 더 빨리 움직이고 공격합니다.'],
  swamp: ['늪', '걸어 들어온 모두를 삼키는 땅. 내 부족도 예외가 아닙니다.'],
  landbridge: ['둑길', '주술사에서 표시한 곳까지 물이나 골짜기를 가로지르는 땅길을 일으킵니다.'],
  cyclone: ['회오리', '떠돌며 사람들을 들어 올렸다 떨어뜨리고 지붕을 벗겨 내는 깔때기 바람.'],
  emberfall: ['불덩이 비', '불타는 돌이 원 위로 쏟아집니다. 숲과 마을에 불이 붙습니다.'],
  sink: ['침강', '원 안의 땅이 천천히, 영영 바다 밑으로 미끄러집니다.'],
  earthquake: ['지진', '선을 따라 땅이 갈라집니다. 그 위의 건물이 무너집니다.'],
  volcano: ['화산', '아무것도 없던 곳에 불의 산이 솟습니다. 영구적입니다.'],
};
/** civ id → [name, leaderTitle, blurb] */
export const CIV_KO: Record<string, [string, string, string]> = {
  forest: ['숲 부족', '숲의 속삭임꾼', '초가지붕과 토템, 나무의 말에 귀 기울이는 지도자.'],
  dynasty: ['강의 왕조', '신왕', '사암과 황금, 하늘에 닿는 왕관.'],
  north: ['북방인', '먼 곳을 보는 자', '가파른 통나무 회당과 성미 급한 날씨의 신들.'],
};
export const DIFF_KO: Record<string, string> = {
  easy: '느긋하고 졸린 신',
  normal: '팽팽한 대결',
  hard: '당신의 멸종을 꿈꾸는 신',
};

export const TRIBE_KO: Record<string, string> = { player: '나의 부족', red: '붉은 부족', gold: '황금 부족', violet: '보라 부족' };

export function localizeCatalog(): void {
  Object.assign(TRIBE_LABELS, TRIBE_KO);
  for (const [k, [name, blurb]] of Object.entries(UNIT_KO)) Object.assign((UNITS as any)[k], { name, blurb });
  for (const [k, [name, blurb]] of Object.entries(BUILDING_KO)) Object.assign((BUILDINGS as any)[k], { name, blurb });
  DWELLING_KO.forEach((name, i) => ((DWELLING_TIERS as any)[i].name = name));
  for (const s of SPELLS) {
    const ko = SPELL_KO[s.id];
    if (ko) [s.name, s.blurb] = ko;
  }
  for (const [k, [name, leaderTitle, blurb]] of Object.entries(CIV_KO)) Object.assign((CIVS as any)[k], { name, leaderTitle, blurb });
  for (const [k, label] of Object.entries(DIFF_KO)) (DIFFICULTIES as any)[k].label = label;
}

if (getLang() === 'ko') localizeCatalog();
