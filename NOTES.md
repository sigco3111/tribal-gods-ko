# NOTES — 한글화 진행 기록

## 용어집
부족 tribe · 주민 villager · 주술사 leader/shaman · 방랑자 wanderer · 거처 dwelling · 선돌 standing stone · 본거지 원 home circle · 마나 · 충전 charge · 목재 wood · 불씨 Kindle · 폭발 Blast · 돌의 가호 Stone Ward · 둑길 Causeway/Landbridge.
문체: 해요체/명사형 UI, 안내문은 "~하세요/~합니다".

## 구조
- `src/i18n.ts` t()/josa()/tx(), `src/i18n-ui.ts` PAIRS(키: [영어, 한국어]), `src/i18n-catalog.ts` 카탈로그·축복 패치.
- 검사: `node tools/check-i18n.mjs`; 남은 영어: `node tools/list-strings.mjs`.
- 빌드: `tsc --noEmit && vite build`. perf.test.ts는 부하가 있으면 타이밍으로 실패할 수 있음(단독 실행 시 통과).

## 완료
메뉴·설정·HUD·알림·힌트·게임 방법·단축키·주문서·건설 메뉴·선택 패널·카탈로그(유닛/건물/주문/부족)·월드 호버·명령 단어·레벨 보관함·축복 9종.

## 남은 것(다음 차례)
- src/level/campaign/c01..c10 (장 이야기·목표·내레이터): c01 37, c02 27, c05 24, c08 23, c03 21, c07 21, c09 21, c10 20, c04 19, c06 19
- src/ui/objective-advice.ts 35 (내레이터 조언, 조사 조합 필요)
- (편집기 UI는 t() 적용 확인됨) src/level/level-format.ts 20, src/level/official-levels.ts 7
- src/campaign 장 제목/한줄 설명(CAMPAIGN title/tagline)
- 나머지 list-strings 항목(terrain/render/assets 등)은 대부분 코드 문자열(오탐)

## 배포 (중요)
- 이 저장소에서는 GitHub Actions가 한 번도 실행되지 않습니다(Actions 탭: "not currently enabled", 정책을 껐다 켜도 동일). `deploy.yml`은 그대로 두었습니다.
- 그래서 Pages는 **main 브랜치 /docs**에서 배포합니다. 갱신 절차: `tsc --noEmit && vite build` → `dist/index.html`, `dist/ui-preview.html`을 `docs/`에, `dist/assets/*`를 `docs/assets/`에 복사(옛 해시 파일은 삭제) → 웹 업로더로 폴더별 커밋.
- 웹 업로더가 파일명을 소문자로 바꾸므로 `vite.config.ts`에서 해시를 16진(`hashCharacters: 'hex'`)으로 고정했습니다. 청크 이름은 소문자만 쓸 것.
- Actions가 살아나면 Pages 소스를 "GitHub Actions"로 되돌리고 `docs/`의 빌드 결과물은 지워도 됩니다(`docs/hero.png`는 README 이미지).
