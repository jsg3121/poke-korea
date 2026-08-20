---
slug: pokemon-card-stat-weight
title: '포켓몬 카드 능력치 수치 굵기 적용'
description: '도감 카드의 능력치 영역에서 라벨과 수치가 같은 굵기라 위계가 없던 문제를, 수치에 font-bold를 적용해 구분되도록 했습니다.'
authors: [jsg3121, claude]
tags: [ux, css]
---

# 포켓몬 카드 능력치 수치 굵기 적용

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 디자인 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

DS 포켓몬 카드(`variant="pokedex"`)의 능력치 영역에서 **라벨과 수치가 같은 굵기**로 렌더돼 위계가 없었다. 카드를 스캔할 때 둘이 뭉쳐 보인다.

<!-- truncate -->

## ✨ 주요 변경사항

### 문제: `dt`와 `dd`가 동일 스타일

```tsx
<dt className="… text-2xs desktop:text-sm leading-4 …">{label}</dt>
<dd className="… text-2xs desktop:text-sm leading-4 … text-black">{값}</dd>
```

크기·굵기·행간이 모두 같아, 정보 위계상 주인공인 수치가 라벨과 구분되지 않았다.

### 변경: 수치에 `font-bold`

```diff
- <dd className="… text-right text-black">
+ <dd className="… text-right font-bold text-black">
```

프로젝트에 이미 확립된 패턴을 따랐다. `MoveTable`의 `MoveStat`도 라벨은 약하게 두고 수치를 `<b className="font-bold">`로 강조한다.

> **Why 색은 건드리지 않았나:** 카드 배경이 타입별 그라데이션이라 색을 바꾸면 **타입마다 대비가 달라진다.** 굵기만으로도 위계는 충분히 생기고, 대비 리스크는 없다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 능력치 수치 | 라벨과 동일 굵기 | `font-bold` |
| 색상 | `text-black` | 유지 |

## 🔧 기술적 세부사항

**수정 파일**

- `src/components/pokemonCard/PokemonCard.component.tsx`

**영향 범위**

`variant="pokedex"`를 쓰는 두 화면에 적용된다.

- 홈 "오늘의 포켓몬" (`HomeDailyPokemon.container.tsx`)
- 도감 목록 (`ListGrid.container.tsx`)

`variant`가 다른 사용처는 능력치 영역 자체를 렌더하지 않아 영향이 없다.

## 📌 참고 사항

- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0
- 실측: `/list` 렌더 결과에서 능력치 `dd` 120개 전부 `font-bold` 적용 확인
