'use client'

import { produce } from 'immer'
import { createContext, ReactNode } from 'react'
import { useGetPokemonSkillListQuery } from '~/graphql/gqlGenerated'
import {
  PokemonSkill,
  PokemonSkillEdge,
  PokemonSkillFilterInput,
} from '~/graphql/typeGenerated'

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
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousQueryResult
        return produce(previousQueryResult, (draft) => {
          draft.getPokemonSkillList.edges = [
            ...previousQueryResult.getPokemonSkillList.edges,
            ...fetchMoreResult.getPokemonSkillList.edges,
          ]
          draft.getPokemonSkillList.pageInfo = {
            ...previousQueryResult.getPokemonSkillList.pageInfo,
            endCursor: fetchMoreResult.getPokemonSkillList.pageInfo.endCursor,
            hasNextPage:
              fetchMoreResult.getPokemonSkillList.pageInfo.hasNextPage,
          }
        })
      },
    })
  }

  const skillList =
    data?.getPokemonSkillList?.edges?.map(
      (edge: PokemonSkillEdge) => edge.node,
    ) || initialSkills

  const value = {
    skillList,
    hasNextPage: data?.getPokemonSkillList.pageInfo.hasNextPage,
    loading,
    totalCount,
    loadMore,
  }

  return <MovesContext.Provider value={value}>{children}</MovesContext.Provider>
}
