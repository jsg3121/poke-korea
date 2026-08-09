---
slug: apollo-ssr-hydration
title: 'Apollo SSR 캐시 하이드레이션 — 목록 페이지 중복 요청 제거'
description: '기술 상세 버전 탭 전환 등 6개 목록 페이지에서 SSR 데이터를 클라이언트 캐시로 하이드레이트해 초기 중복 GraphQL 요청을 없애고 무한 스크롤만 네트워크를 타도록 개선했습니다.'
authors: [jsg3121, claude]
tags: [performance, nextjs, graphql]
---

# Apollo SSR 캐시 하이드레이션

> **작업 날짜**: 2026-08-04
> **브랜치**: `feature/1.55.0-apollo-hydration`

## 📋 작업 개요

**작업 유형**: 성능 개선 / 리팩토링
**담당**: jsg3121 + Claude

## 🎯 작업 목표

기술 상세 페이지에서 **버전 탭을 전환할 때마다 `GetPokemonsBySkill` 쿼리가 브라우저 네트워크에 다시 찍히는** 현상을 발견했다. 서버에서 SSR로 이미 데이터를 받는데도 클라이언트가 같은 쿼리를 재요청하고 있었다.

추적 결과 이는 기술 상세만의 문제가 아니라 **무한 스크롤이 있는 6개 목록형 쿼리 전반의 구조적 문제**였다. 목표는 "네트워크 요청은 무한 스크롤(더보기) 같은 추가 로딩에서만 발생"하도록, SSR 데이터를 클라이언트 캐시로 하이드레이트하는 것이다.

<!-- truncate -->

## 🔍 문제의 기원

git 히스토리 추적 결과, 이 문제는 디자인 시스템 개편과 무관하며 **2025-09-01 무한 스크롤 도입 시점**에 발생했다.

- 무한 스크롤 이전: `useQuery` 없이 서버가 준 데이터를 props로 표시만 함 → 재요청 없음
- 무한 스크롤 도입(`d1acb77`): `fetchMore`를 얻으려 `useQuery` 방식으로 전환 → 빈 클라이언트 캐시 때문에 초기 요청도 함께 발생
- 임시 봉합(`7e32e81`): `useRouteChangeCache`로 누적 캐시를 강제 삭제

근본 원인은 **App Router에서 서버 Apollo 캐시와 브라우저 Apollo 캐시가 별개 인스턴스**라, SSR 데이터가 클라이언트 캐시로 전달되지 않는다는 점이었다.

## ✨ 주요 변경사항

### 변경 1: SSR 캐시 하이드레이션 배선

각 `page.tsx`가 서버 캐시를 추출해 페이지를 감싸는 `Providers`에 주입한다.

**변경 전**:

```tsx
// page.tsx — 서버가 fetch한 데이터를 plain props로만 전달
<MoveDetailView initialPokemonList={pokemonList} ... />
// → 클라이언트 useQuery가 빈 캐시 → 네트워크 재요청
```

**변경 후**:

```tsx
// page.tsx — extract한 캐시를 Providers로 하이드레이트
const initialApolloState = extractApolloState(apolloClient)
<Providers initialApolloState={initialApolloState}>
  <MoveDetailView initialPokemonList={pokemonList} ... />
</Providers>
// → 클라이언트 useQuery(cache-first)가 캐시 히트 → 재요청 없음
```

`client.extract()` 결과에는 순수 객체가 아닌 값이 섞여 서버→클라이언트 경계 직렬화 에러가 나므로, `extractApolloState` 헬퍼에서 JSON 왕복으로 순수 객체로 변환한다.

### 변경 2: 페이지네이션 병합을 typePolicies로 이관

각 훅/Context의 수동 `updateQuery`를 제거하고 `InMemoryCache`의 `typePolicies`가 병합을 담당한다.

**변경 전**:

```tsx
await fetchMore({
  variables: { ... },
  updateQuery: (prev, { fetchMoreResult }) =>
    mergePagedResults('getPokemonsBySkill', prev, fetchMoreResult),
})
```

**변경 후**:

```tsx
// edges 병합은 typePolicies.merge가 담당 → updateQuery 불필요
await fetchMore({ variables: { ... } })
```

`keyArgs`에서 pagination을 제외해 같은 필터의 여러 페이지가 하나로 병합되고, 필터는 포함해 필터 변경 시 캐시가 자연히 분리된다.

### 변경 3: `useRouteChangeCache` 제거

무한 스크롤 캐시 누적을 강제 evict로 봉합하던 훅을 제거했다. `keyArgs`의 필터별 캐시 분리가 이를 구조적으로 대체하며, 남겨두면 하이드레이트한 캐시를 지워 오히려 충돌한다.

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 목록 초기 진입 시 GraphQL 요청 | SSR 1회 + 클라이언트 1회(중복) | SSR 1회만 |
| 버전 탭 전환 시 요청 | 매 전환마다 재요청 | 요청 없음(캐시 히트) |
| 무한 스크롤(더보기) 요청 | 정상 | 정상(유지) |
| 적용 페이지 | — | 6개(list·moves·moves상세·ability·ability상세·champions) |

## 🔧 기술적 세부사항

- **하이드레이션 엔진**: `initializeApollo`가 클라이언트 생성 시점(`useMemo`)에 `cache.restore()` — 렌더/`useEffect`가 아니라 타이밍 문제 없음
- **단일 소스 typePolicies**: `PAGINATED_QUERY_FIELDS` 맵에서 6개 필드의 `keyArgs`+`merge`를 자동 생성. 새 무한 스크롤 쿼리는 한 줄 등록으로 확장
- **제거된 코드**: `mergePagedResults`, `useRouteChangeCache`, `deepmerge`·`fast-deep-equal` 사용
- **의존성 변경 없음**: 공식 통합 패키지 대신 순수 `@apollo/client` 3.11 + 기존 스캐폴드 활용(상세 근거는 ADR-0014)

## 📌 참고 사항

- 의사결정 기록: `ADR-0014-apollo-ssr-cache-hydration.md`
- 장시간 탐색 시 캐시 메모리 누적(구 `useRouteChangeCache`의 `cache.gc` 순기능)은 실측 후 필요 시 별도 정리 장치를 검토한다.
- `cache-first`는 이미 `useQuery` 기본값이므로 정책 변경이 아니라 "캐시를 미리 채우는 것"이 핵심이다.
