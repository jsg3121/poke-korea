import type { FieldPolicy } from '@apollo/client'

/**
 * GraphQL Relay edges 배열에서 node 배열 추출
 *
 * @param edges - GraphQL edges 배열
 * @param fallback - edges가 없을 때 반환할 기본값 (기본: [])
 * @returns node 배열
 *
 * @example
 * ```tsx
 * const pokemonList = extractNodesFromEdges(
 *   data?.getPokemonList?.edges,
 *   initialList
 * )
 * ```
 */
export const extractNodesFromEdges = <T>(
  edges: Array<{ node: T }> | undefined | null,
  fallback: Array<T> = [],
): Array<T> => {
  return edges?.map((edge) => edge.node) || fallback
}

/**
 * Relay connection(edges/pageInfo) 필드용 InMemoryCache FieldPolicy 팩토리
 *
 * 배경:
 * - 기존에는 각 훅/Context가 fetchMore의 updateQuery에서 수동 병합했다. 이 방식은
 *   클라이언트 useQuery가 마운트 시 초기 요청을 재발생시키는 문제(SSR 중복 요청)를
 *   막지 못한다.
 * - 병합을 캐시 레벨(typePolicies)로 올리면, SSR 데이터를 캐시에 심은 뒤
 *   cache-first useQuery가 초기 요청 없이 캐시를 읽고, fetchMore만 네트워크로
 *   나간다. edges는 누적 병합하고 그 외 connection 레벨 필드(totalCount, ability,
 *   skillName 등)는 최신 값으로 갱신해 응답 형태를 보존한다.
 *
 * keyArgs:
 * - 필터별로 캐시를 분리하기 위한 인자 키. pagination(first/after)은 제외해야
 *   같은 필터의 여러 페이지가 하나의 connection으로 병합된다. 필터를 키에 포함하면
 *   필터 변경 시 별도 캐시 엔트리가 되어, 이전 필터 데이터가 섞이는 문제를
 *   구조적으로 방지한다(구 useRouteChangeCache의 evict 대체).
 *
 * @param keyArgs - Apollo FieldPolicy의 keyArgs (예: [['input', ['filter']]])
 *
 * @example
 * ```ts
 * new InMemoryCache({
 *   typePolicies: {
 *     Query: {
 *       fields: {
 *         getPokemonListPaginated: paginatedFieldPolicy([['input', ['filter']]]),
 *       },
 *     },
 *   },
 * })
 * ```
 */
type ConnectionLike = {
  edges?: Array<unknown>
  [key: string]: unknown
}

export const paginatedFieldPolicy = (
  keyArgs: FieldPolicy['keyArgs'],
): FieldPolicy<ConnectionLike> => ({
  keyArgs,
  merge(existing, incoming) {
    // 첫 write(SSR 하이드레이션 포함) 또는 incoming이 비면 그대로 사용
    if (!existing) return incoming
    if (!incoming) return existing

    // edges는 누적 병합, 그 외 connection 레벨 필드(pageInfo/totalCount/ability
    // /skillName 등)는 최신 incoming 값으로 갱신하되 없으면 기존 값 보존
    return {
      ...existing,
      ...incoming,
      edges: [...(existing.edges ?? []), ...(incoming.edges ?? [])],
    }
  },
})
