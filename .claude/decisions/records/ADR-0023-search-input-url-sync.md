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
2. **디바운스 훅은 용도로 나눠 둘 다 유지한다.**
   - `useDebounce`: 디바운스된 **값을 React state로 들고 렌더나 쿼리 변수에 쓸 때** (헤더 검색, 상성 계산기 이름 입력)
   - `useDebouncedCallback`: 디바운스가 끝난 시점에 **바깥(URL 등)에 쓸 때** (도감·기술·특성 목록 검색)
   - 타이머 로직은 `useDebouncedCallback` 한 곳에 두고, `useDebounce`는 그 위에 구현한다.
   - `callbackRef`는 렌더 중이 아니라 `useEffect`에서 갱신한다.
3. **URL에 검색어를 쓰는 검색창은 제어 컴포넌트로 바꾸고, 밖에서 검색어가 지워졌을 때만 입력창을 비운다.**
   - 직전 렌더의 URL 검색어(`prevParamValue`)를 state로 두고, 렌더 중 URL 검색어가 **비어 있지 않다가 비워지는 변화**가 있으면 입력값을 비운다. React의 "prop이 바뀔 때 state 조정하기" 패턴이며, ref와 effect를 쓰지 않는다.
   - 비지 않은 다른 값으로 바뀌는 경우는 맞추지 않는다. URL 검색어를 쓰는 곳이 검색창 자신과 초기화 버튼뿐이기 때문이다.
   - 입력값을 다 지우면 디바운스 없이 즉시 URL에서 검색어를 지운다. 글자 일부를 지울 때는 입력과 같이 디바운스한다.
4. **react-hook-form을 제거한다.** `MainSearch`는 위 3번 방식으로, `FilterModalForm`은 비제어 input + 제출 시 `FormData`로 값을 읽는 방식으로 바꾼다.

## 근거

- **부수 효과는 이벤트 핸들러에 둔다.** 검색어를 URL에 쓰는 것은 사용자가 입력해서 일어나는 일이다. React 문서는 이런 코드를 effect가 아니라 이벤트 쪽에 두라고 하고, effect는 "최후의 수단"이라고 한다. 콜백 방식은 `onChange`에서만 URL을 쓰므로 마운트 시점에 URL을 건드릴 경로가 없다. 2번 문제의 진입 버그가 구조적으로 생기지 않는다.
- **같은 정보를 state 두 곳에 두지 않는다.** 값 방식으로 URL을 갱신하면 디바운스된 검색어 state와 URL이라는 원본이 두 개가 되고, 이를 effect로 맞춰야 한다. 콜백 방식은 디바운스된 값을 따로 들지 않아 원본이 URL 하나다.
- **타이머 ID를 ref에 두는 것은 의도된 사용이다.** React 문서가 ref의 첫 번째 용도로 "timeout ID 저장"을 든다. 문제는 렌더 중에 ref를 쓰는 `callbackRef`였고, effect에서 갱신하면 해결된다. `callbackRef`는 타이머가 끝난 뒤(기본 500ms)에만 읽히므로 커밋 직후 실행되는 `useEffect`로 충분하다. `useLayoutEffect`는 React 18.3 서버 렌더러가 경고를 내서 쓰지 않는다. React 18.3이라 `useEffectEvent`(19.2부터 정식)도 쓸 수 없다.
- **초기화 동기화를 "비워질 때만"으로 좁힌 이유는 경쟁 조건이다.** App Router는 서버 렌더가 끝난 뒤 `searchParams`를 갱신한다. URL 값이 바뀔 때마다 입력창을 맞추면, 응답을 기다리는 동안 사용자가 친 글자를 늦게 도착한 이전 값이 덮어쓴다. "비어 있을 때"가 아니라 "비워지는 변화"로 판단하는 것도 같은 이유다. 파라미터가 없는 상태에서 첫 검색어를 쓰면 응답 전까지 URL은 여전히 비어 있어서, "비어 있을 때"로 판단하면 입력창이 비워진다(2026-10-21 데스크톱에서 재현).
- **다 지웠을 때 즉시 반영하는 이유.** 검색어를 다 지우는 것은 대개 "검색을 취소하고 전체를 보겠다"는 뜻이라 즉시 반응이 중요하다. 글자가 줄어들 때마다 즉시 반영하면 백스페이스마다 서버 조회(`network-only`)가 나가므로, 완전히 비었을 때만 즉시 처리한다. 대기 중이던 디바운스는 실행 시점의 최신 입력값(빈 값)을 읽으므로 따로 취소하지 않아도 이전 검색어를 다시 쓰지 않는다.
- **제어 컴포넌트의 입력마다 리렌더는 무시할 수준이다.** 리렌더 범위가 검색창 컴포넌트 하나다. 데스크톱 라벨 애니메이션(`hasValue`)도 입력값에서 바로 계산할 수 있다.
- **react-hook-form이 하던 일은 브라우저 폼이 기본으로 한다.** 같은 `name`의 체크박스 값은 `FormData.getAll`이 배열로 모아 준다. React 문서도 단순한 폼은 비제어 input과 `FormData`로 읽는 예시를 든다. 사용처가 0이 되므로 의존성을 지운다.
- **방문 기록 통일.** `/list`의 다른 URL 변경(타입 칩, 필터 모달, 필터 칩 삭제, 초기화)과 기술·특성 검색은 모두 `replace`다. 데스크톱 검색만 `push`였다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| --- | --- | --- | --- |
| A. `useDebounce` 하나로 통일 (콜백 훅 삭제) | 훅이 하나, ref 없음 | URL 갱신에 effect + `eslint-disable`이 필요. 검색어 원본이 둘이 되어 밖에서 URL이 바뀌면 어긋남 | 부수 효과를 effect에 두는 구조라 React 문서의 권장과 반대 |
| B. 데스크톱 제출 방식으로 통일 | 서버 요청이 제출할 때만 발생 | 모바일에서 키보드의 검색 버튼을 눌러야 함. 기술·특성 목록과 동작이 달라짐 | 사용자 결정(2026-10-21)으로 자동 검색 채택 |
| C. 초기화가 검색어를 남기게 변경 (기술 목록 필터 바 방식) | 동기화 코드 불필요 | 기술 목록 "검색·필터 초기화"는 이름 그대로 검색어도 지워야 함 | 사용자 결정(2026-10-21)으로 검색어도 지움 |
| D. input `key={URL 검색어}`로 다시 마운트 | 코드 한 줄 | 디바운스가 끝나 URL이 바뀔 때마다 다시 마운트되어 입력 중 포커스가 빠지고 모바일 키보드가 닫힘 | 입력 중 동작이 깨짐 |
| E. ref로 DOM 값을 직접 비움 | 비제어 유지 | 렌더 밖에서 DOM을 직접 조작 | ref 사용을 최소화하기로 함(사용자 결정) |
| F. URL 값이 바뀔 때마다 입력창을 맞춤 | 모든 외부 변경 대응 | 서버 응답 대기 중 입력한 글자를 이전 값이 덮어씀 | 경쟁 조건 |
| H. 마지막으로 URL에 쓴 값(`lastWritten`)을 따로 기억 | "직접 다 지움"과 "초기화"를 구별하고, 응답 대기 중 입력을 되돌려도 쓰기를 건너뛰지 않음 | 상태가 하나 늘고 판단 분기가 커짐. 첫 구현에서 이 값의 갱신 시점 때문에 첫 검색어가 지워지는 버그가 났다 | 막는 경쟁 조건이 응답 대기 중의 드문 입력뿐이고, 다 지울 때 즉시 반영하면 그 대기 시간도 줄어든다. 단순함을 우선(사용자 결정, 2026-10-21) |
| G. `FilterModalForm`은 react-hook-form 유지 | 변경 없음 | 핵심 기능을 안 쓰는데 의존성만 남음 | 사용처가 하나뿐이고 브라우저 기본 기능으로 대체 가능 |

## 결과

- 데스크톱 `/list` 검색이 입력 후 500ms에 자동 실행되고, 검색어마다 방문 기록이 쌓이지 않는다. 서버 목록 조회(`network-only`) 횟수가 모바일 수준으로 늘어난다.
- 도감 목록 "초기화"와 기술 목록 "검색·필터 초기화"를 누르면 입력창도 비워진다.
- `ListSearch`의 effect와 `eslint-disable`이 사라진다.
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
