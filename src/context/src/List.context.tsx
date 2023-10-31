import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { PokemonInfoFragment, useGetPokemonListQuery } from '~/graphql/hooks'

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

gql`
  fragment PokemonInfo on Pokemon {
    id
    number
    name
    type
    isRegion
    isMega
    typeSingle1
    typeSingle2
    isEvolution
    evolutionId
    generation
    isForm
    stats {
      pokemonId
      hp
      attack
      defense
      specialAttack
      specialDefense
      speed
      total
    }
  }

  query getPokemonList(
    $pokemonNumber: Int
    $type: [String!]
    $isMega: Boolean
    $isRegion: Boolean
    $isEvolution: Boolean
    $name: String
    $generation: [String!]
  ) {
    getPokemonFilter(
      pokemonNumber: $pokemonNumber
      type: $type
      isMega: $isMega
      isRegion: $isRegion
      isEvolution: $isEvolution
      name: $name
      generation: $generation
    ) {
      ...PokemonInfo
    }
  }
`

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
