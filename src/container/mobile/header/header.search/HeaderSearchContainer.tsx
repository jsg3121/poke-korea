import { ChangeEvent, useEffect } from 'react'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'
import { useGetPokemonListLazyQuery } from '~/graphql/gqlGenerated'
import { useDebounce } from '~/hook/useDebounce'
import SearchResultList from './search.result/SearchResultList'

const HeaderSearchContainer = () => {
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
    })
  }

  const pokemonList = (data && data.getPokemonList) || []

  useEffect(() => {
    if (searchKeyword !== '') {
      searchPokemon()
    }
  }, [searchKeyword])

  return (
    <Div aria-labelledby="pokemon-search" role="search">
      <p id="pokemon-search" className="visually-hidden">
        포켓몬 검색하기
      </p>
      <div className="search-pokemon">
        <input
          type="text"
          name="search-pokemon"
          placeholder="포켓몬 검색"
          autoComplete="none"
          onChange={handleChangeKeyword}
        />
        <ImageComponent
          src="/assets/image/search.svg"
          width="2rem"
          height="2rem"
          alt="포켓몬 검색"
          className="icon-search"
        />
      </div>
      {searchKeyword !== '' && (
        <SearchResultList pokemonList={pokemonList} loading={loading} />
      )}
    </Div>
  )
}

export default HeaderSearchContainer

const Div = styled.div`
  width: 50%;
  position: relative;

  & > .search-pokemon {
    width: 100%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    position: relative;
    background-color: #ffffff;
    border-radius: 1.125rem;
    padding: 0 7px;
    overflow: hidden;

    & > input {
      width: 100%;
      height: 100%;
      font-size: 0.875rem;
      color: #333333;
      background-color: #ffffff;
      border: 0;
      padding: 5px 3px 4px;
      -webkit-appearance: textfield;
    }
  }
`
