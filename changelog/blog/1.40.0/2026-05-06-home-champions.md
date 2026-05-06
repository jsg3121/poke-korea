---
slug: home-champions
title: '홈 페이지 인기 챔피언스 포켓몬 섹션 추가'
description: '메인 홈에 챔피언스 S 티어 사용률 상위 3개 포켓몬을 노출하는 섹션을 신설했습니다. 카드 클릭 시 챔피언스 상세 페이지로 이동하며 기존 콘텐츠는 유지됩니다.'
authors: [jsg3121, claude]
tags: [feature-improvement, traffic-growth]
---

# 홈 페이지 인기 챔피언스 포켓몬 섹션 추가

> **작업 날짜**: 2026-05-06
> **브랜치**: `feature/1.40.0-home-champions`

## 작업 개요

**작업 유형**: UX 개선 / 트래픽 성장
**담당**: Claude
**연관 분석**: `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` (단계 C-3)

## 작업 목표

챔피언스 페이지군은 출시(2026-04-08) 후 한 달이 안 된 시점에 30일 활성 사용자 3,494명이라는 안정적 트래픽 기반을 확보했지만, 메인 홈에서 챔피언스로의 인입 경로는 헤더 메뉴를 통한 간접 진입에 한정되어 있었습니다. 챔피언스 모바일 출시(2026 여름)에 대비해 메인 홈에 직접 진입점을 추가하면서, 기존 "오늘의 포켓몬" 콘텐츠는 유지하여 메인 홈 콘텐츠를 풍부하게 합니다.

<!-- truncate -->

## 주요 변경사항

### 1. 신규 "인기 챔피언스 포켓몬" 섹션

홈 페이지 구조 변경:

**변경 전**:

```text
헤더 → 광고 배너 → 오늘의 포켓몬 → 퀴즈 → 푸터
```

**변경 후**:

```text
헤더 → 광고 배너 → 인기 챔피언스 포켓몬 (신규) → 오늘의 포켓몬 → 퀴즈 → 푸터
```

광고 배너 직후에 배치하여 챔피언스에 관심도가 높은 사용자가 즉시 발견할 수 있도록 합니다.

### 2. 노출 데이터

- **티어 필터**: S 티어
- **개수**: 사용률(usageRate) 내림차순 상위 3개
- **카드 클릭 시 이동**: `/champions/list/{pokemonId}` (챔피언스 상세 페이지)
- **하단 CTA**: "챔피언스 전체 도감 보기 →" → `/champions/list`

### 3. 챔피언스 홈과의 차별화

| 페이지 | 노출 범위 | 의도 |
| --- | --- | --- |
| 메인 홈 (`/`) | S 티어 Top 3 | "지금 메타에 강한 포켓몬 빠른 스캔" |
| 챔피언스 홈 (`/champions`) | S~D 티어 전체 Top 10 | "전체 메타 분석/탐색" |

두 페이지가 콘텐츠는 일부 겹치지만 노출 범위와 의도가 명확히 분리됩니다.

### 4. 데이터 없음 처리

`getChampionsMetaSummary` 응답이 0개일 경우 섹션 자체가 자동 숨김 처리됩니다. 일시적 메타 데이터 이슈에서도 빈 섹션이 노출되지 않습니다.

## 기술적 세부사항

### 신규 GraphQL 쿼리

기존 `GetChampionsMetaSummary`(필터 없음, 챔피언스 홈에서 사용)는 그대로 두고, 필터를 받는 쿼리를 별도 추가하여 호출처별로 분리합니다.

```graphql
query GetChampionsMetaSummaryByFilter(
  $filter: ChampionsMetaSummaryFilterInput
) {
  getChampionsMetaSummary(filter: $filter) {
    ...ChampionsMetaSummary
  }
}
```

`ChampionsMetaSummaryFilterInput`에 이미 정의되어 있던 `tier`(S/A/B/C/D), `limit` 필드를 활용하므로 백엔드 작업은 불필요합니다.

### 신규 컴포넌트

| 파일 | 역할 |
| --- | --- |
| `src/container/desktop/home/home.champions/HomeChampions.container.tsx` | 데스크톱 (3열 그리드) |
| `src/container/mobile/home/home.champions/HomeChampions.container.tsx` | 모바일 (세로 스택) |

### 기존 자산 재활용

- `ChampionsTopCard` 컴포넌트 그대로 재활용 (이미 `/champions/list/{id}`로 이동)
- 챔피언스 홈에서 사용하는 카드 패턴과 동일하여 시각적 일관성 유지

### 수정 파일

| 파일 | 변경 |
| --- | --- |
| `src/app/page.tsx` | 챔피언스 데이터 페치 + props 전달 |
| `src/views/desktop/home/Home.desktop.tsx` | `<HomeChampionsContainer />` 통합 + props 추가 |
| `src/views/mobile/home/Home.mobile.tsx` | 동일 |
| `src/gql/query.graphql` | `GetChampionsMetaSummaryByFilter` 쿼리 추가 |

## 기대 효과 (추정)

- 챔피언스 페이지군 인입 경로 추가 → 30일 활성 사용자 3,494 → 모바일 출시 시기 8,000~15,000 추가 성장 가능성
- 메인 홈 콘텐츠 다양화 (오늘의 포켓몬은 유지)
- 일반 사용자(오늘의 포켓몬 관심) + 대전 사용자(챔피언스 관심) 페르소나 모두 커버
- 효과 측정은 프로덕션 배포 후 4~8주 동안 GA4의 `/champions/list/*` 인입 경로에서 확인

## 의도적 결정 사항

### 정렬 기준: 사용률 (승률 미사용)

`ChampionsMetaSummaryFragment`에 `winRate` 필드도 정의되어 있지만, 사용자 의견으로 사용률만 활용합니다. "지금 메타에서 가장 많이 쓰이는" 직관이 강하고, 챔피언스 홈의 Top 10과 정렬 기준을 통일합니다.

### 캐싱: force-dynamic 유지

기존 홈 페이지는 `force-dynamic`(매 요청 SSR)이며 본 변경에서도 유지합니다. 챔피언스 메타는 외부 데이터 갱신 주기에 따라 변동되므로 항상 최신 정보를 노출하는 게 적합하며, 추가 부하는 쿼리 1개 정도라 미미합니다.

### 영역 추가 vs 기존 콘텐츠 교체

초기 검토에서 "오늘의 포켓몬" 영역을 챔피언스 추천으로 교체하는 안도 있었으나, 다음 두 우려로 영역 추가 방식을 채택했습니다:

1. **메인 홈 콘텐츠 부족 우려**: 교체 시 홈 콘텐츠가 줄어듦
2. **챔피언스 홈과 중복**: 챔피언스 홈의 Top 10 영역과 콘텐츠가 거의 동일해짐

영역 추가 방식은 두 우려를 동시에 해결하면서 같은 인입 효과를 냅니다.

## 후속 작업

- **C-4**: 퀴즈 가시성 개선 (상위 트래픽 페이지에 퀴즈 배너)
- **C-5**: 메가진화 일람 페이지 신설
