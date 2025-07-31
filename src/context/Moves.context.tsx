'use client'

import { produce } from 'immer'
import { createContext, ReactNode, useCallback, useState } from 'react'
import { useGetPokemonSkillListQuery } from '~/graphql/gqlGenerated'
import {
  PokemonSkill,
  PokemonSkillEdge,
  PokemonType,
} from '~/graphql/typeGenerated'

interface MovesProviderProps {
  initialSkills: Array<PokemonSkill>
  totalCount: number
  children: ReactNode
}

type MovesFilterType = {
  name?: string
  type?: PokemonType | null
  signatureMoves?: boolean
  zMoves?: boolean
}

type ContextType = {
  skillList: Array<PokemonSkill>
  movesFilter: MovesFilterType
  loading: boolean
  totalCount: number
  hasNextPage?: boolean
  loadMore: () => void
  setFilter: (filter: MovesFilterType) => void
}

export const MovesContext = createContext<ContextType>({
  skillList: [],
  movesFilter: {},
  loading: false,
  totalCount: 0,
  loadMore: () => null,
  setFilter: () => null,
})

export const MovesProvider = ({
  initialSkills,
  totalCount,
  children,
}: MovesProviderProps) => {
  const [movesFilter, setMovesFilter] = useState<MovesFilterType>({})

  const { data, loading, fetchMore } = useGetPokemonSkillListQuery({
    variables: {
      input: {
        filter: movesFilter,
        pagination: {
          first: 30,
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

  const setFilter = useCallback((filter: MovesFilterType) => {
    setMovesFilter(filter)
  }, [])

  const rawList =
    data?.getPokemonSkillList?.edges?.map(
      (edge: PokemonSkillEdge) => edge.node,
    ) || initialSkills

  const skillList = Array.from(
    new Map(rawList.map((item) => [item.name, item])).values(),
  )

  const value = {
    skillList,
    movesFilter,
    hasNextPage: data?.getPokemonSkillList.pageInfo.hasNextPage,
    loading,
    totalCount,
    loadMore,
    setFilter,
  }

  return <MovesContext.Provider value={value}>{children}</MovesContext.Provider>
}
