---
slug: desktop-header-compact
title: '데스크탑 헤더 영역 컴팩트화'
description: 'FHD 모니터(1920x911)에서 헤더가 화면의 1/3을 차지하던 문제를 해결하여 콘텐츠 영역을 확대했습니다.'
authors: [jsg3121, claude]
tags: [ux, css]
---

# 데스크탑 헤더 영역 컴팩트화

> **작업 날짜**: 2026-04-20
> **브랜치**: `main`

## 작업 개요

**작업 유형**: UX 개선
**담당**: jsg3121, claude

## 작업 목표

FHD 모니터(1920x911 해상도)에서 헤더 영역이 화면의 약 30%를 차지하여 콘텐츠 영역이 부족한 문제를 해결합니다. 데스크탑 전용 수정으로 모바일은 영향받지 않습니다.

<!-- truncate -->

## 주요 변경사항

### 1. 헤더 컨테이너 높이 축소

**변경 전**:
```tsx
<header className="w-full min-h-40 bg-primary-2 fixed left-0 top-0 z-50 pt-6">
```

**변경 후**:
```tsx
<header className="w-full min-h-28 bg-primary-2 fixed left-0 top-0 z-50 pt-3">
```

### 2. 네비게이션 바 컴팩트화

**변경 전**:
```tsx
<nav className="w-full h-16 ... mt-6 ...">
```

**변경 후**:
```tsx
<nav className="w-full h-12 ... mt-3 ...">
```

### 3. 필터 영역 높이 축소

**변경 전**:
```tsx
<section className="w-full h-[4.8rem] ...">
```

**변경 후**:
```tsx
<section className="w-full h-12 ...">
```

### 4. 챔피언스 서브네비 컴팩트화

**변경 전**:
```tsx
<nav className="w-full h-12 ... sticky top-40 ...">
```

**변경 후**:
```tsx
<nav className="w-full h-10 ... sticky top-28 ...">
```

## 최적화 결과

| 페이지 | 변경 전 | 변경 후 | 절감 |
|--------|---------|---------|------|
| 일반 도감 (`/list`) | ~220px (24%) | ~160px (18%) | **-60px** |
| 챔피언스 도감 (`/champions/list`) | ~270px (30%) | ~190px (21%) | **-80px** |

911px 높이 화면에서 포켓몬 카드가 1줄 반에서 2줄로 표시되어 콘텐츠 가시성이 향상되었습니다.

## 기술적 세부사항

### 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/container/desktop/header/Header.container.tsx` | `min-h-40` → `min-h-28`, `pt-6` → `pt-3` |
| `src/container/desktop/header/nav/HeaderNav.tsx` | `h-16` → `h-12`, `mt-6` → `mt-3`, line-height 조정 |
| `src/container/desktop/header/filter/Filter.components.tsx` | `h-[4.8rem]` → `h-12` |
| `src/components/champions/ChampionsSubNav.component.tsx` | `h-12` → `h-10`, `top-40` → `top-28` |
| `src/components/ability/AbilitySearch.component.tsx` | `md:top-40` → `md:top-28` |
| `src/components/moves/MovesSearchAndFilter.component.tsx` | `md:top-40` → `md:top-28` |
| `src/views/desktop/list/List.desktop.tsx` | wrapper `h-56` → `h-44` |
| `src/views/desktop/champions/ChampionsPokedex.desktop.tsx` | wrapper `h-40` → `h-32`, sticky 위치 조정 |
| `src/views/desktop/champions/ChampionsTier.desktop.tsx` | wrapper `h-40` → `h-32` |
| `src/views/desktop/champions/ChampionsDetail.desktop.tsx` | wrapper `h-40` → `h-32` |

## 참고 사항

- 데스크탑 전용 수정이며 모바일 UI는 영향받지 않습니다
- 모든 데스크탑 페이지(19개)에 공통 적용됩니다
- sticky 요소들의 top 값이 헤더 높이 변경에 맞춰 조정되었습니다
