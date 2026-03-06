'use client'

import { createContext, ReactNode } from 'react'
import { useGetPokemonSkillListQuery } from '~/graphql/gqlGenerated'
import { PokemonSkill, PokemonSkillFilterInput } from '~/graphql/typeGenerated'
import {
  mergePagedResults,
  extractNodesFromEdges,
} from '~/module/graphqlPagination.module'

interface MovesProviderProps {
  initialSkills: Array<PokemonSkill>
  totalCount: number
  movesFilter: PokemonSkillFilterInput
  firstGenerationId?: number
  children: ReactNode
}

type ContextType = {
  skillList: Array<PokemonSkill>
  loading: boolean
  totalCount: number
  hasNextPage?: boolean
  loadMore: () => void
}

export const MovesContext = createContext<ContextType>({
  skillList: [],
  loading: false,
  totalCount: 0,
  loadMore: () => null,
})

export const MovesProvider = ({
  initialSkills,
  totalCount,
  movesFilter,
  firstGenerationId,
  children,
}: MovesProviderProps) => {
  const { data, loading, fetchMore } = useGetPokemonSkillListQuery({
    variables: {
      input: {
        filter: movesFilter,
        pagination: {
          first: 20,
        },
      },
    },
  })

  const loadMore = async () => {
    await fetchMore({
      variables: {
        input: {
          filter: movesFilter,
          pagination: {
            first: 20,
            after: data?.getPokemonSkillList.pageInfo.endCursor,
          },
        },
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        mergePagedResults('getPokemonSkillList', prev, fetchMoreResult),
    })
  }

  const allSkills = extractNodesFromEdges(
    data?.getPokemonSkillList?.edges,
    initialSkills,
  )

  const skillList = firstGenerationId
    ? allSkills.filter((skill) => skill.firstGenerationId === firstGenerationId)
    : allSkills

  const value = {
    skillList,
    hasNextPage: data?.getPokemonSkillList.pageInfo.hasNextPage,
    loading,
    totalCount: firstGenerationId ? skillList.length : totalCount,
    loadMore,
  }

  return <MovesContext.Provider value={value}>{children}</MovesContext.Provider>
}
