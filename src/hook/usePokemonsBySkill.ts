'use client'

import { useGetPokemonsBySkillQuery } from '~/graphql/gqlGenerated'
import { LearnMethod, PokemonLearnInfo } from '~/graphql/typeGenerated'
import {
  mergePagedResults,
  extractNodesFromEdges,
} from '~/module/graphqlPagination.module'

interface UsePokemonsBySkillProps {
  skillId: number
  method?: LearnMethod
  generationId?: number
  initialPokemonList?: Array<PokemonLearnInfo>
  pageSize?: number
}

export const usePokemonsBySkill = ({
  skillId,
  method,
  generationId,
  initialPokemonList = [],
  pageSize = 30,
}: UsePokemonsBySkillProps) => {
  const { data, loading, fetchMore, error } = useGetPokemonsBySkillQuery({
    variables: {
      input: {
        filter: {
          skillId,
          method,
          generationId,
        },
        pagination: {
          first: pageSize,
        },
      },
    },
    skip: !skillId,
  })

  const loadMore = async () => {
    if (!data?.getPokemonsBySkill?.pageInfo.hasNextPage) return

    await fetchMore({
      variables: {
        input: {
          filter: {
            skillId,
            method,
            generationId,
          },
          pagination: {
            first: pageSize,
            after: data?.getPokemonsBySkill.pageInfo.endCursor,
          },
        },
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        mergePagedResults('getPokemonsBySkill', prev, fetchMoreResult),
    })
  }

  const pokemonList = extractNodesFromEdges(
    data?.getPokemonsBySkill?.edges,
    initialPokemonList,
  )

  return {
    skillName: data?.getPokemonsBySkill?.skillName,
    pokemonList,
    hasNextPage: data?.getPokemonsBySkill?.pageInfo.hasNextPage,
    loading,
    error,
    totalCount: data?.getPokemonsBySkill?.totalCount || 0,
    loadMore,
  }
}
