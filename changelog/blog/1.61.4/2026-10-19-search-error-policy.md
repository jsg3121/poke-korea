---
slug: search-error-policy
title: '검색어 상한 초과 시 도감·기술·챔피언스 목록 SSR 500 방지'
description: '백엔드가 검색어 30자·5단어 상한을 넘으면 에러를 반환하게 되면서, 검색어를 SSR 쿼리에 넣는 도감·기술·챔피언스 목록 페이지가 500 대신 빈 목록을 렌더링하도록 errorPolicy를 지정했다.'
authors: [jsg3121, claude]
tags: [bug-fix, graphql, nextjs]
---

# 검색어 상한 초과 시 도감·기술·챔피언스 목록 SSR 500 방지

> **작업 날짜**: 2026-10-19
> **브랜치**: `feature/1.61.4-search-error-policy`

## 📋 작업 개요

**작업 유형**: 버그 수정 (핫픽스)
**담당**: jsg3121, Claude

## 🎯 작업 목표

백엔드 배포 후 검색어가 상한(30자·5단어)을 넘는 요청이 와도 `/list`, `/moves`, `/champions/[format]/list` 페이지가 500 에러 화면 대신 빈 목록을 보여주게 한다.

<!-- truncate -->

## 📉 왜 필요했나

2026-10-19 API 서버(`poke-korea-server`)가 하루 4~14회씩 메모리 상한(`max_memory_restart: 300M`)에 걸려 재시작했다. 그중 17:41과 22:51 두 번은 트래픽이 몰린 시점과 겹쳐 ALB 5xx 경보가 울렸다. 원인은 상한이 없는 서버 캐시에 검색어가 키로 계속 쌓인 것이다. 백엔드 PR #31에서 이를 고치면서 **검색어가 상한을 넘으면 GraphQL 에러를 던지도록** 동작이 바뀌었다.

프론트에서 검색어가 이 에러를 만날 수 있는 경로는 네 곳이다.

| 위치                                | 쿼리                        | 에러 시 동작 (수정 전)          |
| ----------------------------------- | --------------------------- | ------------------------------- |
| 헤더 검색 (`useSearchPokemon`)      | `searchPokemonWithAllForms` | lazy query라 결과창만 안 뜬다   |
| `/list?name=…` (`/?name=` 포함)     | `getPokemonListPaginated`   | SSR 예외 → `error.tsx`, **500** |
| `/moves?search=…`                   | `getPokemonSkillList`       | SSR 예외 → `error.tsx`, **500** |
| `/champions/[format]/list?search=…` | `getChampionsPokemonList`   | SSR 예외 → `error.tsx`, **500** |

`/list`의 `GetPokemonListPaginated`는 응답 필드명이 `getPokemonList`라 다른 쿼리처럼 보이지만, 실제로는 `getPokemonListPaginated`에 별칭을 붙인 것이라 같은 상한이 적용된다. `/?name=`은 `/list`로 리다이렉트되므로 같은 결과가 된다.

`apolloClient.query`의 기본 `errorPolicy`는 `'none'`이라 응답에 GraphQL 에러가 하나라도 있으면 Promise가 reject된다. 그래서 검색어가 정상 범위를 벗어나는 순간 페이지 전체가 깨진다.

## ✨ 주요 변경사항

### 변경 1: SSR 목록 쿼리 3곳에 `errorPolicy: 'all'` 지정

**변경 전**:

```tsx
const { data } = await client.query({
  query: GetPokemonSkillListDocument,
  variables: { input: { filter: movesFilter, pagination: { first: 20 } } },
})
```

**변경 후**:

```tsx
const { data } = await client.query({
  query: GetPokemonSkillListDocument,
  variables: { input: { filter: movesFilter, pagination: { first: 20 } } },
  errorPolicy: 'all',
})
```

`/list`의 `GetPokemonListPaginated`와 `/champions/[format]/list`의 `GetChampionsPokemonList` 쿼리에도 똑같이 적용했다. 세 페이지 모두 `data?.… || []`, `|| 0`으로 이미 fallback을 처리하고 있어서, 에러가 나면 빈 목록과 총 0건으로 렌더링된다.

## ⚠️ 구현 시 고려한 점

- **검색 input에 `maxLength={30}` 추가는 하지 않았다.** 사용자 입력은 막지만 URL 파라미터로 직접 들어오는 요청은 못 막는다. `errorPolicy`만으로 두 경로를 모두 막을 수 있어 핫픽스 범위를 최소로 유지했다.
- 같은 champions 영역의 `[format]/page.tsx`와 `tier/page.tsx`가 이미 `errorPolicy: 'all'`을 쓰고 있어 패턴을 맞췄다.
- `errorPolicy: 'all'`은 검색어 에러뿐 아니라 리졸버의 모든 GraphQL 에러를 빈 목록으로 바꾼다. 그래서 검색어 없는 기본 URL도 리졸버 에러 시 500 대신 200과 빈 목록이 된다. 핫픽스 범위라 그대로 두었고, 검색어가 있을 때만 적용하는 방안과 에러 로깅은 후속으로 검토한다. 네트워크 에러(백엔드 다운)는 지금처럼 500이 유지된다.

## 🔍 검증

- `tsc --noEmit`, `eslint`, `prettier --check` 통과
- QA 종합 검증(lint-check·code-review·a11y-check·seo-audit) 수행. code-review가 `/list?name=` 누락을 지적해 이 변경에 반영했다.
- **확인하지 않은 것**: 백엔드(#30~#32)를 아직 배포하지 않아 상한 초과 요청을 실제로 보내 보지 못했다. 배포 후 `/list?name=`, `/moves?search=`, `/champions/double/list?search=` 뒤에 31자 이상 문자열을 붙여 요청했을 때 200과 빈 목록이 오는지 확인이 필요하다.

## 📌 참고 사항

- 참고: [Apollo Client — Error policies](https://www.apollographql.com/docs/react/data/error-handling#graphql-error-policies)
- 이 변경을 main에 머지한 뒤 진행 중인 `feature/1.62.0`에도 반영해야 한다.
