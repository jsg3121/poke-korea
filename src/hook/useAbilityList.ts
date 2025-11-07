'use client'

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

        return {
          getAbilityListPaginated: {
            ...fetchMoreResult.getAbilityListPaginated,
            edges: [
              ...previousQueryResult.getAbilityListPaginated.edges,
              ...fetchMoreResult.getAbilityListPaginated.edges,
            ],
          },
        }
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
