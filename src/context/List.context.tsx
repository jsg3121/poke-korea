import { produce } from 'immer'
import { createContext, ReactNode } from 'react'
import { useGetPokemonListPaginatedQuery } from '~/graphql/gqlGenerated'
import {
  PokemonList,
  PokemonInfoFragment,
  PokemonFilterInput,
  PokemonEdge,
} from '~/graphql/typeGenerated'

interface ListProviderProps {
  initialList: Array<PokemonList>
  initialFilter: PokemonFilterInput
  children: ReactNode
  scrolling?: boolean
  searching?: boolean
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
  scrolling?: boolean
  searching?: boolean
  hasNextPage?: boolean
  isLoadingMore: boolean
  loadMore: () => void
}

export const ListContext = createContext<ContextType>({
  pokemonList: [],
  listFilter: {},
  scrolling: false,
  searching: false,
  isLoadingMore: false,
  loadMore: () => null,
})

export const ListProvider = ({
  initialList,
  initialFilter,
  children,
  scrolling,
  searching,
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
  })

  const loadMore = async () => {
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
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousQueryResult
        return produce(previousQueryResult, (draft) => {
          if (!draft.getPokemonList) {
            return
          }

          draft.getPokemonList.edges = [
            ...previousQueryResult.getPokemonList.edges,
            ...fetchMoreResult.getPokemonList.edges,
          ]
          draft.getPokemonList.pageInfo = {
            ...previousQueryResult.getPokemonList.pageInfo,
            endCursor: fetchMoreResult.getPokemonList.pageInfo.endCursor,
            hasNextPage: fetchMoreResult.getPokemonList.pageInfo.hasNextPage,
          }
        })
      },
    })
  }

  const pokemonList =
    data?.getPokemonList?.edges.map((edge: PokemonEdge) => {
      return edge.node
    }) || initialList

  const initialValue = {
    pokemonList,
    listFilter: {},
    scrolling,
    searching,
    hasNextPage: data?.getPokemonList.pageInfo.hasNextPage,
    isLoadingMore,
    loadMore,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
