---
slug: type-filter-ui
title: '타입 필터 UI 통일 — 타입명 상시 노출 및 원본색 표현'
description: '타입 상성 계산기·포켓몬 도감·챔피언스 도감의 타입 필터를 공유 TypeChip 원자로 통일했습니다. PC에서도 타입명을 상시 노출하고, 미선택 타입을 흑백 대신 원본색을 연하게 표현하도록 개선했습니다.'
authors: [jsg3121, claude]
tags: [ux, feature-improvement, refactoring]
---

# 타입 필터 UI 통일 — 타입명 상시 노출 및 원본색 표현

> **작업 날짜**: 2026-07-31
> **브랜치**: `feature/1.54.3-ui-type-filter`

## 📋 작업 개요

**작업 유형**: UX 개선 · 기능 개선 · 리팩토링
**담당**: jsg3121, claude

## 🎯 작업 목표

타입 필터가 쓰이는 세 화면(타입 상성 계산기, 포켓몬 도감 리스트, 챔피언스 도감 리스트)의 필터 UI를 통일하고 사용성을 개선한다.

1. **PC 화면 타입명 상시 노출** — 기존에는 데스크톱에서 hover/focus 시에만 타입명이 보여, 어떤 타입인지 아이콘만으로 구분해야 했다. 모바일처럼 타입명을 항상 표시한다.
2. **미선택 타입 색상 표현 개선** — 미선택(선택 가능) 타입을 흑백(grayscale)으로 처리하던 것을, 원본 타입색을 연하게 표현하는 방식으로 바꿔 각 타입을 색으로도 구분할 수 있게 한다.
3. **챔피언스 도감 필터 디자인 통일** — 챔피언스 도감은 자체 타입 필터(hover 툴팁 방식)를 써서 타입명이 상시 노출되지 않았다. 포켓몬 도감 리스트와 동일한 공유 `TypeChip` 원자로 교체해 디자인을 통일한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 공유 `TypeChip` 원자 — PC 타입명 상시 노출

`src/components/chip/TypeChip.component.tsx`의 라벨 `<span>`에서 데스크톱 전용 숨김 클래스(`desktop:opacity-0`, `desktop:group-hover:opacity-100`)를 제거했다. 이제 모바일·데스크톱 모두 아이콘 하단에 타입명이 항상 표시된다.

이 원자는 타입 상성 계산기, 포켓몬 도감 리스트, 기술 목록 필터가 공유하므로, 한 번의 수정으로 세 화면의 PC 타입명 노출이 동시에 적용된다.

**변경 전** (라벨 `<span>`):

```text
... desktop:text-sm desktop:opacity-0 desktop:group-hover:opacity-100 desktop:peer-focus-visible:opacity-100
```

**변경 후**:

```text
... desktop:text-sm
```

### 변경 2: 미선택 타입 아이콘 — 흑백 대신 원본색 연하게

같은 파일의 아이콘 `<span>`에서 기본(미선택) 상태의 `grayscale`을 제거했다(`opacity-40` 유지). 이제 선택 가능한 타입은 원본 타입색을 유지한 채 연하게 보이고, 선택 시 완전 불투명(`peer-checked:opacity-100`)으로 강조된다.

단, **최대 선택 수(2개) 도달 후 잠기는 미선택 타입**(`peer-disabled`)은 흑백(`grayscale`) 처리를 그대로 유지해 "선택 불가" 상태를 명확히 구분한다.

**변경 전** (아이콘 `<span>`):

```text
block h-6 w-6 grayscale opacity-40 ... peer-checked:grayscale-0 peer-checked:opacity-100 ...
```

**변경 후**:

```text
block h-6 w-6 opacity-40 ... peer-checked:opacity-100 ...
```

### 변경 3: 챔피언스 도감 타입 필터를 공유 `TypeChip`으로 교체

`src/components/champions/filter/ChampionsTypeFilter.component.tsx`가 사용하던 자체 `TypeButton`(hover 툴팁으로만 타입명 노출) 정의를 제거하고, 포켓몬 도감 리스트와 동일한 공유 `TypeChip` 원자를 렌더하도록 교체했다.

- URL 쿼리 동기화(`router.replace`, `?type=` 갱신)와 초기화 버튼 로직은 그대로 유지
- 최대 2개 선택 제약(`MAX_TYPE_SELECTION`)을 명시적으로 계산해 `active`/`disabled`를 전달
- 빈 문자열 방어(`.filter(Boolean)`)를 추가해 `type=`(빈값)일 때 빈 배열이 되도록 정리

이로써 챔피언스 도감에도 변경 1·2가 자동 적용되어, 세 화면의 타입 필터 디자인이 완전히 통일된다.

### 변경 4: 데스크톱 헤더 z-index 조정

`src/container/desktop/header/Header.container.tsx`의 헤더 내부 컨테이너 `z-index`를 `z-20` → `z-[550]`으로 높여, 상위 고정 요소와의 쌓임 순서(stacking) 문제를 해소했다.

## 🔍 영향 범위

| 화면 | 적용 내용 |
| --- | --- |
| 타입 상성 계산기 | PC 타입명 상시 노출, 미선택 원본색 연하게 |
| 포켓몬 도감 리스트 | PC 타입명 상시 노출, 미선택 원본색 연하게 |
| 기술 목록 필터 | 공유 원자 특성상 동일 적용(디자인 일관성 확보) |
| 챔피언스 도감 리스트 | 공유 `TypeChip`으로 교체 — 타입명 상시 노출 + 미선택 원본색 |

## ✅ 검증

- `npx eslint` — 수정 파일 통과
- `npx tsc --noEmit` — 타입 오류 없음

## 📝 비고

- 접근성: 타입명 라벨은 이전에도 시각적으로만 숨겨져 있었고 DOM에는 항상 존재해 스크린리더가 읽었다. 이번 변경으로 시각적으로도 상시 노출되어 접근성이 함께 개선된다.
- 챔피언스 필터가 `<button>`+`hover:scale-[1.4]`에서 공유 원자의 `<label>`+`group-hover:scale-110`으로 바뀌며 아이콘 hover 확대 정도가 도감 리스트와 동일하게 통일된다.
- 챔피언스 필터바에 타입명이 추가되면서 필터바 높이가 소폭 증가하나, sticky 컨테이너가 콘텐츠 높이에 맞춰 늘어나므로 레이아웃 깨짐은 없다.
