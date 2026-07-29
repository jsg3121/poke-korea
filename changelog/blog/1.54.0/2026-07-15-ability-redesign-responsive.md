---
slug: 1-54-0-ability-redesign-responsive
title: '[1.54.0] 특성 도감 페이지 개편 — 반응형 단일 + 검색 승격·접이식 설명'
description: '/ability, /ability/[id] 2개 라우트를 UA 분기 데/모 2벌에서 반응형 단일로 재구축. 검색을 설명 블록보다 위로 승격하고 "특성이란?" 설명을 접이식으로 축소, 특성 카드를 DS 텍스트 카드로 규격화, 특성별 포켓몬 카드를 도감 카드 셸 공유로 통일하며 useDevice(UA 분기)를 제거했다.'
authors: [jsg3121, claude]
tags: [feature, ux, css, a11y]
---

# 1.54.0 — 특성 도감 페이지 개편: 반응형 단일 + DS 재사용

> **작업 일자**: 2026-07-15
> **작업 브랜치**: `feature/1.54.0-ability-redesign`
> **설계 근거**: UX-007 재설계 (ux-designer)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 5호, B그룹)
**담당**: jsg3121 + Claude

홈(PR #179)·리스트(PR #180)·상세 본문(PR #181)·상세 습득기술(PR #182, A그룹)에
이어 특성 도감 2개 라우트를 개편. UX-007 설계 → DS 시안 확인·피드백 → 구현의
사이클을 따랐다. 특성은 이미지가 없는 텍스트 도메인이라 특성 카드는 기술 카드·
HubLinkCard와 같은 밝은 텍스트 카드 문법으로, 특성별 포켓몬 카드는 도감 포켓몬
카드와 셸을 공유하도록 통일했다.

## 🎯 해결한 문제

- **[Critical] `useDevice`(UA 분기) 이미지 크기 분기** — 특성별 포켓몬 카드가
  `useDevice`로 이미지 크기를 나눠 SSR/CSR 불일치 시 CLS를 유발하고 UA 위장
  기기에서 잘못된 크기로 로드되던 결함(ADR-0007 위반). 셸의 CSS `sizes`로 위임
- **UA 분기 데/모 2벌** — `/ability`, `/ability/[id]`가 데/모 뷰·컨테이너를
  완전 중복. 반응형 단일로 통합, UA는 크롬(헤더/푸터/탭바) 선택만 잔존
- **검색이 무거운 설명 블록 아래에 묻힘** — "특성이란?" 설명(스크롤 300px+)을
  지나야 검색이 나와 핵심 과업의 발견성이 낮았다. 검색을 헤더 바로 아래로
  승격(sticky)하고 설명은 접이식(기본 접힘)으로 축소
- **구버전 헤더·검색·빈 상태가 DS와 어긋남** — 구버전 PageHeader 2벌·비토큰
  gray/blue 검색 인풋·텍스트만 있는 빈 상태를 DS(PageHeader·SearchInput·
  EmptyState)로 정규화
- **`md:`/`lg:` 브레이크포인트 잔재** — 전 컴포넌트를 base(모바일) + `desktop:`
  2단으로 재작성

<!-- truncate -->

## ✨ 주요 변경사항

### 신규 DS 컴포넌트

- **AbilityCard 개편** — 특성 카드를 "이미지 없는 텍스트 카드"로 규격화.
  밝은 배경(primary-4) + 진한 텍스트 문법(HubLinkCard·QuizCard 공유), 제목
  모바일 `text-lg` → 데스크톱 `text-xl`, `md:` → `desktop:` 정리
- **AbilityCardSkeleton 신규** — 무한스크롤 추가 로드 중 카드 자리 예약.
  AbilityCard와 크기를 맞춰 CLS 방지 (포켓몬 카드 스켈레톤과 셸이 달라 별도)
- **AbilityDescriptionBody 신규** — "특성이란?" 접이식 안의 순수 설명 본문.
  구버전 AbilityDescription의 외곽 껍데기·제목 중복을 제거 (구버전은 보존)
- Storybook story 등록: `Components/AbilityCard`, `Components/AbilityCardSkeleton`

### 반응형 단일 뷰·컨테이너

- `views/ability/AbilityList.view.tsx`, `AbilityDetail.view.tsx` 신규 (얇은 뷰)
- `container/ability/AbilityList.container.tsx` — PageHeader·검색·접이식 설명·
  카드 그리드·EmptyState·무한스크롤. **pageSize 12로 통일**(데/모 15·9 분기 제거)
- `container/ability/AbilitySearch.container.tsx` — SearchInput DS + 결과 카운트.
  헤더 아래 sticky(모바일 top-12 / 데스크톱 top-30), sticky 배경 전체폭 확장
- `container/ability/PokemonByAbility.container.tsx` — Hero(뒤로가기+좌측정렬)·
  카운트 h2 승격·포켓몬 그리드·EmptyState

### 특성별 포켓몬 카드 셸 공유

- **PokemonByAbilityCard 재작성** — `PokemonCardShell`을 공유해 도감 포켓몬 카드와
  동일 셸·크기·이미지 규격으로 통일. `useDevice` 제거(CSS `sizes` 위임), 폼 분기
  href·폼 라벨·숨겨진 특성 배지 로직은 보존

### 페이지 재배선

- `app/ability/page.tsx`, `app/ability/[id]/page.tsx` — 크롬(헤더/푸터/탭바)을
  page로 승격, 콘텐츠는 반응형 단일 뷰로 교체. `revalidate=1년` 제거(headers()
  UA 감지로 동적 렌더라 실효 없던 거짓 신호 — list와 동일)

### 공유 DS 개선

- **PageHeaderComponent** — 데스크톱 설명 `max-w-none`(2줄 방지), 설명 모바일
  `text-xs`, 제목 모바일 `text-2xl`. ability가 첫 실전 적용처라 전파 없음

## 🧹 구버전 처리

구버전 데/모 뷰·컨테이너(`views/{desktop,mobile}/ability`,
`container/{desktop,mobile}/ability`)와 `AbilityCard`의 구 스타일, `AbilityDescription`,
`AbilitySearch`, `AbilityDetail`, 구 `PokemonByAbilityCard` 사용처는 **보존**한다.
홈·리스트·상세·moves 구버전과 함께 일괄 제거 트랙에서 처리(사용자 결정). 이번 PR은
신버전만 추가(기존 개편 PR과 동일 방식).

## ✅ 검증

- `tsc --noEmit` 통과 (프로젝트 전역 타입 오류 0)
- `eslint` 통과 (ability 전체 + 수정 DS, 경고 0)

## 📝 남은 작업

- C그룹(moves 목록/상세 3라우트) 등 잔여 개편 (D=type-effectiveness·E=champions·F=quiz)
- 구버전 일괄 제거, SEO 2단계(canonical·JSON-LD·?page=N), 광고 반응형 유닛 재도입
