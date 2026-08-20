---
slug: learnset-unified-query
title: '습득 기술 통합 조회 — 알 기술·기술 가르침 탭 노출'
description: '포켓몬 습득 기술 페이지에 알 기술·기술 가르침 탭이 추가됩니다. 폼별로 3벌이던 데이터 조회를 통합 쿼리 하나로 합쳐 5쿼리 2왕복이던 요청을 줄이고, 5개 페이지에 복붙돼 있던 응답 가공 함수를 제거했습니다.'
authors: [jsg3121, claude]
tags: [feature, refactoring, graphql, performance]
---

# 습득 기술 통합 조회 — 알 기술·기술 가르침 탭 노출

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 기능 추가 / 리팩토링
**담당**: jsg3121, claude

## 🎯 작업 목표

포켓몬 상세의 습득 기술 페이지가 레벨업·기술머신 2종만 보여주던 것을, 백엔드가 새로 제공하는 9종(알 기술·기술 가르침·폼체인지 등)까지 노출한다. 앞선 [습득법 라우팅 전환](./learn-method-routing)이 URL 구조를 열어둔 상태이며, 이번 작업으로 실제 데이터가 화면에 닿는다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 학습법 탭을 데이터 기반으로

탭이 JSX에 2개 하드코딩돼 있었다.

**변경 전**

```tsx
<TabItemComponent href={buildMethodPath(LearnMethod.LEVEL_UP)}>
  레벨업으로 배우기
</TabItemComponent>
<TabItemComponent href={buildMethodPath(LearnMethod.MACHINE)}>
  기술머신으로 배우기
</TabItemComponent>
```

**변경 후** — 백엔드 `skillsByMethod` 배열을 그대로 렌더

```tsx
{methodTabs.map(({ method, methodLabel }) => (
  <TabItemComponent key={method} href={buildMethodPath(method)} …>
    {methodLabel}으로 배우기
  </TabItemComponent>
))}
```

실제로 그려지는 탭(실측):

| 포켓몬 / 버전 | 탭 |
| --- | --- |
| 리자몽 / 울트라썬·울트라문 | 레벨업(22) · 기술머신(43) · **기술 가르침(12)** |
| 이상해씨 / 스칼렛·바이올렛 | 레벨업(15) · 기술머신(34) · **알 기술(4)** |
| 리자몽 / LEGENDS Z-A | 레벨업(14) · 기술머신(47) |

> **Why 빈 탭이 생기지 않는가:** 기술이 없는 습득법은 그룹 자체가 응답에 오지 않는다. Z-A는 교배 시스템이 없어 알 기술 탭이 자동으로 빠지고, 별도 분기 없이 해결된다.

### 변경 2: 조회 3벌 → 1벌 통합

폼 종류별로 fetch가 3개였고, 각각 **2왕복** 구조였다.

```text
1왕복: getPokemonDetail으로 isFormChange 판별
2왕복: 그 결과로 러닝셋 쿼리 3종 중 하나 + 버전 목록 + 폼 이미지
```

"어떤 쿼리를 쏠지" 정하려고 왕복을 통째로 하나 쓰고 있었다. 통합 쿼리는 `formType`을 생략하면 서버가 BASE로 처리하므로 이 선행 조회가 사라진다.

- `defaultMoves.fetch.ts` · `formMoves.fetch.ts` · `regionMoves.fetch.ts` → `learnset.fetch.ts` 하나
- 6개 라우트가 이 하나를 공유

### 변경 3: 복붙 5곳 제거

`getPokemonLearnableData()`가 5개 `page.tsx`에 **그대로 복사**돼 있었다. 응답 구조가 `skillsByMethod` 배열로 바뀌며 이 가공 자체가 불필요해졌다.

기본 페이지 기준으로 패칭·가공 코드가 약 68줄에서 30줄로 줄었다.

### 변경 4: 조건 라벨·기술머신 번호

`level === 0 ? '진화' : level === 1 ? '최초' : …` 삼항식이 3개 파일에 복붙돼 있었다. `level=0`은 진화, `1`은 최초라는 **도메인 규칙이 프론트에 하드코딩**된 상태였다.

백엔드 `conditionLabel`로 교체했고, 기술머신은 번호(`TM24`)를 함께 받아 조건 열에 표시한다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 학습법 탭 | 2개 하드코딩 | 데이터 기반 (최대 9종) |
| fetch 파일 | 3벌 (default/form/region) | 1벌 |
| 요청 | 5쿼리 · 2왕복 | 4쿼리 · 1왕복 |
| 응답 가공 함수 | 5개 파일에 복붙 | 제거 |
| 조건 라벨 | 삼항식 3곳 복붙 | 백엔드 `conditionLabel` |
| 기술머신 번호 | 없음 | `TM24` 등 표시 |

## 🔧 기술적 세부사항

**신규 파일**

- `src/app/detail/[pokemonId]/moves/_fetch/learnset.fetch.ts`

**삭제 파일**

- `_fetch/defaultMoves.fetch.ts` · `formMoves.fetch.ts` · `regionMoves.fetch.ts`

**남은 별도 쿼리**

통합 쿼리가 모든 것을 대체하지는 않는다. 세 가지는 병렬로 함께 받는다.

- **버전 목록** — 러닝셋은 선택된 버전 하나만 주는데, 버전 선택 nav는 전체 목록이 필요하다 (`getVersionGroupsByPokemon`)
- **폼 이름·타입** — 러닝셋에 `formCode`만 있고 표시 이름이 없다. 히트로토무처럼 폼마다 이름·타입이 다른 경우가 있어 폼 조회 시에만 추가로 받는다
- **폼 이미지 목록** — 폼 전환 UI가 폼 개수를 알아야 한다

**존재하지 않는 폼 처리**

서버가 잘못된 `formIndex`에 에러를 던지므로, fetch에서 `catch`로 `null`을 만들어 페이지가 `notFound()`로 처리하게 했다.

**컨벤션 문서화**

이번 통합이 `_fetch` 폴더의 존재 이유를 실증하므로, `.claude/conventions/guides/coding.md`에 규칙을 명문화했다. 핵심은 **"모든 패칭을 분리"가 아니라 "공유되면 분리"**이며, 분리 시 **응답 가공까지 함께** 옮겨야 한다는 점이다(그러지 않아 복붙 5곳이 생겼다).

## 📌 참고 사항

- `src/graphql/`은 자동 생성 디렉토리(gitignore)이므로, 이 브랜치를 받은 뒤 백엔드 서버(`localhost:4000`)를 띄우고 `npm run codegen`을 실행해야 한다.
- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / `npm run build` 성공
- **폼체인지·리전폼 포켓몬 화면 확인 권장** — 폼 이름·타입 출처가 바뀐 지점이다(로토무, 나시 등).
- 후속: 기술 도감(`/moves/[id]`)을 `getPokemonsBySkillV2`로 전환하면 그쪽에서도 신규 습득법이 노출된다.
