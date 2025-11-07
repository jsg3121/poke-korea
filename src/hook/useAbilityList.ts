'use client'

import { produce } from 'immer'
import { useGetAbilityListPaginatedQuery } from '~/graphql/gqlGenerated'
import {
  Ability,
  AbilityEdge,
  AbilityFilterInput,
} from '~/graphql/typeGenerated'

interface UseAbilityListProps {
  initialAbilities?: Array<Ability>
  filter?: AbilityFilterInput
  pageSize?: number
}

export const useAbilityList = ({
  initialAbilities = [],
  filter,
  pageSize = 20,
}: UseAbilityListProps = {}) => {
  const { data, loading, fetchMore, error } = useGetAbilityListPaginatedQuery({
    variables: {
      input: {
        filter,
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
          filter,
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
