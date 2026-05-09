---
slug: nextjs-15-upgrade
title: 'Next.js 14 → 15 메이저 업그레이드 (보안 패치)'
description: '14.x EOL 라인 탈출 및 React Server Components 다수 보안 취약점(CVE-2025-66478 외) 대응을 위한 Next.js 15.5.18 마이그레이션'
authors: [jsg3121, claude]
tags: [nextjs, refactoring]
---

# Next.js 14 → 15 메이저 업그레이드

> **작업 날짜**: 2026-05-09
> **브랜치**: `feature/1.41.0-nextjs-15-upgrade`
> **관련 ADR**: [ADR-0004 Next.js 14 → 15 메이저 업그레이드](/.claude/decisions/records/ADR-0004-nextjs-15-migration.md)

## 📋 작업 개요

**작업 유형**: 메이저 의존성 업그레이드 / 보안 패치
**담당**: jsg3121 + Claude

## 🎯 작업 목표

`npm audit`이 보고한 5건의 Next.js 본체 high-severity 취약점을 해소하고, EOL 상태인 14.x 라인에서 활발히 보안 백포트가 유지되는 15.x 라인으로 이전한다. React 18 생태계는 그대로 유지하여 다른 의존성 변경을 최소화한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 1. Next.js 패키지 라인 업그레이드

| 패키지 | 변경 전 | 변경 후 |
| --- | --- | --- |
| `next` | 14.2.35 (EOL) | **15.5.18** |
| `eslint-config-next` | 14.2.15 | **15.5.18** |
| `@next/eslint-plugin-next` | 14.2.15 | **15.5.18** |

`react`, `react-dom`, `@apollo/client`, `react-hook-form`, `chart.js` 등 다른 의존성은 그대로 유지.

### 2. 비동기 Request API 마이그레이션

Next.js 15에서 `headers()`, `cookies()`, `draftMode()` 및 `params`/`searchParams`가 Promise 기반 비동기 API로 변경됨에 따라, `headers()` 호출부 19개 파일을 `await`로 전환했다.

**변경 전**:

```tsx
const headersList = headers()
const userAgent = headersList.get('user-agent') || ''
```

**변경 후**:

```tsx
const headersList = await headers()
const userAgent = headersList.get('user-agent') || ''
```

추가로 [src/app/not-found.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.41.0-nextjs-15-upgrade/src/app/not-found.tsx)는 동기 함수였으므로 `async` 함수로 시그니처를 변경했다.

### 3. 사전 점검에서 확인된 비변경 영역

| 영역 | 결과 |
| --- | --- |
| `next.config.js` 옵션 | 모두 15.x 호환 — 변경 없음 |
| `next/image`, `next/font` | 본 프로젝트 미사용 — 영향 없음 |
| `cookies()`, `draftMode()` | 미사용 — 영향 없음 |
| Middleware | 미사용 — 영향 없음 |
| Route Handler | 미사용 — `fetch()` 캐싱 기본값 변경 영향 없음 |
| `params`/`searchParams` 비동기 | 본 프로젝트는 이미 `Promise<...>` 타입으로 적용된 상태 |
| `fetch()` 직접 호출 | 0건 (모든 데이터 페칭은 Apollo Client 사용) |

## 📊 보안 패치 결과

`npm audit` 비교:

| 카테고리 | 변경 전 | 변경 후 | 비고 |
| --- | --- | --- | --- |
| `next` 패키지 본체 high-severity | 5건 | 0건 | 모두 해소 |
| `next` 전이 의존성 (postcss 경유) | 1건 | 1건 | 별도 작업으로 분리 예정 |
| dev 의존성 취약점 | 19건 | 19건 | 본 작업 범위 외, 별도 PR로 처리 예정 |

해소된 `next` 본체 GHSA 항목:

- GHSA-9g9p-9gw9-jx7f — Image Optimizer DoS (self-host)
- GHSA-h25m-26qc-wcjf — RSC HTTP 역직렬화 DoS
- GHSA-ggv3-7p47-pfv8 — rewrites HTTP request smuggling
- GHSA-3x4c-7xq6-9pq8 — `next/image` 디스크 캐시 무제한 증가
- GHSA-q4gf-8mx6-v5v3 — Server Components DoS

## 🔧 기술적 세부사항

### 수정된 파일

- [package.json](https://github.com/jsg3121/poke-korea/blob/feature/1.41.0-nextjs-15-upgrade/package.json) — Next.js 관련 3개 패키지 버전
- `package-lock.json` — 재생성
- [src/app/layout.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.41.0-nextjs-15-upgrade/src/app/layout.tsx)
- [src/app/not-found.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.41.0-nextjs-15-upgrade/src/app/not-found.tsx) — 함수 시그니처 `async`로 변경
- [src/app/page.tsx](https://github.com/jsg3121/poke-korea/blob/feature/1.41.0-nextjs-15-upgrade/src/app/page.tsx) — 변경 없음 (이미 비동기 패턴 적용)
- App Router 페이지 18개 — `headers()` 호출부 `await` 추가:
  - `src/app/moves/page.tsx`
  - `src/app/quiz/page.tsx`, `src/app/quiz/{ability,pokemon-type,silhouette,type-effectiveness}/page.tsx`
  - `src/app/detail/[pokemonId]/(form)/page.tsx`
  - `src/app/detail/[pokemonId]/(form)/{form,gigantamax,mega,region}/[[...index]]/page.tsx`
  - `src/app/detail/[pokemonId]/moves/page.tsx`
  - `src/app/detail/[pokemonId]/moves/{form,region}/[[...index]]/page.tsx`
  - `src/app/detail/[pokemonId]/moves/version/[versionGroupId]/page.tsx`
  - `src/app/detail/[pokemonId]/moves/version/[versionGroupId]/machine/page.tsx`
  - `src/app/detail/[pokemonId]/moves/machine/page.tsx`

### 검증 결과

- `npm run lint`: 통과 (기존 경고 외 신규 에러 없음)
- `npm run build`: 통과
  - 31개 라우트 모두 정상 빌드
  - 정적 페이지 생성 17/17 성공
  - 컴파일 시간 3.4초

## 📌 참고 사항

### 별도 작업으로 분리한 이슈

- **`next.config.js:363-386` Pages Router 잔재 코드** — App Router 빌드에서 매칭되지 않아 무동작 상태. `globals.css` 프리로드 구현이 필요하면 RootLayout 또는 Metadata API를 통한 정공법으로 별도 ADR/작업에서 다룰 예정. 본 마이그레이션 범위에서는 그대로 유지.
- **dev 의존성 19건 취약점** — `npm audit fix`로 안전 패치 가능. 본 작업과 분리하여 별도 PR로 처리 권장.
- **`postcss` 전이 의존성 1건** — Next.js 16.x 업그레이드 시 자연 해소 예상. 단기 인프라 영향 없음.

### React 19 미적용 이유

Next.js 15.x는 React 18을 정식 지원한다. 본 작업의 1차 목표는 보안 부채 해소이며, React 19 도입은 `@apollo/client`, `react-hook-form`, `chart.js` 등 13개 의존성과의 호환성 재검증이 필요해 별도 메이저 버전으로 분리한다.

### 운영 환경 점검 권장 항목

- 네비게이션 시 페이지 캐시 동작 변경 (Next.js 15 Client Cache 변경) — 체감 속도 모니터링
- self-host(`next start` + PM2) 환경에서 ISR `revalidate` 설정이 적용된 페이지의 캐싱 정상 작동 여부
