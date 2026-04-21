---
slug: fix-champions-og
title: '챔피언스 상세 페이지 OG 메타데이터 수정'
description: '챔피언스 포켓몬 상세 페이지에서 OG 메타데이터가 항상 이상해꽃으로 표시되던 버그를 수정했습니다.'
authors: [jsg3121, claude]
tags: [bug-fix]
---

# 챔피언스 상세 페이지 OG 메타데이터 수정

> **작업 날짜**: 2026-04-21
> **브랜치**: `feature/1.37.1-fix-champions-og`

## 작업 개요

**작업 유형**: 버그 수정
**담당**: Claude

## 작업 목표

챔피언스 포켓몬 상세 페이지에서 OG 메타데이터가 모든 포켓몬에 대해 "이상해꽃" 정보만 표시되던 버그를 수정합니다.

<!-- truncate -->

## 주요 변경사항

### 변경 1: 메타데이터 쿼리 변경

**문제 원인**:
- 메타데이터 생성 함수에서 `GetChampionsPokemonListDocument`를 사용하여 `search` 필터로 ID를 검색
- `search` 필터는 텍스트 검색용으로, 숫자 ID를 문자열로 넘기면 의도한 포켓몬이 아닌 결과가 반환됨

**변경 전**:
```typescript
import { GetChampionsPokemonListDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables,
} from '~/graphql/typeGenerated'

const { data } = await apolloClient.query<
  GetChampionsPokemonListQuery,
  GetChampionsPokemonListQueryVariables
>({
  query: GetChampionsPokemonListDocument,
  variables: {
    input: {
      filter: { search: String(pokemonId) },
      pagination: { first: 1 },
    },
  },
})

const pokemon = data?.getChampionsPokemonList?.edges?.[0]?.node
```

**변경 후**:
```typescript
import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
} from '~/graphql/typeGenerated'

const { data } = await apolloClient.query<
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables
>({
  query: GetChampionsPokemonDetailDocument,
  variables: { externalDexId: pokemonId },
})

const pokemon = data?.getChampionsPokemonDetail?.pokemon
```

## 기술적 세부사항

### 수정된 파일

- `src/app/champions/list/[pokemonId]/_metadata/generateChampionsDetailMetadata.ts`

### 수정 내용

- 상세 페이지(`page.tsx`)와 동일하게 `GetChampionsPokemonDetailDocument` 쿼리 사용
- `externalDexId`로 직접 포켓몬 조회하여 정확한 메타데이터 생성

## 참고 사항

- 상세 페이지의 데이터 조회 로직과 메타데이터 조회 로직이 일관성 있게 동일한 쿼리를 사용하도록 변경됨
