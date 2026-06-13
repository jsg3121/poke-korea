---
slug: 1-52-4-champions-tier-keyword-recovery
title: '[1.52.4] 챔피언스 티어 페이지 포괄 키워드 회수'
description: '포맷 분리(1.45.0) 이후 급락한 챔피언스 티어 페이지 노출수 회복. VGC 티어 페이지 메타 title/description 전방에 포괄 키워드를 재배치해 검색 관련성을 복구.'
authors: [jsg3121, claude]
tags: [seo, bug-fix, champions, nextjs]
---

# 1.52.4 — 챔피언스 티어 페이지 포괄 키워드 회수

> **작업 일자**: 2026-06-13
> **작업 브랜치**: `hotfix/1.52.4-champions-tier-keyword`

## 📋 작업 개요

**작업 유형**: SEO 핫픽스 (검색 노출수 회복)
**담당**: jsg3121 + Claude

서치콘솔에서 챔피언스 티어 페이지의 노출수가 6월 9~10일 완만한 하락에 이어 **6월 11일 급락**한 현상을 분석하고, 원인을 제거하기 위한 메타데이터 단독 수정 핫픽스입니다.

<!-- truncate -->

## 🎯 작업 목표

포맷 분리 작업(1.45.0) 이후 챔피언스 티어 페이지가 검색에서 **포괄 키워드("포켓몬 챔피언스 티어 리스트")** 노출 자격을 잃은 문제를 해결한다.

## 🔍 원인 분석

### 무슨 일이 일어났나 — URL 구조 변경

1.45.0 포맷 분리로 티어 페이지 URL이 다음과 같이 바뀌었다.

| 구분 | URL | 처리 |
| --- | --- | --- |
| 구 URL | `/champions/tier` | 301 영구 리다이렉트 → `/champions/vgc/tier` |
| 신 URL (VGC) | `/champions/vgc/tier` | 신규 색인 대상 |
| 신 URL (BSS) | `/champions/bss/tier` | 신규 색인 대상 |

301 설정 자체는 베스트 프랙티스대로 올바르게 되어 있었다.

### 왜 노출수가 급락했나

1. **키워드 타겟 희석** — 구 URL의 title은 `포켓몬 챔피언스 티어 리스트`(포괄·고볼륨)였으나, 301 목적지인 신 URL의 title은 `포켓몬 챔피언스 VGC 티어 리스트`로 포맷 수식어가 전방에 박혀 포괄 검색어와의 관련성이 떨어졌다. 단일 페이지가 독점하던 포괄 키워드가 VGC/BSS long-tail로 분산되었다.
2. **301 권위 이전 시차** — 구글이 301을 따라가 신 URL을 재색인·재평가하는 데 수일~수주가 걸린다. `6월 5일 배포 → 6월 9~10일 점진적 디인덱싱 → 6월 11일 급락(구 URL 색인 제거 + 신 URL 평가 미완성의 갭)` 타임라인과 일치한다.

## ✨ 주요 변경사항

VGC 티어 페이지(301 권위가 모이는 거점)에서만 포괄 키워드를 title 전방에 재배치했다. BSS는 카니발라이제이션 방지를 위해 기존 long-tail을 유지한다.

### Before / After

**VGC (기본 포맷)**

```text
Before
  title:       포켓몬 챔피언스 VGC 티어 리스트 | 포케코리아
  description: 포켓몬 챔피언스 VGC 티어 리스트. {n}종 포켓몬의 ...

After
  title:       포켓몬 챔피언스 티어 리스트 (VGC) | 포케코리아
  description: 포켓몬 챔피언스 티어 리스트. VGC 더블 기준 {n}종 포켓몬의 ...
```

**BSS** — 변경 없음 (`포켓몬 챔피언스 BSS 티어 리스트` 유지)

### 색인 구조는 그대로

- `canonical`(`/champions/vgc/tier`) · `openGraph.url` · `robots` · `twitter` 변경 없음
- `openGraph.title` / `twitter.title`은 `title` 변수를 참조하므로 포괄 키워드가 일관 반영됨

## 🔧 기술적 세부사항

**수정 파일**: `src/app/champions/_metadata/championsMetadata.ts` — `generateChampionsTierMetadata` 1곳

- `formatSlug === CHAMPIONS_DEFAULT_FORMAT_SLUG`(VGC) 분기로 기본 포맷에만 포괄 키워드 우선 적용
- 기존 `getFormatShortLabel` 헬퍼 재사용, 신규 의존성 없음

**근거**: [Google — Control your title links in search results](https://developers.google.com/search/docs/appearance/title-link) — 핵심 키워드를 title 전방에 배치하면 검색 관련성에 유리하다.

## 📌 참고 사항

- 메타 변경이 구글에 재반영되는 데 다시 수일~수주가 소요된다. 배포 후 서치콘솔에서 `/champions/vgc/tier`의 포괄 키워드 노출 추이를 모니터링해 효과를 확인해야 한다.
- 이번 핫픽스는 메타데이터로 범위를 한정했다. 본문 H1 제목까지 포괄 키워드를 반영하면 관련성 신호가 더 강해지나, 디자인 영향 검토가 필요해 별도 작업으로 분리했다.
- 핫픽스는 운영 배포본(1.52.3, `bf11e3a`) 기준으로 분기해 미배포 1.53.0 작업이 섞이지 않도록 했다.
