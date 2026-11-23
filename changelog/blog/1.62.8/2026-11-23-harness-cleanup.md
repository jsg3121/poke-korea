---
slug: harness-cleanup
title: '하네스 감사 후속 정리 — 에이전트 역할·스킬 설정 정정과 광고 작업 규칙 추가'
description: '프롬프트 감사에서 판단을 보류한 항목을 정리했다. ui-publisher 역할 서술을 정의에 맞추고, 무시되던 allowedTools를 지우고, research 스킬을 서브에이전트 실행으로 바꾸고, 광고 슬롯 규칙을 추가했다.'
authors: [jsg3121, claude]
tags: [docs]
---

# 하네스 감사 후속 정리 — 에이전트 역할·스킬 설정 정정과 광고 작업 규칙 추가

> **작업 날짜**: 2026-11-23
> **브랜치**: `feature/1.62.8-harness-cleanup`

## 📋 작업 개요

**작업 유형**: 문서 (하네스 정리)
**담당**: jsg3121, Claude

## 🎯 작업 목표

프롬프트 감사(`prompt-audit`)에서 판단이 필요해 보류했던 항목을 결정에 따라 정리한다. 메모리에만 있던 광고 작업 규칙을 하네스로 옮긴다.

<!-- truncate -->

## 📉 왜 필요했나

- `agents/index.md`는 ui-publisher를 "UI 컴포넌트 구현, Tailwind 스타일링"으로 소개했지만, 정의 파일은 "정적 HTML/CSS 시안, 프로젝트 코드에 반영하지 않음"이다. 어느 쪽을 읽느냐에 따라 위임 판단이 달라졌다.
- 서브에이전트 4개의 `allowedTools`는 Claude Code가 인식하지 않는 필드라 아무 효과 없이 무시되고 있었다([Claude Code — Subagents](https://code.claude.com/docs/en/sub-agents)).
- research 스킬은 웹 조사 결과가 메인 대화에 그대로 쌓이는 구조였다.
- 광고 작업 규칙(콘솔 미리보기, 슬롯 ID 발급 후 커밋)은 메모리에만 있었는데, 메모리를 초기화하면서 사라질 상황이었다.

## ✨ 주요 변경사항

| 파일                                         | 변경                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `agents/index.md`                            | ui-publisher를 "정적 시안"으로 정정, 협업 패턴의 "(구현)" → "(시안)", 본 구현은 메인 세션임을 명시 |
| `agents/{market-intelligence,business-analyst,product-planner,ux-designer}.md` | 인식되지 않는 `allowedTools` 제거 (`tools`가 이미 같은 도구를 허용) |
| `skills/research/SKILL.md`                   | `context: fork`로 서브에이전트 실행. 대화를 못 보므로 주제·맥락을 인자로 넘기고, 보고서는 반환만 하고 저장은 메인 세션이 사용자 확인 후 |
| `skills/index.md`                            | research 산출물 설명을 위 방식에 맞춤                                                       |
| `skills/code-review/SKILL.md`                | 결과 템플릿의 깨진 코드 펜스 수정 ("주의사항" 절이 코드 블록 안에 들어가 있었음)           |
| `skills/create-pr/SKILL.md`                  | 존재하지 않는 `/commit` 안내 제거                                                          |
| `skills/seo-audit/SKILL.md`                  | SEO 점검은 사용자 레벨 `audit-seo`보다 이 스킬을 우선한다고 트리거에 명시                  |
| `conventions/guides/coding.md`               | "광고 슬롯" 절 추가 — 슬롯 ID 발급 후 커밋, 위치 변경 시 콘솔 미리보기 스크립트 제공        |

## 📌 참고 사항

- research를 fork로 돌리면 서브에이전트가 실행 중 사용자에게 물을 수 없다. 그래서 파일 저장을 메인 세션으로 옮겨 CLAUDE.md의 "문서는 작성 전 사용자 확인" 규칙과 맞췄다.
