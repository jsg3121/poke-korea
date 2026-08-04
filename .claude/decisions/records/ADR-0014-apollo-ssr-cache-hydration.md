# ADR-0014: Apollo Client SSR 캐시 하이드레이션 — 목록 페이지 클라이언트 중복 재요청 제거

- **상태**: 승인
- **날짜**: 2026-08-04
- **담당**: jsg3121 + Claude

## 맥락

기술 상세 페이지(`/moves/[id]`)에서 **버전 탭을 전환할 때마다 `GetPokemonsBySkill` 쿼리가 브라우저 네트워크에 찍히는** 현상이 발견되었다. 서버 컴포넌트가 SSR로 이미 데이터를 fetch하는데도 클라이언트가 같은 쿼리를 다시 요청하고 있었다.

원인을 추적한 결과, 이는 기술 상세만의 문제가 아니라 **무한 스크롤이 있는 6개 목록형 쿼리 전반의 구조적 문제**였다.

### 문제의 기원 (git 히스토리 추적)

이 문제는 디자인 시스템 개편과 무관하며, **2025-09-01 무한 스크롤 도입 시점**에 발생했다.

- **무한 스크롤 도입 이전**: `ListProvider` 등은 `useQuery` 없이 서버가 준 데이터를 props로 받아 그대로 렌더만 했다. 클라이언트 재요청이 없었다.
- **무한 스크롤 도입(`d1acb77`, 2025-09-01)**: "더보기"에 필요한 `fetchMore`를 얻기 위해 `useGetPokemonListPaginatedQuery`(Apollo `useQuery`) 방식으로 전환했다. `useQuery`는 마운트 시 캐시를 확인하는데, 클라이언트 캐시가 비어 있어 `cache-first` 기본 정책이 네트워크로 나갔다.
- **임시 봉합(`7e32e81`, 2025-09-01 같은 날)**: 무한 스크롤로 캐시가 누적되는 부작용을 `useRouteChangeCache`(라우트 변경 시 `getPokemonListPaginated` 필드 evict)로 막으려 했다.

### 근본 원인

Next.js App Router에서 **서버의 Apollo 캐시와 브라우저의 Apollo 캐시는 별개 인스턴스**다. 서버 `page.tsx`가 `apolloClient.query()`로 받은 데이터는 plain props로만 전달되고, 클라이언트 Apollo 캐시는 매 페이지 로드 시 **빈 상태로 시작**한다. 따라서 클라이언트 `useQuery`(`cache-first` 기본)는 캐시 미스 → 네트워크 요청을 낸다.

프로젝트에는 `initializeApollo(initialState)` + `cache.restore()` 하이드레이션 스캐폴드가 이미 존재했으나(Pages Router 시절 잔재, Vercel `with-apollo` 예제 유래), `layout.tsx`의 `<Providers>`에 `initialApolloState`가 전혀 전달되지 않아 **죽은 경로(dead path)**였다.

영향받는 6개 쿼리:

| 쿼리 | SSR fetch 위치 | 클라이언트 재요청 위치 |
|------|----------------|------------------------|
| `GetPokemonsBySkill` | `moves/[id]/_fetch/moveDetail.fetch.ts` | `usePokemonsBySkill` |
| `GetPokemonByAbility` | `ability/[id]/_fetch/abilityDetail.fetch.ts` | `usePokemonByAbility` |
| `GetAbilityListPaginated` | `ability/page.tsx` | `useAbilityList` |
| `GetPokemonSkillList` | `moves/page.tsx` | `Moves.context` |
| `GetPokemonListPaginated` | `list/page.tsx` | `List.context` |
| `GetChampionsPokemonList` | `champions/[format]/list/page.tsx` | `ChampionsPokedex.context` |

## 결정

**서버에서 실행한 쿼리 결과를 클라이언트 Apollo 캐시로 하이드레이트하여, `useQuery`(cache-first)가 초기 네트워크 요청 없이 캐시를 읽도록 한다.** 네트워크 요청은 무한 스크롤의 `fetchMore`(더보기)에서만 발생한다.

구현 방식(공식 통합 패키지 미사용, 순수 `@apollo/client` 3.11 유지):

1. **페이지 단위 Provider 주입** — 각 `page.tsx`(서버 컴포넌트)가 `extractApolloState(client)`로 정규화 캐시를 추출해, 해당 페이지를 감싸는 `<Providers initialApolloState={...}>`(클라이언트 컴포넌트)에 전달한다. `layout.tsx`의 전역 Provider는 자식 page의 데이터를 알 수 없으므로 page 단위 주입이 표준이다.
2. **직렬화 안전 처리** — `client.extract()` 결과에는 null-prototype 객체 등 순수 객체가 아닌 값이 섞여, 서버→클라이언트 컴포넌트 경계를 넘길 때 직렬화 에러("Only plain objects can be passed…")가 난다. `JSON.parse(JSON.stringify(...))` 왕복으로 순수 객체로 변환한다(`extractApolloState` 헬퍼).
3. **캐시 생성 시점 restore** — `initializeApollo(initialState)`가 클라이언트 생성 시점(`useMemo`)에 `cache.restore()`한다. 렌더/`useEffect`가 아니라 클라이언트 인스턴스 생성 로직의 일부이므로, `useQuery`의 첫 캐시 읽기부터 히트가 보장되어 타이밍 문제가 없다. 기존 `deepmerge` 배열 병합은 typePolicies로 이관하고 얕은 병합으로 단순화했다.
4. **typePolicies로 페이지네이션 병합 이관** — 6개 connection 쿼리에 `merge`(edges 누적 + connection 필드 갱신) + `keyArgs`(필터별 캐시 분리, pagination 제외)를 설정한다. 이로써 각 훅/Context의 수동 `updateQuery`(`mergePagedResults`)를 제거하고, `fetchMore`가 하이드레이트된 첫 페이지에 자동으로 이어붙는다. keyArgs·merge는 페이지네이션 필드 단일 소스 맵(`PAGINATED_QUERY_FIELDS`)에서 자동 생성한다.
5. **`useRouteChangeCache` 제거** — 이 훅은 무한 스크롤 캐시 누적을 강제 evict로 봉합한 것이다. keyArgs가 필터별 캐시를 구조적으로 분리하므로 불필요해졌고, 오히려 남아 있으면 하이드레이트한 캐시를 지워 이 결정과 충돌한다.

## 근거

### 왜 `cache-first` 설정만으로는 안 되는가

`cache-first`는 이미 `useQuery`의 기본값이다([Apollo Queries](https://www.apollographql.com/docs/react/data/queries)). 문제는 정책이 아니라 캐시가 비어 있다는 것이다. cache-first는 "캐시에 데이터가 있으면 네트워크를 건너뛰고, 없으면 요청"하므로, 근본 해결은 **`useQuery`가 처음 캐시를 읽는 순간 데이터가 있게 만드는 것**(하이드레이션)으로 환원된다.

### 왜 `writeQuery`(컨테이너에서 심기)가 아니라 `restore`(생성 시점)인가

`writeQuery`를 클라이언트 컨테이너의 `useEffect`에 넣으면, `useQuery`가 렌더 단계에서 먼저 캐시 미스를 내고 네트워크를 발사한 **뒤에** `writeQuery`가 실행되어 이미 늦다([apollo-client#10466](https://github.com/apollographql/apollo-client/issues/10466)). 렌더 중 동기 실행(`useState` lazy initializer, `useMemo`)으로 앞당기려 하면 React의 렌더 순수성 규칙을 위반한다(Strict Mode 이중 실행, 동시성 렌더 폐기 시 캐시 오염 — [React useState](https://react.dev/reference/react/useState)). `restore`는 클라이언트 인스턴스 생성 로직의 일부라 이 타이밍 문제가 원천적으로 없다.

### 왜 공식 통합 패키지(`@apollo/client-integration-nextjs`)를 쓰지 않는가

공식 App Router 통합 패키지의 3.x 호환 라인(`0.12.x`)은 peer로 `@apollo/client ^3.13.0`을 요구하고(현재 `^3.11.8`), React 18 peer 보장은 `0.12.0` 한 버전뿐이며 `0.12.1+`는 React 19를 요구한다. `0.13.0+`는 Apollo Client 4 + React 19 + rxjs 전면 마이그레이션을 강제한다. 즉 현재 스택(React 18 + AC 3.11)을 셋 다 만족하는 조합이 사실상 없고, 도입 시 `0.12.0` 버전 함정에 갇힌다. 반면 자체 배선은 의존성 변경 없이 동일한 근본 해결을 제공하고, 이미 있는 `initializeApollo`/`restore` 스캐폴드와 정합한다.

### 왜 keyArgs에서 pagination을 제외하는가

`keyArgs`는 캐시를 분리하는 기준이다. 필터는 결과 집합을 규정하므로 포함하지만, `first`/`after` 같은 순수 페이지네이션 인자는 제외해야 같은 필터의 여러 페이지가 하나의 connection으로 병합된다([Apollo Pagination core API](https://www.apollographql.com/docs/react/pagination/core-api)). 필터를 키에 포함하면 필터 변경 시 캐시가 자연히 분리되어, 이전 필터 데이터가 섞이는 문제(구 `useRouteChangeCache`가 막던 것)가 구조적으로 해결된다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| 공식 통합 패키지 도입(A) | 공식 지원, 유지보수 유리 | AC 3.13+ 필요, `0.12.0` 버전 고정, React19/AC4 압박 | 현재 스택과 peer 충돌, 버전 함정 |
| AC4 + React19 전면 업그레이드(C) | 최신·장수명 | 대규모 마이그레이션, 리스크 최대 | 이번 작업 범위 초과 |
| `cache-first` 명시만 | 변경 최소 | 이미 기본값, 캐시 비어 있어 무효 | 근본 원인 미해결 |
| `writeQuery`(컨테이너) | 페이지별 국소 | 타이밍 문제, 렌더 순수성 위반 | 안전성 미확보 |
| **자체 restore 하이드레이션(B, 채택)** | 의존성 0, 기존 스캐폴드 정합, 타이밍 문제 없음 | 배선을 자체 관리 | — |

## 결과

- **탭 전환·목록 초기 진입 시 클라이언트 재요청 제거** — 6개 페이지에서 SSR 데이터가 캐시 정본이 되어, 초기 `useQuery`가 네트워크로 나가지 않는다. 사용자 검증(네트워크 탭)으로 6곳 모두 확인 완료.
- **무한 스크롤 유지** — `fetchMore`(더보기)만 네트워크 요청. typePolicies.merge가 하이드레이트된 첫 페이지에 자동으로 이어붙인다.
- **필터 변경 안정화** — keyArgs 필터 분리로 이전 필터 데이터 혼입 방지. `useRouteChangeCache`(및 그 `cache.gc` 순기능) 제거.
- **코드 정리** — 6곳의 수동 `updateQuery` 제거, `mergePagedResults`/`useRouteChangeCache`/`deepmerge`·`fast-deep-equal` 사용 제거.
- **개편 이전 상태 회복** — 무한 스크롤 도입 전의 "SSR props만 표시, 재요청 없음" 상태를, 무한 스크롤을 유지한 채 되찾았다.
- **후속 검토** — 장시간 탐색 시 캐시 메모리 누적(구 `useRouteChangeCache`의 `cache.gc`가 담당하던 순기능)은 실측 후 필요 시 별도 정리 장치를 검토한다.

## 참고 자료

- [Apollo Queries — cache-first fetch policy](https://www.apollographql.com/docs/react/data/queries)
- [Apollo Pagination core API — merge·keyArgs](https://www.apollographql.com/docs/react/pagination/core-api)
- [Apollo Cache interaction — writeQuery](https://www.apollographql.com/docs/react/caching/cache-interaction)
- [Apollo Next.js App Router 통합(공식)](https://www.apollographql.com/docs/react/integrations/nextjs)
- [apollo-client#10466 — App directory 캐시 하이드레이션 타이밍 문제](https://github.com/apollographql/apollo-client/issues/10466)
- [Vercel Next.js `with-apollo` 예제 — restore/extract/merge 표준](https://github.com/vercel/next.js/tree/canary/examples/with-apollo)
- [React useState — initializer 순수성·Strict Mode 이중 호출](https://react.dev/reference/react/useState)
- 관련 커밋: `d1acb77`(무한 스크롤 도입), `7e32e81`(useRouteChangeCache 도입)
- 관련: [ADR-0007](./ADR-0007-responsive-rendering-strategy.md)(반응형 단일 — 6개 페이지 뷰 구조 배경)
