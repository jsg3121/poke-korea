---
slug: 1-53-0-remove-cross-fetch
title: '[1.53.0] 번들 최적화 Phase 2 — cross-fetch 제거 (Next.js 내장 fetch 사용)'
description: 'Apollo HttpLink에 주입하던 cross-fetch 폴리필을 제거하고 Next.js 내장 fetch로 대체. 루트 레이아웃 공유 청크에서 raw -10.3KB / gzip -3.2KB 절감. optimizePackageImports는 효과 검증 후 롤백.'
authors: [jsg3121, claude]
tags: [performance, nextjs, refactoring]
---

# 1.53.0 — 번들 최적화 Phase 2

> **작업 일자**: 2026-06-11
> **작업 브랜치**: `feature/1.53.0-optimize-imports`

## 📋 작업 개요

**작업 유형**: 레거시 폴리필 제거 + 번들 최적화
**담당**: jsg3121 + Claude

Phase 1(chart.js 동적 임포트)에 이어, 번들에 불필요하게 포함된 레거시 폴리필을
정리했다. `@apollo/client`의 `HttpLink`에 명시적으로 주입하던 `cross-fetch`가
모던 브라우저·Next.js 환경에서는 중복 코드임을 측정으로 확인하고 제거했다.

<!-- truncate -->

## 🎯 작업 목표

- 모던 브라우저/Next.js 내장 `fetch`와 중복되는 `cross-fetch` 폴리필 제거
- 루트 레이아웃 공유 청크 크기 감소 (전 페이지 적용)
- 측정 기반으로 효과를 검증하고, 효과 없는 변경은 롤백

## 🔍 문제 분석

### optimizePackageImports — 검증 후 롤백

먼저 `next.config.js`에 `optimizePackageImports: ['@apollo/client']`를 추가해
배럴 패키지 트리셰이킹을 시도했으나, **빌드 산출물이 청크 해시까지 완전히 동일**했다.

근본 원인: `@apollo/client`는 Next.js의 **기본 최적화 목록에 이미 포함**되어 있어,
명시적 추가가 중복 선언에 불과했다. 효과 0을 확인하고 변경을 롤백했다.

근거: [Next.js optimizePackageImports](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports) —
"Some libraries are optimized by default."

### cross-fetch — 실제 번들에 포함된 레거시

`src/module/apolloClient.ts`가 `HttpLink`에 `cross-fetch`를 `fetch`로 주입하고 있었다.

- `cross-fetch`의 브라우저 ponyfill은 `Headers`·`Request`·`Response`·`XMLHttpRequest`
  기반 `fetch`를 자체 구현한다.
- 그러나 프로젝트 타겟 브라우저(Chrome ≥114 등)와 Next.js 서버(Node 18+)는 `fetch`를
  **네이티브로 제공**한다 → ponyfill은 중복 코드.
- 빌드 매니페스트 확인 결과, 이 폴리필은 **루트 레이아웃(`/layout`) 공유 청크**에 묶여
  `ApolloProvider`와 함께 모든 페이지로 전달되고 있었다.

## ✨ 주요 변경사항

### cross-fetch 제거 → Next.js 내장 fetch 사용

```ts
// 변경 전
import fetch from 'cross-fetch'
// ...
link: new HttpLink({ uri: GQLMode, fetch }),

// 변경 후
link: new HttpLink({ uri: GQLMode }),
```

- `HttpLink`는 `fetch` 옵션을 생략하면 환경의 전역 `fetch`를 자동 사용한다.
- `package.json`에서 `cross-fetch` 의존성 제거 (`cross-fetch` → `node-fetch` 체인 정리).

근거:
[Apollo HttpLink — fetch 옵션](https://www.apollographql.com/docs/react/api/link/apollo-link-http#fetch)
("By default, this is the global fetch."),
[Next.js fetch 확장](https://nextjs.org/docs/app/api-reference/functions/fetch)

## 📊 최적화 결과 (빌드 실측)

루트 레이아웃(`/layout`) = 전 페이지가 공유하는 청크 기준 측정.

| 측정 기준          | 변경 전  | 변경 후  | 절감          |
| ------------------ | -------- | -------- | ------------- |
| raw (비압축)       | 519.9 KB | 509.6 KB | **-10.3 KB**  |
| gzip (실제 전송)   | 154.8 KB | 151.6 KB | **-3.2 KB**   |

- cross-fetch가 포함됐던 청크(`3221`)가 완전히 사라짐 — 클라이언트 번들에서 ponyfill 흔적 0.
- 루트 레이아웃 공유 청크라 **layout을 받는 모든 페이지에 동일하게 적용**된다.
- Next.js 빌드 출력의 `shared by all`(102KB) 라인은 100% 공통 최소 청크만 집계하므로
  변동 없이 보이지만, 실제 절감은 각 페이지 First Load JS에 흡수된다.

> 예상치(raw ~20KB)보다 실측(raw ~10KB)이 작았던 이유: webpack이 청크를 재배치하면서
> 일부 코드가 다른 공유 청크로 흡수되어 순감소가 절반 수준이 됐다.

## ✅ 검증

- `npm run build` — 빌드 성공, cross-fetch 청크 제거 확인
- `npm run lint` — apolloClient 관련 신규 경고 없음 (기존 `any` 경고만 잔존)
- **GraphQL 동작 검증** — dev 서버에서 서버 쿼리 페이지(메인 등)·클라이언트 쿼리
  페이지(상세 등) 양쪽 데이터 정상 렌더 확인. `HttpLink` + 내장 fetch 경로 정상 동작.

## 🔜 후속 Phase (이번 범위 아님)

- **Phase 3**: `/type-effectiveness` page 전용 청크(180KB) 데이터/로직 분할
