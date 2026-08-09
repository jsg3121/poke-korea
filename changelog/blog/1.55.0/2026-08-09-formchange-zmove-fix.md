---
slug: formchange-zmove-fix
title: '포켓몬 상세 — 폼체인지 포켓몬 전용 Z기술 미표시 수정'
description: '루가루암 등 폼체인지 포켓몬의 전용 Z기술이 상세 페이지에 표시되지 않던 버그를 수정했습니다. 폼 데이터가 비었을 때 기본 정보로 폴백하도록 조건을 바로잡았습니다.'
authors: [jsg3121, claude]
tags: [bug-fix]
---

# 포켓몬 상세 — 폼체인지 포켓몬 전용 Z기술 미표시 수정

> **작업 날짜**: 2026-08-09
> **브랜치**: `feature/1.55.0-evolution`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

루가루암 등 폼체인지 포켓몬(`isFormChange = true`)의 전용 Z기술(레이디얼에지스톰)이 상세 페이지에 표시되지 않는 버그를 수정한다. 백엔드는 데이터를 정상 제공하고 있었고, 프론트의 폴백 로직에 결함이 있었다.

<!-- truncate -->

## 🐛 버그 수정

### 원인: 빈 배열 폴백 누락

전용 Z기술은 폼 테이블(`normalForm`)에는 없고 기본 정보(`pokemonBaseInfo`)에만 있는 경우가 있다. 그런데 폴백이 nullish 병합이라, 폼 데이터가 빈 배열일 때 이를 "값 있음"으로 취급해 기본 정보로 폴백하지 않았다.

**변경 전** — 빈 배열도 통과해 기본 정보로 폴백 안 됨:

```ts
return normalForm?.[0]?.exclusiveZMoves ?? pokemonBaseInfo?.exclusiveZMoves ?? []
```

**변경 후** — 폼 데이터가 비어 있으면 기본 정보로 폴백:

```ts
const formZMoves = normalForm?.[0]?.exclusiveZMoves
return formZMoves && formZMoves.length > 0
  ? formZMoves
  : (pokemonBaseInfo?.exclusiveZMoves ?? [])
```

## 🔧 기술적 세부사항

| 파일 | 내용 |
| --- | --- |
| `src/container/detail/DetailExclusiveMoves.container.tsx` | Z기술 폴백을 "폼 데이터가 비면 기본 정보 사용"으로 수정 |

## 📌 참고 사항

- 폼별 Z기술이 실제로 존재하는 포켓몬은 폼 데이터를 우선 사용하므로 부작용이 없다.
