import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'
import { Input } from '~/components'

const Search = styled.div`
  min-width: 50%;
  height: 60px;
  margin: 0 20px;
  border: 1px solid #333333;
  border-radius: 40px;
  display: flex;
  align-items: center;

  [class*='search-wrapper__input'] {
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
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
  const handleInputChange = React.useCallback(() => {}, [])

  const handleSelectInputClick = React.useCallback(() => {}, [])

  return (
    <Search>
      <div className="search-wrapper__input--name">
        <Input
          dataLabel="search-input-name"
          type="text"
          label="포켓몬 이름"
          placeholder="포켓몬 이름 검색"
          onChange={handleInputChange}
        />
      </div>
      <div className="search-wrapper__input--type">
        <Input
          dataLabel="search-input-type"
          type="select"
          label="포켓몬 타입"
          placeholder="포켓몬 타입 검색"
          onSelectInputClick={handleSelectInputClick}
        />
      </div>
      <div className="search-wrapper__input--generation">
        <Input
          dataLabel="search-input-generation"
          type="select"
          label="포켓몬 세대"
          placeholder="포켓몬 세대 검색"
        />
      </div>
      <div className="search-wrapper__input--checkbox">
        <Input
          dataLabel="search-input-generation"
          type="select"
          label="추가 설정"
          placeholder="추가설정"
        />
      </div>
    </Search>
  )
}

export default React.memo(SearchComponent, isEqual)
