---
slug: list-search
title: '목록 검색 동작 통일 — 디바운스 자동 검색, 초기화 동기화, react-hook-form 제거'
description: '도감 목록 검색을 데스크톱·모바일 모두 디바운스 자동 검색으로 맞추고, URL 검색어 입력을 공통 훅으로 묶어 초기화 시 입력창이 비워지지 않던 문제를 고쳤으며, react-hook-form 의존성을 제거했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, bug-fix, feature-improvement]
---

# 목록 검색 동작 통일 — 디바운스 자동 검색, 초기화 동기화, react-hook-form 제거

> **작업 날짜**: 2026-10-21
> **브랜치**: `feature/1.62.0-list-search`

## 📋 작업 개요

**작업 유형**: 리팩토링 / 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

검색어를 URL 쿼리에 두는 검색창(도감 목록 데스크톱·모바일, 기술 목록, 특성 목록)의 동작과 구현을 하나로 맞춘다. 디바운스 구현을 단순하게 정리하고, 쓰임이 거의 없던 react-hook-form을 걷어낸다.

<!-- truncate -->

## 📉 왜 필요했나

- **도감 목록의 데스크톱·모바일 동작이 달랐다.** 데스크톱은 제출할 때 `router.push`, 모바일은 입력 후 500ms 자동 반영 + `router.replace`였다. UX-004는 "데/모 동작 일치"를 정했지만 구현이 갈라져 있었다.
- **디바운스 훅이 두 개였고, 같은 일(URL 갱신)에 둘 다 쓰였다.** 모바일은 값 방식 `useDebounce` + effect였는데, `searchParams`를 의존성에서 빼느라 `eslint-disable`이 붙어 있었다. 기술·특성은 `useDebouncedCallback`을 썼고, 이 훅은 렌더 중에 ref를 덮어썼다.
- **초기화 버튼을 눌러도 입력창의 검색어가 남았다.** 비제어 input의 `defaultValue`는 마운트할 때만 적용된다. 그래서 도감 목록 "초기화"와 기술 목록의 "검색·필터 초기화"(결과가 없을 때 노출)로 URL의 검색어가 지워져도 입력창은 그대로였다(기술 목록에서 재현 확인).
- **react-hook-form은 두 곳에서만 쓰였고, 핵심 기능(검증·에러·dirty 상태)은 쓰지 않았다.** `FormProvider`는 하위에서 읽는 곳이 없었다.

결정 근거와 기각한 대안은 [ADR-0023](https://github.com/jsg3121/poke-korea/blob/main/.claude/decisions/records/ADR-0023-search-input-url-sync.md)에 정리했다.

## ✨ 주요 변경사항

### 변경 1: URL 검색어 입력 공통 훅 `useSearchParamInput`

검색창 네 곳이 같은 훅을 쓴다. 쿼리 키(`name`, `search`)만 넘긴다.

```ts
const { keyword, updateKeyword } = useSearchParamInput('search')
```

- **입력이 멈추면 URL에 반영**: 입력값 state를 effect로 URL에 동기화한다. 타이머는 effect 클로저 안에 두고, 입력값이 바뀌면 cleanup이 이전 타이머를 취소한다. ref와 `useCallback`을 쓰지 않는다.
- **의존성을 모두 채웠다**: `eslint-disable`이 없다. 입력값과 URL 값이 같으면 아무것도 하지 않으므로, 마운트할 때 URL을 건드리지 않는다. 입력 중 다른 필터가 바뀌면 최신 `searchParams`로 다시 실행된다.
- **다 지우면 즉시 반영**: 검색어를 완전히 지우면 디바운스 없이 바로 전체 목록이 나온다. 글자를 일부만 지울 때는 입력과 같이 500ms 뒤에 반영한다.
- **그 사이 입력이 없을 때만 바뀐 URL 검색어를 따라간다**: URL 검색어가 바뀌면, 입력값이 직전 URL 검색어와 같을 때만(사용자가 그 뒤로 입력하지 않았을 때만) 입력값을 새 값으로 바꾼다. 초기화하면 입력창이 비워지고, 응답을 기다리는 동안 친 글자는 보존된다. 렌더 중에 state를 조정하는 패턴이라 effect가 필요 없다.

### 변경 2: 도감 목록 데스크톱 검색을 자동 검색으로 (`MainSearch`)

- 제출 방식(`router.push`)을 디바운스 자동 검색(`router.replace`)으로 바꿨다. 검색어마다 방문 기록이 쌓이지 않는다.
- react-hook-form(`useForm`, `FormProvider`, `watch`, 동기화 effect)을 지웠다. 라벨 애니메이션은 `keyword !== ''`로 계산한다.
- 제출 버튼을 지우고, 돋보기는 같은 위치의 장식 이미지(`aria-hidden`, `alt=""`)로 남겼다.

### 변경 3: 모바일·기술·특성 검색에 공통 훅 적용

- `ListSearch`: 값 방식 `useDebounce` + effect + `eslint-disable`을 걷어냈다.
- `MovesSearch`, `AbilitySearch`: 직접 작성했던 디바운스 URL 쓰기 로직을 걷어내고 제어 input(`value={keyword}`)으로 바꿨다.

### 변경 4: 디바운스 훅 정리 (`useDebounce.ts`)

- `useDebouncedCallback`을 삭제했다. 사용처는 모두 `useSearchParamInput`으로 옮겼다.
- `useDebounce`는 state + effect 구현으로 단순화했다. 헤더 포켓몬 검색과 상성 계산기 이름 입력처럼 디바운스된 값을 쿼리 변수로 쓰는 곳에서만 쓴다.

### 변경 5: 필터 모달에서 react-hook-form 제거 (`FilterModalForm`)

**변경 전**: `useForm` 기본값, `watch`·`getValues`·`setValue`로 세대 배열을 직접 관리, `register`로 라디오 연결

**변경 후**: 비제어 input에 `name`을 주고, 제출할 때 `FormData`로 읽는다.

```ts
const formData = new FormData(e.currentTarget)
params.delete('generation')
formData
  .getAll('generation')
  .forEach((gen) => params.append('generation', String(gen)))
```

URL의 `generation` 순서는 체크한 순서에서 화면 순서(1→9세대)로 바뀐다. 필터 결과는 같다.

### 변경 6: 의존성·문서

- `react-hook-form`을 `package.json`에서 지우고, CLAUDE.md 기술 스택 표의 "폼 관리" 줄을 지웠다.
- ADR-0023 작성, UX-004 검색 동작 개정, 이름 입력 기획서의 디바운스 훅 설명 정정.
- `linting.md`·`comments.md`의 `exhaustive-deps` 억제 사유 예시를 실제 사례로 바꿨다(`linting.md`는 사유 위치도 지시문 위로 정정).

## 🔍 검증

- `tsc --noEmit`, `npm run lint`, Prettier: 통과
- 브라우저 확인(사용자):
  - 도감 목록 데스크톱·모바일: 진입 시 검색어 유지, 첫 검색, 한글 연속 입력, 다 지우면 즉시 반영, 초기화 시 입력창 비우기
  - 기술 목록: "검색·필터 초기화" 후 입력창 비우기
  - 필터 모달: 세대·라디오 제출, 다시 열었을 때 상태 유지
- QA 종합 검증(lint-check·code-review·a11y-check·e2e-check): code-review가 아래 "다 지운 직후 입력 유실"을 차단 항목으로 지적해 수정했다. e2e-check는 흐름 20개 × 모바일·데스크톱 40회 통과.
- 입력 유실 수정 확인: RSC 응답을 50·150·300ms 늦춘 E2E에서 수정 전에는 150ms에서 입력이 지워졌고, 수정 후 모두 통과했다.
- `npm run build`는 개발 서버와 `.next`를 공유해서 실행하지 않았다.

## ⚠️ 구현 시 고려한 점

- **ref + `useCallback` 이벤트 방식에서 effect 방식으로 바꿨다.** 처음에는 React 문서의 "부수 효과는 이벤트 핸들러에" 권장에 따라 `useDebouncedCallback`으로 구현했다. 그런데 타이머가 끝날 때 최신 값을 읽으려면 ref 두 개와 `useCallback`이 필요했다. 의존성을 모두 채운 effect는 그 역할을 클로저와 cleanup으로 대신하고, 예전 effect 방식의 문제(`eslint-disable`, 마운트 버그)도 생기지 않아 최종적으로 이쪽을 택했다.
- **첫 구현의 초기화 감지 버그.** "URL 검색어가 비어 있으면 비운다"로 판단하니, 파라미터가 없는 상태에서 첫 검색어를 쓸 때 서버 응답 전까지 URL이 비어 있어서 입력창이 비워졌다. 이 버그는 데스크톱에서 재현됐다. 이후 "비워지는 변화"로 판단하도록 고쳤다.
- **두 번째 초기화 감지 버그.** "비워지는 변화가 있으면 비운다"는 검색어를 다 지운 직후 응답 전에 친 글자를, 응답이 도착할 때 지웠다(다음 글자 입력 후 500ms 안에 응답이 오면 발생). 입력값이 직전 URL 값과 같을 때만 따라가는 조건으로 바꿔, 상태를 늘리지 않고 해결했다. 같은 조건으로 다른 검색어로의 외부 변경도 따라간다. 남는 한계는 입력 후 500ms 안에 초기화를 누르면 대기 중인 검색어가 반영된다는 점이다.
- **마지막으로 쓴 값(`lastWritten`) 추적은 넣지 않았다.** 응답을 기다리는 동안의 드문 입력까지 막을 수 있지만, 상태와 분기가 늘어나는 데 비해 효과가 작아 단순함을 택했다.
- **input `key`로 다시 마운트하는 방식은 기각했다.** URL이 바뀔 때마다 입력 중에 포커스가 빠지고, 모바일 키보드가 닫힌다.

## 📌 참고 사항

- 데스크톱 `/list`도 자동 검색이 되면서 서버 목록 조회(`network-only`) 횟수가 모바일 수준으로 늘어난다.
- QA a11y-check 권장 중 데스크톱 검색 Enter 처리·결과 알림(`aria-live`), 원래 있던 경고 4건(모바일 검색 라벨, 필터 모달 포커스, 체크박스·라디오 포커스 표시)은 별도 작업으로 남겼다.
- `TypePokemonNameSearch`의 `exhaustive-deps` 억제 사유("debounce는 렌더마다 새로 만들어지는 setter 래퍼")는 이제 사실과 다르다(`debounce`가 state setter라 참조가 고정됨). 이번 범위에서는 고치지 않았다.
