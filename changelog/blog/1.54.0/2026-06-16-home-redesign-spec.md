---
slug: 1-54-0-home-redesign-spec
title: '[1.54.0] 홈 페이지 재설계 기획서 — 2단계 첫 페이지'
description: 'UI 전면 개편 4단계 전략의 2단계 첫 페이지인 홈(/) 재설계 기획. ux-designer가 Playwright 실화면 캡처로 4축 비평(Critical 4건 포함)을 수행하고, 반응형 단일 뷰 재설계와 DS 컴포넌트 승격 후보 4개(SectionHeading/HorizontalScrollList/QuizCard/PokemonCard 통합)를 도출. 컴포넌트→컨테이너→섹션 순 구현 계획 포함.'
authors: [jsg3121, claude]
tags: [planning, responsive, design-system, home]
---

# 1.54.0 — 홈 페이지 재설계 기획서

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-home-redesign-spec`

## 📋 작업 개요

**작업 유형**: 페이지 재설계 기획 (ux-designer 비평 기반)
**담당**: jsg3121 + Claude

[UI 전면 개편 4단계 전략](/blog/1-54-0-plan-4stage-revision)의 **2단계(페이지 단위
재디자인) 첫 페이지**인 홈(`/`)의 재설계를 기획했다. `ux-designer` 에이전트가
Playwright로 모바일·데스크톱 실화면을 캡처해 4축 비평을 수행하고, 반응형 단일 뷰
재설계와 DS 컴포넌트 승격 후보를 도출했다.

<!-- truncate -->

## 🔍 4축 비평 결과

| 심각도 | 건수 | 주요 항목 |
| --- | --- | --- |
| 🔴 Critical | 4 | 모바일 챔피언스 누락(검증 필요), 퀴즈 3열 잘림, id 중복, 탭바 9px |
| 🟡 Major | 4 | 가로 스크롤 단서 없음, 헤딩 임의값 폰트, 모달 포커스 트랩, id 불일치 |
| 🟢 Minor | 2 | 섹션 max-w 불일치, 탭바 항목 과밀 |

## 🎯 DS 컴포넌트 승격 후보 (4개)

승격 기준(2곳+variant 명확) 충족:

| 컴포넌트 | 재사용 | 해결 이슈 |
| --- | --- | --- |
| SectionHeading | 3섹션 | 임의값 폰트 |
| HorizontalScrollList | Banner/Champions | 스크롤바 중복 |
| QuizCard | 퀴즈 3종 | id 중복 버그 |
| PokemonCard 통합 | mobile/desktop 90% 동일 | 모드별 2벌 제거 |

## 📐 구현 순서 (작은 단위 → 큰 단위)

```
Phase A: DS 컴포넌트 (SectionHeading → PokemonCard → HorizontalScrollList → QuizCard)
Phase B: 컨테이너 (HomeBanner → HomeChampions → HomeQuiz)
Phase C: 섹션 통합 (HomeView → page.tsx UA 분기 제거)
Phase D: 구버전 제거 (사용처 0건 확인 후)
```

## ⚠️ 검증 필요 항목

- C1(모바일 챔피언스 누락): 캡처 환경 영향 여부 미확정. 구현 전 사용자 모바일 실기기 확인 필요

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `.claude/specs/home-redesign-spec.md` | 홈 재설계 기획서 신규 |
