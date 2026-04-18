# 포켓몬 챔피언스 API 명세서

- 작성일: 2026-04-18
- 대상: poke-korea-server (GraphQL API)
- 참조: SPEC-001-pokemon-champions-page.md

---

## 1. 개요

포켓몬 챔피언스 전용 페이지 구현을 위한 백엔드 API 명세입니다.

### 1.1 설계 원칙

- 기존 API 패턴(`getPokemonList`, `getPokemonDetail`)을 따름
- 페이지네이션은 기존 커서 기반 방식 유지
- 챔피언스 전용 필터링은 별도 Query로 분리

### 1.2 필요 API 목록

| API                         | 용도                           | 우선순위 |
| --------------------------- | ------------------------------ | -------- |
| `getChampionsPokemonList`   | 186종 도감 목록                | 🔴 P0    |
| `getChampionsPokemonDetail` | 개별 포켓몬 상세 + 메타 데이터 | 🔴 P0    |
| `getChampionsMetaStats`     | 외부 메타 데이터 프록시        | 🟡 P1    |

---

## 2. 신규 DB 테이블

### 2.1 `champions_pokemon`

챔피언스에 수록된 186종 포켓몬 목록을 관리합니다.

```sql
CREATE TABLE champions_pokemon (
  id SERIAL PRIMARY KEY,
  pokemon_id INTEGER NOT NULL REFERENCES pokemon(id),
  -- 챔피언스 전용 메타데이터 (선택)
  available_forms TEXT[], -- 사용 가능한 폼 ['mega', 'gmax', 'terastal']
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(pokemon_id)
);

-- 인덱스
CREATE INDEX idx_champions_pokemon_id ON champions_pokemon(pokemon_id);
```

### 2.2 초기 데이터 삽입

186종 ID 목록 확보 후 INSERT 예정 (수동 입력 또는 스크래핑)

---

## 3. GraphQL Schema

### 3.1 Types

```graphql
# 챔피언스 포켓몬 기본 정보
type ChampionsPokemon {
  id: ID!
  pokemonId: Int!
  name: String!
  number: Int!
  types: [String!]!
  typePrimary: String!
  typeSecondary: String

  # 기본 스탯
  stats: PokemonStats!

  # 사용 가능한 폼
  availableForms: [String!]!

  # 특성 목록
  abilities: [PokemonAbilityList!]!
}

# 챔피언스 포켓몬 상세 (메타 데이터 포함)
type ChampionsPokemonDetail {
  # 기본 정보
  pokemon: ChampionsPokemon!

  # 메가진화 정보 (있는 경우)
  megaEvolutions: [PokemonMegaEvolution!]

  # 거다이맥스 정보 (있는 경우)
  gigantamax: PokemonGigantamax

  # 리전폼 정보 (있는 경우)
  regionForms: [PokemonRegionForm!]

  # 배울 수 있는 기술 (챔피언스 기준)
  learnableSkills: LearnableSkills
}

# 외부 메타 데이터 (eurekaffeine JSON)
type ChampionsMetaStats {
  pokemonId: Int!
  usageRate: Float
  winRate: Float
  tier: String # S, A, B, C, D
  # 인기 기술/아이템/특성
  topMoves: [ChampionsMetaMove!]
  topItems: [ChampionsMetaItem!]
  topAbilities: [ChampionsMetaAbility!]
  topPartners: [ChampionsMetaPartner!]

  # 데이터 출처 및 갱신 시간
  source: String!
  updatedAt: String!
}

type ChampionsMetaMove {
  name: String!
  usageRate: Float!
}

type ChampionsMetaItem {
  name: String!
  usageRate: Float!
}

type ChampionsMetaAbility {
  name: String!
  usageRate: Float!
}

type ChampionsMetaPartner {
  pokemonId: Int!
  name: String!
  usageRate: Float!
}

# 페이지네이션
type ChampionsPokemonEdge {
  cursor: String!
  node: ChampionsPokemon!
}

type ChampionsPokemonConnection {
  edges: [ChampionsPokemonEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```

### 3.2 Input Types

```graphql
input ChampionsPokemonListInput {
  # 페이지네이션
  first: Int
  after: String
  last: Int
  before: String

  # 필터
  types: [String!] # 타입 필터
  search: String # 이름 검색
  tier: String # 티어 필터 (S, A, B, C, D) - 메타 데이터 기반
  sortBy: ChampionsSortBy
}

enum ChampionsSortBy {
  NUMBER_ASC
  NUMBER_DESC
  NAME_ASC
  NAME_DESC
  USAGE_RATE_DESC # 사용률 높은 순
  WIN_RATE_DESC # 승률 높은 순
}
```

### 3.3 Queries

```graphql
type Query {
  # 챔피언스 포켓몬 목록 (186종)
  getChampionsPokemonList(
    input: ChampionsPokemonListInput
  ): ChampionsPokemonConnection!

  # 챔피언스 포켓몬 상세
  getChampionsPokemonDetail(pokemonId: ID!): ChampionsPokemonDetail

  # 메타 통계 (외부 데이터 프록시)
  getChampionsMetaStats(pokemonId: Int!): ChampionsMetaStats

  # 전체 메타 요약 (티어 리스트용)
  getChampionsMetaSummary: [ChampionsMetaStats!]!
}
```

---

## 4. API 상세

### 4.1 `getChampionsPokemonList`

**용도:** 챔피언스 수록 186종 목록 조회

**로직:**

1. `champions_pokemon` 테이블에서 pokemon_id 목록 조회
2. `pokemon` 테이블과 JOIN하여 기본 정보 반환
3. 필터/정렬/페이지네이션 적용

**예시 요청:**

```graphql
query GetChampionsPokemonList($input: ChampionsPokemonListInput) {
  getChampionsPokemonList(input: $input) {
    edges {
      cursor
      node {
        id
        pokemonId
        name
        number
        types
        stats {
          hp
          attack
          defense
          specialAttack
          specialDefense
          speed
          total
        }
        availableForms
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

**변수:**

```json
{
  "input": {
    "first": 20,
    "types": ["fire"],
    "sortBy": "USAGE_RATE_DESC"
  }
}
```

### 4.2 `getChampionsPokemonDetail`

**용도:** 개별 포켓몬 상세 정보 + 폼 데이터

**로직:**

1. `champions_pokemon`에 존재하는지 확인
2. 기존 `getPokemonDetail` 로직 재사용
3. 메가/거다이맥스/리전폼 정보 추가 조회

**예시 요청:**

```graphql
query GetChampionsPokemonDetail($pokemonId: ID!) {
  getChampionsPokemonDetail(pokemonId: $pokemonId) {
    pokemon {
      id
      name
      types
      stats { ... }
      abilities { ... }
    }
    megaEvolutions { ... }
    gigantamax { ... }
    regionForms { ... }
    learnableSkills { ... }
  }
}
```

### 4.3 `getChampionsMetaStats`

**용도:** 외부 메타 데이터 프록시 (eurekaffeine JSON)

**로직:**

1. 외부 JSON fetch: `https://eurekaffeine.github.io/pokemon-champions-scraper/pokemon/{dex_id}.json`
2. 캐싱 (Redis 또는 메모리, TTL: 1시간)
3. 응답 형식 변환

**예시 요청:**

```graphql
query GetChampionsMetaStats($pokemonId: Int!) {
  getChampionsMetaStats(pokemonId: $pokemonId) {
    usageRate
    winRate
    tier
    topMoves {
      name
      usageRate
    }
    topItems {
      name
      usageRate
    }
    source
    updatedAt
  }
}
```

### 4.4 `getChampionsMetaSummary`

**용도:** 전체 메타 요약 (티어 리스트 페이지용)

**로직:**

1. 외부 JSON fetch: `https://eurekaffeine.github.io/pokemon-champions-scraper/battle_meta.json`
2. 캐싱 (TTL: 1시간)
3. 186종 전체 사용률/승률/티어 반환

---

## 5. 외부 데이터 연동

### 5.1 eurekaffeine JSON 구조 (예상)

**battle_meta.json:**

```json
{
  "updated_at": "2026-04-15T02:00:00Z",
  "pokemon": [
    {
      "dex_id": 727,
      "name": "Incineroar",
      "usage_rate": 53.2,
      "win_rate": 51.4
    }
  ]
}
```

**pokemon/{dex_id}.json:**

```json
{
  "dex_id": 727,
  "name": "Incineroar",
  "usage_rate": 53.2,
  "win_rate": 51.4,
  "moves": [
    { "name": "Fake Out", "usage": 95.2 },
    { "name": "Flare Blitz", "usage": 87.1 }
  ],
  "items": [{ "name": "Safety Goggles", "usage": 45.3 }],
  "abilities": [{ "name": "Intimidate", "usage": 99.1 }],
  "partners": [{ "dex_id": 445, "name": "Garchomp", "usage": 32.1 }]
}
```

### 5.2 캐싱 전략

| 데이터            | TTL   | 저장소         |
| ----------------- | ----- | -------------- |
| battle_meta.json  | 1시간 | Redis / 메모리 |
| pokemon/{id}.json | 1시간 | Redis / 메모리 |

### 5.3 에러 처리

- 외부 JSON fetch 실패 시 → 캐시된 데이터 반환 (stale-while-revalidate)
- 캐시도 없으면 → `null` 반환, 프론트에서 "데이터 준비 중" 표시

---

## 6. 기존 API 활용

다음 API는 신규 구현 없이 기존 것을 그대로 사용합니다:

| 기존 API                          | 챔피언스에서 용도     |
| --------------------------------- | --------------------- |
| `getPokemonDetail`                | 상세 페이지 기본 정보 |
| `getPokemonMegaEvolution`         | 메가진화 정보         |
| `getPokemonGigantamaxByPokemonId` | 거다이맥스 정보       |
| `getPokemonRegionForm`            | 리전폼 정보           |
| `getPokemonLearnableSkills`       | 배울 수 있는 기술     |

---

## 7. 프론트엔드 활용 예시

### 7.1 도감 페이지 (`/champions/pokedex`)

```typescript
const { data } = useQuery(GetChampionsPokemonListDocument, {
  variables: {
    input: {
      first: 20,
      sortBy: 'USAGE_RATE_DESC',
    },
  },
})
```

### 7.2 상세 페이지 (`/champions/pokedex/[id]`)

```typescript
// 기본 정보 + 메타 데이터 병렬 요청
const [detailResult, metaResult] = await Promise.all([
  client.query({
    query: GetChampionsPokemonDetailDocument,
    variables: { pokemonId },
  }),
  client.query({
    query: GetChampionsMetaStatsDocument,
    variables: { pokemonId: Number(pokemonId) },
  }),
])
```

### 7.3 티어 리스트 (`/champions/tier`)

```typescript
const { data } = useQuery(GetChampionsMetaSummaryDocument)
// 사용률/승률 기반으로 티어 자동 계산 또는 외부 데이터 사용
```
