import styled from 'styled-components'
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
    <Div>
      <ul>
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
    </Div>
  )
}

export default SearchResultList

const Div = styled.div`
  width: 100%;
  min-height: 2.5rem;
  background-color: #ffffff;
  padding: 1rem 0.5rem;
  border-radius: 1.125rem;
  position: absolute;
  top: 3rem;
  z-index: 600;

  & > ul {
    width: 100%;
    max-height: 15rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: block;
      width: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-primary-2);
      border-radius: 12px;
    }

    &::-webkit-scrollbar-track {
      background: var(--color-primary-3);
      border-radius: 3px;
      padding: 2px;
    }
  }
`
