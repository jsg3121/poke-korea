# 스타일링 가이드

## 기본 원칙

- Tailwind CSS 유틸리티 클래스 우선 사용
- 전역 스타일: `src/styles/globals.css`
- SVG는 `@svgr/webpack`을 통해 React 컴포넌트로 import

**Why:** Tailwind 유틸리티 우선 접근으로 CSS 번들 크기를 최소화하고, 컴포넌트 단위의 스타일 관리를 용이하게 함.

## 브레이크포인트

| 이름 | 조건 |
|------|------|
| `mobile` | max-width: 768px |
| `desktop` | min-width: 769px |

> **중요:** 이 프로젝트는 **순수 적응형(Adaptive)** 이다([ADR-0006](../../decisions/records/ADR-0006-adaptive-rendering-strategy.md)). 컴포넌트 내부에서 viewport 미디어쿼리(`md:`/`sm:`/`lg:`/`xl:`)로 모바일/데스크톱을 분기하지 **않는다**. 분기는 UA 판별(`isMobile`)로 한다. `mobile:`/`desktop:`도 신규 코드에서는 지양하고, 아래 적응형 아키텍처를 따른다.

## 적응형 컴포넌트 아키텍처

모바일/데스크톱은 서버에서 UA로 판별해 분기한다(반응형 미디어쿼리 아님). 자세한 근거는 [ADR-0006](../../decisions/records/ADR-0006-adaptive-rendering-strategy.md).

### 공용 컴포넌트 결정 트리

차이의 "종류"에 따라 처리한다. 무조건 파일 분리가 아니다.

| 차이 유형 | 처리 | 예 |
|-----------|------|-----|
| **차이 없음** | 단일 컴포넌트 유지 (RSC) | Tag, Ball |
| **표현 차이** (크기·간격·폰트) | 단일 파일 + `isMobile` 조건부 클래스 | AbilityDescription |
| **구조 차이** (배치·순서·유무) | 뷰 분리(`X.mobile`/`X.desktop`) + client Wrapper가 `useDevice`로 분기 | FilterOptions(모범) |
| **로직 무거움** (①②와 직교) | 로직을 **순수 함수 모듈**(`src/module`)로 추출 (훅 ❌) | 카드 데이터 가공 |

### isMobile 전달 규칙 (CLS 0 + RSC 최대화)

| 컴포넌트 | 획득 방법 |
|----------|-----------|
| **서버 컴포넌트** | `getIsMobile()` (`cache()` + `headers()`) — prop·context 불필요, RSC 유지, 서버에서 스타일 확정 → CLS 0 |
| **클라이언트 컴포넌트** | `useDevice()` context (서버가 주입한 값) |

### 금지/지양

- 컴포넌트 내 viewport 미디어쿼리(`md:`/`sm:`/`lg:`/`xl:`)
- 클라이언트 viewport 측정(`matchMedia`/리사이즈) — CLS 유발, 적응형 위반
- RSC가 필요한 곳에서 `useDevice()` 훅 호출 (훅이라 client로 강등됨)
- 디바이스 정보용 상태관리 라이브러리 (오버엔지니어링)

> **Why:** 적응형/반응형 혼재를 없애 분기 규칙을 단일화하고, 스타일을 서버에서 확정해 CLS를 제거하며, 훅 대신 prop/함수로 RSC를 최대한 보존한다.

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
