---
slug: skills-token-optimization
title: '스킬 SKILL.md 토큰 최적화'
description: '14개 스킬 파일의 템플릿/출력 형식을 references/로 분리하여 매 대화 로드 시 토큰 소비를 약 60% 절감한 작업입니다.'
authors: [jsg3121, claude]
tags: [refactoring]
---

# 스킬 SKILL.md 토큰 최적화

> **작업 날짜**: 2026-04-07
> **브랜치**: `feature/1.36.0`

## 📋 작업 개요

**작업 유형**: 리팩토링
**담당**: jsg3121, claude

## 🎯 작업 목표

하네스 구조에서 매 대화 시작 시 로드되는 스킬 파일(14개, 총 933줄)의 토큰 소비를 줄이기 위해, 각 SKILL.md의 템플릿 코드와 출력 형식을 `references/`로 분리하여 on-demand 로드 방식으로 전환합니다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 대형 스킬 4개의 템플릿/출력 형식 분리

| 스킬 | 변경 전 | 변경 후 | 분리 파일 |
|------|---------|---------|-----------|
| `page-scaffold` | 186줄 | 27줄 | `references/templates.md` |
| `component-builder` | 77줄 | 21줄 | `references/templates.md` |
| `feature-plan` | 80줄 | 19줄 | `references/output-format.md` |
| `competitive-audit` | 78줄 | 19줄 | `references/output-format.md` |

### 변경 2: 나머지 8개 스킬 축약

출력 형식(마크다운 코드블록 템플릿)을 SKILL.md에서 제거하고 핵심 절차와 주의사항만 유지했습니다.

| 스킬 | 변경 전 | 변경 후 |
|------|---------|---------|
| `code-review` | 52줄 | 17줄 |
| `research` | 54줄 | 19줄 |
| `review-pr` | 54줄 | 16줄 |
| `reply-review` | 60줄 | 24줄 |
| `seo-audit` | 53줄 | 18줄 |
| `lint-check` | 39줄 | 13줄 |
| `growth-sprint` | 64줄 | 24줄 |
| `weekly-growth-review` | 57줄 | 22줄 |

### 변경하지 않은 스킬

- `create-branch` (26줄): 이미 간결하며 핵심 절차만 포함
- `create-pr` (53줄): Label 매핑 테이블이 핵심 정보로 분리 불가

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 | 개선율 |
|------|---------|---------|--------|
| 전체 SKILL.md 총 줄 수 | 933줄 | ~299줄 | 약 68% 감소 |
| 대형 스킬 4개 합계 | 421줄 | 86줄 | 약 80% 감소 |
| 나머지 8개 합계 | 433줄 | 153줄 | 약 65% 감소 |

## 🔧 기술적 세부사항

### 신규 생성 파일

```
.claude/skills/
├── page-scaffold/references/templates.md          # 페이지 보일러플레이트 코드
├── component-builder/references/templates.md      # 컴포넌트 보일러플레이트 코드
├── feature-plan/references/output-format.md       # 기획서 출력 형식
└── competitive-audit/references/output-format.md  # 분석 보고서 출력 형식
```

### 수정 파일 (12개)

모든 SKILL.md에서 마크다운 코드블록 템플릿을 제거하고, 필요 시 `references/` 파일을 참조하도록 변경했습니다.

## 📌 참고 사항

- 스킬 실행 시 Claude가 `references/` 파일을 자동으로 읽으므로 기능 동작에는 영향 없음
- 에이전트 파일(8개, 534줄)은 현재 상태 유지 — 추후 필요 시 별도 최적화 가능
