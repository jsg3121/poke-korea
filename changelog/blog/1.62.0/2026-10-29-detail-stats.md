---
slug: detail-stats
title: '상세 능력치 탭 — Lv50 실수치 계산 모듈'
description: '상세 능력치 탭에 보여줄 Lv50 실수치(무투자·최대 투자·최대+상승 성격)를 종족값으로 계산하는 모듈을 추가하고, 외부 공략 사이트 값으로 공식 근거를 교체해 기대값 대조로 검증했다.'
authors: [jsg3121, claude]
tags: [feature]
---

# 상세 능력치 탭 — Lv50 실수치 계산 모듈

> **작업 날짜**: 2026-10-29
> **브랜치**: `feature/1.62.0-detail-stats`

## 📋 작업 개요

**작업 유형**: 기능 추가
**담당**: Claude Code

## 🎯 작업 목표

포켓몬 상세 "능력치" 섹션에 종족값 / Lv50 실수치 탭을 추가한다(SPEC `detail-stats-real-value-tab-spec.md`). 이 단계(9절 2단계)에서는 탭에 표시할 실수치를 종족값으로 계산하는 모듈을 만들고, 외부 실제 값과 대조해 검증한다.

<!-- truncate -->

## 📉 왜 필요했나

GraphQL 응답에는 종족값만 있고 실수치 필드가 없다. 탭에 보여줄 숫자는 프론트에서 공식으로 계산해야 한다.

공식의 근거도 다시 세워야 했다. 2026-10-15판 SPEC은 "챔피언스 게임 화면 역산(망나뇽, 사용자 제공 스크린샷)"을 가장 높은 근거로 두었지만, 그 이미지는 저장소에 남아 있지 않고 사용자도 보유하지 않아 확인할 수 없었다. 기대값의 다른 축이던 한카리아스 표도 SPEC 공식으로 직접 만든 값이라 검산에 그쳤다.

## ✨ 주요 변경사항

### 공식 근거를 외부 공략 사이트 값으로 교체 (SPEC)

| 확인 대상 | 외부 출처 | 결과 |
| --- | --- | --- |
| 한카리아스 최대 + 상승 열 6개 | 본편 공략 사이트 2곳(AppMedia SV, Gamerch SV) | 일치 |
| 한카리아스 스피드 3열(122/154/169) | 챔피언스 공략 사이트(AppMedia) | 일치 |
| 메가한카리아스Z 실전 배분 H185(2) A135↓ B105 C193(32) D105 S223↑(32) | GameWith 챔피언스 대미지표 | 로컬 DB 종족값으로 6개 모두 일치 |
| 껍질몬 HP 1 고정 | Pokémon Wiki, PokéBase | 일치 |

표의 세 조건(무투자 / 최대 투자 / 최대 + 상승)과 HP, 껍질몬 예외가 모두 외부 값으로 확인됐다. 출처를 확인할 수 없는 망나뇽 행은 SPEC 3-6에서 지우고 정정 기록을 남겼다.

### 계산 모듈 `containers/detail/modules/statRealValue.module.ts`

사용처가 `DetailStats` 하나라 detail 도메인 로컬 `modules/`에 뒀다. 게임 규칙을 아는 함수라 `utils/`가 아니라 `modules/`다.

```ts
getRealHp(base, investment)            // HP — 종족값 HP 1이면 1 고정
getRealStat(base, investment, nature)  // HP 외 — nature: 'up' | 'neutral' | 'down'
getRealStatTable(stats)                // 탭 표 — 능력치별 { noInvestment, maxInvestment, maxBoosted }
```

- 표 함수는 능력치 키 객체를 돌려준다. 행 순서는 탭 UI(3단계)에서 정한다.
- 성격 보정은 `floor((값 × 11) / 10)`처럼 정수 연산 후 한 번만 내린다.
- `PokemonStats`는 `import type`으로 가져온다. 기대값 대조 스크립트를 Node로 직접 실행하기 위해서다(`testing.md`).

### 시안 확정 (SPEC 4-6)

ux-designer 설계와 ui-publisher 시안을 거쳐 화면을 확정했다. 주요 결정은 다음과 같다.

- 탭 패턴 대신 **토글 버튼**(`aria-pressed`). WCAG 2.1.1은 버튼으로 충족되고, 화살표 키 이동은 APG 권고라 범위 대비 이득이 작다. 키보드 처리 위치 결정(C-6)도 함께 사라졌다.
- 막대는 **`translateX` keyframe**(GPU 합성), 숫자는 **전환 시 카운트업**. `scaleX`는 둥근 끝이 눌리고, `clip-path`는 GPU 경로가 보장되지 않아 기각했다.
- 데스크톱 실수치는 표 칸 안에 숫자와 막대를 함께 그리고, 열마다 최고/최저 색을 쓴다. 색 의미는 범례로 안내한다.

### SegmentedControl — 밝은 배경용 토글 DS (`components/segmentedControl/`)

카드(`bg-primary-4`) 안의 전환 버튼이다. `TabItem` fill은 남색 배경용이라 활성 채움(`bg-primary-4`)과 포커스 링이 카드 배경과 같은 색이 되어 보이지 않는다. `TabItem`은 그대로 두고 새 DS 원자를 만들었다.

```tsx
<SegmentedControl
  label="능력치 보기 방식"
  items={[{ key: 'base', label: '종족값' }, { key: 'real', label: 'Lv50 실수치' }]}
  value={view}
  onChange={setView}
/>
```

- `role="group"` + 버튼 `aria-pressed`. 키 타입은 제네릭으로 받는다.
- 트랙 `bg-primary-1/10 p-1`, 모서리 16px(데스크톱 24px). 버튼 모서리는 트랙 − 4px라 12px(데스크톱 20px)이다.
- 20px 모서리가 Tailwind 기본 토큰에 없어 `tailwind.config.js`에 `borderRadius['2.5xl']`(1.25rem)을 추가했다(styling.md 임의값 금지).
- Storybook story에 첫 항목 선택·두 번째 항목 선택·직접 전환 3종을 등록했다.

### 하네스

- ADR-0024 결과 절에 Node 실행 확인 결과를 추가했다.
- `testing.md`에 기대값 대조 스크립트 실행 방법과 별칭 제약을 적었다.

## 🔍 검증

- `tsc --noEmit`, ESLint, Prettier: 통과
- 기대값 대조(Node 22, 임시 스크립트 실행 후 삭제):
  - 한카리아스 표 18칸: PASS
  - 메가한카리아스Z 실전 배분 6개: PASS
  - 껍질몬 HP 3열 모두 1: PASS
- 화면 반영은 3단계(탭 UI)에서 한다. 이 단계에서는 모듈을 호출하는 곳이 없다.
