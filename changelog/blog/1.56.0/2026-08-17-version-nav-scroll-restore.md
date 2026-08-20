---
slug: version-nav-scroll-restore
title: '버전 선택 nav 가로 스크롤이 끊기던 문제 해결'
description: '버전 칩을 눌러 이동할 때 가로 스크롤이 매번 맨 앞에서 다시 시작하던 문제를, 스크롤 위치를 보존해 이어붙이는 방식으로 해결했습니다. 동작 줄이기 설정도 함께 반영했습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, ux, css]
---

# 버전 선택 nav 가로 스크롤이 끊기던 문제 해결

> **작업 날짜**: 2026-08-17
> **브랜치**: `feature/1.56.0-version-nav-scroll`

## 📋 작업 개요

**작업 유형**: 버그 수정 / UX 개선 / 접근성
**담당**: jsg3121, claude

## 🎯 작업 목표

습득 기술 페이지와 기술 상세의 버전 선택 nav에서, 버전 칩을 눌러 이동할 때 가로 스크롤이 어색하게 움직이는 문제를 해결한다.

<!-- truncate -->

## 🐛 문제 상황

증상은 세 단계로 드러났다.

| # | 증상 |
| ------ | ------ |
| 1 | 어떤 칩을 눌러도 활성 칩이 항상 맨 왼쪽으로 재정렬된다 |
| 2 | 정렬 기준을 바꾸자 칩이 오른쪽 모서리에 붙어, 뒤에 남은 버전이 안 보인다 |
| 3 | 스크롤을 50%쯤 민 상태에서 마지막 칩을 누르면, 그 자리에서 조금 움직이는 게 아니라 **맨 앞(0%)에서부터 다시 스크롤된다** |

3번이 문제의 본질이었다.

### 원인: 재마운트로 스크롤 위치가 사라진다

버전은 URL 경로 세그먼트(`/version/[versionGroupId]`)로 구분된다. 칩을 누르면 라우트가 바뀌면서 이 클라이언트 컴포넌트가 **새로 마운트**되고, 새로 만들어진 스크롤 컨테이너의 `scrollLeft`는 **항상 0**이다. 사용자가 손으로 밀어둔 위치는 이전 DOM 노드와 함께 사라진다.

그 결과 마운트 시 실행되는 스크롤 보정이 "스크롤 0" 기준으로 가시성을 판정하게 되고, 이미 보이던 칩까지 시야 밖으로 오판해 매번 맨 앞에서 출발하는 애니메이션을 만들었다.

```tsx
// 변경 전 — 마운트 시 무조건 호출, 기준이 되는 scrollLeft는 0
useEffect(() => {
  const active = scrollRef.current?.querySelector('[data-active="true"]')
  active?.scrollIntoView({ inline: 'start', block: 'nearest', behavior: 'smooth' })
}, [])
```

## ✨ 주요 변경사항

### 변경 1: 스크롤 위치를 보존해 이어붙인다

재마운트를 전제로 두고, `sessionStorage`에 위치를 저장했다가 복원한다. **순서가 핵심**이다 — 복원이 가시성 판정보다 먼저 와야 판정이 올바른 기준을 갖는다.

```tsx
// 1) 이전 인스턴스가 남긴 위치를 즉시 되돌린다(애니메이션 없음)
if (key) {
  const saved = Number(sessionStorage.getItem(key))
  if (Number.isFinite(saved) && saved > 0) list.scrollLeft = saved
}

// 2) 복원된 위치 기준으로 활성 칩이 이미 보이는지 판정
const left = active.offsetLeft - list.offsetLeft
const right = left + active.offsetWidth
const isVisible =
  left >= list.scrollLeft && right <= list.scrollLeft + list.clientWidth

// 3) 시야 밖일 때만 앞쪽 정렬
// 4) 이후 스크롤을 계속 기록해 다음 재마운트가 되돌릴 위치를 남긴다
```

### 변경 2: 정렬 기준은 JS 판정 + CSS 위임 조합

`scrollIntoView`의 `inline` 값만으로는 원하는 동작이 나오지 않는다.

| 값 | 동작 | 문제 |
| ------ | ------ | ------ |
| `'start'` | 항상 시작 모서리에 정렬 | 이미 보이는 칩도 끌어당겨 매번 튄다 |
| `'nearest'` | 벗어난 방향의 가장 가까운 모서리 | 오른쪽에서 들어온 칩이 오른쪽 끝에 붙는다 |

"이미 보이면 가만히 두고, 벗어났을 때만 앞쪽에 붙인다"는 명세가 제공하지 않는다. 그래서 **가시성 판정만 JS로** 하고, 정렬은 `'start'`에, 여백은 CSS `scroll-padding`에 맡겼다.

```tsx
// scroll-pl-4 desktop:scroll-pl-0
```

여백을 JS 상수로 두면 모바일 `px-4` / 데스크톱 `px-0` 차이를 JS에서 다시 계산해야 하는데, CSS가 그 일을 대신한다.

### 변경 3: `useLayoutEffect`로 깜빡임 제거

`useEffect`는 페인트 이후에 실행되어 "0 위치로 한 번 그려진 뒤 복원"되는 한 프레임 깜빡임이 남는다. `useLayoutEffect`는 페인트 전에 동기 실행되므로 복원된 위치가 첫 프레임부터 반영된다.

서버에서는 실행될 수 없어 경고가 나므로, isomorphic 래핑으로 SSR에서는 `useEffect`가 되도록 했다.

```tsx
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
```

> **Why CSR로 돌리지 않았나:** 경고를 없애려 이 nav를 CSR 전용으로 바꾸는 선택지가 있었으나, 칩은 버전별 페이지로 가는 내부 링크(`<Link>`)라 초기 HTML에서 빠지면 크롤러가 따라갈 경로가 사라진다. sticky 크롬 안에서 나중에 채워지며 레이아웃 시프트도 생긴다.

### 변경 4: 사용처별 키 분리

이 nav는 사용처가 2곳(포켓몬 습득 기술 / 기술 상세)이고, 포켓몬·기술마다 버전 목록이 다르다. 키를 나누지 않으면 서로의 스크롤 위치를 물려받아 엉뚱한 곳으로 이동한다.

```tsx
storageKey={`detail:${pokemonId}`}  // 습득 기술
storageKey={`move:${skillId}`}      // 기술 상세
```

## ♿ 접근성 개선

`behavior: 'smooth'`는 JS 옵션이라 CSS 미디어 쿼리가 끼어들 수 없어, OS 접근성 설정에서 **동작 줄이기**를 켠 사용자에게도 그대로 애니메이션됐다.

화면 폭만큼 콘텐츠가 옆으로 미끄러지는 움직임은 전정 장애 사용자에게 어지럼증을 유발할 수 있다([WCAG 2.1 SC 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)). `matchMedia`로 직접 읽어 `'auto'`(즉시 이동)로 낮췄다.

```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches

behavior: prefersReducedMotion ? 'auto' : 'smooth'
```

최종 스크롤 위치는 동일하고 이동 과정만 사라진다.

## 📊 결과

| 상황 | 변경 전 | 변경 후 |
| ------ | ------ | ------ |
| 활성 칩이 이미 보임 | 맨 왼쪽으로 강제 정렬 (튐) | 스크롤 안 함 |
| 활성 칩이 시야 밖 | 0에서부터 재시작 | 보던 위치에서 최소 거리 이동 |
| 연속 이동 | 매번 위치 초기화 | 위치가 이어짐 |
| 동작 줄이기 사용자 | 애니메이션 그대로 | 즉시 이동 |

## 🔧 기술적 세부사항

**수정 파일**

| 파일 | 변경 |
| ------ | ------ |
| `src/components/moves/MovesVersionNav.component.tsx` | 스크롤 복원 로직, `storageKey` prop, isomorphic layout effect, 동작 줄이기 대응 |
| `src/container/detail/moves/DetailMovesStickyNav.container.tsx` | `storageKey` 전달 |
| `src/container/moves/MoveDetailVersionNav.container.tsx` | `storageKey` 전달 |

**검증**: `tsc --noEmit`, `eslint` 통과

## 📌 참고 사항

- **`MovesVersionNav`를 새로운 곳에서 재사용할 때는 고유한 `storageKey`를 넘겨야 한다.** 생략하면 복원 없이 최초 1회 스크롤만 동작하고, 중복되면 다른 화면의 위치를 물려받는다.
- 스크롤 컨테이너의 좌측 패딩(`px-4`)을 바꿀 경우 `scroll-pl-4`도 함께 맞춰야 정렬 여백이 어긋나지 않는다.
- **남은 한계**: 컨테이너가 이미 끝까지 스크롤된 상태에서 마지막 칩이 활성일 때는 `'start'` 정렬이 물리적으로 불가능해 칩이 오른쪽에 남는다. 스크롤 가능 범위의 한계이며 정상 동작이다.
- 근본 해법으로 검토했던 **sticky nav의 layout 승격은 기각**했다. layout은 하위 세그먼트의 `versionGroupId`를 읽을 수 없어 활성 상태의 SSR 반영이 깨지고, 없앨 수 있는 비용(칩 nav 재마운트)에 비해 재설계 범위가 과도하다. 상세 근거는 ADR-0015에 기록했다.

## 📝 관련 문서

- `ADR-0015`: 버전 nav 가로 스크롤 위치 sessionStorage 복원
- [CSSOM View — scroll an element into view](https://drafts.csswg.org/cssom-view/#scroll-an-element-into-view)
- [React — useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)
- [Next.js — layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
