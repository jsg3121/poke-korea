---
slug: 1-54-0-ux-designer-design-critique
title: '[1.54.0] ux-designer 에이전트 강화 — Design Critique + claude.ai/design 연동'
description: 'Anthropic 공식 Design 플러그인을 참고해 ux-designer 에이전트에 구조화된 Design Critique(사용성·일관성·시각계층·접근성 4축) 역할을 추가. ConfigDeck 잔재(Astro/Svelte, 깨진 참조 경로)를 poke-korea 실제 스택·경로로 정리하고, claude.ai/design(DesignSync) 연동을 역할 분리 방식으로 워크플로우에 편입.'
authors: [jsg3121, claude]
tags: [harness, agent, design]
---

# 1.54.0 — ux-designer 에이전트 강화

> **작업 일자**: 2026-06-15
> **작업 브랜치**: `feature/1.54.0-ux-designer-critique`

## 📋 작업 개요

**작업 유형**: 하네스(에이전트 정의) 강화 + 외부 연동 편입
**담당**: jsg3121 + Claude

Anthropic 공식 **Design 플러그인**(Design Critique / UX Writing / Accessibility Audit 등)을
참고하여, 기존 `ux-designer` 에이전트에 **구조화된 디자인 비평(Design Critique)** 역할을
추가했다. 동시에 claude.ai/design의 디자인 시스템 동기화(`DesignSync`)를
워크플로우에 편입하되, 에이전트의 "코드 미작성·plan 모드" 원칙과 충돌하지 않도록
**역할 분리(방안 A)** 구조로 설계했다.

<!-- truncate -->

## 🎯 작업 목표

- `ux-designer`에 사용성·일관성·시각계층·접근성 4축 기반 Design Critique 역할 추가
- 각 비평 지적에 **심각도(Critical/Major/Minor) + 근거 + 개선안** 구조 강제
- ConfigDeck 잔재(존재하지 않는 참조 경로, Astro/Svelte 표현)를 poke-korea 실제 스택·경로로 정리
- claude.ai/design(DesignSync) 연동을 워크플로우에 편입 (역할 분리 방식)

## 🔧 주요 변경 사항

### 1. Design Critique 역할 추가

기존 ux-designer는 UX **설계**만 담당했다. 여기에 기존 화면·시안에 대한 **구조화된 비평**
역할을 추가했다. 4개 축으로 점검하고, 단순 인상평이 아니라 각 지적에 심각도·근거·개선안을
명시하도록 출력 형식을 강제했다.

| 비평 축       | 점검 항목                                            |
| ------------- | ---------------------------------------------------- |
| Usability     | 발견 가능성, 피드백, 오류 방지, 인지 부하, 터치 타겟 |
| Consistency   | 디자인 시스템·Tailwind 토큰 정합성, 패턴 재사용      |
| Hierarchy     | 정렬, 대비, 여백, 강조, 정보 우선순위                |
| Accessibility | WCAG 2.1 AA (대비비, 키보드, 포커스, 의미 구조)      |

### 2. ConfigDeck 잔재 정리

기존 파일에 남아 있던 다른 프로젝트(ConfigDeck) 흔적을 정리했다.

- 기술 표현: `Astro 아일랜드 / Svelte` → `Next.js / React / Tailwind`
- 깨진 참조 경로 3건을 실존 경로로 교체:
  - `.claude/ia/specs/configDeckIA.md` (없음) → `.claude/specs/service-overview.md`, `target-segment.md`
  - `.claude/decisions/records/ADR-0005-share-link.md` (없음) → 제거
  - `.claude/seo/guides/semantic-html.md` (없음) → `.claude/conventions/guides/styling.md`

### 3. claude.ai/design 연동 (역할 분리)

`DesignSync` 도구로 시안을 claude.ai/design에 올려 시각적으로 미리볼 수 있도록 연동했다.
단, ux-designer는 `permissionMode: plan` + "코드 미작성" 원칙을 가지므로 쓰기 권한을 직접
부여하지 않고, 책임을 분리했다.

```text
ux-designer (설계·비평, 읽기 전용)
   → ui-publisher (HTML/CSS 시안 생성)
      → 메인 세션 (DesignSync로 claude.ai/design 업로드·미리보기)
```

### 4. description 트리거 확장

"디자인 검토해줘", "UI 비평", "UI 개선해줘", "사용성 점검", "디자인 시스템 일관성 검토"
키워드를 트리거에 추가했다.

## ✅ 검증

- 새로 참조한 문서 경로 전체 실존 확인 (`service-overview.md`, `target-segment.md`,
  `styling.md`, `playwright/index.md`, `a11y-check/`)
- `DesignSync.list_projects` 호출로 claude.ai 로그인의 design-system 접근 권한
  업그레이드 및 연동 정상 동작 확인 (현재 디자인 시스템 프로젝트 0개 — 첫 시안 업로드
  시점에 `create_project`로 생성 예정)

## 📁 변경 파일

| 파일                            | 변경 내용                          |
| ------------------------------- | ---------------------------------- |
| `.claude/agents/ux-designer.md` | Design Critique 역할 추가 + 정리   |
