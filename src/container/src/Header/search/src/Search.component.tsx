import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { Image, Input } from '~/components'
import { ListContext } from '~/context'

const Search = styled.div`
  width: 100%;
  max-width: 41.66666667rem;
  height: 3.33333333rem;
  border: 1px solid #dddddd;
  box-shadow:
    0 3px 12px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.08);
  border-radius: 2.22222222rem;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  top: 3.33333333rem;
  left: 50%;
  transform: translateX(-50%);
  transition:
    top 0.3s,
    width 0.3s,
    max-width 0.3s;
  will-change: top, width, max-width;

  &[data-scrolling='true'] {
    width: 40%;
    max-width: 600px;
    top: -3.33333333rem;
  }

  &:hover {
    background-color: #ebebeb;
    border-radius: 2.22222222rem;
  }

  .search__input {
    width: calc(100% - 3.5rem);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .search__button--icon {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translate(0, -50%);
    cursor: pointer;
  }
`

const SearchComponent: React.FC = () => {
  const { scrolling } = React.useContext(ListContext)
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = React.useState<string>()

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replaceAll(' ', '')
      setSearchKeyword(() => value)
    },
    [],
  )

  const handleKeyDownSearch = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value.replaceAll(' ', '')
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          name: value.trim(),
        },
      })
    }
  }

  const handleClickSearchPokemon = () => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        name: searchKeyword?.trim(),
      },
    })
  }

  return (
    <Search data-scrolling={scrolling}>
      <div className="search__input">
        <Input
          dataLabel="search-input-name"
          type="text"
          label="포켓몬 검색"
          placeholder="포켓몬의 이름을 입력해주세요"
          onChange={handleInputChange}
          onKeyDown={handleKeyDownSearch}
          defaultValue={router.query.name as string}
        />
      </div>
      <button
        className="search__button--icon"
        onClick={handleClickSearchPokemon}
      >
        <Image
          src="/assets/image/search.svg"
          width="2rem"
          height="2rem"
          alt="포켓몬 검색"
        />
      </button>
    </Search>
  )
}

export default SearchComponent
