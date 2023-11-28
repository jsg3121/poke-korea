import React, { useContext } from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { Input } from '~/components'
import { ListContext, SelectFilterType } from '~/context'
import { SearchSelect } from './search.select'
import useOutsideEffect from '~/hook/src/useOutSideEffect'

const Search = styled.div`
  min-width: 50%;
  max-width: 960px;
  height: 3.33333333rem;
  border: 1px solid #dddddd;
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  border-radius: 2.22222222rem;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);

  [class*='search-wrapper__input'] {
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;

    &:hover {
      background-color: #ebebeb;
      border-radius: 2.22222222rem;
    }
  }

  .search-wrapper__input {
    &--name {
      width: 34%;
    }
    &--type {
      width: 22%;
    }
    &--generation {
      width: 22%;
    }
    &--checkbox {
      width: 22%;
    }
  }
`

const SearchComponent: React.FC = () => {
  const searchRef = React.useRef<HTMLDivElement>(null)

  const { selectOption, onChangeFilter, onSelectSearchFilter } =
    useContext(ListContext)

  const handleInputChange = React.useCallback(
    (value: string) => {
      if (onChangeFilter) {
        onChangeFilter({ name: value })
      }
    },
    [onChangeFilter]
  )

  const handleSelectInputClick = React.useCallback(
    (options: SelectFilterType) => () => {
      if (onSelectSearchFilter) {
        onSelectSearchFilter(options)
      }
    },
    [onSelectSearchFilter]
  )

  const handleOutSideEffect = () => {
    if (onSelectSearchFilter) {
      onSelectSearchFilter(undefined)
    }
  }

  useOutsideEffect(searchRef, handleOutSideEffect)

  return (
    <Search ref={searchRef}>
      <div className="search-wrapper__input--name">
        <Input
          dataLabel="search-input-name"
          type="text"
          label="포켓몬"
          placeholder="포켓몬 검색"
          onChange={handleInputChange}
        />
      </div>
      <div className="search-wrapper__input--type">
        <Input
          dataLabel="search-input-type"
          type="select"
          label="포켓몬 타입"
          placeholder="포켓몬 타입 검색"
          onSelectInputClick={handleSelectInputClick('type')}
        />
      </div>
      <div className="search-wrapper__input--generation">
        <Input
          dataLabel="search-input-generation"
          type="select"
          label="포켓몬 세대"
          placeholder="포켓몬 세대 검색"
          onSelectInputClick={handleSelectInputClick('generation')}
        />
      </div>
      <div className="search-wrapper__input--checkbox">
        <Input
          dataLabel="search-input-generation"
          type="select"
          label="추가 설정"
          placeholder="추가설정"
          onSelectInputClick={handleSelectInputClick('moreOption')}
        />
      </div>
      {selectOption && <SearchSelect />}
    </Search>
  )
}

export default React.memo(SearchComponent, isEqual)
