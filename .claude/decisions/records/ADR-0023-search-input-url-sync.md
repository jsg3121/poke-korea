# ADR-0023: 검색 입력과 URL 동기화 방식 통일, react-hook-form 제거

- **상태**: 승인
- **날짜**: 2026-10-21
- **담당**: jsg3121

## 맥락

검색어를 URL 쿼리에 두는 검색창이 세 곳 있다. 도감 목록(`/list`, `?name=`), 기술 목록(`/moves`, `?search=`), 특성 목록(`/ability`, `?search=`)이다. URL이 바뀌면 서버 컴포넌트(`page.tsx`)가 `searchParams`로 다시 조회한다. 이 검색창들은 구현이 제각각이었다.

| 검색창 | 검색 시점 | URL 변경 | 디바운스 | 입력 관리 |
| --- | --- | --- | --- | --- |
| 도감 목록 데스크톱 `MainSearch` | 폼 제출 | `router.push` | 없음 | react-hook-form |
| 도감 목록 모바일 `ListSearch` | 입력 후 500ms | `router.replace` | `useDebounce`(값) + `useEffect` | 비제어 `defaultValue` |
| 기술·특성 `MovesSearch`·`AbilitySearch` | 입력 후 500ms | `router.replace` | `useDebouncedCallback` | 비제어 `defaultValue` |

이 때문에 생긴 문제는 다음과 같다.

1. **도감 목록의 데스크톱·모바일 동작이 다르다.** UX-004(2026-07-07)는 "데스크톱 분기 패턴을 모바일에 적용해 데/모 동작을 일치시킨다"고 정했지만, 모바일만 디바운스 자동 검색으로 구현됐다.
2. **디바운스 훅이 두 개이고, 같은 일(URL 갱신)에 둘 다 쓰인다.** `ListSearch`는 값 방식이라 디바운스된 값을 받아 effect에서 `router.replace`를 호출한다. 이 effect는 `searchParams`를 의존성에서 빼야 해서 `eslint-disable`이 붙는다. 1.54.0에서 고친 "`?name=` 진입 시 검색어 삭제" 버그(`f289c400`)도 이 마운트 effect가 원인이었다.
3. **`useDebouncedCallback`은 렌더 중에 ref를 쓴다**(`callbackRef.current = callback`). React 문서가 초기화 외에는 금지하는 패턴이다.
4. **입력창 밖에서 URL의 검색어가 지워져도 입력창이 비워지지 않는다.** 비제어 input의 `defaultValue`는 마운트할 때만 적용된다. 도감 목록의 "초기화"(`FilterBar`)와 기술 목록의 "검색·필터 초기화"(`MovesListContent`, 결과가 없을 때 노출)가 검색어까지 지우는데, 입력창에는 이전 검색어가 남는다(2026-10-21 기술 목록에서 재현 확인).
5. **react-hook-form을 두 곳에서만 쓰는데, 핵심 기능은 쓰지 않는다.** `MainSearch`(필드 1개)와 `FilterModalForm`(세대 체크박스 + 라디오 4종)이다. 검증, 에러, dirty 상태를 쓰지 않고, `FormProvider`는 하위에서 읽는 곳이 없다.

## 결정

1. **도감 목록 검색은 데스크톱·모바일 모두 디바운스 자동 검색 + `router.replace`로 통일한다.** 데스크톱의 제출 방식과 `push`(검색마다 방문 기록 추가)를 없앤다.
2. **디바운스는 effect의 cleanup으로 처리하고, ref·`useCallback`을 쓰지 않는다. `useDebouncedCallback`은 지운다.**
   - `useDebounce`: 디바운스된 **값을 React state로 들고 렌더나 쿼리 변수에 쓸 때** (헤더 검색, 상성 계산기 이름 입력)
   - `useSearchParamInput(paramKey)`: 검색어를 **URL 쿼리에 쓰는 검색창** (도감·기술·특성 목록 검색). 입력값 state를 의존성을 모두 채운 effect로 URL에 동기화한다. `eslint-disable`을 쓰지 않는다.
3. **URL에 검색어를 쓰는 검색창은 제어 컴포넌트로 바꾸고, 그 사이 사용자 입력이 없을 때만 바뀐 URL 검색어를 따라간다.**
   - 직전 렌더의 URL 검색어(`prevParamValue`)를 state로 두고, 렌더 중 URL 검색어가 바뀌었을 때 **입력값(공백 제거)이 직전 URL 검색어와 같으면** 입력값을 새 URL 검색어로 바꾼다. React의 "prop이 바뀔 때 state 조정하기" 패턴이며, 이 판단에는 ref와 effect를 쓰지 않는다.
   - 입력값이 직전 URL 검색어와 다르다는 것은 사용자가 그 뒤로 입력했다는 뜻이므로 덮어쓰지 않는다. 초기화(빈 값)와 다른 검색어로의 변경을 같은 규칙으로 처리한다.
   - 입력값을 다 지우면 디바운스 없이 즉시 URL에서 검색어를 지운다. 글자 일부를 지울 때는 입력과 같이 디바운스한다.
4. **react-hook-form을 제거한다.** `MainSearch`는 위 3번 방식으로, `FilterModalForm`은 비제어 input + 제출 시 `FormData`로 값을 읽는 방식으로 바꾼다.

## 근거

- **effect cleanup이면 ref 없이 디바운스할 수 있다.** 타이머 ID가 effect 클로저 안에만 있고, 입력값이 바뀌면 cleanup이 이전 타이머를 취소한다. 렌더마다 최신 값으로 effect가 다시 만들어지므로 "타이머가 끝날 때 최신 값 읽기"를 위한 ref(`callbackRef`)도, 함수 참조를 고정하는 `useCallback`도 필요 없다.
- **처음 기각했던 effect 방식의 문제는 의존성을 모두 채우면 사라진다.** 기존 `ListSearch`의 effect는 `searchParams`를 의존성에서 빼느라 `eslint-disable`이 필요했고, 마운트 시 검색어를 지우는 버그(`f289c400`)가 있었다. `useSearchParamInput`은 의존성을 모두 넣고 "입력값과 URL 값이 같으면 아무것도 하지 않는다"로 시작한다. 마운트 때는 두 값이 같아 URL을 건드리지 않는다. 입력 중 다른 필터가 바뀌면 최신 `searchParams`로 다시 실행되어 오래된 URL로 덮어쓰지 않는다. 의존성 중 실제로 실행 시점을 정하는 것은 `keyword`와 `searchParams`이고, `router`·`pathname`·`paramKey`는 바뀌지 않는 값이라 규칙을 만족시키기 위해 넣는다.
- **이 effect는 외부 시스템(URL) 동기화로 본다.** React 문서는 사용자 이벤트에서 비롯된 부수 효과를 이벤트 핸들러에 두라고 권장한다. 그러나 이 effect는 "입력값 state를 URL에 맞춘다"는 동기화이며, 이벤트 방식(`useDebouncedCallback`)은 최신 값을 읽기 위해 ref 두 개와 `useCallback`이 필요했다. ref 사용을 줄이기로 하고(사용자 결정, 2026-10-21) effect 방식을 택했다.
- **"그 사이 입력이 없을 때만" 따라가는 이유는 경쟁 조건이다.** App Router는 서버 렌더가 끝난 뒤 `searchParams`를 갱신한다. 조건 없이 URL 값을 따라가면, 응답을 기다리는 동안 사용자가 친 글자를 늦게 도착한 값이 덮어쓴다. 이 조건에 이르기까지 두 번 고쳤다.
  - "URL 검색어가 비어 있으면 비운다"로 판단하니, 파라미터가 없는 상태에서 첫 검색어를 쓸 때 응답 전까지 URL이 비어 있어서 입력창이 비워졌다(2026-10-21 데스크톱에서 재현).
  - "비워지는 변화가 있으면 비운다"로 고쳤으나, 검색어를 다 지운 직후 응답 전에 친 글자가 응답 도착과 함께 지워졌다. 응답이 다음 글자 입력 후 500ms 안에 도착할 때 생기며, RSC 응답을 150ms 늦춘 E2E로 재현했다(2026-10-21 QA code-review 지적). 입력값과 직전 URL 값을 비교하는 현재 조건으로 바꾼 뒤 같은 E2E가 통과했다.
- **남는 한계:** 입력 후 디바운스(500ms)가 끝나기 전에 초기화를 누르면, 입력값이 직전 URL 값과 달라 초기화를 따라가지 않고 대기 중인 검색어가 반영된다. 사람이 이 간격 안에 초기화를 누르는 경우는 드물다고 보고 둔다.
- **다 지웠을 때 즉시 반영하는 이유.** 검색어를 다 지우는 것은 대개 "검색을 취소하고 전체를 보겠다"는 뜻이라 즉시 반응이 중요하다. 글자가 줄어들 때마다 즉시 반영하면 백스페이스마다 서버 조회(`network-only`)가 나가므로, 완전히 비었을 때만 즉시 처리한다. 대기 중이던 타이머는 입력값이 바뀔 때 effect cleanup이 취소하므로 이전 검색어를 다시 쓰지 않는다.
- **제어 컴포넌트의 입력마다 리렌더는 무시할 수준이다.** 리렌더 범위가 검색창 컴포넌트 하나다. 데스크톱 라벨 애니메이션(`hasValue`)도 입력값에서 바로 계산할 수 있다.
- **react-hook-form이 하던 일은 브라우저 폼이 기본으로 한다.** 같은 `name`의 체크박스 값은 `FormData.getAll`이 배열로 모아 준다. React 문서도 단순한 폼은 비제어 input과 `FormData`로 읽는 예시를 든다. 사용처가 0이 되므로 의존성을 지운다.
- **방문 기록 통일.** `/list`의 다른 URL 변경(타입 칩, 필터 모달, 필터 칩 삭제, 초기화)과 기술·특성 검색은 모두 `replace`다. 데스크톱 검색만 `push`였다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| --- | --- | --- | --- |
| A. 값 방식 `useDebounce` + 컴포넌트 effect로 URL 갱신 (기존 `ListSearch`) | 훅을 그대로 재사용 | `searchParams`를 의존성에서 빼야 해서 `eslint-disable`이 필요. 마운트 시 검색어 삭제 버그가 있었음 | 의존성을 모두 채운 전용 훅(`useSearchParamInput`)으로 대체 |
| I. 이벤트 방식 `useDebouncedCallback` (`timeoutRef`·`callbackRef` + `useCallback`) | URL 쓰기가 이벤트 핸들러에 있어 React 문서 권장과 일치 | 최신 값을 읽기 위해 ref 두 개와 `useCallback`이 필요. `callbackRef`를 렌더 중에 갱신하던 문제도 있었음 | ref 사용을 줄이기로 함(사용자 결정, 2026-10-21). 한때 이 방식으로 구현했다가 effect 방식으로 바꿨다 |
| B. 데스크톱 제출 방식으로 통일 | 서버 요청이 제출할 때만 발생 | 모바일에서 키보드의 검색 버튼을 눌러야 함. 기술·특성 목록과 동작이 달라짐 | 사용자 결정(2026-10-21)으로 자동 검색 채택 |
| C. 초기화가 검색어를 남기게 변경 (기술 목록 필터 바 방식) | 동기화 코드 불필요 | 기술 목록 "검색·필터 초기화"는 이름 그대로 검색어도 지워야 함 | 사용자 결정(2026-10-21)으로 검색어도 지움 |
| D. input `key={URL 검색어}`로 다시 마운트 | 코드 한 줄 | 디바운스가 끝나 URL이 바뀔 때마다 다시 마운트되어 입력 중 포커스가 빠지고 모바일 키보드가 닫힘 | 입력 중 동작이 깨짐 |
| E. ref로 DOM 값을 직접 비움 | 비제어 유지 | 렌더 밖에서 DOM을 직접 조작 | ref 사용을 최소화하기로 함(사용자 결정) |
| F. URL 값이 바뀔 때마다 조건 없이 입력창을 맞춤 | 모든 외부 변경 대응 | 서버 응답 대기 중 입력한 글자를 이전 값이 덮어씀 | 경쟁 조건. "입력값이 직전 URL 값과 같을 때만" 조건을 붙인 형태로 채택(결정 3) |
| J. URL 검색어가 비워지는 변화가 있을 때만 비움 | 초기화만 처리하는 최소 조건 | 다 지운 직후 응답 전에 친 글자가 지워짐. 다른 검색어로의 외부 변경은 따라가지 않고 500ms 뒤 이전 값으로 되돌림 | 한때 이 방식으로 구현했다가 QA에서 발견. 결정 3의 조건으로 대체 |
| H. 마지막으로 URL에 쓴 값(`lastWritten`)을 따로 기억 | "직접 다 지움"과 "초기화"를 구별하고, 응답 대기 중 입력을 되돌려도 쓰기를 건너뛰지 않음 | 상태가 하나 늘고 판단 분기가 커짐. 첫 구현에서 이 값의 갱신 시점 때문에 첫 검색어가 지워지는 버그가 났다 | 막는 경쟁 조건이 응답 대기 중의 드문 입력뿐이고, 다 지울 때 즉시 반영하면 그 대기 시간도 줄어든다. 단순함을 우선(사용자 결정, 2026-10-21) |
| G. `FilterModalForm`은 react-hook-form 유지 | 변경 없음 | 핵심 기능을 안 쓰는데 의존성만 남음 | 사용처가 하나뿐이고 브라우저 기본 기능으로 대체 가능 |

## 결과

- 데스크톱 `/list` 검색이 입력 후 500ms에 자동 실행되고, 검색어마다 방문 기록이 쌓이지 않는다. 서버 목록 조회(`network-only`) 횟수가 모바일 수준으로 늘어난다.
- 도감 목록 "초기화"와 기술 목록 "검색·필터 초기화"를 누르면 입력창도 비워진다.
- 검색창 네 곳(도감 데스크톱·모바일, 기술, 특성)이 `useSearchParamInput` 하나를 쓴다. `ListSearch`의 `eslint-disable`이 사라지고, `useDebouncedCallback`은 삭제된다.
- `react-hook-form`이 `package.json`에서 빠진다. CLAUDE.md 기술 스택 표의 "폼 관리" 줄을 지운다.
- UX-004의 "검색 동작" 결정을 이 ADR 기준으로 갱신한다.
- 새 검색창을 만들 때는 결정 2번의 기준으로 훅을 고른다.

## 참고 자료

- [React — Keeping Components Pure: Where you can cause side effects](https://react.dev/learn/keeping-components-pure#where-you-_can_-cause-side-effects)
- [React — Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
- [React — You Might Not Need an Effect: Adjusting some state when a prop changes](https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
- [React — Choosing the State Structure: Avoid redundant state](https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state)
- [React — Referencing Values with Refs: When to use refs](https://react.dev/learn/referencing-values-with-refs#when-to-use-refs)
- [React — useRef: Pitfall (Do not write or read ref.current during rendering)](https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref)
- [React — `<input>`: Reading the input values when submitting a form](https://react.dev/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form)
- [MDN — FormData.getAll()](https://developer.mozilla.org/en-US/docs/Web/API/FormData/getAll)
- [Next.js — useRouter: `router.replace`](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [React Hook Form — register](https://react-hook-form.com/docs/useform/register)
- 관련 문서: `.claude/research/ux/UX-004-list-redesign.md` "검색 동작"
