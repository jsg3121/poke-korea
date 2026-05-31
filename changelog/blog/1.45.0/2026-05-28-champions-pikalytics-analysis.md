---
slug: 1-45-0-champions-pikalytics-analysis
title: '[1.45.0] 챔피언스 Pikalytics 고도화 분석 + SPEC 작성'
description: 'eurekaffeine/Pikalytics/Smogon 3-Tier 데이터 흐름 확정, Pikalytics 대비 갭 분석 후 5단 Phase SPEC 작성. 백엔드 데이터 소스 가이드 별도 분리.'
authors: [jsg3121, claude]
tags: [docs, analysis, spec, champions]
---

# 1.45.0 — 챔피언스 Pikalytics 고도화 분석/기획

> **작업 일자**: 2026-05-28
> **작업 브랜치**: `feature/1.45.0-champions-pikalytics-analysis`

## 📋 작업 개요

**작업 유형**: 시장 분석 + 갭 분석 + 신규 SPEC 작성 + 데이터 소스 가이드 작성
**담당**: jsg3121 + Claude

`champions-implementation-plan.md`에 이미 결정되어 있던 "고도화 트랙 분리"(2026-05-18) 작업의 후속으로, 실제 분석/기획을 완료했습니다. 이번 분석은 새 가드 지침("상용 구현 확인 의무")의 첫 적용 사례입니다.

<!-- truncate -->

## 🎯 분석 흐름

### 1. 데이터 파이프라인 확정

```
Smogon (원본) → Pikalytics (가공) → eurekaffeine scraper → poke-korea
```

`pikalytics.com/llms.txt` 직접 확인 결과 Pikalytics가 4개 출처를 집계하며 그중 챔피언스 관련은 공식 닌텐도 랭크 사다리 + 공식 VGC 토너먼트 팀 시트라는 사실이 확정되었습니다.

### 2. 자사 챔피언스 현 구현 상태 직접 확인

새 가드 지침대로 `src/app/champions/` 라우트, `ChampionsMetaStats` GraphQL 타입, 컴포넌트를 직접 확인했습니다.

| 항목 | 결과 |
| --- | --- |
| 4개 라우트 모두 | **이미 구현됨** (메타, ISR, JSON-LD, sitemap 포함) |
| 백엔드 필드 11개 | 정상 노출 중 |
| winRate 필드 | 스키마에 존재하나 eurekaffeine이 null 반환 중 (소스 교체로 즉시 복구 가능) |
| EV 스프레드, 카운터, 레이팅 분리, 포맷 분리, 대회 데이터 | 백엔드 스키마 자체에 부재 |

### 3. 사용자 확정 우선순위 (TOP 5)

| 순위 | Phase | 기능 | 라우트 변경 |
| --- | --- | --- | --- |
| 1 | Phase 1 | 포맷 분리 (VGC/BSS) | `/champions/[format]/*` |
| 2 | Phase 2 | 레이팅별 사용률 분리 (0/1500/1630/1760) | 없음 |
| 3 | Phase 3 | 카운터/체크 | 없음 |
| 4 | Phase 4 | EV 스프레드 | 없음 |
| 5 | Phase 5 | 최근 탑팀 (대회) | `/champions/tournaments` |

## 📦 산출 문서

| 문서 | 위치 | 역할 |
| --- | --- | --- |
| 리서치 보고서 | `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md` | MI + BA 종합 분석 |
| 신규 SPEC | `.claude/specs/champions-pikalytics-enhancement.md` | Phase 1~5 실행 계획 |
| 백엔드 데이터 소스 가이드 | `.claude/specs/champions-data-sources.md` | 페이지/기능 × 외부 API 매핑 (백엔드 작업 인풋) |
| 기존 계획서 갱신 | `.claude/specs/champions-implementation-plan.md` | "고도화 트랙 분리" 섹션에 신규 SPEC 링크 |

## 🔑 핵심 의사결정

| 결정 | 값 |
| --- | --- |
| 데이터 파이프라인 | 하이브리드 (Smogon 직접 + Pikalytics `/ai/` 보완) |
| 타겟 메타 | VGC + BSS 둘 다 동등 |
| Battle Usage vs Tournaments | 둘 다 동등 |
| 한국어 차별화 | 현재 UI 수준 유지 (Pikalytics가 이미 KOR 지원) |
| eurekaffeine 의존 | 단계적 축소 (Phase 5 이후 완전 제거 검토) |

## 📅 일정 추정

| Phase | 누적 소요 | 완료 추정 |
| --- | --- | --- |
| Phase 1 | 4주 | 2026-06-25 |
| Phase 2 | 6주 | 2026-07-09 |
| Phase 3 | 9주 | 2026-07-30 |
| Phase 4 | 12주 | 2026-08-20 |
| Phase 5 | 16주 | 2026-09-17 |

**2026-09-30 단기 KPI 시한까지 Phase 5 완수 가능** (백엔드 작업 속도 가정).

## 🔜 후속 작업

본 작업은 분석/기획까지이며, 실제 코드 작업은 다음 순서로 진행됩니다.

1. 백엔드: GraphQL 스키마 확장 + Smogon/Pikalytics cron 수집 (champions-data-sources.md 참조)
2. 프론트: Phase 1부터 순차 실행 (champions-pikalytics-enhancement.md 참조)

## 🛡 가드 지침 검증

본 작업은 이번 1.45.0의 정정 작업(2026-05-28)에서 추가된 새 가드 지침("상용 구현 확인 의무")의 첫 적용 사례입니다. BA 에이전트가 `src/app/champions/`와 GraphQL 타입을 직접 확인한 후 분석을 작성했고, 그 결과 다음을 정확히 식별할 수 있었습니다.

- **케이스 A (이미 구현됨)**: 4개 라우트 + 9개 데이터 항목
- **케이스 B (데이터는 있으나 미노출)**: winRate (eurekaffeine null)
- **케이스 C (데이터 자체 부재)**: EV 스프레드, 카운터, 레이팅 분리, 포맷 분리, 대회 데이터

3-케이스 분류가 명확해진 덕분에 "신규 구현 vs 데이터 소스 교체 vs UI 노출 보강"의 작업 성격을 Phase별로 정확히 구분할 수 있었습니다.
