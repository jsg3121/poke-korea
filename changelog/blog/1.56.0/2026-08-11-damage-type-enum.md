---
slug: damage-type-enum
title: '기술 도메인 정리 — damageType enum 전환·습득법 라벨 마스터 쿼리화'
description: '백엔드 기술 스키마 재설계에 맞춰 damageType을 enum으로 전환하고, 6개 파일에 복붙돼 있던 분류 매핑을 공통 함수로 통합했습니다. 습득법 한글 라벨은 하드코딩 대신 마스터 쿼리로 받아, 습득법이 늘어도 프론트 배포가 필요 없게 했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, graphql]
---

# 기술 도메인 정리 — damageType enum 전환·습득법 라벨 마스터 쿼리화

> **작업 날짜**: 2026-08-11
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 리팩토링 / 기술 부채 정리
**담당**: jsg3121, claude

## 🎯 작업 목표

백엔드가 기술(skill/move) 도메인 스키마를 재설계하면서 `damageType`이 자유 문자열(`String`)에서 enum(`DamageType`)으로 바뀌고, 습득법이 2종(레벨업·기술머신)에서 9종(알 기술·기술 가르침·폼체인지 등)으로 확장됐다. 이에 맞춰 프론트의 매핑 코드를 정리한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: damageType 매핑을 enum 기반 공통 함수로 통합

`damageType`이 자유 문자열이던 탓에, 값을 소문자로 정규화한 뒤 `Record<string, X>`로 조회하고 실패 시 폴백하는 코드가 **6개 파일에 복붙**돼 있었다.

**변경 전** — 동일한 함수가 3곳에, 동일한 객체가 3곳에 중복

```ts
// DetailSkills / DetailSignatureMoves / DetailMovesList — 완전히 동일한 함수 3벌
const toChipColor = (damageType?: string | null): ChipColor => {
  const normalized = damageType?.toLowerCase()
  return normalized === 'physical' || normalized === 'special'
    ? normalized
    : 'status'
}

// DetailExclusiveMoves / MoveDetailHero / MoveListCard — 동일한 객체 3벌
const DAMAGE_CHIP_COLOR: Record<string, ChipColor> = {
  physical: 'physical',
  special: 'special',
  status: 'status',
}
```

**변경 후** — `src/utils/skill.util.ts`의 공통 함수 3개로 통합

```ts
getDamageTypeKorean(damageType)     // 한글 라벨 (물리/특수/변화)
getDamageTypeChipColor(damageType)  // Chip 색 키 (미지의 값은 status로 폴백)
hasDamageType(damageType)           // 보유 여부 — Chip 생략 판단용
```

한글 라벨은 `skill.util.ts`와 `MoveTable.component.tsx` 두 곳에 이중 정의돼 있었는데, 이것도 하나로 합쳤다.

### 변경 2: 전환기 대응 — 대소문자 양쪽 수용

백엔드 레거시 쿼리(`PokemonSkillDetail` 등)는 **여전히 소문자 문자열**(`"physical"`)을 반환하고, 신규 타입(`SkillSummary`)만 enum(`PHYSICAL`)을 반환한다. 두 표기가 공존하는 전환 기간 동안 `normalizeDamageType`이 양쪽을 모두 수용한다.

> **Why 정규화가 필요한가:** 이 처리 없이 `Record<DamageType, string>[damageType]`으로 단순 교체하면, 레거시 경로에서 오는 `"physical"`이 키 `PHYSICAL`과 맞지 않아 `undefined`가 된다. 해당 값은 기술 상세의 `title`과 JSON-LD에 그대로 들어가므로, **검색 결과에 `undefined`가 박힌 채 색인될 수 있다.**

레거시 쿼리가 모두 신규 쿼리로 교체되면 정규화를 제거하고 `Record<DamageType, T>` 직접 조회로 좁힌다.

### 변경 3: 습득법 라벨을 마스터 쿼리로 전환

습득법 한글 매핑이 3종(`LEVEL_UP`/`MACHINE`/`EGG`)만 하드코딩돼 있어, 백엔드가 9종으로 확장하면 나머지가 **enum 원문 그대로 화면에 노출**되는 상태였다. 실제로 `REMINDER`(기술 떠올리기)는 이미 데이터가 존재한다.

`GetLearnMethods` 쿼리와 `useLearnMethodLabels` 훅을 추가해 라벨을 백엔드에서 받는다.

```ts
const { getLabel } = useLearnMethodLabels()
```

> **Why 쿼리인가:** 습득법은 실제로 늘어나는 개방 집합이다(2종 → 9종). 백엔드가 `isExposed`를 DB 컬럼으로 관리하므로, 노출 정책이 바뀌어도 **양쪽 모두 배포가 불필요**하다.

카드 컴포넌트(`PokemonBySkillCard`)는 프레젠테이션 컴포넌트라 직접 페칭하지 않고, 상위 컨테이너가 `getMethodLabel` prop으로 주입한다.

### 변경 4: dead code 제거

- `AVAILABLE_LEARN_METHODS` — 어디서도 import되지 않던 상수 (EGG/TUTOR가 주석 처리된 채 방치)
- `getLearnMethodEnum` — 미사용 함수

### 변경 5: GmaxMove 신규 필드 반영

백엔드가 `GmaxMove`에 `dependsOnBaseMove: Boolean!`을 추가하면서, 해당 필드를 요청하지 않던 쿼리에서 타입 불일치가 발생했다. 두 쿼리(`GetPokemonGigantamax`, `GetPokemonGigantamaxList`)에 필드를 추가했다.

거다이맥스 기술은 고정 분류가 없고 기반 기술을 따르므로, 현재 화면에서 `"물리 / 특수"` 문자열을 조작해 표시하는 부분은 후속 작업에서 정리한다.

## 📊 변경 요약

| 대상 | 변경 전 | 변경 후 |
| --- | --- | --- |
| damageType 타입 | `String` (자유 문자열) | `DamageType` enum |
| 분류 매핑 정의 | 6개 파일에 복붙 | 공통 함수 3개 |
| 한글 라벨 정의 | 2곳 이중 정의 | 1곳 |
| 습득법 라벨 | 3종 하드코딩 | 마스터 쿼리 (9종) |
| dead code | 2개 export | 제거 |

## 🔧 기술적 세부사항

**수정 파일**

- `src/utils/skill.util.ts` — 재작성
- `src/hook/useLearnMethodLabels.ts` — 신규
- `src/gql/query.graphql` — `GetLearnMethods` 추가, `gmaxMove`에 `dependsOnBaseMove` 추가
- `src/container/detail/` — `DetailSkills`, `DetailSignatureMoves`, `DetailExclusiveMoves`, `moves/DetailMovesList`
- `src/container/moves/` — `MoveDetailHero`, `PokemonBySkillList`
- `src/components/moves/` — `PokemonBySkillCard`, `moveCard/MoveListCard`

**`hasDamageType`을 별도로 둔 이유**

세 화면(`MoveListCard`, `MoveDetailHero`, `DetailExclusiveMoves`)은 매핑 실패 시 Chip을 생략하거나 텍스트로 폴백한다. `getDamageTypeChipColor`는 항상 값을 반환(폴백)하므로 이 구분이 불가능해, 보유 여부 판별을 분리했다.

**범위에서 제외한 항목**

백엔드가 `getPokemonTypes`(타입 18종)·`getGenerations`(세대) 마스터 쿼리도 제공하나, 이번 작업에는 넣지 않았다. `PokemonTypes`는 25개 파일에서 **동기 상수로** 쓰이고 서버 컴포넌트의 메타데이터·JSON-LD 생성 경로에도 있어, 비동기 전환 시 기술 도메인 밖까지 영향이 미친다. 필요 시 별도 작업으로 분리한다.

## 📌 참고 사항

- `src/graphql/`은 자동 생성 디렉토리(gitignore)이므로, 이 브랜치를 받은 뒤 백엔드 서버(`localhost:4000`)를 띄우고 `npm run codegen`을 실행해야 한다.
- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / `npm run build` 성공
- 후속 작업: `getPokemonLearnset` 통합 쿼리 전환(습득법 탭 데이터 기반 렌더), 버전그룹 객체화
