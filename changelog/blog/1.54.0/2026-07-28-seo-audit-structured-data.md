---
slug: 1-54-0-seo-audit-structured-data
title: '[1.54.0] SEO 구조화 데이터·브랜드 표기 정합성 개선'
description: '릴리즈 전 대표 라우트 SEO 실측 감사 후 발견한 결함을 수정했다. 홈에서 2개로 중복 출력되던 WebSite JSON-LD를 홈 1회로 단일화하고 SearchAction target을 실제 검색 경로(/list)로 정정했으며, BreadcrumbList 단독이던 챔피언스 홈·상세를 다른 라우트와 동일한 WebPage 구조로 승격했다. 4종으로 혼재하던 브랜드 표기는 title.template로 한 곳에서 강제해 전 라우트를 일관화했다.'
authors: [jsg3121, claude]
tags: [seo, refactoring, bug-fix]
---

# 1.54.0 — SEO 구조화 데이터·브랜드 표기 정합성 개선

> **작업 일자**: 2026-07-28
> **작업 브랜치**: `feature/1.54.0-seo`
> **근거**: SEO-2026-07-28 대표 라우트 실측 감사 (`.claude/research/reports/`)

## 📋 작업 개요

**작업 유형**: SEO 결함 수정 (릴리즈 전 2단계 점검)
**담당**: jsg3121 + Claude

DS 페이지 개편(A~F)과 구버전 제거 완료 후, 릴리즈 전 점검의 일환으로 대표 라우트
유형별(홈·도감·상세·기술·상성·퀴즈·챔피언스) SEO 구현 상태를 실측 감사했다. 감사
결과 canonical·sitemap·동적 메타데이터·시맨틱 구조는 이미 양호했고, 문제는 **구조화
데이터(JSON-LD)의 중복·누락**과 **브랜드 표기 불일치**에 집중돼 있었다. 이번 작업은
감사에서 우선순위 P1·P2로 분류한 항목을 수정한다.

## 🎯 해결한 문제

### 1. 홈 WebSite JSON-LD 중복 (P1)

홈(`/`)에서 `WebSite` 스키마가 2개 동시 출력되고 있었다. 루트 `layout.tsx`가
전역으로 `WEBSITE_JSON_LD`를, 홈 `page.tsx`가 인라인으로 또 하나의 WebSite를
삽입한 탓이다. 게다가 둘의 SearchAction `target`이 서로 달랐다 — layout은 `/?name=`,
홈은 `/list?name=`. 실제 검색 폼은 `/list`로 308 리다이렉트하므로 홈 쪽이 정확했다.

- WebSite 스키마는 사이트 홈에만 1회 삽입(Google 사이트링크 검색창 가이드 권장)하도록
  `layout.tsx`의 전역 삽입을 제거하고 홈으로 단일화.
- `websiteJsonLd.ts` 상수의 target을 실제 검색 경로(`/list?name=`)로 정정하고,
  홈 page.tsx가 인라인 객체 대신 이 상수를 재사용하도록 SSOT화.

### 2. 챔피언스 JSON-LD가 BreadcrumbList 단독 (P2)

챔피언스 홈·상세는 `BreadcrumbList`만 삽입해, 다른 라우트(리스트·기술·상성·퀴즈)가
갖춘 `WebPage` 래핑(`isPartOf`·`primaryImageOfPage`)이 없어 사이트 내 구조화 수준이
챔피언스만 낮았다.

- `championsJsonLd.ts` 상수를 신설해 홈·상세를 `WebPage`(breadcrumb 중첩) 구조로 승격.
- 두 라우트가 각자 인라인으로 중복하던 breadcrumb 로직을 이 상수로 단일화.

### 3. 브랜드 표기 4종 혼재 (P2)

페이지 title 접미사가 `| 포케코리아` · `| 포케 코리아` · `- 포케 코리아` ·
`| 대한민국 포켓몬의 모든 정보 - 포케 코리아`로 4종 혼재했다. 각 페이지 metadata가
접미사를 수동으로 문자열에 박고, 루트 `title.template`이 `%s`라 브랜드를 강제하는
장치가 없던 탓이다.

- 루트 `layout.tsx`의 `title.template`을 `%s | 포케 코리아`로 설정해 브랜드를 한
  곳에서 강제.
- 전 라우트 페이지 title에서 수동 접미사를 제거(이중 접미사 방지). Next.js가 자동으로
  ` | 포케 코리아`를 붙인다.
- 홈·404 등 브랜드가 앞에 와야 하는 title은 `title.absolute`로 template를 우회.
- `openGraph`/`twitter` title은 template 적용 대상이 아니므로 `- 포케 코리아`를
  명시적으로 재부착해 통일. 공용 `createMetadata` 헬퍼도 동일 규칙으로 수정.

## 🧭 결정 사항

- **엔티티 JSON-LD 재설계 보류**: 포켓몬 같은 가상 캐릭터는 Google 리치결과 지원
  스키마 타입이 없어, 현재의 `Thing` + `PropertyValue` 표현을 다른 타입으로 바꿔도
  검색 표시 실익이 불확실하다. 과잉 재설계 대신 실익이 확실한 항목만 수정했다.
- **moves version 서브라우트 sitemap 미등록 확정**: `/moves/{id}`까지만 sitemap에
  등록한다. `GetPokemonSkillList` 쿼리가 기술별 유효 버전그룹을 반환하지 않아 정확한
  조합 생성이 백엔드 의존이고, canonical·JSON-LD 헬퍼가 이미 있어 내부 링크로 발견·
  색인이 가능하므로 미등록이 의도된 정책이다.

## 🔧 변경 파일

- 루트: `layout.tsx`(title.template·전역 JSON-LD 제거), `page.tsx`(홈 WebSite 단일화)
- 신규: `constants/championsJsonLd.ts`
- 수정: `constants/websiteJsonLd.ts`·`seoMetaData.ts`, `module/generateDetailSeoMetaData.ts`,
  전 라우트 `_metadata/` 생성기 및 notFound 폴백 title 다수(홈·리스트·상세·기술·상성·
  퀴즈·특성·챔피언스)

## ✅ 검증

- 페이지 title에 브랜드 접미사 잔존(이중 접미사) 0건, 붙여쓰기(`포케코리아`) 잔존
  0건(alternateName 별칭 제외) 전수 확인.
- ESLint(`next lint`)·Prettier·`tsc --noEmit` 통과(변경 파일 신규 이슈 없음).

## 📝 남은 SEO 트랙 (후속)

- 루트 layout 기본 OG/Twitter 안전망(신규 페이지 OG 공백 방지) — P3.
- 리스트/무브목록 `ItemList`가 실제 목록이 아닌 샘플이라 콘텐츠-스키마 불일치 소지 — P3.
