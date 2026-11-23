---
slug: architecture-doc
title: 'ADR을 단일 아키텍처 문서로 전환 — 현재 상태는 한 곳, 결정 근거는 PR 본문'
description: 'ADR 26개가 현재 규칙의 원본 역할을 하며 결정마다 여러 문서를 함께 고쳐야 했던 구조를, 현재 상태만 담는 architecture.md와 PR 본문의 검토한 대안 섹션으로 바꿨다.'
authors: [jsg3121, claude]
tags: [docs]
---

# ADR을 단일 아키텍처 문서로 전환 — 현재 상태는 한 곳, 결정 근거는 PR 본문

> **작업 날짜**: 2026-11-23
> **브랜치**: `feature/1.62.8-architecture-doc`

## 📋 작업 개요

**작업 유형**: 문서 (하네스 구조 변경)
**담당**: jsg3121, Claude

## 🎯 작업 목표

구조 결정의 현재 상태를 `.claude/decisions/architecture.md` 한 문서에만 두고, 결정 당시의 근거·기각한 대안은 PR 본문에 남긴다. 결정이 바뀔 때 고쳐야 하는 문서를 하나로 줄인다.

<!-- truncate -->

## 📉 왜 필요했나

ADR은 원래 한 번 채택하면 고치지 않고 새 ADR로 대체하는 시점 기록이다([Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), [Fowler](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)). 이 저장소에서는 ADR이 현재 규칙의 원본 역할까지 맡았다.

- 많이 고친 ADR 10개는 작성 뒤 3~6번씩 수정됐다.
- 가이드·SPEC·에이전트·코드 주석 약 30개 파일이 ADR 내용을 다시 적거나 참조했다.
- 9월 이후 커밋의 약 9%가 ADR 관련이었다.

결정 하나가 바뀌면 ADR과 사본들을 함께 고쳐야 했고, 하나라도 빠지면 다음 작업이 낡은 규칙을 따랐다. 직전 프롬프트 감사(`prompt-audit`)에서 나온 높은 신뢰도 발견 11건도 대부분 이런 "다시 적은 사본이 낡은" 유형이었다.

## ✨ 주요 변경사항

### 1. `architecture.md` 신설

승인·제안 상태 ADR 22개의 결정을 현재 코드와 대조해 **지금 유효한 상태**로만 정리했다.

- 렌더링·반응형, 데이터 페칭·캐시, 링크 prefetch, 검색 URL 동기화, 디자인 시스템, 테스트, 크롤러 차단, 앱 아이콘 등을 절로 나눴다.
- 코드 작성 규칙 계열(폴더·네이밍·코딩·린트)은 내용을 옮기지 않고 해당 가이드를 가리키는 표로만 둔다.
- 각 절에 결정 당시 ADR을 "결정 기록"으로 링크한다. 미결(ADR-0022)과 무효가 된 결정(0003·0005·0006)은 별도 표로 둔다.

### 2. 기록 방법 교체

| 파일                             | 변경                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `decisions/index.md`             | ADR 작성 규칙 → "architecture.md를 현재 상태로 고치고, 대안은 PR 본문에" 방식으로 재작성 |
| `decisions/template.md`          | 삭제 (새 ADR을 쓰지 않음)                                                              |
| `create-pr` PR 템플릿·SKILL.md   | "🔀 검토한 대안" 섹션 추가, 구조 결정 PR이면 architecture.md 변경 포함 확인            |
| `CLAUDE.md`                      | ADR 절을 "구조 결정 기록"으로 교체, 참조 표·작업 전 확인 사항 갱신                     |
| `product-planner`·`research`·`specs/index`·`structure.md`·`comments.md` | ADR 작성 제안·참조를 architecture.md·PR 본문 기준으로 |

"지침 변경 관리"의 "관련 문서를 모두 동기화한다"는 단계를 "원본 한 곳만 고치고, 같은 내용을 다시 적은 문서는 원본 링크로 바꾼다"로 바꿨다. 여러 문서를 함께 고쳐야 했던 원인이 이 규칙이었다.

### 3. 흩어진 중복 지침 정리

- `CLAUDE.md`의 "근거 기반 논의"·"이슈 수정 보고"·"수정 근거 제시" 세 절이 근거 제시를 반복하고 있어 두 절로 합쳤다.
- `decisions/index.md`에 복사돼 있던 "근거 기반 논의"를 지웠다(`CLAUDE.md`가 원본).
- `agents/index.md`의 지표 조회 규칙은 `/metrics-analysis`와 같은 사건 서술을 되풀이하고 있어 원본 링크로 줄였다.

### 4. 기존 ADR 보관

- ADR 26개 상단에 "보관본 — 현재 규칙은 architecture.md" 표시를 넣었다. 본문은 고치지 않았다.
- 공개 changelog가 ADR 파일을 링크하고 있어 삭제·이동하지 않는다. `records/index.md`도 보관 목록으로 바꿨다.

## 🔍 검증

- `architecture.md`의 각 항목을 현재 코드와 대조했다: `package.json`(Next 15·React 18·Storybook·Playwright, react-hook-form·Vitest 없음), `tailwind.config.js` screens 2종, `globals.css`의 `--font-size-base`, `apolloClient.module.ts`의 `PAGINATED_QUERY_FIELDS`, `useSearchParamInput`, `manifest.ts`의 `display: 'browser'`, `robots.ts` 차단 목록.
- 변경한 문서의 상대 링크를 검사했다. 깨진 링크 2개는 보관 ADR 안에 원래부터 있던 것이라 고치지 않았다.

## 📌 참고 사항

- 가이드·SPEC·코드 주석 안의 `ADR-NNNN` 링크는 보관본을 가리키므로 그대로 유효하다. 다음에 해당 문서를 고칠 때 `architecture.md` 절 링크로 바꿔 가면 된다.
- 이 변경은 기술적 의사결정이 아니라 운영 규칙이라 이유를 `decisions/index.md` 안에 날짜와 함께 남겼다.
