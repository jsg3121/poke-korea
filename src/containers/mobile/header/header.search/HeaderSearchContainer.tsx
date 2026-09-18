'use client'
import Link from 'next/link'
import FeedbackIcon from '~/assets/icons/feedback.svg'
import SearchResultList from '~/components/common/headerSearch/SearchResultList.component'
import ImageComponent from '~/components/Image.component'
import { useSearchPokemon } from '~/hooks/useSearchPokemon'

const HeaderSearchContainer = () => {
  const {
    searchRef,
    isShowSearchResult,
    pokemonList,
    loading,
    handleChangeKeyword,
  } = useSearchPokemon()

  return (
    <div
      ref={searchRef}
      className="flex-1 min-w-0 relative"
      aria-labelledby="pokemon-search"
      role="search"
    >
      <p id="pokemon-search" className="sr-only">
        포켓몬 검색하기
      </p>
      <div className="w-4/5 h-8 flex items-center relative bg-white rounded-[1.125rem] px-[7px] overflow-hidden">
        <input
          type="text"
          name="search-pokemon"
          placeholder="포켓몬 검색"
          autoComplete="off"
          onChange={handleChangeKeyword}
          className="w-full h-full text-xs text-[#333333] bg-white border-0 px-[3px] py-[5px] [-webkit-appearance:textfield]"
        />
        <ImageComponent
          src="/assets/image/search.svg"
          width="1.5rem"
          height="1.5rem"
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
