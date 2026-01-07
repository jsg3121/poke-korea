'use client'
import Link from 'next/link'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import FeedbackIcon from '~/assets/icons/feedback.svg'
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
      <div className="w-4/5 h-10 flex items-center relative bg-white rounded-[1.125rem] px-[7px] overflow-hidden">
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
          imageSize={{ width: 24, height: 24 }}
          alt="포켓몬 검색"
          className="icon-search"
        />
      </div>
      <Link
        href="https://forms.gle/BP9QVkj42xTJ5beQ8"
        target="_blank"
        className="h-8 text-primary-4 absolute right-0 top-1/2 -translate-y-1/2 bg-primary-1 px-2 rounded-md flex-items-gap-2"
      >
        <FeedbackIcon width={16} height={16} />
        <span className="sr-only">기능/오류 신고</span>
      </Link>
      {isShowSearchResult && (
        <SearchResultList pokemonList={pokemonList} loading={loading} />
      )}
    </div>
  )
}

export default HeaderSearchContainer
