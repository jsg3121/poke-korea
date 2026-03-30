---
slug: fix-home-cache
title: '홈 화면 디바이스 분기 캐싱 이슈 수정'
description: 'CloudFront 캐시 초기화 후 홈 화면에서 PC임에도 모바일 화면이 표시되는 ISR 캐싱 충돌 버그를 수정합니다.'
authors: [jsg3121, claude]
tags: [bug-fix, nextjs]
---

# 홈 화면 디바이스 분기 캐싱 이슈 수정

> **작업 날짜**: 2026-03-30
> **브랜치**: `feature/1.35.1-fix-home-cache`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

상용 배포 및 CloudFront 캐시 초기화 후, 홈 화면에서 PC 환경임에도 모바일 화면이 표시되는 문제를 해결합니다.

<!-- truncate -->

## 🐛 버그 원인 분석

### 캐싱 충돌 구조

```
브라우저 → CloudFront (x-device-type 기준 캐시 분리) → Next.js ISR (디바이스 구분 없이 단일 캐시)
```

- CloudFront는 `x-device-type` 헤더로 모바일/데스크톱 캐시를 분리하지만, Next.js ISR 캐시는 URL 단위로 하나의 HTML만 저장
- 홈 페이지는 `revalidate = 3600` (1시간)으로 설정되어 있어 캐시 만료가 빈번하게 발생
- CloudFront 초기화 후 모바일 요청이 먼저 도달하면, Next.js가 모바일 HTML을 ISR 캐시에 저장
- 이후 데스크톱 요청에도 캐시된 모바일 HTML이 반환됨

### 다른 페이지에서 발생하지 않는 이유

- 다른 페이지들은 `revalidate = 31536000` (1년)으로 설정
- 서버에서 빌드 시점에 이미 데스크톱 HTML이 ISR 캐시에 생성되어 있어 런타임에 재생성되지 않음
- 홈 페이지만 `revalidate`가 짧아 배포 후 런타임 요청으로 캐시가 재생성됨

## ✨ 주요 변경사항

### `src/app/page.tsx` — ISR 캐싱 제거, Dynamic 렌더링 전환

**변경 전**:
```tsx
export const revalidate = 3600 // 1시간
```

**변경 후**:
```tsx
export const dynamic = 'force-dynamic'
```

CloudFront가 CDN 레벨에서 `x-device-type` 기준으로 캐시를 분리해주고 있으므로, Next.js 단의 ISR 캐싱을 제거하고 매 요청마다 정확한 디바이스 판단을 수행하도록 변경했습니다.

## 🔧 기술적 세부사항

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 렌더링 방식 | ISR (1시간 주기 재생성) | Dynamic SSR (매 요청) |
| 캐싱 주체 | Next.js ISR + CloudFront | CloudFront만 |
| 디바이스 분기 정확도 | 첫 요청 디바이스에 고정 | 매 요청마다 정확한 판단 |

## 📌 참고 사항

- CloudFront가 `x-device-type` 헤더 기반으로 CDN 캐싱을 수행하므로, Next.js에서 추가 캐싱 없이도 성능에 영향 없음
- `layout.tsx`의 `headers()` 호출에 `await`가 누락되어 있으나, 각 페이지에서 직접 `detectUserAgent`를 호출하고 있어 현재 동작에는 영향 없음 (별도 개선 권장)
