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
  if (!edges) return fallback

  // node.id 기준 중복 제거 — 백엔드가 같은 항목을 두 번 내려주는 경우가 있어
  // (dedupeEdges 주석 참조) 목록 렌더 직전에도 방어한다. id가 없는 타입은
  // 걸러내지 않는다(정상 항목을 잃는 것이 더 나쁘다).
  const seen = new Set<unknown>()

  return edges
    .map((edge) => edge.node)
    .filter((node) => {
      const id = (node as { id?: unknown })?.id
      if (id === undefined || id === null) return true
      if (seen.has(id)) return false
      seen.add(id)

      return true
    })
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
type EdgeLike = { cursor?: unknown; node?: { id?: unknown } }

type ConnectionLike = {
  edges?: Array<unknown>
  [key: string]: unknown
}

/**
 * edges에서 같은 항목을 제거한다 — cursor를 우선 키로, 없으면 node.id를 쓴다.
 *
 * Relay connection에서 같은 cursor가 두 번 오는 것은 어느 쿼리에서든 비정상이지만,
 * 실제로 발생한다. 백엔드 통합 테이블 전환 후 `getPokemonsBySkillV2`가 습득법이
 * 2개 이상인 포켓몬을 중복으로 내려주는 사례가 확인됐다(불꽃펀치 USUM 기준
 * 100건 중 13건 중복, cursor·필드까지 완전히 동일).
 *
 * 중복이 그대로 렌더되면 React key 충돌 경고가 나고, 목록 개수가 totalCount와
 * 어긋난다. 근본 해결은 백엔드지만 캐시 레벨에서 방어해 화면을 보호한다.
 */
const dedupeEdges = (edges: Array<unknown>): Array<unknown> => {
  const seen = new Set<unknown>()

  return edges.filter((edge) => {
    const key = (edge as EdgeLike)?.cursor ?? (edge as EdgeLike)?.node?.id
    // 키를 만들 수 없으면 걸러내지 않는다(정상 항목을 잃는 것이 더 나쁘다)
    if (key === undefined || key === null) return true
    if (seen.has(key)) return false
    seen.add(key)

    return true
  })
}

export const paginatedFieldPolicy = (
  keyArgs: FieldPolicy['keyArgs'],
): FieldPolicy<ConnectionLike> => ({
  keyArgs,
  merge(existing, incoming) {
    // 첫 write(SSR 하이드레이션 포함) 또는 incoming이 비면 그대로 사용.
    // 단일 페이지 안에도 중복이 올 수 있어 첫 write부터 걸러낸다.
    if (!existing) {
      return incoming
        ? { ...incoming, edges: dedupeEdges(incoming.edges ?? []) }
        : incoming
    }
    if (!incoming) return existing

    // edges는 누적 병합, 그 외 connection 레벨 필드(pageInfo/totalCount/ability
    // /skillName 등)는 최신 incoming 값으로 갱신하되 없으면 기존 값 보존.
    // 페이지 경계에서 같은 항목이 다시 오는 경우도 여기서 함께 걸러진다.
    return {
      ...existing,
      ...incoming,
      edges: dedupeEdges([
        ...(existing.edges ?? []),
        ...(incoming.edges ?? []),
      ]),
    }
  },
})
