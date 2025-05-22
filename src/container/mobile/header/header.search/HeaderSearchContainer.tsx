import { ChangeEvent, useEffect } from 'react'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'
import { useGetPokemonListLazyQuery } from '~/graphql/gqlGenerated'
import { useDebounce } from '~/hook/useDebounce'
import { imageMode } from '~/module/buildMode'

const HeaderSearchContainer = () => {
  const [searchKeyword, debounce] = useDebounce()

  const [getPokemonList, { data }] = useGetPokemonListLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: async () => {
      alert('213')
    },
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
        <div className="search-pokemon-list">
          <ul>
            {pokemonList.length > 0 ? (
              pokemonList.map((pokemon) => {
                return (
                  <li key={pokemon.id}>
                    {pokemon.name}
                    <ImageComponent
                      height="2rem"
                      width="2rem"
                      alt={`pokemon_id_${pokemon.number} ${pokemon.name}`}
                      src={`${imageMode}/${pokemon.number}.webp`}
                      unoptimized
                    />
                  </li>
                )
              })
            ) : (
              <li>포켓몬 없음</li>
            )}
          </ul>
        </div>
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

  & > .search-pokemon-list {
    width: 100%;
    min-height: 2.5rem;
    background-color: #ffffff;
    padding: 1rem 0.25rem 1rem 0.5rem;
    border-radius: 1.125rem;
    position: absolute;
    top: 3rem;
    z-index: 100;

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

      & > li {
        width: 100%;
        height: 2.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
`
