---
slug: ability-mega-name
title: '특성 도감 상세 메가진화 포켓몬 이름 표시 수정'
description: '특성 도감 상세의 포켓몬 카드가 메가진화 폼을 원종 이름으로 보여주던 문제를 고쳐 메가라이츄Y처럼 메가진화 이름을 표시하도록 했습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, ux]
---

# 특성 도감 상세 메가진화 포켓몬 이름 표시 수정

> **작업 날짜**: 2026-10-01
> **브랜치**: `feature/1.61.1-ability-mega-name`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: Claude Code

## 🎯 작업 목표

특성 도감 상세(`/ability/[id]`)의 포켓몬 카드가 메가진화 폼을 메가진화 이름(예: 메가라이츄Y)으로 표시하게 한다.

<!-- truncate -->

## 📉 왜 필요했나

특성 99 노가드를 가진 포켓몬은 메가라이츄Y인데 카드 제목에는 "라이츄"로 나왔다. 메가진화가 X·Y 두 가지인 포켓몬은 배지("메가진화")만으로는 어느 쪽인지 구분할 수 없다.

`getPokemonByAbility` 응답은 메가 폼에서 `name`에 원종 이름을, `formName`에 메가진화 이름을 담는다. 그런데 카드는 `formType`과 상관없이 항상 `name`을 표시하고 있었다.

```json
{ "id": "M0026060", "name": "라이츄", "formName": "메가라이츄Y", "formType": "MEGA" }
```

## ✨ 주요 변경사항

### 메가 폼은 `formName`을 표시 이름으로 사용

`PokemonByAbilityCard`에서 표시 이름을 한 번 계산하고, 카드 제목·이미지 alt·aria-label에 같은 값을 쓴다.

**변경 전**:

```tsx
<h3>{pokemonData.name}</h3>
```

**변경 후**:

```tsx
const displayName =
  pokemonData.formType === 'MEGA' && pokemonData.formName
    ? pokemonData.formName
    : pokemonData.name

<h3>{displayName}</h3>
```

`formName`이 비어 있으면 원종 이름으로 돌아가므로, 데이터가 빠진 경우에도 빈 제목이 나오지 않는다.

## 🔍 검증

- `eslint`, `prettier --check`, `tsc --noEmit` 통과
- 로컬 API로 특성 99 응답을 확인해 메가 3종(메가피죤투·메가라이츄Y·메가루차불)의 `formName`이 모두 채워져 있음을 확인
- 기술 도감 카드(`PokemonBySkillCard`)도 같은 구조인지 확인했으나 해당 없음. `getPokemonsBySkillV2`는 메가진화를 제외하고 반환한다(기술 8종을 전수 조회한 결과 로컬·운영 모두 `MEGA` 0건).
- 실제 화면 렌더링은 확인하지 않았다.

## 📌 참고 사항

- 같은 화면에서 메가라이츄Y 카드가 메가라이츄X 상세로 연결되던 문제는 백엔드가 원인이다. 특성으로 걸러진 목록 안에서 이미지 index를 매겨 `imagePath`가 `102600`(X)으로 나갔다. 수정은 `poke-korea-server`에 반영돼 있으며, 서버를 배포하면 링크와 카드 이미지가 함께 바로잡힌다. 프론트 변경은 없다.
