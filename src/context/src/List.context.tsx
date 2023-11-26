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

export type SelectFilterType = 'type' | 'generation' | 'moreOption' | undefined

type ContextType = {
  pokemonList: Array<PokemonInfoFragment>
  selectOption: SelectFilterType
  loading: boolean
  onChagneFilter?: (filter: ListFilterType) => void
  onSelectSearchFilter?: (filterOption: SelectFilterType) => void
}

export const ListContext = React.createContext<ContextType>({
  pokemonList: [],
  selectOption: undefined,
  loading: false,
})

export const ListProvider: React.FC<ListProviderProps> = (props) => {
  const { children } = props
  const [listFilter, setListFilter] = React.useState<ListFilterType>({})
  const [selectOption, setSeletOption] = React.useState<SelectFilterType>()

  const { data, loading } = useGetPokemonListQuery({
    variables: {
      ...listFilter,
    },
    fetchPolicy: 'cache-and-network',
  })

  const onSelectSearchFilter = (filterOption: SelectFilterType) => {
    setSeletOption(filterOption)
  }

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
    selectOption,
    loading,
    onChagneFilter,
    onSelectSearchFilter,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
