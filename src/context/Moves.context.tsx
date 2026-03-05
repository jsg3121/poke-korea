'use client'

import { createContext, ReactNode } from 'react'
import { useGetPokemonSkillListQuery } from '~/graphql/gqlGenerated'
import {
  PokemonSkill,
  PokemonSkillFilterInput,
  VersionGroup,
} from '~/graphql/typeGenerated'
import {
  mergePagedResults,
  extractNodesFromEdges,
} from '~/module/graphqlPagination.module'

interface MovesProviderProps {
  initialSkills: Array<PokemonSkill>
  totalCount: number
  movesFilter: PokemonSkillFilterInput
  versionGroups: Array<VersionGroup>
  children: ReactNode
}

type ContextType = {
  skillList: Array<PokemonSkill>
  loading: boolean
  totalCount: number
  hasNextPage?: boolean
  loadMore: () => void
  versionGroups: Array<VersionGroup>
}

export const MovesContext = createContext<ContextType>({
  skillList: [],
  loading: false,
  totalCount: 0,
  loadMore: () => null,
  versionGroups: [],
})

export const MovesProvider = ({
  initialSkills,
  totalCount,
  movesFilter,
  versionGroups,
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
    versionGroups,
  }

  return <MovesContext.Provider value={value}>{children}</MovesContext.Provider>
}
