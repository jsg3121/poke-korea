---
slug: 1-54-0-ds-horizontal-scroll-list
title: '[1.54.0] DS 컴포넌트 — HorizontalScrollList (가로 스크롤 래퍼)'
description: 'Banner/Champions의 가로 스크롤 마크업을 추출하지 않고 토큰 기반으로 규격화한 신규 DS 래퍼. 자식을 li로 자동 래핑해 가로 목록 시맨틱을 보장하고, 호버 scale 시 Y축 스크롤·양끝 카드 잘림을 p-4 + overflow-y-hidden으로 해결.'
authors: [jsg3121, claude]
tags: [design-system, component, home]
---

# 1.54.0 — DS 컴포넌트: HorizontalScrollList

> **작업 일자**: 2026-06-23
> **작업 브랜치**: `feature/1.54.0-ds-horizontal-scroll-list`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 컴포넌트 신규 구축
**담당**: jsg3121 + Claude

홈 재설계 Phase A의 세 번째 DS 컴포넌트로, **가로 스크롤 래퍼**를 구축했다.
기존 Banner("오늘의 포켓몬")·Champions의 가로 스크롤 마크업을 **추출하지 않고**
토큰 기반으로 규격화해 새로 만들었다.

<!-- truncate -->

## 🎯 역할

PokemonCard 등 자식을 가로 스크롤로 배치하는 래퍼다. 기존 Banner/Champions가
각자 다른 가로 스크롤 마크업(스크롤바 스타일 중복, peek 단서 부재)을 갖던 것을
하나의 규격으로 통일한다.

```tsx
<HorizontalScrollListComponent aria-label="오늘의 포켓몬">
  {pokemons.map((p) => (
    <PokemonCardComponent key={p.id} variant="pokedex" pokemonData={p} />
  ))}
</HorizontalScrollListComponent>
```

## 🧩 설계

| 항목 | 내용 |
| --- | --- |
| 시맨틱 | `ul` + 자식 자동 `li` 래핑(`flex-shrink-0`으로 카드 고정 폭 유지) |
| 간격 | `gap-4`(1rem) 고정 |
| 스크롤바 | `showScrollbar`로 표시/숨김. 색상 기존 무드(primary-2/3), 두께 토큰 `h-1`(4px) |
| peek(M1) | 카드가 고정 폭(w-56)이라 좁은 컨테이너에서 다음 카드가 자연히 노출 |
| 접근성 | `aria-label`로 스크롤 영역 접근명 부여 |

## 🐛 해결한 문제 — 호버 시 Y축 스크롤 / 양끝 카드 잘림

PokemonCard는 `desktop:hover:scale-105`로 호버 시 확대된다. 래퍼 높이·폭이
카드와 딱 맞으면 확대분이 넘쳐:

- **Y축 스크롤**이 생기고(가로 스크롤 컨테이너에 세로 스크롤 동반)
- **양 끝 카드**가 스크롤 경계에 잘렸다

→ 사방 패딩 `p-4`(16px)로 확대 여유를 확보하고, `overflow-y-hidden`으로 Y축
스크롤을 차단해 해결했다. 패딩은 가로 스크롤 영역에 정상 포함되므로 양 끝 카드도
스크롤 끝에서 잘리지 않는다.

## 🔗 관련

- [ADR-0008 — Storybook 디자인 시스템](/blog/1-54-0-storybook-migration)
- [DS Tag + PokemonCard](/blog/1-54-0-ds-pokemon-card)
- [홈 페이지 재설계 기획서](/blog/1-54-0-home-redesign-spec)
