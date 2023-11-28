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
  listFilter: ListFilterType
  selectOption: SelectFilterType
  loading: boolean
  onChangeFilter?: (filter: ListFilterType) => void
  onSelectSearchFilter?: (filterOption: SelectFilterType) => void
}

export const ListContext = React.createContext<ContextType>({
  pokemonList: [],
  listFilter: {},
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

  const onChangeFilter = React.useCallback((filter: ListFilterType) => {
    setListFilter((value) => {
      return {
        ...value,
        ...filter,
      }
    })
  }, [])

  const initialValue = {
    pokemonList: data?.getPokemonFilter || [],
    listFilter: {},
    selectOption,
    loading,
    onChangeFilter,
    onSelectSearchFilter,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
