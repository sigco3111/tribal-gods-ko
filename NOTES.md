# NOTES — 한글화 진행 기록

## 용어집
부족 tribe · 주민 villager · 주술사 leader/shaman · 방랑자 wanderer · 거처 dwelling · 선돌 standing stone · 본거지 원 home circle · 마나 · 충전 charge · 목재 wood · 불씨 Kindle · 폭발 Blast · 돌의 가호 Stone Ward · 둑길 Causeway/Landbridge.
문체: 해요체/명사형 UI, 안내문은 "~하세요/~합니다".

## 구조
- `src/i18n.ts` t()/josa()/tx(), `src/i18n-ui.ts` PAIRS(키: [영어, 한국어]), `src/i18n-catalog.ts` 카탈로그·축복 패치.
- 검사: `node tools/check-i18n.mjs`; 남은 영어: `node tools/list-strings.mjs`.
- 빌드: `tsc --noEmit && vite build`. (npm이 없으면 `node <npm-cli.js> ci`; jsdom 테스트는 `npm i --no-save jsdom`).

## 완료
메뉴·설정·HUD·알림·힌트·게임 방법·단축키·주문서·건설 메뉴·선택 패널·카탈로그(유닛/건물/주문/부족)·월드 호버·명령 단어·레벨 보관함·축복 9종.

## 완료 (T2a)
- 캠페인 1~5장(c01~c05)의 장 제목·한 줄 설명·배우는 것·내레이터 대사·목표·브리핑(본문/조언)·패배 문구 96줄: `src/i18n-story.ts`(키 `sim.cNN.MM`, 영어→한국어). 시뮬레이션/데이터는 영어 그대로 두고 UI에서 `tx()`로 번역(내레이터, 목표 패널, 브리핑, 결과 화면, 장 지도).
- `src/ui/objective-advice.ts` 내레이터 조언 35줄: `t('adv.*')`(i18n-ui.ts). 조사는 `josa()`, 영어(헤드리스 테스트)는 그대로.
- 브리핑/결과 화면의 `Chapter`·`Counsel`·`Objectives`·`Beware`·`Victory`·`Defeat` 라벨 번역.
- `tools/check-i18n.mjs`가 c01~c05의 모든 화면 문자열(`tools/campaign-strings.mjs`로 추출)에 한국어 항목이 있는지 검사. `test/ui-story-ko.test.ts`(jsdom 필요: `npm i --no-save jsdom`): tx 번역, adv 플레이스홀더, 1~5장 브리핑 DOM.
- 고유명사: 등불 부족(Lantern-folk) · 표류민(Unmoored) · 잿자국 부족(Ashmark) · 검은 해안(Black Strand) · 갈고리 섬(the Hook) · 리버홀름 · 투폴드 · 홀름 섬 · 흩어진 얕은 바다 · 칼데라. 선돌에 "kneel"은 "교감"으로 통일(기존 용어). 목표문은 "~하라/~해라", 대사는 "~합니다/~하세요".

## 완료 (T2b)
- 캠페인 6~10장(c06~c10)의 장 제목·한 줄 설명·배우는 것·내레이터 대사·목표·브리핑(본문/조언)을 `src/i18n-story.ts`에 추가(키 `sim.c06.01`~`sim.c10.NN`, 같은 방식). 중복 제목(장 제목=브리핑 제목)은 한 항목으로 합침: c06 12 · c07 13 · c08 15 · c09 14 · c10 11 (화면 문자열 70개, 제목 중복 포함 추출 기준 c06 13 · c07 14 · c08 16 · c09 15 · c10 12).
- `tools/check-i18n.mjs`: 검사 범위를 c01~c10 전체로 확대(166개 화면 문자열). `test/ui-story-ko.test.ts`: tx 번역과 브리핑 화면 DOM 검사를 1~10장으로 확대(브리핑의 일반 패배 조건 "✕ …" 줄은 campaign-screens.ts 몫이라 제외).
- 고유명사 추가: 소금 부족(Saltborn) · 산지기(Keepers) · 불뫼(Firemount) · 첫 불의 돌무덤(Cairn of First Fire) · 마지막 언덕(Last Hill) · 맨발의 길 · 두 깃발 · 불뫼 쟁탈전 · 밀물이 닥쳤을 때 · 왕관(The Crown) · 부채꼴 삼각주(the Fan) · 긴 협곡(Long Gorge) · 긴 밀물(Long Tide) · 못(mere) · 늪지(fen) · 여울(ford). 주문 이름은 카탈로그와 동일(늪=Mire, 침강=Undertow, 불덩이 비=Emberfall).

## 남은 것 (T3 이후)
- src/ui/campaign-screens.ts 59 (장 지도 화면 "The Long Tide"/소개문/버튼, 브리핑의 시작 조건·"Begin"·일반 패배 조건 "✕ Your leader must not fall…" 같은 failText, 결과 화면 시간/최고 기록/다음 장 버튼 등 크롬 문구)
- src/campaign/boons.ts 18(선택 UI 문구), src/ui/campaign.ts 2
- src/level/level-format.ts 20, src/level/official-levels.ts 7
- 번역 이름/desc(`name`, `desc`, 부족 이름 `the Lantern-folk` 등)는 레벨 보관함/내부 표시용이라 아직 영어.
- `tools/list-strings.mjs`의 c01~c10 파일 항목(37·27·21·19·24·19·21·23·21·20)은 영어 원문이 소스에 그대로 있어 계속 나오는 것이며 번역 누락이 아닙니다(누락 여부는 check-i18n.mjs가 확인). 나머지 항목(terrain/render/assets 등)은 대부분 코드 문자열(오탐).

## 테스트 메모
- `test/group-move.test.ts`의 "60 warriors…" 타이밍(<30ms) 항목은 원본에서도, 느린 샌드박스에서는 한글화와 무관하게 31~34ms로 실패합니다. 나머지 전체 통과.

## 배포 (중요)
- 이 저장소에서는 GitHub Actions가 한 번도 실행되지 않습니다(Actions 탭: "not currently enabled", 정책을 껐다 켜도 동일). `deploy.yml`은 그대로 두었습니다.
- 그래서 Pages는 **main 브랜치 /docs**에서 배포합니다. 갱신 절차: `tsc --noEmit && vite build` → `dist/index.html`, `dist/ui-preview.html`을 `docs/`에, `dist/assets/*`를 `docs/assets/`에 복사(옛 해시 파일은 삭제) → 웹 업로더로 폴더별 커밋.
- 정리 대기 중인 옛 빌드 파일(docs/assets, 현재 index.html이 참조하지 않음): `main-8e6a5304.js`, `menu-2426f15f.js`, `uipreview-348b336c.js` — 웹 UI는 삭제가 파일당 커밋 하나라 한 번에 최대 3개씩 지웁니다(다음 차례에 삭제). T2b에서 `main-17a16cf1`·`menu-fd6e1b0f`·`uipreview-fa9937a5`는 삭제했습니다.
- 커밋 대화상자(삭제·웹 편집기)는 영어 메시지가 미리 채워져 있으니 지우고 한국어 접두어(게임: / 문서: )로 바꾸고, 설명란이 비어 있는지 커밋 직전에 확인하세요.
- 웹 업로더가 파일명을 소문자로 바꾸므로 `vite.config.ts`에서 해시를 16진(`hashCharacters: 'hex'`)으로 고정했습니다. 청크 이름은 소문자만 쓸 것.
- 웹 업로더는 파일명을 소문자로 바꾸고 앞의 `_`도 떼어 냅니다(`_ext.mjs`→`ext.mjs`). 그래서 `README.md`/`NOTES.md`는 업로드하지 말고 웹 편집기로 수정하세요(대소문자 유지). 업로드는 커밋당 폴더 하나.
- Actions가 살아나면 Pages 소스를 "GitHub Actions"로 되돌리고 `docs/`의 빌드 결과물은 지워도 됩니다(`docs/hero.png`는 README 이미지).
