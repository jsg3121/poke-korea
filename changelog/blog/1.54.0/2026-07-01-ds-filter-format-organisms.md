---
slug: 1-54-0-ds-filter-format-organisms
title: '[1.54.0] DS organism — 필터 모달·필터 바·포맷 탭 (+ TypeChip 원자)'
description: '서브네비에 이어 데/모 2벌로 분리돼 있던 필터 모달·타입 필터 바를 CSS 반응형 단일 organism으로 통합하고, 포맷 탭을 TabItem(fill) 조립으로 DS 규격화했다. 타입 아이콘 토글은 TypeChip 원자로 신규 규격화(라벨 반응형 노출), 필터 아이콘은 SVGR로 전환해 토큰 색을 상속받게 했다.'
authors: [jsg3121, claude]
tags: [feature, ux, css]
---

# 1.54.0 — DS organism: 필터 모달·필터 바·포맷 탭

> **작업 일자**: 2026-07-01
> **작업 브랜치**: `feature/1.54.0-ds-organisms`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 (organism 조립 + 원자 보강)
**담당**: jsg3121 + Claude

서브네비 organism에 이어, 데/모 2벌로 분리돼 있던 **필터 모달·타입 필터 바**를 CSS 반응형
단일 organism으로 통합하고, **포맷 탭**을 TabItem(fill) 원자 조립으로 DS 규격화했다
(ADR-0007, UA 분기·display:none 없음). 조립에 필요한 타입 아이콘 토글은 **TypeChip 원자**로
먼저 규격화했다(ADR-0010 원자→조립).

## 🎯 작업 목표

`/list`(도감)의 필터 UI는 필터 모달·타입 필터 바가 각각 데스크톱/모바일 2벌로 복제돼
있었고(모달은 크기만 다른 복붙, 바는 레이아웃까지 상이), 챔피언스 포맷 탭은 인라인 알약
스타일(border-2·rounded-full 임의값)이었다. 이를 원자 조립 기반의 반응형 단일로 재구축한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 1. TypeChip 원자 신규 (조립 선행)

```text
src/components/chip/TypeChip.component.tsx / .stories.tsx
src/assets/icons/filter.svg   (신규 — SVGR용)
```

- 포켓몬 18종 타입 아이콘 **선택 토글**(checkbox 시맨틱, 다중 선택). 텍스트 Chip/Tag와
  역할이 달라 별도 원자로 둔다(아이콘 grayscale↔컬러 토글).
- **라벨 노출 반응형 단일**: 모바일 항상 표시, 데스크톱 hover/focus 시에만. 시각 숨김
  상태에서도 라벨 텍스트는 DOM에 유지돼 스크린리더가 항상 읽는다(접근성).
- **hover/focus 시 아이콘 확대**(`group-hover:scale-110`) — 기존 데스크톱 효과 복원.
  잠금(disabled) 항목은 `peer-disabled:scale-100`으로 상쇄.
- **filter.svg를 img → SVGR로 전환**: `stroke="currentColor"`로 부모 텍스트 색(토큰)을
  상속받는다. `<img>`는 SVG 색 제어가 불가하고 별도 요청이 발생한다.

### 2. FilterModal organism

```text
src/components/filter/FilterModal.organism.tsx / .stories.tsx
```

- CloseIconButton·Checkbox·RadioGroup·Button 원자를 조립. 폼 상태(react-hook-form)와
  URL 쿼리 동기화를 organism이 담당.
- **데/모 2벌(크기만 다른 복붙) → 반응형 단일**: 모바일 풀스크린 시트 → 데스크톱 중앙
  카드(28rem). 좁은 화면에서 고정폭 카드가 잘리던 문제를 시트로 해결.
- 딤은 **Portal**로 body 밖(portal-root)에 렌더 — 부모 stacking context·overflow에 종속 안 됨.
- 열림 상태(`open`)·초기값은 호출부가 주입 — organism은 표현·폼만 담당.
- **접근성**: `role="dialog"`·`aria-modal`·`aria-labelledby`, 딤 클릭·Escape 키로 닫기.

### 3. FilterBar organism

```text
src/components/filter/FilterBar.organism.tsx / .stories.tsx
```

- TypeChip(18종)·필터 버튼·초기화 버튼·FilterModal을 조립. 타입 필터 쿼리 동기화를 담당.
- **데/모 2벌(레이아웃 상이) → 반응형 단일**: 모바일 칩 스크롤 줄 + 하단 액션 바 →
  데스크톱 한 줄 정렬.
- 타입은 최대 2개까지 선택(그 이상 미선택 항목 잠금). `getChangeTypeList` 재사용.
- 칩 토글/초기화 시 `router.replace(url, { scroll: false })`로 상단 스크롤 방지.

### 4. ChampionsFormatTab organism

```text
src/components/champions/ChampionsFormatTab.organism.tsx / .stories.tsx
```

- 기존 인라인 알약 Link(border-2·rounded-full 임의값)를 **TabItem(fill) 조립**으로
  DS 규격화. 선택 항목 배경 채움 = fill variant가 정확히 맞는다.
- 기존과 동일 prop(`currentFormat`/`basePath`/`suffix`) 유지 → 교체 시 import만 변경.
  `className` 우회 prop은 제거(DS 규격 유지).

### 5. QuizResultPopup story 추가

```text
src/components/home/QuizResultPopup.stories.tsx
```

- 이미 단일 컴포넌트라 organism 재구축 없이 **story만 추가**(DS 등록). 컴포넌트 미변경.
- Portal(containerId=id) 렌더 위해 story별 고유 id 주입, 열림 상태를 토글로 관리해
  Docs에서도 닫을 수 있게 함.

## 🎨 디자인 변경

- 필터 모달이 모바일에서 풀스크린 시트로 열려 좁은 화면에서도 카드가 잘리지 않는다.
- 타입 필터 칩이 hover/focus 시 확대되고, 데스크톱은 hover 시 라벨이 노출된다.
- 포맷 탭이 DS 규격(TabItem fill)으로 정규화돼 색·모서리·터치 타겟이 일관된다.

## 🔧 기술적 세부사항

**추가된 파일**

- TypeChip 원자(+story), filter.svg(SVGR)
- FilterModal·FilterBar·ChampionsFormatTab organism(각 +story)
- QuizResultPopup story

**설계 원칙**

- 데/모 2벌은 CSS 반응형 단일(`desktop:` 브레이크포인트만, UA 분기 없음, ADR-0007)
- 원자 조립 우선(ADR-0010) — TypeChip을 먼저 만들고 FilterBar 조립
- 등록된 토큰만 사용(임의값 제거), 모바일 퍼스트
- 신규 컴포넌트로만 생성 — 기존 사용처(FilterPokemonType 데/모 2벌, 기존 ChampionsFormatTab
  6곳)는 즉시 교체하지 않는다(페이지 개편 단계)

**검증**: TypeScript 타입 에러 없음, ESLint 통과, `build-storybook` 성공. 코드 리뷰
반영(모달 접근성·스크롤 UX 개선).

## 📌 참고 사항

- **organism도 story를 작성한다** — 라우터 의존은 `@storybook/nextjs` navigation 목킹.
- 필터 라디오 그룹(메가/리전/진화/거다이맥스)은 기존 `RadioGroup`(register + 단일 ref)
  패턴을 그대로 옮겼다. 기존 프로덕션과 동일 동작이며, controlled 전환은 별도 이슈로 둔다.
- 🔴 데/모 2벌 organism(서브네비·FilterModal·FilterBar)이 모두 완료됐다. ModalShell(Shiny
  2곳)은 각 1곳만 사용이라 DS 대상에서 제외(ADR-0010).
