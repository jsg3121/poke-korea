import {
  ApolloClient,
  FieldPolicy,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { useMemo } from 'react'
import { GqlMode } from './buildMode'
import { paginatedFieldPolicy } from './graphqlPagination.module'

const GQLMode = GqlMode

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

/**
 * 페이지네이션 쿼리의 캐시 병합 정책(typePolicies) 단일 소스.
 *
 * Relay connection 쿼리의 edges 누적 병합과 필터별 캐시 분리(keyArgs)를 캐시
 * 레벨에서 처리한다. 이를 통해 SSR로 restore한 초기 데이터를 cache-first로 읽고,
 * fetchMore(더보기)만 네트워크로 나가도록 한다. keyArgs에서 pagination(first/after)을
 * 제외해 같은 필터의 여러 페이지가 하나의 connection으로 병합되게 하고, 필터는
 * 포함해 필터 변경 시 캐시가 자연히 분리되도록 한다(구 useRouteChangeCache 대체).
 *
 * 새 무한 스크롤 쿼리를 추가할 때는 이 맵에 [필드명]: keyArgs 한 줄만 등록하면
 * 병합·캐시 분리가 자동 적용된다. champions처럼 필터 외 인자(format/sort)로도
 * 결과 집합이 갈리는 경우 그 인자를 keyArgs에 함께 명시한다.
 */
const PAGINATED_QUERY_FIELDS: Record<string, FieldPolicy['keyArgs']> = {
  getPokemonListPaginated: [['input', ['filter']]],
  getPokemonSkillList: [['input', ['filter']]],
  getAbilityListPaginated: [['input', ['filter']]],
  getPokemonByAbility: [['input', ['filter']]],
  getPokemonsBySkillV2: [['input', ['filter']]],
  getChampionsPokemonList: [['input', ['format', 'sort', 'filter']]],
}

const createInMemoryCache = () =>
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: Object.fromEntries(
          Object.entries(PAGINATED_QUERY_FIELDS).map(([field, keyArgs]) => [
            field,
            paginatedFieldPolicy(keyArgs),
          ]),
        ),
      },
    },
  })

export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: GQLMode,
    }),
    cache: createInMemoryCache(),
  })
}

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // SSR에서 추출(extract)한 정규화 캐시 상태를 클라이언트 캐시로 복원한다.
  // extract 결과는 이미 정규화된 캐시 객체이므로, 배열 병합이 필요한 deepmerge가
  // 아니라 얕은 병합으로 충분하다. 배열(페이지네이션) 병합은 typePolicies.merge가
  // 담당한다. 기존 캐시가 있으면(라우트 전환 등) 서버의 새 상태가 이기도록
  // initialState를 뒤에 둔다(existing → initialState 순).
  if (initialState) {
    const existingCache = _apolloClient.extract()
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }
  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState: NormalizedCacheObject | null = null) {
  const client = useMemo(() => initializeApollo(initialState), [initialState])
  return { client }
}

/**
 * 서버 컴포넌트에서 실행한 쿼리 결과를 클라이언트로 전달하기 위한 캐시 상태 추출.
 *
 * client.extract() 결과에는 null-prototype 객체 등 순수 객체가 아닌 값이 섞일 수
 * 있어, 서버 컴포넌트 → 클라이언트 컴포넌트(Providers) 경계를 그대로 넘기면
 * "Only plain objects can be passed..." 직렬화 에러가 난다. JSON 왕복으로 순수
 * 객체로 변환해 안전하게 전달한다(extract 결과는 직렬화 가능한 정규화 상태라 손실 없음).
 *
 * 반환값을 <Providers initialApolloState={...}>에 넘기면 클라이언트 useQuery가
 * cache-first로 캐시를 읽어 초기 네트워크 요청을 하지 않는다.
 */
export function extractApolloState(
  client: ApolloClient<NormalizedCacheObject>,
): NormalizedCacheObject {
  return JSON.parse(JSON.stringify(client.extract())) as NormalizedCacheObject
}
