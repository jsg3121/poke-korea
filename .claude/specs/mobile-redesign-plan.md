# 모바일 사용성 전면 개편 기획서 — 포케코리아 (poke-korea)

> **작성일**: 2026-06-15
> **버전**: 1.54.0
> **상태**: 기획 확정 (Phase 0 착수 대기)
> **전략**: 기반 먼저(디자인 시스템 정비) → 화면 점진 교체(스트랭글러 패턴)

---

## 1. 배경 · 목표

### 1.1 배경

포케코리아는 **모바일 사용자 비중이 55.6%**(MAU 23,047 기준, 2026-05-03)로, 데스크톱(42.5%)보다 높다. 주요 유입 채널도 **Naver 모바일 검색 30.1%** 로 모바일이 핵심 접점이다. 그러나 현재 일부 공용 UI 컴포넌트가 모바일 사용성을 충분히 고려하지 못해, 실제 이용 시 불편이 발생할 여지가 있다.

> **Why:** 트래픽의 절반 이상이 모바일이고 검색 유입의 다수가 모바일임에도, 사용성 개선의 우선순위가 모바일에 맞춰져 있지 않다. 가장 많은 사용자가 겪는 불편을 먼저 해소하는 것이 ROI가 가장 높다.

### 1.2 목표

- 모바일 사용성을 중심으로 **전체 UI를 통일**하고 사용감을 개선한다.
- **기존 무드·톤은 유지**한다 — 색상(primary 파랑 계열), 폰트(Gmarket Sans)는 그대로 두고, 변경은 레이아웃·간격·터치 타겟·가독성에 국한한다.
- 한 번에 갈아엎지 않고 **점진적으로(스트랭글러)** 마이그레이션하여 리스크를 최소화한다.
- 이번 개편을 통해 **내부 디자인 시스템을 함께 구축**한다 — claude.ai/design의 `poke-korea-design-system` 프로젝트를 디자인 시스템의 **시각적 single source of truth**로 삼고, 코드 개선과 병행하여 Foundations → Components → Patterns를 축적한다.

> **Why:** 사이트 개선과 디자인 시스템 구축은 별개 작업이 아니다. 토큰·공용 컴포넌트를 개선하는 과정 자체가 디자인 시스템의 구성 요소를 만드는 일이다. 코드(구현체)와 claude.ai/design(문서/카탈로그)을 함께 갱신하면, 추가 비용 없이 일관된 디자인 시스템이 누적된다.

---

## 2. 현황 분석

### 2.1 페이지 분기 구조 — 양호 (문제 아님)

라우트는 총 **38개 page.tsx**이며, **38개 전부 모바일/데스크톱이 완전히 분기**되어 있다.

- `detectUserAgent()`로 User-Agent를 판별([src/module/device.module.ts](../../src/module/device.module.ts))한 뒤, 페이지에서 `isMobile ? <XxxMobile/> : <XxxDesktop/>` 패턴으로 조건부 렌더링한다.
- `views/mobile`·`views/desktop`, `container/mobile`·`container/desktop`로 **파일 레벨에서 분리**되어 있다.

> **결론:** 페이지 분기 구조 자체는 매우 우수하다. 이 부분은 개편 대상이 아니다.

### 2.2 진짜 문제 — page 하위 "공용 컴포넌트"의 모바일 대응 미흡

`src/components/` 루트의 일부 컴포넌트는 데스크톱/모바일 **공용**으로 쓰이는데, 모바일 대응이 부족하다. 페이지는 분기되어도, 그 안에서 쓰는 공용 부품이 모바일에 맞지 않아 불편이 발생한다.

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
| **브레이크포인트** | ⭐⭐⭐ 커스텀 `mobile:`/`desktop:`와 Tailwind `md:`/`sm:` 혼재 | 일원화 |
| **모바일 최소 폰트** | ⚠️ 9px (탭바) | 11px 이상으로 상향 (접근성) |

---

## 3. 전략 — 기반 먼저, 화면 점진 교체 (스트랭글러)

### 3.1 핵심 전략

> **디자인 시스템 기반(토큰·공용 컴포넌트·터치 표준)을 먼저 정비한 뒤, 화면을 라우트 단위로 점진 교체한다.**

### 3.2 왜 기반이 먼저인가

화면(page)부터 라우트별로 교체하면, 페이지마다 제각각인 디자인이 또 생겨 "통일"이라는 목표를 오히려 해친다. 반대로 공용 컴포넌트(예: Tag) 하나를 고치면 **거의 전 페이지가 동시에 개선**된다. 기반을 먼저 깔아야 이후 화면 교체가 일관된 토대 위에서 진행된다.

### 3.3 왜 스트랭글러 패턴인가

**Strangler Fig 패턴**(기존 시스템을 한 번에 교체하지 않고 새 구현으로 라우트를 하나씩 감싸 점진 대체)은 이 프로젝트에 매우 잘 맞는다.

- 라우트가 **38개로 잘게 쪼개져** 있어 라우트 단위 교체가 가능하다.
- 데스크톱/모바일이 **파일 레벨로 분리**되어 있어, **모바일 뷰만 독립적으로 교체**할 수 있다(데스크톱 무영향).
- SSR 분기점이 명확해 `isMobile ? <NewMobile/> : <OldDesktop/>` 식 신구 공존이 자연스럽다.

> **참고:** Martin Fowler, [StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html)

### 3.4 범위

이번 개편은 **모바일 우선**이다. 대상은 `views/mobile`, `container/mobile`, 그리고 공용 컴포넌트의 모바일 대응이다. **데스크톱은 현행 유지**한다.

---

## 3.5 디자인 시스템 구축 트랙 (코드 작업과 병행)

코드 개선과 **동시에** claude.ai/design(`poke-korea-design-system`)에 디자인 시스템을 축적한다. 별도 단계가 아니라, 각 Phase 작업이 진행될 때 그 결과물을 DS에 함께 등록하는 **병행 트랙**이다.

### 계층 구조

일반적인 디자인 시스템 계층(Atomic Design 기반)을 따른다.

```text
Foundations (기반)   ← 토큰
  ├─ Colors      (primary 4색 / type 18색 / damage 3색 / 중성색)
  ├─ Typography  (Gmarket Sans + fontSize 스케일)
  └─ Spacing     (간격 스케일 + 터치 타겟 touch/touch-lg)
       ↓
Components (부품)     ← 공용 컴포넌트 (개선될 때마다 카드로 등록)
  └─ Tag, StatChart, MobileTabBar, Button, Card, Checkbox/Radio …
       ↓
Patterns (조합)       ← 화면 단위 패턴
  └─ 카드 그리드, 필터, 탭바, 상세 레이아웃 …
```

### 동기화 규칙

- 코드 컴포넌트를 개선·확정할 때마다, 그 프리뷰(HTML/CSS)를 DS에 업로드한다.
- 업로드는 **메인 세션**이 `DesignSync` + `@dsCard` 마커로 처리한다(역할 분리: [ux-designer.md](../agents/ux-designer.md) 참조).
- 카드는 위 계층 그룹(`Foundations` / `Components` / `Patterns`)으로 정리한다.

> **Why:** 코드가 구현체라면 claude.ai/design은 그 시각적 문서다. 둘을 함께 갱신해야 "코드는 바뀌었는데 디자인 문서는 옛날 것"인 불일치를 막고, 디자인 시스템이 항상 살아있는 상태로 유지된다.

### Phase ↔ DS 산출물 매핑

| Phase 작업 | 코드 산출물 | DS 산출물 (claude.ai/design) |
| --- | --- | --- |
| 4.1 토큰 체계 | `tailwind.config.js` 토큰 | **Foundations** 카드 (Colors / Typography / Spacing) |
| 4.3 공용 컴포넌트 | Tag / StatChart / MobileTabBar 개선 | **Components** 카드 |
| Phase 1+ 화면 | 모바일 뷰 교체 | **Patterns** 카드 |

---

## 4. Phase 0 — 디자인 시스템 기반 정비

> 전 페이지에 동시 개선 효과를 내는 기반 작업. 화면 교체보다 먼저 수행한다.

### 4.1 토큰 체계 정비 ← **Phase 0의 첫 작업**

`tailwind.config.js`의 토큰을 확장하고 브레이크포인트를 일원화한다.

- [ ] **spacing 토큰 추가**: 터치 타겟·모바일 간격 토큰 (예: `touch-target`(44px), 모바일 gap 단계)
- [ ] **fontSize 토큰 추가**: 모바일 캡션/본문/제목 단계 정의 (**최소 11px** — 접근성)
- [ ] **렌더링 전략 일원화 (순수 적응형)**: [ADR-0006](../decisions/records/ADR-0006-adaptive-rendering-strategy.md)에 따라 컴포넌트 내 viewport 미디어쿼리(`md:`/`sm:`/`lg:`/`xl:`)를 제거하고 분기를 UA(`isMobile`) 기준으로 통일
- [ ] **데스크톱 min-width**: 데스크톱 레이아웃 루트에 최소 너비 + 상위 `overflow-x-auto` 도입 (창 축소 시 리플로우 대신 가로 스크롤)
- [ ] **다단 그리드 재설계**: 폭 비례 `grid-cols-N`(`sm/md/lg/xl`)을 mobile/desktop 고정 열로 전환
- [ ] **공용 컴포넌트 결정 트리 적용**: 차이 없음→유지 / 표현 차이→`isMobile` 조건부 클래스 / 구조 차이→뷰 분리 + Wrapper / 로직→순수 함수 추출 ([ADR-0006](../decisions/records/ADR-0006-adaptive-rendering-strategy.md))
- [ ] **`getIsMobile()` 도입**: 서버 컴포넌트의 디바이스 분기를 `headers()` 기반 함수로 전환 (RSC 보존, CLS 0). `useDevice()`는 클라이언트 전용으로 유지

**완료 기준**

- `src/` 컴포넌트 내 viewport 미디어쿼리(`md:`/`sm:`/`lg:`/`xl:`) **0건** (globals.css 내부 정의는 별도 검토)
- 모바일 전용 파일의 발동 불가 미디어쿼리(죽은 코드) 제거
- 데스크톱 min-width + 가로 스크롤 처리 적용
- 신규 모바일 간격·폰트는 임의값(`[...]`) 대신 토큰 사용
- 서버 컴포넌트는 `getIsMobile()`, 클라이언트 컴포넌트는 `useDevice()`로 분기 (혼용 정리)
- **(DS)** Foundations 카드(Colors / Typography / Spacing)가 `poke-korea-design-system`에 업로드됨

> **Why:** 적응형/반응형 혼재를 제거해야 컴포넌트·화면 작업이 일관된 분기 규칙 위에서 진행된다. 자세한 근거는 [ADR-0006](../decisions/records/ADR-0006-adaptive-rendering-strategy.md) 참조.

### 4.2 터치 타겟 표준

전 공용 컴포넌트의 인터랙티브 영역을 표준화한다.

- [ ] 모든 공용 인터랙티브 요소 터치 타겟 **최소 44×44px** (WCAG 2.5.5 Target Size)
- [ ] `min-h-[44px] min-w-[44px]` 또는 `touch-target` 토큰으로 적용

**완료 기준**: Tag, MobileTabBar, (모바일에서 쓰이는) Checkbox/Radio 전부 44px 이상

### 4.3 공용 컴포넌트 모바일 대응 (Tag → StatChart → MobileTabBar 순)

- [ ] **Tag**: 높이 44px 이상, 폰트 최소 11px (영향 범위가 가장 넓어 첫 타깃)
- [ ] **StatChart**: 모바일 전용 `SIZE_CONFIG` 분기 추가([RadarChart.component.tsx](../../src/components/chart/RadarChart.component.tsx) 51–73행), 라벨 가독성·겹침 해소
- [ ] **MobileTabBar**: 아이콘 최소 24px(`h-6 w-6`), 폰트 최소 11px

**완료 기준**: 위 3개 컴포넌트가 터치 타겟·폰트 기준을 충족하고, 기존 무드(색상·폰트)는 변경 없음

---

## 5. Phase 1+ — 화면별 점진 교체 (스트랭글러)

Phase 0 완료 후, 라우트를 우선순위에 따라 모바일 뷰 단위로 점진 교체한다.

### 5.1 라우트 우선순위

실제 라우트별 트래픽 데이터가 확보되면 그 순서를 따른다. 데이터가 없을 경우, **핵심 동선 우선** 원칙으로 다음 순서를 가정한다.

```
홈(/) → 리스트(/list) → 상세(/detail/[pokemonId]) → 기술(/moves) → 그 외
```

> **Why:** 홈은 모든 유입의 관문이고, 리스트·상세는 도감 서비스의 핵심 사용 동선이다. 가장 많이 거치는 화면부터 개선해야 체감 효과가 크다.

### 5.2 라우트별 작업 사이클

각 라우트는 다음 사이클로 진행한다.

```
ux-designer (Playwright 캡처 → 4축 Design Critique)
  → ui-publisher (개선 모바일 시안 HTML/CSS 생성)
    → DesignSync (poke-korea-design-system에 업로드 → 시각적 미리보기)
      → 실제 모바일 뷰 구현 (views/mobile, container/mobile)
        → 검증 (a11y-check, 실기기 확인)
```

> 신구 공존: 교체 중에도 `isMobile ? <NewMobile/> : <OldDesktop/>` 구조라 데스크톱은 영향받지 않는다.

---

## 6. 디자인 원칙 · 리스크

### 6.1 디자인 원칙 (기존 무드·톤 유지)

- **색상**: primary 파랑 계열(`primary-1`~`primary-4`) 유지. 신규 하드코딩 색상 추가 금지.
- **폰트**: Gmarket Sans 유지.
- **변경 범위**: 레이아웃·간격·터치 타겟·가독성에 국한. 브랜드 인상은 바꾸지 않는다.

> **Why:** 사용자는 이미 현재 무드에 익숙하다. 사용성만 개선하고 시각적 정체성은 유지해야 학습 비용 없이 개선 효과만 전달된다.

### 6.2 리스크 및 완화

| 리스크 | 완화 방안 |
| --- | --- |
| 토큰 변경이 데스크톱에 의도치 않은 영향 | 모바일 전용 토큰·브레이크포인트로 범위 한정, 데스크톱 회귀 시각 점검 |
| 공용 컴포넌트 수정이 여러 페이지에 동시 파급 | Tag → StatChart → MobileTabBar 순으로 하나씩, 각 단계 후 영향 페이지 점검 |
| 브레이크포인트 일원화 중 누락 | `md:` 사용 0건을 완료 기준으로 grep 검증 |
| 점진 교체 중 신구 디자인 혼재 기간 | 스트랭글러 특성상 불가피 — 핵심 동선부터 빠르게 교체해 혼재 기간 단축 |

---

## 참조

- [.claude/specs/service-overview.md](./service-overview.md) — 서비스 현황·디바이스 비중
- [.claude/specs/target-segment.md](./target-segment.md) — 타겟 사용자
- [.claude/conventions/guides/styling.md](../conventions/guides/styling.md) — Tailwind·색상 체계·브레이크포인트
- [.claude/conventions/guides/workflow.md](../conventions/guides/workflow.md) — 브랜치·버전 전략
- [.claude/agents/ux-designer.md](../agents/ux-designer.md) — Design Critique 워크플로우
