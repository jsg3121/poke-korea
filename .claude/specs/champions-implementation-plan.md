# 포켓몬 챔피언스 구현 계획

- 작성일: 2026-04-18
- 참조: SPEC-001, champions-api-spec.md

---

## 전체 마일스톤

| 마일스톤 | 목표                        | 예상 기간 |
| -------- | --------------------------- | --------- |
| M1       | 186종 데이터 확보 + DB 구축 | 1일       |
| M2       | 백엔드 API 구현             | 2-3일     |
| M3       | 프론트엔드 도감 페이지      | 3-4일     |
| M4       | 티어/메타 페이지            | 2-3일     |
| M5       | 메인 허브 + SEO             | 1-2일     |

**총 예상 기간: 9-13일**

---

## M1: 데이터 확보 및 DB 구축

### 작업 1.1: 186종 목록 확보 ✅ 완료

**데이터 파일:** `.claude/specs/champions-pokemon-data.json`

**원본 소스:**

- URL: https://eurekaffeine.github.io/pokemon-champions-scraper/battle_meta.json
- GitHub: https://github.com/eurekaffeine/pokemon-champions-scraper
- 갱신 주기: 매주 월요일 02:00 UTC

**데이터 통계:**

- 총 엔트리: 186종
- 기본 폼: 165종 (pokemon_id 직접 매핑)
- 리전/변형 폼: 21종 (별도 매핑 필요)

### 작업 1.2: DB 테이블 생성

**담당:** 백엔드

```sql
-- poke-korea-server에서 실행
CREATE TABLE champions_pokemon (
  id SERIAL PRIMARY KEY,
  pokemon_id INTEGER NOT NULL REFERENCES pokemon(id),
  available_forms TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(pokemon_id)
);

CREATE INDEX idx_champions_pokemon_id ON champions_pokemon(pokemon_id);
```

### 작업 1.3: 초기 데이터 삽입

**담당:** 백엔드

```sql
-- 186종 INSERT (작업 1.1 결과 기반)
INSERT INTO champions_pokemon (pokemon_id, available_forms)
VALUES
  (6, ARRAY['mega', 'gmax']),
  (9, ARRAY['mega', 'gmax']),
  ...
```

---

## M2: 백엔드 API 구현

### 작업 2.1: GraphQL Schema 추가

**담당:** 백엔드
**파일:** `schema.graphql` (또는 해당 스키마 파일)

- `ChampionsPokemon` 타입
- `ChampionsPokemonDetail` 타입
- `ChampionsMetaStats` 타입
- `ChampionsPokemonListInput` 인풋
- Query 추가

### 작업 2.2: Resolver 구현

**담당:** 백엔드

| Resolver                    | 우선순위 | 복잡도                   |
| --------------------------- | -------- | ------------------------ |
| `getChampionsPokemonList`   | P0       | 낮음 (기존 패턴)         |
| `getChampionsPokemonDetail` | P0       | 낮음 (기존 API 조합)     |
| `getChampionsMetaStats`     | P1       | 중간 (외부 fetch + 캐싱) |
| `getChampionsMetaSummary`   | P1       | 중간                     |

### 작업 2.3: 외부 데이터 프록시

**담당:** 백엔드

```typescript
// 예시 구조
class ChampionsMetaService {
  private cache: Map<number, CachedMeta>

  async getMetaStats(pokemonId: number): Promise<MetaStats | null> {
    // 1. 캐시 확인
    // 2. 외부 JSON fetch
    // 3. 캐시 저장
    // 4. 반환
  }
}
```

### 작업 2.4: 테스트

**담당:** 백엔드

- 186종 목록 조회 테스트
- 페이지네이션 테스트
- 외부 데이터 fetch 실패 시 fallback 테스트

---

## M3: 프론트엔드 도감 페이지

### 작업 3.1: GraphQL Query/Fragment 추가

**담당:** 프론트엔드
**파일:** `src/gql/query.graphql`, `src/gql/fragment.graphql`

```graphql
# fragment.graphql
fragment ChampionsPokemonCard on ChampionsPokemon {
  id
  pokemonId
  name
  number
  types
  stats { ...PokemonStats }
  availableForms
}

# query.graphql
query GetChampionsPokemonList($input: ChampionsPokemonListInput) {
  getChampionsPokemonList(input: $input) {
    edges {
      cursor
      node { ...ChampionsPokemonCard }
    }
    pageInfo { ... }
    totalCount
  }
}
```

### 작업 3.2: codegen 실행

```bash
npm run codegen
```

### 작업 3.3: 라우트 생성

**파일 구조:**

```
src/app/champions/
├── page.tsx                    # 메인 허브 (M5에서 구현)
├── _metadata/
│   └── championsMetadata.ts
└── pokedex/
    ├── page.tsx                # 도감 목록
    ├── _metadata/
    │   └── pokedexMetadata.ts
    └── [pokemonId]/
        └── page.tsx            # 상세 페이지
```

### 작업 3.4: 뷰 컴포넌트 구현

**파일 구조:**

```
src/views/
├── desktop/champions/
│   ├── ChampionsPokedex.desktop.tsx
│   └── ChampionsPokemonDetail.desktop.tsx
└── mobile/champions/
    ├── ChampionsPokedex.mobile.tsx
    └── ChampionsPokemonDetail.mobile.tsx
```

### 작업 3.5: 컨테이너 컴포넌트 구현

**파일 구조:**

```
src/container/
├── desktop/champions/
│   ├── ChampionsPokemonList.container.tsx
│   ├── ChampionsPokemonCard.container.tsx
│   └── ChampionsFilter.container.tsx
└── mobile/champions/
    └── (동일 구조)
```

### 작업 3.6: 스타일링 및 반응형

- 기존 도감 페이지 스타일 참조
- Tailwind CSS 적용

---

## M4: 티어/메타 페이지

### 작업 4.1: 티어 리스트 페이지

**라우트:** `/champions/tier`

**컴포넌트:**

- 티어별 그룹 (S/A/B/C/D)
- 포켓몬 카드 (사용률/승률 표시)
- 정렬 옵션 (사용률순/승률순)

### 작업 4.2: 메타 데이터 표시

**상세 페이지에 추가:**

- 인기 기술 TOP 4
- 인기 도구 TOP 4
- 인기 특성
- 자주 함께 쓰이는 포켓몬

### 작업 4.3: VP 계산기 (선택)

**라우트:** `/champions/calculator`

**컴포넌트:**

- VP 슬라이더 (공격/방어/체력 배분)
- 예상 스탯 표시
- 데미지 계산 (기존 로직 활용)

**구현 복잡도:** 중간 ~ 높음 (VP 공식 검증 필요)

---

## M5: 메인 허브 + SEO

### 작업 5.1: 메인 허브 페이지

**라우트:** `/champions`

**콘텐츠:**

- 포켓몬 챔피언스 소개
- VP 시스템 간략 설명
- 인기 포켓몬 TOP 10 카드
- 하위 페이지 링크 (도감/티어/계산기)

### 작업 5.2: SEO 최적화

**메타데이터:**

```typescript
export const CHAMPIONS_META = {
  title: '포켓몬 챔피언스 | 포케코리아',
  description:
    '포켓몬 챔피언스 186종 도감, 티어 리스트, VP 계산기. 메타 분석과 추천 빌드를 확인하세요.',
  keywords: [
    '포켓몬 챔피언스',
    '포챔스',
    'Pokemon Champions',
    '티어표',
    'VP 계산기',
  ],
}
```

**JSON-LD:**

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '포켓몬 챔피언스 도감',
  description: '...',
  url: 'https://poke-korea.com/champions',
}
```

### 작업 5.3: sitemap 업데이트

`/champions`, `/champions/list`, `/champions/tier` 추가

---

## 체크리스트

> 2026-05-18 점검 결과 기반으로 정합성 복구. M1~M3·M5는 main에 머지된 코드 기준 완료 확인, M4는 라우트·UI·메타 데이터 모두 구현 확인됨. VP 계산기는 미구현 — 챔피언스 고도화 트랙(별도 SPEC)으로 이관.

### M1 체크리스트

- [x] 186종 ID 목록 확보
- [x] `champions_pokemon` 테이블 생성
- [x] 초기 데이터 삽입

### M2 체크리스트

- [x] GraphQL 스키마 추가
- [x] `getChampionsPokemonList` resolver
- [x] `getChampionsPokemonDetail` resolver
- [x] `getChampionsMetaStats` resolver (외부 fetch)
- [x] `getChampionsMetaSummary` resolver
- [x] 캐싱 구현
- [x] API 테스트

### M3 체크리스트

- [x] GraphQL query/fragment 추가
- [x] codegen 실행
- [x] `/champions/list` 라우트
- [x] `/champions/list/[pokemonId]` 라우트
- [x] desktop/mobile 뷰 컴포넌트
- [x] 컨테이너 컴포넌트
- [x] 필터/정렬 기능
- [x] 페이지네이션

### M4 체크리스트

- [x] `/champions/tier` 라우트 — `src/app/champions/tier/page.tsx`
- [x] 티어 그룹 UI — `ChampionsTierGroup` + `ChampionsTierPokemonItem` (S/A/B/C/D 5개 그룹, 사용률 정렬, smooth scroll)
- [x] 메타 데이터 표시 (상세 페이지) — `ChampionsMetaSection` (인기 기술/도구/특성 + 추천 파트너 + 사용률/승률 + 출처/업데이트)
- [ ] (선택) VP 계산기 — 미구현, 챔피언스 고도화 트랙으로 이관

### M5 체크리스트

- [x] `/champions` 메인 허브
- [x] SEO 메타데이터
- [x] JSON-LD
- [x] sitemap 업데이트

---

## 의존성 다이어그램

```
[M1: 데이터 확보]
       ↓
[M2: 백엔드 API]
       ↓
[M3: 도감 페이지] ←──┐
       ↓            │
[M4: 티어/메타]     │
       ↓            │
[M5: 허브 + SEO] ───┘
```

---

## 리스크 및 대응

| 리스크                   | 영향도 | 대응                                           |
| ------------------------ | ------ | ---------------------------------------------- |
| 186종 목록 부정확        | 높음   | eurekaffeine JSON 크로스체크, 공식 사이트 확인 |
| 외부 JSON 구조 변경      | 중간   | 캐싱 + fallback, 변경 모니터링                 |
| VP 공식 변경             | 낮음   | 프론트엔드 상수로 관리, 패치 노트 모니터링     |
| eurekaffeine 서비스 중단 | 중간   | 백업 소스 확보 (Showdown Tier 등)              |

---

## 최근 갱신 현황 (2026-05-18 기준)

> 본 계획서 작성(2026-04-18) 이후 실제 main에 머지된 항목을 요약. 2026-05-18 M4 코드 점검을 통해 체크리스트 정합성 복구 완료.

### 메인 홈 → 챔피언스 인입 경로

- **1.40.0 (PR #125, 2026-05-06)**: 메인 홈에 "인기 챔피언스 포켓몬" 섹션 신설. `getChampionsMetaSummary(filter: { tier: "S", limit: 3 })` 기반 Top 3 노출, 카드 클릭 시 `/champions/list/{pokemonId}` 진입. 참고: `traffic-growth-implementation-plan.md` C-3
- **1.42.0 (PR #132, 2026-05-11)**: 챔피언스 홈 자체 노출 로직을 신규 서버 쿼리 `getBestChampionsPokemon`으로 마이그레이션. 클라이언트 정렬/슬라이스 제거, 노출 범위를 "사용률 상위 10마리" → "S·A 티어 전체"로 변경, 모바일은 그리드(2열) → 가로 스크롤로 전환

### M1 ~ M3 (코드 상 반영 확인)

- `/champions/list`, `/champions/list/[pokemonId]` 라우트 및 desktop/mobile 뷰·컨테이너 구현
- `getChampionsPokemonList`, `getChampionsMetaSummary`, `getChampionsMetaStats`, `getBestChampionsPokemon` 쿼리 사용 중
- 챔피언스 상세 메타데이터(`generateChampionsDetailMetadata.ts`)는 폼/리전/스탯/메타 기반 동적 생성으로 강화됨 (트래픽 계획서 B-1 완료)
- 사이트맵 우선순위 0.8 반영 (트래픽 계획서 A-4 완료)

### M4 (티어/메타 페이지) — 점검 완료 (2026-05-18)

기본 구현은 모두 완료 상태로 확인됨. VP 계산기를 제외한 4개 항목 모두 ✅.

- **`/champions/tier` 라우트** — `src/app/champions/tier/page.tsx` (revalidate 24h, `getChampionsMetaSummary` SSR)
- **데스크톱/모바일 뷰** — `src/views/{desktop,mobile}/champions/ChampionsTier.{desktop,mobile}.tsx`
- **컨테이너** — `src/container/{desktop,mobile}/champions/ChampionsTier.container.tsx` (총 종수 + 5개 티어 바로가기 버튼, smooth scroll, "참고용 자료" 면책 안내)
- **티어 그룹 UI** — `ChampionsTierGroup` (S/A/B/C/D 5개 섹션, 사용률 내림차순) + `ChampionsTierPokemonItem` (이미지, 이름, 사용률 % + progress bar; S/A 티어는 eager loading)
- **메타 데이터 표시 (상세 페이지)** — `ChampionsMetaSection`에서 다음 모두 노출:
  - 티어 배지 + 사용률/승률 인라인 카드
  - 인기 기술 / 인기 도구 / 인기 특성 (`ChampionsMetaList` — 진행률 바)
  - 추천 파트너 (`ChampionsPartnerList` — 포켓몬 카드 + 챔피언스 상세 링크)
  - 데이터 출처 / 업데이트 일자 / stale 데이터 경고 / 메타 없을 때 fallback
- **JSON-LD** — BreadcrumbList + ItemList(티어별) 2개 등록
- **사이트맵** — `src/app/sitemap.ts:113` 등록

### M5 (메인 허브 + SEO)

- `/champions` 메인 허브 페이지, `championsMetadata.ts`, JSON-LD, 사이트맵 등록 완료 상태
- B-3 스킵 결정(트래픽 계획서) — 챔피언스 모바일 정식 출시 이후 재검토 예정

---

## 챔피언스 고도화 트랙 분리 (2026-05-18 결정)

M4 점검 결과 기본 구현은 모두 완료된 상태로 확인됨. 추가로 발견된 개선 후보(아래)는 **경쟁 서비스 분석 기반의 별도 SPEC**으로 분리하여 진행한다.

### 분리 사유 (Why)

- M4 미점검 항목은 "기능 부재"가 아닌 "품질·UX 고도화 영역" → 트래픽 증대 계획서의 다음 액션(SEO 자산·인입 경로)과 성격이 다름
- 임의 변경 누적을 피하고 시장 검증된 패턴을 적용하기 위해 경쟁 서비스(Pikalytics, Smogon, Game8, Inven 등) 조사를 선행해야 근거 기반 의사결정이 가능
- VP 계산기는 단독 신설보다 경쟁 분석에서 도출되는 우선순위 위에 배치하는 것이 합리적

### 신규 SPEC — 작성 완료 (2026-05-28)

본 트랙의 분석/SPEC 작성이 완료되었다. 후속 실행은 신규 SPEC을 따른다.

| 산출 문서                 | 위치                                                                | 역할                        |
| ------------------------- | ------------------------------------------------------------------- | --------------------------- |
| 리서치 보고서             | `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md` | MI + BA 종합 분석           |
| 신규 SPEC                 | `.claude/specs/champions-pikalytics-enhancement.md`                 | Phase 1~5 실행 계획         |
| 백엔드 데이터 소스 가이드 | `.claude/specs/champions-data-sources.md`                           | 페이지/기능 × 외부 API 매핑 |

### 채택된 우선순위 (사용자 확정)

| 순위 | Phase   | 기능                                    | 라우트 변경              |
| ---- | ------- | --------------------------------------- | ------------------------ |
| 1    | Phase 1 | 포맷 분리 (VGC/BSS)                     | `/champions/[format]/*`  |
| 2    | Phase 2 | 레이팅별 사용률 분리 (0/1500/1630/1760) | 없음                     |
| 3    | Phase 3 | 카운터/체크                             | 없음                     |
| 4    | Phase 4 | EV 스프레드                             | 없음                     |
| 5    | Phase 5 | 최근 탑팀 (대회)                        | `/champions/tournaments` |

### 변경된 진행 방식

1. ~~`/biz-strategy` 스킬 또는 `market-intelligence` 에이전트로 경쟁 서비스 조사~~ → **완료** (MI-BA-2026-05-28 보고서)
2. ~~갭 분석 → 우선순위 도출~~ → **완료**
3. ~~`product-planner` 에이전트로 신규 SPEC 작성~~ → **완료** (champions-pikalytics-enhancement.md)
4. **다음 단계**: 백엔드 GraphQL 스키마 확장 작업 (champions-data-sources.md 가이드 참조)
5. 백엔드 완료 후 프론트 Phase 1부터 순차 실행

### 기존 후보 항목의 처리

`champions-pikalytics-enhancement.md`에 포함되지 않은 기존 후보 항목은 다음과 같이 처리된다.

| 기존 후보                            | 새 SPEC 내 처리                                                   |
| ------------------------------------ | ----------------------------------------------------------------- |
| 티어 그룹 UI 개선                    | Phase 1 라우트 분리 작업에 자연 흡수 (포맷별 티어 UI 별도 디자인) |
| 메타 데이터 UI 개선                  | Phase 3~4 신규 섹션 추가 시 함께 진행                             |
| JSON-LD 강화                         | Phase 1 포맷별 분리 시 함께 갱신                                  |
| VP 계산기                            | Phase 4 EV 스프레드 완료 후 후속 작업으로 검토                    |
| 챔피언스 기술 상세 섹션              | Phase 3 카운터 + Phase 4 EV에서 데이터 깊이 강화로 대체           |
| 데스크톱/모바일 메타 컴포넌트 일관성 | 각 Phase 구현 시 검증 기준에 포함                                 |
