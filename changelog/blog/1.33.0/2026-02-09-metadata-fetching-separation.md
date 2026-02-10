---
slug: metadata-fetching-separation
title: generateMetadata 분리
authors: [jsg3121, claude]
tags: [refactoring, nextjs]
---

# generateMetadata 분리 (metadata-fetching-separation)

## 📋 작업 개요

**브랜치**: `feature/1.33.0-metadata-fetching-separation`
**작업 유형**: 리팩토링
**작업 기간**: 2026-02-09
**담당**: Claude Code

<!-- truncate -->

## 🎯 작업 목표

Phase 1(data-fetching-separation)에서 페이지 컴포넌트의 쿼리를 `_fetch/` 모듈로 분리했으나, `generateMetadata` 함수의 인라인 쿼리는 그대로 남아있었음.

- **Phase 2-A**: `generateMetadata` 함수 내 GraphQL 쿼리를 `_fetch/` 모듈로 분리하여 코드 중복 제거
- **Phase 2-B**: detail/moves 기본 4개 페이지의 `generateMetadata` 함수 본문(fetch + title/description 구성 + Metadata 반환)을 `_metadata/` 모듈로 통째 분리

## ✨ 주요 변경사항

### 변경 1: `defaultMovesMetadata.fetch.ts` 생성

detail/moves 5개 페이지(기본 4개 + form 1개)의 `generateMetadata`가 공유하는 메타데이터 전용 fetch 함수.

- `GetDetailMovesPokemonInfo` → `isFormChange` 확인
- `GetVersionGroups` (isNormalForm 조건부 필터)
- `GetPokemonNormalFormMetadata` (경량 쿼리: id, name만)

**매개변수 설계:**

- `activeType` 미전달 시: `isNormalForm` 기반 조건부 필터 (기본 4개 페이지)
- `activeType: 'NORMAL'` 전달 시: 항상 NORMAL 타입 적용 (form 페이지)

### 변경 2: `moveDetailMetadata.fetch.ts` 생성

moves/[id] 2개 페이지의 `generateMetadata`가 공유하는 메타데이터 전용 fetch 함수.

- `GetPokemonSkillDetail` 1개 쿼리만 실행 (포켓몬 리스트 쿼리 불필요)

### 변경 3: 기존 fetch 모듈 재사용

- **region 페이지**: 기존 `fetchRegionMovesQueries` 직접 재사용 (동일한 쿼리 패턴)
- **ability 페이지**: 기존 `fetchAbilityDetailQueries({ first: 1 })` 재사용

### 변경 4: 9개 page.tsx의 `generateMetadata` 인라인 쿼리 제거

각 page.tsx에서 `initializeApollo()` + GraphQL 쿼리 실행 코드를 `_fetch` 모듈 호출로 교체.

**변경 전:**

```typescript
const apolloClient = initializeApollo()
const { data: pokemonDetail } = await apolloClient.query<...>({...})
const [{ data: versionInfo }, { data: normalFormData }] = await Promise.all([...])
```

**변경 후:**

```typescript
const { pokemonDetail, isNormalForm, versionInfo, normalFormData } =
  await fetchDefaultMovesMetadata({ pokemonId })
```

### 변경 5: `generateMovesMetadata.ts` 생성 (Phase 2-B)

detail/moves 기본 4개 페이지의 `generateMetadata` 함수 본문을 통째로 분리한 공통 메타데이터 생성 함수.

- `fetchDefaultMovesMetadata` 호출 (데이터 fetch)
- `pokemonName` 도출 (isNormalForm 기반)
- `title` / `description` 구성
- `Metadata` 객체 반환 (OG, canonical, robots)

**매개변수 설계:**

- `pokemonId`: 포켓몬 ID
- `movesType`: `'LEVELUP' | 'MACHINE'` → title 키워드 결정 (레벨업/머신 습득)
- `versionGroupId?`: version 페이지에서만 전달 → `.find()` vs `[0]` 선택
- `canonicalPath`: 각 page.tsx에서 직접 구성

**변경 전 (각 page.tsx ~40줄):**

```typescript
const { pokemonDetail, isNormalForm, versionInfo, normalFormData } =
  await fetchDefaultMovesMetadata({ pokemonId })
const version = versionInfo.getVersionGroups?.[0]
const pokemonName = isNormalForm ? ... : ...
const title = `${pokemonName}... 레벨업 습득 기술 정보`
const description = isSingleSeries ? ... : ...
return { title, description, robots, openGraph, alternates }
```

**변경 후 (각 page.tsx ~3줄):**

```typescript
return generateMovesMetadata({
  pokemonId,
  movesType: 'LEVELUP',
  canonicalPath: `/detail/${pokemonId}/moves`,
})
```

## 📊 최적화 결과

### Phase 2-A: 인라인 쿼리 제거

| 페이지                                          | 제거된 메타데이터 인라인 쿼리 줄 수 (약) |
| ----------------------------------------------- | ---------------------------------------- |
| `detail/.../moves/page.tsx`                     | ~40줄                                    |
| `detail/.../moves/machine/page.tsx`             | ~40줄                                    |
| `detail/.../moves/version/.../page.tsx`         | ~40줄                                    |
| `detail/.../moves/version/.../machine/page.tsx` | ~40줄                                    |
| `detail/.../moves/form/.../page.tsx`            | ~40줄                                    |
| `detail/.../moves/region/.../page.tsx`          | ~50줄                                    |
| `moves/[id]/page.tsx`                           | ~18줄                                    |
| `moves/[id]/generation/.../page.tsx`            | ~18줄                                    |
| `ability/[id]/page.tsx`                         | ~20줄                                    |

**Import 정리**: 각 page.tsx에서 `initializeApollo`, GraphQL Document/Query/QueryVariables 타입 import 제거

### Phase 2-B: generateMetadata 함수 본문 통합

| 페이지                                          | generateMetadata 줄 수 변경           |
| ----------------------------------------------- | ------------------------------------- |
| `detail/.../moves/page.tsx`                     | ~40줄 → ~5줄 (searchParams 가드 유지) |
| `detail/.../moves/machine/page.tsx`             | ~35줄 → ~5줄                          |
| `detail/.../moves/version/.../page.tsx`         | ~40줄 → ~8줄 (versionId 파싱 유지)    |
| `detail/.../moves/version/.../machine/page.tsx` | ~40줄 → ~8줄 (versionId 파싱 유지)    |

**추가 Import 정리**: `getRobotsConfig`, `fetchDefaultMovesMetadata` → `generateMovesMetadata` 1개로 교체

## 🔧 기술적 세부사항

### 신규 파일 (3개)

- `src/app/detail/[pokemonId]/moves/_fetch/defaultMovesMetadata.fetch.ts`
- `src/app/detail/[pokemonId]/moves/_metadata/generateMovesMetadata.ts`
- `src/app/moves/[id]/_fetch/moveDetailMetadata.fetch.ts`

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

- 메타데이터 전용 fetch 함수는 페이지 컴포넌트용보다 경량 쿼리 사용 (스킬 데이터, 포켓몬 리스트 불필요)
- 기존 `_fetch/` 모듈이 동일한 쿼리 패턴인 경우 직접 재사용 (region, ability)
- `fetchPolicy` 유지: detail/moves는 `cache-first`, moves/[id]는 `network-only`
- Phase 1 구조(`_fetch/` 폴더 컨벤션)와 일관된 패턴
- `_metadata/` 폴더: fetch + 메타데이터 구성 + Metadata 반환까지 통합한 함수 배치
- 기존 `(form)/modules/generateMetadata.ts` 패턴과 동일한 설계 방향

## 📝 향후 작업

- Phase 1 + Phase 2를 합쳐 `feature/1.33.0`으로 머지
- form/region 페이지도 `_metadata/` 패턴 적용 검토 (현재는 고유 로직이 많아 개별 유지)

## 📌 참고 사항

- Phase 1(`data-fetching-separation`)에서 페이지 컴포넌트 쿼리 분리 완료 후 진행
- `detail/(form)/ 5개 페이지`는 이미 `modules/generateMetadata.ts`로 분리되어 있어 추가 작업 불필요
