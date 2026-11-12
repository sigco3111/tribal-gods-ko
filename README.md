# 트라이벌 갓즈 (Tribal Gods) 한글화

작은 둥근 행성에서 부족을 키우고, 선돌에서 주문을 배우고, 땅 자체를 빚어 최대 세 명의 라이벌 신과 겨루는 브라우저 신 게임 **Tribal Gods**의 비공식 한국어 판입니다.

![둥근 작은 행성](docs/hero.png)

> **▶ [브라우저에서 바로 하기](https://sigco3111.github.io/tribal-gods-ko/)**
> UI 미리보기(WebGL 없이): [메뉴](https://sigco3111.github.io/tribal-gods-ko/ui-preview.html?state=menu) · [설정](https://sigco3111.github.io/tribal-gods-ko/ui-preview.html?state=settings) · [게임 방법](https://sigco3111.github.io/tribal-gods-ko/ui-preview.html?state=help) · [HUD](https://sigco3111.github.io/tribal-gods-ko/ui-preview.html?state=hud)

## 안내 (NOTICE)

- 원작: **Tribal Gods** — 제작자 **br3nt**, 원본 저장소 <https://github.com/br3nt/tribal-gods>
- 이 저장소는 원본 `ee1b85943f8a966d5b696e4a33bb4ceee0cf726a` (v0.3.0)를 기준으로 한 **비공식 한글화**이며, 원작자와 관계가 없고 승인받은 것도 아닙니다.
- 한글화 시점에 원본 저장소에는 라이선스 파일이 없었습니다. 그래서 이 저장소에도 **라이선스를 붙이지 않았고**, 별도의 사용 권리를 주장하지 않습니다. 원작자의 저작권은 원작자에게 있습니다.
- 권리자가 요청하면 이 저장소를 즉시 내리겠습니다.
- 원본 README는 이 저장소의 커밋 이력에서 볼 수 있습니다.

## 바뀐 점

- 모든 화면 문구를 한국어로 옮겼습니다: 메인 메뉴, 자유 대전 설정, 설정, 일시정지, HUD(상단 바·목표·건설·주문서·알림·미니맵·선돌·힌트), 게임 방법, 단축키, 유닛·건물·주문·종족·난이도 이름과 설명, 시뮬레이션이 만드는 안내 문구.
- `src/i18n.ts`, `src/i18n-ui.ts`, `src/i18n-catalog.ts`로 이루어진 번역 계층을 추가했습니다. 기본은 한국어이고, 메뉴나 설정에서 영어로 바꿀 수 있으며 `?lang=en` / `?lang=ko` 주소 값으로도 고를 수 있습니다. 시뮬레이션 코드와 헤드리스 테스트는 영어 그대로 동작합니다.
- 한국어 글꼴 목록(Pretendard, Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic)을 추가했습니다. 외부 글꼴·CDN·분석 요청은 없습니다.
- 조사(은/는, 이/가, 을/를, 과/와)를 받침에 맞게 붙이는 `josa()`를 넣었습니다.
- `vite.config.ts`의 `base`를 `/tribal-gods-ko/`로 바꾸고 `ui-preview.html`을 빌드에 포함했습니다.
- `tools/check-i18n.mjs`(번역 키 검사), `tools/list-strings.mjs`(남은 영어 문자열 목록), `test/ui-dom.test.ts`(한국어 화면에 영어 단어가 남지 않는지 확인)를 추가했습니다.

## 아직 번역하지 않은 부분

선택 패널·월드 호버·명령 안내·캠페인 힌트, 캠페인 장 이야기(`src/level/campaign/`)·축복(`boons.ts`)·캠페인 화면, 레벨 편집기·레벨 라이브러리는 아직 영어입니다. 자세한 개수는 [NOTES.md](NOTES.md)에 있습니다.

## 실행

```sh
npm ci
npm run dev          # 개발 서버
npm run build        # 타입 검사 + 빌드
npm run check:i18n   # 번역 키 검사
npm test             # Vitest (전체 약 2분)
```

Node 20 이상이 필요합니다. `main`에 푸시하면 GitHub Actions가 Pages로 배포합니다.

원본 `test/group-move.test.ts`의 한 항목("60 warriors ordered 88+ steps around a sea wall all arrive")은 한글화 전부터 실패합니다. 한글화와 관계없습니다.
