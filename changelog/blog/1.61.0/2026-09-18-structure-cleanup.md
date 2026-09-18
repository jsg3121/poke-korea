---
slug: structure-cleanup
title: '구조 개선 — 디바이스별 2벌 코드를 걷어내다'
description: '데스크톱·모바일이 각자 들고 있던 컴포넌트 4쌍과 훅 1쌍을 반응형 1벌로 합치고, 검색 로직 58줄을 훅으로 추출했습니다. useEffect 의존성 경고 6건도 함께 해소했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, bug-fix, css]
---

# 구조 개선 (Phase 1)

> **작업 날짜**: 2026-09-18
> **브랜치**: `feature/1.61.0-structure`

## 📋 작업 개요

**작업 유형**: 리팩토링 (중복 제거 + 훅 추출) + 버그 수정
**담당**: jsg3121, claude

[컨벤션 개편](/convention-overhaul)으로 세운 지침을 코드에 적용하는 첫 단계다. 지침이 금지하는 패턴 중 **구조에 해당하는 5건**을 처리했다.

## 🎯 작업 목표

**디바이스별로 갈라져 있던 코드를 하나로 합친다.**

`desktop/`과 `mobile/`이 같은 컴포넌트를 각자 들고 있었다. 한쪽을 고치면 다른 쪽은 그대로 남아, 시간이 지날수록 둘이 어긋났다. 실제로 이번에 합치면서 **한쪽에만 있던 버그와 한쪽에만 있던 기능**이 여럿 드러났다.

<!-- truncate -->

## 📉 왜 필요했나

### 2벌 구조는 고쳐도 절반만 고쳐진다

`SearchResultList`는 `desktop/`과 `mobile/`에 각각 있었다. 상대 경로로 import해 겉으로는 같은 파일처럼 보이지만 실제로는 별개다. 하위 컴포넌트 3개도 마찬가지로 2벌이었다.

같은 이름의 컴포넌트가 두 곳에 있으면 **에디터 탭에서 구분되지 않고**, "이 파일을 고치면 어디가 바뀌는가"를 경로로 따져야 한다.

### 어긋남은 이미 발생해 있었다

두 벌을 나란히 놓고 대조하니 차이가 드러났다.

| 항목                              | 데스크톱 | 모바일   |
| --------------------------------- | -------- | -------- |
| `ResultListData` 아이콘 요청 크기 | 32px     | **24px** |
| 바깥 클릭 훅 — 키보드(Esc·Tab)    | ✅       | **❌**   |
| 바깥 클릭 훅 — 터치(`touchstart`) | **❌**   | ✅       |

모바일 아이콘은 `width="2rem"`(32px)로 표시되는 자리에 24px 이미지를 요청하고 있었다. 1.33배 업스케일이라 흐리게 보인다.

바깥 클릭 훅은 더 분명하다. 한쪽이 다른 쪽의 부분집합이 아니라 **서로 다른 것을 하나씩 더 갖고 있었다.** 모바일에서는 키보드로 드롭다운을 닫을 수 없고, 터치스크린 노트북에서는 터치로 닫히지 않는다.

### 로직이 변수명까지 같았다

헤더 검색 컨테이너 두 개는 상단 58줄이 **한 글자도 다르지 않았다.** 검색 상태, debounce, GraphQL lazy query, 결과 노출 조건이 통째로 복사돼 있었다.

## ✨ 주요 변경사항

### 변경 1: `SearchResultList` 4쌍을 반응형 1벌로

`components/common/headerSearch/`로 합치고 차이는 브레이크포인트 변형으로 처리했다.

**변경 전** (파일 2개):

```tsx
// desktop
<div className="... absolute top-14 z-[100]">
// mobile
<div className="... absolute left-0 top-10 z-[600]">
```

**변경 후** (파일 1개):

```tsx
<div className="... absolute left-0 mobile:top-10 mobile:z-[600] desktop:top-14 desktop:z-[100]">
```

`left-0`은 양쪽 공통으로 뒀다. 두 호출부의 루트가 각각 `absolute`·`relative`로 **모두 positioning 컨텍스트를 형성**하고, 결과 목록이 `w-full` 직계 자식이라 동작이 같다. 데스크톱은 렌더 결과가 바뀌지 않으면서 정적 위치 의존만 사라진다.

하위 3개도 같은 방식으로 합쳤다.

| 컴포넌트            | 차이                         | 처리                               |
| ------------------- | ---------------------------- | ---------------------------------- |
| `ResultListLoading` | 없음                         | 그대로 1벌                         |
| `ResultListNoData`  | 제목 크기                    | `mobile:text-base desktop:text-xl` |
| `ResultListData`    | 이름 크기 + 아이콘 요청 크기 | 변형 + 32px 통일                   |

파일명에 `.component` 접미사를 붙이고 폴더명의 점 표기(`result.list`)를 `resultList`로 바꿔 새 지침을 적용했다.

### 변경 2: 바깥 클릭 훅 통합과 기능 보완

두 훅이 각자 갖고 있던 이벤트를 모두 구독한다.

| 이벤트              | 기존 데스크톱 | 기존 모바일 | 통합 후 |
| ------------------- | ------------- | ----------- | ------- |
| `mousedown`         | ✅            | ✅          | ✅      |
| `keydown` (Esc·Tab) | ✅            | ❌          | ✅      |
| `touchstart`        | ❌            | ✅          | ✅      |

**리스너 등록 자체를 `isActive`로 가드하도록 바꿨다.**

**변경 전**:

```ts
useEffect(() => {
  const handleMouseDown = (e: MouseEvent) => {
    if (isActive && ref.current && !ref.current.contains(e.target as Node)) {
      onOutsideClick()
    }
  }
  document.addEventListener('mousedown', handleMouseDown)
  // ...
}, [isActive, onOutsideClick, ref])
```

**변경 후**:

```ts
useEffect(() => {
  if (!isActive) {
    return
  }

  const handlePointerDown = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      onOutsideClick()
    }
  }
  // ...
}, [isActive, onOutsideClick, ref])
```

터치 기기는 탭 한 번에 `touchstart`와 합성 `mousedown`이 순차 발생한다. 핸들러 안에서 검사하는 구조에서는 두 이벤트가 같은 렌더 사이클에 묶일 때 중복 호출될 여지가 있다. 등록을 가드하면 첫 호출로 상태가 내려가는 순간 **이펙트가 정리되며 리스너가 제거**된다. 덤으로 닫혀 있는 대부분의 시간 동안 document 리스너가 붙어 있지 않게 된다.

### 변경 3: 검색 로직을 `useSearchPokemon`으로 추출

두 컨테이너에서 각각 58줄이 사라지고 6줄이 됐다.

```tsx
const {
  searchRef,
  isShowSearchResult,
  pokemonList,
  loading,
  handleChangeKeyword,
} = useSearchPokemon()
```

바깥 클릭 감지도 훅이 담는다. `searchRef`를 반환하는 시점에 이미 UI와 결합돼 있어, 호출부가 따로 연결하면 그 코드가 다시 2벌이 된다.

### 변경 4: `useEffect` 의존성 경고 6건 해소

6건 중 **4건은 억제 없이 사라졌다.** 구조로 해결되는 것을 `eslint-disable`로 덮지 않았다.

| 위치                                     | 처리                           | 억제         |
| ---------------------------------------- | ------------------------------ | ------------ |
| `DetailSearch` · `HeaderSearchContainer` | 함수를 이펙트 안으로 이동      | ❌           |
| `MainSearch`                             | 배열의 함수 호출을 변수로 추출 | ❌           |
| `TypeEffectivenessQuiz.context`          | 마운트 1회가 의도              | ✅ 사유 명시 |
| `useInfiniteScroll`                      | 가변 배열이라 정적 검증 불가   | ✅ 사유 명시 |

함수가 이펙트 전용이면 안으로 옮기는 것만으로 의존성 요구가 사라진다. 규칙을 속인 게 아니라 만족시킨 것이다.

`MainSearch`는 의존성 배열에 `routerQuery.get('name')`이라는 함수 호출이 들어 있어 정적 검증이 성립하지 않았다. 변수로 추출하니 `setValue` 누락 경고까지 함께 해소됐다. `nameParam || null`로 기존 falsy 처리는 그대로 보존했다.

### 변경 5: 기술 페이지 반복 구조 정리

**적용 필터 칩 3벌을 배열 순회로** 합쳤다. 삭제 동작도 분리했다.

**변경 전** — 같은 값을 두 번 넘겨 "같으면 삭제" 분기를 타게 하는 우회:

```tsx
onRemove={() => toggleParam('typeFilter', typeFilter, typeFilter)}
```

**변경 후**:

```tsx
onRemove={() => removeParam(key)}
```

`DetailMovesHero`의 폼 경로 3개는 중첩 삼항으로 되어 있었다. `buildFormPath` 하나로 합쳤다.

```tsx
const buildFormPath = (base: string, index: number) => {
  const safeIndex = Math.max(index, 0)
  if (isRegion) {
    return safeIndex > 0 ? `${base}/region/${safeIndex}` : `${base}/region`
  }
  return safeIndex > 0 ? `${base}/form/${safeIndex}` : base
}
```

## 🐛 버그 수정

### 모바일 검색 결과 아이콘 업스케일

`imageSize`는 표시 크기가 아니라 **이미지 요청 파라미터**다. 이 값으로 `?w=&h=` 쿼리와 WebP `srcSet`이 만들어진다. 모바일이 24를 넘기고 있어 32px 자리에 24px 이미지가 들어갔다. 32로 통일했다.

### 폼 슬라이드가 존재하지 않는 경로를 생성

`formDataLength`가 0 또는 1일 때 `nextFormHref`가 잘못된 값을 만들었다.

| `formDataLength` | 기존             | 수정 후  |
| ---------------- | ---------------- | -------- |
| 0                | `/moves/form/-1` | `/moves` |
| 1                | `/moves/form/0`  | `/moves` |

`Math.min(activeIndex + 1, formDataLength - 1)`이 음수가 되는 경우를 막지 못했다. 이 프로젝트는 0번 폼에 인덱스 세그먼트를 붙이지 않으므로 `/form/0`도 존재하지 않는 형태다.

두 경우 모두 `isLastForm`이 비활성 처리해 클릭되지는 않았다. 생성 자체가 정상화된 것이다.

## 🔍 검증

### 경로 생성 전수 대조

라우팅에 직결되는 변경이라 눈으로 확인하지 않았다. 기존 로직과 새 로직을 **216개 조합**(리전 여부 2 × 폼 개수 6 × 인덱스 6 × 경로 3종)으로 대조했다.

| 구간                                  | 결과                            |
| ------------------------------------- | ------------------------------- |
| `formDataLength ≥ 2` (실제 동작 구간) | **192개 전부 일치**             |
| `formDataLength ≤ 1`                  | 24건 차이 — 전부 위 버그 수정분 |

### 실제 라우트 요청

`curl`로 7개 경로를 요청했다. `/detail/6/moves/form/1`이 `/detail/6/moves`로 308 리다이렉트되는 것을 확인했다 — 라우팅 계층이 "인덱스 없는 기준 경로"로 정규화하고 있고, 새 함수가 처음부터 그 형태를 낸다.

### 정적 검사

| 항목                          | 결과          |
| ----------------------------- | ------------- |
| `tsc --noEmit`                | 0건           |
| ESLint 에러                   | 0건           |
| `react-hooks/exhaustive-deps` | 6건 → **0건** |

**확인하지 않은 것**: 실제 화면 렌더는 검증하지 않았다. 반응형 변형이 두 구간에서 의도대로 보이는지는 브라우저 확인이 필요하다.

## 📊 변경 결과

| 항목                    | 변경 전       | 변경 후     |
| ----------------------- | ------------- | ----------- |
| 디바이스별 중복 파일    | 9개           | **0개**     |
| `useEffect` 의존성 경고 | 6건           | **0건**     |
| 헤더 검색 컨테이너      | 104줄 · 106줄 | 58줄 · 60줄 |

전체 18개 파일에서 374줄이 사라지고 185줄이 추가됐다.

## 📌 후속 관찰 대상

Phase 1은 **구조**만 다뤘다. 지침 적용(Phase 2)은 미착수다.

- 폴더 복수형화(import 약 400곳) · 파일명 접미사 48개 · 컴포넌트 export 접미사 제거 140개
- tsconfig 엄격 옵션 — `useInfiniteScroll`의 `Array<any>`가 여기 포함된다
- `@ianvs` import 정렬 + `unused-imports` 설치
- 크롬을 layout으로 이동(29개 `page.tsx`) · 주석 정리(324파일)

`components/common/`을 이번에 신설했으나 아직 `headerSearch/` 하나만 들어 있다. Phase 2의 전역 폴더 재배치에서 나머지가 합류한다.
