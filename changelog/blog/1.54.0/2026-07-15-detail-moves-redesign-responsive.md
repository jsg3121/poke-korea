---
slug: 1-54-0-detail-moves-redesign-responsive
title: '[1.54.0] 상세 습득 기술 페이지 개편 — 반응형 단일 + 학습법 탭·버전 sticky nav'
description: '/detail/[id]/moves 하위 6개 라우트를 UA 분기 데/모 2벌에서 반응형 단일로 재구축. 레벨업/기술머신 토글을 폐기하고 path 분리(학습법 탭)로 전환, 버전 선택 nav를 헤더 아래 sticky로 올렸다. 세로 텍스트가 깨지던 MoveCard/MoveDetailCard를 폐기하고 상세 개편의 MoveTable DS를 행 클릭 링크로 재사용.'
authors: [jsg3121, claude]
tags: [feature, ux, css, a11y]
---

# 1.54.0 — 상세 습득 기술 페이지 개편: 반응형 단일 + DS 재사용

> **작업 일자**: 2026-07-15
> **작업 브랜치**: `feature/1.54.0-detail-moves-redesign`
> **설계 근거**: [UX-006 재설계](/.claude/research/reports/UX-006-detail-moves-redesign.md)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 4호, moves 그룹 A)
**담당**: jsg3121 + Claude

홈(PR #179)·리스트(PR #180)·상세 본문(PR #181)에 이어 상세의 습득 기술
하위 라우트를 개편. 상세 개편에서 트랙 B로 분리했던 `moves` 6개 라우트가
대상이다. UX-006 설계 → DS 시안 확인·피드백 → 구현의 사이클을 따랐고,
상세 개편에서 만든 MoveTable DS를 재사용(행 링크 옵션만 확장)했다.

## 🎯 해결한 문제

- **[Critical] 모바일에서 기술 카드 세로 텍스트 깨짐** — 구버전 MoveCard/
  MoveDetailCard가 좁은 폭에서 글자가 세로로 무너지던 결함의 근원. detail.moves
  전용이라 폐기해도 회귀 없음(사용처 확인)
- **레벨업/기술머신 토글로 반쪽 정보 숨김** — 습득 유형 토글은 한 번에 한
  종류만 보여 비교가 어려움. path 분리(`/moves` ↔ `/moves/machine`)로 이미
  라우트가 나뉘어 있어 학습법 탭으로 승계
- **UA 분기 데/모 2벌** — moves 6개 라우트가 데/모 뷰·컨테이너를 완전 중복
  (ADR-0007 위반). 반응형 단일로 통합, UA는 크롬(헤더/푸터/탭바) 선택만 잔존
- **버전 선택이 히어로에 묶여 스크롤 시 사라짐** — 긴 기술 표를 훑는 중
  버전을 못 바꿈. 헤더 아래 sticky 블록으로 분리

<!-- truncate -->

## ✨ 주요 변경사항

### 1. 레벨업/기술머신 = 학습법 탭 (path 분리 유지)

- 습득 유형 토글을 폐기하고 `/moves`(레벨업) ↔ `/moves/machine`(기술머신)
  **path 이동 탭**으로 전환. 기존 DS `TabItem`(underline, href 모드) 조립 —
  신규 컴포넌트 없음. active 탭은 `aria-current="page"`
- 한 페이지 = 한 학습법. 각 페이지가 개별 색인되는 기존 canonical 구조를 유지

### 2. 버전 선택 nav — 헤더 아래 sticky (페이지 전용 로컬)

- 학습법 탭 + 버전 스크롤 nav를 하나의 sticky 블록으로 묶어 전역 헤더 바로
  아래에 고정(모바일 `top-12`/데스크톱 `top-30`). 배경은 페이지색으로 채워
  스크롤 시 본문이 비쳐 보이지 않게 처리
- 버전 nav는 가로 스크롤 1줄(우측 페이드 단서) + active 자동 스크롤 인. 라벨
  텍스트("버전 그룹")는 제거하고 `aria-label`로 의미만 남김
- 각 버전은 별도 URL이라 항목이 링크(next/link). Chip(onClick 전용)으론
  커버 안 돼 **페이지 전용 로컬 컴포넌트**(`MovesVersionNav`)로 구현 —
  현재 1곳 사용이라 organism 승격 대신 컨테이너 로컬(ADR-0010). 다른 페이지
  재사용이 필요해지면 그때 `src/components/moves/`로 승격

### 3. MoveTable DS 재사용 — 행 클릭 = 기술 상세

- 상세 개편의 `MoveTable`에 `href?` 옵션만 추가(stretched-link 오버레이).
  행 전체가 기술 상세로 가는 링크가 되고, 데스크톱은 hover 배경 피드백
- 기술 상세 링크는 현재 선택 버전이 있으면 `/moves/{id}/version/{vgId}`,
  최신이면 `/moves/{id}`. 구버전의 `/generation/{genId}` 세그먼트는 존재하지
  않는 라우트(dead link)라 쓰지 않음

### 4. 요약 히어로 재구성

- 상세로 돌아가기(슬림 로컬 링크) + 식별 정보(이미지·번호·이름·타입·최초/최신
  등장 버전) + 폼 컨트롤(일반/리전 전환, 폼 인덱스 슬라이드). 구버전
  MovesHeader의 이미지 경로·폼 전환 로직을 계승하되 버전 nav는 sticky로 분리
- 반응형 세부 조정: 긴 이름(노말폼/리전폼)은 모바일 폰트 축소로 강제 줄바꿈
  완화, 폼 컨트롤은 모바일에서 한 줄 배치·크기 축소, 이미지 wrapper 반응형
  크기(figure 인라인 style 한계 우회 — 상세 Hero 정석 패턴)

## 🧱 신규/변경 파일

- **신규 뷰**: `views/detail/DetailMoves.view.tsx` (반응형 단일)
- **신규 컨테이너**: `container/detail/moves/` — `DetailMovesHero`·
  `DetailMovesStickyNav`·`DetailMovesList` + 로컬 `components/MovesVersionNav`
- **DS 확장**: `components/moveTable/MoveTable.component.tsx` — `MoveTableItem.href?`
  추가(+ story `Linkable`), 링크 행 hover 스타일
- **재배선**: moves 6개 `page.tsx`(기본·머신·폼·리전·버전·버전머신) — 구버전
  데/모 2벌 렌더 제거, 크롬만 `isMobile` 유지. 콘텐츠는 `DetailMovesView` 단일

## ✅ 검증

- `tsc --noEmit` · `eslint` · `build-storybook`(Tailwind 컴파일) 전부 통과
- 데스크톱 1280 / 모바일 375 시각 검증(사용자 로컬) — 이미지·sticky 위치·
  hover·폰트 축소·폼 컨트롤 한 줄 배치 반영

## 🔜 후속

- **구버전 일괄 제거**(별도 트랙): moves 데/모 뷰·컨테이너 + MoveCard/
  MoveDetailCard/Toggle는 홈·리스트·상세 구버전과 함께 일괄 제거 예정
  (MoveListCard는 `/moves` 목록 자산이라 보존)
- moves 그룹 B~F(ability·moves 목록/상세·type-effectiveness·champions·quiz) 잔여
- SEO(canonical·JSON-LD)는 2단계 트랙으로 유지
