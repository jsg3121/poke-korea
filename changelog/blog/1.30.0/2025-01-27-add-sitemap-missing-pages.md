---
slug: add-sitemap-missing-pages
title: 사이트맵 누락 페이지 추가
authors: [claude]
tags: [seo]
---

# 사이트맵 누락 페이지 추가 (add-sitemap-missing-pages)

## 📋 작업 개요

**브랜치**: `feature/1.30.0`
**작업 유형**: SEO 개선
**작업 기간**: 2025-01-27
**담당**: Claude

<!-- truncate -->

## 🎯 작업 목표

사이트맵에 누락된 페이지들을 추가하여 검색 엔진이 모든 페이지를 정상적으로 크롤링할 수 있도록 개선

## ✨ 주요 변경사항

### 변경 1: 사이트맵에 누락된 페이지 추가

**추가된 페이지 유형**:

| 페이지 유형 | URL 패턴 | 설명 |
|------------|---------|------|
| 기본폼 상세 페이지 | `/detail/:number/form` | `isFormChange`가 true인 포켓몬 |
| 기본폼 기술 페이지 | `/detail/:number/moves/form` | `isFormChange`가 true인 포켓몬의 기술 페이지 |
| 리전폼 기술 페이지 | `/detail/:number/moves/region` | `isRegionForm`이 true인 포켓몬의 기술 페이지 |

**변경 전**:
```typescript
// 모든 페이지들을 합쳐서 반환
return [
  ...staticPages,
  ...basicDetailPages,
  ...shinyPages,
  ...megaPages,
  ...regionPages,
  ...typeFilterListPages,
  // ... 기타 페이지들
]
```

**변경 후**:
```typescript
// 기본폼 변환 가능 포켓몬 상세 페이지들 (isFormChange가 true인 포켓몬)
const formChangePages = data.getPokemonList
  .filter((pokemon: PokemonList) => pokemon.isFormChange)
  .map((pokemon: PokemonList) => ({
    url: `https://poke-korea.com/detail/${pokemon.number}/form`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

// 기본폼 변환 가능 포켓몬 기술 페이지들
const formChangeMovesPages = data.getPokemonList
  .filter((pokemon: PokemonList) => pokemon.isFormChange)
  .map((pokemon: PokemonList) => ({
    url: `https://poke-korea.com/detail/${pokemon.number}/moves/form`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

// 리전폼 포켓몬 기술 페이지들
const regionMovesPages = regionData.getPokemonList.map(
  (pokemon: PokemonList) => ({
    url: `https://poke-korea.com/detail/${pokemon.number}/moves/region`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }),
)

// 모든 페이지들을 합쳐서 반환
return [
  ...staticPages,
  ...basicDetailPages,
  ...shinyPages,
  ...megaPages,
  ...regionPages,
  ...formChangePages,           // 추가
  ...typeFilterListPages,
  // ...
  ...basicDetailMovesPages,
  ...formChangeMovesPages,      // 추가
  ...regionMovesPages,          // 추가
  ...abilityDetailPages,
  // ...
]
```

**주요 영향 파일**:
- [src/app/sitemap.ts](../../src/app/sitemap.ts)

## 🔧 기술적 세부사항

- 기존 `data.getPokemonList`에서 `isFormChange` 필드를 활용하여 기본폼 변환 가능한 포켓몬 필터링
- 기존 `regionData.getPokemonList`를 재활용하여 리전폼 기술 페이지 생성
- 추가 GraphQL 쿼리 없이 기존 데이터 활용

## 📝 향후 작업

- 인덱스별 페이지(`/detail/:number/form/:index` 등)는 현재 사이트맵에 미포함 (필요시 추가 검토)

## 📌 참고 사항

- 사이트맵에 포함된 페이지의 라우트가 모두 존재함을 확인 완료
- 리디렉션 로직과 사이트맵 URL 패턴이 일치함을 확인 완료
