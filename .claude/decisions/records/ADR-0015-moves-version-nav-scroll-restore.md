# ADR-0015: 버전 nav 가로 스크롤 위치를 sessionStorage로 복원

- **상태**: 승인
- **날짜**: 2026-08-17
- **담당**: jsg3121

## 맥락

습득 기술 페이지(`/detail/[pokemonId]/moves/**`)와 기술 상세(`/moves/[id]/**`)의 버전 선택 nav(`MovesVersionNav`)에서, 버전 칩을 눌러 이동할 때 가로 스크롤이 어색하게 움직인다는 문제가 제기됐다.

증상은 단계적으로 드러났다.

1. 어떤 칩을 눌러도 활성 칩이 항상 컨테이너 맨 왼쪽으로 재정렬된다.
2. 정렬 기준을 바꾸자 칩이 오른쪽 모서리에 붙어, 뒤에 남은 버전이 보이지 않는다.
3. 가로 스크롤을 50% 정도 민 상태에서 마지막 칩을 누르면, 그 지점에서 조금만 움직이는 게 아니라 **맨 앞(0%)에서부터 다시 스크롤 애니메이션이 시작된다.**

3번이 문제의 본질이다. 원인은 정렬 옵션이 아니라 **재마운트**였다.

버전은 URL 경로 세그먼트(`/version/[versionGroupId]`)로 구분되므로, 칩을 누르면 라우트가 바뀌면서 이 클라이언트 컴포넌트가 새로 마운트된다. 새로 만들어진 스크롤 컨테이너의 `scrollLeft`는 **항상 0**이다 — 사용자가 손으로 밀어둔 위치는 이전 DOM 노드와 함께 사라진다.

그 결과 마운트 시 실행되는 스크롤 보정 로직이 "스크롤 0" 기준으로 가시성을 판정하게 되고, 이미 보이던 칩까지 시야 밖으로 오판해 매번 맨 앞에서 출발하는 애니메이션을 만든다.

기존 구현은 `scrollIntoView({ inline: 'start' })`를 마운트 시 무조건 호출하고 있었다.

## 결정

**재마운트를 전제로 두고, 스크롤 위치를 `sessionStorage`에 보존해 복원한다.**

`MovesVersionNav`의 마운트 effect를 다음 순서로 재구성한다.

1. **복원** — `sessionStorage`에 저장된 이전 위치를 `scrollLeft`에 즉시 대입(애니메이션 없음)
2. **판정** — 복원된 위치 기준으로 활성 칩이 스크롤 포트 안에 완전히 보이는지 `offsetLeft`로 계산
3. **보정** — 시야 밖일 때만 `scrollIntoView({ inline: 'start', behavior: 'smooth' })`
4. **저장** — `scroll` 이벤트(`passive: true`)로 이후 위치를 계속 기록

부수적으로 함께 정한 사항.

- **`useLayoutEffect`(isomorphic 래핑)** 을 쓴다. `useEffect`는 페인트 이후에 실행되어 "0 위치로 한 번 그려진 뒤 복원"되는 깜빡임이 남는다. 서버에서는 `useEffect`로 대체해 SSR 경고만 피한다.
- **정렬 여백은 CSS `scroll-padding-inline-start`** 가 맡는다(`scroll-pl-4 desktop:scroll-pl-0`). JS 상수로 두면 모바일 `px-4` / 데스크톱 `px-0` 차이를 JS에서 다시 계산해야 한다.
- **`storageKey` prop으로 사용처를 구분**한다. 사용처가 2곳이고 포켓몬·기술마다 버전 목록이 달라, 키를 나누지 않으면 서로의 위치를 물려받는다. 각각 `detail:${pokemonId}`, `move:${skillId}`를 넘긴다.
- **동작 줄이기 설정을 존중한다.** 3단계 보정의 `behavior`를 `matchMedia('(prefers-reduced-motion: reduce)')` 결과에 따라 `'auto'`로 낮춘다.

## 근거

**왜 `scrollIntoView` 옵션만으로 해결되지 않는가.**

CSSOM View 명세의 `inline` 값은 두 가지뿐이고, 어느 쪽도 원하는 동작이 아니다.

| 값 | 동작 | 문제 |
| ------ | ------ | ------ |
| `'start'` | 항상 시작 모서리에 정렬 | 이미 보이는 칩도 끌어당겨 매번 튄다 |
| `'nearest'` | 벗어난 방향의 가장 가까운 모서리에 정렬 | 오른쪽에서 들어온 칩이 오른쪽 끝에 붙어, 뒤에 남은 버전이 안 보인다 |

원하는 동작인 "이미 보이면 가만히 두고, 벗어났을 때만 앞쪽에 붙인다"는 명세가 제공하지 않는다. 따라서 **가시성 판정만 JS로 하고, 정렬·여백은 `'start'` + CSS에 위임**하는 조합이 필요하다.

**왜 위치 복원이 핵심인가.**

정렬 방식을 어떻게 고르든, 판정의 기준이 되는 `scrollLeft`가 0이면 결과는 틀린다. 복원(1)이 판정(2)보다 먼저 와야 하는 이유다. 실제로 `'nearest'`로 바꿨을 때 일시적으로 나아 보였던 것은 이동 거리가 우연히 짧아졌기 때문이고, 근본 원인은 남아 있었다.

**왜 `sessionStorage`인가 (모듈 스코프 변수 대비).**

모듈 스코프 변수로도 재마운트를 넘어 값이 유지되지만 채택하지 않았다.

- Next.js 서버 프로세스에서 모듈은 한 번 평가되어 **요청 간 공유**된다. 지금은 클라이언트 effect에서만 읽어 실제 유출이 없지만, 렌더 중에 읽는 코드가 하나라도 생기면 조용히 깨진다.
- Concurrent 렌더링에서 React가 렌더를 버리고 재시도할 때 **롤백되지 않는다.** Fast Refresh에서도 살아남아 개발 중 혼란을 준다.
- 사용처가 늘수록 자라기만 하고 **정리 시점이 없다.**

`sessionStorage`는 브라우저 전용이라 서버 공유가 원천적으로 불가능하고, 탭 단위로 수명이 명확하다. "React 밖 상태"로서 정직한 선택이다.

**왜 CSR 전환으로 SSR 경고를 없애지 않는가.**

`useLayoutEffect`의 SSR 경고를 피하려 이 nav를 CSR 전용으로 돌리는 선택지가 있었으나 기각했다. 칩은 버전별 페이지로 가는 내부 링크(`<Link>`)라 초기 HTML에서 빠지면 크롤러가 따라갈 경로가 사라진다. sticky 크롬 안에서 나중에 채워지며 레이아웃 시프트도 생긴다. 경고는 동작에 영향이 없고 isomorphic 래핑 한 줄로 해결된다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| ------ | ------ | ------ | ------------- |
| `inline: 'nearest'` 단독 | 1줄 변경 | 활성 칩이 오른쪽 모서리에 붙어 남은 버전이 안 보임. 위치 복원이 없어 근본 원인 미해결 | 증상만 가리고 3번 문제가 그대로 남는다 |
| sticky nav를 `layout.tsx`로 승격 | 재마운트 자체가 사라져 복원 코드 불필요 | 아래 상세 참조 | 이 라우트 구조에서 성립하지 않는다 |
| 모듈 스코프 변수로 위치 보존 | 코드가 가장 단순 | 서버 요청 간 공유, concurrent 롤백 미추적, 정리 시점 없음 | React 밖 상태로 부적절 |
| 버전 전환을 클라이언트 상태로 변경 | 재마운트 없음 | 버전별 URL이 사라짐 | SEO·공유 목적의 기존 설계 결정과 정면 충돌 |
| nav를 CSR 전용(`ssr: false`)으로 전환 | SSR 경고 소멸 | 초기 HTML에서 내부 링크 소실, CLS 발생 | 경고 회피 대가로 SEO를 잃는다 |

### layout 승격이 불가능한 이유 (상세)

가장 근본적인 해법으로 보였으나, 조사 결과 이 구조에서는 성립하지 않는다.

**(1) 버전이 라우트 세그먼트이고 5개 라우트가 각자 `page.tsx`를 가진다.**

```text
/detail/[pokemonId]/moves
/detail/[pokemonId]/moves/[method]
/detail/[pokemonId]/moves/version/[versionGroupId]
/detail/[pokemonId]/moves/version/[versionGroupId]/[method]
/detail/[pokemonId]/moves/form|region/[[...index]]
```

layout은 유지되어도 page는 교체된다.

**(2) 데이터 페칭이 page에 있어 Provider도 page 안에 있다.**

각 `page.tsx`가 `fetchLearnsetQueries`로 데이터를 받아 `DetailMovesProvider`에 주입한다. nav를 layout으로 올리려면 Provider와 데이터 페칭도 함께 올려야 한다.

**(3) layout은 하위 세그먼트의 param을 읽을 수 없다.**

Next.js 공식 문서가 명시하는 제약이다. layout으로 올리는 순간 `versionGroupId`를 서버에서 알 수 없어 **활성 칩의 SSR 반영이 깨진다.** `useParams`로 우회하면 CSR 전환과 같은 문제로 귀결된다.

**(4) 성능 이득이 실질적으로 없다.**

없앨 수 있는 비용은 칩 nav의 재마운트(DOM 노드 수십 개)뿐인데, 버전 이동 시 어차피 본문 기술 표 전체가 새로 렌더된다. 정작 큰 비용은 그대로 남는다. 반면 채택안이 추가하는 비용은 `sessionStorage.getItem` 1회와 `scrollLeft` 대입 1회로, 프레임을 놓칠 수준이 아니다.

즉 layout 승격은 **작은 비용을 없애려 데이터 계층 전체를 재설계**하면서 SSR 활성 상태를 포기해야 하는 거래이며, 트레이드오프가 성립하지 않는다.

## 결과

- 버전 칩 이동 시 사용자가 보던 가로 스크롤 위치가 이어진다. 이미 보이는 칩은 움직이지 않고, 시야 밖 칩만 최소 거리로 앞쪽 정렬된다.
- 수정 범위가 컴포넌트 1개 + 호출부 2곳으로 제한되어, 라우트·메타데이터·ISR 설정에 영향이 없다.
- `MovesVersionNav`에 `storageKey` prop이 추가됐다. **이 nav를 새로운 곳에서 재사용할 때는 고유한 `storageKey`를 넘겨야 한다** — 생략하면 복원 없이 최초 1회 스크롤만 동작하고, 중복되면 다른 화면의 위치를 물려받는다.
- 스크롤 컨테이너에 `scroll-pl-4 desktop:scroll-pl-0`이 추가됐다. 좌측 패딩(`px-4`)을 바꿀 경우 이 값도 함께 맞춰야 정렬 여백이 어긋나지 않는다.
- 남은 한계: 컨테이너가 이미 끝까지 스크롤된 상태에서 마지막 칩이 활성일 때는 `'start'` 정렬이 물리적으로 불가능해 칩이 오른쪽에 남는다. 스크롤 가능 범위의 한계이며 정상 동작이다.

## 참고 자료

- [CSSOM View Module — scroll an element into view](https://drafts.csswg.org/cssom-view/#scroll-an-element-into-view) — `inline` 정렬값(`start` / `nearest`)의 명세 정의
- [MDN — Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) — 옵션별 동작과 `behavior: 'smooth'` 주의사항
- [MDN — scroll-padding](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding) — 스크롤 포트의 정렬 기준선 조정
- [React — useLayoutEffect](https://react.dev/reference/react/useLayoutEffect) — 페인트 전 동기 실행 및 서버 렌더링 제약
- [Next.js — layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout) — layout이 하위 세그먼트 param에 접근할 수 없다는 제약
- 관련 ADR: [ADR-0010](./ADR-0010-atomic-first-ds-build-order.md) — `MovesVersionNav`의 컴포넌트 승격 배경
