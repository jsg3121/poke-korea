---
slug: form-change-empty
title: '폼체인지 기술이 없는 습득 기술 페이지를 레벨업 탭으로 리다이렉트'
description: '폼체인지 기술이 없는 포켓몬·폼·버전의 form-change URL이 200 빈 페이지로 응답하던 문제를, 같은 폼·버전의 레벨업 탭으로 307 리다이렉트해 해결했다.'
authors: [jsg3121, claude]
tags: [bug-fix, nextjs, seo]
---

# 폼체인지 기술이 없는 습득 기술 페이지를 레벨업 탭으로 리다이렉트

> **작업 날짜**: 2026-10-30
> **브랜치**: `feature/1.62.2-form-change-empty`

## 📋 작업 개요

**작업 유형**: 버그 수정 (핫픽스)
**담당**: jsg3121, Claude

## 🎯 작업 목표

폼체인지 기술이 없는 조합의 `form-change` URL에 들어오면 빈 페이지 대신 같은 폼·버전의 레벨업 탭을 보여준다.

<!-- truncate -->

## 📉 왜 필요했나

1.62.1에서 폼체인지 탭을 추가하면서, 기술이 없는 버전에서는 탭을 숨겼다. 하지만 URL 자체는 모든 포켓몬·폼·버전 조합에서 200 빈 페이지("기술이 없습니다", `noindex, follow`)로 응답했다. 빈 페이지에 들어오는 경로는 두 가지였다.

1. **URL 직접 입력**: `/detail/1/moves/form-change`처럼 폼체인지와 무관한 포켓몬
2. **버전 선택에서 이동**: 폼체인지 탭을 보던 중 버전 선택기는 현재 습득법을 유지한 채 링크를 만든다. 그래서 히트로토무 SV(`version/25/form-change`)에서 Z-A를 누르면 빈 `version/31/form-change`로 이동했다. 이상해씨의 빈 폼체인지 페이지에는 이런 버전 링크가 21개 붙어 있었다.

2번은 클라이언트에서 막기 어렵다. 탭 노출 여부를 판단하는 `skillsByMethod`는 현재 버전 것만 있어서, 다른 버전에 폼체인지 기술이 있는지 알 수 없다.

## ✨ 주요 변경사항

### 변경 1: 조건부 습득법이 비었는지 판정하는 헬퍼 추가

`movesParams.module.ts`에 `isEmptyConditionalMethod`를 추가했다. 탭 노출 조건과 같은 기준(`skillsByMethod`에 해당 습득법 그룹이 있는가)을 쓴다.

```ts
export const isEmptyConditionalMethod = (
  learnMethod: LearnMethod,
  skillsByMethod?: ReadonlyArray<{ method: LearnMethod }>,
): boolean =>
  CONDITIONAL_LEARN_METHODS.has(learnMethod) &&
  skillsByMethod !== undefined &&
  !skillsByMethod.some(({ method }) => method === learnMethod)
```

### 변경 2: 습득 기술 진입 페이지 4곳에서 레벨업 탭으로 리다이렉트

`[method]`, `version/[versionGroupId]/[method]`, `form/[[...index]]`, `region/[[...index]]`의 페이지에서, 포켓몬 존재 확인 직후 같은 폼·버전의 레벨업 경로로 `redirect()` 한다.

```tsx
if (isEmptyConditionalMethod(learnMethod, learnset?.skillsByMethod)) {
  redirect(
    buildMovesPath({
      pokemonId,
      versionGroupId: parsedVersionId,
      learnMethod: DEFAULT_LEARN_METHOD,
    }),
  )
}
```

## ⚠️ 구현 시 고려한 점

### 307을 쓰고 308은 쓰지 않았다

리다이렉트 조건은 "현재 백엔드에 폼체인지 데이터가 없다"는 사실이라, 데이터가 추가되면 뒤집힐 수 있다.

- 308은 명시적 캐시 지시가 없어도 브라우저가 캐시할 수 있다([RFC 9110 §15.4.9](https://www.rfc-editor.org/rfc/rfc9110#section-15.4.9)). 나중에 데이터가 추가돼 탭이 생겨도, 308을 받았던 브라우저는 계속 레벨업으로 이동한다. 서버에서 되돌릴 방법이 없다.
- 308이 주는 SEO 이점(대상 URL을 대표 URL로 보는 강한 신호, [Google 리다이렉트 문서](https://developers.google.com/search/docs/crawling-indexing/301-redirects))은 여기서 의미가 없다. 원래 URL은 noindex 빈 페이지이고 외부 링크도 없다.
- `form/[[...index]]`의 기존 `permanentRedirect`(폼이 없는 포켓몬 → 기본 페이지)는 바뀌지 않는 구조적 사실이 조건이라 308을 유지한다.

Next.js의 `redirect()`는 307, `permanentRedirect()`는 308을 보낸다([redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)).

### learnset 조회 실패 시에는 리다이렉트하지 않는다

`fetchLearnsetQueries`는 learnset 조회에 실패하면 `null`을 돌려준다. 이것을 "기술 없음"으로 보고 리다이렉트하면, 일시적인 백엔드 오류가 `revalidate`(1년) ISR 캐시에 리다이렉트로 남는다. 그래서 `skillsByMethod`가 `undefined`면 `false`를 반환해 기존처럼 렌더링한다.

### 404와 현행 유지는 기각했다

- **404(`notFound`)**: 2번 경로의 버전 링크가 404를 가리켜 내부 링크가 깨진다. 위에서 말했듯 클라이언트에서 그 링크를 걸러낼 정보가 없다.
- **현행 유지**: 알 기술·기술 가르침의 빈 페이지와 같은 방식이라 일관성은 있다. 하지만 그 둘은 탭이 항상 보이는 습득법이고, 폼체인지는 탭을 숨기는 습득법이다. 탭이 없는데 URL만 살아 있으면 빈 URL만 늘어난다.

## 🔍 검증

- `tsc --noEmit`, `eslint`, `prettier --check` 통과
- 로컬 개발 서버에 실제 요청을 보내 확인했다(데이터는 개발 서버가 연결한 백엔드 기준).

| 요청                                               | 응답 | 이동 위치                                 |
| -------------------------------------------------- | ---- | ----------------------------------------- |
| `/detail/1/moves/form-change`                      | 307  | `/detail/1/moves`                         |
| `/detail/1/moves/version/25/form-change`           | 307  | `/detail/1/moves/version/25`              |
| `/detail/479/moves/form-change`                    | 307  | `/detail/479/moves`                       |
| `/detail/479/moves/form/1/form-change`             | 307  | `/detail/479/moves/form/1`                |
| `/detail/479/moves/form/1/version/31/form-change`  | 307  | `/detail/479/moves/form/1/version/31`     |
| `/detail/52/moves/region/form-change`              | 307  | `/detail/52/moves/region`                 |
| `/detail/52/moves/region/1/version/25/form-change` | 307  | `/detail/52/moves/region/1/version/25`    |
| `/detail/479/moves/form/1/version/25/form-change`  | 200  | (히트로토무 SV, 기술 있음)                |
| `/detail/1/moves/tutor`, `/detail/1/moves/version/25/egg` | 200 | (조건부가 아닌 습득법은 영향 없음) |

리다이렉트 목적지 4곳도 200을 확인했다.

- **확인하지 않은 것**: 프로덕션 빌드의 ISR 캐시에 리다이렉트가 저장되는지, 버전 선택기를 클릭하는 클라이언트 내비게이션에서 리다이렉트가 따라가지는지는 브라우저로 확인하지 않았다.
