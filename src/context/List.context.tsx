import { createContext, ReactNode } from 'react'
import { PokemonList, PokemonInfoFragment } from '~/graphql/typeGenerated'

interface ListProviderProps {
  pokemonList: Array<PokemonList>
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
}

export const ListContext = createContext<ContextType>({
  pokemonList: [],
  listFilter: {},
  scrolling: false,
  searching: false,
})

export const ListProvider = ({
  pokemonList,
  children,
  scrolling,
  searching,
}: ListProviderProps) => {
  const initialValue = {
    pokemonList,
    listFilter: {},
    scrolling,
    searching,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
