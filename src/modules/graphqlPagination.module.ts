import type { FieldPolicy } from '@apollo/client'

/**
 * GraphQL Relay edges 배열에서 node 배열 추출
 * @param edges - GraphQL edges 배열
 * @param fallback - edges가 없을 때 반환할 기본값 (기본: [])
 * @returns node 배열
 */
export const extractNodesFromEdges = <T>(
  edges: Array<{ node: T }> | undefined | null,
  fallback: Array<T> = [],
): Array<T> => {
  const seen = new Set<unknown>()
  const dedupe = (nodes: Array<T>): Array<T> =>
    nodes.filter((node) => {
      const id = (node as { id?: unknown })?.id
      if (id === undefined || id === null) return true
      if (seen.has(id)) return false
      seen.add(id)

      return true
    })

  if (!edges) return dedupe(fallback)

  return dedupe(edges.map((edge) => edge.node))
}

/**
 * Relay connection(edges/pageInfo) 필드용 InMemoryCache FieldPolicy 팩토리
 * @param keyArgs - Apollo FieldPolicy의 keyArgs (예: [['input', ['filter']]])
 */
type EdgeLike = { cursor?: unknown; node?: { id?: unknown } }

type ConnectionLike = {
  edges?: Array<unknown>
  [key: string]: unknown
}

const dedupeEdges = (edges: Array<unknown>): Array<unknown> => {
  const seen = new Set<unknown>()

  return edges.filter((edge) => {
    const key = (edge as EdgeLike)?.cursor ?? (edge as EdgeLike)?.node?.id
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
    if (!existing) {
      return incoming
        ? { ...incoming, edges: dedupeEdges(incoming.edges ?? []) }
        : incoming
    }
    if (!incoming) return existing

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
