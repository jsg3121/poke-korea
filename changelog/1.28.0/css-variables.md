# CSS Variables 중복 제거 및 단일 진실 공급원(Single Source of Truth) 구축

## 📋 작업 개요

**브랜치**: `feature/1.28.0-css-variables`
**작업 유형**: 리팩토링 (코드 품질 개선)
**작업 기간**: 2026-01-02
**담당**: Claude AI Assistant

## 🎯 작업 목표

프로젝트 내에 **중복 정의된 색상 값을 단일 진실 공급원(Single Source of Truth)**으로 통합하여 유지보수성을 향상시킵니다.

### 해결하려는 문제

1. **색상 중복 정의**: Tailwind Config와 CSS Variables에 동일한 색상이 두 번 정의됨
2. **불일치 위험**: `primary-4` 색상이 이미 두 곳에서 다른 값으로 정의됨
   - Tailwind: `#e0e7ec` (밝은 회색)
   - CSS Variables: `#dde6ed` (덜 밝은 회색)
3. **유지보수 어려움**: 색상 변경 시 두 곳을 모두 수정해야 함
4. **DRY 원칙 위반**: Don't Repeat Yourself 원칙 위배

## ✨ 주요 변경사항

### 변경 1: CSS Variables를 Tailwind theme() 함수로 변경

**목적**: Tailwind Config를 유일한 색상 정의 장소로 설정하고, CSS Variables는 참조만 하도록 변경

**변경 전** ([src/styles/globals.css:6-19](../src/styles/globals.css#L6-L19)):

```css
/* CSS 커스텀 속성 (CSS Variables) */
:root {
  --color-primary-1: #27374d;
  --color-primary-2: #526d82;
  --color-primary-3: #9db2bf;
  --color-primary-4: #dde6ed; /* ⚠️ Tailwind와 불일치! */
  --color-white-1: #ffffff;
  --color-white-2: #dddddd;
  --color-white-3: #f2f3f4;
  --color-black-1: #000000;
  --color-black-2: #333333;
  --color-shadow-1: #eeeeee;
  --color-shadow-2: #dddddd;
  --color-shadow-3: #838383;
}
```

**변경 후** ([src/styles/globals.css:5-22](../src/styles/globals.css#L5-L22)):

```css
/* CSS 커스텀 속성 (CSS Variables) - Tailwind theme()로 참조 */

/* 기본 스타일 재설정 */
@layer base {
  :root {
    --color-primary-1: theme('colors.primary-1');
    --color-primary-2: theme('colors.primary-2');
    --color-primary-3: theme('colors.primary-3');
    --color-primary-4: theme('colors.primary-4'); /* ✅ Tailwind 기준으로 통일 */
    --color-white-1: theme('colors.white-1');
    --color-white-2: theme('colors.white-2');
    --color-white-3: theme('colors.white-3');
    --color-black-1: theme('colors.black-1');
    --color-black-2: theme('colors.black-2');
    --color-shadow-1: theme('colors.shadow-1');
    --color-shadow-2: theme('colors.shadow-2');
    --color-shadow-3: theme('colors.shadow-3');
  }

  * {
    @apply box-border;
    -webkit-tap-highlight-color: transparent !important;
  }
```

**주요 변경점**:

- `@layer base` 안으로 `:root` 이동 (Tailwind 처리 순서 보장)
- 하드코딩된 색상 값을 `theme()` 함수로 참조
- `primary-4` 불일치 해결: Tailwind의 `#e0e7ec` 기준으로 통일

**주요 영향 파일**:

- [src/styles/globals.css](../src/styles/globals.css) (12줄 → 14줄)

---

### 변경 2: primary-4 색상 불일치 해결

**문제 상황**:

- **Tailwind Config** ([tailwind.config.js:16](../tailwind.config.js#L16)): `#e0e7ec`
- **CSS Variables** (기존): `#dde6ed`
- 실제 사용 현황:
  - `bg-primary-4`, `text-primary-4`, `border-primary-4`: **116개 파일에서 317회** 사용
  - `var(--color-primary-4)`: 8개 파일에서 사용 (주로 box-shadow)

**해결 방안**:

Tailwind 클래스가 압도적으로 많이 사용되므로, **Tailwind Config의 `#e0e7ec`를 기준**으로 통일

**결과**:

- 모든 `primary-4` 색상이 `#e0e7ec`로 통일됨
- `var(--color-primary-4)`도 `theme('colors.primary-4')`를 통해 동일한 값 참조

---

## 📊 최적화 결과

### 색상 정의 단순화

| 항목                     | 변경 전                  | 변경 후                                        | 개선 효과              |
| ------------------------ | ------------------------ | ---------------------------------------------- | ---------------------- |
| 색상 정의 장소           | 2곳 (중복)              | 1곳 (Tailwind Config)                          | 단일 진실 공급원 구축  |
| primary-4 불일치         | 2개 값 (`#e0e7ec` vs `#dde6ed`) | 1개 값 (`#e0e7ec`)                             | 불일치 완전 해소       |
| 색상 변경 시 수정 필요   | 2곳                      | 1곳                                            | 유지보수 50% 절감      |
| CSS Variables 정의 방식  | 하드코딩 (12줄)          | theme() 참조 (12줄)                            | 참조 방식으로 전환     |

### 영향 범위

- **수정된 파일**: 1개 (src/styles/globals.css)
- **삭제된 하드코딩 색상 값**: 12개
- **추가된 theme() 참조**: 12개
- **해결된 색상 불일치**: 1개 (primary-4)

---

## 🔧 기술적 세부사항

### Tailwind theme() 함수

**동작 방식**:

```css
/* Tailwind의 theme() 함수는 빌드 타임에 평가됩니다 */
--color-primary-1: theme('colors.primary-1');
/* ↓ 컴파일 후 */
--color-primary-1: #27374d;
```

**장점**:

1. **단일 진실 공급원**: Tailwind Config만 수정하면 전체 프로젝트에 반영
2. **타입 안정성**: Tailwind에 정의된 색상만 참조 가능
3. **빌드 타임 검증**: 존재하지 않는 색상 참조 시 빌드 에러 발생

### 호환성 보장

**기존 사용 방식 모두 유지**:

1. **Tailwind 클래스**: `bg-primary-4`, `text-primary-4` 등 → 변화 없음
2. **CSS Variables**: `var(--color-primary-4)` → 변화 없음 (값만 통일)
3. **직접 참조**: `background-color: var(--color-primary-4)` → 동작 유지

**영향 받는 파일 (var(--color-primary-4) 사용)**:

- [src/styles/globals.css](../src/styles/globals.css) (box-shadow)
- [src/components/moves/moveCard/MoveDetailCard.component.tsx](../src/components/moves/moveCard/MoveDetailCard.component.tsx)
- [src/components/moves/moveCard/MoveListCard.component.tsx](../src/components/moves/moveCard/MoveListCard.component.tsx)
- [src/components/ability/AbilityCard.component.tsx](../src/components/ability/AbilityCard.component.tsx)
- [src/container/mobile/detail/detail.summary/summary.stats/Stats.component.tsx](../src/container/mobile/detail/detail.summary/summary.stats/Stats.component.tsx)
- 기타 필터 모달 컴포넌트들

---

## ✅ 테스트 체크리스트

### 코드 품질

- [x] CSS Variables가 `@layer base` 안에 올바르게 정의됨
- [x] 모든 색상이 `theme()` 함수로 참조됨
- [x] primary-4 불일치가 해결됨 (#e0e7ec로 통일)

### 기능 테스트

- [ ] Tailwind 클래스 (`bg-primary-4`, `text-primary-4`) 정상 동작 확인
- [ ] CSS Variables (`var(--color-primary-4)`) 정상 동작 확인
- [ ] box-shadow에서 `var(--color-primary-4)` 색상 정상 렌더링
- [ ] 카드 컴포넌트의 box-shadow 정상 표시
- [ ] 필터 모달의 primary-4 색상 정상 표시

### 반응형 테스트

- [ ] 모바일 환경에서 색상 정상 렌더링
- [ ] 데스크톱 환경에서 색상 정상 렌더링
- [ ] 다크모드 (해당 시) 정상 동작

---

## 📝 향후 작업

### 추가 최적화 가능 항목

1. **타입 색상 변수화 (선택 사항)**
   - 현재: `#fd8181`, `#9b9bfa`, `#72d372` (badge-damage 클래스에 하드코딩)
   - 개선 방안: Tailwind Config에 추가 후 참조

2. **코너 폴드 색상 변수화 (선택 사항)**
   - 현재: `#334150` (card-corner-fold 클래스에 하드코딩)
   - 개선 방안: 색상 의미 파악 후 변수로 추출

3. **Phase 3: 타이포그래피 스케일 표준화**
   - 폰트 크기 및 line-height 시스템 표준화
   - 반응형 타이포그래피 개선

---

## 🚀 머지 정보

**머지 대상**: `feature/1.28.0`
**머지 예정일**: TBD
**관련 PR**: TBD

---

## 📌 참고 사항

### 중요 사항

1. **primary-4 색상이 `#dde6ed`에서 `#e0e7ec`로 변경됨**
   - 약간 더 밝은 회색으로 변경
   - 시각적 차이는 미미하나, 디자인 QA 필요

2. **GraphQL 타입 파일 에러**
   - 빌드 테스트 시 GraphQL 타입 파일 누락 에러 발생
   - CSS 변경과는 무관한 기존 프로젝트 문제
   - `npm run codegen` 실행으로 해결 가능

3. **Tailwind 빌드 타임 처리**
   - `theme()` 함수는 Tailwind가 빌드 시점에 평가
   - 런타임 오버헤드 없음

### 색상 변경 가이드 (향후 참고)

**이제 색상 변경 시 한 곳만 수정하면 됩니다**:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-4': '#e0e7ec', // ← 여기만 변경하면
        // ...
      },
    },
  },
}
```

**자동으로 다음이 모두 업데이트됩니다**:

- Tailwind 클래스: `bg-primary-4`, `text-primary-4`, `border-primary-4`
- CSS Variables: `var(--color-primary-4)`
- 전체 116개 파일, 317회 사용처 모두 반영

---

## 🔗 관련 문서

- [Phase 1 작업: CSS 패턴 추출 및 최적화](./refactor.md)
- [Tailwind CSS - theme() 함수 공식 문서](https://tailwindcss.com/docs/functions-and-directives#theme)
- [CSS Variables (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
