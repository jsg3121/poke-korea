---
slug: 1-54-0-ds-round3-atoms
title: '[1.54.0] DS 원자 라운드3 — Ball·Radio·Checkbox·PageHeader'
description: '원자 전수 재점검으로 누락된 원자 4종을 DS로 구축. 포켓볼 그래픽(Ball)에 size 추가해 브랜드 자산화, Radio·Checkbox 최적화(useId·모션·모서리 개선), PageHeader 데/모 2벌을 CSS 반응형 단일 신규 컴포넌트로 통합. 컴포넌트별 폴더로 구조화.'
authors: [jsg3121, claude]
tags: [feature, ux, css]
---

# 1.54.0 — DS 원자 라운드3: 폼 컨트롤·표시 원자

> **작업 일자**: 2026-06-30
> **작업 브랜치**: `feature/1.54.0-ds-round3-atoms`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 (원자 컴포넌트 신규/보강)
**담당**: jsg3121 + Claude

라운드1·2 후 organism 조립으로 넘어가기 전 **원자 전수 재점검**을 했더니, 폼 컨트롤
(Radio·Checkbox)과 PageHeader가 누락돼 있었다(story 없음 / 데·모 2벌 / 임의값). organism이
이 원자에 의존하므로 조립 전에 먼저 채운다(ADR-0010 원자→조립 순서).

## 🎯 작업 목표

라운드1·2가 버튼·입력·탭·칩 위주여서 폼 컨트롤이 빠졌다. "이미 완성됐다"고 본 Radio/
Checkbox는 실제로 story 없음 + 임의값 잔존, PageHeader는 데/모 2벌이었다. 핵심 4개만
ADR-0010 기준(2곳 이상 + 자명)으로 구축한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 1. Ball (포켓볼 그래픽 — 브랜드 자산)

```text
components/ball/Ball.component.tsx + Ball.stories.tsx
```

- 카드 7곳 + Radio/Checkbox에서 쓰이는 포켓몬 서비스 **브랜드 자산**. story로 등재.
- `size` 추가(추가 prop 없이 각 size에 반응형 내장): `lg`(24→32px) / `md`(20→24px) /
  `sm`(16px) / 없으면 부모맞춤(`w-full h-full`).
- 포켓볼 색은 **토큰화하지 않음** — 단일 그래픽 전용이라 공유되지 않으므로(전역 토큰 오염 방지).
- size optional이라 기존 9곳(`<Ball />` 부모맞춤) 그대로 동작.

### 2. Radio / Checkbox (폼 컨트롤 최적화)

```text
components/radio/Radio.component.tsx + Radio.stories.tsx
components/checkbox/Checkbox.component.tsx + Checkbox.stories.tsx
```

- `useId()`로 id 자동 생성 — 기존 `name__value` 문자열 조합의 충돌 위험 제거.
- 임의값 정규화: `w-[1.2rem]`→`w-5`, `rounded-[0.3rem]`→`rounded`, `text-black/35`→`text-primary-2` 등.
- **모션 개선**: 선택 해제 시 빈 원/박스가 부풀던 문제 수정 — 빈 원/박스는 고정하고
  포켓볼만 scale로 등장/퇴장.
- **Checkbox 모서리 개선**: 사각 박스가 원형 포켓볼 뒤로 비치던 문제 — 체크 시 박스를
  페이드아웃(opacity-0, 크기 유지).
- label 전체가 클릭 영역(텍스트 클릭으로도 토글).

### 3. PageHeader (데/모 2벌 → 반응형 단일 신규)

```text
components/pageHeader/PageHeader.component.tsx + PageHeader.stories.tsx
```

- 데/모 2벌(`PageHeader.tsx` + `mobile/PageHeader.tsx`)을 **CSS 반응형 단일 신규
  컴포넌트**로 만든다(UA 분기·display:none 없음, ADR-0007).
- 모바일 퍼스트: 제목 `text-3xl desktop:text-4xl`, 설명 `text-sm desktop:text-base`.
  임의값(`text-[2.5rem]` 등) 제거, gutter는 부모 책임(`w-full`).
- **기존 2벌은 건드리지 않는다** — 신규 컴포넌트만 만들고, 교체·삭제는 페이지 개편 단계에서
  ([ds-build-new-components] 원칙).

## 🔧 기술적 세부사항

**추가/이동된 파일** (컴포넌트별 폴더, A안)

- `components/ball/` (Ball + stories) — 기존 `Ball.component.tsx` 이동
- `components/radio/` (Radio + stories) — 이동 + 재작성
- `components/checkbox/` (Checkbox + stories) — 이동 + 재작성
- `components/pageHeader/` (PageHeader + stories) — 신규

폴더 이동에 따라 import 경로를 `~/components/{폴더}/...` 절대 별칭으로 정리(Ball 9곳,
Radio/Checkbox 사용처, RadioGroup).

**검증**: TypeScript 타입 에러 없음(기존 사용처 포함), ESLint 통과.

## 📌 참고 사항

- 1곳에서만 쓰이는 컴포넌트(Indicator·Form 버튼·Shiny 버튼·Quiz 버튼 등)는 DS화하지 않고
  해당 컨테이너 폴더의 `components/`에서 로컬 관리한다(추측 선제작 금지, ADR-0010).
- 구 `Tag.component.tsx`(31곳 사용, WCAG 대비 미달)는 신규 `tag/Tag`로 교체해야 하나,
  마이그레이션·삭제는 **페이지 UI 전면 개편 단계**에서 수행한다.
- 기존 PageHeader 2벌, Radio/Checkbox 기존 사용처는 즉시 교체하지 않는다(페이지 개편 단계).
- 이로써 원자 DS 구축(라운드1·2·3)이 마무리되고, 다음은 organism 조립 단계다.
