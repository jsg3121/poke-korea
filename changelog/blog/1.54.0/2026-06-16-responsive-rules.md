---
slug: 1-54-0-responsive-rules
title: '[1.54.0] 1단계 완료 — 반응형 작성 규칙 정의 (모바일 퍼스트)'
description: '디자인 시스템 구축 1단계(Foundations)의 마지막 작업. styling.md에 모바일 퍼스트 반응형 작성 규칙(base=모바일/desktop: 오버라이드), 반응형 그리드 규칙, 터치·폰트 토큰 적용 규칙, 임의값 금지를 명문화. 이로써 Foundations(토큰+규칙)가 완성되어 1단계 완료.'
authors: [jsg3121, claude]
tags: [design-system, responsive, convention]
---

# 1.54.0 — 1단계 완료: 반응형 작성 규칙 정의

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-responsive-rules`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 1단계(Foundations) 마무리 — 스타일 규칙 정의
**담당**: jsg3121 + Claude

[4단계 전략](/blog/1-54-0-plan-4stage-revision)의 **1단계(디자인 시스템 구축)** 마지막
작업. 토큰·Foundations 카드는 이미 완료됐고, 남은 "반응형 작성 규칙"을 styling.md에
명문화했다. 이로써 Foundations(토큰 + 규칙)가 완성되어 **1단계가 완료**된다.

<!-- truncate -->

## 🔧 추가된 규칙 (styling.md)

### 모바일 퍼스트

| 규칙 | 내용 |
| --- | --- |
| base = 모바일 | 접두사 없는 클래스가 모바일. `desktop:`로 데스크톱 오버라이드 |
| `mobile:` 지양 | 모바일이 base이므로 원칙적으로 불필요 |
| 반응형 그리드 | `grid-cols-2 desktop:grid-cols-5` 식. `sm/md/lg/xl` 다단 난립 금지 |
| 터치 타겟 | 인터랙티브 최소 44px (`min-h-touch`) |
| 폰트 최소 | 11px(`text-2xs`) 미만 금지 |
| 임의값 금지 | `[...]` 대신 토큰. 없으면 config에 추가 후 사용 |

## 💡 왜 모바일 퍼스트인가

- 모바일 비중 55.6%로 높음 → base를 모바일로 두면 모바일에서 불필요한 오버라이드 미로드
- Tailwind가 min-width 기반이라 `desktop:` 한 방향 확장이 자연스러움
- 양방향(`mobile:`+`desktop:`) 혼용은 base가 모호해짐

> 참고: [Tailwind — Mobile First](https://tailwindcss.com/docs/responsive-design#working-mobile-first)

## ✅ 1단계 완료

| 항목 | 상태 |
| --- | --- |
| 토큰 (touch/touch-lg/2xs) | ✅ |
| Foundations 카드 (claude.ai/design) | ✅ |
| 반응형 작성 규칙 | ✅ (이번) |

→ **다음은 2단계: 페이지 단위 재디자인 + 컴포넌트 규격화** (홈부터)

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `.claude/conventions/guides/styling.md` | 모바일 퍼스트 반응형 작성 규칙 추가 |
| `.claude/specs/mobile-redesign-plan.md` | 1단계 체크리스트 완료 처리 |
