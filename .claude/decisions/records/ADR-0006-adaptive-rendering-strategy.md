# ADR-0006: 적응형(Adaptive) 렌더링으로 일원화 + 데스크톱 min-width 전략

- **상태**: 대체됨 ([ADR-0007](./ADR-0007-responsive-rendering-strategy.md))
- **날짜**: 2026-06-16
- **담당**: jsg3121 + Claude

> ⚠️ **이 ADR은 [ADR-0007](./ADR-0007-responsive-rendering-strategy.md)로 대체되었다.** 전면 UI 개편 + 디자인 시스템 도입이 전제가 되면서, 본 ADR의 핵심 근거("현 구조 활용")가 무효가 되었다. 렌더링 전략은 **반응형(Responsive)** 으로 전환한다. 단, 본 ADR 기간에 머지된 디자인 토큰·죽은 미디어쿼리 제거·DS Foundations는 반응형에서도 유효하므로 유지된다.

## 맥락

poke-korea는 page.tsx 레벨에서 `detectUserAgent()`로 모바일/데스크톱을 판별해 `isMobile ? <XxxMobile/> : <XxxDesktop/>` 로 분기하는 **적응형(Adaptive)** 구조를 쓴다(38개 라우트 전부). 그러나 그 하위의 공용 컴포넌트(`src/components/`의 moves·ability·champions·chart 등)는 CSS 미디어쿼리(`md:`, `sm:`, `lg:`, `xl:`) 기반의 **반응형(Responsive)** 으로 작성되어 있다.

즉 **적응형과 반응형이 한 코드베이스에 혼재**한다. 모바일 사용성 전면 개편([mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md))을 진행하면서, 향후 한 방향으로 일관되게 관리할 필요가 생겼다. `md:` 사용처 조사 결과 27건이 발견되었고, 일부는 모바일 전용 파일에 있어 발동조차 안 되는 죽은 코드였다.

## 결정

**렌더링 전략을 순수 적응형(Adaptive)으로 일원화한다.**

1. 모바일/데스크톱 분기는 **100% UA 판별(`isMobile`)** 기준으로 한다. 컴포넌트 내부의 viewport 미디어쿼리(`md:`/`sm:`/`lg:`/`xl:`)는 제거한다.
2. 공용 컴포넌트는 **"차이의 종류"에 따라 처리 방식을 결정**한다(아래 결정 트리). 무조건 파일 분리가 아니다.
3. 다단 그리드(폭 비례 `grid-cols-N`)는 **mobile 고정 열 / desktop 고정 열**로 재설계한다.
4. **데스크톱에는 최소 너비(`min-width`)를 지정**한다. 그 이하로 뷰포트가 줄면 레이아웃이 리플로우되지 않고 **가로 스크롤바**가 생기도록 처리한다(상위 컨테이너 `overflow-x-auto`).
5. `isMobile` 정보는 **서버에서 결정**하여 흘려보낸다(아래 isMobile 전달 규칙). CLS를 유발하는 클라이언트 측 viewport 측정(`matchMedia`/리사이즈)은 금지한다.

### 공용 컴포넌트 결정 트리

```text
공용 컴포넌트 →
 ① 모바일/데스크톱 차이가 있나?
     없음 → 단일 컴포넌트 유지 (RSC)
 ② 차이가 "표현"인가 "구조"인가?
     표현(크기·간격·폰트) → 단일 파일 + isMobile 조건부 클래스
     구조(배치·순서·유무) → 뷰 분리(X.mobile/X.desktop) + Wrapper 분기
 ③ 로직이 무거운가? (①②와 직교)
     → 로직을 순수 함수 모듈(src/module)로 추출 (훅 아님 → RSC 유지)
```

- **뷰 분리 시 분기 위치**: 기존 모범 사례인 `FilterOptions`처럼 **client Wrapper가 `useDevice`로 분기**하고, 자식 뷰(`.mobile`/`.desktop`)는 마크업만 담당한다(가능하면 RSC). page까지 분기를 올릴 필요는 없다.
- **로직 추출은 훅이 아니라 순수 함수**로 한다. 훅으로 빼면 사용처가 client로 강등되어 RSC가 깨진다(Headless의 로직 공유 이점을 함수로 가져온다).

### isMobile 전달 규칙 (CLS 0 + RSC 최대화)

| 컴포넌트 종류 | isMobile 획득 | 이유 |
| --- | --- | --- |
| **서버 컴포넌트** | `getIsMobile()` (`headers()` 기반, `src/module`) | prop drilling·context 불필요, RSC 유지, 서버에서 스타일 확정 → CLS 0 |
| **클라이언트 컴포넌트** | 기존 `useDevice()` context | 클라에선 `headers()` 불가. context는 서버가 주입한 값이라 CLS 없음 |

- `getIsMobile()`은 `headers()`에 의존하므로 **서버 전용**이다. 클라이언트에서 호출 불가.
- `useDevice()`는 `useContext` 훅이므로 **호출하는 컴포넌트는 무조건 client**가 된다. RSC가 필요한 곳에서는 쓰지 않는다.
- 디바이스 정보 하나를 위해 상태관리 라이브러리를 도입하지 않는다(오버엔지니어링).

## 근거

- **현 구조와 일치**: 이미 page 38개가 전부 UA 분기 구조이고 views/containers가 mobile/desktop로 파일 분리되어 있다. 적응형 통일은 "남은 혼재 정리"이고, 반응형 통일은 "전면 재작성"이다. 비용 대비 합리적이다.
- **개편 전략과 정합**: 스트랭글러 점진 교체 전략(모바일 뷰만 독립 교체)은 적응형을 전제로 한다.
- **성능**: 모바일 번들에 데스크톱 전용 마크업/스타일이 실리지 않는다.
- **디자인 시스템 정합**: 각 모드가 단일 레이아웃이므로, 의도한 폭에서 픽셀 단위로 정확히 렌더된다. claude.ai/design의 디자인 시스템 카드와 일치시키기 쉽다.
- **min-width + 스크롤 처리의 이점**: 순수 적응형의 본질적 한계(데스크톱 사용자가 창을 좁혀도 반응 안 함)를 "깨진 레이아웃"이 아니라 "가로 스크롤"로 명확히 처리한다. 사용자 혼란이 없고, 디자인이 항상 온전한 폭에서 표시된다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| 순수 적응형 + min-width (채택) | 현 구조 활용, 성능, DS 정합, 창 줄이기를 스크롤로 명확 처리 | 데스크톱 창 줄이기 시 리플로우 없음(스크롤) | — |
| 적응형 + 다단그리드만 반응형 예외 | 와이드 모니터에서 그리드가 폭에 비례 | 한 컴포넌트 안에 두 방식 혼재 잔존 | 혼재를 완전히 없애려는 본 결정 취지와 어긋남 |
| 반응형으로 전환 | 모든 폭에서 자연스러움, 업계 표준 | 38개 page UA 분기 제거 + 모든 view 병합 = 전면 재작성, 개편 범위 초과 | 리스크 대비 이득 불일치, 이번 개편 범위 초과 |
| 모든 공용 컴포넌트 무조건 mobile/desktop 분리 | 모드별 명확 | 표현 차이만 있는 다수 컴포넌트가 거의 동일 코드 두 벌로 중복 | 137개 전수 조사 결과 표현 차이가 다수 → 결정 트리로 선택 분리하는 것이 유지보수상 우월 |
| useDevice context 전면 제거 | RSC 극대화 | 변경 범위 큼, context는 이미 CLS 없음(서버 주입값) | 제거 이득 < 비용. 서버 컴포넌트만 getIsMobile로 전환하면 RSC 이득 대부분 확보 |
| 디바이스 상태관리 라이브러리 도입 | 전역 접근 편의 | 디바이스 정보 1개에 라이브러리 = 오버엔지니어링 | getIsMobile(cache+headers)로 라이브러리 없이 서버 전역 공유 가능 |

## 결과

- `src/` 내 `md:`/`sm:`/`lg:`/`xl:` 등 viewport 미디어쿼리를 점진 제거한다(완료 기준: 컴포넌트 내 미디어쿼리 0건).
- 모바일 전용 파일에 남은 발동 불가 미디어쿼리(죽은 코드)를 제거한다.
- 공용 컴포넌트는 결정 트리에 따라 처리한다: 차이 없음→유지 / 표현 차이→조건부 클래스 / 구조 차이→뷰 분리 + Wrapper.
- 다단 그리드는 mobile/desktop 고정 열로 재설계한다.
- 데스크톱 레이아웃 루트에 `min-width` + 상위 `overflow-x-auto`를 도입한다(기준 최소 너비 값은 데스크톱 디자인 기준폭 확정 시 별도 결정).
- 서버 컴포넌트의 디바이스 분기는 `getIsMobile()`(`headers()` 기반)로 전환해 RSC를 보존한다. `headers()`는 이미 요청 단위로 메모이제이션되며, UA 파싱 비용이 무시할 수준이라 `cache()` 래핑은 불필요하다. 컴포넌트 로직은 순수 함수 모듈로 추출한다.
- `useDevice()` context는 유지하되, **클라이언트 컴포넌트 전용**으로 사용한다(서버 컴포넌트는 `getIsMobile()`).
- [styling.md](../../conventions/guides/styling.md)에 적응형 컴포넌트 아키텍처 지침을 명문화한다.
- [mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md)의 Phase 0 "브레이크포인트 일원화" 완료 기준을 본 ADR에 맞춰 갱신한다.

## 참고 자료

- [mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md) — 모바일 개편 기획서
- [디자인 분기 전략: Adaptive vs Responsive (MDN — Responsive design)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [React `'use client'` — 훅은 클라이언트 전용](https://react.dev/reference/rsc/use-client)
- [Next.js `headers()` — 서버 전용 동적 함수 (요청 단위 메모이제이션)](https://nextjs.org/docs/app/api-reference/functions/headers)
- [device.module.ts](../../../src/module/device.module.ts) — UA 판별 구현
