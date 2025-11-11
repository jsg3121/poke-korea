'use client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ImageComponent from '~/components/Image.component'
import { useGetPokemonListLazyQuery } from '~/graphql/gqlGenerated'
import { useDebounce } from '~/hook/useDebounce'
import { useOutSideClickMobile } from '~/hook/useOutSideClickMobile'
import SearchResultList from './search.result/SearchResultList'

const HeaderSearchContainer = () => {
  const searchRef = useRef<HTMLDivElement>(null)
  const [isShowSearchResult, setIsShowSearchResult] = useState<boolean>(false)
  const [searchKeyword, debounce] = useDebounce()

  const [getPokemonList, { data, loading }] = useGetPokemonListLazyQuery({
    fetchPolicy: 'cache-and-network',
  })

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim()
    debounce(keyword)
  }

  const searchPokemon = async () => {
    await getPokemonList({
      variables: {
        filter: {
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

  const pokemonList = (data && data.getPokemonList) || []

  useEffect(() => {
    if (searchKeyword !== '') {
      searchPokemon()
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
      className="w-1/2 relative"
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
          placeholder="포켓몬 검색"
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
