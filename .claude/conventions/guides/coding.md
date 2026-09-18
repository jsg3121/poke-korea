# 코딩 컨벤션

**코드를 어떻게 작성하는가**를 규정한다.

관련 문서 — 폴더 배치는 `structure.md`, 이름 짓기는 `naming.md`, 주석은 `comments.md`, 스타일은 `styling.md`.

---

## 경로 별칭

내부 모듈은 `~/` 접두어로 import한다(`tsconfig.json`에서 `src/*`에 매핑).

```tsx
import { useDevice } from '~/context/Device.context'
```

상대 경로(`../../`)는 같은 폴더 안(`./`)을 제외하고 쓰지 않는다 — 파일을 옮길 때 전부 깨진다.

---

## 계층별 책임

```text
layout.tsx  →  page.tsx  →  views  →  containers  →  components
   크롬          라우트 계약    조립        로직          UI
```

| 계층          | 책임                              | 하지 않는 것          |
| ------------- | --------------------------------- | --------------------- |
| `layout.tsx`  | 헤더·푸터·탭바 등 크롬, Providers | 페이지별 내용         |
| `page.tsx`    | 메타데이터, 서버 패칭, JSON-LD    | 크롬 조립, UI 렌더    |
| `views/`      | 페이지 조립                       | 서버 패칭, 메타데이터 |
| `containers/` | 비즈니스 로직, 상태 관리          | 서버 패칭             |
| `components/` | props 기반 순수 UI                | 비즈니스 로직         |

**참조 방향** — 상위는 모든 하위를 참조할 수 있고(깊이 무관), 하위는 상위를 참조하지 않는다. 도메인끼리는 직접 참조하지 않고 전역으로 승격한다. 자세한 규칙은 `structure.md`.

---

## 타입

### 엄격 옵션

`tsconfig.json`은 `strict: true`에 더해 다음을 켠다.

| 옵션                                    | 목적                                          |
| --------------------------------------- | --------------------------------------------- |
| `noUncheckedIndexedAccess`              | 배열·객체 인덱스 접근 결과에 `undefined` 포함 |
| `noImplicitReturns`                     | 일부 경로에서만 return하는 함수 차단          |
| `noFallthroughCasesInSwitch`            | switch fallthrough 차단                       |
| `noUnusedLocals` · `noUnusedParameters` | 미사용 선언 차단                              |

> **Why `noUncheckedIndexedAccess`:** 컴파일러는 배열 길이를 알 수 없으므로 `arr[0]`이 존재한다고 보장할 수 없다. 이 옵션이 없으면 빈 배열에서 `undefined`를 꺼내 쓰는 코드가 타입 검사를 통과한다.
>
> 이 옵션만 아직 `tsconfig.json`에 켜지 않았다. 표의 나머지는 적용돼 있다. 보류 근거와 재개 조건은 ADR-0018의 "적용 현황" 절에 있다 — 새 코드는 인덱스 접근 결과를 `undefined`일 수 있는 값으로 다룬다.

`exactOptionalPropertyTypes`는 켜지 않는다 — `aria-current={active ? 'page' : undefined}` 같은 React 정석 패턴을 에러로 만들어, 우회 코드가 늘면 가독성이 떨어진다. TypeScript 팀도 이 옵션을 `strict`에 포함하지 않았다.

### `any`와 non-null 단언을 쓰지 않는다

둘 다 타입 검사를 무력화한다. 타입을 모르겠으면 `unknown`으로 받아 좁혀 쓰고, 값이 있다고 단정해야 하면 `!` 대신 조건으로 걸러낸다.

### 외부 입력은 단언하지 말고 검증한다

URL 파라미터·API 응답처럼 **런타임에 무엇이 올지 모르는 값**에 `as`를 쓰지 않는다. 타입 가드로 좁힌다.

```tsx
// ❌ 잘못된 URL이 와도 타입은 안전하다고 말한다
formatSlug as ChampionsFormatSlug

// ✅ 검증 후 좁힌다
const isFormatSlug = (v: string): v is ChampionsFormatSlug =>
  v === 'single' || v === 'double'

if (!isFormatSlug(slug)) notFound()
```

`as const`는 예외다 — 타입을 넓히는 게 아니라 좁히므로 안전하다.

### `interface`와 `type`

객체 형태는 `interface`, 유니온·튜플·매핑은 `type`을 쓴다. `I`·`IF` 접두사는 붙이지 않는다.

---

## Context

**Provider와 함께 커스텀 훅을 export하고, 소비처는 훅만 쓴다.**

```tsx
const DetailContext = createContext<DetailContextValue | null>(null)

export const useDetail = () => {
  const context = useContext(DetailContext)
  if (!context) {
    throw new Error('useDetail은 DetailProvider 안에서만 쓸 수 있습니다')
  }
  return context
}
```

소비처에서 `useContext`를 직접 호출하지 않는다.

> **Why:** `createContext`에 기본값을 주면 Provider 밖에서 써도 에러가 나지 않고 빈 값이 반환된다. 화면은 비어 보이는데 원인을 알 수 없는 실패가 된다. 훅에서 null을 걸러내면 즉시 명확한 메시지로 터지고, 반환 타입도 non-null로 좁혀져 소비처에서 옵셔널 체이닝이 사라진다. 가짜 기본값을 만들 필요도 없다.

---

## 이벤트 핸들러

**props로 받은 콜백을 JSX에 바로 넘기지 않고, 컴포넌트 안에서 핸들러를 만들어 호출한다.**

```text
// ❌ 렌더마다 새 함수가 생성된다
<Button onClick={() => onClickClose(id)} />

// ✅ 이름 있는 핸들러
const handleClickClose = () => {
  onClickClose(id)
}

return <Button onClickClose={handleClickClose} />
```

> **Why:** JSX 안의 화살표 함수는 렌더마다 새로 만들어진다. 리스트가 1,000개면 함수도 1,000개가 생성되고, 자식이 `memo`여도 props가 매번 바뀌어 메모이제이션이 무효화된다. 이름 있는 핸들러로 분리하면 스택 트레이스에 함수명이 남아 디버깅도 쉽고, JSX가 구조만 담게 되어 읽기 좋다.

이름 규칙은 `naming.md` 참조 — 내부 정의는 `handle{이벤트}{동작}`, props는 `on{이벤트}{동작}`.

---

## 조건부 렌더링

**early return을 우선한다.**

```tsx
// ✅ 렌더 불가 조건은 먼저 걸러낸다
if (!pokemon) return null

return <section>{pokemon.name}</section>
```

JSX 안에서 분기해야 하면 `&&` 대신 삼항을 쓰거나, 불리언으로 명시적으로 변환한다.

```text
// ❌ count가 0이면 화면에 0이 렌더된다
{items.length && <List items={items} />}

// ✅
{items.length > 0 && <List items={items} />}
```

> **Why:** `&&`는 좌변을 그대로 반환한다. 숫자 `0`과 빈 문자열은 falsy지만 React가 렌더할 수 있는 값이라, 의도치 않게 화면에 나타난다.

---

## 서버·클라이언트 경계

`'use client'`는 **실제로 필요한 컴포넌트에만** 붙인다 — 상태(`useState`), 생명주기(`useEffect`), 브라우저 API, 이벤트 핸들러를 쓸 때다.

경계는 트리 **아래쪽**으로 민다. 상위에 붙이면 그 아래 전부가 클라이언트 번들에 포함된다.

```text
❌ page(client) → view → container → component
✅ page(server) → view(server) → container(client) → component
```

> **근거:** [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

---

## 데이터 패칭

**서버에서 가져와 클라이언트로 흘린다.** `page.tsx`가 Apollo로 데이터를 가져와 `initialApolloState`로 하이드레이션하고, 클라이언트에서 같은 쿼리를 다시 쏘지 않는다([ADR-0014](../../decisions/records/ADR-0014-apollo-ssr-cache-hydration.md)).

패칭 코드의 배치(`_fetch/` 분리 기준)는 `structure.md` 참조. 분리할 때는 **응답 가공까지 함께** 옮긴다.

GraphQL 원본을 수정한 뒤에는 `npm run codegen`을 실행한다. 생성물은 직접 수정하지 않는다.

```bash
npm run codegen   # localhost:4000/graphql 서버가 떠 있어야 한다
```

---

## 조건 비교

`==` 대신 `===`를 쓴다. 값의 존재 확인은 암묵 변환에 기대지 않고 명시한다.

```tsx
// ❌ 빈 문자열·0도 함께 걸러진다
if (name) { ... }

// ✅ 의도를 드러낸다
if (name !== '') { ... }
if (count > 0) { ... }
```

기본값은 `||`가 아니라 `??`를 쓴다 — `||`는 빈 문자열과 `0`을 폴백시킨다.

```tsx
const label = value ?? '알 수 없음'
```

---

## 요약

| 항목           | 규칙                                      |
| -------------- | ----------------------------------------- |
| import 경로    | `~/` 별칭                                 |
| Context        | 커스텀 훅 + Provider 밖 가드              |
| 이벤트 핸들러  | JSX 인라인 금지, 이름 있는 핸들러로 분리  |
| 조건부 렌더링  | early return 우선, `&&`는 불리언으로 명시 |
| `'use client'` | 필요한 곳에만, 트리 아래쪽으로            |
| 외부 입력      | `as` 대신 타입 가드                       |
| 비교           | `===`, 기본값은 `??`                      |
