---
slug: learn-method-routing
title: '습득법 라우팅을 LearnMethod 기반으로 전환 — 2종 고정 해제'
description: '습득법이 URL과 타입에 machine 리터럴로 박혀 있어 알 기술·기술 가르침을 추가할 수 없던 구조를, LearnMethod enum 기반 슬러그 매핑으로 바꿨습니다. 기존 URL은 그대로 유지되며 습득법이 늘어도 파서를 고칠 필요가 없습니다.'
authors: [jsg3121, claude]
tags: [refactoring, nextjs]
---

# 습득법 라우팅을 LearnMethod 기반으로 전환 — 2종 고정 해제

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 리팩토링 / 구조 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

포켓몬 상세의 습득 기술 페이지에 알 기술·기술 가르침 탭을 추가하려면, 먼저 **습득법이 2종으로 고정된 라우팅 구조**를 풀어야 한다. 이 작업은 그 기반 정리이며, 화면에 새 탭이 보이는 것은 후속 작업이다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: `MovesType` 2종 고정 → `LearnMethod` enum

기존엔 타입 수준에서 습득법이 2종으로 못박혀 있었다.

```ts
type MovesType = 'LEVELUP' | 'MACHINE'
```

백엔드가 9종(알 기술·기술 가르침·폼체인지 등)을 제공하는데, 이 타입 때문에 나머지를 표현할 방법이 없었다. `LearnMethod` enum으로 교체했다.

### 변경 2: `machine` 리터럴 세그먼트 → 슬러그 매핑

URL 파서와 빌더에 `machine` 문자열이 직접 박혀 있어, 습득법을 추가할 때마다 두 곳을 함께 고쳐야 했다.

**변경 전** — 조건문에 리터럴이 흩어짐

```ts
if (segments[cursor] === 'machine' && cursor === segments.length - 1) { ... }
if (movesType === 'MACHINE') { basePath += '/machine' }
```

**변경 후** — 매핑 테이블 하나로 집약

```ts
const METHOD_SLUG: Partial<Record<LearnMethod, string>> = {
  [LearnMethod.MACHINE]: 'machine',
  [LearnMethod.EGG]: 'egg',
  [LearnMethod.TUTOR]: 'tutor',
  // ...
}
```

**습득법이 늘어도 이 맵에만 한 줄 추가**하면 파서·빌더·라우트가 모두 따라온다.

### 변경 3: 기존 URL 100% 보존

이미 검색에 색인된 경로가 바뀌면 SEO 손실이 발생하므로, 슬러그를 기존 값에 맞췄다. 레벨업은 예전처럼 슬러그 없는 기본 경로다.

| URL | 상태 |
| --- | --- |
| `/detail/6/moves` | 그대로 (레벨업) |
| `/detail/6/moves/machine` | 그대로 |
| `/detail/6/moves/version/18/machine` | 그대로 |
| `/detail/6/moves/form/1/machine` | 그대로 |
| `/detail/6/moves/egg` | 신규 |
| `/detail/6/moves/tutor` | 신규 |

### 변경 4: fetch 계층 중복 변환 제거

`formMoves.fetch.ts`·`regionMoves.fetch.ts`가 문자열을 받아 내부에서 enum으로 바꾸고 있었다.

```ts
// 변경 전 — 호출부는 문자열, 내부에서 변환
movesType === 'LEVELUP' ? LearnMethod['LEVEL_UP'] : LearnMethod['MACHINE']
```

애초에 `LearnMethod`를 받도록 시그니처를 바꿔 이 변환을 없앴다. 컨텍스트(`DetailMoves.context`)의 `currentMovesType`도 `currentLearnMethod`로 전환했다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 습득법 타입 | `'LEVELUP' \| 'MACHINE'` | `LearnMethod` (9종) |
| URL 슬러그 | `machine` 리터럴 하드코딩 | 매핑 테이블 |
| 습득법 추가 시 | 파서·빌더·라우트 수정 | 맵에 한 줄 |
| fetch 시그니처 | 문자열 → 내부 변환 | enum 직접 |
| 기존 URL | — | 전부 보존 |

## 🔧 기술적 세부사항

**수정 파일**

- `src/module/movesParams.module.ts` — 재작성 (슬러그 매핑·파서·빌더)
- `src/context/DetailMoves.context.tsx` — `currentMovesType` → `currentLearnMethod`
- `src/app/detail/[pokemonId]/moves/` — 6개 page.tsx
- `src/app/detail/[pokemonId]/moves/_fetch/` — `formMoves`, `regionMoves`
- `src/container/detail/moves/` — `DetailMovesStickyNav`, `DetailMovesList`

**파서 검증**

`parseFormSegments`는 라우팅 게이트키퍼라 잘못 고치면 404가 나거나 잘못된 페이지가 뜬다. 컴파일된 모듈로 25개 케이스를 검증했다.

- 유효 세그먼트 13종 (기본·폼 인덱스·버전·습득법 조합)
- 무효 세그먼트 7종 (알 수 없는 슬러그, 버전 누락, 음수 인덱스, 잉여 세그먼트)
- 왕복 5종 (`buildMovesPath` → `parseFormSegments`가 원래 값 복원)
- 기존 URL 6종 문자열 일치

**아직 남은 것**

메타데이터 생성기(`generateMovesMetadata` 등)는 여전히 `'LEVELUP' | 'MACHINE'` 문자열을 받는다. 습득법 라벨을 `getLearnMethods` 마스터 쿼리로 받는 후속 작업에서 함께 정리한다.

## 📌 참고 사항

- `src/graphql/`은 자동 생성 디렉토리(gitignore)이므로, 이 브랜치를 받은 뒤 백엔드 서버(`localhost:4000`)를 띄우고 `npm run codegen`을 실행해야 한다.
- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / `npm run build` 성공 / 파서 25 케이스 통과
- 이 작업만으로는 **화면에 새 탭이 보이지 않는다.** `getPokemonLearnset` 통합 쿼리 전환과 `[method]` 라우트 추가가 이어져야 알 기술·기술 가르침이 노출된다.
