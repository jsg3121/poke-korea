# ADR-0012: text-base 토큰 반응형화 (모바일 14px)

- 상태: 승인됨
- 날짜: 2026-07-12
- 관련: [ADR-0009](ADR-0009-root-font-size-fixed.md) (보완 — 대체 아님)

## 맥락

상세 페이지 개편 QA에서 모바일 텍스트가 전반적으로 과대하다는 피드백이 반복됐고
(라운드 1: 16→14px, 라운드 2: 12px 기준, 라운드 3: "홈·리스트 포함 전역에서 기본
폰트를 14px로"), 컴포넌트마다 `text-sm desktop:text-base`를 수동 병기하는 방식은
기존 페이지(홈·리스트 등)까지 소급하기 어렵고 누락이 생긴다.

ADR-0009는 root `font-size`를 16px로 고정했다(rem 자동 축소 폐기 — 토큰 px 예측성,
접근성). 이 결정은 유지하면서 "기본 본문 크기만" 전역 반응형이 필요하다.

## 결정

`text-base` **토큰 하나만** CSS 변수로 정의한다: 모바일 14px(0.875rem) →
데스크톱(769px+) 16px(1rem).

- `tailwind.config.js`: `base: 'var(--font-size-base)'`
- `globals.css`: `:root { --font-size-base: 0.875rem }` + `@media (min-width:
  769px) { --font-size-base: 1rem }`

## 근거

- **ADR-0009와 공존**: root font-size는 여전히 16px 고정 — `1rem = 16px` 예측성과
  spacing 등 다른 rem 토큰은 영향 없다. 바뀌는 것은 `text-base`라는 "의도적 토큰"의
  실값뿐이며, 이는 ADR-0009의 "크기 차등은 토큰으로 명시" 원칙의 구현 방식이다.
- **전역 일관성**: `text-base`를 쓰는 모든 화면(홈·리스트 포함)이 모바일에서 일괄
  14px — 수동 `text-sm desktop:text-base` 병기의 누락·중복을 없앤다.
- **모바일 55.6%** 비중에서 16px 본문은 카드 밀도가 낮아 스크롤 부담(사용자 실기기
  확인, 상세 개편 QA 라운드 1~3).

## 영향

- `text-base` 사용처 전체가 모바일에서 14px로 렌더된다(의도된 전역 효과).
- 고정 높이+`text-aligned-*` 조합은 폰트가 작아져도 수직 중앙 정렬 유지(라인하이트
  기준이라 무해).
- 새 코드에서 "모바일 14/데스크톱 16"이 필요하면 `text-base` 하나로 충분 —
  `text-sm desktop:text-base` 병기는 더 이상 쓰지 않는다.

## 참고 자료

- [Tailwind — Theme(fontSize에 CSS 변수 사용)](https://tailwindcss.com/docs/theme)
- [MDN — CSS 사용자 정의 속성과 미디어쿼리](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html) — root 고정 유지가 전제
