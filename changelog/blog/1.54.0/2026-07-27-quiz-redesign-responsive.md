---
slug: 1-54-0-quiz-redesign-responsive
title: '[1.54.0] 퀴즈 페이지 개편 — 반응형 단일 + 결과 세로 카드 통일'
description: '/quiz 5개 라우트(허브 + 실루엣·특성·타입·타입상성)를 UA 분기 데/모 2벌에서 반응형 단일로 재구축. 결과 정답 목록의 desktop 가로 스크롤 테이블을 4종 공통 세로 카드로 통일하고, 진행바·임의색을 primary 토큰으로 정규화하며, 클릭 영역이 보이지 않던 이미지 옵션 배경 누락 버그를 수정했다.'
authors: [jsg3121, claude]
tags: [feature, ux, css, bug-fix]
---

# 1.54.0 — 퀴즈 페이지 개편: 반응형 단일 + 결과 세로 카드 통일

> **작업 일자**: 2026-07-27
> **작업 브랜치**: `feature/1.54.0-quiz-redesign`
> **설계 근거**: UX-012 재설계 (ux-designer)

## 📋 작업 개요

**작업 유형**: 페이지 전면 재구성 (2단계 — 페이지 단위 재구성 F그룹, 마지막 미개편 그룹)
**담당**: jsg3121 + Claude

홈·리스트·상세·습득기술(A)·특성(B)·기술 도감(C)·타입 상성(D)·챔피언스(E)에
이어 퀴즈 5개 라우트를 개편. UX-012 설계 → HTML 시안 확인·피드백(허브 CTA 강조
3안 비교 → "밝은 카드 유지 + 채운 버튼 승격" 확정) → 구현 → 실제 렌더 검증의
사이클을 따랐다.

퀴즈는 목록/상세형이 아니라 "시작 전(BEFORE) → 진행(QUIZ) → 결과(RESULT)"의
단계형 인터랙션이 핵심이라, 설계 축이 **result 정답 목록의 반응형 통일**과
**진행/옵션 UI의 접근성**에 있었다.

## 🎯 해결한 문제

- **[Major] 결과 정답 목록이 퀴즈·디바이스별로 4가지 다른 DOM** — 실루엣·타입은
  desktop 가로 스크롤 테이블(sticky 열), 모바일 세로 카드로 완전히 다른 마크업.
  같은 "정답 확인" 기능이 퀴즈마다 다른 조작(가로 스크롤 유무)을 요구했다.
  4종 전부 세로 카드(`QuizResultCard`)로 통일, desktop은 2열 그리드로 배치
- **[Critical] 포켓몬 타입 모바일 옵션 배경 누락** — 옵션 버튼에 배경 클래스가
  빠져 이미지+텍스트만 페이지 배경 위에 떠 클릭 영역(히트박스)을 인지할 수 없었다.
  `QuizOptionButton`이 두 variant 모두 배경(primary-3)을 항상 부여
- **[Critical] 옵션 버튼 focus-visible 스타일 부재** — 키보드 Tab 이동 시 현재
  포커스 위치를 알 수 없었다(WCAG 2.4.7). focus-visible 링 추가
- **[Major] UA 분기 데/모 2벌(약 55파일) + 진행바·임의색 도배** — 반응형 단일
  통합. 진행바 `bg-purple-600`·시간 `text-purple-600`·`text-gray-*` 등 사이트
  색 체계와 무관한 임의색을 primary 토큰으로 정규화
- **[Major] 포켓몬 타입 결과 오답 식별 곤란** — 오답 포켓몬을 grayscale 이미지로만
  표시(이름 미병기)해 무엇을 골랐는지 재확인이 어려웠다. 정답/나의 답에 포켓몬
  이름 텍스트 병기
- **[Minor] 결과 요약 레이아웃 이원화** — desktop flex / mobile grid로 유지보수 시
  두 곳을 조정해야 했다. 단일 grid(모바일 2×2 / desktop 1×4)로 통일
- **[Minor] "다른 퀴즈" 링크 문구 불일치** — desktop "다른 퀴즈도 도전해보세요" /
  mobile "다른 퀴즈 하러 가기"로 달랐다. 문구 통일

<!-- truncate -->

## ✨ 주요 변경사항

### 공용 컴포넌트 — 데/모 2벌 통합 + 신규 DS

`src/components/quiz/`에 반응형 단일 공용 컴포넌트 9종을 구축:

- **통합 7종**(desktop/mobile 2벌 → 1벌): `QuizHeader`(진행바·시간 토큰화),
  `QuizSkipButton`, `GuideStartButton`, `ResultHeader`, `ResultSummary`(단일 grid
  재설계), `ResultFooter`, `OtherQuizLink`(문구 통일)
- **신규 2종**: `QuizOptionButton`(text/image variant, 배경 항상 부여 +
  focus-visible), `QuizResultCard`(4종 공통 정답 카드 셸 — 좌측 강조선 정답/오답 +
  헤더 #N + 본문 슬롯 + 정답/나의 답 2열 비교)

### 버튼 — DS Button/LinkButton 교체

- "시작하기"(`GuideStartButton`) → DS `Button`(secondary/lg/fullWidth)
- "다시 도전하기" → DS `Button`, 관련 페이지 이동 → DS `LinkButton`
- 각 버튼의 커스텀 색·`rounded-[20px]`·`h-[4rem]` 임의값 제거, focus-visible 내장

### 타입칩 — 신규 DS Tag 교체

- 포켓몬 타입·타입 상성 퀴즈의 타입 배지를 구 `Tag.component`(globals.css의
  `.type-tag` 의존) → 신규 `tag/Tag.component`(토큰 기반)로 교체. 도감·상세·챔피언스
  등 다른 개편 도메인과 시각 언어 통일

### 허브(/quiz) — CTA 카드 강조

- 각 퀴즈 카드 하단 "시작하기"를 우측 작은 텍스트 링크 → primary-1 채운
  full-width 버튼(시각)으로 승격. 카드 전체가 Link이므로 버튼은 시각 요소(중첩 링크
  방지)

### 페이지 크롬 — page.tsx UA 분기만 유지

- 5개 `page.tsx`의 UA 분기를 걷어내고 본문은 반응형 단일 View 호출.
  헤더/푸터/탭바 크롬만 UA 분기로 렌더(champions·ability 개편과 동일 패턴).
  Context(상태·타이머·데이터 로직)는 device 무관하게 그대로 재사용

### 모바일 조정 (사용자 피드백)

- 옵션 그리드 4종 전부 모바일도 2×2(`grid-cols-2`)
- 선택지 텍스트 `text-sm`(14px, desktop text-base) / 텍스트 버튼 높이
  `min-h-touch`(44px, desktop 48px)로 축소
- 실루엣·포켓몬 타입 이미지 모바일 축소(정석 wrapper 패턴으로 figure↔img 크기
  일치, 좌상단 쏠림 해소)

## 🔧 기술적 세부사항

- **신규**: `src/components/quiz/`(9), `src/views/quiz/`(17 — 허브 + 4퀴즈 ×
  {view, before, play, result})
- **수정**: `src/app/quiz/**/page.tsx`(5)
- 광고 배너는 champions·ability 선례대로 제거 후 보류(반응형 광고 유닛 재도입 공통
  트랙)
- 구버전 `src/views/{desktop,mobile}/quiz`·`src/container/desktop/quiz`는 참조 0건
  (dead)이나 champions·moves 선례대로 일괄 제거 트랙으로 남김

## 📌 참고 사항

- 정답/오답 색은 기존과 동일하게 `green-700`/`red-700`(관습적 신호색, 흰 배경 대비
  AA 통과) 유지. primary 무드와 별개인 신호색이라 토큰화는 별도 판단
- Context/GraphQL/타이머/카운트다운 모달은 수정 없이 재사용 — 뷰 레이어만 개편
