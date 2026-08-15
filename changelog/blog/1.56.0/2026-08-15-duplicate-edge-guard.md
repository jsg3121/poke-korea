---
slug: duplicate-edge-guard
title: '무한 스크롤 중복 항목 방어 — React key 충돌 해결'
description: '기술 상세의 포켓몬 목록에서 같은 항목이 두 번 렌더되며 React key 충돌 경고가 발생하던 문제를, 페이지네이션 병합과 목록 추출 양쪽에 중복 제거를 넣어 해결했습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, graphql]
---

# 무한 스크롤 중복 항목 방어 — React key 충돌 해결

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

기술 상세(`/moves/[id]`)의 "이 기술을 배우는 포켓몬" 목록에서 무한 스크롤 시 React 경고가 발생했다.

```text
Encountered two children with the same key, `pokemon-skill-BASE_802-BASE`.
```

<!-- truncate -->

## ✨ 주요 변경사항

### 원인: 백엔드 응답에 중복이 있다

처음엔 페이지네이션 병합이 이중 적용된 것으로 의심했으나, **단일 페이지 응답 안에 이미 중복이 있었다.**

```text
'BASE_63' 노드 2건:
  cursor=QkFTRV82Mw==  methods=['EGG','TUTOR']  vg=18
  cursor=QkFTRV82Mw==  methods=['EGG','TUTOR']  vg=18   ← cursor까지 동일
```

레거시 쿼리와 비교하면 V2 전환으로 생긴 문제다.

| 쿼리 | 로드 | 고유 | 중복 |
| --- | ---: | ---: | ---: |
| `getPokemonsBySkill` (레거시) | 16 | 16 | 0 |
| `getPokemonsBySkillV2` | 100 | 87 | **13** |

**중복은 습득법이 2개 이상인 포켓몬에서만 발생한다.**

| 습득법 | 결과 |
| --- | --- |
| `['EGG', 'TUTOR']` · `['LEVEL_UP', 'TUTOR']` | 중복 |
| `['TUTOR']` 단일 | 정상 |

습득법별로 행을 만들어 `methods` 배열로 묶는 과정에서 중복 제거가 빠진 것으로 보인다. **근본 해결은 백엔드**이며 별도로 공유한다.

### 변경 1: 캐시 병합에서 중복 제거

`paginatedFieldPolicy`의 `merge`에 `dedupeEdges`를 넣었다. cursor를 우선 키로, 없으면 `node.id`를 쓴다.

첫 write(SSR 하이드레이션)에도 적용한다 — 단일 페이지 안에 이미 중복이 있기 때문이다. 페이지 경계에서 같은 항목이 다시 오는 경우도 함께 걸러진다.

### 변경 2: 목록 추출에서도 중복 제거

SSR 초기 목록(`initialPokemonList`)은 페이지에서 `edges`를 직접 map한 값이라 **캐시 정책을 거치지 않는다.** 첫 렌더에서도 중복이 나오므로 `extractNodesFromEdges`에도 방어를 넣었다.

> **Why 두 곳 다인가:** 캐시 병합만 막으면 SSR 첫 화면에 중복이 남고, 추출만 막으면 캐시에 중복이 쌓여 `totalCount`와 어긋난다. 경로가 둘이라 방어도 둘이다.

### 공유 함수 회귀 확인

두 함수 모두 여러 쿼리가 공유하므로, 다른 쿼리에서 정상 항목이 걸러지지 않는지 확인했다.

| 쿼리 | 표본 | 고유 | 판정 |
| --- | ---: | ---: | --- |
| `getPokemonListPaginated` | 60 | 60 | 영향 없음 |
| `getPokemonSkillList` | 60 | 60 | 영향 없음 |
| `getAbilityListPaginated` | 60 | 60 | 영향 없음 |

전부 `id`가 고유해 중복 제거가 아무것도 걸러내지 않는다. 키를 만들 수 없는 항목(`id`·`cursor` 부재)은 **걸러내지 않도록** 했다 — 정상 항목을 잃는 것이 더 나쁘다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 렌더된 카드 링크 | 중복 13건 | 중복 0건 |
| React key 경고 | 발생 | 해소 |
| 방어 지점 | 없음 | 캐시 병합 + 목록 추출 |

## 🔧 기술적 세부사항

**수정 파일**

- `src/module/graphqlPagination.module.ts`

**검증**

`/moves/7/version/18`(불꽃펀치 울트라썬·울트라문) 렌더 결과에서 카드 링크를 세어 확인했다.

```text
카드 링크: 28개, 고유 28개, 중복 0개
```

수정 전이라면 13건이 중복으로 나왔을 지점이다.

## 📌 참고 사항

- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / 렌더 결과 실측
- **백엔드 수정이 근본 해결이다.** 프론트 방어는 화면을 보호할 뿐, `totalCount`(187)는 여전히 중복을 포함한 값이라 실제 고유 개수와 다르다.
- 확인 권장: `/moves/7`에서 더보기를 반복해 항목이 중복 없이 누적되는지.
