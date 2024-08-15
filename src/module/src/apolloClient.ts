import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import fetch from 'cross-fetch'
import merge from 'deepmerge'
import isEqual from 'fast-deep-equal'
import { useMemo } from 'react'
import { GqlMode } from './buildMode'

const GQLMode = GqlMode

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: GQLMode,
      fetch,
    }),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // SSG 및 SSR에서 Apollo 상태를 초기화합니다.
  if (initialState) {
    // 서버에서 받은 초기 상태로 클라이언트 측 캐시를 초기화합니다.
    const existingCache = _apolloClient.extract()
    const data = merge(existingCache, initialState, {
      // 중복되는 데이터는 덮어쓰지 않습니다.
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s)),
        ),
      ],
    })
    _apolloClient.cache.restore(data)
  }
  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState: any) {
  const client = useMemo(() => initializeApollo(initialState), [initialState])
  return { client }
}
