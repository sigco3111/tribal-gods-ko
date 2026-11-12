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

## 남은 것(T2b)
- src/level/campaign/c06 19, c07 21, c08 23, c09 21, c10 20 (list-strings 기준; 장 제목·tagline·대사·목표·브리핑, 새 문장은 `src/i18n-story.ts`에 같은 방식으로 추가하고 `check-i18n.mjs`의 `/^c0[1-5]-/`를 `c`로 넓힐 것)
- src/level/level-format.ts 20, src/level/official-levels.ts 7
- src/ui/campaign-screens.ts 59 (장 지도 화면 "The Long Tide"/소개문/버튼, 브리핑의 시작 조건·"Begin"·failText, 결과 화면 시간/최고 기록/다음 장 버튼 등 크롬 문구), src/campaign/boons.ts 18(선택 UI 문구), src/ui/campaign.ts 2
- 나머지 list-strings 항목(terrain/render/assets 등)은 대부분 코드 문자열(오탐)
- 번역 이름/desc(`name`, `desc`, 부족 이름 `the Lantern-folk` 등)는 레벨 보관함/내부 표시용이라 아직 영어.

## 테스트 메모
- `test/group-move.test.ts`의 "60 warriors…" 타이밍(<30ms) 항목은 원본에서도, 느린 샌드박스에서는 한글화와 무관하게 31~34ms로 실패합니다. 나머지 전체 통과.

## 배포 (중요)
- 이 저장소에서는 GitHub Actions가 한 번도 실행되지 않습니다(Actions 탭: "not currently enabled", 정책을 껐다 켜도 동일). `deploy.yml`은 그대로 두었습니다.
- 그래서 Pages는 **main 브랜치 /docs**에서 배포합니다. 갱신 절차: `tsc --noEmit && vite build` → `dist/index.html`, `dist/ui-preview.html`을 `docs/`에, `dist/assets/*`를 `docs/assets/`에 복사(옛 해시 파일은 삭제) → 웹 업로더로 폴더별 커밋.
- 웹 업로더가 파일명을 소문자로 바꾸므로 `vite.config.ts`에서 해시를 16진(`hashCharacters: 'hex'`)으로 고정했습니다. 청크 이름은 소문자만 쓸 것.
- 웹 업로더는 파일명을 소문자로 바꾸고 앞의 `_`도 떼어 냅니다(`_ext.mjs`→`ext.mjs`). 그래서 `README.md`/`NOTES.md`는 업로드하지 말고 웹 편집기로 수정하세요(대소문자 유지). 업로드는 커밋당 폴더 하나.
- Actions가 살아나면 Pages 소스를 "GitHub Actions"로 되돌리고 `docs/`의 빌드 결과물은 지워도 됩니다(`docs/hero.png`는 README 이미지).
