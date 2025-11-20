'use client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ImageComponent from '~/components/Image.component'
import { useSearchPokemonWithAllFormsLazyQuery } from '~/graphql/gqlGenerated'
import { useDebounce } from '~/hook/useDebounce'
import { useOutSideClick } from '~/hook/useOutSideClick'
import SearchResultList from './search.detail/SearchResultList'

const DetailSearch = () => {
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

  useOutSideClick({
    ref: searchRef,
    isActive: isShowSearchResult,
    onOutsideClick: handleHideSearchResult,
  })

  return (
    <div
      ref={searchRef}
      className="w-[30rem] h-12 absolute left-1/2 -translate-x-1/2 top-0 rounded-[2rem] bg-white"
      aria-labelledby="pokemon-search"
      role="search"
    >
      <p id="pokemon-search" className="sr-only">
        포켓몬 검색하기
      </p>
      <div className="w-full h-full flex items-center cursor-text rounded-[2.22222222rem] px-[1.38888889rem] relative">
        <input
          type="text"
          name="search-pokemon"
          placeholder="포켓몬 검색 (2글자 이상 입력 필수)"
          autoComplete="off"
          onChange={handleChangeKeyword}
          className=" w-[calc(100%-5rem)] h-8 text-base font-normal leading-8 border-0 p-0 cursor-text bg-transparent absolute left-[1.38888889rem] transition-[top] duration-300 placeholder:text-[#999999] placeholder:text-[0.83333333rem]"
        />
        <button
          type="submit"
          className="w-8 h-8 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
        >
          <ImageComponent
            src="/assets/image/search.svg"
            width="2rem"
            height="2rem"
            alt="포켓몬 검색"
            fetchPriority="high"
            imageSize={{
              width: 32,
              height: 32,
            }}
          />
        </button>
      </div>
      {isShowSearchResult && (
        <SearchResultList pokemonList={pokemonList} loading={loading} />
      )}
    </div>
  )
}

export default DetailSearch
