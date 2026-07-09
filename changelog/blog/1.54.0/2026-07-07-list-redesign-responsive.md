---
slug: 1-54-0-list-redesign-responsive
title: '[1.54.0] 도감 리스트 개편 — 반응형 단일 + sticky 크롬'
description: '/list를 UA 분기 데/모 2벌에서 반응형 단일로 재구축. 헤더+필터바를 단일 sticky 스택으로 통합해 카드 잘림(이중 fixed 충돌)을 해결하고, DS FilterBar/PokemonCard로 교체. 무한스크롤은 기존 방식 유지, 적용 필터 칩·빈 상태·스켈레톤 신설.'
authors: [jsg3121, claude]
tags: [feature, ux, css]
---

# 1.54.0 — 도감 리스트 개편: 반응형 단일 + DS 조립

> **작업 일자**: 2026-07-07
> **작업 브랜치**: `feature/1.54.0-list-redesign`
> **설계 근거**: [RES-002 레퍼런스 조사](/.claude/research/reports/RES-002-list-page-reference.md) · [UX-004 재설계](/.claude/research/reports/UX-004-list-redesign.md)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 2호)
**담당**: jsg3121 + Claude

홈(PR #179)에 이어 /list를 개편. 조사(RES-002) → ux-designer 설계(UX-004) → DS 시안 →
시안 피드백 7건 반영 → 구현의 사이클. FilterBar·FilterModal·TypeChip 등 이 페이지를
위해 준비했던 DS organism이 실제로 조립된 첫 페이지다.

## 🎯 해결한 문제

- **[Critical] 카드가 fixed 헤더 뒤로 파고들어 잘림** — 데스크톱은 가변 높이 헤더에
  고정 스페이서(h-44), 모바일은 검색창의 독자 fixed 레이어가 충돌하던 구조
- **UA 분기 데/모 2벌** — 뷰·컨테이너·카드·필터·헤더까지 전부 2벌(ADR-0007 위반)
- **ISR 1년 + headers() 공존** — revalidate 선언이 실효 없는 거짓 신호
- 순수 무한스크롤(푸터 접근 불가·위치 감각 상실), 모달 필터 적용 후 미표시, 빈 상태
  재시도 동선 부재

<!-- truncate -->

## ✨ 주요 변경사항

### 1. 크롬 sticky 통합 (C1 해결)

- 필터바는 헤더 내부가 아니라 **전역 헤더 아래에 이어붙는 sticky**(모바일 top-12=48px,
  데스크톱 top-28=112px)로 배치 — 스크롤 시 헤더+필터바가 하나의 블록처럼 고정되고
  카드가 뒤로 파고들지 않는다. 좌표 하드코딩(고정 스페이서·독자 fixed) 전면 제거.
- 데스크톱 전역 헤더에서 /list 조건부 구필터 주입 제거(헤더 높이 가변 원인).

### 2. 모바일 전용 리스트 헤더(240px) 제거 — 전역 헤더로 통합

- 헤더 셸은 전 페이지 완전 동일(h-12·로고 96px·인풋 h-8), **검색 동작만 /list에서
  리스트 필터(`?name=` 디바운스)로 전환**(신규 ListSearchContainer) — 데스크톱의
  MainSearch/DetailSearch 분기 패턴을 모바일에 적용해 데/모 동작 일치.

### 3. DS 조립 (반응형 단일)

| 요소 | 내용 |
|---|---|
| 필터 | 구 Filter.components 2벌 → **FilterBar/FilterModal organism** |
| 적용 필터 칩(신설) | 모달 필터(세대·메가 등) 적용분을 액션바 한 줄에 X버튼 칩으로 상시 노출 + 개별 해제(AppliedFilterChip). sticky 높이 증가 없음 |
| 카드 | 구버전 2벌 → DS PokemonCard(variant=pokedex), `grid-cols-2 desktop:grid-cols-5` 단일 |
| 빈 상태 | EmptyState + "필터 초기화" CTA(기존엔 텍스트만) |
| 로딩 | 카드 스켈레톤(크기 SSOT 공유 — CLS 방지) + role=status 알림 |

### 4. 로딩 — 순수 무한스크롤 유지

SSR 20 → 스크롤 자동 로드(무한스크롤, 구버전과 동일). 기존 ListProvider·
useInfiniteScroll 재사용(컨텍스트 변경 없음).

> 하이브리드(자동 상한 60 + "더보기" 버튼, Baymard/NN/g 근거)를 구현했으나
> 리뷰 과정에서 **기존 무한스크롤 방식 유지로 결정**(사용자 결정 2026-07-07) —
> 인지하지 못한 페이지네이션 UI가 노출되는 어색함이 근거 대비 크다고 판단.

### 5. page.tsx 재배선

- 구 뷰 2벌 렌더 제거 → 단일 ListView + 크롬 셸(홈 패턴 — UA 분기는 크롬/광고 유닛
  선택만). `revalidate=1년` 거짓 신호 제거(headers()로 인해 실효 없던 선언).

## 📌 보류/후속

- **`?page=N` SEO 페이지네이션은 이번 범위에서 제외**(사용자 결정) — 백엔드 협의와
  함께 별도 트랙. 그 전까지 검색 색인은 현행(첫 페이지) 수준 유지.
- 구버전(List.desktop/mobile, 구 컨테이너·필터·카드 2벌)은 유지 — 구버전 일괄 제거
  트랙에서 정리 예정.
- 뒤로가기 스크롤 복원 고도화(세션 기반)는 후속.

**검증**: tsc 0 · ESLint 0 · build-storybook 성공 · next build 성공.
