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
  hasNextPage: boolean
  endCursor?: string | null
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
  hasNextPage: boolean
  loading: boolean
  totalCount: number
  loadMore: () => void
  setFilter: (filter: MovesFilterType) => void
}

export const MovesContext = createContext<ContextType>({
  skillList: [],
  movesFilter: {},
  hasNextPage: false,
  loading: false,
  totalCount: 0,
  loadMore: () => null,
  setFilter: () => null,
})

export const MovesProvider = ({
  initialSkills,
  hasNextPage: initialHasNextPage,
  endCursor,
  totalCount,
  children,
}: MovesProviderProps) => {
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [movesFilter, setMovesFilter] = useState<MovesFilterType>({})
  const [cursor, setCursor] = useState(endCursor)

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
    console.log('s')
    await fetchMore({
      variables: {
        input: {
          filter: movesFilter,
          pagination: {
            first: 20,
            after: cursor,
          },
        },
      },
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousQueryResult
        console.log(previousQueryResult.getPokemonSkillList)
        return produce(previousQueryResult, (draft) => {
          draft.getPokemonSkillList.edges = [
            ...previousQueryResult.getPokemonSkillList.edges,
            ...fetchMoreResult.getPokemonSkillList.edges,
          ]
          draft.getPokemonSkillList.pageInfo = {
            ...fetchMoreResult.getPokemonSkillList.pageInfo,
          }
        })
      },
    })
  }

  const setFilter = useCallback((filter: MovesFilterType) => {
    setMovesFilter(filter)
  }, [])

  const skillList =
    data?.getPokemonSkillList?.edges?.map(
      (edge: PokemonSkillEdge) => edge.node,
    ) || initialSkills

  const value = {
    skillList,
    movesFilter,
    hasNextPage,
    loading,
    totalCount,
    loadMore,
    setFilter,
  }

  return <MovesContext.Provider value={value}>{children}</MovesContext.Provider>
}
