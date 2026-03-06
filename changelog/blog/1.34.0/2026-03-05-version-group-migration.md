---
slug: version-group-migration
title: '기술 도감 세대 기반 → 버전 그룹 기반 마이그레이션'
description: '기술 도감의 세대(generation) 기반 구조를 버전 그룹(versionGroup) 기반으로 전환하여 동일 세대 내 버전별 기술 스펙 차이를 지원합니다.'
authors: [jsg3121, claude]
tags: [feature-improvement, graphql, seo, nextjs]
---

# 기술 도감 세대 → 버전 그룹 마이그레이션

> **작업 날짜**: 2026-03-05
> **브랜치**: `feature/1.34.0`

## 📋 작업 개요

**작업 유형**: 기능 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

백엔드 API가 기술(스킬) 데이터의 기준 단위를 **세대(generation)**에서 **버전 그룹(versionGroup)**으로 변경함에 따라 프론트엔드를 전면 마이그레이션합니다.

기존에는 같은 세대(예: 9세대) 내 모든 버전이 동일한 기술 스펙을 공유했지만, 실제로는 SV, Z-A, 메가 디멘션 등 버전별로 기술의 위력/명중률/타입 등이 다를 수 있습니다. 이번 변경으로 이러한 버전별 차이를 정확하게 표현할 수 있게 됩니다.

<!-- truncate -->

## ✨ 주요 변경사항

### 1. GraphQL 쿼리 수정

`src/gql/query.graphql`에서 세대 기반 필드를 버전 그룹 기반으로 변경했습니다.

**변경 전**:

```graphql
# GetPokemonsBySkill 응답
node {
  generationId
  pokemonId
  ...
}
```

**변경 후**:

```graphql
# GetPokemonsBySkill 응답
node {
  versionGroupId
  pokemonId
  ...
}
```

- `GetPokemonSkillDetail`: `generations` 필드에 `versionGroupId` 추가
- `GetPokemonsBySkill`: `node.generationId` → `node.versionGroupId`

### 2. URL 구조 변경

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 기술 상세 버전별 | `/moves/:id/generation/:generationId` | `/moves/:id/version/:versionGroupId` |
| 기술 리스트 필터 | `?generationId=9` | `?versionGroupId=25` |

- 기존 `/generation/` URL은 `/moves/:id`로 301 영구 리다이렉트 처리

### 3. 상수 → API 전환

버전 그룹 이름(한국어)을 하드코딩 상수 대신 `getVersionGroups` API에서 동적으로 조회합니다.

- 기술 상세 페이지: `fetchMoveDetailQueries`에서 스킬의 `generations[].versionGroupId`를 추출 후 `getVersionGroups` API 호출
- 기술 리스트 페이지: `moves/page.tsx`에서 `getVersionGroups` API 호출 후 `MovesProvider`에 전달

### 4. UI 변경

**기술 상세 페이지 탭**:

- 기존: "이전 세대 정보" 라벨 + 1~9세대 버튼
- 변경: "버전별 정보" 라벨 + API에서 받아온 버전 그룹 버튼 (게임명 한국어 표시)

**기술 리스트 필터**:

- 기존 "첫 등장 세대" 필터를 유지하되, 버전별 필터는 리스트에서 제거
- 기술 리스트에서는 `firstGenerationId` 기반 클라이언트 사이드 필터만 제공
- 버전별 필터는 기술 상세 페이지에서만 지원

### 5. SEO 수정

| 항목 | 변경 내용 |
|------|-----------|
| 메타데이터 | `generation` 파라미터 → `versionGroupId`/`versionGroupName`, "세대별" → "버전별" |
| JSON-LD | `getMoveDetailGenerationJsonLd` → `getMoveDetailVersionJsonLd`, URL 경로 변경 |
| Sitemap | 세대별 URL (기술 x 9세대) 제거, 기본 상세 URL만 유지 |
| 리다이렉트 | `/moves/:id/generation/:gen` → `/moves/:id` 301 리다이렉트 추가 |

### 6. 첫 등장 세대 필터 추가

기술 리스트에서 **첫 등장 세대** 필터를 추가했습니다.

- 백엔드 `PokemonSkillFilterInput`에 `generationId` 서버 필터 추가 → 다른 필터(타입, 유형)와 동일하게 서버 사이드 필터링
- `movesFilter`에 `generationId`를 포함하여 쿼리 요청 시 서버에서 필터링된 결과 반환
- 무한 스크롤과 정상 호환 (서버 페이지네이션 기준 `hasNextPage`/`totalCount` 그대로 사용)
- 데스크톱/모바일 모두 1~9세대 버튼 UI 제공

### 7. 기술 리스트 버전 필터 제거

기술 리스트 페이지에서 버전(`versionGroupId`) 필터를 제거했습니다.

- `FilterOptions`, `Options.desktop`, `Options.mobile`에서 버전 필터 UI 제거
- `FilterHeader`에서 `versionGroupId` 초기화 조건 제거
- `moves/page.tsx`에서 `getVersionGroups` API 호출 제거
- `Moves.context.tsx`에서 `versionGroups` prop/context 제거
- 버전별 필터는 기술 상세 페이지에서만 지원

### 8. QA 중 발견된 버그 수정

| 이슈 | 원인 | 해결 |
| ------ | ------ | ------ |
| 기술 상세에서 존재하지 않는 버전 표시 | `getVersionGroups`에 빈 필터로 전체 버전 조회 | `{ skillId }` 필터로 해당 기술이 등장한 버전만 조회 |

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 기술 상세 라우트 | `/generation/[generationId]` | `/version/[versionGroupId]` |
| 하드코딩 세대 수 | 9개 (1~9세대 고정) | API 기반 동적 |
| Sitemap URL 수 | 기술 수 x 최대 9 (세대별) | 기술 수 x 1 (기본만) |
| 상수 파일 | 별도 관리 필요 | 불필요 (API 사용) |

## 🔧 기술적 세부사항

### 수정된 파일 목록

**GraphQL & 코드 생성** (4개):

- `src/gql/query.graphql`
- `src/graphql/schema.graphql` (codegen)
- `src/graphql/gqlGenerated.ts` (codegen)
- `src/graphql/typeGenerated.ts` (codegen)

**라우트 & 페이지** (5개):

- `src/app/moves/[id]/page.tsx`
- `src/app/moves/[id]/version/[versionGroupId]/page.tsx` (신규)
- `src/app/moves/[id]/_fetch/moveDetail.fetch.ts`
- `src/app/moves/[id]/_fetch/moveDetailMetadata.fetch.ts`
- `src/app/moves/page.tsx`

**뷰 & 컨테이너** (4개):

- `src/views/desktop/moves/MoveDetail.desktop.tsx`
- `src/views/mobile/moves/MoveDetail.mobile.tsx`
- `src/container/desktop/moves/moves.detail/MoveDetail.container.tsx`
- `src/container/mobile/moves/moves.detail/MoveDetail.container.tsx`

**컴포넌트** (5개):

- `src/components/moves/MoveDetail.component.tsx`
- `src/components/moves/movesFilter/filterOptions/FilterOptions.component.tsx`
- `src/components/moves/movesFilter/filterOptions/desktop/Options.desktop.tsx`
- `src/components/moves/movesFilter/filterOptions/mobile/Options.mobile.tsx`
- `src/components/moves/movesFilter/filterHeader/FilterHeader.component.tsx`

**훅 & 컨텍스트** (2개):

- `src/hook/usePokemonsBySkill.ts`
- `src/context/Moves.context.tsx`

**SEO & 설정** (4개):

- `src/app/moves/[id]/_metadata/generateMoveDetailMetadata.ts`
- `src/constants/movesJsonLd.ts`
- `src/app/sitemap.ts`
- `next.config.js`

**삭제된 파일**:

- `src/app/moves/[id]/generation/[generationId]/page.tsx` (폴더 전체)

### 총 변경 파일: 24개 (신규 1개, 삭제 1개, 수정 22개)

## 📌 참고 사항

- 기존 `/moves/:id/generation/:generationId` URL로 접근하는 사용자는 301 리다이렉트를 통해 `/moves/:id`로 이동됩니다
- 버전 그룹 이름은 백엔드 `getVersionGroups` API에서 `nameKo` 필드로 제공됩니다
- Sitemap에서 세대별 URL을 제거했으므로, 검색 엔진이 기존 세대별 URL을 크롤링할 경우 리다이렉트를 통해 처리됩니다
