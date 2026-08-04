'use client'

import { useGetPokemonsBySkillQuery } from '~/graphql/gqlGenerated'
import { LearnMethod, PokemonLearnInfo } from '~/graphql/typeGenerated'
import { extractNodesFromEdges } from '~/module/graphqlPagination.module'

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
    if (!data?.getPokemonsBySkill?.pageInfo.hasNextPage) return

    // edges 병합은 InMemoryCache의 typePolicies(getPokemonsBySkill.merge)가
    // 담당하므로 updateQuery는 지정하지 않는다. updateQuery를 함께 쓰면 병합이
    // 이중 적용되어 항목이 중복될 수 있다.
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
            after: data?.getPokemonsBySkill.pageInfo.endCursor,
          },
        },
      },
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
