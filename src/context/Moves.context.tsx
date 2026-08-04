'use client'

import { createContext, ReactNode } from 'react'
import { useGetPokemonSkillListQuery } from '~/graphql/gqlGenerated'
import { PokemonSkill, PokemonSkillFilterInput } from '~/graphql/typeGenerated'
import { extractNodesFromEdges } from '~/module/graphqlPagination.module'

interface MovesProviderProps {
  initialSkills: Array<PokemonSkill>
  totalCount: number
  movesFilter: PokemonSkillFilterInput
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
    // edges 병합은 InMemoryCache의 typePolicies(getPokemonSkillList.merge)가
    // 담당하므로 updateQuery는 지정하지 않는다(이중 병합 시 항목 중복 방지).
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
    })
  }

  const skillList = extractNodesFromEdges(
    data?.getPokemonSkillList?.edges,
    initialSkills,
  )

  const value = {
    skillList,
    hasNextPage: data?.getPokemonSkillList.pageInfo.hasNextPage,
    loading,
    totalCount,
    loadMore,
  }

  return <MovesContext.Provider value={value}>{children}</MovesContext.Provider>
}
