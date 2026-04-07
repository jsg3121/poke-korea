---
slug: harness-engineering
title: '하네스 엔지니어링 도입'
description: 'Claude Code 하네스 구조를 도입하여 CLAUDE.md를 슬림화하고, 에이전트/스킬/hooks 기반의 자동화 체계를 구축한 작업입니다.'
authors: [jsg3121, claude]
tags: [feature, docs]
---

# 하네스 엔지니어링 도입

> **작업 날짜**: 2026-04-06
> **브랜치**: `feature/1.36.0-harness-engineering`

## 📋 작업 개요

**작업 유형**: 기능 추가 / 문서 구조 개편
**담당**: jsg3121, claude

## 🎯 작업 목표

기존 단일 CLAUDE.md에 집중된 지침 체계를 `.claude/` 디렉토리 중심의 하네스 엔지니어링 구조로 전환하여, 컨텍스트 윈도우 효율화와 자동화 수준을 높이는 것이 목표입니다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: CLAUDE.md 슬림화

기존 585줄의 CLAUDE.md에서 핵심 요약만 남기고, 상세 규칙은 `.claude/` 하위 문서로 분리했습니다.

**변경 전**: 단일 파일에 응답 규칙, 기술 스택, 폴더 구조, 코딩 컨벤션, 린팅, SEO, 워크플로우, changelog 등 모든 내용 포함

**변경 후**: 응답 규칙 + 개발 명령어 + 기술 스택 + 폴더 구조 요약 + `.claude/` 참조 가이드만 유지

### 변경 2: conventions/guides/ 분리 문서

| 파일 | 내용 |
|------|------|
| `coding.md` | 파일 네이밍, 경로 별칭, 컴포넌트 계층, 디바이스 반응형 패턴 |
| `styling.md` | Tailwind CSS, 색상 체계, 브레이크포인트, CSS 최적화 |
| `linting.md` | ESLint, Prettier 설정 및 주요 규칙 |
| `workflow.md` | 브랜치 전략, 버전 관리, PR 규칙, 새 작업 체크리스트 |
| `rendering.md` | Next.js 설정, GraphQL 연동, 페이지 라우트 맵 |
| `changelog.md` | Docusaurus 기반 changelog 관리 규칙 및 템플릿 |

### 변경 3: 에이전트 4개 도입

| 에이전트 | 역할 |
|----------|------|
| `seo-specialist` | SEO 전문가 — 메타태그, JSON-LD, OG 이미지, sitemap |
| `ui-publisher` | UI 구현 전문가 — 컴포넌트 구현, desktop/mobile 분리 패턴 |
| `graphql-specialist` | GraphQL 전문가 — 쿼리/스키마 변경, codegen 관리 |
| `tool-designer` | 도구/계산기 설계 전문가 — 게임 메커니즘 기반 로직, 계산 모듈 설계 |

에이전트 협업 패턴에 도구/계산기 체인도 추가되었습니다:

- **새 도구/계산기 추가**: tool-designer → graphql-specialist → ui-publisher → seo-specialist
- **기존 도구 개선**: tool-designer → ui-publisher

### 변경 4: 스킬 12개 구성

기존 `commands/` 4개를 `skills/`로 이전하고, 신규 8개를 추가했습니다.

| 스킬 | 유형 | 설명 |
|------|------|------|
| `/create-branch` | 이전 | 신규 버전 브랜치 생성 |
| `/create-pr` | 이전 | Pull Request 생성 |
| `/review-pr` | 이전 | PR 코드 리뷰 코멘트 분석 |
| `/reply-review` | 이전 | PR 리뷰 코멘트 답글 작성 |
| `/lint-check` | 신규 | Prettier + ESLint 전체 검사 |
| `/seo-audit` | 신규 | SEO 메타태그/JSON-LD/sitemap 감사 |
| `/code-review` | 신규 | 서브에이전트 기반 코드 리뷰 |
| `/component-builder` | 신규 | desktop/mobile 컴포넌트 스캐폴딩 |
| `/feature-plan` | 신규 | 신규 기능 기획서 작성 (요구사항/설계 정리) |
| `/page-scaffold` | 신규 | 새 페이지 풀 세트 스캐폴딩 (page + views + container + context + SEO) |
| `/competitive-audit` | 신규 | 경쟁 사이트 특정 기능 비교 분석 |
| `/research` | 신규 | 외부 정보 조사 (자동 트리거) |

### 변경 5: Hooks 자동화 4개

| Hook | 이벤트 | 용도 |
|------|--------|------|
| `post-edit-format.sh` | PostToolUse (Edit/Write) | 파일 수정 후 자동 prettier 포맷팅 |
| `pre-bash-guard.sh` | PreToolUse (Bash) | 위험 명령어 차단 (`rm -rf`, `git push --force` 등) |
| `stop-changelog-check.sh` | Stop | 작업 완료 시 changelog 파일 존재 여부 검증 |
| `notify.sh` | Notification (idle_prompt) | macOS 데스크톱 알림 |

### 변경 6: ADR (의사결정 기록) 도입

- `decisions/template.md`: ADR 작성 템플릿
- `decisions/records/ADR-0001-harness-engineering.md`: 하네스 도입 결정 기록

### 변경 7: settings.json 프로젝트 공유용 설정

기존 `settings.local.json`만 있던 구조에서 프로젝트 공유용 `settings.json`을 추가하여 권한 설정과 hooks 설정을 포함했습니다.

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 | 비고 |
|------|---------|---------|------|
| CLAUDE.md 라인 수 | 585줄 | ~155줄 | 약 73% 감소 |
| 하네스 파일 수 | 5개 | 50+개 | 체계적 분리 |
| 커스텀 스킬 | 4개 (commands) | 14개 (skills, 폴더 구조) | 10개 신규 추가 |
| 에이전트 | 0개 | 8개 | 개발 4 + 성장 분석 4 |
| Hooks | 0개 | 4개 | 자동화 체계 구축 |
| ADR | 없음 | 템플릿 + 1건 | 의사결정 추적 시작 |
| 스펙 문서 | 없음 | 4개 | 서비스/지표/타겟/경쟁사 |
| 분석 출력 폴더 | 없음 | 3개 | weekly/experiments/insights |

## 🔧 기술적 세부사항

### 생성된 파일 목록

```
.claude/
├── settings.json                          # 프로젝트 공유 설정 (hooks 포함)
├── hooks/
│   ├── post-edit-format.sh                # 자동 포맷팅
│   ├── pre-bash-guard.sh                  # 위험 명령어 차단
│   ├── stop-changelog-check.sh            # changelog 검증
│   └── notify.sh                          # 대기 알림
├── conventions/
│   ├── index.md
│   └── guides/
│       ├── coding.md
│       ├── styling.md
│       ├── linting.md
│       ├── workflow.md
│       ├── rendering.md
│       └── changelog.md
├── seo/
│   ├── index.md
│   └── guides/
│       └── seo.md
├── decisions/
│   ├── index.md
│   ├── template.md
│   └── records/
│       └── ADR-0001-harness-engineering.md
├── skills/
│   ├── index.md
│   ├── create-branch/SKILL.md
│   ├── create-pr/SKILL.md
│   ├── review-pr/SKILL.md
│   ├── reply-review/SKILL.md
│   ├── lint-check/SKILL.md
│   ├── seo-audit/SKILL.md
│   ├── code-review/SKILL.md
│   ├── component-builder/SKILL.md
│   ├── feature-plan/SKILL.md
│   ├── page-scaffold/SKILL.md
│   ├── competitive-audit/SKILL.md
│   ├── research/SKILL.md
│   ├── weekly-growth-review/SKILL.md
│   └── growth-sprint/SKILL.md
└── agents/
    ├── index.md
    ├── seo-specialist.md
    ├── ui-publisher.md
    ├── graphql-specialist.md
    ├── tool-designer.md
    ├── growth-analyst.md
    ├── competitive-watcher.md
    ├── user-insight-analyst.md
    └── growth-strategist.md
```

### 삭제된 파일

```
.claude/commands/           # skills/로 이전 완료
├── create-branch.md
├── create-pr.md
├── review-pr.md
└── reply-review.md
```

### 변경 8: 스킬 구조를 폴더/SKILL.md 방식으로 전환

기존 단일 `.md` 파일 스킬을 `폴더/SKILL.md` + `references/` 구조로 전환했습니다.

**변경 전**:

```
skills/
├── create-branch.md
├── create-pr.md
└── ...
```

**변경 후**:

```
skills/
├── create-branch/
│   └── SKILL.md
├── competitive-audit/
│   ├── SKILL.md
│   └── references/
│       └── competitor-sites.md
└── ...
```

- 기존 13개 스킬 전부 폴더 구조로 마이그레이션
- `references/` 폴더를 통해 스킬별 참조 문서 내장 가능

### 변경 9: 성장 분석 에이전트 4개 추가

| 에이전트 | 역할 |
|----------|------|
| `growth-analyst` | 유입/퍼널/리텐션 데이터 분석 |
| `competitive-watcher` | 경쟁사 동향, 시장점유율 모니터링 |
| `user-insight-analyst` | 사용자 행동 패턴, VOC, 이탈 원인 분석 |
| `growth-strategist` | 세 에이전트 결과 종합 → 실행 액션 도출 |

성장 분석 워크플로우:

```
growth-analyst + competitive-watcher + user-insight-analyst (병렬)
    → growth-strategist (취합 → 액션 도출)
```

### 변경 10: 성장 분석 스킬 2개 추가

| 스킬 | 유형 | 설명 |
|------|------|------|
| `/weekly-growth-review` | 자동 트리거 | 주간 성장 리뷰 (4개 에이전트 병렬 실행 후 종합) |
| `/growth-sprint` | 자동 트리거 | 성장 실험 설계 (ICE 점수 기반 우선순위) |

각 스킬에 `references/` 포함:

- `weekly-growth-review/references/metrics-definition.md` — 핵심 지표 정의
- `growth-sprint/references/experiment-template.md` — 실험 설계 템플릿

### 변경 11: specs/ 및 outputs/ 폴더 추가

```
.claude/
├── specs/                     # 서비스/성장 분석 스펙
│   ├── service-overview.md    #   서비스 현황
│   ├── metrics-baseline.md    #   핵심 지표 기준값
│   ├── target-segment.md      #   타겟 사용자 정의
│   └── competitor-map.md      #   경쟁사 목록 및 포지셔닝
└── outputs/                   # 성장 분석 결과 누적 저장
    ├── weekly/                #   주간 성장 리뷰 결과
    ├── experiments/           #   성장 실험 설계서 및 결과
    └── insights/              #   개별 인사이트 메모
```

## 📌 참고 사항

- configDeck(`github.com/jsg3121/configDeck`) 하네스 구조를 참고하되, poke-korea 프로젝트 특성(Next.js, GraphQL, SEO 중심)에 맞게 재구성
- Progressive Disclosure 원칙: 필요한 문서만 참조하여 컨텍스트 윈도우 효율화
- hooks는 즉시 동작 검증됨 (pre-bash-guard가 `rm -rf` 명령 차단 확인)
- 새 세션부터 skills/ 기반 슬래시 커맨드가 동작합니다
- specs/ 파일의 `<!-- 입력 -->` 부분은 실제 서비스 데이터로 채워야 성장 분석 에이전트가 정상 동작합니다
- 성장 분석은 사업 분석(분기 단위)이 방향을 잡고, 성장 하네스(주간 단위)가 실행/측정을 담당하는 구조입니다
