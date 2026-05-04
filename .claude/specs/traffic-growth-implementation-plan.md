# 사용자 유입 증대 실행 계획서

> **목적**: STR-2026-05-04 보고서 권고안의 실제 코드 작업 진행 상황을 추적
> **작성일**: 2026-05-04
> **연관 문서**:
>
> - 시장 조사: `.claude/research/reports/MI-2026-05-04-poke-korea-traffic-growth.md`
> - 경쟁력 분석: `.claude/research/reports/BA-2026-05-04-poke-korea-competitiveness.md`
> - 실행 전략: `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` (v3)
> - 지표 기준값: `.claude/specs/metrics-baseline.md`

---

## 진행 상황 요약

| 단계 | 항목 수 | 완료 | 진행 중 | 대기 |
| ---- | ------- | ---- | ------- | ---- |
| A. 즉시 실행 (1일 이내) | 5 | 4 | 0 | 1 |
| B. 메타 다양화 (1~3일) | 3 | 1 | 0 | 1 (B-3 스킵, B-2 대기) |
| C. 프론트 UI/구조 (3~7일) | 5 | 0 | 0 | 5 |
| D. 프론트 데이터 검토 (1~2주) | 1 | 0 | 0 | 1 |
| E. 백엔드 협업 (2~4주) | 3 | 0 | 0 | 3 |
| F. 운영/외부 (1~3개월) | 2 | 0 | 0 | 2 |
| G. 보류 | 1 | — | — | — |
| **합계** | **20** | **5** | **0** | **14** |

> 마지막 갱신: 2026-05-05 (B-1 완료, B-3 스킵 결정)

---

## 단계 A — 즉시 실행 (1일 이내, 프론트 단독)

> 모두 코드 1줄~수 줄 변경. 동일한 1차 PR로 묶어 처리 권장.

### A-1. layout.tsx 기본 description 폴백 교체 ✅

- **상태**: ✅ 완료 (2026-05-05, `feature/1.39.0-meta-optimization`)
- **파일**: `src/app/layout.tsx`
- **변경 결과**: "한국어 포켓몬 도감과 타입 상성 계산기, 기술·특성 도구를 무료로 제공하는 포켓몬 백과사전." (47자, 80자 이내, 핵심 키워드 앞배치)
- **공수**: 5분
- **백엔드**: ❌ 불필요
- **연관**: STR QW-1 (4번 항목)

### A-2. homeMetadata.ts description 80자 압축 ✅

- **상태**: ✅ 완료 (2026-05-05, `feature/1.39.0-meta-optimization`)
- **파일**: `src/app/_metadata/homeMetadata.ts`
- **변경 결과**: "한국어 포켓몬 도감 1025마리, 타입 상성 계산기, 기술·특성 도감, 매일 포켓몬 퀴즈. 무료 포켓몬 백과사전." (56자, 80자 이내, 한국어 포켓몬 도감 앞배치). description / openGraph.description / twitter.description 3곳 모두 동기화
- **공수**: 10분
- **백엔드**: ❌ 불필요
- **연관**: STR QW-1

### A-3. typeEffectivenessMetadata.ts description 재작성 ✅

- **상태**: ✅ 완료 (2026-05-05, `feature/1.39.0-meta-optimization`)
- **파일**: `src/app/type-effectiveness/_metadata/typeEffectivenessMetadata.ts`
- **변경 결과**: 130자 → "포켓몬 타입 상성 계산기. 공격·방어 타입을 선택하면 2배·0.5배 데미지 배율을 즉시 확인할 수 있는 한국어 무료 도구." (66자, 80자 이내, "포켓몬 타입 상성 계산기" 키워드 맨 앞)
- **공수**: 15분
- **백엔드**: ❌ 불필요
- **연관**: STR QW-1, 네이버 SC 데이터 — /type-effectiveness 노출 7,431/CTR 2.0%

### A-4. 사이트맵 챔피언스 priority 0.7 → 0.8 상향 ✅

- **상태**: ✅ 완료 (2026-05-05, `feature/1.39.0-meta-optimization`)
- **파일**: `src/app/sitemap.ts:366-374`
- **변경 결과**: `championsDetailPages`의 `priority: 0.7` → `priority: 0.8`. 주석에 모바일 출시 대비 의도 명시
- **공수**: 5분
- **백엔드**: ❌ 불필요
- **연관**: STR ST-1 (v3) 항목 2

### A-5. 구글/네이버 SC 인덱싱 요청

- **상태**: 🔲 대기 (**프로덕션 배포 후** 진행)
- **작업**: 코드 변경 없음. 사용자가 SC 콘솔에서 수동으로 진행
- **선행 조건**:
  1. `feature/1.39.0-meta-optimization` PR 머지 (→ `feature/1.39.0`)
  2. `feature/1.39.0` → `main` 릴리즈 PR 머지
  3. main → 프로덕션 배포 완료 + 캐시 무효화 확인
  4. 배포된 페이지의 메타 태그가 실제로 변경되었는지 검증 (예: `curl -s https://poke-korea.com/type-effectiveness | grep description`)
- **대상**: 홈, /type-effectiveness, /champions/list, /champions/list/{인기 포켓몬 5~10개}
- **공수**: 15분
- **백엔드**: ❌ 불필요

> **Why 프로덕션 배포 후?**: PR 머지만으로는 `feature/1.39.0` 브랜치에만 변경이 반영되고 프로덕션은 그대로다. 이 시점에 SC가 크롤링하면 변경 전 description을 다시 인덱싱하므로 인덱싱 요청 자체가 무의미하다. 실제 사용자가 보는 페이지(프로덕션)에 변경이 반영된 후에 요청해야 효과가 있다.

---

## 단계 B — 메타 다양화 (1~3일, 프론트 단독)

### B-1. generateChampionsDetailMetadata.ts description/title 다양화 ⭐ ✅

- **상태**: ✅ 완료 (2026-05-05, `feature/1.39.0-champions-meta`)
- **파일**: `src/app/champions/list/[pokemonId]/_metadata/generateChampionsDetailMetadata.ts`
- **변경 결과**:
  - title: `{name} ({region|formName})? 챔피언스 도감 - 스탯·기술·특성 | 포케코리아` — 폼/리전이 있을 때 괄호로 명시
  - description: 메타 데이터(topMoves, topAbilities)가 있으면 활용, 없으면 스탯 상위 2개로 폴백. 모든 케이스 80자 이내 (최장 케이스 68자)
- **활용 필드**: `name`, `formName`, `region`, `types`, `stats`, `meta.topMoves`, `meta.topAbilities`
- **명시적으로 제외**:
  - `meta.tier`: 공식 티어가 아닌 내부 분류 → description에 명시 시 사용자 오인 가능 (사용자 결정)
  - 메가/거다이맥스 키워드: `ChampionsFormType` enum에 BASE/NORMAL/REGION만 정의 → 챔피언스 데이터에 메가/거다이맥스가 존재하지 않으므로 description에 등장할 일 없음
- **공수**: 약 1시간 (설계 + 구현 + 길이 시뮬레이션 검증)
- **백엔드**: ❌ 불필요 (기존 API 필드 재활용)
- **연관**: STR ST-1 (v3) 핵심 항목

### B-2. /detail 메타 폼별 description 강화

- **상태**: 🔲 대기
- **파일**:
  - `src/module/generateDetailSeoMetaData.ts` (`getSeoDescription` 함수)
  - `src/app/detail/[pokemonId]/(form)/modules/generateMetadata.ts`
- **현재 상태**: 폼별 분기 처리는 되어 있으나 description 다양화 폭은 추가 분석 필요
- **개선 방향**: 메가진화/리전폼/거다이맥스/이로치 description에 폼 특성 자연어 추가. 예 — "{포켓몬명} (메가진화) - 한국어 도감. 타입, 스탯, 기술, 특성 정보를 확인하세요."
- **검증 대상 페이지** (네이버 SC 실측):
  - /detail/902 (대쓰여너): 노출 7,959/CTR 2.4%
  - /detail/952/mega: 노출 2,192/CTR 1.9%
  - /detail/768/mega: CTR 7.4% (양호 — 패턴 분석)
- **공수**: 3~5시간
- **백엔드**: ❌ 불필요
- **연관**: STR QW-3

### B-3. championsMetadata.ts (홈/도감/티어) description ⏭️ 스킵

- **상태**: ⏭️ 스킵 (2026-05-05 결정)
- **파일**: `src/app/champions/_metadata/championsMetadata.ts`
- **스킵 결정 이유**:
  1. 기존 description 3개(홈/도감/티어) 모두 60~70자로 이미 네이버 80자 가이드라인 충족
  2. "포켓몬 챔피언스" 키워드 이미 앞배치되어 있음
  3. 원래 권고했던 "챔피언스 모바일" / "WCS 2026" 키워드는 사용자 결정으로 제외 (실제 페이지 콘텐츠 내 해당 정보가 명확히 다뤄지지 않으므로 description과 콘텐츠 불일치 위험)
  4. 변경 근거가 사라진 상태에서 무리한 변경은 SEO 효과 없이 변경 이력만 늘림
- **재검토 시점**: 챔피언스 모바일 정식 출시(2026 여름) 이후 페이지 콘텐츠가 모바일 정보까지 다룰 때 재검토
- **연관**: STR QW-1, ST-1 (B-3은 STR 보고서에서 권고했으나 본 작업에서는 스킵)

---

## 단계 C — 프론트 UI/구조 (3~7일)

### C-1. TypeResultChip을 클릭 가능한 Link로 변경

- **상태**: 🔲 대기
- **파일**:
  - `src/container/desktop/typeEffectiveness/typeEffectiveness.result/result.list/components/TypeResultChip.components.tsx`
  - `src/container/mobile/typeEffectiveness/typeEffectiveness.result/result.list/components/TypeResultChip.components.tsx`
- **현재 문제**: `<span>` 요소로 클릭 불가 (BA W2, 병목 4)
- **개선**: Next `<Link>`로 변경, `/list?type={typeValue}` 또는 `/list?type={typeValue}&filter=...` 연결
- **공수**: 1일
- **백엔드**: ❌ 불필요
- **연관**: STR QW-2 핵심

### C-2. /type-effectiveness 결과 하단 크로스링크 CTA 컴포넌트 추가

- **상태**: 🔲 대기
- **파일**:
  - `src/container/desktop/typeEffectiveness/typeEffectiveness.result/TypeEffectivenessResult.component.tsx`
  - `src/container/mobile/typeEffectiveness/typeEffectiveness.result/TypeEffectivenessResult.component.tsx`
  - 신규 컴포넌트: `TypeRelatedLinksSection`
- **변경**: 결과 영역 하단에 "해당 타입 포켓몬 보기 →", "챔피언스 도감에서 확인 →" CTA 카드
- **공수**: 1~2일
- **백엔드**: ❌ 불필요
- **연관**: STR QW-2

### C-3. 메인 페이지 → 챔피언스 상세 인입 링크 추가

- **상태**: 🔲 대기
- **파일**:
  - `src/views/desktop/home/`, `src/views/mobile/home/` (홈 챔피언스 카드 영역)
  - `/list` 포켓몬 카드 (보조 링크 — UI 영향 검토 후 적용)
- **변경**: 홈 챔피언스 카드에서 개별 포켓몬으로 이동 강화. /list 카드에 "챔피언스 정보 보기" 보조 링크 검토
- **공수**: 1일
- **백엔드**: ❌ 불필요
- **연관**: STR ST-1 (v3) 항목 4

### C-4. 퀴즈 가시성 개선 (type-effectiveness, champions 페이지에 배너)

- **상태**: 🔲 대기
- **파일**:
  - `src/views/desktop/typeEffectiveness/`, `src/views/mobile/typeEffectiveness/` 하단
  - `src/views/desktop/champions/`, `src/views/mobile/champions/`
- **변경**: 퀴즈 카드 컴포넌트를 상위 트래픽 페이지에 인라인 배너로 추가. /champions/tier에 "마지막 업데이트: {date}" 신선도 표시
- **근거**: 네이버 SC에서 `/quiz/type-effectiveness` CTR 22.2% — 퀴즈 자산이 매우 강력
- **공수**: 1~2일
- **백엔드**: ❌ 불필요
- **연관**: STR MT-3

### C-5. 메가진화 일람 페이지 신설 (단계 D → C 상향, 백엔드 불필요 확인됨)

- **상태**: 🔲 대기
- **파일**:
  - 신규: `src/app/mega-evolution/page.tsx` 또는 `/list?isMegaEvolution=true` 경로 처리
  - 신규 또는 기존 확장: `src/views/desktop/megaEvolution/`, `src/views/mobile/megaEvolution/`
- **API 확인됨 (2026-05-04)**: `PokemonFilterInput.isMegaEvolution: Boolean` 필터 존재 (`src/graphql/schema.graphql:444`)
- **변경**: 메가진화 가능 포켓몬 전체 목록 페이지. 각 카드에서 `/detail/{id}/mega` 링크
- **메타데이터**: "메가진화 포켓몬 일람 | 한국어 도감 - 모든 메가진화 포켓몬 정리"
- **사이트맵**: 신규 URL 등록
- **공수**: 1~2일
- **백엔드**: ❌ 불필요 (`isMegaEvolution` 필터 활용)
- **연관**: STR MT-4 (네이버 메가진화 키워드 강세 대응)

---

## 단계 D — 프론트 데이터 검토 (1~2주)

### D-1. 이로치 URL 정적 경로 분리 검토 + 마이그레이션

- **상태**: 🔲 대기
- **현재**: `/detail/{id}?shinyMode=shiny` 쿼리 파라미터
- **검토 사항**:
  - 현재 canonical 처리 상태 확인
  - 정적 경로(`/detail/{id}/shiny`) 마이그레이션의 SEO 영향
  - 기존 노출(예: /detail/908 노출 1,990) 손실 위험
- **변경 시**: 301 리다이렉트 또는 canonical로 정적 경로 지정
- **공수**: 1~2주 (분석 + 단계적 적용)
- **백엔드**: ❌ 불필요
- **위험도**: 중간 (잘못된 canonical 시 SEO 자산 훼손 위험)
- **연관**: STR MT-5

---

## 단계 E — 백엔드 협업 필요 (2~4주)

### E-1. Z-A 포켓덱스 페이지/필터 SEO 강화

- **상태**: 🔲 대기 (백엔드 분류 데이터 필요)
- **백엔드 작업**: Z-A 등장 포켓몬 분류 필드 추가 (`PokemonFilterInput.game: GameVersion` 등)
- **프론트 작업**: `/list?game=za` 또는 `/za/list` 페이지 + 메타데이터
- **공수**: 백엔드 일정 의존
- **연관**: STR MT-2

### E-2. 챔피언스 기술 상세 섹션 확장

- **상태**: 🔲 대기 (API 확장 필요)
- **백엔드 작업**: `getChampionsPokemonDetail` 응답에 기술 목록 필드 추가 (현재 `abilities`만 있음)
- **프론트 작업**: `ChampionsDetailContainer`에 기술 섹션 추가, 또는 별도 `/champions/moves` 페이지
- **공수**: 백엔드 일정 의존 (별도 협의 필요)
- **연관**: STR ST-2

### E-3. OG 이미지 챔피언스 전용 생성

- **상태**: 🔲 대기 (이미지 서버 의존)
- **백엔드 작업**: image.poke-korea.com에 챔피언스 전용 폴더 + 이미지 생성
- **프론트 작업**: `getOgImageUrls` 로직에 챔피언스 폴더 추가
- **공수**: 이미지 서버 일정 의존
- **연관**: STR ST-1 (v3) 별도 작업

---

## 단계 F — 운영/외부 (1~3개월)

### F-1. 네이버 블로그 보조 채널 운영

- **상태**: 🔲 대기
- **작업**: 블로그 개설 + 월 4~8편 발행
- **콘텐츠 후보**:
  - "포켓몬 챔피언스 모바일 출시 전 알아둘 것"
  - "메가진화 포켓몬 도감 정리"
  - "이로치 포켓몬 일람"
- **공수**: 운영 리소스 의존
- **백엔드**: ❌ 불필요
- **연관**: STR ST-3

### F-2. GA4 측정 기준값 수집 + 추적 설정 정비

- **상태**: 🔲 대기
- **작업**:
  - 참여도 > 페이지 및 화면에서 /type-effectiveness, /champions/list 이탈률·평균 참여 시간 기준값 기록
  - 탐색 > 경로 탐색에서 /type-effectiveness 다음 방문 페이지 분포 확인
  - 필요 시 커스텀 이벤트 추가 검토
- **공수**: 1~2일 (GA4 콘솔)
- **백엔드**: ❌ 불필요
- **연관**: 효과 측정 기준값 확보 (전 항목 검증 토대)

---

## 단계 G — 보류

### G-1. 챔피언스 데미지 계산기 (12개월+ 보류)

- **상태**: ⛔ 보류
- **사유**: 본편 데미지 계산기 미구현 → 데미지 공식·UI 모두 신규 구축 필요
- **재검토 시점**: 본편 계산기 구축 후 또는 12개월 이후
- **연관**: STR MT-1

---

## 권장 1주차 일정 (참고)

| Day | 작업 | 백엔드 |
| --- | --- | --- |
| 1 (오전) | A-1, A-2, A-3, A-4 일괄 적용 (1시간 이내) | ❌ |
| 1 (오후) | B-1 시작 (A-5는 프로덕션 배포 후로 분리) | ❌ |
| 2 | B-1 완료 + B-2 진행 | ❌ |
| 3 | B-3 + C-1 (TypeResultChip 링크화) | ❌ |
| 4~5 | C-2 (결과 하단 CTA) + C-3 (챔피언스 인입 링크) | ❌ |
| 별도 (프로덕션 배포 후) | A-5 SC 인덱싱 요청 (사용자 수동) | ❌ |

**1주차 종료 후 효과 (예상)**: CTR 개선 + 챔피언스 인덱싱 품질 개선 + 인터링크 작동. 4~8주 후 SC에서 효과 측정 가능.

---

## KPI 추적 (STR 보고서 v3 기준)

| 지표 | 현재값 (2026-05) | 3개월 목표 (2026-08) | 6개월 목표 (2026-11) | 측정 |
| --- | --- | --- | --- | --- |
| MAU | 23,047 | 32,000~38,000 | 46,000+ | GA4 |
| DAU/MAU | 4.2% | 5.5~6.5% | 7~10% | GA4 |
| 검색 CTR (전체) | 2.29% | 3.5~4.0% | 4.5~5.5% | 구글 SC |
| 네이버 핵심 페이지 CTR | /detail/902 2.4%, /type-effectiveness 2.0% | 5%+ | 7%+ | 네이버 SC |
| 네이버 키워드 TOP 5 신규 진입 | (10개 보유) | 13~15개 | 18~20개 | 네이버 SC |
| 네이버 유입 비율 | 36% | 40~43% | 45~50% | GA4 |
| 챔피언스 페이지 30일 UV | 3,494 | 8,000~15,000 | 20,000~40,000 | GA4 |

---

## 진행 기록 (작업 완료 시 채워주세요)

### 2026-05-04

- 실행 계획서 초기 작성
- ✅ MI/BA/STR 보고서 v3 완료
- ✅ `isMegaEvolution` 필터 검증: `PokemonFilterInput.isMegaEvolution: Boolean` 존재 → MT-4 단계 D → C 상향

### 2026-05-05

- ✅ A-1 layout.tsx 폴백 description 교체 (47자, 한국어 키워드 앞배치)
- ✅ A-2 homeMetadata.ts description 89자 → 56자 압축 (description/OG/Twitter 3곳 동기화)
- ✅ A-3 typeEffectivenessMetadata.ts 130자 → 66자 재작성 (네이버 SC 노출 7,431/CTR 2.0% 페이지)
- ✅ A-4 사이트맵 챔피언스 priority 0.7 → 0.8 상향
- 🔄 작업 브랜치: `feature/1.39.0-meta-optimization` (PR 예정)
- 📌 A-5 SC 인덱싱 요청은 **프로덕션 배포 후** 수동 작업 (사용자가 직접 구글/네이버 SC 콘솔에서 진행). PR 머지만으로는 프로덕션에 반영되지 않으므로 SC 크롤링 시점이 어긋남
- 📌 효과 측정은 프로덕션 배포 후 4~8주 동안 네이버 SC + 구글 SC 데이터로 진행 예정

### 2026-05-05 (B-1 완료, 동일 일자 추가 작업)

- ✅ B-1 generateChampionsDetailMetadata description/title 다양화 완료
  - 폼/리전 한국어 표기 헬퍼, 타입 한국어 변환, 스탯 하이라이트, 메타 하이라이트 4개 헬퍼 함수 추가
  - 메타 데이터 유무에 따라 분기: 메타 있으면 인기 기술/특성 활용, 없으면 스탯 상위 2개 폴백
  - 길이 시뮬레이션 검증 6개 케이스 모두 80자 이내 통과 (최장 68자)
- 📝 B-1 작업 중 사용자 피드백 반영:
  - **티어 표기 제거**: 공식 티어가 아닌 내부 임의 분류이므로 description에 노출 시 사용자 오인 가능
  - **메가/거다이맥스 키워드**: `ChampionsFormType` enum 확인 결과 BASE/NORMAL/REGION만 정의 → 챔피언스 데이터에 존재하지 않아 자동 제외됨
  - 노말폼·리전폼 표기는 유지 (도감 페이지에서 별도 카드로 구분 표시)
- ⏭️ B-3 챔피언스 홈/도감/티어 description 변경 스킵
  - 기존 description이 이미 60~70자로 가이드라인 충족
  - 모바일 출시 키워드는 페이지 콘텐츠 불일치 위험으로 사용자 결정에 따라 제외
- 🔄 작업 브랜치: `feature/1.39.0-champions-meta` (PR 예정)

### (다음 진행 시 채울 항목)

- A-5 SC 인덱싱 완료 기록 (프로덕션 배포 후)
- 단계 B-2 (`/detail` 메타 폼별 강화) 진행
- 단계 C 시작
- 효과 측정 결과 기록 (4~8주 후)
