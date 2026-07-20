---
slug: 1-54-0-moves-list-redesign-responsive
title: '[1.54.0] 기술 도감 페이지 개편 — 반응형 단일 + 검색 승격·접이식 필터'
description: '/moves, /moves/[id], /moves/[id]/version/[versionGroupId] 3개 라우트를 UA 분기 데/모 2벌에서 반응형 단일로 재구축. 검색을 sticky로 승격하고 타입·분류·세대 필터를 접이식 단일 선택으로 재설계, 기술 카드를 DS 텍스트 카드로 규격화, 기술별 포켓몬 카드를 도감 카드 셸 공유로 통일했다.'
authors: [jsg3121, claude]
tags: [feature, ux, css, a11y]
---

# 1.54.0 — 기술 도감 페이지 개편: 반응형 단일 + DS 재사용

> **작업 일자**: 2026-07-15
> **작업 브랜치**: `feature/1.54.0-moves-list-redesign`
> **설계 근거**: UX-008 재설계 (ux-designer)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 6호, C그룹)
**담당**: jsg3121 + Claude

홈(PR #179)·리스트(PR #180)·상세 본문(PR #181)·상세 습득기술(PR #182, A그룹)·
특성(PR #183, B그룹)에 이어 기술 도감 3개 라우트를 개편. UX-008 설계 → DS 시안
확인·피드백(모바일 1열·접이식 필터·TypeChip 확장 확정) → 구현의 사이클을 따랐다.

C그룹은 A그룹이 만든 자산(MovesVersionNav)과 B그룹이 만든 IA 패턴(검색 승격
sticky, PokemonCardShell 셸 공유 카드)을 동시에 소비하는 합류 지점이라, 신규 DS를
새로 만들기보다 기존 자산 재사용을 우선했다.

## 🎯 해결한 문제

- **[Critical] 기술 카드 3벌 파편화** — MoveCard·MoveListCard·MoveDetailCard가
  같은 데이터(기술 1건 요약)를 제각각의 구조로 표시. 목록 카드를 DS 텍스트
  카드(AbilityCard 문법)로 규격화하고 미사용 레거시는 폐기 대상으로 명시
- **[Critical] 적용 필터 비가시** — 필터 패널을 닫으면 무엇이 적용됐는지 화면에
  단서가 없어 사용자가 결과를 오해(Baymard). AppliedFilterChip 상시 노출로 해결
- **[Major] sticky 좌표 오차** — 구버전 필터가 `top-28`(112px)로 데스크톱 헤더
  실높이(120px)와 8px 어긋남. 확정 좌표(`top-12`/`desktop:top-30`)로 통일
- **[Major] 버전 nav 데/모 중복 구현** — 같은 JSX를 flex-wrap(데)과
  overflow-x-auto(모)로 2벌 유지. A그룹의 반응형 단일 MovesVersionNav 재사용
- **[Major] `useDevice`(UA 분기) 이미지 크기 분기** — 기술별 포켓몬 카드가
  UA로 이미지 크기를 나눠 SSR/CSR 불일치 시 CLS 유발(ADR-0007 위반). 셸의
  CSS `sizes`로 위임
- **비토큰 색·임의값** — `border-gray-300` 검색 인풋, `text-[2.5rem]` 히어로,
  `bg-green-600`/`bg-slate-500` 습득 배지, `badge-damage-*`/`chip-type-*`
  유틸을 전부 DS 토큰·원자(SearchInput·Tag·Chip)로 정규화

<!-- truncate -->

## ✨ 주요 변경사항

### DS 컴포넌트

- **TypeChip `mode` prop 확장** — `'multi'`(기본, checkbox 다중 — 도감 리스트) |
  `'single'`(radio 단일 — 기술 목록, `name`으로 그룹 묶음). 호출부 로직만으로
  단일 선택을 흉내내면 스크린리더에 "여러 개 선택 가능"으로 안내되는 접근성
  부정확을 input 시맨틱 교체로 해결. radio는 checked 재클릭 시 change가 발생하지
  않으므로 click에서 onChange를 재호출해 호출부 해제 토글을 지원. 기존 다중
  선택 호출부(도감 리스트 FilterBar)는 무영향
- **MovesVersionNav 승격** — detail/moves 컨테이너 로컬 → `src/components/moves/`
  (ADR-0010: 재사용처 2곳 발생). "최신" 같은 특수 항목은 호출부가 prepend
- **MoveListCard 개편** — 밝은 텍스트 카드(AbilityCard 문법)로 재작성. 타입 Tag·
  데미지분류 Chip(color) — MoveTable과 동일 색 매핑으로 도감 전체 통일.
  위력/명중/PP dl 3분할(넉넉한 밀도) 유지
- **MoveListCardSkeleton 신규** — 무한스크롤 추가 로드 중 카드 자리 예약(CLS 방지)
- **PokemonBySkillCard 재작성** — `PokemonCardShell` 셸 공유(B그룹 패턴).
  `useDevice` 제거, 습득 방법 배지(레벨업/기술머신) 토큰 정규화
  (`damage-status`/`card-accent`), 배지 영역 `min-h-6` 고정·좌측 정렬, 폼 분기
  href·폼 라벨 로직 보존
- Storybook story: `Components/MoveListCard`, `Components/MoveListCardSkeleton`
  신규, `Components/TypeChip`에 SingleSelectGroup 추가

### 기술 목록 (/moves)

- `views/moves/MovesList.view.tsx` + `container/moves/MovesList.container.tsx` —
  PageHeader → sticky 크롬(검색+필터) → 카드 그리드(모바일 1열 / 데스크톱
  auto-fill 300px). EmptyState + "검색·필터 초기화" CTA, 스켈레톤 4개, 무한스크롤
- `MovesSearch.container.tsx` — SearchInput DS + 결과 카운트, URL `?search=`
  단일 진실원(타 쿼리 보존), 디바운스
- `MovesFilterBar.container.tsx` — 기술 전용 organism 조립. 도감 리스트
  FilterBar를 이식하지 않고 원자(TypeChip·Chip·AppliedFilterChip)만 재사용 —
  필터 축 성격이 다르다(리스트=타입 다중 2개+모달, 기술=타입·분류·세대 3축
  전부 단일 선택). **접이식(기본 접힘, 사용자 확정)**으로 모바일 sticky 크롬
  높이를 최소화하되 적용 필터 칩은 상시 노출. 초기화는 필터만 지우고 검색어
  보존(B그룹 Gemini 리뷰 d841bc4와 동일 원칙)

### 기술 상세 (/moves/[id], /moves/[id]/version/[versionGroupId])

- `views/moves/MoveDetail.view.tsx` — 두 라우트가 공유(선택 버전만 다름).
  미니 히어로 → 버전 nav(sticky) → 기술별 포켓몬 그리드
- `MoveDetailHero.container.tsx` — 뒤로가기 + 제목 + Tag/Chip 배지 + 위력·명중·PP
  dl + 설명(text-base, ADR-0012). 버전별 조회 시 세대 데이터 우선 표시 +
  "버전 기준" 배지. 기술은 이미지 필드가 없어(스키마 확인) 텍스트 히어로 확정
- `MoveDetailVersionNav.container.tsx` — 승격한 MovesVersionNav 재사용, "최신"
  sentinel(vgId=0)을 items 맨 앞에 prepend. sticky 전체 폭 배경 + 내부 max-w-7xl
- `PokemonBySkillList.container.tsx` — 카운트 h2 승격 + 셸 공유 카드 그리드
  (모바일 2열 / 데스크톱 auto-fill 14rem) + EmptyState + 무한스크롤(ability 동형)

### 페이지 재배선

- 3개 page.tsx — 크롬(헤더/푸터/탭바)을 page로 승격(UA 분기는 크롬 선택만),
  콘텐츠는 반응형 단일 뷰로 교체. `revalidate` 제거(headers() UA 감지로 동적
  렌더라 실효 없던 거짓 신호 — ability·list와 동일). 광고 배너 4종 제거(전
  트랙 관례, 반응형 유닛 재도입은 별도 트랙)

## ♿ 접근성

- 타입 필터 단일 선택을 radio 시맨틱으로 정확히 전달(`role="radiogroup"` +
  `<input type="radio">`), 분류·세대는 `role="group"` + `aria-pressed`(Chip)
- 버전 nav `aria-current="page"`(A그룹 구현 승계), 카운트 문구 h2 승격
- 추가 로드 알림 `role="status"` sr-only 1회, 스켈레톤 `aria-hidden`
- 데미지분류 Chip은 색+텍스트 라벨 병기(WCAG 1.4.1), 카드 그리드 ul/li 시맨틱

## ✅ 검증

- `tsc --noEmit` / `eslint`(신규 파일 0건) / `build-storybook` / `next build` 통과
- 로컬 시각 검증(모바일 375·데스크톱 1280)은 사용자 확인 예정

## 🔒 보존 (일괄 제거 트랙)

구버전 데/모 뷰·컨테이너(`views/{desktop,mobile}/moves/**`,
`container/{desktop,mobile}/moves/**`)와 레거시 카드(MoveCard·MoveDetailCard·
구 MoveDetail.component)는 이번 PR에서 제거하지 않는다 — 홈·리스트·상세 구버전과
함께 일괄 제거 트랙에서 정리(사용자 결정, A·B그룹과 동일 방식).
