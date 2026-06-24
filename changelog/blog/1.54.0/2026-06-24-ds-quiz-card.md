---
slug: 1-54-0-ds-quiz-card
title: '[1.54.0] DS 컴포넌트 — QuizCard (셸+슬롯, C3 id 중복 해결)'
description: '홈 "오늘의 퀴즈" 3종(실루엣/특성/타입) 카드의 공통 셸을 추출하지 않고 토큰 기반으로 규격화한 신규 DS 컴포넌트. 본문·답안은 슬롯으로 주입하고, headingId로 카드별 고유 id를 주입해 C3(id 중복) 버그를 해결. root 16px 고정 기준 모바일 퍼스트 2단계 토큰 적용.'
authors: [jsg3121, claude]
tags: [design-system, component, home]
---

# 1.54.0 — DS 컴포넌트: QuizCard

> **작업 일자**: 2026-06-24
> **작업 브랜치**: `feature/1.54.0-ds-quiz-card-v2`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 컴포넌트 신규 구축
**담당**: jsg3121 + Claude

홈 재설계 Phase A의 마지막 DS 컴포넌트 **QuizCard**(오늘의 퀴즈 카드 셸)를
구축했다. 기존 Silhouette/Ability/PokemonType 퀴즈 카드 컨테이너의 중복 셸을
**추출하지 않고** 토큰 기반으로 규격화해 새로 만들었다.

<!-- truncate -->

## 🧩 셸 + 슬롯 구조

3종 퀴즈는 본문(실루엣 이미지 / 특성 설명 텍스트 / 타입 태그)의 데이터 구조가
완전히 달라, 본문·답안을 **슬롯으로 주입**하고 셸(article + 헤더 + 본문 박스 +
답안 그룹)만 규격화했다.

```tsx
<QuizCardComponent
  icon="🔍"
  title="실루엣 퀴즈"
  description="이 실루엣은 어떤 포켓몬일까요?"
  headingId="silhouette-quiz-title"
  answersLabel="실루엣 퀴즈 답안 선택"
  body={/* variant별 본문 */}
  answers={/* 답안 버튼 목록 */}
/>
```

## 🐛 C3 해결 — 헤더 id 중복

기존엔 `QuizCardHeader`의 헤더 id가 `"silhouette-quiz-title"`로 **하드코딩**돼,
3개 카드가 모두 같은 id를 가졌다(WCAG 4.1.1 위반). DS QuizCard는 **`headingId`로
카드별 고유 id를 주입**해 `article`의 `aria-labelledby`와 연결한다.

## 📱 모바일 퍼스트 (root 16px 고정 기준)

ADR-0009(root 16px 고정) 이후 `1rem=16px`이 고정이므로, 모바일 축소는 2단계
토큰으로 명시한다. 모바일은 1열 전체폭(`w-full`)이라 폭은 부모(그리드 칸)를 따른다.

| 요소 | 모바일 | desktop: |
| --- | --- | --- |
| 패딩 | `p-4`(16px) | `p-6`(24px) |
| 제목/아이콘 | `text-xl`(20px) | `text-2xl`(24px) |
| 설명 | `text-sm`(14px) | `text-base`(16px) |
| 본문 박스 높이 | `h-32`(128px) | `h-40`(160px) |
| 마진 | `mb-3`(12px) | `mb-4`(16px) |

## 🔗 관련

- [ADR-0008 Storybook 디자인 시스템](/blog/1-54-0-storybook-migration)
- [root 16px 고정 + DS 모바일 퍼스트](/blog/1-54-0-root-font-fixed-mobile-first)
- [홈 페이지 재설계 기획서](/blog/1-54-0-home-redesign-spec)
