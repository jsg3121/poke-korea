---
slug: 1-54-0-ds-input-atoms
title: '[1.54.0] DS 원자 라운드2 — SelectInput·SearchInput·CloseIconButton'
description: '입력 컨트롤·아이콘 버튼 원자 3종을 신규 규격화. native select/search 래퍼와 모달 닫기 버튼을 토큰 기반으로 통일하고, gray/blue 비토큰 색을 primary 토큰으로 정규화. 입력 컨트롤·아이콘 버튼은 모바일 44px·데스크톱 36px로 터치타겟을 디바이스 차등(ADR-0011 확장).'
authors: [jsg3121, claude]
tags: [feature, ux, css]
---

# 1.54.0 — DS 원자 라운드2: 입력 컨트롤·아이콘 버튼

> **작업 일자**: 2026-06-29
> **작업 브랜치**: `feature/1.54.0-atomic-components-plan`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 (원자 컴포넌트 신규 구축)
**담당**: jsg3121 + Claude

[ADR-0010](../../../.claude/decisions/records/ADR-0010-atomic-first-ds-build-order.md)
원자 우선 DS 구축의 라운드2. 코드베이스 전수 조사로 실사용처가 있는 입력 컨트롤·아이콘
버튼만 원자화했다(추측 선제작 금지).

## 🎯 작업 목표

라운드1(Button·LinkButton·TabItem·Chip)에 이어, 입력 계열 원자를 정리했다. 조사 결과
Modal/Dialog는 도메인별 body 구조가 제각각이라 **원자가 아닌 조립물(organism)**로 두고,
그 구성요소 중 반복되는 닫기 버튼만 원자로 추출했다. ModalOverlay(딤 배경 한 줄)는
추상화 이득이 없어 제외하고 Modal 조립 시 인라인 처리한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 1. SelectInput (native select 래퍼)

```text
src/components/input/SelectInput.component.tsx
src/components/input/SelectInput.stories.tsx
```

- 챔피언스 select 3곳(정렬·월·팀크기)이 100% 동일 스타일이라 원자화.
- 제네릭 `<T extends string>` — `value`/`options`/`onChange`가 정확한 유니온 타입.
- 서비스 무드의 밝은 톤(`bg-primary-4 text-primary-1 border-2 border-primary-2`).
  `border-[2px]` 임의값을 `border-2` 토큰으로 정규화.

### 2. SearchInput (`<input type="search">` 래퍼)

```text
src/components/input/SearchInput.component.tsx
src/components/input/SearchInput.stories.tsx
```

- 기술·특성 검색 2곳의 `gray/blue` 비토큰 색을 primary 토큰으로 정규화.
- SelectInput과 같은 밝은 톤으로 입력 컨트롤 일관성 확보.
- 검색 로직(디바운스·쿼리 바인딩)은 사용처 책임 — 원자는 표시·입력만.

### 3. CloseIconButton (모달 닫기 아이콘 버튼)

```text
src/components/button/CloseIconButton.component.tsx
src/components/button/CloseIconButton.stories.tsx
```

- 모달 3곳의 닫기 버튼(`w-8`/`w-6`, `fill-primary-1`/`fill primary-4`, className/fill
  혼용)을 일관 규격으로 통일.
- `color`: `dark`(밝은 배경 모달용·기본) / `light`(진한 배경 모달용)로 아이콘 색 반전.
- `aria-label` 필수(아이콘만 있는 버튼), 아이콘 `aria-hidden`.

## 🎨 디자인 변경

- 입력 컨트롤·아이콘 버튼 터치타겟을 디바이스 차등(ADR-0011 확장): 모바일 44px
  (`min-h-touch`) / 데스크톱 36px(`desktop:min-h-9`). 모바일 터치는 지키고 데스크톱은
  마우스 정밀도가 높아 컴팩트하게. (SearchInput은 입력량이 많아 44px 고정.)

## 🔧 기술적 세부사항

**추가된 파일**

- `src/components/input/SelectInput.component.tsx` / `.stories.tsx`
- `src/components/input/SearchInput.component.tsx` / `.stories.tsx`
- `src/components/button/CloseIconButton.component.tsx` / `.stories.tsx`

**수정된 파일**

- `.claude/decisions/records/ADR-0011-tab-touch-target-24px.md` — 입력 컨트롤 데스크톱
  컴팩트로 범위 확장
- `.claude/conventions/guides/styling.md` — 터치 타겟 규칙에 입력 컨트롤 항목 추가

**검증**: TypeScript 타입 에러 없음, ESLint 통과.

## 📌 참고 사항

- Modal/Dialog는 조립물(organism)로 분류 — 조립 단계에서 닫기 버튼 등 원자를 합쳐 만든다.
- FloatingLabelInput·HeaderSearch도 조립물 — 라운드2 원자 범위 아님.
- 기존 사용처(챔피언스 select 3곳, 검색 2곳, 모달 닫기 3곳)는 즉시 교체하지 않는다.
  원자 구축 후 페이지 개편(2단계)에서 교체한다.
- 라운드2 원자(SelectInput·SearchInput·CloseIconButton) 구축이 이로써 마무리된다.
