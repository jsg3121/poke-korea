---
slug: 1-45-0-research-docs
title: '[1.45.0] 포딕 트래픽 분석 + 단기 KPI 정의 (분석/기획)'
description: '포딕(podic.kr) 추월을 가설로 한 시장 분석 + 갭 분석 보고서 작성, 단기(~2026-09-30) Acquisition·Activation·Revenue KPI 확정, ADR-0005 기록 및 service-overview 동기화.'
authors: [jsg3121, claude]
tags: [docs, analysis, kpi, adr]
---

# 1.45.0 — 트래픽 성장 분석/기획 트랙

> **작업 기간**: 2026-05-26 ~ (진행 중)
> **루트 브랜치**: `feature/1.45.0`
> **작업 브랜치**: `feature/1.45.0-research-docs`

## 📋 작업 개요

**작업 유형**: 분석 보고서 + 의사결정(ADR) + SPEC 동기화
**담당**: jsg3121 + Claude

본 작업은 1.45.0 루트 브랜치의 **첫 번째 작업(분석/기획 단계)** 이며, 후속 실행 작업(`/moves/[id]` 등)은 동일 루트 아래 별도 작업 브랜치로 진행됩니다.

<!-- truncate -->

## 🎯 작업 목표

### 1. 포딕(podic.kr) 추월 가설 검증

사용자가 "국내에서 포딕 트래픽을 넘어선다"는 목표를 제시했고, 이를 위해 다음 분석을 수행:

- `market-intelligence` 에이전트: 포딕 사이트 구조, 트래픽 추정(Similarweb), 점유 키워드, 한국 포켓몬 검색 카테고리 지도
- `business-analyst` 에이전트: poke-korea 내부 역량 대조, 추가 콘텐츠 카테고리 우선순위 도출

### 2. 보수적 재해석

Similarweb 추정치의 단위(visits) vs 자체 GA4(MAU) 정합성 문제를 인지하고, 절대값 비교가 아닌 **키워드 점유 중심 KPI**로 목표를 재정의.

### 3. 단기 KPI 정의

기간(~2026-09-30, 4개월) 한정 KPI 확정 — Acquisition / Activation / Revenue 3계층. 리텐션은 단기 공수 부담 고려 제외.

## 📦 산출물

| 문서 | 위치 | 목적 |
| --- | --- | --- |
| 리서치 보고서 | `.claude/research/reports/MI-BA-podic-traffic-2026-05-26.md` | MI + BA 분석 + KPI 초안 (분석 과정 기록) |
| ADR-0005 | `.claude/decisions/records/ADR-0005-traffic-growth-kpi-2026-09.md` | 단기 KPI 도입 및 목표 변경 의사결정 |
| service-overview 동기화 | `.claude/specs/service-overview.md` | MAU 단기 목표 20K 안정 유지 → 30K 성장으로 갱신 |

## 🔑 핵심 의사결정

1. **단기 MAU 목표 상향**: 20K 안정 유지 → **30K 성장** (현재 23K)
2. **"포딕 추월" 정량 비교 폐기 → 키워드 점유 KPI 채택**: Similarweb 추정 한계로 절대값 비교 불가
3. **/type-effectiveness 의존도 분산을 핵심 KPI로 채택**: 현재 MAU 대비 114% → 70% 이하 목표
4. **수익 목표**: $20/월 유지 (service-overview 기존값, 4개월 단기 부담 고려)

## 🔜 후속 작업 (1.45.0 루트 아래)

- `feature/1.45.0-keyword-tracking`: 포딕 점유 키워드 추적 리스트 작성 (A5/A6 KPI 측정 선행 작업)
- `feature/1.45.0-moves-detail`: `/moves/[id]` 기술 개별 상세 페이지 구현 (BA 1순위)
- 추가 작업은 KPI 측정 결과에 따라 결정
