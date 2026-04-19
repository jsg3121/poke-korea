import { createContext, ReactNode, useContext } from 'react'
import { useGetChampionsPokemonListQuery } from '~/graphql/gqlGenerated'
import {
  ChampionsPokemonCardFragment,
  ChampionsPokemonFilterInput,
} from '~/graphql/typeGenerated'
import {
  mergePagedResults,
  extractNodesFromEdges,
} from '~/module/graphqlPagination.module'

interface ChampionsPokedexProviderProps {
  initialList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
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
  children,
}: ChampionsPokedexProviderProps) => {
  const {
    data,
    loading: isLoadingMore,
    fetchMore,
  } = useGetChampionsPokemonListQuery({
    variables: {
      input: {
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

    await fetchMore({
      variables: {
        input: {
          filter: initialFilter,
          pagination: {
            first: 20,
            after: currentEndCursor,
          },
        },
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        mergePagedResults('getChampionsPokemonList', prev, fetchMoreResult),
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
