# ADR-0009: root font-size 16px 고정 (반응형 폰트 스케일링 폐기)

- **상태**: 승인
- **날짜**: 2026-06-23
- **담당**: jsg3121 + Claude

## 맥락

`globals.css`는 화면 폭에 따라 `html, body`의 `font-size`를 미디어쿼리로 바꾸고 있었다.

```css
@media (min-width: 960px)            { html, body { font-size: 16px; min-width: 960px } }
@media (680px ~ 959px)               { html, body { font-size: 14px; min-width: 845px } }
@media (max-width: 679px)            { html, body { font-size: 12px } }
```

이 구조는 **모든 `rem` 단위가 화면 폭에 따라 함께 스케일**되게 한다. 모바일(≤679px)에선
`1rem = 12px`라서:

- `px-5`(1.25rem) → 모바일 실제 **15px**, 데스크톱 **20px** (같은 클래스인데 px이 다름)
- `text-base`(1rem) → 모바일 **12px**, 데스크톱 **16px**

[ADR-0008](./ADR-0008-storybook-design-system.md) 기반으로 디자인 시스템을 토큰으로
규격화하는 중인데, **1rem이 화면마다 다르면 토큰의 실제 크기를 예측할 수 없다**. 예를 들어
PokemonCard `w-56`(14rem)이 모바일에선 168px, 데스크톱에선 224px로 달라져, "단일 고정
규격"이라는 DS 원칙([ds-pokemon-card](../../../changelog/blog/1.54.0/2026-06-23-ds-pokemon-card.md))과
정면으로 충돌한다. 모바일 좌우 여백(gutter)을 px 기준으로 통일하는 것도 불가능하다.

또한 함께 묶인 `min-width: 960px`/`845px`는 [ADR-0006](./ADR-0006-adaptive-rendering-strategy.md)
적응형 시절의 "데스크톱 최소 너비 강제" 잔재로, [ADR-0007](./ADR-0007-responsive-rendering-strategy.md)
반응형 전환과 충돌한다(모바일에서 가로 스크롤 유발 가능).

## 결정

1. **root `font-size`를 16px 고정**한다. 화면별 `font-size` 미디어쿼리(14px/12px 분기)를 제거한다.
2. 함께 묶인 **`min-width: 960px`/`845px` 제약도 제거**한다(반응형 전환 완료).
3. 디자인 시스템은 **모바일 퍼스트**로, `1rem = 16px` 단일 기준 위에서 토큰을 설계한다.
   화면별 크기 차이는 `rem` 자동 스케일이 아니라 **명시적 반응형 토큰**(`text-sm desktop:text-base` 등)으로 표현한다.

## 근거

- **토큰 예측 가능성**: `1rem`이 모든 화면에서 16px로 고정돼야 토큰의 실제 px이 일관된다.
  DS의 전제 조건이다.
- **W3C/접근성 권장**: 사용자 브라우저 기본 글꼴 크기(통상 16px)를 개발자가 강제로 12px까지
  축소하는 것은 가독성·접근성에 불리하다. WCAG는 사용자가 텍스트를 200%까지 확대해도
  깨지지 않을 것을 요구하는데, root를 임의 축소하면 사용자 설정과 어긋난다.
  ([MDN: rem](https://developer.mozilla.org/en-US/docs/Web/CSS/length#rem),
  [WCAG 1.4.4 Resize text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html))
- **모바일 퍼스트 표준**: base 스타일을 모바일로 두고 `desktop:`으로 확대하는 방식이
  Tailwind 권장 패턴이며, rem 자동 스케일보다 의도가 코드에 드러난다.
  ([Tailwind: Responsive Design](https://tailwindcss.com/docs/responsive-design))
- **배포 전제**: "모든 페이지 개편 완료 전 상용 배포 없음"이라, 기존 화면의 실제 px이
  바뀌는 광범위한 변경을 안전하게 수행할 수 있다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| 가변 rem 스케일링 유지(현행) | 한 번 짠 크기가 화면비례로 자동 축소 | 1rem이 화면마다 달라 토큰 px 예측 불가, gutter px 통일 불가, 접근성 불리 | DS 토큰 체계의 전제와 충돌 |
| root 16px 고정 + 모바일 퍼스트 (채택) | 토큰 px 일관, 접근성 양호, 의도 명시적 | 기존 전 화면 px 변경 → 전수 재검증 필요 | 미배포 전제로 리스크 흡수 가능 |
| `clamp()` 유동 타이포 | 폭에 따라 폰트 부드럽게 가변 | rem 토큰 px은 여전히 가변, 복잡도 증가 | 토큰 예측성 문제 동일하게 남음 |

## 결과

- 모바일(≤679px)에서 모든 rem 기반 크기가 약 1.33배(12→16px) 커진다. 기존 모바일
  레이아웃은 재검증·재설계 대상(어차피 페이지별 전면 개편 중).
- `min-width` 제약 제거로 좁은 뷰포트에서 가로 스크롤이 사라진다.
- 이후 DS 컴포넌트·페이지는 `1rem=16px` 모바일 퍼스트 기준으로 작성한다.
- 보류된 QuizCard 등 기존 DS 초안은 16px 고정 기준으로 재검증한다.
- 모바일 gutter 표준(좌우 여백)을 px 기준으로 확정할 수 있게 된다(후속 작업).

## 참고 자료

- [ADR-0007 반응형 렌더링 전략](./ADR-0007-responsive-rendering-strategy.md)
- [ADR-0008 Storybook 디자인 시스템](./ADR-0008-storybook-design-system.md)
- [MDN — CSS length: rem](https://developer.mozilla.org/en-US/docs/Web/CSS/length#rem)
- [WCAG 2.1 — 1.4.4 Resize text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)
- [Tailwind CSS — Responsive Design](https://tailwindcss.com/docs/responsive-design)
