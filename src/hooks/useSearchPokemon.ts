'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import { useSearchPokemonWithAllFormsLazyQuery } from '~/graphql/gqlGenerated'
import { useDebounce } from '~/hooks/useDebounce'
import { useOutSideClick } from '~/hooks/useOutSideClick'

export const useSearchPokemon = () => {
  const searchRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [isShowSearchResult, setIsShowSearchResult] = useState<boolean>(false)
  const [searchKeyword, debounce] = useDebounce()

  const [searchPokemonWithAllForms, { data, loading }] =
    useSearchPokemonWithAllFormsLazyQuery({
      fetchPolicy: 'cache-and-network',
    })

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim()
    debounce(keyword)
  }

  const handleHideSearchResult = () => {
    setIsShowSearchResult(() => false)
  }

  const pokemonList = (data && data.searchPokemonWithAllForms) || []

  useEffect(() => {
    const searchPokemon = async () => {
      await searchPokemonWithAllForms({
        variables: {
          input: {
            name: searchKeyword,
          },
        },
        onCompleted: (data) => {
          setIsShowSearchResult(() => true)
          return data
        },
      })
    }

    if (searchKeyword !== '') {
      searchPokemon()
    }

    if (searchKeyword === '') {
      setIsShowSearchResult(false)
    }
  }, [searchKeyword, searchPokemonWithAllForms])

  useEffect(() => {
    setIsShowSearchResult(false)
  }, [pathname])

  useOutSideClick({
    ref: searchRef,
    isActive: isShowSearchResult,
    onOutsideClick: handleHideSearchResult,
  })

  return {
    searchRef,
    isShowSearchResult,
    pokemonList,
    loading,
    handleChangeKeyword,
    handleHideSearchResult,
  }
}
