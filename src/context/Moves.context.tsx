'use client'

import { createContext, ReactNode, useState, useCallback } from 'react'
import { useGetPokemonSkillListQuery } from '~/graphql/gqlGenerated'
import { PokemonSkill, PokemonType } from '~/graphql/typeGenerated'

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
  loadMore: () => {},
  setFilter: () => {},
})

export const MovesProvider = ({
  initialSkills,
  hasNextPage: initialHasNextPage,
  endCursor,
  totalCount: initialTotalCount,
  children,
}: MovesProviderProps) => {
  const [skillList, setSkillList] = useState(initialSkills)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [loading, setLoading] = useState(false)
  const [movesFilter, setMovesFilter] = useState<MovesFilterType>({})
  const [cursor, setCursor] = useState(endCursor)
  const [totalCount, setTotalCount] = useState(initialTotalCount)

  const { fetchMore } = useGetPokemonSkillListQuery({
    variables: {
      input: {
        filter: movesFilter,
        pagination: {
          first: 20,
        },
      },
    },
    skip: true, // 초기 로딩은 서버에서 했으므로 skip
  })

  const loadMore = useCallback(async () => {
    if (!cursor || loading || !hasNextPage) return

    setLoading(true)
    try {
      const result = await fetchMore({
        variables: {
          input: {
            filter: movesFilter,
            pagination: {
              first: 20,
              after: cursor,
            },
          },
        },
      })

      const newEdges = result.data?.getPokemonSkillList?.edges || []
      const newSkills = newEdges.map((edge: any) => edge.node)
      const newPageInfo = result.data?.getPokemonSkillList?.pageInfo
      const newTotalCount = result.data?.getPokemonSkillList?.totalCount || 0

      setSkillList((prev) => [...prev, ...newSkills])
      setHasNextPage(newPageInfo?.hasNextPage || false)
      setCursor(newPageInfo?.endCursor)
      setTotalCount(newTotalCount)
    } catch (error) {
      console.error('Failed to load more skills:', error)
    } finally {
      setLoading(false)
    }
  }, [cursor, loading, hasNextPage, movesFilter, fetchMore])

  const setFilter = useCallback((filter: MovesFilterType) => {
    setMovesFilter(filter)
    // TODO: 필터 변경 시 리스트 재조회 로직 추가
  }, [])

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
