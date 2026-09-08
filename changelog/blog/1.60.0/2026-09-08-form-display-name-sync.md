---
slug: form-display-name-sync
title: '폼 표시명 백엔드 위임 — 이름 합성 제거와 폼 인덱스 404'
description: '백엔드가 폼 name을 완결된 표시명으로 바꾸면서 프론트의 이름 합성 코드가 중복을 만들게 됐습니다. 조립 책임을 백엔드로 넘겨 12곳을 제거하고, 검증 중 발견한 폼 인덱스 범위 초과(중복 URL·500)를 404로 고쳤습니다.'
authors: [jsg3121, claude]
tags: [refactoring, graphql, seo, bug-fix]
---

# 폼 표시명 백엔드 위임

> **작업 날짜**: 2026-09-08
> **브랜치**: `feature/1.60.0`

## 📋 작업 개요

**작업 유형**: 리팩토링 (백엔드 계약 변경 대응) + 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

백엔드가 리전폼·노말폼의 `name`을 **그 자체로 완전한 표시명**으로 변경했다. 프론트에서 종명·지역명을 덧붙이던 조합 코드를 제거하고, 이름 조립 책임을 백엔드로 일원화한다.

전수 검증 과정에서 폼 인덱스 범위를 아무도 검사하지 않는다는 것이 드러나, 백엔드·프론트 양쪽을 함께 고쳤다.

<!-- truncate -->

## 📉 왜 필요했나

### 폼마다 이름 규칙이 달랐다

메가진화·거다이맥스는 원래부터 `메가리자몽X`·`거다이맥스 리자몽`처럼 완결된 이름이 내려왔다. 그런데 리전폼·노말폼만 규칙이 달랐다.

| 폼 종류 | 기존 백엔드 응답 | 프론트가 하던 일 |
| --- | --- | --- |
| 메가진화 | `메가리자몽X` | 그대로 사용 |
| 거다이맥스 | `거다이맥스 리자몽` | 그대로 사용 |
| 리전폼 | 59건 중 **54건이 빈 문자열** | `{종명} {지역}의 모습` 합성 |
| 노말폼 | `캐스퐁_빗방울폼` (언더바 구분자) | `replace('_', ' ')` 치환 |

같은 "폼 이름"인데 셋을 서로 다르게 다뤄야 했다. 리전폼 `name`이 대부분 비어 있었기 때문에 프론트가 지역명으로 이름을 만들어 쓸 수밖에 없었다.

### 백엔드 변경으로 합성이 중복을 만들게 됐다

이번에 리전폼·노말폼도 게임 공식 표기가 `name`에 직접 들어갔다. 그러자 기존 합성 코드가 이름을 두 번 출력하게 됐다.

```ts
// 백엔드 응답: name = "나옹 알로라의 모습"

`${pokemon.name} ${form.region}의 모습`   // → "나옹 알로라의 모습 알로라의 모습"
`${pokemon.name} (${form.name})`          // → "나옹 (나옹 알로라의 모습)"
```

폼명 표기는 게임 공식을 따르므로 일률적이지 않다. 메테노는 `유성의 모습`과 `노란색 코어`가 섞여 있고, 실버디는 `의 모습`이 아예 없다. **규칙으로 가공할 수 없는 값**이므로 받은 그대로 쓰는 것이 유일하게 옳다.

## ✨ 주요 변경사항

### 변경 1: 리전폼 이름 합성 제거 (4곳)

**변경 전**:

```ts
// src/container/detail/modules/activeForm.module.ts
name: `${pokemonBaseInfo?.name} ${form?.region}의 모습 ${form?.name && `(${form?.name})`}`,
```

**변경 후**:

```ts
// 백엔드 name이 그 자체로 완전한 표시명이다(2026-09-08 폼 표시명 변경).
// 종명·지역명을 덧붙이면 "나옹 (나옹 알로라의 모습)"처럼 이름이 중복된다.
name: form?.name || pokemonBaseInfo?.name || '',
```

빈 값 폴백을 남긴 이유는 과거 리전폼 `name`이 54건 빈 문자열이던 이력 때문이다. 배포 순서가 어긋나 옛 응답이 오더라도 이름이 통째로 비지 않는다.

### 변경 2: SEO title이 폼 이름을 반영하도록 수정

`<title>`·OG title·JSON-LD를 만드는 `getPokemonNameByType`은 화면 렌더와 별개 경로인데, **리전폼은 `name`을 아예 받지 않고 지역명만으로 이름을 조립**하고 **노말폼은 폼 정보를 받지 않아 원종명만** 내보내고 있었다.

**변경 전**:

```ts
type GetPokemonNameByTypeParams = {
  regionFormPlace: string   // 지역명만 받음, 노말폼 파라미터 없음
}

case 'region': {
  const regionFormText = `${pokemonBaseInfoName} ${regionFormPlace} 리전폼`
  return `${regionFormText}${shinyText}`
}
default: {
  return `${pokemonBaseInfoName}${shinyText}`   // 폼명이 사라진다
}
```

**변경 후**:

```ts
type GetPokemonNameByTypeParams = {
  regionFormName: string    // 완결된 표시명을 받음
  normalFormName: string    // 노말폼도 동일하게 받음
}

case 'region': {
  // 값이 비면 원종명으로 떨어뜨린다(과거 리전폼 name이 빈 문자열이던 이력).
  return `${regionFormName || pokemonBaseInfoName}${shinyText}`
}
default: {
  // 폼이 없는 포켓몬은 normalFormName이 비어 원종명이 그대로 쓰인다.
  return `${normalFormName || pokemonBaseInfoName}${shinyText}`
}
```

메가·거다이맥스는 이미 완성된 `name`을 받고 있었으므로, 리전폼·노말폼을 같은 규칙으로 맞춘 셈이다. 네 폼이 모두 "백엔드 `name`을 그대로 쓴다"는 하나의 규칙을 따르게 됐다.

노말폼 title 누락은 백엔드 변경 이전부터 있던 문제다. 화면 h1은 `getActiveFormInfo`라는 다른 경로를 써서 정상이었기 때문에, **검색 결과에서만 폼 구분이 사라지는 상태**였다.

### 변경 3: 노말폼 인덱스 기준 통일

`fetchNormalFormData(id, activeIndex)`는 **해당 인덱스 하나만** 담아 온다. 그래서 배열은 `[0]`으로 읽어야 하는데, `getPokemonName`만 `[activeIndex]`를 써서 index&gt;0이면 `undefined`가 됐다.

```ts
// 같은 파일 안에서 기준이 갈려 있었다
getPokemonTypes  → normalForm?.[0]           // 올바름
getPokemonSize   → normalForm?.[0]           // 올바름
getPokemonName   → normalForm?.[activeIndex] // 잘못됨 → [0]으로 수정
```

`getPokemonName`은 현재 호출부가 없어 문제가 드러나지 않았지만, 기준이 어긋난 채 두면 나중에 쓰는 쪽이 같은 함정을 밟는다. 1.58.0에서 잡았던 폼 인덱스 오독과 동일한 유형이다.

### 변경 4: 무의미해진 언더바 치환 제거 (7곳)

노말폼 `캐스퐁_빗방울폼`이 `캐스퐁 빗방울의 모습`으로 바뀌면서 `replace('_', ' ')`가 아무 일도 하지 않게 됐다. 당장 버그는 아니지만, 남겨두면 "언더바가 온다"는 잘못된 전제를 코드가 계속 주장하게 된다.

### 변경 5: 존재하지 않는 폼 인덱스를 404로 처리

전수 검증 중 발견해 백엔드와 함께 고친 문제다.

**백엔드 쪽**: `getPokemonNormalForm`이 폼 개수를 넘는 `activeIndex`에도 빈 배열 대신 **0번 폼을 반환**하고 있었다. 폼 보유 46종 전체가 대상이었다.

```text
getPokemonNormalForm(964, activeIndex: 0)  → [{ "돌핀맨 나이브폼" }]
getPokemonNormalForm(964, activeIndex: 1)  → [{ "돌핀맨 마이티폼" }]
getPokemonNormalForm(964, activeIndex: 2)  → [{ "돌핀맨 나이브폼" }]  ← 폼은 2개뿐
getPokemonNormalForm(964, activeIndex: 99) → [{ "돌핀맨 나이브폼" }]
```

백엔드가 범위 밖(음수 포함)에 빈 배열을 반환하도록 수정했다.

**프론트 쪽**: 폼 라우트 4종(`region`·`form`·`mega`·`gigantamax`)에 인덱스 존재 여부 가드가 없었다. 포켓몬 ID 유효성과 폼 보유 여부(`isRegionForm` 등)는 검사했지만, **인덱스가 배열 범위 안인지는 확인하지 않았다.**

```ts
// 페이지: 없는 폼이면 404
if (!regionFormData[activeIndex]) {
  notFound()
}

// generateMetadata: 404 응답에 정상 title이 붙지 않도록 빈 객체 반환
if (!regionFormData[activeIndex]) {
  return {}
}
```

노말폼은 인덱스 하나만 담아 오므로 `normalFormData.length === 0`으로, 나머지는 전체 배열이라 `[activeIndex]` 존재 여부로 판별한다.

**결과**:

| 경로 | 변경 전 | 변경 후 |
| --- | --- | --- |
| `/detail/964/form/2` | 200 (원종과 동일 내용) | **404** |
| `/detail/964/form/99` | 200 | **404** |
| `/detail/52/region/2` | **500** | **404** |
| `/detail/550/region/1` | **500** | **404** |
| `/detail/6/mega/2` | 500 | **404** |

200으로 응답하던 쪽은 **색인 가능한 중복 URL이 사실상 무한히 생성**되던 상태였고, 500은 검색엔진에 "사이트 오류"로 읽혀 크롤 예산을 소모했다. 둘 다 404가 맞다.

## 📊 변경 결과

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 이름 합성 지점 | 12곳 | **0곳** |
| 리전폼 이름 출처 | 종명 + 지역명 조합 | 백엔드 `name` |
| 노말폼 이름 출처 | `name` + 언더바 치환 | 백엔드 `name` |
| 노말폼 title 폼 구분 | 없음 (원종명만) | **폼별 구분** |
| 수정 파일 | — | 12개 |

### 노말폼 title 개선 효과

폼별로 다른 제목이 검색 결과에 노출된다. 변경 전에는 아래 9개 URL이 전부 같은 제목이었다.

| 경로 | 변경 전 | 변경 후 |
| --- | --- | --- |
| `/detail/774` | `No. 774 메테노` | `No. 774 메테노 유성의 모습` |
| `/detail/774/form/1` | `No. 774 메테노` | `No. 774 메테노 빨간색 코어` |
| `/detail/774/form/2` | `No. 774 메테노` | `No. 774 메테노 주황색 코어` |
| `/detail/745` | `No. 745 루가루암` | `No. 745 루가루암 한낮의 모습` |
| `/detail/745/form/1` | `No. 745 루가루암` | `No. 745 루가루암 한밤중의 모습` |
| `/detail/745/form/2` | `No. 745 루가루암` | `No. 745 루가루암 황혼의 모습` |
| `/detail/351/form/1` | `No. 351 캐스퐁` | `No. 351 캐스퐁 태양의 모습` |
| `/detail/902/form/1` | `No. 902 대쓰여너` | `No. 902 대쓰여너 암컷의 모습` |
| `/detail/585/form/1` | `No. 585 사철록` | `No. 585 사철록 여름의 모습` |

1.58.0에서 상세 페이지 description을 폼별로 갈랐을 때 메가진화 노출이 2.5배·클릭이 3배로 늘었다. 같은 원리가 title에도 적용된 셈이라 노말폼 폼별 검색어(`루가루암 황혼`·`캐스퐁 태양의 모습` 등)에서 개선을 기대할 수 있다.

## 🔍 검증 결과

개발 서버에서 실제 페이지를 요청해 title·h1을 확인했다. 백엔드 안내 문서의 확인용 케이스 전수를 대조했다.

| 포켓몬 | 경로 | 렌더 결과 | 기대값 일치 |
| --- | --- | --- | --- |
| 나옹 (알로라) | `/detail/52/region` | `No. 52 나옹 알로라의 모습` | ✅ |
| 나옹 (가라르) | `/detail/52/region/1` | `No. 52 나옹 가라르의 모습` | ✅ |
| 꼬렛 (알로라) | `/detail/19/region` | `No. 19 꼬렛 알로라의 모습` | ✅ |
| 켄타로스 (팔데아) | `/detail/128/region` | `No. 128 켄타로스 팔데아의 모습 (컴뱃종)` | ✅ |
| 배쓰나이 (히스이) | `/detail/550/region` | `No. 550 배쓰나이 히스이의 모습 (백색근)` | ✅ |
| 메테노 | `/detail/774/form/1` | `No. 774 메테노 빨간색 코어` | ✅ |
| 루가루암 | `/detail/745/form/2` | `No. 745 루가루암 황혼의 모습` | ✅ |
| 대쓰여너 | `/detail/902/form/1` | `No. 902 대쓰여너 암컷의 모습` | ✅ |
| 메가리자몽X | `/detail/6/mega` | `No. 6 메가리자몽X` | ✅ (회귀 없음) |
| 거다이맥스 리자몽 | `/detail/6/gigantamax` | `No. 6 거다이맥스 리자몽` | ✅ (회귀 없음) |
| 피카츄 (폼 없음) | `/detail/25` | `No. 25 피카츄` | ✅ (회귀 없음) |
| 이로치 접미사 | `/detail/745/form/1?shinyMode=shiny` | `… 루가루암 한밤중의 모습 이로치` | ✅ |

`<title>`뿐 아니라 **OG title·JSON-LD `name`도 같은 값**으로 반영되는 것을 확인했다. 기술 페이지(`/detail/52/moves/region` → `나옹 알로라의 모습 리전폼 …`)와 챔피언스 상세도 중복 없이 렌더된다.

### 전수 검증 — URL 347개

폼 유형이 고루 섞이도록 162종을 골라 SSR 응답을 스크립트로 대조했다. Next.js 캐시가 옛 값을 돌려주는 것을 실제로 겪어, 요청마다 캐시 우회 파라미터를 붙였다.

| 검사 항목 | 결과 |
| --- | --- |
| HTTP 오류(500 등) | **0건** (기존 2건 해소) |
| title · OG · JSON-LD 일치 | **0건 불일치** |
| 이름 중복(`나옹 나옹 알로라의 모습` 등) | **0건** |
| 폼 간 title 중복 | **0건** |
| 404(범위 밖, 의도된 동작) | 3건 |

`npx tsc --noEmit` 통과, `npm run lint`에서 수정 파일 경고 0건이다.

## 🔧 기술적 세부사항

**수정 파일 16개**

| 구분 | 파일 |
| --- | --- |
| 이름 선택 로직 | `src/container/detail/modules/activeForm.module.ts` |
| SEO 메타 | `src/module/generateDetailSeoMetaData.ts` |
| SEO 호출부 | `src/app/detail/[pokemonId]/(form)/modules/generateMetadata.ts` |
| JSON-LD | `src/constants/pokemonJsonLd.ts`, `src/constants/championsJsonLd.ts` |
| 폼 인덱스 가드 | `(form)/region`·`(form)/form`·`(form)/mega`·`(form)/gigantamax`의 `[[...index]]/page.tsx` |
| 리전폼 기술 | `src/app/detail/[pokemonId]/moves/region/[[...index]]/page.tsx` |
| 노말폼 기술 | `src/app/detail/[pokemonId]/moves/form/[[...index]]/page.tsx` |
| 기술 메타 | `src/app/detail/[pokemonId]/moves/_metadata/generateMovesMetadata.ts` |
| 기술 화면 | `src/container/detail/moves/DetailMovesHero.container.tsx`, `src/views/detail/DetailMoves.view.tsx` |
| 챔피언스 | `_metadata/generateChampionsDetailMetadata.ts`, `_fetch/renderChampionsDetail.tsx` |

**변경하지 않은 것**

`formName`은 **폼명만** 담는 용도라 백엔드에서도 그대로 유지됐다. 종명이 필요한 자리는 `baseName`·`pokemon.name`을 쓰므로 이번 변경과 무관하다.

스킬·특성 연계는 `regionFormCode`·`normalFormCode`로 조인하고 검색은 종 이름만 필터하므로 `name` 변경의 영향을 받지 않는다.

## 📌 참고 사항

### 배포는 백엔드와 함께 나가야 한다

두 가지 이유로 **동시 배포**가 전제다.

1. **표시명** — 프론트를 먼저 배포하면 옛 응답(리전폼 `name` 빈 문자열)이 오는 동안 이름이 원종명으로 폴백된다. 화면이 깨지지는 않지만 폼 구분이 사라진다.
2. **폼 인덱스 404** — 백엔드가 범위 밖에 0번 폼을 반환하는 상태에서는 프론트 가드가 동작하지 않는다. 리전폼 500은 프론트만으로 해결되지만, 노말폼 중복 URL은 백엔드 수정이 함께 있어야 닫힌다.

### 표시명 형식은 중간에 한 번 바뀌었다

백엔드 안내 문서 초안에는 리전폼이 `알로라 나옹`(종명 뒤)으로 적혀 있었으나, 확인 결과 그건 커뮤니티 관용 표기였고 PokeAPI 공식은 `알로라의 모습`(종명 없음)이라 `{종명} {지역}의 모습`으로 확정됐다.

작업 중 이 차이를 발견하지 못하고 초안 예시를 기대값으로 삼아 검증했는데, Next.js 캐시에 남아 있던 옛 값이 우연히 초안과 일치해 "통과"로 오판한 구간이 있었다. **캐시 우회 후 재검증**해 실제 값이 최종 형식과 맞음을 확인했다.

프론트는 백엔드 `name`을 그대로 쓰므로 형식이 바뀌어도 코드 변경이 필요 없다 — 이번 작업의 목적이 정확히 그것이다.

### 작업 중 발견해 함께 고친 기존 이슈

노말폼 상세의 `title`이 폼명 없이 원종명만 노출하고 있었다.

```text
변경 전  /detail/774/form/1  title: No. 774 메테노        ← 폼명 없음
                             h1:    메테노 빨간색 코어     ← 정상
```

화면 h1은 `getActiveFormInfo`, title은 `getPokemonNameByType`으로 **경로가 갈려 있어** 한쪽만 폼을 반영하던 상태였다. `stash` 후 재현해 백엔드 변경 이전부터 동일함을 확인했고, 이번 변경이 만든 회귀가 아니다.

처음에는 범위 밖으로 두려 했으나 title이 검색 결과에 직접 노출되는 값이라 함께 고쳤다. 노말폼 URL 9개 이상이 서로 같은 제목을 쓰던 문제가 해소된다.

### 백엔드 쪽 알려진 문제

불비달마 `달마모드`가 폼체인지인데 리전폼 테이블에 분류돼 있다. 백엔드 안내 문서에 명시된 사항이며 이번 범위 밖이다.
