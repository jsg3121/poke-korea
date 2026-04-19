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
- 인기 아이템 TOP 4
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

### M1 체크리스트

- [ ] 186종 ID 목록 확보
- [ ] `champions_pokemon` 테이블 생성
- [ ] 초기 데이터 삽입

### M2 체크리스트

- [ ] GraphQL 스키마 추가
- [ ] `getChampionsPokemonList` resolver
- [ ] `getChampionsPokemonDetail` resolver
- [ ] `getChampionsMetaStats` resolver (외부 fetch)
- [ ] `getChampionsMetaSummary` resolver
- [ ] 캐싱 구현
- [ ] API 테스트

### M3 체크리스트

- [ ] GraphQL query/fragment 추가
- [ ] codegen 실행
- [ ] `/champions/list` 라우트
- [ ] `/champions/list/[pokemonId]` 라우트
- [ ] desktop/mobile 뷰 컴포넌트
- [ ] 컨테이너 컴포넌트
- [ ] 필터/정렬 기능
- [ ] 페이지네이션

### M4 체크리스트

- [ ] `/champions/tier` 라우트
- [ ] 티어 그룹 UI
- [ ] 메타 데이터 표시 (상세 페이지)
- [ ] (선택) VP 계산기

### M5 체크리스트

- [ ] `/champions` 메인 허브
- [ ] SEO 메타데이터
- [ ] JSON-LD
- [ ] sitemap 업데이트

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
