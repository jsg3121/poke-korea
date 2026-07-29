---
slug: 1-54-0-adaptive-architecture
title: '[1.54.0] 적응형 컴포넌트 아키텍처 확정 — 결정 트리 + getIsMobile'
description: '137개 컴포넌트 전수 조사를 바탕으로 적응형 컴포넌트 아키텍처를 확정. 차이 종류별 결정 트리(유지/조건부 클래스/뷰 분리/순수 함수 추출)와 isMobile 전달 규칙(서버 getIsMobile, 클라 useDevice)을 정립. ADR-0006 갱신, styling.md 명문화, 기획서 완료 기준 보강.'
authors: [jsg3121, claude]
tags: [adr, architecture, rsc, mobile]
---

# 1.54.0 — 적응형 컴포넌트 아키텍처 확정

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-adaptive-architecture`

## 📋 작업 개요

**작업 유형**: 아키텍처 의사결정 정교화 (ADR 갱신 + 컨벤션 명문화)
**담당**: jsg3121 + Claude

[ADR-0006](/blog/1-54-0-adaptive-rendering-adr)에서 "순수 적응형"을 결정한 뒤,
실제 적용 방법을 정하기 위해 `src/components/` **137개 컴포넌트를 전수 조사**했다.
그 결과를 바탕으로 컴포넌트 아키텍처를 구체화하고, ADR과 스타일 가이드에 명문화했다.

<!-- truncate -->

## 🔍 전수 조사 결과 (137개)

| 분류 | 개수 | 처리 |
| --- | --- | --- |
| 차이 없음 | ~48 | 유지 |
| 표현 차이 (크기/간격/폰트) | ~16 | `isMobile` 조건부 클래스 |
| 구조 차이 (배치/순서/유무) | ~6 | 뷰 분리 + Wrapper |
| 로직 무거움 | ~8 | 순수 함수 추출 |
| 이미 client + useDevice | 4 | 서버 컴포넌트는 getIsMobile로 전환 |

기존에 이미 올바른 패턴(`FilterOptions`의 Wrapper 분기, `ChampionsMetaSection.mobile` 분리)이
존재해, 새 패턴을 발명하지 않고 이를 표준화했다.

## 🎯 확정된 아키텍처

### 공용 컴포넌트 결정 트리

차이의 "종류"로 처리를 결정한다. 무조건 파일 분리가 아니다.

- 차이 없음 → 단일 컴포넌트 유지 (RSC)
- 표현 차이 → 단일 파일 + `isMobile` 조건부 클래스
- 구조 차이 → 뷰 분리(`.mobile`/`.desktop`) + client Wrapper가 `useDevice`로 분기
- 로직 → **순수 함수 모듈**로 추출 (훅 ❌ → RSC 유지)

### isMobile 전달 규칙 (CLS 0 + RSC 최대화)

| 컴포넌트 | 획득 방법 |
| --- | --- |
| 서버 컴포넌트 | `getIsMobile()` (`headers()` 기반) — prop·context 불필요, 서버에서 스타일 확정 → CLS 0, RSC 유지 |
| 클라이언트 컴포넌트 | `useDevice()` context (서버가 주입한 값) |

## 💡 핵심 근거

- `useDevice()`는 `useContext` 훅 → 호출 컴포넌트가 무조건 client로 강등. RSC가 필요한 곳에선 금지.
- `getIsMobile()`은 `headers()` 의존 → 서버 전용. 클라에선 못 씀. 둘은 역할 분담.
- 디바이스 정보 1개에 상태관리 라이브러리 도입은 오버엔지니어링 → `headers()` 기반 함수로 라이브러리 없이 서버 전역 공유. (`headers()`가 이미 요청 단위 메모이제이션되어 `cache()` 래핑도 불필요)
- context는 이미 CLS가 없으므로(서버 주입값) 전면 제거하지 않고 클라이언트 전용으로 유지.

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `.claude/decisions/records/ADR-0006-adaptive-rendering-strategy.md` | 결정 트리 + isMobile 전달 규칙 + 대안 보강 |
| `.claude/conventions/guides/styling.md` | 적응형 컴포넌트 아키텍처 지침 명문화 |
| `.claude/specs/mobile-redesign-plan.md` | Phase 0 완료 기준에 결정 트리·getIsMobile 추가 |
