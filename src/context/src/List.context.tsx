import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { Pokemon } from '../../graphql'

interface ListProviderProps {
  children: React.ReactNode
}

type PokemonDataType = {
  getPokemonFilter: Array<Pokemon>
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
  pokemonList?: Array<Pokemon>
  loading?: boolean
  onChagneFilter?: (filter: ListFilterType) => void
}

gql`
  query GetPokemonFilter(
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
  }
`

export const ListContext = React.createContext<ContextType>({})

export const ListProvider: React.FC<ListProviderProps> = (props) => {
  const { children } = props
  const [listFilter, setListFilter] = React.useState<ListFilterType>({})

  const { data, loading } = useQuery<PokemonDataType>(POKEMON_LIST, {
    variables: { ...listFilter },
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
    pokemonList: data?.getPokemonFilter,
    loading,
    onChagneFilter,
  }

  return (
    <ListContext.Provider value={initialValue}>{children}</ListContext.Provider>
  )
}
