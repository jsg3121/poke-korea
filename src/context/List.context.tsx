import { createContext, ReactNode } from 'react'
import { useGetPokemonListPaginatedQuery } from '~/graphql/gqlGenerated'
import {
  PokemonFilterInput,
  PokemonInfoFragment,
  PokemonList,
} from '~/graphql/typeGenerated'
import {
  mergePagedResults,
  extractNodesFromEdges,
} from '~/module/graphqlPagination.module'

interface ListProviderProps {
  initialList: Array<PokemonList>
  initialFilter: PokemonFilterInput
  hasNextPage: boolean
  children: ReactNode
}

type ListFilterType = {
  name?: string
  type?: Array<string>
  generation?: Array<string>
  isMega?: boolean
  isRegion?: boolean
  isEvolution?: boolean
  pokemonNumber?: number
  keyword?: string
}

type ContextType = {
  pokemonList: Array<PokemonInfoFragment>
  listFilter: ListFilterType
  hasNextPage?: boolean
  isLoadingMore: boolean
  loadMore: () => void
}

export const ListContext = createContext<ContextType>({
  pokemonList: [],
  listFilter: {},
  isLoadingMore: false,
  loadMore: () => null,
})

export const ListProvider = ({
  initialList,
  initialFilter,
  children,
  hasNextPage,
}: ListProviderProps) => {
  const {
    data,
    loading: isLoadingMore,
    fetchMore,
  } = useGetPokemonListPaginatedQuery({
    variables: {
      input: {
        filter: initialFilter,
        pagination: {
          first: 20,
        },
      },
    },
    skip: !hasNextPage,
  })

  const loadMore = async () => {
    if (!data?.getPokemonList.pageInfo.hasNextPage) {
      return
    }

    await fetchMore({
      variables: {
        input: {
          filter: initialFilter,
          pagination: {
            first: 20,
            after: data?.getPokemonList?.pageInfo.endCursor,
          },
        },
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        mergePagedResults('getPokemonList', prev, fetchMoreResult),
    })
  }

  const pokemonList = extractNodesFromEdges(
    data?.getPokemonList?.edges,
    initialList,
  )

  const initialValue = {
    pokemonList,
    listFilter: {},
    hasNextPage: data?.getPokemonList.pageInfo.hasNextPage,
    isLoadingMore,
    loadMore,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
