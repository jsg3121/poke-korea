---
slug: og-image-static
title: 'OG 이미지 정적 파일 전환 및 폼별 대응'
description: '동적 사토리 렌더링 방식의 OG 이미지를 S3 정적 파일로 전환하고, 메가진화/리전폼/폼체인지/거다이맥스 폼별 OG 이미지를 지원합니다.'
authors: [jsg3121, claude]
tags: [seo, performance, feature-improvement]
---

# OG 이미지 정적 파일 전환 및 폼별 대응

> **작업 날짜**: 2026-03-30
> **브랜치**: `feature/1.35.0-og-image-static`

## 📋 작업 개요

**작업 유형**: 성능 개선 / 기능 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

기존 `opengraph-image.tsx`를 통해 사토리(Satori)로 실시간 렌더링하던 OG 이미지를 S3 정적 파일로 전환하여 소셜 공유 시 이미지 로딩 속도를 개선합니다. 또한 기본 포켓몬만 지원하던 OG 이미지를 메가진화, 리전폼, 폼체인지, 거다이맥스 등 모든 폼에 대응하도록 확장합니다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 동적 OG 이미지 → S3 정적 이미지 전환

**변경 전**:
- `opengraph-image.tsx`에서 사토리를 이용해 요청 시마다 실시간 이미지 렌더링
- 크롤러 타임아웃 위험, 서버 부하 발생

**변경 후**:
- S3에 사전 생성된 정적 PNG 파일을 `generateMetadata`의 `openGraph.images`로 참조
- CDN 캐싱으로 전 세계 어디서든 빠른 응답

### 변경 2: 폼별 OG 이미지 지원

**변경 전**:
- 모든 폼(메가진화, 리전폼 등)에서 기본 포켓몬의 OG 이미지만 표시
- 메타데이터 제목과 이미지가 불일치

**변경 후**:
- 5가지 폼 타입별 OG 이미지 개별 지원
  - `default`: 기본 포켓몬
  - `mega`: 메가진화 (인덱스별)
  - `region`: 리전폼 (인덱스별)
  - `form`: 폼체인지 (인덱스별)
  - `gigantamax`: 거다이맥스

### 변경 3: 2가지 사이즈 대응

| 사이즈 | 용도 | 파일명 패턴 |
|--------|------|-------------|
| 1200x630 | OG 이미지 (Facebook, Twitter 등) | `{id}-large.png` |
| 800x800 | 정사각형 공유 (카카오톡 등) | `{id}-medium.png` |

### 변경 4: `generateMetadata`에 OG 이미지 URL 적용

```typescript
// generateMetadata.ts
const ogImages = getOgImageUrls(
  pokemonDetail.number,
  activeType,
  activeIndex,
)

openGraph: {
  images: [
    { url: ogImages.large, width: 1200, height: 630 },
    { url: ogImages.medium, width: 800, height: 800 },
  ],
},
twitter: {
  images: [ogImages.large],
},
```

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 | 개선 |
|------|---------|---------|------|
| OG 이미지 응답 시간 | ~1.5초 (사토리 렌더링) | &lt;100ms (CDN) | ~15배 |
| 서버 렌더링 부하 | 매 요청마다 발생 | 없음 | 제거 |
| 폼별 OG 이미지 | 미지원 (기본 폼만) | 전체 폼 대응 | 신규 |
| 이미지 사이즈 | 1200x630 단일 | 1200x630 + 800x800 | 2종 |

## 🔧 기술적 세부사항

### S3 이미지 경로 구조

```text
image.poke-korea.com/og-images/
├── default/{pokemonId}-large.png, {pokemonId}-medium.png
├── mega/{pokemonId}-{index}-large.png, {pokemonId}-{index}-medium.png
├── region/{pokemonId}-{index}-large.png, {pokemonId}-{index}-medium.png
├── form/{pokemonId}-{index}-large.png, {pokemonId}-{index}-medium.png
└── gigantamax/{pokemonId}-large.png, {pokemonId}-medium.png
```

### 수정된 파일

- `src/app/detail/[pokemonId]/(form)/modules/generateMetadata.ts` — OG 이미지 URL 생성 및 메타데이터 적용

### 삭제된 파일

- `src/app/detail/[pokemonId]/opengraph-image.tsx` — 동적 사토리 렌더링 제거
- `src/module/ogImage.module.ts` — OG 이미지 헬퍼 함수 (더 이상 미사용)

## 📌 참고 사항

- OG 이미지 생성 스크립트는 일회성 도구로 사용 후 코드베이스에서 제거되었습니다
- 새로운 포켓몬이 추가되거나 폼이 변경될 경우, 별도로 이미지를 생성하여 S3에 업로드해야 합니다
- 리전폼의 이름은 `{지역명} {포켓몬이름}` 형태로 표시되며, 서브네임이 있는 경우 `{지역명} {포켓몬이름} ({서브네임})` 형태입니다 (예: 팔데아 켄타로스 (컴뱃종))
