'use client'

import { produce } from 'immer'
import { useSearchParams } from 'next/navigation'
import { useGetAbilityListPaginatedQuery } from '~/graphql/gqlGenerated'
import { Ability, AbilityEdge } from '~/graphql/typeGenerated'

interface UseAbilityListProps {
  initialAbilities?: Array<Ability>
  pageSize?: number
}

export const useAbilityList = ({
  initialAbilities = [],
  pageSize = 20,
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
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousQueryResult

        return produce(previousQueryResult, (draft) => {
          if (!draft.getAbilityListPaginated) {
            return
          }

          draft.getAbilityListPaginated.edges = [
            ...previousQueryResult.getAbilityListPaginated.edges,
            ...fetchMoreResult.getAbilityListPaginated.edges,
          ]
          draft.getAbilityListPaginated.pageInfo = {
            ...previousQueryResult.getAbilityListPaginated.pageInfo,
            endCursor:
              fetchMoreResult.getAbilityListPaginated.pageInfo.endCursor,
            hasNextPage:
              fetchMoreResult.getAbilityListPaginated.pageInfo.hasNextPage,
          }
        })
      },
    })
  }

  const abilityList =
    data?.getAbilityListPaginated?.edges?.map(
      (edge: AbilityEdge) => edge.node,
    ) || initialAbilities

  return {
    abilityList,
    hasNextPage: data?.getAbilityListPaginated.pageInfo.hasNextPage,
    loading,
    error,
    totalCount: data?.getAbilityListPaginated.totalCount || 0,
    loadMore,
  }
}
