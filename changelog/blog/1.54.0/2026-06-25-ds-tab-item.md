---
slug: 1-54-0-ds-tab-item
title: '[1.54.0] DS 원자 — TabItem (밑줄/채움 variant, 모바일 24px 터치)'
description: '탭 항목 하나를 active 상태를 가진 DS 원자로 신규 규격화. underline(네비)·fill(컨텐츠) variant, href 유무로 Link/button 자동 분기. 모바일 탭 터치 타겟을 24px(WCAG 2.2 AA)로 완화하고 데스크톱 44px 유지(ADR-0011). 등록 토큰만 사용한 모바일 퍼스트 구현.'
authors: [jsg3121, claude]
tags: [feature, ux, css]
---

# 1.54.0 — DS 원자: TabItem

> **작업 일자**: 2026-06-25
> **작업 브랜치**: `feature/1.54.0-atomic-components-plan`

## 📋 작업 개요

**작업 유형**: 디자인 시스템 (원자 컴포넌트 신규 구축)
**담당**: jsg3121 + Claude

[ADR-0010](../../../.claude/decisions/records/ADR-0010-atomic-first-ds-build-order.md)
원자 우선 DS 구축의 라운드 1 #3. 코드베이스의 탭 UI를 전수 조사한 뒤, "탭 항목 하나"를
`active`(선택됨) 상태를 가진 **신규 DS 원자**로 규격화했다.

## 🎯 작업 목표

코드베이스에는 탭이 6곳에 제각각 구현돼 있었다(포맷 탭, 상단 서브네비 데/모 2벌, 메타 탭,
폼 탭 등). 모서리·패딩·배경·active 표시·hover가 전부 불통일이고, 모바일 상단 서브네비는
4개 항목을 화면 폭에 균등분할하다 라벨이 줄바꿈돼 글자가 깨졌다.

이들을 직접 추출·통합하지 않고, 서비스 UI를 고려해 **탭 항목 원자를 새로 디자인**한다.
버튼과 분리하는 이유는 탭이 버튼에 없는 `active` 의미축을 갖기 때문이다.

<!-- truncate -->

## ✨ 주요 변경사항

### 1. TabItem 원자 신규 (Button 선례 3파일 구조)

```text
src/components/tab/
├── tabItemStyle.ts        # variant × active 클래스 조합 함수
├── TabItem.component.tsx  # Link/button 모드 자동 분기 + aria 시맨틱
└── TabItem.stories.tsx    # variant × active × 모드 전부 렌더
```

### 2. variant 2종 + 공통 active

| variant | 용도 | active 표현 | inactive |
|---------|------|-------------|----------|
| `underline` | 네비게이션 | `text-primary-4` + 하단 밑줄(`border-primary-4`) | `text-primary-3` + 투명 밑줄 |
| `fill` | 컨텐츠 전환 | `bg-primary-4 text-primary-1`(반전) | 투명 + `text-primary-3` |

색은 등록된 토큰(`primary-1~4`)만 사용한다. amber 등 비토큰 색·임의값 없음.

### 3. 모드 자동 분기 (href 유무)

- `href` 있음 → 이동 탭(`next/link`), active면 `aria-current="page"`
- `href` 없음 → 상태 전환 탭(`<button>`), `role="tab"` + `aria-selected`

### 4. 모바일 24px 터치 타겟 완화 (ADR-0011)

채움형 알약이 모바일에서 부피가 커 보이는 문제를 해결하기 위해, 탭 높이를 모바일 퍼스트로
차등했다.

**변경 전**:

```ts
min-h-touch // 44px 고정
```

**변경 후**:

```ts
min-h-touch-tab desktop:min-h-touch // 모바일 24px, 데스크톱 44px
```

`touch-tab`(24px) 토큰을 신설했다. 24px은 [WCAG 2.2 2.5.8(AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
최소 기준으로, "항목 중심 간격 24px 이상 확보"가 전제다(조립 단계 책임). 데스크톱은 기존
44px을 유지한다.

### 5. fill 모바일 퍼스트 차등

```ts
// base(모바일)              desktop:
px-3 text-xs rounded-xl  →  px-4 text-sm rounded-2xl
```

캡슐(`rounded-full`) 대신 모서리만 둥근 형태로, 모바일 12px → 데스크톱 16px 반경.

## 🎨 디자인 변경

- 레이아웃 시프트 방지: `underline`은 active에서 밑줄을 "추가"하지 않고 항상 `border-b-2`를
  깔아 색만 토글한다. `font-bold`도 쓰지 않는다.
- 글자 깨짐 차단: `whitespace-nowrap` 내장으로 좁은 폭에서 라벨이 줄바꿈되지 않는다.

## 🔧 기술적 세부사항

**추가된 파일**

- `src/components/tab/tabItemStyle.ts`
- `src/components/tab/TabItem.component.tsx`
- `src/components/tab/TabItem.stories.tsx`
- `.claude/decisions/records/ADR-0011-tab-touch-target-24px.md`

**수정된 파일**

- `tailwind.config.js` — `touch-tab`(24px) 토큰 추가
- `.claude/conventions/guides/styling.md` — 터치 타겟 규칙에 모바일 탭 예외 명시

**검증**: TypeScript 타입 에러 없음, ESLint 통과.

## 📌 참고 사항

- 이 원자는 "탭 항목 하나"다. 네비게이션 바(organism)·컨텐츠 탭(molecule)은 이 원자를
  배열로 조립하는 후속 작업(페이지 개편 2단계)에서 만든다.
- **조립 시 주의**: 모바일에서 항목 간격(gap)을 24px 이상 둬야 WCAG 2.5.8 spacing 예외를
  만족한다. 간격이 좁으면 24px 높이가 접근성 위반이 된다(ADR-0011).
- 모바일 상단 서브네비의 균등분할(글자 깨짐) 문제는 조립 단계에서 가로 스크롤 + 자연폭으로
  해결할 예정이다(UX 설계 완료).
