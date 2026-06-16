---
slug: 1-54-0-adaptive-cleanup-deadcode
title: '[1.54.0] 적응형 정리 1단계 — 죽은 미디어쿼리 제거 + 데스크톱 md: 정리'
description: 'ADR-0006 적응형 일원화의 첫 코드 작업. 모바일 전용 파일에서 발동 불가한 죽은 미디어쿼리(md:)를 제거하고, 데스크톱 전용 파일의 항상 발동하는 md:를 적용값으로 고정. 시각적 회귀 0의 안전한 정리.'
authors: [jsg3121, claude]
tags: [refactoring, mobile, adaptive]
---

# 1.54.0 — 적응형 정리 1단계: 죽은 미디어쿼리 제거

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-adaptive-cleanup`

## 📋 작업 개요

**작업 유형**: 적응형 일원화 코드 정리 (저위험)
**담당**: jsg3121 + Claude

[ADR-0006](/blog/1-54-0-adaptive-architecture)에서 확정한 적응형 아키텍처의
**첫 코드 작업**. 시각적 변화가 전혀 없는 안전한 미디어쿼리 정리부터 시작했다.

<!-- truncate -->

## 🔧 변경 내용 (3건)

### 1. 죽은 코드 제거 (모바일 파일)

```text
container/mobile/.../AbilityQuizCard.container.tsx
  text-sm md:text-base  →  text-sm
```

모바일 전용 파일은 UA 분기로 항상 모바일 폭(≤768)에서 렌더되므로 `md:`(min-768)는
**절대 발동하지 않는 죽은 코드**였다. 제거해도 렌더 결과 동일.

### 2. 데스크톱 전용 md: 고정 (2건)

```text
container/desktop/.../AbilityQuizCard.container.tsx
  text-sm md:text-base       →  text-base

container/desktop/.../TypeEffectivenessCta.component.tsx
  grid-cols-1 md:grid-cols-2 →  grid-cols-2
```

데스크톱 전용 파일은 항상 데스크톱 폭(≥769)에서 렌더되므로 `md:`가 **항상 발동**한다.
즉 미디어쿼리를 떼고 적용되던 값으로 고정해도 동일.

## ✅ 검증

- 세 변경 모두 "발동 안 함" 또는 "항상 발동"이라 **시각적 회귀 0**
- lint 통과, 프로덕션 빌드 정상

## ⏭️ 다음 작업 (카테고리별 후속 PR)

- 표현 차이 컴포넌트: `md:` 제거 + `isMobile` 조건부 클래스
- 구조 차이 컴포넌트: 뷰 분리 + Wrapper
- `getIsMobile()` 모듈 + 카드 RSC 전환
- 다단 그리드 재설계 + 데스크톱 min-width

## 📁 변경 파일

| 파일 | 변경 |
| --- | --- |
| `container/mobile/.../AbilityQuizCard.container.tsx` | 죽은 `md:text-base` 제거 |
| `container/desktop/.../AbilityQuizCard.container.tsx` | `md:text-base` → `text-base` 고정 |
| `container/desktop/.../TypeEffectivenessCta.component.tsx` | `md:grid-cols-2` → `grid-cols-2` 고정 |
