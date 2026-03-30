---
slug: exclusive-z-moves
title: '전용 Z기술 UI 추가'
description: '포켓몬 상세 페이지에 전용 Z기술 정보를 표시하고, 기술 도감에서 Z기술 뱃지를 추가하여 7세대 전용 Z기술 데이터를 사용자에게 제공합니다.'
authors: [jsg3121, claude]
tags: [feature, ux]
---

# 전용 Z기술 UI 추가

> **작업 날짜**: 2026-03-29
> **브랜치**: `feature/1.35.0`

## 작업 개요

**작업 유형**: 기능 추가
**담당**: jsg3121, claude

## 작업 목표

백엔드에 추가된 7세대(썬/문) 전용 Z기술 데이터를 프론트엔드에서 조회하고 표시할 수 있도록 UI를 구현합니다. 포켓몬 상세 페이지에서 전용 Z기술 정보(Z기술명, 타입, 위력, 유형, 기반 기술)를 확인할 수 있고, 기술 도감에서 Z기술 여부를 뱃지로 식별할 수 있습니다.

<!-- truncate -->

## 주요 변경사항

### 변경 1: GraphQL 쿼리에 `exclusiveZMoves` 필드 추가

3개 쿼리(`PokemonDetail`, `GetPokemonRegionForm`, `GetPokemonNormalForm`)에 전용 Z기술 데이터를 요청하는 필드를 추가했습니다.

**변경 후**:
```graphql
exclusiveZMoves {
  id
  zSkill {
    skillId
    nameKo
    type
    damageType
    power
  }
  baseSkill {
    skillId
    nameKo
    type
    damageType
    power
  }
}
```

### 변경 2: 포켓몬 상세 페이지 — 전용 Z기술 섹션

기본폼, 노말폼, 리전폼 상세 페이지에서 전용 Z기술이 있는 경우 테이블 형태로 정보를 표시합니다.

- **Desktop/Mobile 각각 별도 컴포넌트** 구현 (기존 거다이맥스 전용 기술 패턴 참고)
- **표시 컬럼**: Z기술명 | 타입 | 위력 | 유형 | 기반 기술
- 전용 Z기술이 없는 포켓몬은 섹션이 렌더링되지 않음
- 기술 습득 정보 아래에 배치

### 변경 3: 기술 도감 — Z기술 뱃지 추가

기술 도감 리스트와 상세 페이지에서 Z기술 여부를 뱃지로 표시합니다.

- **기술 상세 페이지** (`MoveDetail.component.tsx`): 기술명 옆에 "Z기술" 뱃지
- **기술 도감 리스트 카드** (`MoveListCard.component.tsx`): 기술명 옆에 "Z기술" 뱃지
- **기술 카드** (`MoveCard.component.tsx`): 기술명 옆에 "Z기술" 뱃지
- 뱃지 스타일: `bg-yellow-400` 배경의 라운드 뱃지

## 기술적 세부사항

### 신규 파일

| 파일 | 설명 |
| ---- | ---- |
| `src/container/desktop/detail/detail.baseInfo/baseInfo.zMove/ZMoveInfo.component.tsx` | 데스크톱 전용 Z기술 정보 컴포넌트 |
| `src/container/mobile/detail/detail.baseInfo/baseInfo.zMove/ZMoveInfo.component.tsx` | 모바일 전용 Z기술 정보 컴포넌트 |

### 수정 파일

| 파일 | 변경 내용 |
| ---- | ---- |
| `src/gql/query.graphql` | 3개 쿼리에 `exclusiveZMoves` 필드 추가 |
| `src/graphql/*` | codegen 자동 생성 (PokemonZMove, PokemonZMoveSkillInfo 타입) |
| `src/container/desktop/detail/detail.baseInfo/DetailBaseInfo.container.tsx` | ZMoveInfoComponent 렌더링 추가 |
| `src/container/mobile/detail/detail.baseInfo/DetailBaseInfo.container.tsx` | ZMoveInfoComponent 렌더링 추가 |
| `src/components/moves/MoveDetail.component.tsx` | Z기술 뱃지 추가 |
| `src/components/moves/moveCard/MoveListCard.component.tsx` | Z기술 뱃지 추가 |
| `src/components/moves/moveCard/MoveCard.component.tsx` | Z기술 뱃지 추가 |

## 참고 사항

- 전용 Z기술은 16종, 약 22개 포켓몬/폼에 매핑되어 있습니다
- 기술 도감에서 Z기술 필터링 기능은 이번 버전에서 제외했습니다 (향후 추가 예정)
- 기존 `zMoves` boolean 플래그와 구분하기 위해 전용 Z기술 필드명을 `exclusiveZMoves`로 명명했습니다
