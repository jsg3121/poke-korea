---
slug: 1-53-0-bundle-chartjs-optimization
title: '[1.53.0] 번들 최적화 Phase 1 — chart.js 동적 임포트 + 분석기 도입'
description: 'chart.js를 동적 임포트로 코드 스플리팅하여 상세·챔피언스 상세 라우트의 First Load JS를 각 65KB 절감(254→189KB, 240→175KB). @next/bundle-analyzer 도입 및 polyfills 검증 포함.'
authors: [jsg3121, claude]
tags: [performance, nextjs, refactoring]
---

# 1.53.0 — 번들 최적화 Phase 1

> **작업 일자**: 2026-06-11
> **작업 브랜치**: `feature/1.53.0-bundle-chartjs`

## 📋 작업 개요

**작업 유형**: 번들 코드 스플리팅 + 빌드 분석 도구 도입
**담당**: jsg3121 + Claude

`next build` 산출물을 분석한 결과, 상세 계열 라우트의 First Load JS가 비정상적으로
무거운 것을 발견했다. 원인은 `chart.js`가 상세 페이지 공통 청크에 묶여 초기 로드에
통째로 포함되는 것이었다. 이를 동적 임포트로 분리하여 초기 번들을 줄이고, 향후
지속적인 번들 최적화를 위해 `@next/bundle-analyzer`를 도입했다.

<!-- truncate -->

## 🎯 작업 목표

- 상세(`/detail/*`)·챔피언스 상세(`/champions/[format]/list/[pokemonId]/*`) 라우트의
  First Load JS 감소
- 측정 기반 번들 최적화를 위한 분석 도구 상시화
- polyfills 번들의 실제 전송 비용 검증

## 🔍 문제 분석

상세 계열 라우트만 First Load JS가 두드러지게 무거웠다.

| 라우트                                      | First Load JS |
| ------------------------------------------- | ------------- |
| `/detail/[pokemonId]` 계열                  | 254 KB (최대) |
| `/champions/[format]/list/[pokemonId]` 계열 | 240 KB        |
| 일반 페이지 (quiz/list/moves 등)            | 170~178 KB    |

근본 원인: `chart.js`가 청크에 묶여 상세 계열 라우트의 **초기 로드**에 포함되었다.
그러나 실제 차트(능력치 레이더 차트)는 상세 화면의 "능력치" 영역(스크롤로 보이는
하위 요소)에서만 쓰인다 — 초기 렌더에 불필요한 코드였다.

## ✨ 주요 변경사항

### 1. chart.js 동적 임포트 (래퍼/구현 분리)

`StatChart`를 사용하는 4개 파일이 모두 **서버 컴포넌트**라, App Router에서
`next/dynamic`의 `ssr: false`를 직접 쓸 수 없었다. 따라서 동적 임포트를 수행하는
client 래퍼와 실제 차트 구현을 분리했다.

| 파일                                            | 역할                                                             |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| `src/components/chart/RadarChart.component.tsx` | 실제 chart.js 구현 (기존 `StatChart.component.tsx`를 rename)     |
| `src/components/chart/StatChart.component.tsx`  | `RadarChart`를 `ssr: false`로 동적 임포트하는 client 래퍼 (신규) |

- props 시그니처를 동일하게 유지하여 **사용처 4개 파일의 import는 변경 불필요**.
- 사용처: detail desktop/mobile `Stats.component.tsx`, champions desktop/mobile
  `ChampionsDetail.container.tsx`.

#### loading 플레이스홀더 — CLS/LCP 고려

빈 `<div className="w-full h-full" aria-hidden />`를 사용했다.

- **CLS**: 차트 컨테이너는 부모에서 고정 크기(`w-[25rem] h-[25rem]`, `aspect-square` 등)를
  이미 지정하여 공간이 사전 확보되어 있어 레이아웃 시프트가 없다.
- **LCP**: 차트는 스크롤 하단 비-크리티컬 요소라 LCP 후보가 아니며, 지연 로드는 초기
  JS를 줄여 LCP를 오히려 개선한다.

### 2. @next/bundle-analyzer 도입

- `next.config.js`를 `withBundleAnalyzer`로 래핑 (`ANALYZE=true`일 때만 활성).
- 기존 `webpack` / `redirects` / `headers` 커스텀 설정은 그대로 보존.
- `package.json`에 `analyze` 스크립트 추가 — `npm run analyze`로 treemap 확보.
- 평소 빌드에는 영향 없음.

## 📊 최적화 결과

| 라우트                                                   | 변경 전 | 변경 후 | 절감       |
| -------------------------------------------------------- | ------- | ------- | ---------- |
| `/detail/[pokemonId]` 계열 (5개 라우트)                  | 254 KB  | 189 KB  | **-65 KB** |
| `/champions/[format]/list/[pokemonId]` 계열 (8개 라우트) | 240 KB  | 175 KB  | **-65 KB** |

- 상세·챔피언스 상세 계열 **총 13개 라우트**가 각 65KB 감소.
- chart.js는 별도 비동기 청크로 분리되어, 사용자가 능력치 영역까지 스크롤할 때 로드된다.
- 다른 라우트(quiz/list/moves 등)는 변동 없음 — 회귀 없음 확인.

## 🔬 polyfills 검증 (코드 변경 없음)

빌드 산출물의 `polyfills.js`(112KB)를 직접 조사한 결과, `fetch`·`URL`·`Object.assign`·
`Symbol`·`Promise` 등 Next.js가 항상 생성하는 고정 폴리필 번들임을 확인했다.

- `build-manifest.json`의 `polyfillFiles`에 단독 분류되며, `rootMainFiles`(First Load
  청크)와 전혀 겹치지 않는다.
- `<script nomodule>`로 주입되어 모던 브라우저(Chrome &ge;114 등)는 다운로드·실행하지
  않는다 — 레거시 폴백 전용.
- browserslist도 이미 모던하게 설정되어 SWC 인라인 폴리필도 최소 상태.

→ **추가 최적화 여지가 없으며, 무리한 제거는 호환성만 깨뜨리므로 코드 변경 없이 검증만 완료.**
근거: [Next.js Supported Browsers](https://nextjs.org/docs/architecture/supported-browsers)

## ✅ 검증

- `npm run build` — 빌드 성공, First Load JS 감소 확인
- `npm run lint` — chart 관련 신규 경고/에러 없음 (기존 경고만 잔존)
- 타입 체크 — chart 관련 타입 에러 없음

## 🔜 후속 Phase (이번 범위 아님)

- **Phase 2**: `optimizePackageImports` (apollo 등 배럴 패키지 트리셰이킹)
- **Phase 3**: `/type-effectiveness` page 전용 청크(169KB) 데이터/로직 분할
