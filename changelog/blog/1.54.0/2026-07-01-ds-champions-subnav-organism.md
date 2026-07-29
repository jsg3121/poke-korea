---
slug: 1-54-0-ds-champions-subnav-organism
title: '[1.54.0] DS organism — 챔피언스 서브네비 (데/모 2벌 → 반응형 단일)'
description: '원자 조립 단계의 첫 organism. 챔피언스 상단 서브네비의 데스크톱/모바일 2벌을 TabItem(underline) 원자로 조립한 CSS 반응형 단일 컴포넌트로 통합. 모바일은 flex-1 균등 배분(12px)으로 스크롤 없이 꽉 채우고, TabItem 모바일 높이를 36px로 올려 active 밑줄을 하단 경계선에 붙였다.'
authors: [jsg3121, claude]
tags: [feature, ux, css]
---

# 1.54.0 — DS organism: 챔피언스 서브네비

> **작업 일자**: 2026-07-01
> **작업 브랜치**: `feature/1.54.0-ds-organisms`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 (organism 조립)
**담당**: jsg3121 + Claude

원자 DS 구축(라운드1·2·3) 완료 후, 원자를 조립하는 **organism 단계**의 첫 작업.
데/모 2벌로 분리돼 있던 챔피언스 상단 서브네비를 TabItem 원자로 조립한 **CSS 반응형
단일**로 통합한다(ADR-0007, UA 분기·display:none 없음).

## 🎯 작업 목표

챔피언스 서브네비는 데스크톱(`ChampionsSubNav`)/모바일(`ChampionsSubNavMobile`) 2벌로
분리돼 navItems·pathname 매칭 로직이 중복됐다. 이를 TabItem(underline)을 배열로 조립한
단일 organism으로 합치고, 모바일에서 스크롤 없이 화면을 꽉 채운다.

<!-- truncate -->

## ✨ 주요 변경사항

### 1. ChampionsSubNav organism 신규

```text
src/components/champions/ChampionsSubNav.organism.tsx
src/components/champions/ChampionsSubNav.organism.stories.tsx
```

- TabItem(underline)을 NAV_ITEMS 배열로 조립. 도메인 로직(navItems·pathname 매칭)은
  organism이 담당하고, 시각/active는 TabItem 원자에 위임.
- **데/모 2벌 → CSS 반응형 단일**: `h-9 desktop:h-10`, `top-16 desktop:top-28`,
  `bg-primary-1`(통일). `useDevice` 없이 `desktop:` 브레이크포인트만.
- **모바일 flex-1 균등 배분**: 스크롤 없이 화면을 꽉 채운다(상용 검증: 12px로 4개 항목이
  좁은 폭에 들어감). 데스크톱은 좌측 정렬 자연폭.
- story는 `nextjs.navigation.pathname` 목킹으로 active 상태별 렌더(organism도 story 작성).

### 2. TabItem 조정 (원자)

**높이 — 모바일 24px → 36px**:

```ts
// 변경 전                              변경 후
min-h-touch-tab desktop:min-h-touch  →  min-h-9 desktop:min-h-touch
```

네비 바 조립 시 항목 높이(36px)가 컨테이너 높이와 맞아 **active 밑줄이 하단 경계선에
붙는다**(24px일 땐 항목이 작아 밑줄과 경계선 사이 여백이 생겼다). 36px은 WCAG 2.2
2.5.8(AA, 24px)을 여유롭게 충족해 "항목 간격 24px 전제"도 불필요해졌다.

**underline 폰트·패딩 — 모바일 퍼스트 차등**:

```ts
text-sm → text-xs desktop:text-sm   // 12→14px (균등 배분에서 12px로 들어감)
px-3    → px-2 desktop:px-4
```

미사용이 된 `touch-tab`(24px) 토큰은 제거.

## 🎨 디자인 변경

- 모바일 서브네비 active 밑줄이 하단 경계선과 붙어 여백 없이 깔끔하게 정렬.
- 모바일 균등 배분으로 스크롤 없이 4개 항목이 화면을 꽉 채움.

## 🔧 기술적 세부사항

**추가된 파일**

- `src/components/champions/ChampionsSubNav.organism.tsx` / `.stories.tsx`

**수정된 파일**

- `src/components/tab/tabItemStyle.ts` — 높이 36px, underline 폰트 반응형
- `tailwind.config.js` — `touch-tab` 토큰 제거
- `.claude/decisions/records/ADR-0011-tab-touch-target-24px.md` — 탭 모바일 24→36px
- `.claude/conventions/guides/styling.md` — 터치 타겟 규칙 탭 부분 갱신

**검증**: TypeScript 타입 에러 없음, ESLint 통과.

## 📌 참고 사항

- **organism도 story를 작성한다** — 라우터 등 의존성은 `@storybook/nextjs`의 navigation
  목킹으로 주입(Storybook 10 App Router 지원).
- 기존 데/모 2벌(`ChampionsSubNav.component.tsx`, `ChampionsSubNavMobile.component.tsx`)은
  건드리지 않는다 — 신규 organism으로만 만들고, 교체·삭제는 페이지 개편 단계에서.
- 다음 organism 후보: FilterModal·FilterBar(데/모 2벌 통합), 포맷 탭(TabItem fill 교체).
