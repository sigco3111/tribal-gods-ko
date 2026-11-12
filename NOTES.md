# NOTES — 한글화 진행 기록

## 용어집
부족 tribe · 주민 villager · 주술사 leader/shaman · 방랑자 wanderer · 거처 dwelling · 선돌 standing stone · 본거지 원 home circle · 마나 · 충전 charge · 목재 wood · 불씨 Kindle · 폭발 Blast · 돌의 가호 Stone Ward · 둑길 Causeway/Landbridge.
문체: 해요체/명사형 UI, 안내문은 "~하세요/~합니다".

## 작업 환경 메모
- 샌드박스에는 npm이 없어 `curl https://registry.npmjs.org/npm/-/npm-10.9.2.tgz | tar xz` 후 `node package/bin/npm-cli.js ci`; 작업 사본은 `/tmp/tg`(저장소를 clone, git 푸시 자격 증명은 없음 → 변경 파일은 웹 업로더로 올림). 업로드 폴더: src, src/ui, src/level, tools, test, docs/assets, docs(커밋당 폴더 하나).

## 구조
- `src/i18n.ts` t()/josa()/tx(), `src/i18n-ui.ts` PAIRS(키: [영어, 한국어]), `src/i18n-catalog.ts` 카탈로그·축복 패치.
- 검사: `node tools/check-i18n.mjs`; 남은 영어: `node tools/list-strings.mjs`.
- 빌드: `tsc --noEmit && vite build`. (npm이 없으면 `node <npm-cli.js> ci`; jsdom 테스트는 `npm i --no-save jsdom`).

## 완료
메뉴·설정·HUD·알림·힌트·게임 방법·단축키·주문서·건설 메뉴·카탈로그(유닛/건물/주문/부족)·월드 호버·명령 단어·레벨 보관함·축복 9종.

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

## 완료 (T2c)
- `src/ui/campaign-screens.ts` 59줄 전부 `t('cs.*')`로 번역(`src/i18n-ui.ts` 끝, 키 47개): 장 지도("긴 밀물"·소개문·진행 수·최고 기록·잠김/열림/다음 길·은혜 표시), 브리핑(시작 조건 머리글 "사용할 주문/지을 수 있는 건물/함께하는 이들/이미 서 있는 건물/선돌이 주는 것/이곳의 다른 부족/지닌 은혜", 주문 충전·비용 표기, 선돌 대여/전수 문구, 동맹 표기, 패배 조건 "✕ …" 줄: 주술사 사망·제한 시간·건물 전멸·선돌 선점·"주민 10명이 죽으면 끝입니다"), 결과 화면(시간·최고 기록·은혜 고르기·캠페인 지도/다시 플레이/다시 도전/다음 장), 버튼(뒤로·시작·지도로 돌아가기).
- `src/ui/campaign.ts` 2줄(장 지도의 "받지 않음 — 다음 브리핑에서 고르세요"), `src/level/level-format.ts` 20줄(레벨 코드 가져오기 오류 `lf.*` 17개). 은혜(boons.ts 18줄)는 이전 라운드에 `BOON_KO`(i18n-catalog.ts)로 제자리 번역되어 있어 소스는 영어 원문 그대로이며 화면에서는 한국어입니다(검사 추가). 용어는 "은혜"(기존 `sb.boons`와 통일).
- 부족 이름(5)·공식 레벨 이름/설명(3+3)·캠페인 레벨 설명(10)은 `sim.tribe.*`/`sim.lvl.*`로 `src/i18n-story.ts` 끝에 추가하고, 표시 지점(브리핑 "이곳의 다른 부족", 선돌 정보 `tribeLabelOf`, 자동 저장 이름, 레벨 보관함 카드)에서 `tx()`를 거칩니다. 시뮬레이션의 영어 이름은 그대로 둡니다(레벨 이름이 난수 시드에 쓰이므로 바꾸면 안 됨). 캠페인 레벨 이름(10)은 장 제목과 같아 기존 항목으로 번역됩니다. 부족 이름: 등불 부족 · 표류민 · 잿자국 부족 · 소금 부족 · 산지기.
- 버그 수정: 레벨 보관함의 캠페인 카드 제목·한 줄 설명이 영어였음(`tx()` 누락).
- `tools/check-i18n.mjs`: 레벨/부족 이름·설명 31개와 은혜 9종의 한국어 항목, 그리고 campaign-screens/campaign/level-format에 영어 원문이 `el()`/`button()`/`Error()`에 직접 남지 않았는지 검사 추가. `test/ui-story-ko.test.ts`: 브리핑 사이드 패널·"✕" 줄·버튼, 장 지도, 결과 화면, `failText` 한국어 검사 추가.
- 빌드·검사: `tsc --noEmit`·`vite build`·`check-i18n.mjs` 통과, 테스트 47개 파일 통과(group-move 타이밍 항목은 이번에는 통과, 느린 샌드박스에서는 종종 불안정 — 무관).

- 배포(T2c): 소스 5개 커밋(src·src/ui·src/level·tools·test)과 docs/assets(8개)·docs(index/ui-preview) 커밋, 옛 파일 3개 삭제 후 사이트 전 파일 200, 삭제한 3개는 404, `ui-preview.html` 로드 확인, 배포된 번들에서 `cs.*`/`sim.tribe.*` 한국어 항목과 main 청크의 `cs.tomap` 호출 확인. 실제 WebGL 게임은 열지 않았습니다(ui-preview에서 "캠페인"을 누르면 게임이 시작되므로 거기서 캠페인 화면 확인 불가).

## 완료 (T2d)
- `src/ui/selection-panel.ts` 선택 패널 전부를 `t('sp.*')`로 번역(키 63개): 부족 라벨(나의 부족/부족 없음), 유닛 능력치 라벨(피해·사거리·방어·속도), 훈련 상태("{이름} 훈련 중 · 시간", "목재 N개가 더 필요합니다", "대기열이 비었어요"), 거처 성장("가득 차면 자라요", "자라려면 목재 N개가 더 필요해요", 성장 설명), 주둔/기도 안내, 집결지·철거(두 번 눌러 확인), 선돌(전수/대여 설명, 의식 진행 "방해받는 중"), 주술사·주민·방랑자·수호자·적 부족 안내문. 돌의 가호/전쟁가/불씨는 주문 이름(`spellDef().name`)을 그대로 사용. 도움말 문장은 해요체.
- `src/ui/editor.ts` 레벨 편집기 전부를 `t('ed.*')`로 번역(키 38개): 도구(올리기·내리기·평탄화·나무·방랑자·선돌·본거지·지우개)와 툴팁, 선돌 종류("가르침"/"2회 대여"), 적 부족 이름(붉은/황금/보라 적 부족), 입력란 자리표시자(레벨 이름/작성자), 저장·코드 복사·테스트·나가기, 상태 메시지, 기본 레벨 이름 "이름 없는 행성"·작성자 "익명의 신", 코드 복사 실패 시 `prompt`는 보관함과 같은 `lib.copyprompt`. 사용자가 저장한 레벨 이름은 데이터라 그대로.
- `src/ui/level-library.ts` 기본 작성자 "Tribal Gods"는 `lib.author.default`("트라이벌 갓즈"). 조사는 `josa()`(영어에서는 빈 문자열), 지역 변수 `t`가 `t()`를 가리지 않도록 이름 변경.
- `tools/check-i18n.mjs`: selection-panel.ts와 editor.ts의 문자열 리터럴(CSS·클래스 이름·셀렉터 제외)을 TypeScript AST로 훑어 `t()`를 거치지 않은 영어가 남으면 실패.
- 그대로 둔 것(플레이어에게 보이지 않음): `hotkeys.ts`의 그룹 이름('Camera' 등)은 내부 식별자이며 도움말 화면에서 `t('hk.group.*')`로 번역됨; `level-library.ts`의 `<select>` 값(보이는 글자는 번역됨)은 내부 값; `main.ts`의 `console.warn` 두 줄은 개발자 콘솔 전용.
- 빌드·검사: `tsc --noEmit`·`vite build`·`check-i18n.mjs` 통과, 테스트 44개 파일 통과(3개 건너뜀 — jsdom 필요), `group-move`의 "60 warriors" 타이밍 항목만 이 샌드박스에서 실패(무관).
- 배포(T2d): 소스 커밋 4개(src/ui·src·tools·docs/assets)+docs(index/ui-preview)+옛 파일 3개 삭제. 사이트 전 파일 200, 삭제한 3개는 404, `ui-preview.html` 로드 확인, 배포된 번들이 로컬 dist와 바이트 단위로 같고 `sp.*`/`ed.*` 한국어 항목과 호출이 번들에 있음. 실제 WebGL 게임은 열지 않았습니다.

## 남은 영어 (T2d 마지막 점검: `node tools/list-strings.mjs`)
플레이어에게 보이는 영어는 없습니다. 남은 것은 모두 개발자 전용/내부 값입니다:
- `src/ui/debug-overlay.ts`(F3 디버그 표시, 숨김), `src/main.ts`의 `console.warn` 두 줄, `hotkeys.ts` 그룹 식별자와 키 이름(Esc/Space/Ctrl/Shift/Del — 키 표기).
- `src/ui/level-library.ts` `<select>`의 내부 값(Newest/Name/Rating/Official …), `src/ui/menu.ts`의 "English" 언어 이름·"Tribal Gods" 제목 글자(고유명).
- 시뮬레이션 원문: `src/sim/*`(rules/objectives/world-state/catalog)·`src/config.ts`·`src/level/campaign/c01~c10`·`src/campaign/boons.ts`·`src/level/official-levels.ts`의 영어는 헤드리스 원문이며 `tx()`/`localizeCatalog()`/사전이 화면에서 번역합니다(누락 아님).
- 코드 문자열 오탐: CSS, SVG, DOM 클래스, 렌더/지형/자산 파일.

## 테스트 메모
- `test/group-move.test.ts`의 "60 warriors…" 타이밍(<30ms) 항목은 원본에서도, 느린 샌드박스에서는 한글화와 무관하게 31~34ms로 실패합니다. 나머지 전체 통과.

## 배포 (중요)
- 이 저장소에서는 GitHub Actions가 한 번도 실행되지 않습니다(Actions 탭: "not currently enabled", 정책을 껐다 켜도 동일). `deploy.yml`은 그대로 두었습니다.
- 그래서 Pages는 **main 브랜치 /docs**에서 배포합니다. 갱신 절차: `tsc --noEmit && vite build` → `dist/index.html`, `dist/ui-preview.html`을 `docs/`에, `dist/assets/*`를 `docs/assets/`에 복사(옛 해시 파일은 삭제) → 웹 업로더로 폴더별 커밋.
- 정리 대기 중인 옛 빌드 파일(docs/assets, 현재 index.html이 참조하지 않음) — 웹 UI는 삭제가 파일당 커밋 하나라 한 번에 최대 3개씩 지웁니다. 지금까지 삭제: T2b main-17a16cf1·menu-fd6e1b0f·uipreview-fa9937a5, T2c main-8e6a5304·menu-2426f15f·uipreview-348b336c, T2d main-cfa366fd·menu-4b634f6c·uipreview-cbe8af7c. 현재 남은 옛 파일(다음 차례에 3개씩 삭제): `gallery-4ac27484.js`, `heightmap-5e351e19.js`, `official-levels-30825e2a.js`, `unit-renderer-1dcf015d.js`, `world-state-f6d43ca7.js`(T2c 빌드), 그리고 T2d 빌드로 새로 옛 파일이 된 `main-e6553d46.js`, `menu-7d6bb0b9.js`, `uipreview-1721b74d.js`, `gallery-558af3e2.js`, `heightmap-02d70116.js`, `official-levels-bcbfbcdf.js`, `unit-renderer-1458c4ea.js`, `world-state-d956a088.js`. (현재 빌드: main-b16fdde0, menu-09f621d3, uipreview-e90bc45a, gallery-ce58b423, heightmap-605bb05b, official-levels-40278b17, unit-renderer-f00e67ef, world-state-52c985c8; three-*와 menu-f99f8bff.css는 변함없음.)
- 커밋 대화상자(삭제·웹 편집기)는 영어 메시지가 미리 채워져 있으니 지우고 한국어 접두어(게임: / 문서: )로 바꾸고, 설명란이 비어 있는지 커밋 직전에 확인하세요.
- 웹 업로더가 파일명을 소문자로 바꾸므로 `vite.config.ts`에서 해시를 16진(`hashCharacters: 'hex'`)으로 고정했습니다. 청크 이름은 소문자만 쓸 것.
- 웹 업로더는 파일명을 소문자로 바꾸고 앞의 `_`도 떼어 냅니다(`_ext.mjs`→`ext.mjs`). 그래서 `README.md`/`NOTES.md`는 업로드하지 말고 웹 편집기로 수정하세요(대소문자 유지). 업로드는 커밋당 폴더 하나.
- Actions가 살아나면 Pages 소스를 "GitHub Actions"로 되돌리고 `docs/`의 빌드 결과물은 지워도 됩니다(`docs/hero.png`는 README 이미지).
