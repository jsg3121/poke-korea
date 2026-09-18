import { Fragment } from 'react'

import { PokemonFormInfo } from '~/graphql/typeGenerated'

import SearchResultData from './resultList/ResultListData.component'
import ResultListLoading from './resultList/ResultListLoading.component'
import ResultListNoData from './resultList/ResultListNoData.component'

interface SearchResultListProps {
  pokemonList: Array<PokemonFormInfo>
  loading: boolean
}

/**
 * 헤더 검색 결과 드롭다운.
 *
 * @remarks
 * - `left-0`은 생략할 수 없다 — 미지정 시 정적 위치에 의존해 검색 인풋과 좌측이 어긋난다.
 */
const SearchResultList = ({ pokemonList, loading }: SearchResultListProps) => {
  return (
    <div className="w-full min-h-10 bg-white p-4 px-2 rounded-[1.125rem] absolute left-0 mobile:top-10 mobile:z-[600] desktop:top-14 desktop:z-[100]">
      <ul className="w-full max-h-60 overflow-y-auto [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-[7px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-track]:p-[2px]">
        {loading ? (
          <ResultListLoading />
        ) : (
          <Fragment>
            {pokemonList.length > 0 ? (
              pokemonList.map((pokemon) => {
                return (
                  <SearchResultData
                    key={`pokemon-id-${pokemon.id}`}
                    name={pokemon.name}
                    number={pokemon.number}
                    imagePath={pokemon.imagePath}
                    formType={pokemon.formType}
                    formIndex={pokemon.index}
                  />
                )
              })
            ) : (
              <ResultListNoData />
            )}
          </Fragment>
        )}
      </ul>
    </div>
  )
}

export default SearchResultList
