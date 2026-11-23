---
slug: breadcrumb-fix
title: '포켓몬 상세 페이지 BreadcrumbList 2단계 URL 404 수정'
description: '포켓몬 상세 페이지 구조화 데이터의 BreadcrumbList 2단계 "포켓몬 도감" 링크가 존재하지 않는 /detail을 가리키던 문제를 실제 도감 목록 페이지 /list로 바로잡았습니다.'
authors: [jsg3121, claude]
tags: [seo, bug-fix]
---

# 포켓몬 상세 페이지 BreadcrumbList 2단계 URL 404 수정

> **작업 날짜**: 2026-11-23
> **브랜치**: `feature/1.63.0-breadcrumb-fix`

## 📋 작업 개요

**작업 유형**: 버그 수정 / SEO
**담당**: jsg3121, claude

## 🎯 작업 목표

포켓몬 상세 페이지 BreadcrumbList가 실제로 존재하는 도감 목록 페이지를 가리키게 해, `홈 > 포켓몬 도감 > No.N 포켓몬` 계층이 `/list` 페이지의 BreadcrumbList와 이어지게 한다.

<!-- truncate -->

## 📉 왜 필요했나

- 상세 페이지 5종(기본·노말폼·메가·리전폼·거다이맥스)의 BreadcrumbList 2단계 `item`이 `https://poke-korea.com/detail`이었다.
- `src/app/detail/` 아래에는 `[pokemonId]` 동적 경로만 있어 `/detail`은 404를 반환한다.
- Google은 BreadcrumbList의 `item`에 그 단계를 나타내는 페이지 URL을 넣도록 안내한다([Google 검색 센터: Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)). 모든 상세 페이지의 구조화 데이터가 없는 페이지를 가리키고 있었다.
- 도감 목록 페이지 `/list`의 BreadcrumbList는 이미 `홈 > 포켓몬 도감(/list)`이라 상세 페이지와 어긋나 있었다.
- 1.63.0 QA의 seo-audit에서 발견한 기존 결함이다.

## ✨ 주요 변경사항

### 변경 1: BreadcrumbList 2단계 URL — `src/constants/pokemonJsonLd.ts`

**변경 전**:

```ts
{
  '@type': 'ListItem',
  position: 2,
  name: '포켓몬 도감',
  item: 'https://poke-korea.com/detail',
}
```

**변경 후**:

```ts
{
  '@type': 'ListItem',
  position: 2,
  name: '포켓몬 도감',
  item: 'https://poke-korea.com/list',
}
```

## 🔍 검증

- ESLint, Prettier, `tsc --noEmit` 통과
- 개발 서버 SSR HTML의 JSON-LD 확인: `/detail/6`, `/detail/6/mega`, `/detail/25/form/9`의 2단계 `item`이 모두 `https://poke-korea.com/list`
- `/list`는 200을 반환하고 canonical이 `https://poke-korea.com/list`임을 확인
- **확인하지 않은 것**: Google 리치 결과 테스트·Search Console 반영(배포 후 확인)

## ⚠️ 구현 시 고려한 점

- **2단계 삭제(`홈 > 포켓몬`)는 기각**: 도감 목록이라는 실제 계층 정보가 사라지고, 기술 도감(`/moves`) 등 다른 섹션의 3단계 구조와 달라진다.
- **`/detail` 페이지를 만들어 `/list`로 리디렉션하는 안은 기각**: 경로가 하나 늘고 BreadcrumbList에 리디렉션 URL이 들어간다. canonical URL을 쓰는 것이 권장된다([Google: 중복 URL 통합](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)).

## 📌 참고 사항

- 배포 후 [리치 결과 테스트](https://search.google.com/test/rich-results)나 Search Console URL 검사로 상세 페이지 BreadcrumbList를 확인한다.
- 상세 페이지는 ISR `revalidate` 1년이라 배포로 캐시가 새로 만들어질 때 반영된다.
