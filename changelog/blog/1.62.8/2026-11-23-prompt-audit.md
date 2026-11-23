---
slug: prompt-audit-harness-sync
title: '하네스 지침 감사 — 저장소 실제와 어긋난 스킬·에이전트 정의 정리'
description: 'Claude Code가 읽는 스킬·서브에이전트 정의를 감사해 실제 코드·폴더 규칙과 어긋난 경로, title 접미사, 파일명 규칙 등 13건을 현재 상태에 맞게 고치고 .env를 ignore에 추가했다.'
authors: [jsg3121, claude]
tags: [docs]
---

# 하네스 지침 감사 — 저장소 실제와 어긋난 스킬·에이전트 정의 정리

> **작업 날짜**: 2026-11-23
> **브랜치**: `feature/1.62.8-prompt-audit`

## 📋 작업 개요

**작업 유형**: 문서 (하네스 정리)
**담당**: jsg3121, Claude

## 🎯 작업 목표

세션마다 로드되는 스킬(`.claude/skills/`)과 서브에이전트(`.claude/agents/`) 정의를 저장소의 실제 상태에 맞춘다. 에이전트가 낡은 경로·규칙을 그대로 따라 잘못된 산출물을 만들지 않게 한다.

<!-- truncate -->

## 📉 왜 필요했나

`/claude-api prompt-audit`으로 Claude Code 설정을 감사한 결과, 옛 모델용 표현보다 **지침 문서끼리 또는 지침과 코드가 어긋난 경우**가 대부분이었다. 이런 불일치는 에이전트가 그대로 실행에 옮긴다.

- `research` 스킬은 `RES-{번호}`로 저장하라고 했지만, 더 나중에 정한 `research/index.md`는 `tech/YYYY-MM-DD-주제.md`이고 순번을 금지한다.
- `seo-specialist`는 title 접미사를 `%s | 포케 코리아`로 알고 있었지만, 실제 `layout.tsx`는 `%s - 포케 코리아`다. 중복 접미사 검사도 틀린 문자열로 하게 된다.
- `code-review` 스킬은 모든 함수에 JSDoc을 요구했지만, `comments.md`는 공용 함수 외에는 JSDoc을 쓰지 않는다고 정한다.

## ✨ 주요 변경사항

### 사실 불일치 수정

| 파일                                    | 변경                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| `skills/research/SKILL.md`              | 저장 경로·파일명을 `research/index.md` 규칙으로, "서브에이전트로 실행" 서술을 실제(메인 대화 실행)로 |
| `agents/seo-specialist.md`              | title template 접미사 구분자를 실제 값인 하이픈(`-`)으로                      |
| `skills/seo-audit/SKILL.md`             | "Next.js 14" 버전 표기 제거 (`package.json`이 권위 원본)                      |
| `agents/qa-orchestrator.md`             | `container/`·`module/`·`hook/` → `containers/`·`modules/`·`hooks/`            |
| `agents/ux-designer.md`                 | `container/` → `containers/`                                                  |
| `agents/business-analyst.md`            | 보유하지 않은 `Bash ls` 안내 제거                                             |
| `agents/product-planner.md`             | 존재하지 않는 frontmatter(`status`·`related_adrs`·`updated`) → 인용구 메타 블록, ui-publisher 역할을 "정적 시안"으로 |
| `skills/code-review/SKILL.md`           | 낡은 컨벤션 체크리스트를 `conventions/guides/` 직접 참조로                    |
| `agents/index.md`                       | seo-specialist "다국어 SEO" 서술 정정, QA 다이어그램에 `e2e-check` 추가       |
| `skills/metrics-analysis/SKILL.md`      | 예시 블록의 실측 지표를 자리표시자로 (문서 수치가 현재값으로 넘어가는 것 방지) |

### `.gitignore`에 `.env` 추가

로컬에 추적되지 않는 `.env`가 있어 실수로 커밋되지 않도록 ignore 대상에 넣었다.

## 🔍 검증

- 패치는 감사 시점 사본에 먼저 적용해 `git apply --check`로 확인한 뒤 반영했다.
- 수정한 경로·디렉터리명·title template은 `src/` 실제 구조와 `src/app/layout.tsx`로 대조했다.

## 📌 참고 사항

감사에서 수정하지 않고 판단을 남긴 항목:

- `agents/index.md`의 ui-publisher 서술("UI 컴포넌트 구현, Tailwind")과 `ui-publisher.md`(정적 HTML/CSS 시안)가 충돌한다. 같은 커밋에서 작성돼 어느 쪽이 최신인지 이력으로 판별할 수 없어 보류했다.
- `code-review/SKILL.md` 결과 템플릿의 코드 펜스가 깨져 "주의사항" 절이 코드 블록 안에 들어가 있다.
- 일부 서브에이전트의 `allowedTools` frontmatter는 문서화된 필드인지 확인이 필요하다.
