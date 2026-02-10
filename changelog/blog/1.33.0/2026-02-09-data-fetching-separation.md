---
slug: data-fetching-separation
title: 페이지 데이터 페칭 분리
authors: [claude]
tags: [refactoring, nextjs]
---

# 페이지 데이터 페칭 분리 (data-fetching-separation)

## 📋 작업 개요

**브랜치**: `feature/1.33.0-data-fetching-separation`
**작업 유형**: 리팩토링
**작업 기간**: 2026-02-09
**담당**: Claude Code

<!-- truncate -->

## 🎯 작업 목표

이전 작업(Path 기반 URL 전환)으로 moves 관련 page.tsx 파일들의 코드량이 과도하게 늘어남. 페이지 컴포넌트와 `generateMetadata` 함수에서 동일한 GraphQL 쿼리가 중복 실행되는 구조를 개선하기 위해, **쿼리 실행 로직(Promise.all)**만 별도 `_fetch/` 모듈로 분리.

## ✨ 주요 변경사항

### 변경 1: `detail/moves/_fetch/` 모듈 생성 (3개)

| 파일 | 대상 페이지 | 설명 |
|------|------------|------|
| `defaultMoves.fetch.ts` | 기본형 4개 (default, machine, version, version/machine) | `learnMethod`와 `versionGroupId`만 다른 공통 쿼리 |
| `formMoves.fetch.ts` | form 페이지 | `activeIndex` 기반 조건부 쿼리 (0이면 일반, >0이면 NormalForm) |
| `regionMoves.fetch.ts` | region 페이지 | region 전용 `GetPokemonRegionFormLearnableSkills` 쿼리 |

**변경 전** (각 page.tsx에 인라인):
```typescript
const apolloClient = initializeApollo()
const [{ data: pokemonInfoData }] = await Promise.all([...])
const isNormalForm = !!pokemonInfoData.getPokemonDetail?.isFormChange
const [{ data }, { data: normalFormLearnableSkill }, ...] = await Promise.all([...])
```

**변경 후** (page.tsx에서 호출):
```typescript
const { pokemonInfoData, isNormalForm, data, normalFormLearnableSkill, versionGroup, normalFormImageList } =
  await fetchDefaultMovesQueries({ pokemonId, learnMethod: LearnMethod['MACHINE'] })
```

### 변경 2: `moves/[id]/_fetch/moveDetail.fetch.ts` 생성

- `GetPokemonSkillDetail` + `GetPokemonsBySkill` 쿼리 공통 실행
- `moves/[id]/page.tsx` (generationId: 9)와 `generation/[generationId]/page.tsx` (동적)에서 공유

### 변경 3: `ability/[id]/_fetch/abilityDetail.fetch.ts` 생성

- `GetPokemonByAbility` 쿼리 실행
- `generateMetadata`(first: 1)와 페이지 컴포넌트(first: 20)에서 pagination만 다르게 재사용 가능

### 변경 4: 9개 page.tsx에서 인라인 쿼리 제거

각 page.tsx의 페이지 컴포넌트에서 `initializeApollo()` + GraphQL 쿼리 실행 코드를 `_fetch` 모듈 호출로 교체. `generateMetadata` 함수는 이번 단계에서 수정하지 않음.

## 📊 최적화 결과

| 페이지 | 제거된 인라인 쿼리 줄 수 (약) |
|--------|---------------------------|
| `detail/.../moves/page.tsx` | ~90줄 |
| `detail/.../moves/machine/page.tsx` | ~87줄 |
| `detail/.../moves/version/.../page.tsx` | ~80줄 |
| `detail/.../moves/version/.../machine/page.tsx` | ~80줄 |
| `detail/.../moves/form/.../page.tsx` | ~90줄 |
| `detail/.../moves/region/.../page.tsx` | ~55줄 |
| `moves/[id]/page.tsx` | ~40줄 |
| `moves/[id]/generation/.../page.tsx` | ~50줄 |
| `ability/[id]/page.tsx` | ~20줄 |

## 🔧 기술적 세부사항

### 신규 파일 (5개)

- `src/app/detail/[pokemonId]/moves/_fetch/defaultMoves.fetch.ts`
- `src/app/detail/[pokemonId]/moves/_fetch/formMoves.fetch.ts`
- `src/app/detail/[pokemonId]/moves/_fetch/regionMoves.fetch.ts`
- `src/app/moves/[id]/_fetch/moveDetail.fetch.ts`
- `src/app/ability/[id]/_fetch/abilityDetail.fetch.ts`

### 수정 파일 (9개)

- `src/app/detail/[pokemonId]/moves/page.tsx`
- `src/app/detail/[pokemonId]/moves/machine/page.tsx`
- `src/app/detail/[pokemonId]/moves/version/[versionGroupId]/page.tsx`
- `src/app/detail/[pokemonId]/moves/version/[versionGroupId]/machine/page.tsx`
- `src/app/detail/[pokemonId]/moves/form/[[...segments]]/page.tsx`
- `src/app/detail/[pokemonId]/moves/region/[[...segments]]/page.tsx`
- `src/app/moves/[id]/page.tsx`
- `src/app/moves/[id]/generation/[generationId]/page.tsx`
- `src/app/ability/[id]/page.tsx`

### 설계 원칙

- `_fetch/` 폴더명은 Next.js에서 라우트로 인식하지 않음 (`_` 접두어)
- 쿼리 실행(Promise.all)만 분리, 데이터 변환 로직(pokemonName, initialValue 등)은 page.tsx에 유지
- early return 시 `null` 필드를 명시적으로 반환하여 TypeScript union 타입 문제 해결
- 기존 `detail/(form)/modules/fetchDetailData.ts` 패턴과 일관된 구조

## 📝 향후 작업

- 2단계: `generateMetadata` 함수의 쿼리도 `_fetch` 모듈을 활용하도록 분리

## 📌 참고 사항

- `generateMetadata`는 이번 단계에서 건드리지 않음 (2단계에서 분리 예정)
- `detail/(form)/ 5개 페이지`는 이미 `fetchDetailData.ts`로 분리되어 있어 추가 작업 불필요
