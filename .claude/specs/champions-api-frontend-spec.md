# 포켓몬 챔피언스 API 프론트엔드 명세서

- 작성일: 2026-04-18
- 서버: poke-korea-server (GraphQL)
- Endpoint: `http://localhost:4000/` (개발) / `https://api.poke-korea.com/` (상용)

---

## 1. API 목록

| API                       | 용도                         | 우선순위 |
| ------------------------- | ---------------------------- | -------- |
| `getChampionsPokemonList` | 챔피언스 포켓몬 목록 (187종) | 🔴 P0    |
| `getChampionsMetaStats`   | 개별 포켓몬 메타 통계        | 🔴 P0    |
| `getChampionsMetaSummary` | 전체 메타 요약 (티어 리스트) | 🟡 P1    |

---

## 2. getChampionsPokemonList

### 용도

챔피언스에 등장하는 187종 포켓몬 목록을 조회합니다.

### Query

```graphql
query GetChampionsPokemonList($input: ChampionsPokemonListInput) {
  getChampionsPokemonList(input: $input) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        pokemonId
        name
        number
        types
        typePrimary
        typeSecondary
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
        abilities {
          abilityId
          isHidden
        }
      }
    }
  }
}
```

### Variables

```typescript
interface ChampionsPokemonListInput {
  filter?: {
    types?: string[] // 타입 필터 (예: ["FIRE", "WATER"])
    search?: string // 이름 검색 (예: "리자몽")
  }
  pagination?: {
    first?: number // 가져올 개수 (기본 20, 최대 100)
    after?: string // 다음 페이지 커서
    last?: number // 역방향 페이지네이션
    before?: string // 이전 페이지 커서
  }
}
```

### 예시 요청

**기본 조회 (첫 20개)**

```json
{
  "input": {
    "pagination": { "first": 20 }
  }
}
```

**타입 필터**

```json
{
  "input": {
    "filter": { "types": ["FIRE"] },
    "pagination": { "first": 20 }
  }
}
```

**이름 검색**

```json
{
  "input": {
    "filter": { "search": "리자몽" }
  }
}
```

**다음 페이지**

```json
{
  "input": {
    "pagination": {
      "first": 20,
      "after": "MjA="
    }
  }
}
```

### 응답 예시

```json
{
  "data": {
    "getChampionsPokemonList": {
      "totalCount": 170,
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "MTg4",
        "endCursor": "MzIz"
      },
      "edges": [
        {
          "cursor": "MTg4",
          "node": {
            "id": "188",
            "pokemonId": 3,
            "name": "이상해꽃",
            "number": 3,
            "types": ["GRASS", "POISON"],
            "typePrimary": "GRASS",
            "typeSecondary": "POISON",
            "stats": {
              "hp": 80,
              "attack": 82,
              "defense": 83,
              "specialAttack": 100,
              "specialDefense": 100,
              "speed": 80,
              "total": 525
            },
            "availableForms": [],
            "abilities": [
              { "abilityId": 65, "isHidden": false },
              { "abilityId": 34, "isHidden": true }
            ]
          }
        }
      ]
    }
  }
}
```

### availableForms 설명

리전폼/노말폼이 있는 포켓몬은 `availableForms`에 폼 코드가 포함됩니다.

| 접두사 | 의미   | 조회 API                               |
| ------ | ------ | -------------------------------------- |
| `R`    | 리전폼 | `getPokemonRegionForm(regionFormCode)` |
| `F`    | 노말폼 | `getPokemonNormalForm(normalFormCode)` |

**예시:**

```json
{
  "name": "로토무",
  "number": 479,
  "availableForms": ["F0479023", "F0479022", "F0479024", "F0479026", "F0479025"]
}
```

---

## 3. getChampionsMetaStats

### 용도

개별 포켓몬의 메타 통계를 조회합니다. (사용률, 티어, 인기 기술/아이템/특성/파트너)

### Query

```graphql
query GetChampionsMetaStats($pokemonId: Int!) {
  getChampionsMetaStats(pokemonId: $pokemonId) {
    pokemonId
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
    topAbilities {
      name
      usageRate
    }
    topPartners {
      pokemonId
      name
      usageRate
    }
    source
    updatedAt
    isStale
  }
}
```

### Variables

```typescript
{
  pokemonId: number // 포켓몬 도감번호 (예: 727)
}
```

### 예시 요청

```json
{
  "pokemonId": 727
}
```

### 응답 예시

```json
{
  "data": {
    "getChampionsMetaStats": {
      "pokemonId": 727,
      "usageRate": 54.37,
      "winRate": null,
      "tier": "S",
      "topMoves": [
        { "name": "속이다(속이기)", "usageRate": 99.025 },
        { "name": "막말내뱉기", "usageRate": 96.041 },
        { "name": "플레어드라이브", "usageRate": 85.37 },
        { "name": "지옥찌르기", "usageRate": 43.431 }
      ],
      "topItems": [
        { "name": "자뭉열매", "usageRate": 56.168 },
        { "name": "로플열매", "usageRate": 15.491 },
        { "name": "슈캐열매", "usageRate": 12.622 },
        { "name": "리샘열매", "usageRate": 4.877 }
      ],
      "topAbilities": [
        { "name": "위협", "usageRate": 98.164 },
        { "name": "맹화", "usageRate": 1.779 }
      ],
      "topPartners": [
        { "pokemonId": 1013, "name": "그우린차", "usageRate": 39.415 },
        { "pokemonId": 903, "name": "포푸니크", "usageRate": 38.21 },
        { "pokemonId": 445, "name": "한카리아스", "usageRate": 36.374 },
        { "pokemonId": 670, "name": "플라엣테", "usageRate": 22.949 }
      ],
      "source": "eurekaffeine/pokemon-champions-scraper",
      "updatedAt": "2026-04-18T10:30:00.000Z",
      "isStale": false
    }
  }
}
```

### 필드 설명

| 필드           | 타입    | 설명                            |
| -------------- | ------- | ------------------------------- |
| `usageRate`    | Float   | 사용률 (%)                      |
| `winRate`      | Float?  | 승률 (%, 현재 null)             |
| `tier`         | String  | 티어 (S/A/B/C/D)                |
| `topMoves`     | Array   | 인기 기술 TOP 4                 |
| `topItems`     | Array   | 인기 아이템 TOP 4               |
| `topAbilities` | Array   | 인기 특성                       |
| `topPartners`  | Array   | 자주 함께 사용되는 포켓몬 TOP 4 |
| `isStale`      | Boolean | stale 캐시 데이터 여부          |

### 티어 기준

| 티어 | 사용률   |
| ---- | -------- |
| S    | 30% 이상 |
| A    | 15% 이상 |
| B    | 5% 이상  |
| C    | 1% 이상  |
| D    | 1% 미만  |

### 주의사항

- 일부 아이템은 `Unknown (ID)`로 표시될 수 있음 (DB에 없는 챔피언스 전용 아이템)
- 데이터는 24시간 캐싱됨. 외부 API 장애 시 최대 7일간 stale 데이터 반환

---

## 4. getChampionsMetaSummary

### 용도

전체 포켓몬의 메타 요약을 조회합니다. (티어 리스트 페이지용)

### Query

```graphql
query GetChampionsMetaSummary {
  getChampionsMetaSummary {
    pokemonId
    usageRate
    winRate
    tier
    isStale
  }
}
```

### Variables

없음

### 응답 예시

```json
{
  "data": {
    "getChampionsMetaSummary": [
      {
        "pokemonId": 727,
        "usageRate": 54.37,
        "winRate": null,
        "tier": "S",
        "isStale": false
      },
      {
        "pokemonId": 903,
        "usageRate": 45.13,
        "winRate": null,
        "tier": "S",
        "isStale": false
      },
      {
        "pokemonId": 445,
        "usageRate": 37.15,
        "winRate": null,
        "tier": "S",
        "isStale": false
      },
      {
        "pokemonId": 1013,
        "usageRate": 34.62,
        "winRate": null,
        "tier": "S",
        "isStale": false
      },
      {
        "pokemonId": 983,
        "usageRate": 27.01,
        "winRate": null,
        "tier": "A",
        "isStale": false
      }
    ]
  }
}
```

### 활용 예시

**티어별 그룹핑 (프론트)**

```typescript
const summary = data.getChampionsMetaSummary

const tierGroups = {
  S: summary.filter((p) => p.tier === 'S'),
  A: summary.filter((p) => p.tier === 'A'),
  B: summary.filter((p) => p.tier === 'B'),
  C: summary.filter((p) => p.tier === 'C'),
  D: summary.filter((p) => p.tier === 'D'),
}
```

---

## 5. 프론트엔드 활용 예시

### 도감 페이지 (`/champions/list`)

```typescript
const { data, loading, fetchMore } = useQuery(GetChampionsPokemonListDocument, {
  variables: {
    input: {
      pagination: { first: 20 },
    },
  },
})

// 무한 스크롤
const loadMore = () => {
  fetchMore({
    variables: {
      input: {
        pagination: {
          first: 20,
          after: data.getChampionsPokemonList.pageInfo.endCursor,
        },
      },
    },
  })
}
```

### 상세 페이지 (`/champions/list/[pokemonId]`)

```typescript
// 기본 정보 + 메타 데이터 병렬 요청
const [listResult, metaResult] = await Promise.all([
  client.query({
    query: GetChampionsPokemonListDocument,
    variables: { input: { filter: { search: pokemonName } } },
  }),
  client.query({
    query: GetChampionsMetaStatsDocument,
    variables: { pokemonId: Number(pokemonId) },
  }),
])
```

### 티어 리스트 페이지 (`/champions/tier`)

```typescript
const { data } = useQuery(GetChampionsMetaSummaryDocument)

// 사용률 순 정렬
const sorted = [...data.getChampionsMetaSummary].sort(
  (a, b) => b.usageRate - a.usageRate,
)
```

---

## 6. 타입 정의 (TypeScript)

```typescript
// 포켓몬 타입
type PokemonType =
  | 'NORMAL'
  | 'FIRE'
  | 'WATER'
  | 'GRASS'
  | 'ELECTRIC'
  | 'ICE'
  | 'FIGHTING'
  | 'POISON'
  | 'GROUND'
  | 'FLYING'
  | 'PSYCHIC'
  | 'BUG'
  | 'ROCK'
  | 'GHOST'
  | 'DRAGON'
  | 'DARK'
  | 'STEEL'
  | 'FAIRY'

// 챔피언스 포켓몬
interface ChampionsPokemon {
  id: string
  pokemonId: number
  name: string
  number: number
  types: PokemonType[]
  typePrimary: PokemonType
  typeSecondary: PokemonType | null
  stats: PokemonStats
  availableForms: string[]
  abilities: PokemonAbility[]
}

// 스탯
interface PokemonStats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
  total: number
}

// 특성
interface PokemonAbility {
  abilityId: number
  isHidden: boolean
}

// 메타 통계
interface ChampionsMetaStats {
  pokemonId: number
  usageRate: number | null
  winRate: number | null
  tier: string | null
  topMoves: { name: string; usageRate: number }[]
  topItems: { name: string; usageRate: number }[]
  topAbilities: { name: string; usageRate: number }[]
  topPartners: { pokemonId: number; name: string; usageRate: number }[]
  source: string
  updatedAt: string
  isStale: boolean
}

// 메타 요약
interface ChampionsMetaSummaryItem {
  pokemonId: number
  usageRate: number
  winRate: number | null
  tier: string
  isStale: boolean
}
```

---

## 7. 캐싱 정책

| 데이터      | TTL                  | 비고                     |
| ----------- | -------------------- | ------------------------ |
| 포켓몬 목록 | Apollo 캐시 (12시간) | 서버 캐시                |
| 메타 통계   | 24시간               | 외부 API 주 1회 업데이트 |
| 메타 요약   | 24시간               | 외부 API 주 1회 업데이트 |

---

## 8. 에러 처리

| 상황                      | 응답                                    |
| ------------------------- | --------------------------------------- |
| 외부 API 장애             | `isStale: true`와 함께 캐시 데이터 반환 |
| 캐시 없음 + 외부 API 장애 | `null` 반환                             |
| 존재하지 않는 pokemonId   | `null` 반환                             |

**프론트 처리 예시:**

```typescript
if (data.getChampionsMetaStats === null) {
  return <div>메타 데이터를 불러올 수 없습니다.</div>
}

if (data.getChampionsMetaStats.isStale) {
  return (
    <div>
      <Warning>데이터가 최신이 아닐 수 있습니다.</Warning>
      <MetaStatsView data={data.getChampionsMetaStats} />
    </div>
  )
}
```
