---
slug: best-champions-query
title: '챔피언스 홈 상위 티어 전용 쿼리 적용 및 모바일 가로 스크롤 전환'
description: '서버 신규 쿼리 `getBestChampionsPokemon` 적용으로 클라이언트 정렬·슬라이스 로직 제거, S/A 티어만 노출하도록 단순화하고 모바일은 가로 스크롤 UX로 전환'
authors: [jsg3121, claude]
tags: [graphql, feature-improvement, ux]
---

# 챔피언스 홈 상위 티어 전용 쿼리 적용

> **작업 날짜**: 2026-05-11
> **브랜치**: `feature/1.42.0-best-champions`

## 작업 개요

**작업 유형**: GraphQL 쿼리 마이그레이션 / UX 개선
**담당**: jsg3121 + Claude

## 작업 목표

기존 챔피언스 홈은 `getChampionsMetaSummary`로 챔피언스 전체 메타(186종)를 받은 뒤, 클라이언트에서 `usageRate` 기준 정렬 → `slice(0, 10)`으로 상위 10마리를 잘라 노출했다. 백엔드에서 S/A 티어만 정렬·필터링 완료된 신규 쿼리 `getBestChampionsPokemon`을 제공함에 따라, 다음을 수행한다.

- 서버에서 정제된 데이터를 그대로 사용하여 클라이언트 후처리 로직 제거
- 노출 범위를 "사용률 상위 10마리"에서 "S·A 티어 전체"로 명확화
- 가변 개수 응답에 맞춰 모바일은 그리드(2열) → 가로 스크롤 UX로 전환

<!-- truncate -->

## 주요 변경사항

### 1. 신규 GraphQL 쿼리 적용

기존엔 전체 메타를 받아 클라에서 정렬·슬라이스했지만, 서버가 S/A 티어만 사용률 내림차순으로 보장해 내려준다.

**변경 전** ([src/app/champions/page.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/app/champions/page.tsx)):

```ts
const { data } = await apolloClient.query({
  query: GetChampionsMetaSummaryDocument,
  fetchPolicy: 'network-only',
})

const metaSummary = data?.getChampionsMetaSummary || []
const topPokemons = [...metaSummary]
  .sort((a, b) => (b.usageRate ?? 0) - (a.usageRate ?? 0))
  .slice(0, 10)
```

**변경 후**:

```ts
const { data } = await apolloClient.query({
  query: GetBestChampionsPokemonDocument,
  fetchPolicy: 'network-only',
})

const topPokemons = data?.getBestChampionsPokemon ?? []
```

서버 보장 사양(가이드 기준):

- 정렬: 사용률 내림차순
- 필터: tier가 S 또는 A인 항목만
- 최소 8마리 보장, 동률 발생 시 더 많을 수 있음

### 2. 티어 그룹핑 로직 util로 추출

데스크톱·모바일 두 컨테이너에서 동일하게 수행하던 티어별 그룹핑(`filter` 반복)을 [src/utils/championsTier.util.ts](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/utils/championsTier.util.ts)로 분리했다. 향후 노출 티어 변경 시 한 곳만 수정하면 된다.

```ts
export const TOP_CHAMPIONS_TIERS = ['S', 'A'] as const

export const groupChampionsByTier = (
  pokemons: ChampionsMetaSummaryFragment[],
  tiers: readonly TopChampionsTier[] = TOP_CHAMPIONS_TIERS,
): ChampionsTierGroup[] =>
  tiers
    .map((tier) => ({
      tier,
      pokemons: pokemons.filter((p) => p.tier === tier),
    }))
    .filter((group) => group.pokemons.length > 0)
```

JSX 구조는 데스크톱(가변 그리드)과 모바일(가로 스크롤)이 본질적으로 달라 컨테이너에 그대로 두고, **데이터 변환 로직만 공통화**했다. 이는 프로젝트의 desktop/mobile 컨테이너 분리 컨벤션과 일치한다.

### 3. 데스크톱: 노출 티어 축소 및 제목 변경

[src/container/desktop/champions/ChampionsHome.container.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/container/desktop/champions/ChampionsHome.container.tsx)

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 섹션 제목 | "인기 포켓몬 Top 10" | "상위 티어 포켓몬" |
| 순회 티어 | `['S', 'A', 'B', 'C', 'D']` | `['S', 'A']` |
| 그룹핑 | 인라인 `filter` | `groupChampionsByTier` util |

가변 컬럼 그리드 레이아웃은 유지(티어별 마리 수만큼 컬럼 생성).

### 4. 모바일: 2열 그리드 → 가로 스크롤 전환

[src/container/mobile/champions/ChampionsHome.container.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/container/mobile/champions/ChampionsHome.container.tsx)

가변 응답에서 홀수 마리 노출 시 마지막 줄 빈 칸 문제와 사용률 순위 가독성 저하를 해소하기 위해, 메인 홈의 챔피언스 슬라이드와 동일한 가로 스크롤 패턴을 적용했다.

**변경 전**:

```tsx
<div className="grid grid-cols-2 gap-3">
  {tierPokemons.map((pokemon) => (
    <ChampionsTopCardMobile pokemonData={pokemon} ... />
  ))}
</div>
```

**변경 후**:

```tsx
<ul
  className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:..."
  role="region"
  aria-label={`${tier} 티어 포켓몬 슬라이드`}
>
  {pokemons.map((pokemon) => (
    <li key={pokemon.pokemonId} className="w-[175px] flex-shrink-0 px-1 py-1">
      <ChampionsTopCard pokemonData={pokemon} isHighPriority />
    </li>
  ))}
</ul>
```

추가로 카드 컴포넌트를 데스크톱·메인 홈과 통일하여 `ChampionsTopCard`를 사용한다(기존 `ChampionsTopCardMobile`은 데드 코드로 제거).

### 5. 데드 코드 정리

- 삭제: `src/components/champions/ChampionsTopCardMobile.component.tsx`
  - 모바일이 `ChampionsTopCard`로 통일되며 사용처 0건이 되어 제거.

## 기술적 세부사항

### 수정/추가/삭제 파일

**수정**

- [src/gql/query.graphql](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/gql/query.graphql) — `GetBestChampionsPokemon` 쿼리 추가
- [src/app/champions/page.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/app/champions/page.tsx) — 쿼리 교체, sort/slice 제거
- [src/container/desktop/champions/ChampionsHome.container.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/container/desktop/champions/ChampionsHome.container.tsx)
- [src/container/mobile/champions/ChampionsHome.container.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/container/mobile/champions/ChampionsHome.container.tsx)

**추가**

- [src/utils/championsTier.util.ts](https://github.com/jsg3121/poke-korea/blob/feature/1.42.0-best-champions/src/utils/championsTier.util.ts) — 티어 그룹핑 util

**자동 재생성**

- `src/graphql/gqlGenerated.ts`, `src/graphql/typeGenerated.ts`, `src/graphql/schema.graphql` — `npm run codegen` 결과

**삭제**

- `src/components/champions/ChampionsTopCardMobile.component.tsx`

### 검증 결과

- `npm run lint`: 통과 (기존 경고만 존재, 신규 경고 없음)
- `npm run build`: 통과
  - 31개 라우트 모두 정상 빌드
  - 정적 페이지 생성 17/17 성공
  - `/champions` 라우트 번들 크기 3.07 kB

## 참고 사항

### 캐시 정책

`getBestChampionsPokemon`은 외부 데이터 기준 24시간 단위로 갱신되며, 응답에 포함된 `updatedAt`(추후 fragment 확장 시 노출 가능)으로 갱신 시점 확인 가능. 페이지 단의 ISR 설정(`revalidate = 86400`)도 동일하게 24시간으로 유지.

### 기존 쿼리 보존

`getChampionsMetaSummary`는 그대로 유지. 전체 티어 리스트가 필요한 화면(예: `/champions/tier`, `/champions/list`)에서 계속 사용한다.

### 향후 고려 사항

- 가변 마리 수 응답 분포가 누적되면 데스크톱의 가변 컬럼 그리드(`repeat(N, 1fr)`)가 어색해질 수 있는 케이스(예: S 8마리 + A 12마리) 발견 시, 최대 컬럼 수 제한 + 자동 줄바꿈으로 후속 개선 가능.
- 동률로 인한 이상치 마리 수가 자주 발생하면, 백엔드와 협의하여 클라 측 부가 `slice` 정책을 추가할지 별도 논의 필요.
