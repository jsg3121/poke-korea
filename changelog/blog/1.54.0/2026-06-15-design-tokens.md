---
slug: 1-54-0-design-tokens
title: '[1.54.0] 모바일 개편 Phase 0 — 디자인 토큰 체계 정비'
description: '모바일 사용성 전면 개편의 첫 작업. tailwind.config에 터치 타겟 토큰(touch 44px, touch-lg 48px)과 모바일 최소 폰트 토큰(2xs 11px)을 추가. 임의값을 쓸 수밖에 없던 영역만 최소 확장하고, 기존 토큰으로 표현 가능한 것은 신규 추가하지 않아 토큰 비대화를 방지.'
authors: [jsg3121, claude]
tags: [design, mobile, refactoring]
---

# 1.54.0 — 모바일 개편 Phase 0: 디자인 토큰 체계 정비

> **작업 일자**: 2026-06-15
> **작업 브랜치**: `feature/1.54.0-design-tokens`

## 📋 작업 개요

**작업 유형**: 디자인 토큰 확장 (모바일 개편 Phase 0 ①)
**담당**: jsg3121 + Claude

[모바일 사용성 전면 개편 기획서](/blog/1-54-0-mobile-redesign-plan)의 Phase 0 첫 작업.
이후 공용 컴포넌트·화면 작업의 기반이 될 디자인 토큰을 `tailwind.config.js`에 추가했다.

<!-- truncate -->

## 🔧 추가된 토큰

| 토큰 | 값 | 용도 | 근거 |
| --- | --- | --- | --- |
| `spacing.touch` | 2.75rem (44px) | 최소 터치 타겟 | WCAG 2.5.5 Target Size (Minimum) AA |
| `spacing.touch-lg` | 3rem (48px) | 권장 터치 타겟 | Material / Apple HIG 권장 |
| `fontSize.2xs` | 0.6875rem (11px) | 모바일 최소 폰트 | 현재 탭바 `text-[9px]`(접근성 미달) 대체용 |

사용 예: `min-h-touch min-w-touch`, `text-2xs`

## 🎯 설계 원칙 — 최소 추가

기획서의 "토큰 비대화 방지" 원칙에 따라, **실제로 없어서 임의값을 쓸 수밖에 없던 것만** 추가했다.

- 모바일 gap 토큰은 추가하지 않음 → Tailwind 기본 `gap-2`/`gap-3`/`gap-4`로 충분
- 모바일 본문/제목 fontSize 토큰은 추가하지 않음 → 기존 `sm`/`base`/`lg`로 커버

> **Why:** 기존 토큰으로 표현 가능한 값을 중복 정의하면 토큰 체계가 비대해지고 일관성이 오히려 깨진다. 정말 빈 구멍(`touch`, `2xs`)만 메운다.

## ✅ 검증

- 새 토큰 3개가 실제 Tailwind 유틸리티 클래스로 생성됨 확인 (`.text-2xs`, `.min-h-touch`, `.min-w-touch-lg`)
- 기존 색상·폰트 무드는 변경 없음 (토큰 추가만, 기존 값 수정 없음)

## 🎨 디자인 시스템 트랙

이번 토큰은 내부 디자인 시스템의 **Foundations**(기반)에 해당한다. 코드 개선과 병행하여
claude.ai/design(`poke-korea-design-system`)에 Foundations → Components → Patterns를 축적한다.

- 이번 토큰(Spacing·Typography) → Foundations 카드로 업로드 예정

## ⏭️ 다음 작업

- Foundations 카드(Colors / Typography / Spacing) claude.ai/design 업로드
- 브레이크포인트 일원화 (`md:` 27건 → `mobile:`/`desktop:`) — 별도 PR
- 공용 컴포넌트 모바일 대응 (Tag → StatChart → MobileTabBar)

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `tailwind.config.js` | spacing(touch, touch-lg), fontSize(2xs) 토큰 추가 |
