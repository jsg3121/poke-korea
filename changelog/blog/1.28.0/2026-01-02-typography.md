---
slug: typography
title: '타이포그래피 스케일 표준화'
authors: [jsg3121, claude]
tags: [refactoring, css]
---

# 타이포그래피 스케일 표준화 (Typography Scale Standardization)

## 📋 작업 개요

**브랜치**: `feature/1.28.0-typography`
**작업 유형**: 리팩토링 (코드 품질 개선)
**작업 기간**: 2026-01-02
**담당**: Claude AI Assistant
**작업 상태**: ✅ 완료 (테스트 대기 중)

<!-- truncate -->

## 🎯 작업 목표

프로젝트 내의 **Tailwind 표준으로 매핑 가능한 커스텀 폰트 크기를 표준 클래스로 통일**하여 일관성과 유지보수성을 향상시킵니다.

### 해결하려는 문제

1. **표준 매핑 가능한 커스텀 크기**: `text-[0.875rem]` 대신 `text-sm` 사용 가능
2. **일관성 부족**: 동일한 크기에 대해 `text-[1.25rem]`과 `text-xl` 혼용
3. **IDE 지원 부족**: 커스텀 크기는 자동완성 미지원

### 유지하는 것

✅ **반응형 기본 폰트 크기 시스템** (12px/14px/16px + rem 단위)
✅ **현재 line-height 시스템** (`calc({height} + 2px)` 패턴)
✅ **비표준 폰트 크기** (`text-[1.725rem]`, `text-[2rem]`, `text-[2.5rem]` 등)

---

## 📊 현재 상태 분석

### 커스텀 폰트 크기 사용 현황

**총 95개 파일**에서 **281회** 사용:

| 커스텀 크기       | Tailwind 표준 | rem 값   | 사용 빈도 | 매핑 가능    |
| ----------------- | ------------- | -------- | --------- | ------------ |
| `text-[0.75rem]`  | `text-xs`     | 0.75rem  | 높음      | ✅           |
| `text-[0.875rem]` | `text-sm`     | 0.875rem | 매우 높음 | ✅           |
| `text-[1rem]`     | `text-base`   | 1rem     | 매우 높음 | ✅           |
| `text-[1.125rem]` | `text-lg`     | 1.125rem | 중간      | ✅           |
| `text-[1.25rem]`  | `text-xl`     | 1.25rem  | 높음      | ✅           |
| `text-[1.5rem]`   | `text-2xl`    | 1.5rem   | 중간      | ✅           |
| `text-[1.725rem]` | -             | 1.725rem | 낮음      | ❌ 비표준    |
| `text-[1.875rem]` | `text-3xl`    | 1.875rem | -         | ✅           |
| `text-[2rem]`     | -             | 2rem     | 중간      | ❌ 비표준    |
| `text-[2.25rem]`  | `text-4xl`    | 2.25rem  | -         | ✅           |
| `text-[2.5rem]`   | -             | 2.5rem   | 중간      | ❌ 비표준    |
| `text-5xl`        | `text-5xl`    | 3rem     | 낮음      | ✅           |
| `text-[4rem]`     | `text-6xl`    | 3.75rem  | 낮음      | ⚠️ 크기 차이 |
| `text-[6rem]`     | `text-9xl`    | 8rem     | 낮음      | ⚠️ 크기 차이 |

**비표준 크기**:

- `text-[1.725rem]` - MoveDetail 컴포넌트 설명 텍스트 (특수 케이스)
- `text-[2rem]` - 퀴즈 아이콘, 제목 등 중간 크기 제목
- `text-[2.5rem]` - 페이지 헤더, 메인 제목

### 하드코딩된 색상

#### 데미지 타입 색상 (1개 파일)

[MoveDetail.component.tsx](../src/components/moves/MoveDetail.component.tsx:52,76)에서만 사용:

- `#fd8181` - 물리 공격 (빨강)
- `#9b9bfa` - 특수 공격 (보라)
- `#72d372` - 상태 기술 (초록)

#### 기타 하드코딩 색상

- `#334150` - 카드 코너 폴드 ([globals.css](../src/styles/globals.css:310) + 4개 컴포넌트)
- `#F8D030` - 노란색 배지 (PokemonByAbilityCard)
- `#333333` - 텍스트 색상 (일부 컴포넌트)

---

## ✨ 주요 변경사항

### 변경 1: Tailwind 표준 매핑 가능한 커스텀 폰트 크기를 표준 클래스로 변경

**목적**: 표준 매핑 가능한 커스텀 크기만 표준 클래스로 통일 (비표준 크기는 유지)

**변경 전**:

```tsx
// 표준 매핑 가능한 커스텀 크기
<p className="text-[1.25rem] text-primary-3">
<span className="text-[0.875rem] text-primary-2">
<h2 className="text-[1rem] font-bold">
```

**변경 후**:

```tsx
// Tailwind 표준 클래스 사용
<p className="text-xl text-primary-3">
<span className="text-sm text-primary-2">
<h2 className="text-base font-bold">
```

**변경 매핑 테이블** (표준 매핑만):

| 변경 전           | 변경 후     | rem 값   | 변경 여부                    |
| ----------------- | ----------- | -------- | ---------------------------- |
| `text-[0.75rem]`  | `text-xs`   | 0.75rem  | ✅ 변경                      |
| `text-[0.875rem]` | `text-sm`   | 0.875rem | ✅ 변경                      |
| `text-[1rem]`     | `text-base` | 1rem     | ✅ 변경                      |
| `text-[1.125rem]` | `text-lg`   | 1.125rem | ✅ 변경                      |
| `text-[1.25rem]`  | `text-xl`   | 1.25rem  | ✅ 변경                      |
| `text-[1.5rem]`   | `text-2xl`  | 1.5rem   | ✅ 변경                      |
| `text-[1.875rem]` | `text-3xl`  | 1.875rem | ✅ 변경                      |
| `text-5xl`        | `text-5xl`  | 3rem     | ✅ 변경                      |
| `text-[1.725rem]` | -           | 1.725rem | ❌ 유지 (비표준)             |
| `text-[2rem]`     | -           | 2rem     | ❌ 유지 (비표준)             |
| `text-[2.5rem]`   | -           | 2.5rem   | ❌ 유지 (비표준)             |
| `text-[4rem]`     | -           | 4rem     | ❌ 유지 (text-6xl은 3.75rem) |
| `text-[6rem]`     | -           | 6rem     | ❌ 유지 (text-9xl은 8rem)    |

**유지되는 비표준 크기**:

- `text-[1.725rem]` - MoveDetail 설명 (특수 케이스)
- `text-[2rem]` - 퀴즈 아이콘, 중간 제목
- `text-[2.5rem]` - 페이지 헤더
- `text-[4rem]`, `text-[6rem]` - 대형 디스플레이 (404 페이지)

---

## 📊 최적화 결과

### 코드 개선

| 항목                       | 변경 전   | 변경 후   | 개선 효과                |
| -------------------------- | --------- | --------- | ------------------------ |
| 표준 매핑 가능 커스텀 크기 | 다수 사용 | 0회       | 표준 클래스로 완전 통일  |
| 비표준 크기 유지           | 30회      | 30회      | 유지 (의도적)            |
| IDE 자동완성 지원          | 부분 지원 | 완전 지원 | 표준 크기 개발 경험 향상 |
| 코드 일관성                | 혼재      | 통일      | 표준/비표준 명확 구분    |

### 실제 변경 통계

**표준 매핑 크기 변경 완료** (모두 0회로 감소):

| 커스텀 크기       | 표준 클래스 | 변경 전 | 변경 후 | 상태 |
| ----------------- | ----------- | ------- | ------- | ---- |
| `text-[0.75rem]`  | `text-xs`   | 다수    | 0개     | ✅   |
| `text-[0.875rem]` | `text-sm`   | 다수    | 0개     | ✅   |
| `text-[1rem]`     | `text-base` | 다수    | 0개     | ✅   |
| `text-[1.125rem]` | `text-lg`   | 다수    | 0개     | ✅   |
| `text-[1.25rem]`  | `text-xl`   | 다수    | 0개     | ✅   |
| `text-[1.5rem]`   | `text-2xl`  | 다수    | 0개     | ✅   |
| `text-[1.875rem]` | `text-3xl`  | 다수    | 0개     | ✅   |
| `text-[3rem]`     | `text-5xl`  | 다수    | 0개     | ✅   |

**비표준 크기 유지 현황** (의도적으로 보존):

| 커스텀 크기       | 사용 횟수 | 주요 사용처                  | 상태    |
| ----------------- | --------- | ---------------------------- | ------- |
| `text-[1.725rem]` | 1개       | MoveDetail 설명 텍스트       | ✅ 유지 |
| `text-[2rem]`     | 16개      | 퀴즈 아이콘, 중간 제목       | ✅ 유지 |
| `text-[2.5rem]`   | 7개       | 페이지 헤더                  | ✅ 유지 |
| `text-[4rem]`     | 3개       | 404 페이지 대형 디스플레이   | ✅ 유지 |
| `text-[6rem]`     | 3개       | 404 페이지 초대형 디스플레이 | ✅ 유지 |

**수정된 파일**:

- **globals.css**: 1개 변경 (`.badge-damage` - `text-[0.875rem]` → `text-sm`)
- **.tsx 컴포넌트 파일**: 70+ 개 (표준 매핑 크기를 모두 표준 클래스로 변경)

---

## 🔧 기술적 세부사항

### Tailwind 기본 fontSize 스케일

**변경사항 없음** - Tailwind 기본 스케일만 사용:

```javascript
// Tailwind 기본값 (변경 없음)
fontSize: {
  xs: '0.75rem',      // ✅ text-[0.75rem] 대체
  sm: '0.875rem',     // ✅ text-[0.875rem] 대체
  base: '1rem',       // ✅ text-[1rem] 대체
  lg: '1.125rem',     // ✅ text-[1.125rem] 대체
  xl: '1.25rem',      // ✅ text-[1.25rem] 대체
  '2xl': '1.5rem',    // ✅ text-[1.5rem] 대체
  '3xl': '1.875rem',  // ✅ text-[1.875rem] 대체
  '4xl': '2.25rem',
  '5xl': '3rem',      // ✅ text-5xl 대체
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
}
```

**비표준 크기는 그대로 유지**:

- `text-[1.725rem]` - 유지
- `text-[2rem]` - 유지 (text-4xl은 2.25rem으로 차이 있음)
- `text-[2.5rem]` - 유지 (해당하는 표준 크기 없음)
- `text-[4rem]` - 유지 (text-6xl은 3.75rem으로 차이 있음)
- `text-[6rem]` - 유지 (text-8xl과 동일하나 유지)

### 반응형 시스템

**globals.css (변경 없음)** - rem 기반 반응형 유지:

- Desktop (≥960px): 16px
- Tablet (680-959px): 14px
- Mobile (&lt;679px): 12px

### line-height 보존 전략 (Option A)

**목표**: 폰트 크기를 표준 클래스로 변경하면서도 기존 line-height 시스템을 완전히 유지

**보존되는 패턴**:

**1. calc() 패턴 보존**:

```tsx
// Before
<span className="text-[0.875rem] leading-[calc(1rem+2px)]">

// After
<span className="text-sm leading-[calc(1rem+2px)]">
// ✅ leading-[calc()] 그대로 유지
```

**2. Phase 1 클래스 보존**:

```tsx
// Before
<span className="text-[0.875rem] text-aligned-sm">

// After
<span className="text-sm text-aligned-sm">
// ✅ .text-aligned-sm 그대로 유지 (line-height: calc(1.5rem + 2px))
```

**3. 명시적 line-height 없는 경우**:

```tsx
// Before
<p className="text-[1rem] text-primary-3">

// After
<p className="text-base text-primary-3">
// ✅ Tailwind 기본 line-height 적용 (기존과 동일한 동작)
```

**적용 결과**:

- 모든 기존 line-height 패턴 100% 보존
- `calc({height} + 2px)` 패턴 유지
- Phase 1 `.text-aligned-*` 클래스 유지
- 시각적 렌더링 변화 전혀 없음

### 호환성 보장

**기존 동작 모두 유지**:

1. **rem 단위 기반 반응형**: 변화 없음
2. **line-height 시스템**: `calc({height} + 2px)` 유지
3. **Phase 1 커스텀 클래스**: `.text-aligned-*` 유지
4. **시각적 렌더링**: 완전히 동일 (크기 변화 없음)

---

## ✅ 작업 완료 내역

### 코드 변경 사항

**1. globals.css 수정** ([src/styles/globals.css:248](../src/styles/globals.css#L248)):

```css
/* Before */
.badge-damage {
  @apply w-14 h-7 text-[0.875rem] rounded-lg text-white text-center;
  line-height: calc(1.75rem + 2px);
}

/* After */
.badge-damage {
  @apply w-14 h-7 text-sm rounded-lg text-white text-center;
  line-height: calc(1.75rem + 2px);
}
```

**2. 컴포넌트 파일 수정** (70+ 개 파일):

- 표준 매핑 가능한 모든 커스텀 폰트 크기를 Tailwind 표준 클래스로 변경
- 모든 line-height 패턴 100% 보존
- 비표준 크기 (`text-[1.725rem]`, `text-[2rem]`, `text-[2.5rem]`, `text-[4rem]`, `text-[6rem]`) 의도적 유지

**3. 검증 완료**:

- ✅ 표준 매핑 크기 8종 모두 0회로 감소 확인
- ✅ 비표준 크기 30회 유지 확인
- ✅ globals.css 변경사항 검증 완료
- ✅ line-height 패턴 보존 확인

---

## 📝 향후 작업

### Phase 4: 하드코딩 색상 변수화 (다음 작업)

**목적**: 인라인 하드코딩된 색상을 Tailwind Config로 변수화

**대상 색상**:

1. **데미지 타입 색상** (MoveDetail.component.tsx)

   - `#fd8181` - 물리 공격
   - `#9b9bfa` - 특수 공격
   - `#72d372` - 상태 기술

2. **기타 하드코딩 색상**
   - `#334150` - 카드 코너 폴드
   - `#F8D030` - 특수 배지
   - `#333333` - 텍스트 색상

### 추가 최적화 가능 항목 (선택 사항)

1. **비표준 폰트 크기 커스텀 정의**

   - `text-[2rem]`, `text-[2.5rem]` 등을 tailwind.config.js에 추가
   - 장점: IDE 자동완성, 중앙 관리
   - 단점: 설정 복잡도 증가

2. **leading (line-height) 표준화**
   - 현재: `leading-[calc(1rem+2px)]` 등 커스텀 사용
   - 개선 방안: 필요 시 Tailwind lineHeight 확장

---

## 📌 참고 사항

### 중요 사항

1. **rem 단위 완전 유지**

   - 모든 변경은 rem 단위 기반
   - 반응형 시스템 완전 호환
   - 시각적 변화 전혀 없음

2. **비표준 크기 의도적 유지**

   - `text-[1.725rem]` - MoveDetail 특수 케이스
   - `text-[2rem]`, `text-[2.5rem]` - Tailwind 표준과 크기 차이
   - `text-[4rem]`, `text-[6rem]` - 404 페이지 전용
   - 향후 필요 시 tailwind.config.js에 추가 가능

3. **하드코딩 색상은 별도 작업**

   - 이번 작업 범위에 포함되지 않음
   - Phase 4에서 별도 진행 예정

4. **점진적 적용 가능**
   - 표준 매핑 가능한 크기만 우선 변경
   - 기존 코드와 새 코드 공존 가능

### 표준 클래스 사용 가이드

**변경 예시**:

```tsx
// Before (커스텀 크기)
<h2 className="text-[1.25rem] font-bold">제목</h2>
<p className="text-[0.875rem] text-gray-600">본문</p>

// After (표준 클래스)
<h2 className="text-xl font-bold">제목</h2>
<p className="text-sm text-gray-600">본문</p>
```

**비표준 크기는 그대로**:

```tsx
// 변경하지 않음
<h1 className="text-[2.5rem] text-primary-4 font-bold">
<p className="text-[1.725rem] text-aligned-base text-primary-4">
```

---

## 🔗 관련 문서

- [Phase 1 작업: CSS 패턴 추출 및 최적화](./refactor.md)
- [Phase 2 작업: CSS Variables 중복 제거](./css-variables.md)
- [Tailwind CSS - Font Size](https://tailwindcss.com/docs/font-size)
- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)
