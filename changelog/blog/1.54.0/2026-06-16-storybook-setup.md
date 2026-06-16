---
slug: 1-54-0-storybook-setup
title: '[1.54.0] Storybook 도입 — 디자인 시스템 도구 전환 (claude.ai/design 폐기)'
description: 'claude.ai/design(정적 HTML 프리뷰)으로는 실제 동작하는 컴포넌트를 담을 수 없어, 디자인 시스템 도구를 Storybook으로 전환. Storybook 10 + Next.js webpack 빌더 설치, globals.css/Tailwind 연동, a11y 애드온 구성. ADR-0008 기록. SectionHeading 첫 story로 동작 검증.'
authors: [jsg3121, claude]
tags: [design-system, storybook, tooling]
---

# 1.54.0 — Storybook 도입: 디자인 시스템 도구 전환

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-storybook-setup`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 도구 전환 (Storybook 설치·구성)
**담당**: jsg3121 + Claude

디자인 시스템 도구를 **claude.ai/design → Storybook**으로 전환했다([ADR-0008](/blog/...)).
claude.ai/design은 정적 HTML 프리뷰만 보관해, 손으로 재현하면 디자인이 깨지고
스크린샷을 올리면 "그림"일 뿐 실제 컴포넌트가 아니었다. Storybook은 실제 React
컴포넌트를 그대로 렌더하므로 코드와 100% 일치한다.

<!-- truncate -->

## 🔧 설치·구성

- **Storybook 10** + `@storybook/nextjs` (webpack5 빌더 — 프로젝트 커스텀 webpack/SVG 설정 호환)
- **globals.css/Tailwind 연동**: `.storybook/preview.tsx`에서 `globals.css` import → `.type-tag`·`card-corner-fold`·폰트 등 실제 스타일 적용
- **배경 프리셋**: primary-1(앱 기본) / white-3 / white
- **애드온**: a11y(접근성 검증), docs(autodocs), onboarding
- **스크립트**: `npm run storybook`(dev), `npm run build-storybook`

## ✅ 검증

- `build-storybook` 빌드 성공
- SectionHeading 첫 story 작성 → 빌드 산출물에 story + Tailwind 스타일(`text-primary-4`, `.type-tag`) 포함 확인
- `storybook-static` gitignore 처리

## 🎯 왜 Storybook인가 (ADR-0008)

- **실제 컴포넌트 그대로**: React 컴포넌트를 직접 import해 렌더. 손 재현·스크린샷 불필요
- **코드 자동 반영**: 컴포넌트 변경 시 story 즉시 반영 → 문서-코드 불일치 차단
- **업계 표준**: variant/상태 story, a11y, 인터랙션 테스트 생태계

## ⏭️ 다음 작업

1. claude.ai/design 산출물 마이그레이션 (Foundations 토큰 → docs story)
2. DesignSync 관련 문서 갱신 (기획서 §3.3, ux-designer.md)
3. 이후 디자인 시스템 구축을 Storybook에서 진행 (Foundations → Components → Patterns)

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `.claude/decisions/records/ADR-0008-storybook-design-system.md` | Storybook 채택 ADR 신규 |
| `.storybook/main.ts`, `preview.tsx` | Storybook 설정 + globals.css 연동 |
| `src/components/SectionHeading.stories.tsx` | 첫 story (동작 검증) |
| `package.json`, `.gitignore` | 의존성·스크립트·ignore 추가 |
