---
slug: 1-54-0-champions-redesign-responsive
title: '[1.54.0] 챔피언스 전면 개편 — 반응형 단일 (홈·티어·도감·상세·대회)'
description: '챔피언스 13개 라우트(홈·티어·도감·상세 6종·대회 목록/상세)를 UA 분기 데/모 2벌에서 반응형 단일로 재구축. 카드를 DS PokemonCardShell 계열로 통일하고 useDevice를 제거했으며, 상단 서브네비를 반응형 단일 organism으로 교체하고 대회 상세 슬롯 카드의 텍스트 말줄임·넘침을 전면 정리했다.'
authors: [jsg3121, claude]
tags: [feature, ux, css, nextjs]
---

# 1.54.0 — 챔피언스 전면 개편: 반응형 단일 (E그룹 일괄)

> **작업 일자**: 2026-07-21 ~ 2026-07-26
> **작업 브랜치**: `feature/1.54.0-champions-list-redesign`(E-1) · `feature/1.54.0-champions-detail-redesign`(E-2) · `feature/1.54.0-champions-tournaments-redesign`(E-3)
> **설계 근거**: UX-E1 / UX-010 / UX-011 재설계 (ux-designer)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 8호, E그룹 / 최대 규모)
**담당**: jsg3121 + Claude

홈·리스트·상세·습득기술(A)·특성(B)·기술 도감(C)·타입 상성(D)에 이어 챔피언스
13개 라우트를 개편. E그룹은 규모가 커 3배치로 나눠 진행했다.

- **E-1 (목록계열)**: 홈(`[format]`) · 도감(`[format]/list`) · 티어(`[format]/tier`) — PR #188
- **E-2 (상세계열)**: 상세(`[format]/list/[pokemonId]` + 폼 6라우트, `renderChampionsDetail` 단일) — PR #189
- **E-3 (대회계열)**: 대회 목록(`tournaments`) · 대회 상세(`tournaments/[externalId]`)

각 배치는 ux-designer 설계 → HTML 시안 확인·피드백 → 구현 → 로컬 QA의 사이클을
따랐다. changelog는 E그룹 전체 완료 후 일괄 작성한다(사용자 결정).

## 🎯 해결한 문제

- **[Major] 13개 라우트가 UA 분기 데/모 2벌** — SSR이 뷰포트를 모른 채 UA로 화면을
  가르는 구조. 홈 Hero는 `hidden desktop:flex` 이중 DOM으로 마크업이 2벌이었다.
  반응형 단일(ADR-0007)로 통합
- **[Major] 챔피언스 카드 2종이 DS 셸 미소비 + useDevice 의존** —
  ChampionsPokemonCard·ChampionsTopCard가 도감 카드와 셸을 공유하지 않고 useDevice로
  UA 분기. DS PokemonCardShell 계열로 재구성해 셸을 공유하고 useDevice 제거
- **[Major] 상단 서브네비가 데/모 2벌(UA 분기)** — 챔피언스 전 화면이 구버전
  ChampionsSubNav(desktop)/ChampionsSubNavMobile(mobile)을 렌더. 반응형 단일
  organism(TabItem 기반)으로 교체
- **[Major] 페이지 제목이 화면마다 제각각** — 홈·티어·도감이 자체 인라인 헤더를 써
  스타일이 어긋남. 공용 PageHeaderComponent로 통일(중앙정렬)
- **[Critical] 대회 상세 슬롯 카드 텍스트 말줄임·넘침** — 포켓몬 이름·기술명이
  말줄임되고 긴 도구명("리자몽나이트Y")이 카드 밖으로 넘쳐 어떤 빌드인지 알 수
  없던 상태(실캡처 확정). 대회 빌드 페이지의 핵심 정보 손실 → 전면 정리
- **[Major] 챔피언스 다크 배경 위 카드 대비 미약** — 반투명 배경 카드가 흐릿.
  밝은 bg-primary-4 + 어두운 텍스트로 대비 확보

<!-- truncate -->

## ✨ 주요 변경사항

### E-1 — 목록계열(홈·티어·도감)

- **카드 DS 재구성**: ChampionsPokemonCard(도감)·ChampionsTopCard(홈)를 DS
  PokemonCardShell 기반으로 재작성해 도감 카드와 셸 공유, useDevice 제거. 본문은
  종족값·사용률·승률
- **홈 Hero 이중 DOM 제거**: `hidden desktop:flex` 2벌 마크업 → 반응형 단일 ul.
  슬라이드 고정폭 제거
- **도감**: grid-cols-2 desktop:5, sticky 필터바(-mx로 배경 전체폭, 뒤 카드 비침
  방지), 무한스크롤 sentinel을 Footer와 분리
- **티어**: header(진한 배경 카드) → S/A/B/C/D 그룹 → 팀 코어. sm/md/lg/xl 다단을
  2단(모바일 ↔ desktop:)으로 정리
- **제목 통일**: 3화면 모두 공용 PageHeaderComponent(중앙정렬). 챔피언스 고유
  포맷탭+캡션은 신규 ChampionsFormatIntro로 분리(헤더 아래 배치)
- **h1 축약**: "포켓몬 챔피언스 VGC 티어 리스트" → "챔피언스 VGC 티어"(모바일 2줄
  깨짐 해소). 화면 h1 ↔ SEO 메타 title 분리(메타는 긴 키워드 유지)

### E-2 — 상세계열

- **개편 지점 = renderChampionsDetail 단일**(mega/region/gigatamax/form 6라우트 공유).
  UA 분기 제거, 크롬만 UA
- **신규 DS 0건** — 전량 기존 자산 재사용. StatBar(레이더 대체, 라벨 순서 통일),
  신 Tag(구 Tag 교체). ADR-0003 → ADR-0013 대체(완화된 2단 desktop:w-96+flex-1,
  sticky 폐기)
- **다크 배경 대비**: 메타 통합 패널 = 테두리+셸 그림자 1장, 내부 4섹션은
  bg-primary-3/25 배경 블록으로 구분. 반투명 카드의 흐릿함(회귀) 회피

### E-3 — 대회계열

- **대회 목록**: 자체 인라인 헤더 → PageHeaderComponent, 안내 배너를 밝은 톤으로
  통일(다크 배경 위 명도 단차 축소). 월 필터를 sticky 필터바로 승격("총 N건"
  카운트 동반). 대회 데이터는 소량이라 무한스크롤 없이 전량 SSR 로드
- **대회 카드**: 반복되는 "VGC" 텍스트 배지 제거(안내 배너가 이미 선언), 참가자
  수를 대회명 아래로 승격. 홈 "최근 대회" 슬라이드에도 자동 반영
- **대회 상세**: 엔티티 페이지라 PageHeader 대신 진한 배경 정보 카드를 자체 헤더로
  유지. "원본 보기"를 아웃라인 버튼으로 승격(데스크톱 우상단 / 모바일 하단 별도 행)
- **슬롯 카드 텍스트 전면 정리**:
  - 이름·기술명·도구·특성의 말줄임(`line-clamp`/`truncate`) 제거 → 줄바꿈 전체 표시
  - 도구/특성 값에 `min-w-0`를 줘 긴 한글 값이 카드 밖으로 넘치지 않고 줄바꿈되게
    수정(넘침의 근본 원인)
  - 값 폰트를 하한 토큰 `text-2xs`(11px)로 통일, 라벨은 연한 primary-2로 격하해
    위계 정리(강조는 값 `font-bold`)
  - 긴 이름("대검귀 (히스이의 모습)" 등, 7자 초과)은 폰트를 하한까지 축소
    (ChampionsTierPokemonItem 선례)
  - 테라 데이터 없는 슬롯(다수)은 빈 공간을 예약하지 않고 DOM 미렌더

### 공통 — 서브네비 organism 교체

- HeaderContainer(desktop/mobile)의 구버전 ChampionsSubNav/ChampionsSubNavMobile
  호출을 반응형 단일 ChampionsSubNavOrganism 하나로 교체. 챔피언스 전 화면이 동일
  서브네비를 쓰도록 통일(sticky top·z-index 일원화)

## 🎨 인터랙션·레이아웃 정리

- **같은 행 카드 높이 독립**: 대회 상세 Top3 슬롯 그리드와 4~8위 카드 그리드에서
  `auto-rows-fr`를 제거하고 `items-start` 적용 — 한 카드/슬롯을 접거나 펼칠 때 같은
  행의 다른 카드까지 높이가 끌려 늘어나던 이슈 해소
- **크롬 스페이서**: 데스크톱 h-40(헤더 120 + 서브네비 40), sticky 필터바
  desktop:top-40 정합(E-1 도감과 통일)

## ✅ 검증

- `tsc --noEmit` / `eslint`(신규 파일 0건) 통과
- 로컬 시각 검증(모바일 375·데스크톱 1280) — E-3 텍스트/여백 QA 반영 후 사용자 확인

## 🔒 보존 (일괄 제거 트랙)

구버전 데/모 뷰·컨테이너(`views/{desktop,mobile}/champions/**`,
`container/{desktop,mobile}/champions/**`)와 구버전 서브네비 2벌
(`ChampionsSubNav.component`·`ChampionsSubNavMobile.component`), 광고 슬롯은 이번
PR에서 제거하지 않는다 — 다른 구버전과 함께 일괄 제거 트랙에서 정리(전 그룹 동일).

## 📌 참고 사항

- 서브네비 organism 교체는 대회뿐 아니라 챔피언스 전 화면(홈·티어·도감·상세)에
  영향을 준다. 모바일 헤더/서브네비 sticky 겹침은 z-index로 계층을 조정
  (헤더 z-[800] > 서브네비 z-[500])
