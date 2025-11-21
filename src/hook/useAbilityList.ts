'use client'

import { useSearchParams } from 'next/navigation'
import { useGetAbilityListPaginatedQuery } from '~/graphql/gqlGenerated'
import { Ability } from '~/graphql/typeGenerated'
import {
  mergePagedResults,
  extractNodesFromEdges,
} from '~/module/graphqlPagination.module'

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
      updateQuery: (prev, { fetchMoreResult }) =>
        mergePagedResults('getAbilityListPaginated', prev, fetchMoreResult),
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
