---
slug: moves-metadata-robots
title: '습득 기술 메타데이터 개선 — 조합별 description + 빈 페이지 noindex'
description: '탭과 버전이 달라도 모든 페이지가 같은 description을 갖던 문제를 습득법·버전이 반영되도록 고쳤습니다. 배울 기술이 없는 조합은 noindex, follow로 색인에서 제외합니다.'
authors: [jsg3121, claude]
tags: [seo, bug-fix]
---

# 습득 기술 메타데이터 개선 — 조합별 description + 빈 페이지 noindex

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: SEO 개선 / 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

습득 기술 페이지는 습득법 4종 × 버전 N개 조합만큼 URL이 생긴다. 그런데 메타데이터가 이 조합을 제대로 반영하지 못하고 있었다.

1. **title은 버전별로 달라지는데 description은 모두 동일** — 검색 결과에서 페이지 구분이 안 된다
2. 신규 추가된 알 기술·기술 가르침이 메타데이터에 반영되지 않음
3. 배울 기술이 없는 조합도 색인 대상이라 **빈 페이지가 검색에 노출**된다

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: description이 습득법·버전을 반영

기존 description은 `version`도 `movesType`도 참조하지 않고, "전체 버전 범위"만 서술했다.

```ts
// 변경 전 — 조합과 무관하게 항상 같은 문장
const description = isSingleSeries
  ? `${versionGroups?.[0].baseVersionGroupName}시리즈에 출현한 ${pokemonName}의 모든 기술을…`
  : `${pokemonName}의 … 시리즈부터 … 시리즈까지 습득 가능한 모든 기술을…`
```

리자몽의 레벨업 탭과 기술머신 탭, USUM 버전과 Z-A 버전이 **전부 같은 설명**을 가졌다.

**변경 후** — 조합마다 달라진다.

| URL | description |
| --- | --- |
| `/moves/version/18` | 7세대 울트라썬·울트라문 시리즈의 리자몽이(가) **레벨업**(으)로 배우는 기술 **22개**를 확인하세요… |
| `/moves/version/18/machine` | …리자몽이(가) **기술머신**(으)로 배우는 기술 **43개**를 확인하세요… |
| `/moves/version/18/tutor` | …리자몽이(가) **기술 가르침**(으)로 배우는 기술 **12개**를 확인하세요… |
| `/moves/version/30/tutor` | 9세대 LEGENDS Z-A 시리즈의 리자몽은(는) 기술 가르침(으)로 **배우는 기술이 없습니다**… |

기술 수를 넣은 것은 조합마다 값이 달라 자연스럽게 고유해지고, 사용자에게도 유용한 정보이기 때문이다.

### 변경 2: 빈 페이지 noindex

습득법 탭 4종을 항상 노출하므로, 해당 버전에 그 습득법이 없으면 **"기술이 없습니다"만 있는 빈 페이지**가 된다. 이런 조합이 상당수다(리자몽 Z-A는 알 기술·기술 가르침 둘 다 0건).

```ts
robots: skillCount > 0 ? getRobotsConfig() : { index: false, follow: true }
```

> **Why `nofollow`가 아니라 `follow`인가:** 이 페이지에는 다른 버전·습득법으로 가는 링크가 있고 그중 상당수는 실제 콘텐츠가 있다. `nofollow`를 걸면 크롤러가 그 경로를 따라가지 못해 **색인 대상 페이지 발견이 늦어진다.** 색인만 막고 링크는 따라가게 하는 것이 맞다.

사이트맵은 조합별 콘텐츠 유무를 구분할 수 없으므로 전부 넣고, 페이지별 `robots`로 조정하는 방향이다.

### 변경 3: 습득법 라벨을 백엔드 값으로

메타데이터가 `'LEVELUP' | 'MACHINE'` 문자열을 받아 `'레벨업 습득' : '머신 습득'`으로 이분하고 있었다. 알 기술·기술 가르침을 표현할 수 없는 구조다.

`LearnMethod` enum을 받고 라벨은 백엔드 `methodLabel`을 쓴다. 기술이 0건이면 그룹 자체가 응답에 없어 라벨을 얻을 수 없으므로, 그 경우만 최소 폴백을 쓴다.

### 변경 4: 폼·리전 페이지도 동일 적용

`generateFormMovesMetadata`도 같은 문제를 갖고 있었다(description이 버전·습득법 미반영). 함께 고쳤다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| description | 모든 조합 동일 | 습득법·버전·기술 수 반영 |
| 습득법 표현 | 레벨업/머신 2종 | 백엔드 `methodLabel` (4종) |
| 빈 페이지 | `index, follow` | `noindex, follow` |
| 폼·리전 페이지 | 동일 문제 | 함께 수정 |

## 🔧 기술적 세부사항

**신규 파일**

- `_metadata/fetchLearnMethodCounts.ts` — 메타데이터용 경량 조회

**메타데이터용 경량 쿼리**

빈 페이지 판정에는 기술 목록이 아니라 **개수만** 필요하다. `GetLearnsetCounts`는 `skills` 배열을 요청하지 않아, 기술 수백 건을 받지 않고도 판정한다.

```graphql
skillsByMethod {
  method
  methodLabel
  totalCount   # skills 배열은 요청하지 않음
}
```

**판정 기준**

기술이 없는 습득법은 `skillsByMethod`에 **그룹 자체가 오지 않는다.** 따라서 `find`로 못 찾으면 0건이다. 실측으로 확인했다.

| 포켓몬 / 버전 | 응답에 오는 그룹 |
| --- | --- |
| 리자몽 / Z-A | `LEVEL_UP`, `MACHINE` (EGG·TUTOR 없음 → noindex) |
| 리자몽 / USUM | `LEVEL_UP`, `MACHINE`, `TUTOR` (EGG 없음 → noindex) |
| 이상해씨 / SV | `LEVEL_UP`, `MACHINE`, `EGG` (TUTOR 없음 → noindex) |

**title 중복 처리**

`알 기술`·`기술 가르침`은 라벨에 이미 "기술"이 들어 있어, 기존 접미사를 붙이면 `알 기술 습득 기술 정보`가 된다. 라벨에 "기술"이 포함되면 접미사를 `습득 정보`로 바꾼다.

## 📌 참고 사항

- `src/graphql/`은 자동 생성 디렉토리(gitignore)이므로, 이 브랜치를 받은 뒤 백엔드 서버(`localhost:4000`)를 띄우고 `npm run codegen`을 실행해야 한다.
- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / `npm run build` 성공
- 확인 방법: 페이지 소스에서 `<meta name="description">`과 `<meta name="robots">`를 버전·탭별로 비교
- `robots`는 개발 환경에서 항상 `noindex`다(`getRobotsConfig`) — 프로덕션에서 확인해야 한다.
