---
slug: 1-54-0-home-phase-b-containers
title: '[1.54.0] 홈 Phase B — 컨테이너 반응형 단일 + 카드 셸 추출'
description: '홈 재설계 4단계 전략의 Phase B(컨테이너 조립). HomeBanner·HomeChampions·HomeQuiz 3개 컨테이너를 DS 컴포넌트 조립으로 반응형 단일화. PokemonCardShell을 추출해 PokemonCard·ChampionsCard가 같은 레이아웃을 공유하고, ChampionsCard 신규 구축. 모바일 gutter px-5 표준 통일.'
authors: [jsg3121, claude]
tags: [design-system, responsive, home, component]
---

# 1.54.0 — 홈 Phase B: 컨테이너 반응형 단일 + 카드 셸 추출

> **작업 일자**: 2026-06-24
> **작업 브랜치**: `feature/1.54.0-home-banner-container`

## 📋 작업 개요

**작업 유형**: 페이지 재구성 (Phase B 컨테이너 조립)
**담당**: jsg3121 + Claude

[홈 재설계 4단계 전략](/blog/1-54-0-plan-4stage-revision)의 **Phase B**로, Phase A에서
만든 DS 컴포넌트(SectionHeading/HorizontalScrollList/PokemonCard/QuizCard)를 조립해
홈 3개 섹션 컨테이너를 **반응형 단일**로 재작성했다. 기존 desktop/mobile 2벌 분리
컨테이너를 대체한다.

<!-- truncate -->

## 🃏 카드 셸 추출 + ChampionsCard 신규

챔피언스 카드를 포켓몬 카드와 **같은 레이아웃 컨셉**으로 재설계하면서, 공통 레이아웃을
`PokemonCardShell`로 추출했다: 데이터 도메인(PokemonList / ChampionsMetaStats)이 달라
카드는 분리하되, 셸은 공유한다(셸 추출은 두 번째 사용처가 생기는 ChampionsCard 구축
시점에 수행).

| 컴포넌트 | 역할 |
| --- | --- |
| **PokemonCardShell** (신규) | Link+article+포켓볼+이미지+타입태그+그라데이션 공통 레이아웃. 헤더·본문·뱃지·아웃라인은 slot/prop |
| **PokemonCard** (리팩토링) | 셸 사용, 헤더(No.+이름)·본문(스탯)만 책임 |
| **ChampionsCard** (신규) | 셸 공유 + 챔피언스 포인트: 티어 아웃라인(S금/A은/B동), 포켓볼 티어 랭크 뱃지, 본문 사용률·승률(null→"-") |

**레이아웃 개선** (셸 차원):

- 카드 고정 높이(모바일 `h-[15.5rem]` / 데스크톱 `h-80`, 비율 강제 아닌 독립 규격)로
  PokemonCard·ChampionsCard 높이 일정
- 이미지 영역 `flex-1`로 헤더 길이(1~3줄) 흡수 → 본문 잘림 방지
- 이름 `break-keep`(어절 단위 줄바꿈) + 길이별 폰트·정렬(짧으면 우측, 길면 좌측)

## 🧩 3개 컨테이너 반응형 단일

| 컨테이너 | 구성 | 기존 → 새 |
| --- | --- | --- |
| **HomeBanner** | SectionHeading + HorizontalScrollList + PokemonCard | px-8/calc 혼재 가로스크롤 → 단일 |
| **HomeChampions** | + ChampionsCard + CTA | flex-wrap/가로스크롤 혼재 → 가로스크롤 단일 |
| **HomeQuiz** | + QuizCard ×3 | grid-cols-3/grid-rows-3 → `grid-cols-1 desktop:grid-cols-3` |

- HomeQuiz의 3종 퀴즈 카드 컨테이너를 QuizCard DS 셸 + `useCorrectQuizCheck` 로직으로
  재작성. 훅을 공용 위치로 이동, C3(id 중복)·모달 portal id 분리 해결.
- 각 컨테이너는 Storybook story(Desktop/Mobile)로 검증.

## 📏 모바일 gutter 표준 px-5

기존 홈 컨테이너의 좌우 여백 불일치(Banner/Champions = calc+px-2 = 28px, Quiz = 20px)를
**px-5(20px)로 통일**했다. Header/Footer/도감 List가 이미 px-5라 본문이 헤더와 좌우
정렬된다.

## ⚠️ 후속

- CTA 링크/버튼(챔피언스 도감 보기 등)은 인라인 유지 → 다음 작업으로 링크형·버튼 등
  최소 단위 DS 컴포넌트를 구축해 교체한다.
- Phase C에서 뷰 통합 + page.tsx UA 분기 제거로 실제 라우트에 연결한다.
- 기존 desktop/mobile 컨테이너·ChampionsTopCard는 Phase D(구버전 제거)에서 정리.

## 🔗 관련

- [DS Tag + PokemonCard](/blog/1-54-0-ds-pokemon-card)
- [DS HorizontalScrollList](/blog/1-54-0-ds-horizontal-scroll-list)
- [DS QuizCard](/blog/1-54-0-ds-quiz-card)
- [root 16px 고정 + DS 모바일 퍼스트](/blog/1-54-0-root-font-fixed-mobile-first)
