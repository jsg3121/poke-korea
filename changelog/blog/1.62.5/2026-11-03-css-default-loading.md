---
slug: css-default-loading
title: 'CSS·폰트 수동 주입을 걷어내고 Next.js 기본 로딩으로 복원'
description: 'webpack 진입점에 CSS를 끼워 넣고 런타임에 파일을 찾아 head에 직접 넣던 방식과 전체 폰트 preload를 제거하고, App Router 표준인 layout의 globals.css import로 되돌렸다.'
authors: [jsg3121, claude]
tags: [performance, nextjs, css]
---

# CSS·폰트 수동 주입을 걷어내고 Next.js 기본 로딩으로 복원

> **작업 날짜**: 2026-11-03
> **브랜치**: `feature/1.62.5-css-default-loading`

## 📋 작업 개요

**작업 유형**: 성능 개선 / 리팩토링
**담당**: jsg3121, Claude

## 🎯 작업 목표

CSS와 폰트를 직접 찾아 `<head>`에 넣던 우회 방식을 제거하고, Next.js App Router의 기본 CSS 로딩으로 되돌린다. 그 과정에서 LCP 이미지와 대역폭을 다투던 폰트 preload를 없앤다.

<!-- truncate -->

## 📉 왜 필요했나

2026-01-07(`fe4ad652`, "css, font preload로 변경")에 렌더 차단을 줄이려고 도입한 방식이 지금도 동작하고 있었다. 세 부분이 맞물려 있었다.

| 구성                                   | 하던 일                                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `next.config.js` 진입점 주입           | Next.js가 내부적으로 빌드하는 `pages/_app` 진입점에 `globals.css`를 끼워 넣어 CSS 파일을 만들게 함       |
| `next.config.js` `splitChunks`         | 모든 CSS를 `global`·`styles` 청크로 강제로 묶음                                                          |
| `src/utils/getCssFiles.ts`             | 런타임에 `.next/static/css` 폴더를 읽어 CSS를 preload + stylesheet로 직접 삽입. `public/fonts`의 모든 폰트도 preload |

운영 빌드에서 `globals.css`는 `layout.tsx`에서 import되지 않았다(개발 모드에서만 `require`). 그래서 Next.js는 CSS의 존재를 모르고, 수동 삽입이 유일한 경로였다.

이 방식의 문제는 두 가지였다.

- **효과가 없었다.** 결과적으로 CSS 파일 1개(압축 전송 약 13KB)를 렌더 차단 링크로 넣는 것은 Next.js 기본 동작과 같다. 대신 빌드 구조에 의존하는 코드(`pages/_app` 진입점, 파일 시스템 읽기)만 남았다.
- **폰트 preload가 LCP를 늦췄다.** Lighthouse 모바일 측정에서 LCP 요소는 포켓몬 이미지였다. 그런데 약 600KB의 폰트 두 개가 이미지와 같은 시점에 High 우선순위로 내려받아져, 이미지 다운로드가 밀렸다(`/detail/25` LCP 11.0초, 그중 이미지 대기 3.1초·다운로드 7.0초).

## ✨ 주요 변경사항

### 변경 1: `layout.tsx`에서 `globals.css`를 항상 import

**변경 전**:

```tsx
if (process.env.NODE_ENV === 'development') {
  require('~/styles/globals.css')
}
```

**변경 후**:

```tsx
import '~/styles/globals.css'
```

App Router에서 전역 스타일을 넣는 표준 방식이다. Next.js가 CSS 링크를 직접 `<head>`에 넣는다.

### 변경 2: 수동 CSS·폰트 삽입 제거

`layout.tsx`의 `getCssFiles()`·`getFontFiles()` 호출과 그 결과로 만들던 `<link rel="preload">`·`<link rel="stylesheet">`를 제거하고, `src/utils/getCssFiles.ts`를 삭제했다.

폰트는 `globals.css`의 `@font-face`(`font-display: swap`)로 그대로 로드된다. preload가 사라지면 폰트는 CSS를 읽은 뒤 실제로 쓰일 때 내려받는다.

### 변경 3: webpack CSS 강제 분리·진입점 주입 제거

`next.config.js`에서 `splitChunks`의 `globalStyles`·`styles` 그룹과 `pages/_app` 진입점 주입 코드를 제거했다. `config.target = ['web', 'es2022']`는 그대로 두었다.

## 🔍 검증

백엔드 `type-graphql` 리졸버에서 스키마를 직접 생성해(`buildSchema` → `printSchema`, DB 불필요) `npm run codegen`과 같은 생성 파일을 만든 뒤 전체 검증을 실행했다.

| 항목                          | 결과                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `tsc --noEmit` (프로젝트 전체) | 에러 0건                                                                                                                                   |
| `eslint src`                  | 통과                                                                                                                                       |
| `npm run build`               | 성공 (정적 페이지 17개 생성)                                                                                                               |
| 빌드 산출 CSS                 | `3c6ce82ace0f7e9c.css` 1개 — **변경 전 운영과 해시까지 같은 파일**                                                                        |
| `next start` 후 HTML          | `/`, `/detail/25`, `/list`, `/moves/85` 모두 CSS가 Next.js 방식(`data-precedence`)으로 1번 들어가고, 폰트 preload는 0개                    |
| 브라우저 화면 (모바일)        | 배경색·컴포넌트 스타일 정상, `Gmarket Sans` 500·700 로드 확인                                                                             |

CSS 내용은 그대로이고, 넣는 주체만 수동 코드에서 Next.js로 바뀌었다.

## 📌 참고 사항

- 폰트 자체의 용량 문제(한글 11,172자 전체 포함)는 같은 버전의 폰트 서브셋 작업에서 다룬다.
- 페이지별 Lighthouse 변화는 1.62.5 성능 측정 글에서 비교한다.
