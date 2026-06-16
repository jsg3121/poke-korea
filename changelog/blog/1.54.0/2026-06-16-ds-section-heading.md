---
slug: 1-54-0-ds-section-heading
title: '[1.54.0] DS 컴포넌트 — SectionHeading (홈 재설계 Phase A 첫 컴포넌트)'
description: '홈 재설계 Phase A의 첫 디자인 시스템 컴포넌트. 섹션 제목 타이포그래피를 반응형 단일 컴포넌트(text-3xl desktop:text-4xl, 모바일 퍼스트)로 구축. 기존 임의값 폰트(text-[2.5rem]/[2rem])를 토큰으로 정렬하고, className prop 미제공으로 캡슐화 유지. claude.ai/design Components 카드 업로드.'
authors: [jsg3121, claude]
tags: [design-system, component, responsive]
---

# 1.54.0 — DS 컴포넌트: SectionHeading

> **작업 일자**: 2026-06-16
> **작업 브랜치**: `feature/1.54.0-ds-section-heading`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 컴포넌트 신규 (홈 재설계 Phase A)
**담당**: jsg3121 + Claude

[홈 재설계 기획서](/blog/1-54-0-home-redesign-spec)의 Phase A(DS 컴포넌트) **첫 컴포넌트**.
홈 3개 섹션(Banner/Champions/Quiz)에서 중복되던 섹션 제목 패턴을 반응형 단일
컴포넌트로 추출했다.

<!-- truncate -->

## 🔧 SectionHeading

```tsx
interface SectionHeadingComponentProps {
  children: ReactNode
  id?: string  // aria-labelledby 연결용
}
```

- **반응형 단일** (모바일 퍼스트): `text-3xl desktop:text-4xl font-bold text-primary-4 text-center`
- **임의값 토큰화**: 기존 `text-[2.5rem]`(40px) / `text-[2rem]`(32px) → `text-4xl`(36px) / `text-3xl`(30px). 전면 재디자인 맥락에서 DS 스케일로 정렬
- **캡슐화 유지**: `className` prop 미제공. 여백·sticky 등 레이아웃은 **부모가 책임** (단일 책임 원칙)

> **Why className 미제공:** className을 prop으로 받으면 외부에서 임의 스타일을 주입할 수 있어 컴포넌트가 독립적이지 않게 된다. SectionHeading은 "섹션 제목 타이포그래피"만 책임지고, 위치는 부모 컨테이너가 래퍼로 처리한다.

## ✅ 검증

- lint·타입 통과, Tailwind 클래스 정상 생성 (`text-3xl`/`desktop:text-4xl`/`text-primary-4`)
- **DS**: claude.ai/design `poke-korea-design-system` → Components 그룹에 카드 업로드 (Foundations에 이어 Components 계층 시작)

## ⏭️ 다음 (Phase A)

PokemonCard 통합 → HorizontalScrollList → QuizCard

## 📁 변경 파일

| 파일 | 변경 내용 |
| --- | --- |
| `src/components/SectionHeading.component.tsx` | 섹션 제목 반응형 단일 컴포넌트 신규 |
