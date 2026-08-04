'use client'

import { useSearchParams } from 'next/navigation'
import { useGetAbilityListPaginatedQuery } from '~/graphql/gqlGenerated'
import { Ability } from '~/graphql/typeGenerated'
import { extractNodesFromEdges } from '~/module/graphqlPagination.module'

interface UseAbilityListProps {
  initialAbilities?: Array<Ability>
  pageSize?: number
}

export const useAbilityList = ({
  initialAbilities = [],
  pageSize = 15,
}: UseAbilityListProps = {}) => {
  const searchParams = useSearchParams()
  const searchKeyword = searchParams.get('search')
  const { data, loading, fetchMore, error } = useGetAbilityListPaginatedQuery({
    variables: {
      input: {
        filter: {
          name: searchKeyword,
        },
        pagination: {
          first: pageSize,
        },
      },
    },
  })

  const loadMore = async () => {
    if (!data?.getAbilityListPaginated.pageInfo.hasNextPage) return

    // edges 병합은 InMemoryCache의 typePolicies(getAbilityListPaginated.merge)가
    // 담당하므로 updateQuery는 지정하지 않는다(이중 병합 시 항목 중복 방지).
    await fetchMore({
      variables: {
        input: {
          filter: {
            name: searchKeyword,
          },
          pagination: {
            first: pageSize,
            after: data?.getAbilityListPaginated.pageInfo.endCursor,
          },
        },
      },
    })
  }

  const abilityList = extractNodesFromEdges(
    data?.getAbilityListPaginated?.edges,
    initialAbilities,
  )

  return {
    abilityList,
    hasNextPage: data?.getAbilityListPaginated.pageInfo.hasNextPage,
    loading,
    error,
    totalCount: data?.getAbilityListPaginated.totalCount || 0,
    loadMore,
  }
}
