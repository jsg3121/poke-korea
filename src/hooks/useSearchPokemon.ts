'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { useSearchPokemonWithAllFormsLazyQuery } from '~/graphql/gqlGenerated'
import { useDebounce } from '~/hooks/useDebounce'
import { useOutSideClick } from '~/hooks/useOutSideClick'

/**
 * 헤더 검색창의 키워드 입력·조회·결과 노출을 담당한다.
 *
 * @remarks
 * - 반환된 `searchRef`를 검색 영역 루트에 연결해야 바깥 클릭 감지가 동작한다.
 */
export const useSearchPokemon = () => {
  const searchRef = useRef<HTMLDivElement>(null)
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
  }
}
