import { Fragment } from 'react'
import { PokemonFormInfo } from '~/graphql/typeGenerated'
import SearchResultData from './result.list/ResultListData'
import ResultListLoading from './result.list/ResultListLoading'
import ResultListNoData from './result.list/ResultListNoData'

interface SearchResultListProps {
  pokemonList: Array<PokemonFormInfo>
  loading: boolean
}

const SearchResultList = ({ pokemonList, loading }: SearchResultListProps) => {
  return (
    // left-0 명시로 검색 인풋과 좌측 정렬(미지정 시 정적 위치에 의존해 어긋남).
    // w-full = 검색 루트 전체 폭이라 인풋(4/5)보다 넓다
    <div className="w-full min-h-10 bg-white p-4 px-2 rounded-[1.125rem] absolute left-0 top-12 z-[600]">
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
