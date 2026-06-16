---
slug: 1-54-0-ds-pokemon-card
title: '[1.54.0] DS 컴포넌트 — PokemonCard (variant 기반 반응형 단일 카드)'
description: '홈 재설계 Phase A의 두 번째 DS 컴포넌트. 포켓몬 카드 계열(도감/기술/특성/챔피언스)의 공통 셸을 반응형 단일 컴포넌트로 신규 제작하고, 본문을 variant 판별 유니온으로 구분. 이번엔 pokedex variant만 구현(스탯 데이터 주도), 나머지는 각 페이지 개편 시 확장. 기존 PokemonCard는 그대로 유지.'
authors: [jsg3121, claude]
tags: [design-system, component, responsive]
---

# 1.54.0 — DS 컴포넌트: PokemonCard

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-ds-pokemon-card`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 컴포넌트 신규 (홈 재설계 Phase A)
**담당**: jsg3121 + Claude

포켓몬 카드 계열(포켓몬 도감/기술 도감/특성 도감/챔피언스)이 **공통 셸**(포켓볼 +
헤더 + 이미지 + 타입 태그)을 공유하고 본문만 다르다는 점에 착안해, 이를 **variant
기반 반응형 단일 카드**로 신규 제작했다. 기존 카드들은 건드리지 않고 별도 신규
컴포넌트로 만들어, 미개편 페이지에 영향을 주지 않는다.

<!-- truncate -->

## 🔧 설계 — 공통 셸 + variant 판별 유니온

```tsx
type PokemonCardVariant = { variant: 'pokedex' }
// 확장 예정: skill / ability / champions (각 페이지 개편 시)

type PokemonCardComponentProps = PokemonCardBaseProps & PokemonCardVariant
```

- **공통 셸**: 포켓볼 + 헤더(번호/이름) + 포켓몬 이미지 + 타입 태그 + `card-corner-fold`. variant 무관하게 동일
- **본문**: `variant`로 구분. 이번엔 `pokedex`(스탯 6종)만 구현
- **확장성**: skill/ability/champions는 union에 자리만 마련, 각 페이지 개편 시 추가

## 🎯 적용된 규칙

- **반응형 단일** (모바일 퍼스트): `w-full desktop:w-56`, `desktop:hover:scale-105` 등
- **스탯 데이터 주도**: 6종 스탯을 배열 + 인라인 Fragment map (1파일 1컴포넌트 관행 준수)
- **임의값 토큰화**: `text-[max(0.875rem,11px)]` → `text-2xs desktop:text-sm`
- **타입 안전**: 스탯 키를 숫자 능력치로만 제한(`PokemonStatKey`)

## 📌 기존 카드 유지

`pokemonCard/mobile`·`desktop`, skill/ability/champions 카드는 **수정하지 않음**. 미개편 페이지(list 등)가 계속 사용한다. 각 페이지 개편 시 새 PokemonCard variant로 교체 후 구버전 제거(4단계 전략).

## ✅ 검증

- lint·타입·빌드 통과
- **DS**: claude.ai/design Components 그룹에 카드 업로드 (모바일/데스크톱 variant 예시)

## ⏭️ 다음 (Phase A)

HorizontalScrollList → QuizCard

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `src/components/pokemonCard/PokemonCard.component.tsx` | variant 기반 반응형 단일 카드 신규 |
