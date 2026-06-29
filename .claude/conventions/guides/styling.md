# 스타일링 가이드

## 기본 원칙

- Tailwind CSS 유틸리티 클래스 우선 사용
- 전역 스타일: `src/styles/globals.css`
- SVG는 `@svgr/webpack`을 통해 React 컴포넌트로 import

**Why:** Tailwind 유틸리티 우선 접근으로 CSS 번들 크기를 최소화하고, 컴포넌트 단위의 스타일 관리를 용이하게 함.

## 브레이크포인트

| 이름 | 조건 | 용도 |
|------|------|------|
| (접두사 없음) | 모든 폭 = **base** | 모바일 스타일 (모바일 퍼스트) |
| `desktop` | min-width: 769px | 데스크톱 오버라이드 (주 사용) |
| `mobile` | max-width: 768px | 데스크톱→모바일 역방향 오버라이드 (예외적) |

> **모바일 퍼스트:** base(접두사 없음)가 모바일이고 `desktop:`로 데스크톱을 확장한다. `mobile:`(max-width)는 원칙적으로 불필요하다(아래 "작성 규칙" 참조).
>
> **중요:** 이 프로젝트는 **반응형(Responsive)** 으로 전환한다([ADR-0007](../../decisions/records/ADR-0007-responsive-rendering-strategy.md), ADR-0006 대체). 디자인 시스템 공용 컴포넌트는 하나의 컴포넌트가 CSS로 모든 폭에 대응한다. UA 기반 분기(`detectUserAgent`, `useDevice`)는 점진 제거 대상이다.

## 반응형 컴포넌트 아키텍처

모바일/데스크톱은 **CSS 브레이크포인트**로 대응한다. 디자인 시스템 컴포넌트는 모드별로 2벌 나누지 않고, 단일 컴포넌트가 반응형으로 모든 폭을 커버한다. 자세한 근거는 [ADR-0007](../../decisions/records/ADR-0007-responsive-rendering-strategy.md).

### 원칙

| 항목 | 방침 |
|------|------|
| **디바이스 분기** | CSS 브레이크포인트(`mobile`/`desktop`)로 표현. UA 판별(`isMobile`) 신규 사용 금지 |
| **공용 컴포넌트** | 단일 컴포넌트 + 반응형 CSS. 모바일/데스크톱 컴포넌트 2벌 분리 지양 |
| **디바이스 context** | `DeviceProvider`/`useDevice`는 점진 제거 대상. 신규 코드에서 사용 금지 |
| **번들** | 반응형은 분기를 CSS로 처리 → 불필요한 client 강등·하이드레이션 없음 |

### 작성 규칙 (모바일 퍼스트)

반응형은 **모바일 퍼스트**로 작성한다([Tailwind — Mobile First](https://tailwindcss.com/docs/responsive-design#working-mobile-first)). 모바일 비중이 55.6%로 높고, Tailwind의 기본 동작과도 일치한다.

| 규칙 | 내용 |
|------|------|
| **base = 모바일** | 접두사 없는 클래스가 모바일 스타일. `desktop:`로 데스크톱을 오버라이드한다 (예: `flex-col desktop:flex-row`) |
| **`mobile:` 지양** | 모바일이 base이므로 `mobile:`(max-width)는 원칙적으로 불필요. 데스크톱 → 모바일 역방향 오버라이드가 꼭 필요한 예외에만 사용 |
| **반응형 그리드** | 카드 리스트는 base 열 수 + `desktop:` 확장으로 (예: `grid-cols-2 desktop:grid-cols-5`). `sm:`/`md:`/`lg:`/`xl:` 다단 스케일 난립 금지 |
| **터치 타겟** | 인터랙티브 요소는 최소 44px (`min-h-touch`/`min-w-touch`). 모바일 base 기준으로 보장. **예외 — 슬림 인터랙티브(탭·칩)**: 24px(WCAG 2.2 2.5.8 AA)까지 허용하되 **항목 중심 간격 24px 이상 확보가 전제**. 탭은 모바일만 24px·데스크톱 44px(`min-h-touch-tab desktop:min-h-touch`), 칩(clickable)은 디바이스 무관 `h-7`(28px). **입력 컨트롤·아이콘 버튼**(SelectInput·CloseIconButton)은 모바일 44px·데스크톱 36px(`min-h-touch desktop:min-h-9`, 마우스 정밀도). 텍스트 CTA(Button) 등은 44px 유지 ([ADR-0011](../../decisions/records/ADR-0011-tab-touch-target-24px.md)) |
| **폰트 최소** | 모바일에서 11px(`text-2xs`) 미만 금지 (접근성) |
| **임의값 금지** | 간격·폰트·크기는 `[...]` 임의값 대신 토큰 사용. 토큰에 없으면 `tailwind.config`에 추가 후 사용 |

> **Why 모바일 퍼스트:** base를 모바일로 두면, 모바일에서 불필요한 데스크톱 스타일 오버라이드를 로드하지 않는다. 또 Tailwind가 min-width 기반이라 `desktop:`(min-width) 한 방향 확장이 자연스럽다. 양방향(`mobile:`+`desktop:`) 혼용은 어느 게 base인지 모호해진다.

### root font-size 16px 고정 ([ADR-0009](../../decisions/records/ADR-0009-root-font-size-fixed.md))

root `font-size`는 **모든 화면에서 16px 고정**이다. `1rem = 16px`이 어디서나 동일하므로, 토큰의 실제 px을 예측할 수 있다.

| 규칙 | 설명 |
| --- | --- |
| **rem 스케일링 폐기** | 화면 폭에 따라 root `font-size`를 바꾸지 않는다. 과거 16/14/12px 분기는 제거됐다([ADR-0009](../../decisions/records/ADR-0009-root-font-size-fixed.md)). `html`/`body`에 `font-size` 미디어쿼리를 다시 추가하지 말 것 |
| **모바일 축소는 토큰으로** | "모바일에서 작아지는" 동작은 rem 자동 축소가 아니라 **모바일 퍼스트 토큰**으로 명시한다. base=모바일(작게), `desktop:`=확장(예: `text-sm desktop:text-base`, `p-4 desktop:p-6`, `gap-2 desktop:gap-4`) |
| **연속 비례가 꼭 필요할 때** | 폭에 부드럽게 연속 비례해야 하는 특수 요소만 `clamp()`(폰트) 또는 cqw(요소 크기)를 쓴다. cqw는 토큰 우선 원칙(위 "작성 규칙"의 임의값 금지)에 따라 **사용 전 확인** |

> **Why:** root를 화면별로 축소하면 `1rem`이 화면마다 달라져(모바일 12px → `px-5`가 15px) 토큰의 실제 px을 예측할 수 없고, 디자인 시스템의 "단일 고정 규격"과 충돌한다. 또 사용자 브라우저 기본 글꼴(통상 16px)을 강제 축소하는 것은 접근성([WCAG 1.4.4](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html))에 불리하다. 크기 차등은 "자동"이 아니라 "의도적 토큰"으로 표현해야 코드에 드러나고 검증 가능하다.

### 금지/지양

- 신규 UA 기반 분기(`detectUserAgent`, `useDevice`로 모바일/데스크톱 나누기)
- 신규 모드별 컴포넌트 2벌 분리(`X.mobile`/`X.desktop`)
- 클라이언트 viewport 측정(`matchMedia`/리사이즈) — CLS 유발
- 디바이스 정보용 상태관리 라이브러리

> **Why:** 디자인 시스템은 단일 반응형 컴포넌트가 표준이다. UA 분기/모드별 2벌은 DS와 충돌하고 번들·하이드레이션 비용을 늘린다. 분기를 CSS로 일원화해 단순성과 성능을 함께 확보한다.
>
> **전환 메모:** 기존 적응형 코드(UA 분기, `useDevice`)는 스트랭글러 패턴으로 점진 제거한다. 전환 중에는 신구 공존을 허용하되, **신규 코드는 반드시 반응형**으로 작성한다.

## 색상 체계

### 포켓몬 타입별 커스텀 색상

`type-fire`, `type-water`, `type-grass` 등 18종 정의 (`tailwind.config.js`)

### 프로젝트 색상

| 토큰 | 용도 |
|------|------|
| `primary-1` ~ `primary-4` | 주요 브랜드 색상 |
| `white-1` ~ `white-3` | 배경/텍스트 밝은 톤 |
| `black-1` ~ `black-2` | 텍스트 어두운 톤 |

## CSS 최적화

- PostCSS + Autoprefixer + cssnano 적용
- 프로덕션 빌드 시 CSS 분리 최적화 (`next.config.js` webpack 설정)
