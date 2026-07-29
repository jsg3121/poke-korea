---
slug: 1-54-0-ds-pokemon-card
title: '[1.54.0] DS 컴포넌트 — Tag 신규 + PokemonCard 단일 고정 규격'
description: '디자인 시스템 카드 계열 구축. 기존 컴포넌트를 추출하지 않고 토큰 기반 신규 Tag를 만들고(WCAG 대비 반영), PokemonCard를 w-56 단일 고정 규격으로 확정. aspect-ratio 충돌로 인한 스탯 잘림을 콘텐츠 기반 높이로 해결.'
authors: [jsg3121, claude]
tags: [design-system, component]
---

# 1.54.0 — DS 컴포넌트: Tag 신규 + PokemonCard 단일 고정 규격

> **작업 일자**: 2026-06-23
> **작업 브랜치**: `feature/1.54.0-ds-pokemon-card`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 컴포넌트 신규 구축
**담당**: jsg3121 + Claude

4단계 전략의 2단계(페이지 단위 재디자인 + 컴포넌트 규격화)에 쓰일 **카드 계열
DS 컴포넌트**를 구축했다. DS 구축 기본 지침("기존 컴포넌트를 추출하지 않고 토큰 기반
신규 컴포넌트로 만든다")에 따라, 기존 `Tag.component`·`pokemonCard/{mobile,desktop}`은
참고만 하고 새 컴포넌트로 작성했다.

<!-- truncate -->

## 🏷️ 신규 Tag 컴포넌트 (토큰 기반 + WCAG 대비)

`~/components/tag/Tag.component`를 신규 작성했다. 기존 `.type-tag`(globals.css)와
`Tag.component`(32곳 사용)는 **건드리지 않고**, 토큰 기반으로 규격화했다.

- **토큰 규격**: `w-14 h-6 px-2 rounded-lg text-xs font-semibold` — 임의값(`text-[0.85rem]` 등) 제거
- **정적 색상 매핑**: `bg-type-${...}` 동적 클래스가 Tailwind purge에서 누락되지 않도록
  `Record<PokemonType, string>` 정적 문자열로 둠(safelist 불필요)
- **WCAG 2.1 AA 대비**: 배경이 어두운 6종(**격투·독·고스트·드래곤·악·바위**)은
  검정 글자 대비가 부족(2.0~3.2)해 흰색 글자(`text-white-1`)로 전환. 나머지 12종은
  검정 글자. 기존 태그는 전 타입 검정 고정이라 위 6종에서 대비 미달이었다.

## 🃏 PokemonCard — 단일 고정 규격(w-56)

카드는 **부모 폭에 종속되지 않는 `w-56`(224px) 단일 고정 규격**으로 확정했다.
디자인 시스템 카드는 사용처마다 크기가 달라지면 안 되고, 폭은 그리드가 아니라
컴포넌트가 규정한다는 원칙을 따른다.

### 해결한 문제

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| 768px 이하에서 카드가 길쭉 | `w-full`(가변) + `h-[21rem]`(고정) 비율 깨짐 | 폭을 `w-56` 고정으로 확정 |
| 스탯 행이 잘림 | `aspect-[7/10]` 비율 높이 < 고정 크기 콘텐츠 합 | aspect-ratio 제거 → **콘텐츠 기반 높이** |
| 사용처마다 다른 크기 | 부모 폭을 따라가는 `w-full` | 단일 고정 규격으로 통일 |

### 토큰 규격화

폭이 고정되며 `desktop:` 반응형 분기가 불필요해져 단일 값으로 정리했다.

- 이미지 `w-32 desktop:w-40` → **`w-40`**
- 스탯 폰트 `text-xs desktop:text-sm` → **`text-sm`**
- 패딩 `p-2 desktop:p-3` → **`p-3`**
- 새 DS Tag 적용(`~/components/tag`), 기존 Tag 의존 제거

## ⚠️ 후속 작업 (페이지 개편 시)

모바일 도감 그리드(`grid-cols-2`)는 현재 카드가 `w-full`이라고 가정하고 짜여 있다.
카드가 224px 고정으로 바뀌었으므로, **각 페이지 재구성 단계에서 그리드를 카드 규격에
맞게 조정**(예: `grid-cols-[repeat(auto-fill,224px)]`)해야 한다. DS 카드 자체는
고정 규격으로 완성됐다.

## 🔗 관련

- [ADR-0008 — Storybook 디자인 시스템](/blog/1-54-0-storybook-migration)
- [DS SectionHeading](/blog/1-54-0-ds-section-heading)
- [UI 개편 4단계 전략 기획서](/blog/1-54-0-plan-4stage-revision)
