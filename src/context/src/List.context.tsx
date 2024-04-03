import { useRouter } from 'next/router'
import React from 'react'
import { Pokemon, PokemonInfoFragment } from '~/graphql/typeGenerated'

interface ListProviderProps {
  scrolling: boolean
  pokemonList: Array<Pokemon>
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
  scrolling: boolean
}

export const ListContext = React.createContext<ContextType>({
  pokemonList: [],
  listFilter: {},
  scrolling: false,
})

export const ListProvider: React.FC<ListProviderProps> = (props) => {
  const { pokemonList, children, scrolling } = props
  const { query } = useRouter()

  const initialValue = {
    pokemonList,
    listFilter: {},
    scrolling,
  }

  return (
    <ListContext.Provider value={initialValue}>
      <React.Suspense>{children}</React.Suspense>
    </ListContext.Provider>
  )
}
