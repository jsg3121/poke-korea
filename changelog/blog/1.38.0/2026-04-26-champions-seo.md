---
slug: champions-seo
title: '챔피언스 페이지 SEO 개선'
description: '챔피언스 페이지의 메타데이터를 동적으로 생성하고, 시맨틱 HTML 구조 개선 및 ItemList JSON-LD 스키마를 추가하여 SEO를 강화했습니다.'
authors: [jsg3121, claude]
tags: [seo, feature-improvement]
---

# 챔피언스 페이지 SEO 개선

> **작업 날짜**: 2026-04-26
> **브랜치**: `feature/1.38.0-champions-seo`

## 작업 개요

**작업 유형**: SEO / 기능 개선
**담당**: Claude

## 작업 목표

챔피언스 페이지의 SEO를 개선하여 검색 엔진 최적화를 강화합니다. 하드코딩된 포켓몬 수를 API 기반 동적 데이터로 변경하고, 시맨틱 HTML 구조를 개선하며, 구조화된 데이터(JSON-LD)를 추가합니다.

<!-- truncate -->

## 주요 변경사항

### 1. 동적 메타데이터 생성

**변경 전**:
```typescript
export const CHAMPIONS_META: Metadata = {
  description: '포켓몬 챔피언스 186종 도감...',
  // 하드코딩된 정적 객체
}
```

**변경 후**:
```typescript
export const generateChampionsHomeMetadata = async (): Promise<Metadata> => {
  const totalCount = await fetchChampionsTotalCount()
  const description = `포켓몬 챔피언스 ${totalCount}종 도감...`
  // API에서 실제 포켓몬 수를 가져와 동적 생성
}
```

### 2. 시맨틱 HTML 구조 개선

**변경 전**:
```tsx
// ChampionsDetailContainer 내부
<main className="flex-1">
  <ChampionsMetaSection meta={meta} />
</main>
```

**변경 후**:
```tsx
// page.tsx의 <main>과 중첩 방지
<section className="flex-1">
  <ChampionsMetaSection meta={meta} />
</section>
```

### 3. ItemList JSON-LD 스키마 추가

**목록 페이지** (`/champions/list`):
```json
{
  "@type": "ItemList",
  "name": "포켓몬 챔피언스 포켓몬 목록",
  "numberOfItems": 186,
  "itemListElement": [...]
}
```

**티어 페이지** (`/champions/tier`):
```json
{
  "@type": "ItemList",
  "name": "포켓몬 챔피언스 티어 리스트",
  "itemListElement": ["S 티어", "A 티어", ...]
}
```

## 기술적 세부사항

### 수정된 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/app/champions/_metadata/championsMetadata.ts` | 정적 객체 → 동적 생성 함수 |
| `src/app/champions/page.tsx` | `generateMetadata` 함수 적용 |
| `src/app/champions/list/page.tsx` | `generateMetadata` + ItemList JSON-LD |
| `src/app/champions/tier/page.tsx` | `generateMetadata` + ItemList JSON-LD |
| `src/container/desktop/champions/ChampionsDetail.container.tsx` | `<main>` → `<section>`, console.log 제거 |
| `CLAUDE.md` | SEO 작업 참조 문서 추가 |

## 참고 사항

- 메타데이터의 포켓몬 수가 API 데이터와 자동 동기화됨
- 기존 BreadcrumbList JSON-LD는 유지, ItemList 추가
- ISR `revalidate: 86400` (24시간) 설정 유지
