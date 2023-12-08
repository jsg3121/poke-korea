import { useRouter } from 'next/router'
import React from 'react'
import { useGetPokemonListQuery } from '~/graphql/gqlGenerated'
import { PokemonInfoFragment } from '~/graphql/typeGenerated'

interface ListProviderProps {
  children: React.ReactNode
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
  loading: boolean
}

export const ListContext = React.createContext<ContextType>({
  pokemonList: [],
  listFilter: {},
  loading: false,
})

export const ListProvider: React.FC<ListProviderProps> = (props) => {
  const { children } = props
  const { query } = useRouter()

  const changeTypeArrayToString = query.type
    ? (query.type as string).split(',')
    : []

  const { data, loading } = useGetPokemonListQuery({
    variables: {
      ...query,
      ...(query.type && {
        type: changeTypeArrayToString,
      }),
    },
    fetchPolicy: 'cache-and-network',
  })

  const initialValue = {
    pokemonList: data?.getPokemonFilter || [],
    listFilter: {},
    loading,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
