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

### StatBar 전환 재생 — `replayKey` prop, `useReplayProgress` 훅

종족값 패널로 돌아올 때 막대와 숫자를 다시 재생한다. 기존 `useEnterViewProgress`는 "화면에 처음 들어올 때 한 번" 재생하는 훅이라 고치지 않고, 재생 신호용 훅을 따로 만들었다. 3단계 실수치 표의 카운트업도 이 훅을 쓴다.

```tsx
<StatBar stats={stats} replayKey={replayKey} /> // 0(기본)이면 현행과 같음
```

- **숫자**: `replayKey`가 바뀌면 `useReplayProgress`가 진행률을 0 → 1로 600ms(`easeOutCubic`) 재생한다. 새 키를 받은 첫 렌더에서 바로 0을 돌려줘, 최종 숫자가 한 프레임 보였다가 0으로 떨어지는 깜빡임이 없다.
- **막대**: 폭은 그대로 두고 채움 요소에 `motion-safe:animate-bar-slide-in`(`translateX(-100%) → 0`)을 붙인다. 패널이 `hidden`에서 다시 보일 때 CSS가 처음부터 재생한다. 곡선 `cubic-bezier(0.33, 1, 0.68, 1)`은 `easeOutCubic`과 같아 숫자와 속도가 맞는다.
- **움직임 줄이기**: 훅은 즉시 1을 돌려주고, 막대 클래스는 `motion-safe:`라 붙지 않는다.
- **챔피언스 상세**: `replayKey`를 넘기지 않아 동작이 바뀌지 않는다.

### StatBar 데스크톱 총합 행 여백 제거

"종족값 총합" 행 아래 여백(`pb-3`)을 데스크톱에서 없앴다(`desktop:pb-0`). 기본값 변경이라 챔피언스 상세에도 적용된다.

### 실수치 표 — `DetailRealStatTable`, `DetailHpNatureTip`

사용처가 `DetailStats` 하나라 부모 옆(`containers/detail/`)에 뒀다.

- **표**: `<table>` 하나를 모바일·데스크톱이 같이 쓴다. `caption`(sr-only), `th scope="col"`·`scope="row"`, 범례는 `aria-describedby`로 연결한다. 행 순서·라벨은 `StatBar`와 같다(체력·공격·특수공격·방어·특수방어·스피드).
- **숫자**: `StatBarAnimatedValue` + `useReplayProgress`로 전환 시 카운트업한다. 서버 HTML에는 최종값이 들어간다.
- **데스크톱 칸**: 숫자(왼쪽 정렬, 머리글 시작선과 맞춤) + 막대. 막대 기준은 표 안 최댓값 + 20, 색은 1·2열 `primary-2`, 3열 `primary-1`, 열별 최고 `type-grass`·최저 `damage-physical`. 색 의미는 범례에 적고(데스크톱만), 칸마다 `sr-only` "(최고)"/"(최저)"를 둔다.
- **머리글**: "종족값 총합" 라벨과 같은 글자 스타일. 머리글 칸을 총합 숫자와 같은 글자 크기·줄높이로 두어 글자 아랫선과 첫 행 위치를 종족값 패널과 맞췄다. 모바일 3열은 "최대 투자"를 칸 위로 올려 2줄로 보여 준다.
- **HP 토글팁**: 체력 행 3열의 ⓘ 버튼. 클릭·Enter·Space로 열고, 재클릭·Esc·바깥 클릭·포커스 이탈로 닫는다(기존 `useOutSideClick` 재사용). 문구는 `aria-describedby`로 버튼에 연결해 닫혀 있어도 스크린리더가 읽는다.
- **모듈 추가**: `getRealStatColumnExtremes`(열별 최댓값·최솟값), `getRealStatBarMax`(막대 기준값). 기대값 대조 — 한카리아스 열별 183/100·215/132·215/145, 기준값 235: PASS.

### SegmentedControl 핸들러 정리

목록 버튼에 `onClick={() => onChange(item.key)}`로 props 콜백을 JSX 화살표 함수에 바로 넘기고 있었다(coding.md 이벤트 핸들러 규칙 위반). 버튼 `value`에 키를 담고 이름 있는 핸들러 하나에서 `items`로 찾아 호출하도록 고쳤다.

### DetailStats 조립 — 전환·초기화·GA4 이벤트

```tsx
<SegmentedControl label="능력치 보기 방식" items={VIEW_ITEMS} value={current.view} onChange={handleChangeView} />
<div hidden={current.view !== 'base'}><StatBar … replayKey={current.baseReplayKey} /></div>
<div hidden={current.view !== 'real'}><DetailRealStatTable … replayKey={current.realReplayKey} /></div>
```

- 두 패널을 항상 렌더하고 `hidden` 속성으로만 전환한다. `hidden` 래퍼에는 display 클래스를 붙이지 않는다. URL은 바꾸지 않는다.
- 재생 신호는 패널마다 따로 둔다. 종족값으로 전환하면 `baseReplayKey`, 실수치로 전환하면 `realReplayKey`가 1 오른다.
- **폼 이동 시 초기화**: `/mega/0` → `/mega/1`처럼 같은 page 안의 이동은 컴포넌트가 다시 마운트되지 않는다. 상태에 폼 키(`activeType-activeIndex`)를 함께 저장하고, 현재 폼 키와 다르면 초기 상태(종족값)로 보는 파생값을 쓴다. `useEffect` 리셋이나 `key` 재마운트보다 단순하고 깜빡임이 없다.
- **`stats_tab_status`**: 활성 패널이 실제로 바뀔 때만 보낸다(같은 버튼 재클릭·초기 렌더·폼 이동 초기화는 제외). `form_type`은 기본 경로와 폼체인지 경로가 모두 `activeType: 'normal'`이라 `usePathname()`의 `form` 세그먼트로 나눈다(`utils/statsFormType.util.ts`).

### 브라우저 확인 피드백 반영

| 문제 | 원인 | 수정 |
| --- | --- | --- |
| 머리글 아래 구분선이 안 보임 | `globals.css` 리셋이 `th`에 `border: 0`을 줘 테두리 스타일이 `none`. `border-b`는 두께만 지정한다(측정값 `0px none`) | 머리글 칸에 `border-solid` 추가 |
| 모바일 "최대 투자"가 전환 버튼에 가려 잘림 | 칸 위로 올린 첫 줄이 머리글 줄높이 28px를 써 버튼 영역과 12px 겹침 | 첫 줄 `leading-4`, 모바일 전환 버튼 아래 간격 16 → 24px(`mb-6`). 두 패널이 같이 내려가 첫 행 정렬은 유지 |
| 툴팁이 아이콘에서 멂 | 말풍선이 터치 영역(44·32px) 아래 끝에 붙음 | 모바일 `-mt-2`, 데스크톱 `mt-0` |
| 데스크톱 툴팁이 다음 행 막대 뒤로 감 | 툴팁을 감싼 요소의 `transform`(세로 가운데 정렬)이 쌓임 맥락을 만들어, 안쪽 `z-10`이 바깥에서 효과가 없음 | 감싼 요소에 `z-10` |
| 범례 문구 | — | "열별 최고/최저" → "최고/최저" |
| 모바일에서 어느 열이 어떤 케이스인지 구분이 안 됨 | 오른쪽 정렬된 머리글이 좁게 붙고 구분선이 한 줄로 이어져, "최대 투자" 옆 "+ 상승 성격"이 2열 설명처럼 읽힘 | 모바일은 머리글마다 밑줄을 따로 긋고 열 사이를 12px 띄움(데스크톱은 한 줄 유지). 3열 폭 96 → 112px. 짧은 머리글 + 범례, 3열 배경 띠 안과 비교해 선택 |
| 머리글 마크업이 중첩되고 밑줄·두 줄 간격이 벌어짐 | "종족값 총합" 라벨과 글자 높이를 맞추려고 머리글 칸을 큰 글자(18px, 줄높이 28px)로 두고 작은 글자 `span`을 넣어, 줄 상자가 커지고 두 줄은 `absolute`로 띄워야 했다 | 글자 스타일·밑줄을 `th`에 직접 두고(모바일 밑줄은 `::after`), 두 줄은 `<br className="desktop:hidden" />`로 만든다. 감싸는 `span` 2겹과 `absolute`를 없앴다. 아래 정렬 + 여백 8px로 첫 행 위치는 그대로 맞춘다. 숫자 칸의 폭 지정 `span`도 없애고 클래스를 `StatBarAnimatedValue`에 직접 넘겼다 |

### 하네스

- ADR-0024 결과 절에 Node 실행 확인 결과를 추가했다.
- `testing.md`에 기대값 대조 스크립트 실행 방법과 별칭 제약을 적었다.

## 🔍 검증

- `tsc --noEmit`, ESLint, Prettier: 통과
- 기대값 대조(Node 22, 임시 스크립트 실행 후 삭제):
  - 한카리아스 표 18칸: PASS
  - 메가한카리아스Z 실전 배분 6개: PASS
  - 껍질몬 HP 3열 모두 1: PASS
- 서버 HTML(`curl`, 개발 서버): 7개 경로 모두 200이고, 능력치 섹션에 두 패널의 최종 숫자·머리글·범례·토글팁 문구가 모두 들어 있다. 카운트업 전 값(0)이 아니라 최종값이 렌더된다.

  | 경로 | 확인한 점 |
  | --- | --- |
  | `/detail/445` | 한카리아스 표 18칸이 기대값과 같음, 열별 최고 체력·최저 특수공격 |
  | `/detail/445/mega`, `/mega/1` | 메가진화 종족값으로 계산. 메가한카리아스Z는 3열 최고가 스피드(223)로 다른 열과 다름 |
  | `/detail/292` | 껍질몬 체력 세 열 모두 1 |
  | `/detail/6/gigantamax`, `/detail/26/region`, `/detail/479/form/1` | 거다이맥스·리전폼·폼체인지 경로 모두 렌더 |

- 화면(모바일·데스크톱 레이아웃, 전환 애니메이션, 토글팁 동작)은 사용자가 브라우저에서 직접 확인한다.
