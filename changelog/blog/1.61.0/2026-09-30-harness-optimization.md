---
slug: harness-optimization
title: '에이전트·스킬 정의 문서 정합성 복구 및 슬림화'
description: '에이전트·스킬 문서가 존재하지 않는 경로를 참조하거나 실행 불가능한 지침을 담고 있던 문제를 수정했습니다. seo-specialist를 재작성하고, 긴 정의 문서를 references로 분리했습니다.'
authors: [jsg3121, claude]
tags: [documentation, refactoring]
---

# 에이전트·스킬 정의 문서 정합성 복구 및 슬림화

> **작업 날짜**: 2026-09-30
> **브랜치**: `feature/1.61.0-harness-optimization`

## 📋 작업 개요

**작업 유형**: 문서 정비 (하네스)
**담당**: jsg3121, claude

## 🎯 작업 목표

1.61.0에서 `conventions/`·`specs/`·`research/` 구조를 개편했지만, **에이전트와 스킬 정의 문서는 그 개편을 따라가지 못한 상태**였다. 존재하지 않는 폴더를 참조하거나, 에이전트가 가진 도구로는 실행할 수 없는 지침이 남아 있었다.

<!-- truncate -->

## 🔧 무엇이 문제였나

### 1. seo-specialist가 없는 폴더를 참조

정의 문서 전체가 `.claude/seo/` 하위 가이드 3종(`semantic-html.md`·`meta-tags.md`·`structured-data.md`)을 근거로 삼고 있었는데, **이 폴더 자체가 존재하지 않았다.** 43줄짜리 문서에서 작업 원칙과 참조 문서가 모두 빈 곳을 가리켜, 실질 지침이 0에 가까웠다.

### 2. 실행 불가능한 캡처 지침

`agents/index.md`의 공통 규칙이 `capture-screenshots.js`를 호출하라고 안내했다. 이 스크립트는 2026-07-27에 `capture.js`로 단일화되며 제거된 파일이다. 같은 절에 "필요 시 임시 캡처 스크립트를 작성해도 된다"는 안내도 남아 있어, 단일화 결정과 정면으로 어긋났다.

`ux-designer`는 더 근본적인 문제가 있었다. "Playwright로 실제 화면을 캡처하라"는 지침을 갖고 있지만, 이 에이전트의 `tools`는 `Read`/`Glob`/`Grep`/`WebSearch`/`WebFetch`로 제한되어 **애초에 캡처를 실행할 수 없다.**

### 3. 정의 문서 비대화

`ui-publisher` 246줄, `create-pr` 292줄로, 특정 시점의 작업 맥락과 절차 상세가 정의 본문에 그대로 박혀 있었다. 호출할 때마다 전부 로드되어 컨텍스트를 소모했다.

## ✅ 수정 내용

### seo-specialist 재작성 (43 → 56줄)

없는 참조를 제거하고, **이 프로젝트에서만 성립하는 SEO 전제**를 실제 지침으로 채웠다.

- **단일 언어(한국어)** — hreflang·다국어 alternates는 해당 없음
- **`title.template`이 브랜드 접미사를 자동 부착** — 페이지 title에 또 붙이면 `| 포케 코리아 | 포케 코리아`로 중복
- **description은 한국어 기준 80~120자** — 영문 통설(120~160자)을 적용하면 핵심 답이 스니펫 밖으로 밀린다
- **구조화 데이터는 리치결과 지원 여부로 선택** — 가상 캐릭터는 전용 타입이 없어 `Thing`이 현실적

검사 항목은 중복 관리하지 않고 `/seo-audit` 스킬을 권위 원본으로 지정했다.

### 캡처 규칙 정합

| 파일 | 수정 |
| --- | --- |
| `agents/index.md` | `capture.js` 호출로 정정, 임시 스크립트 작성 금지 명시, **캡처 주체를 메인 세션으로 지정** |
| `ux-designer.md` | 스스로 캡처하지 않고 전달받은 이미지를 근거로 분석. 이미지가 없으면 추측하지 말고 캡처를 요청 |

### 정의 문서 슬림화

| 파일 | 변경 | 분리처 |
| --- | --- | --- |
| `ui-publisher.md` | 246 → 88줄 | `agents/references/ui-publisher-ds-alignment.md` |
| `create-pr/SKILL.md` | 292 → 126줄 | `create-pr/references/verification.md` |

DS 정합 절차와 검증 실행 절차는 **실제로 그 작업을 할 때만 필요**하므로, 정의 본문에서 분리해 필요 시점에만 읽도록 했다(Progressive Disclosure).

### 그 외

- `skills/index.md` — 스킬별 산출물 유무를 명시하고, 검사 스킬(`lint-check`·`code-review`·`a11y-check`·`seo-audit`)이 자동 수정하지 않는다는 원칙을 추가
- `seo-audit/SKILL.md` — 이전 감사 보고서 경로를 `research/seo/`로 정정

### CLAUDE.md 중복 제거 (250 → 210줄)

CLAUDE.md는 **매 세션 자동 로드**되므로, 다른 문서와 겹치는 내용은 컨텍스트만 차지하고 갱신 누락 시 거짓 정보가 된다.

| 대상 | 문제 | 조치 |
| --- | --- | --- |
| 폴더 트리 2종 (49줄) | `structure.md`가 `src/`·`.claude/`를 모두 다루는데 트리를 복제. "배치 규칙은 structure.md가 권위 원본"이라 써놓고 바로 위에 트리를 둔 모순 | 제거하고 계층 다이어그램과 진입 규칙만 남김 |
| 기술 스택 버전 | `package.json`과 이중 관리. 실제로 Next.js 14→15 업그레이드 때 표가 뒤늦게 따라온 이력 | 버전 열 삭제, "버전은 package.json이 권위 원본" 명시 |
| 응답 규칙 | 평평한 17개 목록에 브랜치 확인이 2번 중복 | **작업 전 / 답변 방식 / 코드 작성 / 문서 작성** 4개 절로 재편 |
| 개발 명령어 | `lint:fix`·`format:check` 누락 | 추가 + dev 서버 실행 중 `build` 금지 경고 |

## 📌 확인 지점

- `.claude/` 내 깨진 `.md` 참조: **0건** (gitignore된 외부 API 명세 1건 제외)
- Prettier 검사: 전체 통과
