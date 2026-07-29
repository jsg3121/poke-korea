# UI 전면 개편 & 디자인 시스템 구축 기획서 — 포케코리아 (poke-korea)

> **작성일**: 2026-06-15 (최초) · **개정**: 2026-06-16 (4단계 전략) · 2026-06-24 (원자 우선, [ADR-0010](../decisions/records/ADR-0010-atomic-first-ds-build-order.md))
> **버전**: 1.54.0
> **상태**: 기획 확정
> **전략**: Foundations + **원자 컴포넌트 우선** 구축 → 조립(분자/컨테이너/페이지) → 구버전 제거 (배포 전 전체 완료)
> **렌더링**: 반응형(Responsive) 단일 컴포넌트 ([ADR-0007](../decisions/records/ADR-0007-responsive-rendering-strategy.md))

---

## 1. 배경 · 목표

### 1.1 배경

포케코리아는 **모바일 사용자 비중이 55.6%**(MAU 23,047 기준, 2026-05-03)로 데스크톱(42.5%)보다 높다. 그러나 일부 공용 UI 컴포넌트가 모바일 사용성을 충분히 고려하지 못해 이용 시 불편이 발생한다. 또한 페이지마다 디자인이 통일되어 있지 않다.

> **Why:** 트래픽의 절반 이상이 모바일이고, 디자인 일관성이 부족하다. 이번 기회에 전체 UI를 전면 개편하면서 **내부 디자인 시스템을 함께 구축**해 일관성·사용성·유지보수성을 동시에 확보한다.

### 1.2 목표

- 전체 UI를 **전면 재디자인**하여 통일하고 모바일 사용성을 개선한다.
- 이 과정에서 **내부 디자인 시스템을 구축**한다 — **Storybook**을 디자인 시스템의 single source of truth로 삼는다([ADR-0008](../decisions/records/ADR-0008-storybook-design-system.md)).
- 렌더링은 **반응형 단일 컴포넌트**로 한다([ADR-0007](../decisions/records/ADR-0007-responsive-rendering-strategy.md)). 기존 적응형(UA 분기)은 개편 과정에서 제거한다.
- **기존 무드·톤은 유지**한다 — 색상(primary 파랑 계열), 폰트(Gmarket Sans)는 유지하고, 레이아웃·간격·사용성을 개선한다.

### 1.3 배포 전제 (중요)

> **모든 페이지의 개편이 완료되기 전에는 상용에 배포하지 않는다.**

이 전제가 전략을 결정한다. 중간 배포가 없으므로 "항상 배포 가능한 상태 유지"라는 제약이 없다. 따라서 페이지 단위로 과감히 전면 재구성하고, 작업물은 `feature/1.54.0` 루트 브랜치에 누적하다가 **전체 완료 후 한 번에 배포**한다.

> **Why:** 중간 배포 제약이 없으면 디자인 일관성을 최우선할 수 있고, 페이지를 실제로 그려보며 디자인 시스템을 *실제 필요 기반*으로 키울 수 있다.

---

## 2. 현황 분석

### 2.1 페이지 분기 구조 (개편 이전 상태)

라우트는 총 **38개 page.tsx**이며, **38개 전부 모바일/데스크톱이 완전히 분기**되어 있다.

- `detectUserAgent()`로 User-Agent를 판별([src/module/device.module.ts](../../src/module/device.module.ts))한 뒤, 페이지에서 `isMobile ? <XxxMobile/> : <XxxDesktop/>` 패턴으로 조건부 렌더링한다.
- `views/mobile`·`views/desktop`, `container/mobile`·`container/desktop`로 **파일 레벨에서 분리**되어 있다.

> **개편 방향:** 이 적응형 분리 구조를 **반응형 단일 뷰로 통합**한다([ADR-0007](../decisions/records/ADR-0007-responsive-rendering-strategy.md)). §2.1은 개편 *이전* 상태 기록이다.

### 2.2 공용 컴포넌트의 모바일 대응 미흡

`src/components/` 루트의 일부 컴포넌트는 데스크톱/모바일 **공용**으로 쓰이는데, 모바일 대응이 부족하다.

| 우선순위 | 컴포넌트 | 문제 | 영향 범위 | 근거 |
| --- | --- | --- | --- | --- |
| 🔴 높음 | **Tag** (타입 배지) | 모바일 약 43×18px (터치 권장 44px 미달), 폰트 약 10px | 거의 전 페이지 | [Tag.component.tsx](../../src/components/Tag.component.tsx), `globals.css` `.type-tag` 261–262행 |
| 🔴 높음 | **StatChart** (능력치 레이더 차트) | 모바일 라벨 가독성 부족·겹침 위험 | 상세 / Champions 상세 | [RadarChart.component.tsx](../../src/components/chart/RadarChart.component.tsx) `SIZE_CONFIG` 51–73행 |
| 🟡 중간 | **MobileTabBar** | 아이콘 약 15px(`h-5 w-5`), 폰트 `text-[9px]` | 모든 모바일 네비 | [MobileTabBar.tsx](../../src/components/MobileTabBar.tsx) |
| 🟢 낮음 | **Checkbox / Radio / RadioGroup** | 터치 약 20px | 데스크톱 필터 전용 | [Checkbox.component.tsx](../../src/components/Checkbox.component.tsx) 등 |

### 2.3 디자인 토큰 현황

| 항목 | 상태 | 조치 |
| --- | --- | --- |
| **색상** | ⭐⭐⭐⭐⭐ 잘 토큰화됨 (토큰 307회 vs 하드코딩 7회) | 유지 |
| **간격/패딩** | ⭐⭐ px 임의값 많음 (예: `p-[0.75rem_0.5rem]`) | 토큰화 |
| **폰트 크기** | ⭐⭐⭐ 일부 임의값 (`text-[1.1rem]`, `text-[2.5rem]`) 혼재 | 토큰 확장 |
| **터치 타겟** | ⚠️ 신규 토큰 도입 완료 (`touch` 44px, `touch-lg` 48px) | 적용 확산 |
| **모바일 최소 폰트** | ⚠️ 9px (탭바) → 토큰 도입 완료 (`2xs` 11px) | 적용 확산 |

---

## 3. 전략 — 디자인 시스템 우선 + 페이지 단위 전면 재구성

### 3.1 핵심 원칙

> **디자인 시스템을 먼저 구축하고, 그 시스템 기반으로 페이지를 단위로 전면 재구성한다. 모든 페이지 완료 후 한 번에 배포한다.**

### 3.2 왜 스트랭글러가 아니라 "페이지 단위 전면 재구성"인가

스트랭글러 패턴은 *중간중간 배포되는 시스템*에서 "항상 동작 가능한 상태"를 유지하려는 패턴이다. 이번 작업은 **전체 완료 전까지 배포하지 않으므로**(§1.3), 그 제약이 없다. 따라서:

- 신구 공존을 억지로 맞출 필요 없이, 페이지를 과감히 전면 재구성한다.
- 기존 컴포넌트는 페이지 작업 중 **유지**하다가(작업 안전), 페이지 완료 후 **제거**한다.
- 작업물은 `feature/1.54.0` 루트에 누적 → 전체 완료 후 단일 릴리즈.

### 3.3 디자인 시스템 = Storybook (SSOT)

디자인 시스템 도구는 **Storybook**이다([ADR-0008](../decisions/records/ADR-0008-storybook-design-system.md)). 실제 React 컴포넌트를 그대로 story로 렌더하므로 코드와 100% 일치한다. 디자인 시스템 계층(Atomic Design 기반):

```text
Foundations (기반)   ← 토큰 + 스타일 규칙 (1단계에서 구축)
  ├─ Colors      (primary 4색 / type 18색 / damage 3색 / 중성색)
  ├─ Typography  (Gmarket Sans + fontSize 스케일)
  ├─ Spacing     (간격 스케일 + 터치 타겟 touch/touch-lg)
  └─ 반응형 규칙  (브레이크포인트, 그리드 규칙)
       ↓
Components (부품)     ← 페이지 작업 중 규격화되는 공용 컴포넌트 (2단계)
  └─ Button, Tag, Card, Input … (재사용+variant 기준 충족 시 승격)
       ↓
Patterns (조합)       ← 페이지 단위 레이아웃 패턴
```

- 코드 컴포넌트를 DS 규격으로 확정할 때마다, 그 **Storybook story**를 작성한다(`*.stories.tsx`). 실제 컴포넌트를 import해 렌더하므로 손으로 재현·스크린샷이 불필요하다.
- Foundations 토큰은 `tailwind.config`를 직접 읽는 docs story로 표현한다(토큰 변경 시 자동 반영).

---

## 4. 4단계 실행 흐름

### 4.1 [1단계] 디자인 시스템 구축 (Foundations + 원자 컴포넌트)

> **개정 ([ADR-0010](../decisions/records/ADR-0010-atomic-first-ds-build-order.md), 2026-06-24):**
> 기존엔 "1단계는 토큰만, 컴포넌트는 페이지를 그려봐야 아니까 2단계에서"였다. 그러나
> 컨테이너 조립 시 DS화 안 된 원자(버튼·링크 등)를 만나면 인라인 임시 구현 → 재작업하는
> 이중 비용이 발생했다. 원자는 페이지를 안 그려봐도 형태가 자명하므로, **원자 컴포넌트를
> 1단계로 편입**해 먼저 일괄 구축한다(Atomic Design 정석: atoms → molecules → organisms).

**(a) Foundations** — 토큰과 스타일 규칙.

- [x] **토큰**: spacing(`touch`/`touch-lg`), fontSize(`2xs`) 추가 — 완료
- [x] **Foundations story**: Colors / Typography / Spacing Storybook docs story — 완료
- [x] **반응형 규칙 정의**: 모바일 퍼스트 작성 규칙, 반응형 그리드 규칙을 styling.md에 명문화 — 완료
- [x] **간격/폰트 임의값 정리 규칙**: 신규 작업에서 `[...]` 임의값 대신 토큰 사용 원칙 확립 (styling.md "작성 규칙") — 완료

**(b) 원자 컴포넌트** — 페이지 맥락 없이도 형태가 자명한 최소 단위(CTA 버튼, 링크,
인풋, 라디오, 토글, 체크박스, 칩 등). **코드베이스에서 실제 쓰이는 것을 전수 조사**해
목록화하고, 토큰 기반 신규 DS로 일괄 구축한다(각 Storybook story 포함). 추측 기반
선제작은 금지(안 쓰는 컴포넌트 비대화 방지).

**완료 기준**: Foundations + 원자 컴포넌트가 DS로 구축되고 Storybook story로 반영됨.

### 4.2 [2단계] 페이지 단위 재구성 (조립 중심)

페이지를 우선순위 순으로 전면 재디자인한다. 원자가 1단계에서 DS로 준비됐으므로, 2단계는
**조립**이 중심이다 — 분자/컨테이너 → 페이지 순으로 DS 컴포넌트를 조립한다.

각 페이지:

1. **ux-designer** — 기존 화면 비평(4축) + 새 반응형 디자인 설계 (모바일·데스크톱 모두)
2. **분자/도메인 컴포넌트 규격화** — 원자 조합으로 만들어지는 복합 컴포넌트(카드, 카드
   셸 등) 중 재사용되는 것을 DS 규격으로 제작 → DS story 등록. 원자는 1단계에서 이미 준비됨.
3. **컨테이너·페이지 조립** — DS 컴포넌트만으로 조립(인라인 임시 구현 없음).

#### DS 컴포넌트 승격 기준 (분자/도메인 컴포넌트)

| 조건 | DS 컴포넌트 | 페이지 전용 |
| --- | --- | --- |
| 2곳 이상 재사용 + 변형(variant) 명확 | ✅ (Card, Card 셸 등) | — |
| 특정 페이지에서만 사용 | — | ✅ (DS에 안 올림) |

> **Why:** 원자는 자명하므로 1단계에서 선제작하지만(ADR-0010), *복합/도메인* 컴포넌트는
> 페이지를 그려봐야 형태·variant가 정해지는 경우가 많고 안 쓰는 게 쌓일 위험이 있다.
> 따라서 분자 이상은 여전히 "실제 재사용되는 것만" 규격화한다.

### 4.3 [3단계] 구버전 유지하며 신버전으로 재구성

새 컴포넌트로 페이지 UI를 다시 구성한다. **기존 컴포넌트는 그대로 둔 채** 새 구조로 페이지를 재작성한다.

- 기존 mobile/desktop 분리 뷰 → **반응형 단일 뷰**로 통합
- 기존 UA 분기(`isMobile`)·`useDevice` 제거, 반응형 CSS로 대응
- 구버전 컴포넌트는 아직 삭제하지 않음 (다른 미개편 페이지가 쓸 수 있음 — 작업 안전)

### 4.4 [4단계] 페이지 완료 후 구 컴포넌트 제거

해당 페이지 개편이 완료되면, **그 페이지가 쓰던 구 컴포넌트 중 더 이상 어디서도 안 쓰이는 것을 제거**한다.

- grep으로 사용처 0건 확인 후 삭제
- 모든 페이지 완료 시점에 구 컴포넌트·UA 분기 코드가 전량 제거되어야 함

---

## 5. 페이지 작업 우선순위 · 사이클

### 5.1 우선순위

실제 라우트별 트래픽 데이터가 확보되면 그 순서를 따른다. 없을 경우 **핵심 동선 우선**:

```text
홈(/) → 리스트(/list) → 상세(/detail/[pokemonId]) → 기술(/moves) → 특성/타입/퀴즈/Champions → 그 외
```

> **Why:** 홈은 모든 유입의 관문이고, 리스트·상세는 도감 서비스의 핵심 동선이다.

### 5.2 페이지 작업 사이클

```text
ux-designer (Playwright 캡처 → 4축 Design Critique → 반응형 재설계)
  → 컴포넌트 규격화 (필요한 공용 컴포넌트를 DS 반응형 단일로 제작)
    → Storybook story 작성 + 실제 렌더 검증 (build-storybook)
      → 페이지 반응형 단일 뷰로 재구성 (구버전 유지)
        → 검증 (a11y-check, 모바일·데스크톱 폭 확인)
          → 구 컴포넌트 사용처 0건 확인 후 제거
```

---

## 6. 디자인 원칙 · 리스크

### 6.1 디자인 원칙

- **무드·톤 유지**: primary 파랑 계열, Gmarket Sans 유지. 변경은 레이아웃·간격·사용성에 국한.
- **반응형 단일**: 디자인 시스템 컴포넌트는 하나가 모든 폭에 대응. 모드별 2벌 금지([ADR-0007](../decisions/records/ADR-0007-responsive-rendering-strategy.md)).
- **토큰 우선**: 간격·폰트는 임의값 대신 토큰 사용.

### 6.2 리스크 및 완화

| 리스크 | 완화 방안 |
| --- | --- |
| 작업 기간 길어짐 (배포 없이 누적) | 페이지 우선순위로 핵심부터, 진행 현황을 changelog로 추적 |
| 구버전·신버전 컴포넌트 공존 혼란 | 4단계(페이지 완료 후 구버전 제거)로 정리, 사용처 grep 검증 |
| 반응형 전환이 데스크톱 레이아웃에 회귀 | 모바일·데스크톱 폭 모두 시각 검증 후 교체 |
| DS 컴포넌트 비대화 | 승격 기준(2곳+variant) 엄격 적용 |
| 디자인 일관성 흔들림 | Foundations(1단계)를 먼저 확정하고 그 위에서만 컴포넌트 제작 |

---

## 참조

- [.claude/decisions/records/ADR-0007-responsive-rendering-strategy.md](../decisions/records/ADR-0007-responsive-rendering-strategy.md) — 반응형 전환 결정
- [.claude/specs/service-overview.md](./service-overview.md) — 서비스 현황·디바이스 비중
- [.claude/specs/target-segment.md](./target-segment.md) — 타겟 사용자
- [.claude/conventions/guides/styling.md](../conventions/guides/styling.md) — 반응형 컴포넌트 아키텍처
- [.claude/agents/ux-designer.md](../agents/ux-designer.md) — Design Critique 워크플로우
