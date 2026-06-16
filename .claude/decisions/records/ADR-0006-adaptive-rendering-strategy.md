# ADR-0006: 적응형(Adaptive) 렌더링으로 일원화 + 데스크톱 min-width 전략

- **상태**: 승인
- **날짜**: 2026-06-16
- **담당**: jsg3121 + Claude

## 맥락

poke-korea는 page.tsx 레벨에서 `detectUserAgent()`로 모바일/데스크톱을 판별해 `isMobile ? <XxxMobile/> : <XxxDesktop/>` 로 분기하는 **적응형(Adaptive)** 구조를 쓴다(38개 라우트 전부). 그러나 그 하위의 공용 컴포넌트(`src/components/`의 moves·ability·champions·chart 등)는 CSS 미디어쿼리(`md:`, `sm:`, `lg:`, `xl:`) 기반의 **반응형(Responsive)** 으로 작성되어 있다.

즉 **적응형과 반응형이 한 코드베이스에 혼재**한다. 모바일 사용성 전면 개편([mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md))을 진행하면서, 향후 한 방향으로 일관되게 관리할 필요가 생겼다. `md:` 사용처 조사 결과 27건이 발견되었고, 일부는 모바일 전용 파일에 있어 발동조차 안 되는 죽은 코드였다.

## 결정

**렌더링 전략을 순수 적응형(Adaptive)으로 일원화한다.**

1. 모바일/데스크톱 분기는 **100% UA 판별(`isMobile`)** 기준으로 한다. 컴포넌트 내부의 viewport 미디어쿼리(`md:`/`sm:`/`lg:`/`xl:`)는 제거한다.
2. 공용 컴포넌트가 양쪽에서 다르게 보여야 하면, **mobile/desktop 컴포넌트로 분리**한다(반응형 변형 대신).
3. 다단 그리드(폭 비례 `grid-cols-N`)는 **mobile 고정 열 / desktop 고정 열**로 재설계한다.
4. **데스크톱에는 최소 너비(`min-width`)를 지정**한다. 그 이하로 뷰포트가 줄면 레이아웃이 리플로우되지 않고 **가로 스크롤바**가 생기도록 처리한다(상위 컨테이너 `overflow-x-auto`).

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

## 결과

- `src/` 내 `md:`/`sm:`/`lg:`/`xl:` 등 viewport 미디어쿼리를 점진 제거한다(완료 기준: 컴포넌트 내 미디어쿼리 0건).
- 모바일 전용 파일에 남은 발동 불가 미디어쿼리(죽은 코드)를 제거한다.
- 양쪽에서 다르게 보여야 하는 공용 컴포넌트는 mobile/desktop로 분리한다.
- 다단 그리드는 mobile/desktop 고정 열로 재설계한다.
- 데스크톱 레이아웃 루트에 `min-width` + 상위 `overflow-x-auto`를 도입한다(기준 최소 너비 값은 데스크톱 디자인 기준폭 확정 시 별도 결정).
- [mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md)의 Phase 0 "브레이크포인트 일원화" 완료 기준을 본 ADR에 맞춰 갱신한다.

## 참고 자료

- [mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md) — 모바일 개편 기획서
- [디자인 분기 전략: Adaptive vs Responsive (MDN — Responsive design)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [device.module.ts](../../../src/module/device.module.ts) — UA 판별 구현
