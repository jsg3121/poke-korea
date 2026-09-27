'use client'

import { useGetPokemonByAbilityQuery } from '~/graphql/gqlGenerated'
import { PokemonWithAbility } from '~/graphql/typeGenerated'
import { extractNodesFromEdges } from '~/modules/graphqlPagination.module'

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
    })
  }

  const pokemonList = extractNodesFromEdges(
    data?.getPokemonByAbility?.edges,
    initialPokemon,
  )

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
