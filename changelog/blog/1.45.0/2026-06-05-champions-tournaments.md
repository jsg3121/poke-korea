---
slug: 1-45-0-champions-tournaments
title: '[1.45.0] 챔피언스 대회 페이지 Phase 5 — 목록 / 상세 / 홈 통합'
description: '챔피언스 Phase 5 — 대회 목록 + 대회 상세 페이지 신설, Phase 1 홈에 "최근 대회 결과" 섹션 통합. Top 8 입상자 + 풀빌드 슬롯 + 메달 컬러 강조. SubNav 4탭화 + sitemap 색인 등록 포함.'
authors: [jsg3121, claude]
tags: [feature, champions, seo, a11y]
---

# 1.45.0 — 챔피언스 대회 페이지 Phase 5

> **작업 일자**: 2026-06-05
> **작업 브랜치**: `feature/1.45.0-champions-tournaments`

## 📋 작업 개요

**작업 유형**: 신규 기능 + UX 개선
**담당**: jsg3121 + Claude

1.45.0 챔피언스 시리즈의 마지막 Phase. Pikalytics 사용률 메타 분석(Phase 1~4)에 이어,
실제 대회 결과(VGC 더블)로 "실전 검증된 빌드"를 제공하는 대회 페이지를 신설했다.
Phase 1 홈에도 가로 슬라이드 형태로 진입 훅을 심어 챔피언스 도메인 내 회유 동선을 강화.

<!-- truncate -->

## 🎯 사용자 결정 사항 (UX 합의)

작업 진입 전 ux-designer 에이전트를 통해 다음 결정을 모두 사용자와 합의 후 진행:

| 결정                  | 내용                                           |
| --------------------- | ---------------------------------------------- |
| 대회 목록 패턴        | 최신 N개 + 더 보기 (가장 일반적)               |
| 입상자 표시 범위      | Top 8 (대회 분위기 + 다양성 모두 확보)         |
| BSS 대응              | 페이지 자체는 만들지 않고 안내 문구만 노출     |
| 메달 컬러 적용        | A+B (외곽 카드 border + 좌상단 메달 뱃지 동시) |
| Top 4~8 펼침          | useState (client state) — 카드별 독립 동작     |
| 풀빌드 슬롯 카드 무드 | 자사 표준 (bg-primary-4) 일관성 우선           |
| 국가 표시             | 미노출                                         |
| 광고 슬롯             | Phase 5 에서는 제외                            |

## 🆕 신규 라우트

| 라우트                                | 설명                            | SEO                                           |
| ------------------------------------- | ------------------------------- | --------------------------------------------- |
| `/champions/tournaments`              | 대회 목록 (VGC 더블, 월별 필터) | BreadcrumbList + ItemList JSON-LD, 24h ISR    |
| `/champions/tournaments/[externalId]` | 대회 상세 (Top 8 + 풀빌드)      | SportsEvent + BreadcrumbList JSON-LD, 24h ISR |

- BSS 는 라우트 자체를 만들지 않고 `ChampionsBssNotice` 만 노출
- VGC 더블 메타라는 점을 명시 (`현재 VGC 더블 대회 결과만 제공합니다.`)

## 🧱 신규 컴포넌트

### 풀빌드 슬롯 카드 (`ChampionsTournamentSlotCard`)

- 자사 표준 카드 무드 (`bg-primary-4` + 2px border + outer shadow)
- 64px 포켓몬 이미지 + 이름 + 폼 뱃지 (메가/리전만, 일반 폼 뱃지는 노이즈라 제거)
- 도구 / 특성 / 테라 텍스트 라벨 통일 (이모지 제거 → 가시성/일관성 확보)
- 테라 영역 항상 reserved (`min-h-[1.5rem]`) → 카드 높이 일관성
- `dd` 안전망: `line-clamp-2 + break-keep` → 긴 한글 이름 (예: `기합의 띠`) 2줄 자연 줄바꿈
- 포켓몬 이름 클릭 시 `buildChampionsDetailHref` 로 폼별 정확한 챔피언스 상세 진입

### 입상자 카드 (`ChampionsTournamentTeamCard`)

- `variant: 'highlight' | 'compact'` 분기
- **Top 1~3 (highlight)**
  - 메달 컬러 카드 외곽 border + 50×50 원형 메달 뱃지 (좌상단)
  - 풀빌드 슬롯 6마리 펼침 고정
  - 그리드 `auto-rows-fr` + `h-full` → 카드/슬롯 높이 균일화
- **Top 4~8 (compact)**
  - 기본 접힘 + 32px 포켓몬 미리보기 줄 + "풀빌드 펼치기 ▼"
  - 그리드 자연 높이 유지 (`auto-rows-fr` 미적용) → 카드별 펼침/접힘 독립

### 그 외

- `ChampionsTournamentCard`: 목록 카드 (날짜·VGC/온라인 뱃지·대회명·참가자수·1위 팀 미리보기)
- `ChampionsBssNotice`: 항상 노출, 서버 컴포넌트
- `ChampionsMonthFilter`: URL 쿼리 동기화 드롭다운 (`?month=YYYY-MM`)
- `ChampionsRecentTournamentsSection`: Phase 1 홈 가로 슬라이드 섹션 (A 티어 슬라이드 패턴 재사용)

## 🔗 Phase 1 홈 통합

- `/champions/[format]/page.tsx` 에 `GetChampionsTournamentsWithTopTeam` 쿼리 추가
- VGC 일 때만 응답, BSS 는 빈 배열 → 홈 섹션 자동 미노출 (`tournaments.length === 0 → return null`)
- 위치: 팀 코어 페어 ↓ / 빠른 진입 카드 ↑ (UX 권장 위치)
- desktop/mobile view → container 까지 `recentTournaments` prop 전파

## 🧭 SubNav 4탭화

- `ChampionsSubNav` / `ChampionsSubNavMobile` 모두 4탭 (홈 / 도감 / 티어 / 대회)
- `/champions/tournaments` 는 포맷 세그먼트가 없으므로 (`segments[1] === 'tournaments'`)
  별도 매칭 분기 추가
- 모바일: `text-xs / px-2 / whitespace-nowrap` 로 4탭 균등 분배 시 라벨 잘림 방지

## 🗺️ sitemap

- 정적: `/champions/tournaments` 추가
- 동적: `GetChampionsTournaments` 로 VGC 대회 전체 색인
  - `lastModified = tournament.date` (대회 종료 후 결과 확정 시점)
  - `changeFrequency: 'monthly'`, `priority: 0.7`

## 🔧 GraphQL 변경

### 신규 Fragment

```graphql
fragment ChampionsTeamSlotMove on ChampionsTeamSlotMove { ... }
fragment ChampionsTeamSlot on ChampionsTeamSlot {
  pokemonId
  rawName
  displayName
  formType         # 백엔드 신규 추가 — 폼별 라우팅 활용
  formCode
  imagePath
  itemKo
  item
  abilityKo
  ability
  teraType
  moves { ... }
}
fragment ChampionsTournamentTeam on ChampionsTournamentTeam { ... }
fragment ChampionsTournamentSummary on ChampionsTournament { ... }
fragment ChampionsTournamentDetail on ChampionsTournament {
  ...ChampionsTournamentSummary
  teams { ...ChampionsTournamentTeam }
}
```

### 신규 Query

- `GetChampionsTournaments(format, limit, month)` — 목록/필터
- `GetChampionsTournamentsWithTopTeam(format, limit)` — 홈 슬라이드 (1위 팀 미리보기 포함)
- `GetChampionsTournamentDetail(externalId)` — 상세

### 유틸

- `getFormatEnumShortLabel(format: ChampionsFormat) → 'VGC' | 'BSS'`

## 🎨 UX 디테일 의사결정 (작업 중 추가 합의)

작업 진행 중 시각 검증 후 사용자가 요청한 추가 개선:

1. **도구/특성 이모지 → 텍스트 라벨**: `💎` / `✨` 가 배경(bg-primary-4)에서 묻혀 가시성↓ → 라벨 통일 + `text-primary-1 font-bold`
2. **테라 라벨 색 강화**: `text-primary-3` → `text-primary-1`
3. **슬롯 그리드 desktop 3열 → 2열 통일**: 슬롯 폭 ~115px → ~250px 확보, 말줄임 해소
4. **카드 높이 균일화 (Top 1~3)**: 테라 미보유 슬롯도 영역만 reserved → 카드 간 높이 일관
5. **Top 4~8 카드별 독립 펼침**: 한 카드 펼치면 같은 행 다른 카드까지 늘어나던 문제 해결 (`auto-rows-fr` 제거)
6. **일반 폼 '폼' 뱃지 제거**: 식별 가치 낮고 시각 노이즈 → 메가/리전 뱃지만 유지
7. **BSS 안내 항상 노출**: 닫기 버튼 + useState 제거 → 서버 컴포넌트화
8. **상세 페이지 상단**: 2단 브래드크럼 → `← 대회 목록` 단일 회귀 링크 단순화

## ✅ 검증

- `npx tsc --noEmit`: ✅ 통과
- `npm run build`: ✅ 통과
  - `/champions/tournaments` (7.82 kB)
  - `/champions/tournaments/[externalId]` (8.55 kB)
- ESLint: Phase 5 신규 파일 에러 없음 (기존 코드의 누적 prettier 경고만 잔존)

## 🔗 관련

- 이전 Phase: [Phase 1~4 + SEO 점검](./2026-06-05-champions-seo)
- 다음 단계: 1.45.0 릴리즈 PR 준비
