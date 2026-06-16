# ADR-0007: 반응형(Responsive) 렌더링으로 전환 — 디자인 시스템 기반 재구축

- **상태**: 승인
- **날짜**: 2026-06-16
- **담당**: jsg3121 + Claude
- **대체**: [ADR-0006](./ADR-0006-adaptive-rendering-strategy.md) (순수 적응형)

## 맥락

[ADR-0006](./ADR-0006-adaptive-rendering-strategy.md)은 렌더링 전략을 **순수 적응형(Adaptive)** 으로 정했다. 그 핵심 근거는 *"이미 page 38개가 UA 분기 구조이므로, 현 구조를 활용하는 것이 전면 재작성보다 비용 대비 합리적"* 이었다.

그런데 이후 논의에서 전제가 바뀌었다. 이번 작업의 실제 목표는 단순 모바일 사용성 개선이 아니라 **전체 UI의 전면 개편 + 내부 디자인 시스템 도입**이다. 전면 재구축이 전제라면 ADR-0006의 핵심 근거("현 구조 활용")가 성립하지 않는다.

또한 적응형을 유지하며 디바이스 분기를 처리하는 과정에서 다음 비용이 반복적으로 드러났다.

- 공용 컴포넌트마다 `isMobile`을 어떻게 얻을지(prop / `useDevice` / `getIsMobile`) 매번 판단해야 함
- `useDevice`(훅)를 쓰면 컴포넌트가 client로 강등 → 리스트로 반복 렌더되는 카드의 경우 하이드레이션 비용이 N배
- 모드별로 컴포넌트를 2벌로 분리하는 구조는 디자인 시스템(단일 컴포넌트가 모든 폭 대응)과 근본적으로 충돌

## 결정

**렌더링 전략을 반응형(Responsive)으로 전환한다.** 디자인 시스템 도입과 UI 전면 개편을 이 전환과 함께 진행한다.

1. 디자인 시스템 공용 컴포넌트(Button, Card, Tag 등)는 **하나의 컴포넌트가 CSS로 모든 폭에 대응**한다. 모바일/데스크톱 컴포넌트를 2벌로 나누지 않는다.
2. 디바이스 분기(`detectUserAgent` 기반 UA 판별, `isMobile ? <Mobile/> : <Desktop/>`)를 **점진적으로 제거**한다.
3. 디바이스 정보 전파 장치(`DeviceProvider`/`useDevice` context)는 반응형 전환이 완료되는 범위에서 **점진적으로 걷어낸다**. 전환 중에는 공존을 허용한다.
4. 반응형 분기는 Tailwind 브레이크포인트(`mobile`/`desktop` 또는 표준 스케일)로 표현한다. 디자인 시스템의 반응형 규칙을 토큰·컴포넌트 레벨에서 정의한다.
5. 전환은 **스트랭글러 패턴**으로 라우트/컴포넌트 단위 점진 진행한다. 한 번에 전부 바꾸지 않는다.

## 근거

- **디자인 시스템 정합**: 업계 표준 디자인 시스템(Material, Ant, shadcn 등)은 반응형 단일 컴포넌트다. `Button`/`Card`에 모바일·데스크톱 버전이 따로 없다. DS를 제대로 도입하려면 반응형이 자연스럽다.
- **번들/하이드레이션**: 적응형은 분기를 위해 `useDevice`(훅) 또는 모드별 컴포넌트가 필요해, 반복 렌더 컴포넌트에서 client 강등·하이드레이션 N배 비용이 발생한다. 반응형은 분기를 CSS로 처리해 이 비용이 없다.
- **전제 변화**: ADR-0006의 근거("현 구조 활용")는 전면 재작성을 피하려는 것이었다. 전면 개편+DS 도입이 확정된 이상, 그 전제가 무효가 되었다.
- **유지보수**: 컴포넌트당 디바이스 분기 판단(prop/useDevice/getIsMobile)이 사라지고, 단일 컴포넌트 + 반응형 CSS로 일원화된다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| 반응형 전환 (채택) | DS 정합, 번들↓, 단일 컴포넌트, 유지보수 단순 | 38개 page UA 분기 제거 + view 병합 = 아키텍처 재작성 | — (전면 개편이 이미 전제이므로 재작성 비용이 정당화됨) |
| 순수 적응형 유지 (ADR-0006) | 현 구조 활용 | DS와 충돌, 모드별 2벌, 반복 컴포넌트 하이드레이션 비용 | 전면 개편 전제에서 "현 구조 활용" 근거 소멸 |
| 하이브리드 (DS는 반응형, 페이지는 적응형) | 점진 전환 용이 | 두 패러다임 공존이 영구화될 위험, 멘탈 모델 이원화 | 최종 목표는 반응형 단일화. 공존은 전환기 한정으로만 허용 |

## 결과

- ADR-0006의 상태를 **대체됨(ADR-0007)** 으로 변경한다.
- `styling.md`의 "적응형 컴포넌트 아키텍처" 섹션을 반응형 기준으로 개정한다.
- `mobile-redesign-plan.md`의 전략(적응형 전제)을 반응형 전환 + DS 도입으로 개정한다.
- 디바이스 분기(`detectUserAgent`, `DeviceProvider`/`useDevice`)는 전환 완료 범위에서 점진 제거한다. 전환 중 공존 허용.
- 디자인 시스템 컴포넌트는 반응형 단일 컴포넌트로 신규 구축한다(Foundations → Components → Patterns).
- 전환은 스트랭글러 패턴으로 라우트/컴포넌트 단위 점진 진행한다.

> **이미 머지된 작업의 유효성**: 디자인 토큰(touch/2xs), 죽은 미디어쿼리 제거(#160), DS Foundations 카드는 반응형에서도 유효하므로 유지한다. ADR-0006이 만든 "결정 트리/`getIsMobile`/`isMobile` 전달 규칙"만 본 ADR로 대체된다.

## 참고 자료

- [ADR-0006](./ADR-0006-adaptive-rendering-strategy.md) — 대체 대상(순수 적응형)
- [mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md) — 모바일 개편 기획서
- [Adaptive vs Responsive (MDN — Responsive design)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Martin Fowler — StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html)
