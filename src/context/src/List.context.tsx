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
  loading: boolean
  onChagneFilter?: (filter: ListFilterType) => void
}

export const ListContext = React.createContext<ContextType>({
  pokemonList: [],
  loading: false,
})

export const ListProvider: React.FC<ListProviderProps> = (props) => {
  const { children } = props
  const [listFilter, setListFilter] = React.useState<ListFilterType>({})

  const { data, loading } = useGetPokemonListQuery({
    variables: {
      ...listFilter,
      generation: ['9'],
    },
    fetchPolicy: 'cache-and-network',
  })

  const onChagneFilter = React.useCallback((filter: ListFilterType) => {
    setListFilter((value) => {
      return {
        ...value,
        ...filter,
      }
    })
  }, [])

  const initialValue = {
    pokemonList: data?.getPokemonFilter || [],
    loading,
    onChagneFilter,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
