import { useMemo } from 'react'
import {
  ApolloClient,
  FieldPolicy,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

import { GqlMode } from './buildMode.module'
import { paginatedFieldPolicy } from './graphqlPagination.module'

const GQLMode = GqlMode

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

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

export function extractApolloState(
  client: ApolloClient<NormalizedCacheObject>,
): NormalizedCacheObject {
  return JSON.parse(JSON.stringify(client.extract())) as NormalizedCacheObject
}
