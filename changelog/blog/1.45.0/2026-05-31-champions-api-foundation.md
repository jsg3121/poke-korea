---
slug: 1-45-0-champions-api-foundation
title: '[1.45.0] 챔피언스 API 기반 작업 (Phase 0)'
description: '백엔드 신규 스키마(Smogon+Pikalytics 하이브리드)에 맞춰 GraphQL 쿼리/Fragment 갱신, 모든 호출처에 format 임시 하드코딩, 폼별 데이터 대응을 위한 key 패턴 갱신, 공용 폼 토글 컴포넌트 신설.'
authors: [jsg3121, claude]
tags: [feature, api, champions]
---

# 1.45.0 — 챔피언스 API 기반 작업 (Phase 0)

> **작업 일자**: 2026-05-31
> **작업 브랜치**: `feature/1.45.0-champions-api-foundation`

## 📋 작업 개요

**작업 유형**: GraphQL 스키마 마이그레이션 + 공용 컴포넌트 신설
**담당**: jsg3121 + Claude

`champions-frontend-implementation-plan.md` 의 Phase 0(API 기반 작업) 단계입니다. 백엔드의 신규 스키마(Smogon 직접 + Pikalytics 보완)가 배포된 상태에서 빌드 통과를 회복하고, 이후 페이지별 Phase(1~5)의 기반을 갖추는 단계입니다.

UI 변경은 없으며, 모든 챔피언스 페이지가 VGC 데이터로 정상 동작합니다.

<!-- truncate -->

## 🎯 작업 항목

### 1. GraphQL 쿼리 시그니처 갱신 (6개)

| 쿼리 | 변경 |
| --- | --- |
| `GetChampionsPokemonList` | `input` nullable → required |
| `GetChampionsMetaStats` | `externalDexId: Int!` → `input: ChampionsMetaStatsInput!` |
| `GetChampionsMetaSummary` (인자 없는 버전) | **삭제** (백엔드 스키마 제거) |
| `GetChampionsMetaSummaryByFilter` | `filter` nullable → required |
| `GetBestChampionsPokemon` | `format: ChampionsFormat!` 인자 추가 |
| `GetChampionsPokemonDetail` | `externalDexId: Int!` → `pokemonId/format/formCode/rating/month` 5개 인자 |

### 2. Fragment 갱신

- `ChampionsMetaStats`: `formCode`, `usageRank`, `usageByRating`, `evSpreads`, `counters` 5개 필드 추가
- `ChampionsMetaSummary`: `formCode`, `usageRank` 추가
- `ChampionsMetaPartner`: `formCode`, `rawName` 추가 + `pokemonId` nullable로 자동 갱신
- `ChampionsPokemonDetail.meta`: 위와 동일하게 신규 필드 추가
- **신규 Fragment 3개**: `ChampionsUsageByRating`, `ChampionsEvSpread`, `ChampionsCounter`

### 3. 호출처 빌드 에러 해소 (10개 위치)

다음 위치에 `format: ChampionsFormat.VGC_DOUBLES` 임시 하드코딩 + `TODO(Phase N): format을 라우트 파라미터에서 가져오기` 주석 추가. 각 Phase에서 자연 제거 예정.

| 파일 | 처리 |
| --- | --- |
| `src/app/champions/page.tsx` | `getBestChampionsPokemon` 호출 |
| `src/app/champions/list/page.tsx` | `getChampionsPokemonList` 호출 |
| `src/app/champions/list/[pokemonId]/page.tsx` | `getChampionsPokemonDetail` 호출 + `externalDexId` → `pokemonId` 변수명 |
| `src/app/champions/list/[pokemonId]/_metadata/generateChampionsDetailMetadata.ts` | 동상 |
| `src/app/champions/tier/page.tsx` | `GetChampionsMetaSummary` → `GetChampionsMetaSummaryByFilter` 교체 |
| `src/app/champions/_metadata/championsMetadata.ts` | sitemap용 totalCount 호출 |
| `src/app/page.tsx` | 메인 홈의 S 티어 추천 호출 |
| `src/app/sitemap.ts` | sitemap 챔피언스 포켓몬 호출 |
| `src/context/ChampionsPokedex.context.tsx` | 리스트 페이지 (초기 + fetchMore) |

### 4. 공용 컴포넌트 신설

- `src/components/champions/ChampionsFormatTab.component.tsx`: VGC/BSS 탭 토글. Phase 1~4 페이지에서 재사용.

### 5. Partner nullable 처리

`ChampionsMetaPartner.pokemonId` 가 nullable로 바뀌어 챔피언스 외 일반 포켓몬 카운터/파트너 노출 가능. `ChampionsPartnerList` 컴포넌트가 `pokemonId` null일 때 링크 없이 영문/한글 폴백으로 표시하도록 조정.

### 6. 폼별 데이터 대응을 위한 key 패턴 갱신 (5곳)

신규 백엔드는 같은 `pokemonId` 에 대해 폼별(BASE/MEGA/REGION 등) 별개 row를 반환합니다. 이전의 `key={pokemon.pokemonId}` 가 중복 경고를 발생시켜 다음 5곳을 아래 패턴으로 변경:

```tsx
key={`${pokemonId}-${formCode ?? 'base'}`}
```

- `ChampionsTierGroup.component.tsx`
- `HomeChampions.container.tsx` (desktop/mobile)
- `ChampionsHome.container.tsx` (desktop/mobile)

## ✅ 검증

- `npm run lint`: 챔피언스 관련 신규 경고 없음 (기존 경고 외)
- `tsc --noEmit`: 통과
- `npm run build`: 성공
- dev server에서 4개 페이지(`/champions`, `/champions/list`, `/champions/tier`, `/champions/list/[pokemonId]`) 정상 진입 확인 + 도감 리스트 fetchMore 정상 동작

## ⚠️ 알려진 한계 (Phase 4 또는 백엔드 응답 후 처리)

- **메가/리전 폼 이미지 경로 누락**: 백엔드 `imagePath` 응답이 자사 CDN 경로 컨벤션과 어긋나 일부 이미지가 깨짐. 백엔드 작업 중 확인 후 Phase 4 (상세 페이지) 또는 자체 CDN 매핑 로직으로 대응 예정.

## 🔜 후속 작업

| Phase | 작업 브랜치 | 내용 |
| --- | --- | --- |
| Phase 1 | `feature/1.45.0-champions-home` | 챔피언스 홈 (`/champions/[format]` 라우트, 팀 코어 섹션) |
| Phase 2 | `feature/1.45.0-champions-list` | 챔피언스 리스트 (`usageRank` 노출) |
| Phase 3 | `feature/1.45.0-champions-tier` | 챔피언스 티어 (폼별 분리 노출) |
| Phase 4 | `feature/1.45.0-champions-detail` | 챔피언스 상세 (EV/카운터/레이팅별 사용률 신규 섹션, 폼 라우트 5개) |
| Phase 5 | `feature/1.45.0-champions-tournaments` | 대회 신규 페이지 |
