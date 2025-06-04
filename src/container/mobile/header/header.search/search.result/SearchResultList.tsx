import { PokemonList } from '~/graphql/typeGenerated'
import ResultListLoading from './result.list/ResultListLoading'
import { Fragment } from 'react'
import SearchResultData from './result.list/ResultListData'
import ResultListNoData from './result.list/ResultListNoData'

interface SearchResultListProps {
  pokemonList: Array<PokemonList>
  loading: boolean
}

const SearchResultList = ({ pokemonList, loading }: SearchResultListProps) => {
  return (
    <div className="w-full min-h-10 bg-white p-4 px-2 rounded-[1.125rem] absolute top-12 z-[600]">
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
