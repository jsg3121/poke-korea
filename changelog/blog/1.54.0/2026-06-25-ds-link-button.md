---
slug: 1-54-0-ds-link-button
title: '[1.54.0] DS 원자 — LinkButton (이동용 CTA, Button과 스타일 공유)'
description: '페이지 이동용 CTA를 next/link 기반 DS 원자로 신규 규격화. 액션 버튼(Button)과 시각 스타일(variant/size/fullWidth/showArrow)은 buttonStyle에서 공유하되, "클릭 액션"과 "페이지 이동"의 의미를 명확히 하기 위해 별도 컴포넌트로 분리. 홈 Phase B의 인라인 CTA 교체 대상.'
authors: [jsg3121, claude]
tags: [feature, ux, css]
---

# 1.54.0 — DS 원자: LinkButton

> **작업 일자**: 2026-06-25
> **작업 브랜치**: `feature/1.54.0-atomic-components-plan`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 (원자 컴포넌트 신규 구축)
**담당**: jsg3121 + Claude

[ADR-0010](../../../.claude/decisions/records/ADR-0010-atomic-first-ds-build-order.md)
원자 우선 DS 구축의 라운드 1 #2. 버튼형 CTA 중 "페이지 이동"에 해당하는 링크 CTA를 별도
원자로 규격화했다.

## 🎯 작업 목표

CTA에는 "클릭 액션"(`<button>`)과 "페이지 이동"(`<Link>`) 두 종류가 섞여 있었다. 시각은
동일하지만 의미가 다르다. 시각 스타일은 공유하되, 의미를 명확히 하기 위해 이동용 CTA를
별도 컴포넌트로 분리한다(예: "챔피언스 전체 도감 보기" 섹션 CTA).

<!-- truncate -->

## ✨ 주요 변경사항

### 1. LinkButton 원자 신규

```text
src/components/button/
├── buttonStyle.ts            # (공유) Button과 동일한 스타일 함수
├── LinkButton.component.tsx  # 이동용 CTA(next/link)
└── LinkButton.stories.tsx    # 섹션 CTA 예시 포함
```

### 2. Button과 스타일 공유, 의미 분리

| 컴포넌트 | 요소 | 용도 |
|----------|------|------|
| `Button` | `<button>` | 클릭 액션 |
| `LinkButton` | `next/link` | 페이지 이동 |

variant/size/fullWidth/showArrow는 `buttonStyle`의 `getButtonClass()`로 **동일하게
공유**한다. 중복 className 없이 시각 일관성을 유지하면서, 컴포넌트는 의미별로 나눈다.

## 🎨 디자인 변경

- Button과 동일한 토큰 기반 규격(임의값 없음, 모바일 퍼스트).
- `aria-label` 지원(아이콘만 있는 링크 등 접근성).

## 🔧 기술적 세부사항

**추가된 파일**

- `src/components/button/LinkButton.component.tsx`
- `src/components/button/LinkButton.stories.tsx`

`buttonStyle.ts`는 Button(#1)에서 추가된 것을 그대로 공유한다.

## 📌 참고 사항

- 홈 Phase B에서 인라인으로 남긴 CTA(예: HomeChampions의 "챔피언스 전체 도감 보기")는 이
  LinkButton으로 교체 예정이다(페이지 개편 2단계).
- 이 분리는 [ADR-0010](../../../.claude/decisions/records/ADR-0010-atomic-first-ds-build-order.md)의
  "시각 공유, 의미 분리" 철학을 따른다.
