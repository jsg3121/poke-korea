import { createContext, ReactNode, useContext } from 'react'
import { useGetChampionsPokemonListQuery } from '~/graphql/gqlGenerated'
import {
  ChampionsFormat,
  ChampionsPokemonCardFragment,
  ChampionsPokemonFilterInput,
  ChampionsPokemonSort,
} from '~/graphql/typeGenerated'
import { extractNodesFromEdges } from '~/module/graphqlPagination.module'

interface ChampionsPokedexProviderProps {
  initialList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
  format: ChampionsFormat
  sort: ChampionsPokemonSort
  children: ReactNode
}

type ContextType = {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  isLoadingMore: boolean
  totalCount: number
  loadMore: () => void
}

export const ChampionsPokedexContext = createContext<ContextType>({
  pokemonList: [],
  hasNextPage: false,
  isLoadingMore: false,
  totalCount: 0,
  loadMore: () => null,
})

export const ChampionsPokedexProvider = ({
  initialList,
  hasNextPage: initialHasNextPage,
  endCursor: initialEndCursor,
  totalCount: initialTotalCount,
  initialFilter,
  format,
  sort,
  children,
}: ChampionsPokedexProviderProps) => {
  const {
    data,
    loading: isLoadingMore,
    fetchMore,
  } = useGetChampionsPokemonListQuery({
    variables: {
      input: {
        format,
        sort,
        filter: initialFilter,
        pagination: {
          first: 20,
        },
      },
    },
    skip: !initialHasNextPage,
  })

  const loadMore = async () => {
    const currentEndCursor =
      data?.getChampionsPokemonList?.pageInfo.endCursor || initialEndCursor

    if (!data?.getChampionsPokemonList?.pageInfo.hasNextPage) {
      return
    }

    // edges 병합은 InMemoryCache의 typePolicies(getChampionsPokemonList.merge)가
    // 담당하므로 updateQuery는 지정하지 않는다(이중 병합 시 항목 중복 방지).
    await fetchMore({
      variables: {
        input: {
          format,
          sort,
          filter: initialFilter,
          pagination: {
            first: 20,
            after: currentEndCursor,
          },
        },
      },
    })
  }

  const pokemonList = extractNodesFromEdges(
    data?.getChampionsPokemonList?.edges,
    initialList,
  )

  const value: ContextType = {
    pokemonList,
    hasNextPage:
      data?.getChampionsPokemonList?.pageInfo.hasNextPage ?? initialHasNextPage,
    isLoadingMore,
    totalCount: data?.getChampionsPokemonList?.totalCount ?? initialTotalCount,
    loadMore,
  }

  return (
    <ChampionsPokedexContext.Provider value={value}>
      {children}
    </ChampionsPokedexContext.Provider>
  )
}

export const useChampionsPokedex = () => {
  const context = useContext(ChampionsPokedexContext)
  if (!context) {
    throw new Error(
      'useChampionsPokedex must be used within ChampionsPokedexProvider',
    )
  }
  return context
}
