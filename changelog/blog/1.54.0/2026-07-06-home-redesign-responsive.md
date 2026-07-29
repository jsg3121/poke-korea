---
slug: 1-54-0-home-redesign-responsive
title: '[1.54.0] 홈 전면 개편 — 반응형 단일 뷰 + DS 조립 (챔피언스 폴드 위)'
description: '홈을 UA 분기 데/모 2벌에서 반응형 단일 뷰로 재구축. 챔피언스 TOP 3를 폴드 위로 올려 유입을 확대하고, 허브 링크 그리드(HubLinkCard 신규)를 신설해 콘텐츠 축 6개를 홈 본문에 노출. 광고는 폴드 아래 정적 섹션 뒤로 이동. Button primary에 1px 테두리 추가.'
authors: [jsg3121, claude]
tags: [feature, ux, css, seo]
---

# 1.54.0 — 홈 전면 개편: 반응형 단일 + DS 조립

> **작업 일자**: 2026-07-06
> **작업 브랜치**: `feature/1.54.0-home-redesign`
> **설계 근거**: [RES-001 레퍼런스 조사](/.claude/research/reports/RES-001-home-ui-ux-reference.md) · [UX-003 재설계](/.claude/research/reports/UX-003-home-redesign.md)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 1호)
**담당**: jsg3121 + Claude

DS(원자·organism) 구축 완료 후 첫 페이지 개편. 외부 레퍼런스 조사(RES-001) →
ux-designer 재설계(UX-003) → DS 기반 시안(ui-publisher) → 구현의 사이클로 진행했다.

## 🎯 작업 목표

- 홈의 UA 서버 분기 + 데/모 컴포넌트 2벌(ADR-0007 위반)을 **반응형 단일 뷰**로 통합
- 최근 유입이 많은 **챔피언스를 폴드 위로** 올려 유입 확대(사용자 결정)
- 홈 본문에 없던 **콘텐츠 허브 진입(타입상성·기술·특성 등) 신설** — 내부 링크 권위 분배
- 광고가 폴드 최상단을 차지하던 문제 해소

<!-- truncate -->

## ✨ 주요 변경사항

### 1. 새 홈 구조 (UX-003 개정판)

```text
① 이번 주 챔피언스 TOP 3 (폴드 위) — ChampionsCard×3 + CTA 카드 직하
② 허브 링크 그리드 (신설)      — HubLinkCard×6 (도감·상성·기술·특성·챔피언스·퀴즈)
   [광고 TopBanner]            — 항상 렌더되는 정적 섹션 뒤 (폴드가 광고로 시작 방지)
③ 오늘의 퀴즈                  — QuizCard×3 + "퀴즈 더 풀어보기" CTA(신설)
④ 오늘의 포켓몬                — PokemonCard×10 가로 스크롤(peek)
   [광고 BottomBanner] / Footer
```

### 2. 반응형 단일 뷰 (`src/views/home/Home.view.tsx`)

- 콘텐츠는 UA 분기·display:none 없이 CSS(`desktop:`)만으로 반응(ADR-0007).
- `page.tsx`의 UA 분기는 **크롬(헤더/푸터/탭바)과 디바이스별 AdSense 유닛 선택으로만
  축소** — 미노출 광고 유닛의 숨김 렌더는 AdSense 정책 위반이라 CSS 분기가 불가능하고,
  전역 크롬은 전 페이지 공용이라 별도 트랙에서 통합한다. 광고 유닛은 ReactNode 슬롯으로
  주입(`topBanner`/`bottomBanner`).

### 3. 섹션 컨테이너 (`src/container/home/`)

| 컨테이너 | 내용 |
|---|---|
| `HomeChampions` | SectionHeading+포맷 부제 → HorizontalScrollList+ChampionsCard → **LinkButton CTA 카드 직하**(폴드 안 노출). 데스크톱은 3장이 폭에 들어가 `max-w-fit+mx-auto` 중앙 정렬(overflow에 justify-center를 주면 좌측이 잘리는 문제 회피). 빈 배열이면 미렌더 |
| `HomeHubLinks` (신설) | HubLinkCard×6, 2열→`desktop:`3열. 정적이라 항상 렌더 — 동적 첫 섹션이 비어도 폴드 콘텐츠 보장. SVGR 아이콘은 MobileTabBar 자산 재사용 |
| `HomeQuiz` | 기존 DS QuizCard 조립(Phase B 검토 채택) + `/quiz` CTA 신설 |
| `HomeDailyPokemon` | HomeBanner 대체(이름 명확화). 빈 배열 가드 추가 |

- 전 섹션 gutter `px-5 desktop:px-8` 통일, 제목은 SectionHeading(sticky 제거).
- 폐기: Phase B `HomeBanner.container/stories`(대체됨). 구버전 데/모 2벌
  (`Home.desktop/mobile`, `container/desktop·mobile/home/`, `ChampionsTopCard`)은
  3단계 원칙대로 유지 — 실기기 검증 후 4단계에서 사용처 0건 확인 후 제거.

### 4. DS 보강

- **HubLinkCard 신규**: 아이콘+제목+한 줄 서술형 앵커의 타일 링크. 밝은 카드
  (bg-primary-4+shadow-lg) + 진한 텍스트 — QuizCard·포켓몬 카드와 같은 "다크 셸 위
  밝은 카드" 문법(사용자 피드백 반영). 대비 제목 9.7:1·설명 4.7:1(AA).
- **Button/LinkButton primary에 1px 테두리**(border-primary-3): 페이지/모달
  배경(primary-1)과 동색이라 경계가 사라지던 문제 — 폴드 위 CTA 시인성 확보(사용자 결정).

## 🔧 기술적 세부사항

**SVGR × 서버 컴포넌트 이슈**: SVGR 웹팩 룰(issuer 조건)이 App Router 서버 컴포넌트
그래프에서 동작하지 않아, 서버 컴포넌트에서 SVG를 import하면 빌드가 실패한다(기존
import처가 전부 'use client'라 잠복해 있던 문제). `HomeHubLinks`를 MobileTabBar와
동일하게 클라이언트 경계로 두어 해결 — 클라이언트 컴포넌트도 SSR되므로 허브 링크는
초기 HTML에 포함(SEO 영향 없음). next.config의 SVGR 공식 레시피 적용은 별도 과제.

**검증**: `tsc` 0 · ESLint 0 · `build-storybook` 성공 · **`next build` 성공**.
접근성은 코드 레벨 확인(h1→h2→h3 위계, 섹션 aria-labelledby+고유 id, 퀴즈 headingId
고유(WCAG 4.1.1), sticky 헤딩 제거, 광고 폴드 아래).

## 📌 참고 사항

- 모바일 375px에서 챔피언스 CTA의 폴드 안 노출은 실기기 확인 필요(UX-003 결정 포인트 ③).
- 퀴즈 스트릭(연속 참여) 노출은 유저 히스토리 데이터가 없어 1차 범위 제외.
- 서브네비 포맷 컨텍스트·RadioGroup controlled 전환은 기존 동작 이관분으로 후속 과제.
