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

| 옵션                                    | 목적                                 |
| --------------------------------------- | ------------------------------------ |
| `noImplicitReturns`                     | 일부 경로에서만 return하는 함수 차단 |
| `noFallthroughCasesInSwitch`            | switch fallthrough 차단              |
| `noUnusedLocals` · `noUnusedParameters` | 미사용 선언 차단                     |

다음 두 옵션은 **켜지 않는다.**

`exactOptionalPropertyTypes` — `aria-current={active ? 'page' : undefined}` 같은 React 정석 패턴을 에러로 만들어, 우회 코드가 늘면 가독성이 떨어진다. TypeScript 팀도 이 옵션을 `strict`에 포함하지 않았다.

`noUncheckedIndexedAccess` — 이 옵션이 잡아낼 수 있는 실제 결함은 1.61.0에서 전수 검토해 이미 고쳤고, 남는 것은 배열 리터럴 직후의 `[0]`처럼 값이 반드시 존재하는 접근이라 폴백이 실행되지 않는 분기만 늘린다. 근거는 ADR-0018의 "적용 현황" 절에 있다.

> **다만 인덱스 접근은 여전히 주의 대상이다.** 옵션이 강제하지 않을 뿐, 길이를 보장할 수 없는 배열에서 꺼낸 값은 `undefined`일 수 있다. 옵셔널 체이닝을 중간에 끊지 않는다 — `data?.[i]?.types`이지 `data?.[i].types`가 아니다.

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

### GraphQL 데이터는 쿼리 결과 타입으로 받는다

타입은 **실제로 받는 범위만큼만** 잡는다. 컴포넌트·훅의 props와 반환값에 `PokemonFormInfo` 같은 스키마 전체 타입을 쓰지 않고, 실제로 요청한 필드만 담은 쿼리 결과 타입을 쓴다.

```tsx
// ❌ 쿼리가 요청하지 않은 필드까지 필수로 요구한다
pokemonList: Array<PokemonFormInfo>

// ✅ 이 쿼리가 실제로 받는 필드만 담는다
pokemonList: SearchPokemonWithAllFormsQuery['searchPokemonWithAllForms']
```

> **Why:** 스키마 타입은 스키마의 모든 필드를 담는다. 쿼리가 일부 필드만 요청해도 타입은 전부 있다고 말하므로, 받지 않은 필드를 읽는 코드가 타입 검사를 통과한다. 또 스키마에 필드가 추가되는 순간 그 필드를 요청하지 않는 무관한 화면의 타입이 깨진다. 1.62.0에서 `PokemonFormInfo`에 `types`를 추가하자, 이를 요청하지 않는 헤더 검색이 타입 오류를 냈다. GraphQL Code Generator도 컴포넌트가 연산 결과 타입을 쓰도록 안내한다([typescript-operations](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations)).

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

## 분석 이벤트 전송

GA4 커스텀 이벤트는 **공통 전송 유틸 하나로만** 보낸다. 컴포넌트에서 `window.gtag`를 직접 부르지 않는다.

- **위치**: 전송 유틸은 `modules/`에 둔다. 외부 서비스 연동이고 여러 도메인이 쓰기 때문이다(`structure.md`).
- **타입**: 이벤트 이름과 파라미터를 타입으로 정의하고, 유틸은 정의된 이벤트만 받는다. 이 타입 정의가 곧 이벤트 목록이며, GA4 콘솔의 맞춤 측정기준 등록도 이 목록과 맞춘다.
- **이름**: 이벤트 이름, 파라미터 이름, 열거형 파라미터 값(`tab: 'real'`, `form_type: 'region'` 등)을 모두 소문자 스네이크 케이스로 쓴다. 백엔드 enum(`REGION_FORM`)처럼 형식이 다른 값은 바꿔 보낸다. 이벤트 이름은 40자 이내, 파라미터 값은 100자 이내([GA4 이벤트 수집 한도](https://support.google.com/analytics/answer/9267744)). 같은 대상을 가리키는 파라미터는 이벤트가 달라도 같은 이름과 값 집합을 쓴다. 그래야 GA4 맞춤 측정기준 하나로 묶인다.
- **이벤트 이름에 페이지를 넣지 않는다.** gtag가 모든 이벤트에 `page_location`을 자동으로 붙인다([GA4 자동 수집 이벤트](https://support.google.com/analytics/answer/9234069)). 같은 페이지 안에서 기능을 구분해야 하면 `source` 같은 파라미터를 쓴다.
- **gtag가 없을 때는 아무것도 하지 않는다.** gtag는 운영 환경에서만, `afterInteractive`로 불러오므로 개발 환경이나 스크립트 실행 전에는 `window.gtag`가 없다. 이때 오류를 내지 않는다.
- **개인정보를 보내지 않는다**([GA4 PII 정책](https://support.google.com/analytics/answer/6366371)). 자유 입력값을 보내야 하면 길이를 제한한다.
- **URL 변경으로 측정하지 않는다.** `router.replace`·`router.push`로 URL을 바꾸면 GA4 향상된 측정이 page_view로 세어 페이지뷰가 부풀려진다([향상된 측정](https://support.google.com/analytics/answer/9216061)). 조작을 측정하려면 이벤트를 보낸다.

```tsx
// ❌ 호출마다 존재 확인을 반복하고, 이름·파라미터를 검사할 수 없다
window.gtag?.('event', 'stat_tab_staus', { tab: 'Real' })

// ✅ 정의된 이벤트만 보낼 수 있다
trackEvent('stats_tab_status', { tab: 'real' })
```

> **Why 공통 유틸인가 (2026-10-15):** 검토한 후보는 네 가지였다.
>
> - **위치마다 `window.gtag` 직접 호출**: 존재 확인이 호출마다 반복되고, 이벤트 이름 오타·파라미터 불일치를 막을 수 없어 기각했다.
> - **`@next/third-parties`의 `sendGAEvent`**: Next.js 문서가 experimental로 표기한다([Next.js — Third Party Libraries](https://nextjs.org/docs/app/guides/third-party-libraries)). 운영 중인 layout의 gtag 스크립트를 교체해야 해서 페이지뷰 측정이 끊기거나 중복될 위험이 있다. 파라미터 타입 검사도 없어 기각했다.
> - **Google Tag Manager 전환**: 코드 배포 없이 태그를 바꿀 필요가 있을 때 이득이 크다. 코드를 고치는 사람과 지표를 보는 사람이 같은 지금 규모에는 과하고, 측정 로직이 코드와 콘솔로 나뉜다. 그래서 기각했다.
> - **공통 유틸 + 타입 정의(채택)**: 기능마다 착수·유지를 이벤트 지표로 판단하기로 해서 이벤트가 계속 늘어난다. 이벤트가 늘수록 이름·파라미터 불일치와 맞춤 측정기준 등록 누락이 생기기 쉬운데, 타입 검사와 한 곳의 목록이 이를 막는다.

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
| 분석 이벤트    | `modules/`의 공통 유틸 + 타입 정의로만    |
