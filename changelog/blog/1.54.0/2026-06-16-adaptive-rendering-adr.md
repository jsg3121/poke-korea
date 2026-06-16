---
slug: 1-54-0-adaptive-rendering-adr
title: '[1.54.0] 렌더링 전략 결정 — 순수 적응형 일원화 (ADR-0006)'
description: '적응형(UA 분기)과 반응형(CSS 미디어쿼리)이 혼재하던 코드베이스를 순수 적응형으로 일원화하기로 결정. 컴포넌트 내 md:/sm:/lg:/xl: 미디어쿼리를 제거하고 분기를 isMobile 기준으로 통일하며, 데스크톱은 min-width + 가로 스크롤로 처리. ADR-0006으로 기록하고 기획서 Phase 0 완료 기준을 갱신.'
authors: [jsg3121, claude]
tags: [adr, architecture, mobile]
---

# 1.54.0 — 렌더링 전략 결정: 순수 적응형 일원화

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-breakpoint-unify`

## 📋 작업 개요

**작업 유형**: 아키텍처 의사결정 (ADR) + 기획서 갱신
**담당**: jsg3121 + Claude

모바일 개편 Phase 0의 "브레이크포인트 일원화"를 검토하던 중, 더 상위의 결정이
필요함을 확인했다. 이 프로젝트는 page는 적응형(UA 분기)인데 공용 컴포넌트는
반응형(CSS 미디어쿼리)을 쓰는 **혼재 상태**였다. 향후 한 방향으로 관리하기 위한
렌더링 전략을 결정하고 ADR로 기록했다.

<!-- truncate -->

## 🎯 결정 (ADR-0006)

**순수 적응형(Adaptive)으로 일원화한다.**

1. 분기는 100% UA 판별(`isMobile`) 기준. 컴포넌트 내 `md:`/`sm:`/`lg:`/`xl:` 제거
2. 양쪽에서 다르게 보여야 하는 공용 컴포넌트는 mobile/desktop로 분리
3. 다단 그리드(폭 비례)는 mobile/desktop 고정 열로 재설계
4. 데스크톱은 **min-width + 상위 `overflow-x-auto`** — 창 축소 시 리플로우 대신 가로 스크롤

## 🔍 검토 배경

`md:` 사용처 조사 결과 27건 발견. 이 중:

- 모바일 전용 파일에 있어 **발동 불가한 죽은 코드** 1건
- RadarChart의 `md:`는 CSS가 아니라 JS 객체 키(`SIZE_CONFIG`) — 건드리면 안 됨
- 다단 그리드(`sm:4 md:5 lg:6 xl:8`)는 2단 분기로 단순 치환 불가

→ **단순 일괄 치환이 불가능**함을 확인하고, 전략 자체를 결정하는 방향으로 전환.

## 💡 근거 요약

- 이미 page 38개가 전부 UA 분기 → 적응형 통일은 "정리", 반응형 통일은 "전면 재작성"
- 스트랭글러 점진 교체 전략(모바일 뷰 독립 교체)은 적응형 전제
- min-width + 스크롤: 순수 적응형의 한계(창 축소 미대응)를 "깨짐"이 아니라 "스크롤"로 명확 처리

## ⏭️ 다음 작업 (별도 브랜치)

- 컴포넌트 내 미디어쿼리 제거 + 공용 컴포넌트 mobile/desktop 분리
- 다단 그리드 고정 열 재설계
- 데스크톱 min-width 도입 (기준 너비 값 확정)

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `.claude/decisions/records/ADR-0006-adaptive-rendering-strategy.md` | 렌더링 전략 ADR 신규 |
| `.claude/specs/mobile-redesign-plan.md` | Phase 0 브레이크포인트 항목·완료 기준을 ADR-0006에 맞춰 갱신 |
