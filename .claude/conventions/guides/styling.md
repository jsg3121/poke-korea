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
