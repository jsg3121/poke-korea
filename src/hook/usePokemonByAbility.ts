'use client'

import { produce } from 'immer'
import { useGetPokemonByAbilityQuery } from '~/graphql/gqlGenerated'
import {
  PokemonByAbilityEdge,
  PokemonWithAbility,
} from '~/graphql/typeGenerated'

interface UsePokemonByAbilityProps {
  abilityId: number
  includeHidden?: boolean
  initialPokemon?: Array<PokemonWithAbility>
  pageSize?: number
}

export const usePokemonByAbility = ({
  abilityId,
  includeHidden = true,
  initialPokemon = [],
  pageSize = 20,
}: UsePokemonByAbilityProps) => {
  const { data, loading, fetchMore, error } = useGetPokemonByAbilityQuery({
    variables: {
      input: {
        filter: {
          abilityId,
          includeHidden,
        },
        pagination: {
          first: pageSize,
        },
      },
    },
    skip: !abilityId,
  })

  const loadMore = async () => {
    if (!data?.getPokemonByAbility.pageInfo.hasNextPage) return

    await fetchMore({
      variables: {
        input: {
          filter: {
            abilityId,
            includeHidden,
          },
          pagination: {
            first: pageSize,
            after: data?.getPokemonByAbility.pageInfo.endCursor,
          },
        },
      },
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousQueryResult
        }

        return produce(previousQueryResult, (draft) => {
          if (!draft.getPokemonByAbility) {
            return
          }

          draft.getPokemonByAbility.edges = [
            ...previousQueryResult.getPokemonByAbility.edges,
            ...fetchMoreResult.getPokemonByAbility.edges,
          ]
          draft.getPokemonByAbility.pageInfo = {
            ...previousQueryResult.getPokemonByAbility.pageInfo,
            endCursor: fetchMoreResult.getPokemonByAbility.pageInfo.endCursor,
            hasNextPage:
              fetchMoreResult.getPokemonByAbility.pageInfo.hasNextPage,
          }
        })
      },
    })
  }

  const pokemonList =
    data?.getPokemonByAbility?.edges?.map(
      (edge: PokemonByAbilityEdge) => edge.node,
    ) || initialPokemon

  return {
    ability: data?.getPokemonByAbility?.ability,
    pokemonList,
    hasNextPage: data?.getPokemonByAbility.pageInfo.hasNextPage,
    loading,
    error,
    totalCount: data?.getPokemonByAbility.totalCount || 0,
    loadMore,
  }
}
