import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'

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

    &:first-child {
      label {
        padding-left: 25px;
      }
    }

    &:last-child {
      label {
        padding-right: 25px;
      }
    }

    label {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;

      .input__label {
        width: 100%;
        height: 14px;
        font-size: 12px;
        font-weight: 700;
        text-align: left;
        line-height: 14px;
      }

      .wrapper__input {
        width: 100%;
        height: 20px;
        font-size: 16px;
        font-weight: normal;
        line-height: 20px;
        border: 0;
        padding: 0;
        cursor: pointer;
      }
    }
  }

  .search-wrapper__input {
    &--name {
      width: 50%;
    }
    &--type {
      width: 25%;
    }
    &--generation {
      width: 25%;
    }
  }
`

const SearchComponent: React.FC = () => {
  return (
    <Search>
      <div className="search-wrapper__input--name">
        <label htmlFor="search-input-name">
          <p className="input__label">포켓몬 이름</p>
          <input
            type="text"
            className="wrapper__input"
            id="search-input-name"
            placeholder="포켓몬 이름 검색"
          />
        </label>
      </div>
      <div className="search-wrapper__input--type">
        <label htmlFor="search-input-type">
          <p className="input__label">포켓몬 타입</p>
          <input
            type="text"
            className="wrapper__input"
            id="search-input-type"
            placeholder="포켓몬 타입 검색"
          />
        </label>
      </div>
      <div className="search-wrapper__input--generation">
        <label htmlFor="search-input-generation">
          <p className="input__label">포켓몬 세대</p>
          <input
            type="text"
            className="wrapper__input"
            id="search-input-generation"
            placeholder="포켓몬 등장 세대 검색"
          />
        </label>
      </div>
    </Search>
  )
}

export default React.memo(SearchComponent, isEqual)
