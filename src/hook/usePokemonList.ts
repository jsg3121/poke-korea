'use client'
import { useState } from 'react'
import { useGetPokemonListPaginatedQuery } from '~/graphql/gqlGenerated'
import {
  PokemonFilterInput,
  PokemonInfoFragment,
} from '~/graphql/typeGenerated'

interface UsePokemonListProps {
  initialData: Array<PokemonInfoFragment>
  initialFilter: PokemonFilterInput
}

export const usePokemonList = ({
  initialData,
  initialFilter,
}: UsePokemonListProps) => {
  const [pokemonList, setPokemonList] =
    useState<Array<PokemonInfoFragment>>(initialData)
  const [hasNextPage, setHasNextPage] = useState(true)

  const {
    data,
    loading: isLoadingMore,
    fetchMore,
  } = useGetPokemonListPaginatedQuery()

  const loadMore = async () => {
    await fetchMore({
      variables: {
        filter: {
          ...initialFilter,
          pagination: {
            first: 20,
            after: data?.,
          },
        },
      },
    })
  }

  const resetList = (
    newFilter: PokemonFilterInput,
    newData?: Array<PokemonInfoFragment>,
  ) => {
    setCurrentFilter(newFilter)
    setEndCursor(null)
    setHasNextPage(true)
    if (newData) {
      setPokemonList(newData)
      if (newData.length > 0) {
        const lastPokemon = newData[newData.length - 1]
        setEndCursor(lastPokemon.id)
      }
    }
  }

  return {
    pokemonList,
    hasNextPage,
    isLoadingMore,
    loadMore,
    resetList,
    currentFilter,
  }
}
