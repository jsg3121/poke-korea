'use client'
import SearchResultList from '~/components/common/headerSearch/SearchResultList.component'
import ImageComponent from '~/components/Image.component'
import { useSearchPokemon } from '~/hooks/useSearchPokemon'

const DetailSearch = () => {
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
      className="w-[30rem] h-12 absolute right-1/2 translate-x-1/2 top-0 rounded-[2rem] bg-white z-10"
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
          placeholder="포켓몬 검색"
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
