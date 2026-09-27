'use client'

import { useGetPokemonsBySkillQuery } from '~/graphql/gqlGenerated'
import { LearnMethod, PokemonLearnInfo } from '~/graphql/typeGenerated'
import { extractNodesFromEdges } from '~/modules/graphqlPagination.module'

interface UsePokemonsBySkillProps {
  skillId: number
  method?: LearnMethod
  versionGroupId?: number
  initialPokemonList?: Array<PokemonLearnInfo>
  pageSize?: number
}

export const usePokemonsBySkill = ({
  skillId,
  method,
  versionGroupId,
  initialPokemonList = [],
  pageSize = 30,
}: UsePokemonsBySkillProps) => {
  const { data, loading, fetchMore, error } = useGetPokemonsBySkillQuery({
    variables: {
      input: {
        filter: {
          skillId,
          method,
          versionGroupId,
        },
        pagination: {
          first: pageSize,
        },
      },
    },
    skip: !skillId,
  })

  const loadMore = async () => {
    if (!data?.getPokemonsBySkillV2?.pageInfo.hasNextPage) return

    await fetchMore({
      variables: {
        input: {
          filter: {
            skillId,
            method,
            versionGroupId,
          },
          pagination: {
            first: pageSize,
            after: data?.getPokemonsBySkillV2.pageInfo.endCursor,
          },
        },
      },
    })
  }

  const pokemonList = extractNodesFromEdges(
    data?.getPokemonsBySkillV2?.edges,
    initialPokemonList,
  )

  return {
    skillName: data?.getPokemonsBySkillV2?.skillName,
    pokemonList,
    hasNextPage: data?.getPokemonsBySkillV2?.pageInfo.hasNextPage,
    loading,
    error,
    totalCount: data?.getPokemonsBySkillV2?.totalCount || 0,
    loadMore,
  }
}
