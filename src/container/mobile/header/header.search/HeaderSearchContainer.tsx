'use client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ImageComponent from '~/components/Image.component'
import { useSearchPokemonWithAllFormsLazyQuery } from '~/graphql/gqlGenerated'
import { useDebounce } from '~/hook/useDebounce'
import { useOutSideClickMobile } from '~/hook/useOutSideClickMobile'
import SearchResultList from './search.result/SearchResultList'

const HeaderSearchContainer = () => {
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

  const handleHideSearchResult = () => {
    setIsShowSearchResult(() => false)
  }

  const pokemonList = (data && data.searchPokemonWithAllForms) || []

  useEffect(() => {
    if (searchKeyword !== '' && searchKeyword.length >= 2) {
      searchPokemon()
    }

    if (searchKeyword === '') {
      setIsShowSearchResult(false)
    }
  }, [searchKeyword])

  useOutSideClickMobile({
    ref: searchRef,
    isActive: isShowSearchResult,
    onOutsideClick: handleHideSearchResult,
  })

  return (
    <div
      ref={searchRef}
      className="w-2/3 relative"
      aria-labelledby="pokemon-search"
      role="search"
    >
      <p id="pokemon-search" className="sr-only">
        포켓몬 검색하기
      </p>
      <div className="w-full h-10 flex items-center relative bg-white rounded-[1.125rem] px-[7px] overflow-hidden">
        <input
          type="text"
          name="search-pokemon"
          placeholder="포켓몬 검색 (2글자 이상)"
          autoComplete="off"
          onChange={handleChangeKeyword}
          className="w-full h-full text-sm text-[#333333] bg-white border-0 px-[3px] py-[5px] [-webkit-appearance:textfield]"
        />
        <ImageComponent
          src="/assets/image/search.svg"
          width="2rem"
          height="2rem"
          alt="포켓몬 검색"
          className="icon-search"
        />
      </div>
      {isShowSearchResult && (
        <SearchResultList pokemonList={pokemonList} loading={loading} />
      )}
    </div>
  )
}

export default HeaderSearchContainer
