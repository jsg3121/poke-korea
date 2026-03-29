---
slug: gmax-move-text-size
title: '거다이맥스 전용 기술 정보 텍스트 크기 수정'
description: '거다이맥스 전용 기술 정보 영역의 기술명 텍스트 크기와 레이아웃을 데스크톱/모바일에서 각각 조정하여 가독성을 개선했습니다.'
authors: [jsg3121, claude]
tags: [ux, css]
---

# 거다이맥스 전용 기술 정보 텍스트 크기 수정

> **작업 날짜**: 2026-03-29
> **브랜치**: `feature/1.34.1`

## 📋 작업 개요

**작업 유형**: 디자인 변경
**담당**: jsg3121, claude

## 🎯 작업 목표

거다이맥스 전용 기술 정보 영역에서 기술명 텍스트가 주변 요소와 크기 차이가 부족하여 눈에 잘 띄지 않는 문제를 개선합니다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 데스크톱 — 기술명 텍스트 크기 확대

기술명 텍스트를 `text-base` → `text-xl`로 변경하여 가독성을 향상시켰습니다.

**변경 전**:

```tsx
<td className="text-center font-semibold">{gmaxMove.nameKo}</td>
```

**변경 후**:

```tsx
<td className="text-center font-semibold text-xl">{gmaxMove.nameKo}</td>
```

### 변경 2: 모바일 — 기술명 텍스트 크기 및 레이아웃 조정

기술명 텍스트를 `text-base` → `text-lg`로 변경하고, 행 높이와 하단 border를 추가하여 시각적 구분을 강화했습니다. 또한 "기술 효과", "다이맥스 기술 정보" 제목을 `text-[1.25rem]` → `text-base`로 조정하여 본문과의 균형을 맞췄습니다.

**변경 전**:

```tsx
<tr className="h-8 [&>td]:align-middle text-base">
  <td className="text-center font-semibold">{gmaxMove.nameKo}</td>
```

**변경 후**:

```tsx
<tr className="h-10 [&>td]:align-middle text-base border-b border-solid border-primary-3">
  <td className="text-center font-semibold text-lg">
    {gmaxMove.nameKo}
  </td>
```

## 📊 최적화 결과

| 항목                    | 변경 전                 | 변경 후            |
| ----------------------- | ----------------------- | ------------------ |
| 데스크톱 기술명 텍스트  | `text-base` (16px)      | `text-xl` (20px)   |
| 모바일 기술명 텍스트    | `text-base` (16px)      | `text-lg` (18px)   |
| 모바일 행 높이          | `h-8` (32px)            | `h-10` (40px)      |
| 모바일 행 하단 border   | 없음                    | `border-primary-3` |
| 모바일 섹션 제목 텍스트 | `text-[1.25rem]` (20px) | `text-base` (16px) |

## 🔧 기술적 세부사항

### 수정된 파일

| 파일                                                                                        | 변경 내용                                                       |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `src/container/desktop/detail/detail.baseInfo/baseInfo.gmaxMove/GmaxMoveInfo.component.tsx` | 기술명 `text-xl` 추가                                           |
| `src/container/mobile/detail/detail.baseInfo/baseInfo.gmaxMove/GmaxMoveInfo.component.tsx`  | 기술명 `text-lg` 추가, 행 높이·border 조정, 섹션 제목 크기 조정 |

## 📌 참고 사항

- 데스크톱과 모바일에서 각각 디바이스에 적합한 텍스트 크기를 적용하여 반응형 일관성 유지
- 모바일에서 섹션 제목(`text-[1.25rem]` → `text-base`)을 줄인 것은 기술명과의 시각적 위계를 맞추기 위함
