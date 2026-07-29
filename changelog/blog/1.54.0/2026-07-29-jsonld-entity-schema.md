---
slug: jsonld-entity-schema
title: 'JSON-LD 엔티티 스키마 보강 + SEO 정리 (SEO 2단계)'
description: 'SEO 감사(SEO-2026-07-28) 기반 2단계 정리. 포켓몬·기술·챔피언스 상세에 엔티티 스키마를 도입하고 죽은 SearchAction 제거·브랜드 구분자를 통일한다.'
authors: [jsg3121, claude]
tags: [seo, feature-improvement]
---

# JSON-LD 엔티티 스키마 보강 + SEO 정리 (SEO 2단계)

> **작업 날짜**: 2026-07-29
> **브랜치**: `feature/1.54.0-seo-jsonld`

## 📋 작업 개요

**작업 유형**: SEO 개선
**담당**: jsg3121 · claude

SEO 감사 보고서(`SEO-2026-07-28-route-audit.md`)의 P1·P2 결함을 정리한다. canonical은 감사에서 이미 전 라우트 완비로 확인돼(무한스크롤이라 `?page=N`도 non-issue) 작업 대상이 아니며, 실질 작업은 **JSON-LD 구조화 데이터 개선**이다.

## 🎯 작업 목표

도감 핵심 자산(포켓몬·기술·챔피언스 상세)이 표준 엔티티 스키마 없이 WebPage/BreadcrumbList만 갖고 있어 리치 결과 후보에서 이탈하던 문제를 해소한다. 아울러 효과가 사라진 죽은 코드(SearchAction)와 브랜드 표기 구분자 불일치를 정리한다.

<!-- truncate -->

## ✨ 주요 변경사항

### P1-1: 죽은 SearchAction 제거

`WEBSITE_JSON_LD`의 `potentialAction`(SearchAction)은 이를 활용하던 Google Sitelinks Searchbox 기능이 2024-11-29부로 완전 폐지되어 아무 효과가 없는 죽은 코드였다. 제거했다.

### P1-2: 엔티티 스키마 도입

표준 엔티티 타입이 없는 도메인(포켓몬·기술)이라 `Thing + additionalProperty(PropertyValue)` 패턴으로 통일했다.

- **포켓몬 상세**: `identifier`를 문자열에서 `PropertyValue`(`propertyID: 'pokedexNumber'`)로 구체화 — 도감 번호임을 명시.
- **기술 상세**: `mainEntity`가 전무했다. 이미 fetch된 `skill`의 타입·분류·위력·명중률을 `Thing`으로 구성(추가 GraphQL 없음). null/미보유 값은 제외해 스키마-콘텐츠 불일치를 막는다.

### P2: 챔피언스 상세 엔티티 + 브랜드 통일

- **챔피언스 상세**: `BreadcrumbList` 단독이던 곳에 `mainEntity`(스탯 + 티어·인기 기술/도구/특성)를 신설. 단, **사용률·승률은 데이터 원천 변경(PR #195)으로 더 이상 들어오지 않아 제외**한다.
- **브랜드 구분자 통일**: `title.template`을 파이프(`%s | 포케 코리아`)에서 하이픈(`%s - 포케 코리아`)으로 변경해, OG/Twitter/JSON-LD 개별 엔티티(하이픈)와 구분자를 일치시켰다.

## 🔧 기술적 세부사항

- `src/constants/websiteJsonLd.ts` — SearchAction 제거
- `src/constants/pokemonJsonLd.ts` — identifier PropertyValue화
- `src/constants/movesJsonLd.ts` + `src/app/moves/[id]/page.tsx` — 기술 mainEntity 신설(타입/분류 한글 변환은 기존 `PokemonTypes`·`getDamageTypeKorean` 재사용)
- `src/constants/championsJsonLd.ts` + `renderChampionsDetail.tsx` — 챔피언스 mainEntity 신설
- `src/app/layout.tsx` + 주석 3곳 — 브랜드 구분자 하이픈 통일

## 📌 참고 사항

- **Dataset 스키마는 도입하지 않았다**: Google Dataset 가이드가 "팬사이트·백과사전형 콘텐츠는 부적합"으로 명시하고, 배포 가능한 데이터 파일이 없어 Dataset Search 노출 가능성이 없다. 기존 ItemList/WebPage가 더 적합하다(향후 데이터 export/API 공개 시 재검토).
- 엔티티 `Thing`은 Google이 리치 결과로 렌더링하지는 않으나, 페이지 주제·속성을 명확히 전달하는 구조 신호로서 가치가 있다.
- 개발 환경에서 `/moves/[id]` JSON-LD의 mainEntity 정상 삽입을 확인했다(타입 한글 변환·PropertyValue 구조 포함).
