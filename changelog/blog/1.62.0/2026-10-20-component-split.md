---
slug: component-split
title: '파일 하나에 컴포넌트 하나 — 규칙 정리와 기존 파일 분리'
description: '컴포넌트 파일에는 JSX 컴포넌트 하나와 그 컴포넌트만 쓰는 정적 상수만 두고, 훅·유틸은 위치별 폴더로 분리하는 규칙을 정하고 기존 다중 컴포넌트 파일 11곳을 정리했습니다.'
authors: [jsg3121, claude]
tags: [refactoring]
---

# 파일 하나에 컴포넌트 하나 — 규칙 정리와 기존 파일 분리

> **작업 날짜**: 2026-10-20
> **브랜치**: `feature/1.62.0-type-name-input`

## 📋 작업 개요

**작업 유형**: 리팩토링
**담당**: jsg3121, claude

## 🎯 작업 목표

컴포넌트 파일의 구성 규칙을 정하고, 규칙에 어긋나던 기존 파일을 동작 변화 없이 분리한다.

<!-- truncate -->

## 📉 왜 필요했나

- 상성 계산기 이름 입력을 만들면서 검색 훅·정렬 함수·하위 행 컴포넌트를 컨테이너와 패널 파일 안에 함께 두었다가 파일이 비대해졌다.
- 기존 지침의 "한 컴포넌트에서만 쓰면 그 파일 안에 둔다"가 훅·함수까지 컴포넌트 파일에 넣으라는 뜻으로 읽힐 여지가 있었다.
- 같은 형태(한 파일에 컴포넌트 2개 이상)가 기존 코드 11곳에 있었다.

## ✨ 주요 변경사항

### 변경 1: 지침 (`structure.md`, `coding.md`)

- **파일 하나에 컴포넌트 하나**: JSX를 반환하는 컴포넌트는 파일당 하나. 파일 최상단에는 그 컴포넌트에서만 쓰는 정적 상수만 둔다.
- 훅·유틸은 한 곳에서만 쓰여도 컴포넌트 위치의 `hooks/`·`utils/` 폴더로 뺀다. 상수·훅·유틸·모듈 모두 두 곳 이상 쓰이면 감싸는 도메인(`shared/`) 또는 전역으로 올린다.
- **컴포넌트 본문 순서**: 훅 → 계산 변수 → 핸들러 → `useEffect` → `return`.
- **GraphQL 데이터는 쿼리 결과 타입으로 받는다**: 스키마 전체 타입 대신 실제 요청한 필드만 담은 타입을 쓴다.

### 변경 2: 기존 파일 분리 (마크업·클래스·동작 불변)

| 원래 파일 | 분리 결과 |
| --- | --- |
| `TypeCalculatorResult` | `TypeResultSection` |
| `TypeMatchup` | `TypeMatchupSection` |
| `StatBar` | `StatBarAnimatedValue` |
| `MoveTable` | `MoveTableStat`, 열 너비 상수는 `moveTable/shared/` |
| `FilterModal` | `FilterModalForm` |
| `ChampionsMonthFilter` | `ChampionsMonthFilterSelect`, `formatMonthLabel`은 `champions/utils/` |
| `DetailSpecSection` | `DetailBodySpecSection`, `DetailBreedingSpecSection`, 공통 클래스 상수는 `detail/shared/` |
| `SpecGauge` | `CaptureRateGauge`, `GenderBar` |
| `MoveDescription` | `MoveEffectDescription`, `MoveConceptNote` |
| `DetailFormRow` | `DetailWebpFormIcon`, 링크 클래스 헬퍼는 `detail/utils/` |
| `DetailMovesHero` | `DetailMovesFormSlideLink` |

import하는 곳은 모두 새 경로로 바꿨다.

## 🔍 검증

- `tsc --noEmit`, 변경 폴더 ESLint·Prettier 통과
- dev 서버 요청: `/detail/6`·`/detail/6/moves`·`/list`·`/moves`·`/champions/tournaments`·`/champions/single/tier`·`/type-effectiveness` 모두 200, 상세 스펙(포획률·성비)과 대회 월별 필터가 렌더되는 것 확인
- **확인하지 않은 것**: 각 화면의 시각 비교(마크업을 바꾸지 않아 생략)
