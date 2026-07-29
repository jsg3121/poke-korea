---
slug: 1-54-0-storybook-migration
title: '[1.54.0] claude.ai/design → Storybook 마이그레이션'
description: 'ADR-0008에 따라 디자인 시스템을 claude.ai/design에서 Storybook으로 완전 이관. Foundations(Colors/Typography/Spacing)를 tailwind.config 직접 로드 방식의 docs story로 작성하고, 기획서·ux-designer.md의 DesignSync 워크플로우를 Storybook 기준으로 갱신. claude.ai/design 원격 카드 전량 삭제.'
authors: [jsg3121, claude]
tags: [design-system, storybook, migration]
---

# 1.54.0 — claude.ai/design → Storybook 마이그레이션

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-storybook-migration`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 마이그레이션 ([ADR-0008](/blog/1-54-0-storybook-setup))
**담당**: jsg3121 + Claude

[Storybook 도입](/blog/1-54-0-storybook-setup) 후, 기존 claude.ai/design 기반 산출물을
Storybook으로 완전히 이관했다.

<!-- truncate -->

## 🔧 마이그레이션 내용

### 1. Foundations story (claude.ai/design 카드 → Storybook docs)

- `Colors` / `Typography` / `Spacing` story 작성 (`src/stories/foundations/`)
- **tailwind.config를 직접 import**해 토큰을 렌더 → 손으로 베끼지 않으며, 토큰 변경 시 자동 반영
- `build-storybook` 검증 통과

### 2. 문서 갱신 (DesignSync → Storybook)

| 문서 | 변경 |
| --- | --- |
| `mobile-redesign-plan.md` | §1.2/§3.3/§4.1/§5: claude.ai/design·DesignSync → Storybook story |
| `home-redesign-spec.md` | Phase A: Components 카드 업로드 → story 등록 |
| `ux-designer.md` | "claude.ai/design 연동" 섹션 → "디자인 시스템 연동(Storybook)" |

### 3. claude.ai/design 원격 정리

- `poke-korea-design-system` 프로젝트의 카드 7개(foundations 3 + components 4) DesignSync로 전량 삭제
- 메모리 갱신: claude.ai/design 항목(프로젝트 ID, 스크린샷 방식) 폐기 → "디자인 시스템은 Storybook" 추가

## ✅ 결과

- 디자인 시스템 도구가 **Storybook으로 일원화**됨
- Foundations가 실제 토큰을 읽는 살아있는 story로 존재 (코드-문서 불일치 없음)
- claude.ai/design·DesignSync 더 이상 사용 안 함

## ⏭️ 다음

Storybook에서 디자인 시스템 구축 계속 (SectionHeading story 완료, PokemonCard 등 Components 재작성 → 홈 재설계 Phase A~D)

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `src/stories/foundations/Colors.stories.tsx` | Colors docs story 신규 |
| `src/stories/foundations/Typography.stories.tsx` | Typography docs story 신규 |
| `src/stories/foundations/Spacing.stories.tsx` | Spacing docs story 신규 |
| `.claude/specs/mobile-redesign-plan.md` | DS 트랙 Storybook 기준 갱신 |
| `.claude/specs/home-redesign-spec.md` | Phase A story 등록으로 갱신 |
| `.claude/agents/ux-designer.md` | DesignSync → Storybook 연동 |
