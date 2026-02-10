---
slug: remove-swiper
title: 'Swiper 제거 및 Link 기반 네비게이션 전환'
authors: [jsg3121, claude]
tags: [ux, refactoring, performance]
---

# Swiper 제거 및 Link 기반 네비게이션 전환 (remove-swiper)

## 📋 작업 개요

**브랜치**: `feature/1.30.0-remove-swiper`
**작업 유형**: UX 개선 / 리팩토링
**작업 기간**: 2026-01-21
**담당**: Claude Code

<!-- truncate -->

## 🎯 작업 목표

Path 기반 URL 전환 후 발생한 UX 문제 해결:

- Swiper 슬라이드 애니메이션 + 페이지 로딩이 동시에 발생하여 끊기는 느낌
- Swiper 라이브러리 의존성 제거로 번들 사이즈 감소
- Link 기반 네비게이션으로 SEO 친화적 구조 + 프리페치 지원

### 변경 전 UX

- Swiper로 슬라이드 이동 → `router.replace()`로 URL 업데이트
- 애니메이션과 페이지 로딩이 충돌하여 끊기는 느낌

### 변경 후 UX

- 현재 폼 이미지를 크게 중앙에 표시
- 이전/다음 폼이 있으면 양옆에 작은 미리보기 이미지 표시
- 클릭 시 Link를 통한 페이지 이동 (프리페치 지원)
- 하단에 인디케이터(dot)로 전체 폼 개수와 현재 위치 표시

## ✨ 주요 변경사항

### 1. 데스크톱 PokemonImage 컴포넌트

**변경 전**:

```tsx
import { Swiper, SwiperSlide } from 'swiper/react'

<Swiper onSlideChange={handleSlideChange} ...>
  {imageList.map(...)}
</Swiper>
```

**변경 후**:

```tsx
import Link from 'next/link'

<div className="flex items-center justify-center relative">
  {/* 이전 폼 미리보기 */}
  {prevItem && <Link href={prevUrl}><SmallImage /></Link>}

  {/* 현재 폼 이미지 (크게) */}
  <ImageComponent ... />

  {/* 다음 폼 미리보기 */}
  {nextItem && <Link href={nextUrl}><SmallImage /></Link>}

  {/* 인디케이터 */}
  <div className="flex gap-2">
    {imageList.map((_, i) => <Link href={getUrl(i)} className="dot" />)}
  </div>
</div>
```

### 2. 모바일 PokemonImage 컴포넌트

데스크톱과 동일한 패턴으로 변경

## 📊 최적화 결과

| 항목                        | 변경 전        | 변경 후         | 개선                    |
| --------------------------- | -------------- | --------------- | ----------------------- |
| detail 페이지 First Load JS | 261 kB         | 236 kB          | **25 kB 감소 (약 10%)** |
| Swiper 의존성               | 사용           | 제거            | 번들 사이즈 감소        |
| 페이지 전환 UX              | 끊김           | 자연스러움      | UX 개선                 |
| SEO                         | router.replace | Link (prefetch) | SEO 향상                |

## 📌 참고 사항

- 폼이 1개만 있는 경우 미리보기와 인디케이터 표시하지 않음
- Link의 prefetch 속성을 활용하여 다음 폼 페이지 미리 로드
- 이전/다음 미리보기는 반투명 처리하여 현재 폼과 구분
