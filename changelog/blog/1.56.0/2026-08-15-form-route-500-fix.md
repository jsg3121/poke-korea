---
slug: form-route-500-fix
title: '폼이 없는 포켓몬의 폼 URL 접근 시 500 오류 수정'
description: '리자몽처럼 폼이 없는 포켓몬에 /moves/form/1로 접근하면 500이 발생하던 문제를 수정했습니다. 버전 목록 조회가 실패하면서 페이지가 리다이렉트를 처리할 기회조차 없이 터지던 구조였습니다.'
authors: [jsg3121, claude]
tags: [bug-fix]
---

# 폼이 없는 포켓몬의 폼 URL 접근 시 500 오류 수정

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

폼이 없는 포켓몬(리자몽 등)에 `/detail/6/moves/form/1`로 접근하면 **500 오류**가 발생했다. 원래는 기본 moves 페이지로 리다이렉트되어야 하는 경로다.

<!-- truncate -->

## ✨ 주요 변경사항

### 원인: 방어가 한 쿼리에만 걸려 있었다

`learnset.fetch.ts`는 여러 쿼리를 `Promise.all`로 병렬 실행한다. 백엔드는 존재하지 않는 폼을 조회하면 에러를 던지는데, **러닝셋 조회에만 `catch`가 있고 버전 목록 조회에는 없었다.**

```ts
// 러닝셋 — 방어 있음
apolloClient.query({ query: GetPokemonLearnsetDocument, … }).catch(() => null),

// 버전 목록 — 방어 없음 ← 여기서 터짐
apolloClient.query({ query: GetVersionGroupsByPokemonDocument, … }),
```

`Promise.all`은 하나만 실패해도 전체가 reject되므로, 페이지가 `permanentRedirect`를 실행할 기회조차 없이 500이 났다.

백엔드 응답으로 확인한 내용이다.

```text
getPokemonLearnset       → "해당 폼이 존재하지 않습니다: pokemonId=6, formType=NORMAL_FORM, formIndex=1"
getVersionGroupsByPokemon → 동일 에러  ← 이쪽이 막히지 않았다
```

### 수정: 동일하게 방어

버전 목록 조회에도 `catch`를 추가해 `null`로 흘려보낸다. 페이지는 기존 로직대로 리다이렉트를 처리한다.

## 📊 변경 요약

| 경로 | 변경 전 | 변경 후 |
| --- | --- | --- |
| `/detail/6/moves/form/1` | **500** | 308 → `/detail/6/moves` |
| `/detail/6/moves/form/1/machine` | **500** | 308 → `/detail/6/moves/machine` |

리다이렉트가 습득법 세그먼트를 보존하므로, `machine`으로 접근하면 `machine`으로 간다.

## 🔧 기술적 세부사항

**수정 파일**

- `src/app/detail/[pokemonId]/moves/_fetch/learnset.fetch.ts`

**발견 경위**

`curl`로 라우트 상태 코드를 일괄 점검하다 드러났다. 타입 체크·린트·빌드는 모두 통과하는 런타임 오류라, 정적 검사로는 잡히지 않는 종류였다.

**검증 결과**

라우트 14종을 점검했다.

| 구분 | 결과 |
| --- | --- |
| 습득법 라우트 7종 (`machine`·`egg`·`tutor` + 버전 조합) | 전부 200 |
| 미노출 습득법·오타 3종 (`reminder`·`form-change`·`bogus`) | 전부 404 |
| 폼·리전 4종 | 전부 200 (`/detail/6/moves/form/1` 포함) |

폼 페이지가 실제로 올바른 데이터를 렌더하는지도 확인했다.

- `/detail/479/moves/form/1` → **히트로토무** 레벨업 15건
- `/detail/479/moves` → **로토무** 레벨업 14건

폼별 이름과 기술 수가 정확히 구분된다.

## 📌 참고 사항

- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / `npm run build` 성공 / 라우트 14종 실측
- 같은 점검에서 SSR HTML에 습득법 탭 라벨이 한글로 들어가는 것도 확인했다(enum 원문 미노출).
