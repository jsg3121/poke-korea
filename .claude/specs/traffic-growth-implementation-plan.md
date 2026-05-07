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
| A. 즉시 실행 (1일 이내) | 5 | 5 | 0 | 0 |
| B. 메타 다양화 (1~3일) | 3 | 2 | 0 | 0 (B-3 스킵 포함) |
| C. 프론트 UI/구조 (3~7일) | 5 | 3 | 0 | 2 |
| D. 프론트 데이터 검토 (1~2주) | 1 | 0 | 0 | 1 |
| E. 백엔드 협업 (2~4주) | 3 | 0 | 0 | 3 |
| F. 운영/외부 (1~3개월) | 2 | 0 | 0 | 2 |
| G. 보류 | 1 | — | — | — |
| **합계** | **20** | **10** | **0** | **8** |

> 마지막 갱신: 2026-05-06 (C-3 완료 — 홈 챔피언스 추천 섹션 신설)

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

### A-5. 구글/네이버 SC 인덱싱 요청 ✅

- **상태**: ✅ 완료 (2026-05-06, 1.39.0 프로덕션 배포 후 진행)
- **작업**: 코드 변경 없음. 사용자가 SC 콘솔에서 수동 진행
- **검증 결과 (배포 후)**: 5개 핵심 URL의 메타 태그가 변경 반영 확인됨
  - `/`, `/type-effectiveness`, `/detail/902`, `/champions/list`, `/quiz/type-effectiveness`
  - description 길이 47~74자, 80자 가이드라인 충족
  - canonical, OG description 모두 동기화 정상
- **사이트맵 검증**: `https://poke-korea.com/sitemap.xml` HTTP 200, 챔피언스 priority 0.8 반영, BUILD_TIME / 챔피언스 외부 갱신 시각 분리 정상 동작
- **공수**: 15분
- **백엔드**: ❌ 불필요

> **Why 프로덕션 배포 후?**: PR 머지만으로는 feature 브랜치에만 변경이 반영되고 프로덕션은 그대로다. 이 시점에 SC가 크롤링하면 변경 전 description을 다시 인덱싱하므로 인덱싱 요청 자체가 무의미하다. 실제 사용자가 보는 페이지(프로덕션)에 변경이 반영된 후에 요청해야 효과가 있다.

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

### B-2. /detail 메타 폼별 description 강화 ✅

- **상태**: ✅ 완료 (2026-05-05, `feature/1.39.0-detail-meta`)
- **파일**:
  - `src/module/generateDetailSeoMetaData.ts` (`getSeoDescription` 함수)
  - `src/app/detail/[pokemonId]/(form)/modules/generateMetadata.ts` (호출처)
- **변경 결과**:
  - 라벨식 boilerplate (107~114자) → 자연어 패턴 (56~71자)으로 전환
  - 폼/이로치별 description 키워드 분기 추가:
    - 메가: "강화된 종족값"
    - 거다이맥스: "거다이맥스 형태"
    - 리전폼: "리전 한정 모습"
    - 이로치 (우선 적용): "색이 다른 모습"
    - 기본: "진화·종족값"
  - 새 패턴: `{name} (No. {number}, {gen}세대, {type1}·{type2} 타입). {formKeyword}, 기술, 특성 정보를 포케코리아에서 확인.`
- **길이 검증**: 9개 케이스 모두 80자 이내 (최장 71자 — 꼬렛 알로라 리전폼 이로치)
- **공수**: 약 1시간
- **백엔드**: ❌ 불필요 (인터페이스만 확장)
- **연관**: STR QW-3 (네이버 SC /detail/902 노출 7,959/CTR 2.4% 개선 대상)

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

### C-1. TypeResultChip을 클릭 가능한 Link로 변경 ✅

- **상태**: ✅ 완료 (2026-05-06, `feature/1.40.0-type-effectiveness-links`)
- **파일**:
  - `src/container/desktop/typeEffectiveness/typeEffectiveness.result/result.list/components/TypeResultChip.components.tsx`
  - `src/container/mobile/typeEffectiveness/typeEffectiveness.result/result.list/components/TypeResultChip.components.tsx`
- **변경 결과**:
  - 기존 `<span>` → Next `<Link href="/list?type={typeValue}">` 교체
  - `aria-label`로 스크린리더 접근성 보강
  - 호버/포커스 스타일 추가 (`hover:opacity-80`, `focus-visible:outline`)
- **추가 작업 — 안내 문구**: 결과 섹션 최상단(h2 바로 아래)에 "타입을 누르면 해당 타입 포켓몬을 도감에서 볼 수 있어요." 안내 문구 추가하여 칩의 클릭 가능성을 사용자가 인지할 수 있도록 보완
- **공수**: 약 1시간 (당초 1일 추정 대비 단축)
- **백엔드**: ❌ 불필요
- **연관**: STR QW-2 핵심

### C-2. /type-effectiveness 결과 하단 크로스링크 CTA 컴포넌트 추가 ✅

- **상태**: ✅ 완료 (2026-05-06, `feature/1.40.0-type-effectiveness-links`)
- **파일**:
  - `src/container/desktop/typeEffectiveness/typeEffectiveness.cta/TypeEffectivenessCta.component.tsx` (신규)
  - `src/container/mobile/typeEffectiveness/typeEffectiveness.cta/TypeEffectivenessCta.component.tsx` (신규)
  - `src/container/desktop/typeEffectiveness/typeEffectiveness.result/TypeEffectivenessResult.component.tsx` (CTA 통합)
  - `src/container/mobile/typeEffectiveness/typeEffectiveness.result/TypeEffectivenessResult.component.tsx` (CTA 통합)
- **변경 결과**: 결과 영역 하단에 신규 CTA 섹션 추가 (3개 카드)
  - 카드 1 (단일 타입 선택 시): "{타입} 타입 포켓몬 도감 보기" → `/list?type={type}`
  - 카드 2 (항상): "포켓몬 챔피언스 도감 보기" → `/champions/list`
  - 카드 3 (항상): "타입 상성 퀴즈 도전" → `/quiz/type-effectiveness`
  - 표시 조건: 타입 선택 후(`selectTypeList.length > 0`)에만 노출
  - 디자인: 결과 영역과 동일 톤(`bg-primary-2`, `rounded-2xl`)
- **공수**: 약 1.5시간 (당초 1~2일 추정 대비 단축)
- **백엔드**: ❌ 불필요
- **연관**: STR QW-2 (`/type-effectiveness` 단일 의존 분산), 챔피언스 인입 경로 추가, 퀴즈 페이지(CTR 22.2%) 리텐션 강화

### C-3. 메인 페이지 → 챔피언스 상세 인입 링크 추가 ✅

- **상태**: ✅ 완료 (2026-05-06, `feature/1.40.0-home-champions`)
- **변경 결과**:
  - 홈에 "인기 챔피언스 포켓몬" 섹션 신설 (S 티어 사용률 상위 3개)
  - 카드 클릭 시 `/champions/list/{pokemonId}` 챔피언스 상세로 이동 (기존 `ChampionsTopCard` 재사용)
  - 섹션 하단 "챔피언스 전체 도감 보기 →" CTA로 `/champions/list` 진입점 추가
  - 데이터 없음 시 섹션 자동 숨김
  - 홈 섹션 순서: 광고 배너 → **인기 챔피언스 포켓몬 (신규)** → 오늘의 포켓몬 → 퀴즈
- **신규/수정 파일**:
  - 신규: `src/container/desktop/home/home.champions/HomeChampions.container.tsx`
  - 신규: `src/container/mobile/home/home.champions/HomeChampions.container.tsx`
  - 수정: `src/views/desktop/home/Home.desktop.tsx`, `src/views/mobile/home/Home.mobile.tsx`
  - 수정: `src/app/page.tsx` (데이터 페치 추가)
  - 수정: `src/gql/query.graphql` (`GetChampionsMetaSummaryByFilter` 쿼리 신설)
- **데이터 처리**:
  - GraphQL: `getChampionsMetaSummary(filter: { tier: "S", limit: 3 })`
  - 정렬: 사용률(usageRate) 내림차순
- **챔피언스 홈과의 차별화**: 메인 홈은 Top 3, 챔피언스 홈은 Top 10 (S~D 티어 전체)
- **공수**: 약 2시간
- **백엔드**: ❌ 불필요 (기존 쿼리 + 필터 활용)
- **연관**: STR ST-1 (v3) 항목 4, 챔피언스 페이지군 30일 활성 사용자 3,494 → 모바일 출시 대비 인입 경로 확보

### C-4. 퀴즈 가시성 개선 (포켓몬 상세 페이지에 섹션별 맥락 매칭 배너)

- **상태**: ✅ 완료 (2026-05-07)
- **파일**:
  - 신규: `src/container/desktop/detail/detail.baseInfo/baseInfo.abilityQuiz/AbilityQuizBanner.component.tsx`
  - 신규: `src/container/desktop/detail/detail.baseInfo/baseInfo.typeQuiz/TypeQuizBanner.component.tsx`
  - 신규: `src/container/mobile/detail/detail.baseInfo/baseInfo.abilityQuiz/AbilityQuizBanner.component.tsx`
  - 신규: `src/container/mobile/detail/detail.baseInfo/baseInfo.typeQuiz/TypeQuizBanner.component.tsx`
  - 수정: `src/container/desktop/detail/detail.baseInfo/DetailBaseInfo.container.tsx`
  - 수정: `src/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container.tsx`
- **변경**: 포켓몬 상세 페이지의 특성 섹션 직후 → 특성 퀴즈 배너, 타입 상성 섹션 직후 → 타입 상성 퀴즈 배너 노출. 사용자가 보고 있는 정보와 자연스럽게 연결되도록 섹션 맥락에 맞춰 매칭. 데스크톱은 `col-span-full`로 그리드 전체 너비, 모바일은 단일 컬럼.
- **의도적 제외**: `/list`(무한 스크롤로 배치 위치 모호), 실루엣 퀴즈/타입 퀴즈(상세 페이지에서 이미 정보가 노출되어 매칭 어색)
- **근거**: 네이버 SC에서 `/quiz/type-effectiveness` CTR 22.2% — 퀴즈 자산이 강력. 상세 페이지는 SEO 인입의 다수를 차지하지만 한 마리만 보고 이탈하는 비율이 높아, 재방문 유도 핵심 콘텐츠인 퀴즈와의 자연스러운 연결이 필요
- **공수**: 약 1.5시간
- **백엔드**: ❌ 불필요
- **연관**: STR MT-3, STR ST-1 (v3) 항목 5

### C-5. 메가진화 일람 페이지 신설 (단계 D → C 상향, 백엔드 불필요 확인됨)

- **상태**: 🚫 종료 (2026-05-07, 추가 작업 불필요로 판단)
- **종료 사유**: 작업 착수 전 현행 자산 점검 결과, 메가진화 일람 기능이 이미 충분히 SEO 대응되어 있음을 확인
  - **사이트맵 등록 완료**: `src/app/sitemap.ts:298`에 `/list?isMega=true` priority 0.8로 등록됨. 리전폼/거다이맥스/진화 가능 여부 등 다른 Boolean 필터 URL도 동일하게 등록됨
  - **동적 메타데이터 생성 완료**: `src/app/list/_metadata/generateListMetadata.ts:124-130, 160`에서 `?isMega=true` 쿼리 감지 시 "메가진화 포켓몬 도감" 특화 title/description/canonical을 자동 생성 중
  - **개별 메가진화 페이지 등록**: `/detail/{id}/mega` URL이 모든 메가진화 포켓몬에 대해 사이트맵에 등록되어 있음 (`sitemap.ts:205-210`)
- **별도 페이지 신설을 보류한 추가 사유**:
  - **카니발리제이션 우려**: `/mega-evolution`(신설)과 `/list?isMega=true`(기존)의 콘텐츠가 사실상 동일 → 검색엔진이 어느 페이지를 우선 노출할지 혼란
  - **권위 분산**: 같은 검색 의도의 사용자에게 두 페이지가 경쟁 → 각 페이지의 SEO 권위 약화
  - **기존 동적 메타 시스템과 충돌**: 별도 페이지는 메타 자동 생성 로직 외부에 두어야 해 유지보수 부담 증가
- **결론**: 별도 페이지 신설보다 현재 자산 유지가 SEO·UX 모두에서 합리적. STR MT-4의 "메가진화 키워드 강세 대응"은 현행 자산으로 이미 달성된 상태로 판단
- **연관**: STR MT-4 (대응 완료 — 별도 작업 불필요)

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

### 2026-05-05 (B-2 완료 — 단계 B 종료)

- ✅ B-2 `/detail` 메타 폼별 description 강화 완료
  - 기존 description: 107~114자 라벨식 boilerplate ("전국 도감번호 : XXX | 포켓몬명 : XXX | ...")
  - 신규 description: 56~71자 자연어 패턴, 폼/이로치별 키워드 다양화
  - `getSeoDescription` 함수 시그니처 확장 (activeType, isShiny 추가) — 호출처 1곳 자동 업데이트
- 📝 폼별 키워드 우선순위 결정:
  - **이로치 우선**: 메가 이로치 같은 복합 폼은 "색이 다른 모습"이 가장 검색 가치 높음 (검색자가 "이로치"로 직접 검색하는 비중 높음 — 네이버 SC TOP 10에서 이로치 키워드 4개 진입)
  - **단일 키워드 선택**: 80자 이내 유지를 위해 폼 키워드는 1개만 적용
- 🔄 작업 브랜치: `feature/1.39.0-detail-meta` (PR 예정)
- 📌 단계 B 종결: B-1 ✅, B-2 ✅, B-3 ⏭️ 스킵

### 2026-05-06 (1.39.0 main 배포, 단계 C 시작)

- ✅ 1.39.0 릴리즈 PR(#123) main 머지 + 프로덕션 배포 완료
- ✅ 5개 핵심 URL 배포 검증 — 메타 태그 변경 반영 확인
  - 홈, /type-effectiveness, /detail/902, /champions/list, /quiz/type-effectiveness 모두 새 description 반영
  - 사이트맵 priority 0.8 + BUILD_TIME / 챔피언스 외부 갱신 시각 분리 정상 동작
- ✅ A-5 SC 인덱싱 요청 진행 (사용자 수동)
- ✅ 단계 C 시작: feature/1.40.0 루트 브랜치 생성
- ✅ C-1 TypeResultChip 클릭 가능 Link화 완료
  - 기존 `<span>` → Next `<Link href="/list?type={typeValue}">` 교체
  - 결과 섹션 최상단에 안내 문구 추가 (사용자 인지성 보완)
  - desktop/mobile 양쪽 적용
- ✅ C-2 결과 하단 CTA 섹션 신규 추가
  - 단일 타입 선택 시 "{타입} 타입 도감 보기" 카드
  - 항상 노출: "챔피언스 도감 보기", "타입 상성 퀴즈 도전"
  - 디자인은 기존 결과 article과 동일 톤
- 🔄 작업 브랜치: `feature/1.40.0-type-effectiveness-links` (PR 예정)

### 2026-05-06~05-07 (단계 C 마무리)

- ✅ C-3 메인 홈 → 챔피언스 인입 섹션 신설 (PR #125)
  - S 티어 사용률 Top 3 노출, 데스크톱 flex 정렬·모바일 가로 스크롤
  - 카드 비율·outline 잘림 후속 수정 포함
- ✅ C-4 포켓몬 상세 페이지 섹션별 맥락 매칭 퀴즈 배너 (PR #126)
  - 특성 섹션 직후 → 특성 퀴즈, 타입 상성 섹션 직후 → 타입 상성 퀴즈
  - WCAG AA 통과 색상 조합 (`bg-primary-3` + `text-primary-1`, 5.85:1)
- 🚫 C-5 메가진화 일람 페이지 신설 — 종료 (추가 작업 불필요)
  - 사이트맵·동적 메타·개별 메가진화 페이지 모두 이미 등록되어 있어 별도 페이지 신설은 카니발리제이션 우려
- 📌 단계 C 종결: C-1 ✅, C-2 ✅, C-3 ✅, C-4 ✅, C-5 🚫 종료

### (다음 진행 시 채울 항목)

- 1.40.0 릴리즈 PR(`feature/1.40.0` → `main`) 준비
- 단계 D 착수 검토 (D-1 이로치 URL 정적 경로, D-2/D-3 등)
- 효과 측정 결과 기록 (1.39.0 배포 후 4~8주, 1.40.0 배포 후 4~8주 각각)
