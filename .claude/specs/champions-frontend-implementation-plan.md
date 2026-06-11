# 챔피언스 프론트엔드 구현 계획 (Page-by-Page)

> **목적**: 백엔드 Phase 0~5 API 변경을 프론트엔드에 적용하기 위한 **페이지 단위 실행 계획** > **연결 문서**:
>
> - 백엔드 API 명세 (외부, gitignore 됨): `.claude/api-handoffs/champions-2026-05-31.md`
> - 기능 관점 SPEC: `.claude/specs/champions-pikalytics-enhancement.md`
> - 데이터 소스 가이드: `.claude/specs/champions-data-sources.md`
> - 근거 보고서: `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md` > **작성일**: 2026-05-31
>   **상태**: 계획 — Phase 0부터 순차 진행

---

## 0. 본 SPEC의 위치

기존 `champions-pikalytics-enhancement.md` 는 **기능 단위(포맷 분리 / 레이팅 / 카운터 / EV / 대회)** 로 작성되었으나, 실제 프론트 작업은 **페이지 단위**로 묶는 게 작업 경계가 명확하다. 본 SPEC은 동일한 목표를 **페이지 단위 실행 계획**으로 재정의한다.

| 구분       | 기능 관점 SPEC                         | 본 SPEC (페이지 관점)                |
| ---------- | -------------------------------------- | ------------------------------------ |
| 목적       | "어떤 기능을 도입할지"                 | "어떤 페이지를 어떤 순서로 작업할지" |
| 사용 시점  | 백엔드 작업 인풋                       | 프론트 작업 인풋                     |
| Phase 정의 | 포맷분리 → 레이팅 → 카운터 → EV → 대회 | 홈 → 리스트 → 티어 → 상세 → 대회     |

---

## 1. 전체 흐름 요약

| Phase       | 페이지/작업                  | 흡수하는 API 변경                                                                                     | 라우트 변경                                     |
| ----------- | ---------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Phase 0** | API 기반 작업 (선행 필수)    | 6개 쿼리 시그니처 갱신 + 코드젠 + format 임시 하드코딩                                                | 없음                                            |
| **Phase 1** | 챔피언스 홈                  | `getBestChampionsPokemon(format)` + `championsTeamCores(format, size:2, limit:5)`                     | `/champions/[format]`                           |
| **Phase 2** | 챔피언스 리스트              | `getChampionsPokemonList({format})` + `usageRank` + Partner nullable                                  | `/champions/[format]/list`                      |
| **Phase 3** | 챔피언스 티어                | `getChampionsMetaSummary({format,...})` + 폼 분리 노출                                                | `/champions/[format]/tier`                      |
| **Phase 4** | 챔피언스 상세 (가장 큰 작업) | `getChampionsPokemonDetail` + `getChampionsMetaStats` + EV + 카운터 + 레이팅별 사용률 + 폼 라우트 5개 | `/champions/[format]/list/[pokemonId]` + 폼 5개 |
| **Phase 5** | 대회 (신규)                  | `championsTournaments(format)` + `championsTournamentDetail(externalId)`                              | `/champions/tournaments` + `/[externalId]`      |

**총 예상 소요**: 약 6~8주 (영업일 30~40일)

---

## 2. Phase 0 — API 기반 작업 (선행 필수)

### 2-1. 목표

백엔드 새 스키마가 배포된 상태에서 **빌드가 통과되는 상태 회복**. 페이지 변경 없이 기존 UI가 VGC 데이터로 정상 동작.

### 2-2. 작업 항목

#### 2-2-1. GraphQL 쿼리 시그니처 갱신

`src/gql/query.graphql` 의 6개 챔피언스 쿼리를 새 시그니처로 변경:

| 쿼리                              | 기존 시그니처                                | 신규 시그니처                                                                                                |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `GetChampionsPokemonList`         | `($input: ChampionsPokemonListInput)`        | `($input: ChampionsPokemonListInput!)` (필수)                                                                |
| `GetChampionsMetaStats`           | `($externalDexId: Int!)`                     | `($input: ChampionsMetaStatsInput!)`                                                                         |
| `GetChampionsMetaSummary`         | (인자 없음)                                  | (기존 유지 또는 필요 시 인자 추가)                                                                           |
| `GetChampionsMetaSummaryByFilter` | `($filter: ChampionsMetaSummaryFilterInput)` | `($filter: ChampionsMetaSummaryFilterInput!)` (필수)                                                         |
| `GetBestChampionsPokemon`         | (인자 없음)                                  | `($format: ChampionsFormat!)`                                                                                |
| `GetChampionsPokemonDetail`       | `($externalDexId: Int!)`                     | `($pokemonId: Int!, $format: ChampionsFormat!, $formCode: String, $rating: ChampionsRating, $month: String)` |

#### 2-2-2. 코드젠 실행

```bash
npm run codegen
```

→ `src/graphql/typeGenerated.ts`, `src/graphql/gqlGenerated.ts` 자동 갱신.

#### 2-2-3. 빌드 통과 임시 처리 (Phase 1~5에서 자연 제거)

모든 호출처에 `format: ChampionsFormat.VgcDoubles` 를 임시 하드코딩하여 빌드 통과.

- `src/container/desktop/champions/Champions*.container.tsx` (4개)
- `src/container/mobile/champions/Champions*.container.tsx` (4개)
- `src/container/desktop/home/home.champions/HomeChampions.container.tsx`
- `src/container/mobile/home/home.champions/HomeChampions.container.tsx`

> **TODO 주석 추가**: 각 하드코딩 위치에 `// TODO(Phase N): format을 라우트 파라미터에서 가져오기` 주석 명시

#### 2-2-4. 공용 폼 토글 컴포넌트

`src/components/champions/ChampionsFormatTab.component.tsx` 신규 생성

- 두 탭 (VGC / BSS)
- 클릭 시 라우트 변경 (Next.js Link 사용)
- 현재 활성 탭 표시
- 모든 페이지에서 재사용

### 2-3. 검증 기준 (DoD)

- [ ] `npm run lint` 통과
- [ ] `tsc --noEmit` 통과
- [ ] `npm run build` 성공
- [ ] 기존 페이지 4개 (홈/리스트/티어/상세) 정상 동작 (VGC 데이터)
- [ ] 모든 호출처에 `format` 인자 명시
- [ ] 폼 토글 컴포넌트 단독 동작 확인

### 2-4. 소요 및 브랜치

- **소요**: 영업일 2~3일
- **브랜치**: `feature/1.45.0-champions-api-foundation`

### 2-5. 리스크 및 완화

| 리스크                               | 완화                                                   |
| ------------------------------------ | ------------------------------------------------------ |
| 코드젠 실패 (백엔드 스키마 미배포)   | localhost:4000 접근 여부 사전 확인. 백엔드 작업자 컨택 |
| 기존 데이터 누락 (마이그레이션 미완) | 빈 응답 폴백 UI 사전 추가                              |
| 6개 쿼리 변경 누락                   | 본 SPEC 표를 체크리스트로 사용                         |

---

## 3. Phase 1 — 챔피언스 홈

### 3-1. 목표

`/champions/[format]` 라우트 신설, S/A 추천 + 팀 코어 페어 TOP 5 섹션 인입.

### 3-2. 라우트 구조

```
신규
/champions/[format]                  # format = vgc | bss

리다이렉트
/champions  → /champions/vgc  (301)
```

### 3-3. 작업 항목

| 작업                                                                             | 파일                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 신규 라우트 `page.tsx`                                                           | `src/app/champions/[format]/page.tsx`                   |
| 301 리다이렉트                                                                   | `next.config.js` `redirects()`                          |
| `getBestChampionsPokemon(format)` 적용                                           | `Champions*.Home.container.tsx` (desktop/mobile)        |
| **팀 코어 페어 TOP 5 섹션 신규**                                                 | `ChampionsTeamCoreSection.component.tsx` (홈 전용)      |
| `championsTeamCores(format, size:2, limit:5)` 호출                               | 홈 컨테이너에 통합                                      |
| 폼 토글 UI 인입                                                                  | `ChampionsFormatTab` 사용                               |
| 메타데이터 포맷 분기                                                             | `championsMetadata.ts`                                  |
| JSON-LD 포맷 분기                                                                | "VGC 챔피언스" / "BSS 챔피언스"                         |
| sitemap 갱신                                                                     | `/champions/vgc`, `/champions/bss` 추가                 |
| Phase 0 임시 하드코딩 제거                                                       | 홈 관련                                                 |
| `src/container/{desktop,mobile}/home/home.champions/HomeChampions.container.tsx` | 메인 홈에서 챔피언스 인입 시 `format` 처리 (기본값 VGC) |

### 3-4. 팀 코어 섹션 상세

- 노출: 페어 TOP 5 (size: 2, limit: 5)
- UI: 페어 카드 (포켓몬 2마리 + 사용률 % + 팀 수)
- 폴백: 빈 배열 시 섹션 숨김 또는 "데이터 준비 중"

> **사후 검토**: 트래픽 데이터(GA4 + Search Console)에서 팀 코어 키워드가 의미 있게 잡히면 별도 페이지(`/champions/[format]/team-cores`) 분리 검토. 본 SPEC 범위 밖.

### 3-5. 검증 기준 (DoD)

- [ ] `/champions/vgc`, `/champions/bss` 정상 동작
- [ ] `/champions` 진입 시 `/champions/vgc` 로 301
- [ ] 폼 토글 UI 동작
- [ ] 팀 코어 섹션 정상 노출 (또는 빈 응답 폴백)
- [ ] 메타 title/description 포맷 분기 확인
- [ ] sitemap.xml 에 신규 URL 포함

### 3-6. 소요 및 브랜치

- **소요**: 영업일 3~4일
- **브랜치**: `feature/1.45.0-champions-home`

---

## 4. Phase 2 — 챔피언스 리스트

### 4-1. 목표

`/champions/[format]/list` 라우트 신설, `usageRank` 노출 + Partner nullable 처리.

### 4-2. 라우트 구조

```
신규
/champions/[format]/list

리다이렉트
/champions/list → /champions/vgc/list (301)
```

### 4-3. 작업 항목

| 작업                                     | 파일                                                            |
| ---------------------------------------- | --------------------------------------------------------------- |
| 신규 라우트 `page.tsx`                   | `src/app/champions/[format]/list/page.tsx`                      |
| 301 리다이렉트                           | `next.config.js`                                                |
| `getChampionsPokemonList({format})` 적용 | `ChampionsPokedex.container.tsx` (desktop/mobile)               |
| `usageRank` 노출                         | 카드 컴포넌트 (`ChampionsPokemonCard.component.tsx`)            |
| `partner.pokemonId` nullable 폴백        | `ChampionsPartnerList.component.tsx` (`displayName ?? rawName`) |
| 폼 토글 UI                               |                                                                 |
| 메타/JSON-LD 포맷 분기                   |                                                                 |
| sitemap 갱신                             |                                                                 |
| Phase 0 임시 하드코딩 제거               | 리스트 관련                                                     |

### 4-4. 검증 기준 (DoD)

- [ ] VGC/BSS 리스트 정상
- [ ] 사용률 순위 표시 정상
- [ ] Partner null 케이스 폴백 정상
- [ ] 301 정상
- [ ] 필터/페이지네이션 정상

### 4-5. 소요 및 브랜치

- **소요**: 영업일 3~4일
- **브랜치**: `feature/1.45.0-champions-list`

---

## 5. Phase 3 — 챔피언스 티어

### 5-1. 목표

`/champions/[format]/tier` 라우트 신설, 폼별 분리 노출.

### 5-2. 라우트 구조

```
신규
/champions/[format]/tier

리다이렉트
/champions/tier → /champions/vgc/tier (301)
```

### 5-3. 작업 항목

| 작업                                         | 파일                                           |
| -------------------------------------------- | ---------------------------------------------- |
| 신규 라우트 `page.tsx`                       | `src/app/champions/[format]/tier/page.tsx`     |
| 301 리다이렉트                               | `next.config.js`                               |
| `getChampionsMetaSummary({format,...})` 적용 | `ChampionsTier.container.tsx` (desktop/mobile) |
| 폼별 분리 노출 (베이스/메가/리전 등)         | `formCode` 기준 별도 카드 표시                 |
| `usageRank` 노출                             | 티어 카드                                      |
| 폼 토글 UI                                   |                                                |
| 메타/JSON-LD 포맷 분기                       |                                                |
| sitemap 갱신                                 |                                                |
| Phase 0 임시 하드코딩 제거                   | 티어 관련                                      |

### 5-4. 폼 분리 노출 정책

- 베이스 한카리아스와 메가 한카리아스Z를 별개 카드로 노출 (백엔드가 별개 데이터로 제공)
- 카드 라벨에 폼 종류 표시 (예: "메가 한카리아스Z")

### 5-5. 검증 기준 (DoD)

- [ ] VGC/BSS 티어 정상
- [ ] 폼별 카드 별도 노출 (베이스/메가/리전)
- [ ] 사용률 순위 표시 정상
- [ ] 티어 필터(S/A/B/C/D) 동작
- [ ] 301 정상

### 5-6. 소요 및 브랜치

- **소요**: 영업일 3~4일
- **브랜치**: `feature/1.45.0-champions-tier`

---

## 6. Phase 4 — 챔피언스 상세 (가장 큰 작업)

### 6-1. 목표

`/champions/[format]/list/[pokemonId]` + 폼 라우트 5개 신설. 신규 데이터 섹션 3개 (EV/카운터/레이팅별 사용률) 추가.

### 6-2. 라우트 구조

```
신규
/champions/[format]/list/[pokemonId]                  # BASE 폼
/champions/[format]/list/[pokemonId]/mega             # 메가 (기본)
/champions/[format]/list/[pokemonId]/mega/[index]     # 메가 인덱스 (메가Y 등)
/champions/[format]/list/[pokemonId]/region           # 리전
/champions/[format]/list/[pokemonId]/gigantamax       # 거다이맥스
/champions/[format]/list/[pokemonId]/form             # 일반 폼

리다이렉트
/champions/list/[id]       → /champions/vgc/list/[id]       (301)
/champions/list/[id]/mega  → /champions/vgc/list/[id]/mega  (301, 기존 있으면)
... 등
```

### 6-3. 작업 항목

#### 6-3-1. 라우트 및 폼 처리

| 작업                                                               | 파일                                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `[pokemonId]/page.tsx`                                             | `src/app/champions/[format]/list/[pokemonId]/page.tsx`                                         |
| 폼 라우트 5개 신설 (기존 `/detail/[pokemonId]/(form)/*` 패턴 복제) | `src/app/champions/[format]/list/[pokemonId]/(form)/{mega,region,gigantamax,form}/page.tsx` 등 |
| 폼 코드 식별 로직                                                  | 라우트 세그먼트 → `formCode` 매핑 (응답 폼 목록 기반)                                          |
| 301 리다이렉트                                                     | `next.config.js`                                                                               |

#### 6-3-2. GraphQL 호출

| 작업                                           | 파일                                             |
| ---------------------------------------------- | ------------------------------------------------ |
| `getChampionsPokemonDetail` 신규 시그니처 적용 | `ChampionsDetail.container.tsx` (desktop/mobile) |
| `getChampionsMetaStats({input})` 적용          | 동상                                             |
| `formCode` 인자 전달 (폼 라우트일 때)          |                                                  |

#### 6-3-3. 신규 섹션 3개

| 섹션                 | 컴포넌트 신규                               |
| -------------------- | ------------------------------------------- |
| EV 스프레드          | `ChampionsEvSpreadSection.component.tsx`    |
| 카운터/체크          | `ChampionsCounterSection.component.tsx`     |
| 레이팅별 사용률 차트 | `ChampionsUsageByRatingChart.component.tsx` |

각 섹션 폴백:

- EV 빈 배열 → 섹션 숨김
- 카운터 빈 배열 → "데이터 준비 중" 또는 숨김
- 사용률 일부 레이팅 null → 차트에서 "측정 데이터 부족"

#### 6-3-4. 기존 필드 폴백 강화

| 필드                        | 폴백                                     |
| --------------------------- | ---------------------------------------- |
| `winRate` null              | "데이터 부족" 표시 (특히 BSS)            |
| `partner.pokemonId` null    | `displayName ?? rawName`, 링크 없이 표시 |
| `counters[].pokemonId` null | 동상                                     |
| `itemKo` / `abilityKo` null | `item` / `ability` 영문 폴백             |
| `formCode` 매핑 실패        | BASE 폼으로 폴백                         |

#### 6-3-5. 메타데이터/JSON-LD

| 작업              | 내용                                                     |
| ----------------- | -------------------------------------------------------- |
| 폼별 메타 title   | "메가 한카리아스Z VGC - 포케 코리아"                     |
| 폼별 description  | 폼 종류 + 포맷 명시                                      |
| JSON-LD `name`    | 폼별 차별화                                              |
| sitemap 동적 추가 | 폼별 URL `getChampionsPokemonDetail` 응답의 폼 목록 기반 |

#### 6-3-6. 이미지 경로 처리

| 폼     | 처리                                         |
| ------ | -------------------------------------------- |
| BASE   | 기존 패턴                                    |
| NORMAL | 기존 패턴                                    |
| MEGA   | CDN 매핑 (`cdn/mega/${formCode}.png` 형태)   |
| REGION | CDN 매핑 (`cdn/region/${formCode}.png` 형태) |

CDN 경로 컨벤션은 기존 `/detail/[id]/(form)` 페이지 패턴 확인 후 일관 적용.

### 6-4. Phase 0 임시 하드코딩 제거

- 상세 컨테이너에서 `format` 을 라우트 파라미터로 가져오기
- `formCode` 도 라우트 세그먼트에서 식별

### 6-5. 검증 기준 (DoD)

- [ ] 베이스/메가/리전/거다이맥스/일반 폼 라우트 모두 정상
- [ ] 폼별 메타데이터 차별화 확인
- [ ] EV 스프레드 섹션 정상 노출 (또는 폴백)
- [ ] 카운터 섹션 정상 노출 (또는 폴백)
- [ ] 레이팅별 사용률 차트 정상 (또는 폴백)
- [ ] 영문/한글 폴백 동작 (`displayName ?? rawName` 등)
- [ ] BSS winRate null 폴백 표시
- [ ] 모바일/데스크탑 반응형
- [ ] 301 정상
- [ ] sitemap 폼 URL 포함

### 6-6. 소요 및 브랜치

- **소요**: 영업일 7~10일 (가장 큰 Phase)
- **브랜치**: `feature/1.45.0-champions-detail`

### 6-7. 리스크 및 완화

| 리스크                               | 완화                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| 폼 라우트 5개 동시 작업으로 복잡도 ↑ | 기존 `/detail/[pokemonId]/(form)/*` 패턴 그대로 복제, 순서대로 1개씩 검증 |
| 신규 섹션 3개 동시 작업              | 섹션별 개별 PR 또는 순차 머지 검토                                        |
| 폼 코드 ↔ 라우트 매핑 누락          | 응답의 `forms` 목록을 단일 소스로 사용, 매핑 누락 시 BASE로 폴백          |

---

## 7. Phase 5 — 대회 (신규)

### 7-1. 목표

`/champions/tournaments` 신규 라우트 트리. 기존 페이지에 흡수 안 되는 독립 페이지.

### 7-2. 라우트 구조

```
신규
/champions/tournaments              # 대회 목록
/champions/tournaments/[externalId] # 대회 상세 (입상자 풀빌드)
```

> 대회는 포맷 분리 라우트 구조 밖에 둠. 응답에 `format` 필드가 포함되어 페이지 내에서 표시.

### 7-3. 작업 항목

| 작업                                         | 파일                                                                                |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| 대회 목록 `page.tsx`                         | `src/app/champions/tournaments/page.tsx`                                            |
| 대회 상세 `page.tsx`                         | `src/app/champions/tournaments/[externalId]/page.tsx`                               |
| 컨테이너 신설 (desktop/mobile × 2)           | `src/container/{desktop,mobile}/champions/Tournament{List,Detail}.container.tsx`    |
| 뷰 신설 (desktop/mobile × 2)                 | `src/views/{desktop,mobile}/champions/Tournament{List,Detail}.{desktop,mobile}.tsx` |
| 컴포넌트 신설                                | 대회 카드, 입상자 카드, 풀빌드 6슬롯 카드, 슬롯 상세(기술/특성/도구/EV/테라스탈)    |
| `championsTournaments(format)` 적용          | 목록 컨테이너                                                                       |
| `championsTournamentDetail(externalId)` 적용 | 상세 컨테이너                                                                       |
| **메인 허브 인입**                           | `ChampionsHome` 에 "최근 대회" 섹션 추가 (Phase 1 결과 갱신)                        |
| BSS 빈 응답 폴백                             | "BSS 대회 데이터 준비 중" 표시 (`championsTournaments` 가 BSS에 빈 배열 반환)       |
| 메타/JSON-LD                                 | 대회별                                                                              |
| sitemap 동적 추가                            | 대회 ID 기반                                                                        |
| 풀빌드 슬롯 → 챔피언스 상세 페이지 연결      | 포켓몬 카드 클릭 시 `/champions/[format]/list/[pokemonId]` 로 이동                  |

### 7-4. 풀빌드 슬롯 표시 항목

각 슬롯에 표시할 내용 (백엔드 명세 기준):

- 포켓몬 이미지 + 한글명 (`displayName`)
- 영문명 (`rawName`) — 폴백
- 도구 (한글 `itemKo` ?? 영문 `item`)
- 특성 (한글 `abilityKo` ?? 영문 `ability`)
- 테라스탈 타입 (`teraType`)
- 기술 4개 (한글 `displayName` ?? 영문 `rawName`)
- EV (생략 가능, 별도 페이지 또는 호버)

### 7-5. 검증 기준 (DoD)

- [ ] VGC 대회 목록 정상 노출 (Limitless 데이터)
- [ ] BSS 빈 응답 폴백 정상
- [ ] 대회 상세에서 입상자 풀빌드 6슬롯 정상 노출
- [ ] 영문/한글 폴백 동작
- [ ] 포켓몬 카드 클릭 시 챔피언스 상세로 이동
- [ ] 메인 허브 "최근 대회" 섹션 정상 (Phase 1 갱신 부분)
- [ ] 메타/JSON-LD 정상

### 7-6. 소요 및 브랜치

- **소요**: 영업일 7~10일
- **브랜치**: `feature/1.45.0-champions-tournaments`

### 7-7. 리스크 및 완화

| 리스크                                      | 완화                                                   |
| ------------------------------------------- | ------------------------------------------------------ |
| Pikalytics `/ai/` 정책 변경 → 응답 단절     | DB 캐시 fallback (백엔드 처리) + 프론트는 빈 응답 폴백 |
| 6슬롯 풀빌드 데이터 누락                    | 슬롯별 부분 노출 허용                                  |
| 메인 허브 갱신과의 충돌 (Phase 1과 Phase 5) | Phase 5 시점에 Phase 1 결과 위에 섹션 추가             |

---

## 8. 누적 일정

| Phase   | 페이지/내용         | 소요 (영업일) | 누적 |
| ------- | ------------------- | ------------- | ---- |
| Phase 0 | API 기반 작업       | 2~3           | 3    |
| Phase 1 | 홈 (+팀 코어 섹션)  | 3~4           | 7    |
| Phase 2 | 리스트              | 3~4           | 11   |
| Phase 3 | 티어                | 3~4           | 15   |
| Phase 4 | 상세 (가장 큰 작업) | 7~10          | 25   |
| Phase 5 | 대회 (신규)         | 7~10          | 35   |

**총 약 6~8주** — 단기 KPI 시한(2026-09-30)까지 약 17주 남음, 충분.

---

## 9. 브랜치 전략

```
feature/1.45.0 (루트)
 ├─ feature/1.45.0-champions-api-foundation   (Phase 0)
 ├─ feature/1.45.0-champions-home              (Phase 1)
 ├─ feature/1.45.0-champions-list              (Phase 2)
 ├─ feature/1.45.0-champions-tier              (Phase 3)
 ├─ feature/1.45.0-champions-detail            (Phase 4)
 └─ feature/1.45.0-champions-tournaments       (Phase 5)
```

각 작업 브랜치 완료 후 루트로 `--no-ff` 머지 (이전 패턴 동일). 작업 브랜치는 머지 후 삭제.

---

## 10. 검증 전략 (전 Phase 공통)

| 시점              | 검증 항목                                              |
| ----------------- | ------------------------------------------------------ |
| 각 Phase 시작 전  | `npm run lint` 통과, 백엔드 dev 서버 동작 확인         |
| 각 Phase 완료 후  | `npm run lint` + `tsc --noEmit` + `npm run build` 통과 |
| 각 Phase 완료 후  | dev server 로컬 동작 확인 (해당 페이지)                |
| Phase 1~5 완료 후 | 기존 색인 URL 301 정상 동작                            |
| Phase 5 완료 후   | 사이트맵 전체 검증, Search Console 등록                |

---

## 11. 페이지별 API 매핑 (요약 참조)

| 페이지                                      | 사용 쿼리                                            | 적용 Phase |
| ------------------------------------------- | ---------------------------------------------------- | ---------- |
| `/champions/[format]`                       | `getBestChampionsPokemon`, `championsTeamCores`      | Phase 1    |
| `/champions/[format]/list`                  | `getChampionsPokemonList`                            | Phase 2    |
| `/champions/[format]/tier`                  | `getChampionsMetaSummary`                            | Phase 3    |
| `/champions/[format]/list/[pokemonId]` + 폼 | `getChampionsPokemonDetail`, `getChampionsMetaStats` | Phase 4    |
| `/champions/tournaments`                    | `championsTournaments`                               | Phase 5    |
| `/champions/tournaments/[externalId]`       | `championsTournamentDetail`                          | Phase 5    |

---

## 12. 미결 항목 (Phase 진행 중 결정)

| #   | 항목                                   | 결정 시점                                 |
| --- | -------------------------------------- | ----------------------------------------- |
| 1   | MEGA/REGION 이미지 CDN 경로 컨벤션     | Phase 4 (기존 `/detail/(form)` 패턴 참조) |
| 2   | 팀 코어 별도 페이지 분리 여부          | 사후 (트래픽 데이터 확인 후)              |
| 3   | Phase 4 신규 섹션의 능력치 계산기 연동 | Phase 4 완료 후                           |
| 4   | Phase 5 대회 상세의 EV 표시 방식       | Phase 5 진행 중                           |

---

## 13. SEO 영향 (단기 KPI 연결)

본 SPEC 완료 시 단기 KPI(~2026-09-30)에 미치는 영향:

| KPI                              | 영향                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| MAU 30K (North Star)             | 챔피언스 페이지 4종 → 8종+폼+대회로 확장, 검색 유입 증가          |
| 신규 인기 페이지 TOP 10 (AC4)    | `/champions/[format]/tier`, `/champions/tournaments` 등 신규 후보 |
| /type-effectiveness 의존도 (AC3) | 챔피언스 트래픽 증가로 단일 페이지 의존도 자연 감소               |
| 검색 노출/클릭 (A1, A2)          | 포맷별 키워드 + 폼별 키워드 + 대회 키워드 신규 매칭               |

---

## 14. 참고 자료

- 백엔드 API 명세 (외부, gitignore): `.claude/api-handoffs/champions-2026-05-31.md`
- 기능 관점 SPEC: `.claude/specs/champions-pikalytics-enhancement.md`
- 데이터 소스 가이드: `.claude/specs/champions-data-sources.md`
- 근거 보고서: `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md`
- 기존 챔피언스 계획서: `.claude/specs/champions-implementation-plan.md`
