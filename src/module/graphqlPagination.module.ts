import { produce } from 'immer'

/**
 * GraphQL 페이지네이션 결과를 병합하는 유틸 함수
 *
 * @param queryName - GraphQL 쿼리 이름 (예: 'getPokemonList', 'getAbilityListPaginated')
 * @param previousResult - 이전 쿼리 결과
 * @param fetchMoreResult - fetchMore로 가져온 새로운 결과
 * @returns 병합된 쿼리 결과
 *
 * @example
 * ```tsx
 * await fetchMore({
 *   variables: { ... },
 *   updateQuery: (prev, { fetchMoreResult }) =>
 *     mergePagedResults('getPokemonList', prev, fetchMoreResult)
 * })
 * ```
 */
export const mergePagedResults = <T = any>(
  queryName: string,
  previousResult: T,
  fetchMoreResult: T | undefined,
): T => {
  if (!fetchMoreResult) return previousResult

  return produce(previousResult, (draft: any) => {
    const prevData = draft[queryName]
    const newData = (fetchMoreResult as any)[queryName]

    if (!prevData || !newData) return

    // edges 배열 병합
    prevData.edges = [...prevData.edges, ...newData.edges]

    // pageInfo 업데이트
    prevData.pageInfo = {
      ...prevData.pageInfo,
      endCursor: newData.pageInfo.endCursor,
      hasNextPage: newData.pageInfo.hasNextPage,
    }
  })
}

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
 * 페이지네이션 변수 생성 헬퍼
 *
 * @param first - 가져올 아이템 개수
 * @param after - 시작 커서 (기본: undefined)
 * @returns 페이지네이션 변수 객체
 *
 * @example
 * ```tsx
 * const paginationVars = createPaginationVars(20, endCursor)
 * // { first: 20, after: endCursor }
 * ```
 */
export const createPaginationVars = (first: number, after?: string | null) => ({
  first,
  ...(after && { after }),
})
