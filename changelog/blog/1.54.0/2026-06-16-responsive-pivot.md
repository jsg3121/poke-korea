---
slug: 1-54-0-responsive-pivot
title: '[1.54.0] 렌더링 전략 전환 — 적응형 → 반응형 (ADR-0007, ADR-0006 대체)'
description: '전면 UI 개편 + 디자인 시스템 도입이 전제가 되면서, 순수 적응형(ADR-0006)의 근거(현 구조 활용)가 무효화됨. 디자인 시스템 정석인 반응형(Responsive) 단일 컴포넌트로 전환을 결정. ADR-0007 신규, ADR-0006 대체됨 처리, styling.md/기획서 동기화.'
authors: [jsg3121, claude]
tags: [adr, architecture, responsive, design-system]
---

# 1.54.0 — 렌더링 전략 전환: 적응형 → 반응형

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-responsive-adr`

## 📋 작업 개요

**작업 유형**: 아키텍처 의사결정 전환 (대체 ADR)
**담당**: jsg3121 + Claude

[ADR-0006](/blog/1-54-0-adaptive-rendering-adr)에서 "순수 적응형"을 정했으나,
실제 목표가 **전면 UI 개편 + 디자인 시스템 도입**임이 명확해지면서 그 전제가
무너졌다. 디자인 시스템의 정석인 **반응형(Responsive)** 으로 전환하기로 결정했다.

<!-- truncate -->

## 🔄 무엇이 바뀌었나

| | ADR-0006 (대체됨) | ADR-0007 (신규) |
| --- | --- | --- |
| 패러다임 | 순수 적응형 (UA 분기) | 반응형 (CSS 브레이크포인트) |
| 공용 컴포넌트 | 모드별 2벌 또는 결정 트리 | 단일 컴포넌트가 모든 폭 대응 |
| 디바이스 정보 | getIsMobile / useDevice | 점진 제거 |
| 디자인 시스템 궁합 | 약함 (2벌 충돌) | 강함 (단일 반응형이 표준) |

## 💡 전환 근거

- **DS 정합**: Material/Ant/shadcn 등 표준 디자인 시스템은 반응형 단일 컴포넌트다. Button/Card에 모바일·데스크톱 버전이 따로 없다.
- **번들/하이드레이션**: 적응형은 분기에 `useDevice`(훅) 또는 모드별 컴포넌트가 필요해, 리스트로 반복 렌더되는 카드에서 client 강등·하이드레이션 N배 비용 발생. 반응형은 분기를 CSS로 처리해 이 비용이 없다.
- **전제 변화**: ADR-0006의 근거("현 구조 활용, 전면 재작성 회피")는 전면 개편이 전제가 된 순간 무효.

## 📌 이미 완료된 작업의 유효성

다음은 반응형에서도 유효하므로 **유지**된다(되돌리지 않음):

- 디자인 토큰 (`touch`/`touch-lg`/`2xs`)
- 죽은 미디어쿼리 제거 (#160)
- DS Foundations 카드 (claude.ai/design)

ADR-0006이 만든 "결정 트리 / `getIsMobile` / `isMobile` 전달 규칙"만 ADR-0007로 대체된다.

## ⏭️ 다음 작업

- 기획서(§4.1) 반응형 기준 후속 개정
- 디자인 시스템 컴포넌트를 반응형 단일 컴포넌트로 구축
- 기존 UA 분기 / `useDevice`를 스트랭글러 패턴으로 점진 제거

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `.claude/decisions/records/ADR-0007-responsive-rendering-strategy.md` | 반응형 전환 ADR 신규 |
| `.claude/decisions/records/ADR-0006-adaptive-rendering-strategy.md` | 상태 '대체됨' 처리 + 안내 |
| `.claude/conventions/guides/styling.md` | 반응형 컴포넌트 아키텍처로 개정 |
| `.claude/specs/mobile-redesign-plan.md` | 방향 전환 안내 배너 추가 |
