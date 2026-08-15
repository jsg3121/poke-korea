---
slug: tab-label-ssr-scroll
title: '습득법 탭 라벨 SSR 반영 + 탭·버전 이동 시 스크롤 유지'
description: '탭 이름이 한글 대신 영문(LEVEL_UP)으로 보이던 문제를 서버에서 라벨을 미리 받아 해결했습니다. 탭과 버전 칩을 눌렀을 때 페이지가 최상단으로 튀던 동작도 스크롤을 유지하도록 바꿨습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, ux, nextjs]
---

# 습득법 탭 라벨 SSR 반영 + 탭·버전 이동 시 스크롤 유지

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 버그 수정 / UX 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

습득 기술 페이지에서 두 가지 문제를 해결한다.

1. 탭 이름이 한글이 아니라 영문(`LEVEL_UP`)으로 보인다 — 모바일에서 특히 오래 보인다
2. 탭이나 버전 칩을 누르면 페이지가 최상단으로 튄다

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 라벨을 서버에서 미리 받는다

습득법 한글 라벨은 백엔드 마스터 쿼리(`getLearnMethods`)에서 받는데, 이를 **클라이언트 훅에서만** 조회하고 있었다.

```ts
// 변경 전 — 클라이언트에서만 실행
const { data } = useGetLearnMethodsQuery()
const getLabel = (method) => labelMap.get(method) ?? method  // 폴백 = enum 원문
```

SSR 시점에는 데이터가 없어 폴백인 enum 원문(`LEVEL_UP`·`MACHINE`)이 HTML에 들어가고, 클라이언트 쿼리가 도착해야 한글로 바뀐다.

> **Why 모바일에서만 눈에 띄었나:** 데스크톱에서도 영문이 잠깐 나타났다 바뀌지만 너무 빨라 인지되지 않는다. 모바일은 네트워크가 느려 그 구간이 길어져 "영어로 나온다"로 보인다.

서버 fetch(`learnset.fetch.ts`)에 `getLearnMethods`를 추가하고 컨텍스트로 내려, **첫 렌더부터 한글**이 나온다. 훅은 컨텍스트 값을 우선하고, 값이 있으면 클라이언트 쿼리를 `skip`해 불필요한 요청도 막는다.

컨텍스트 밖(다른 페이지)에서 쓸 때는 기존처럼 클라이언트 쿼리로 폴백한다.

### 변경 2: 탭·버전 이동 시 스크롤 유지

`next/link`는 기본적으로 이동 시 스크롤을 맨 위로 올린다. 그런데 학습법 탭과 버전 nav는 **sticky 크롬 안에 있어 이동 후에도 화면에 남는다.** 페이지만 최상단으로 튀면 방금 누른 탭이 시야에서 사라져 맥락이 끊긴다.

`scroll={false}`를 적용했다. DS 컴포넌트(`TabItem`·`MovesVersionNav`)에는 **기본값을 바꾸지 않고 opt-in prop으로** 추가해, 다른 사용처의 동작은 그대로 둔다.

| 컴포넌트 | 기본값 | 이번 적용 |
| --- | --- | --- |
| `TabItemComponent` | `scroll` 미지정 (맨 위로 올림) | sticky 크롬에서만 `false` |
| `MovesVersionNavComponent` | 동일 | 동일 |

> **버전 nav의 자동 스크롤과 충돌하지 않는가:** `MovesVersionNav`는 마운트 시 활성 칩이 보이도록 `scrollIntoView`를 호출한다. 다만 `block: 'nearest'`라 이미 보이는 요소는 세로 스크롤을 건드리지 않으므로 `scroll={false}`와 충돌하지 않는다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 탭 라벨(첫 렌더) | `LEVEL_UP` (enum 원문) | `레벨업` |
| 라벨 조회 | 클라이언트 쿼리만 | 서버 우선 + 클라이언트 폴백 |
| 탭 이동 시 | 최상단으로 튐 | 스크롤 유지 |
| 버전 칩 이동 시 | 최상단으로 튐 | 스크롤 유지 |

## 🔧 기술적 세부사항

**수정 파일**

- `_fetch/learnset.fetch.ts` — `getLearnMethods` 추가, `learnMethodLabels` 반환
- `context/DetailMoves.context.tsx` — `learnMethodLabels` 필드
- `hook/useLearnMethodLabels.ts` — 컨텍스트 우선, 있으면 쿼리 `skip`
- `components/tab/TabItem.component.tsx` — `scroll` prop
- `components/moves/MovesVersionNav.component.tsx` — `scroll` prop
- `container/detail/moves/DetailMovesStickyNav.container.tsx` — `scroll={false}` 적용
- moves 하위 라우트 6개 — `learnMethodLabels` 전달

**쿼리가 하나 늘지 않는가**

`getLearnMethods`는 포켓몬과 무관한 정적 마스터 데이터다. 백엔드가 24시간 캐시하고 프론트도 `cache-first`라, 실질 비용은 첫 요청 1회다. 기존 병렬 배치에 합류하므로 왕복도 늘지 않는다.

## 📌 참고 사항

- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / `npm run build` 성공
- 확인 경로: `/detail/6/moves` — 탭 라벨이 처음부터 한글인지, 탭·버전 칩을 눌렀을 때 스크롤이 유지되는지
- **모바일에서 확인 권장** — 라벨 문제가 드러났던 환경이다.
