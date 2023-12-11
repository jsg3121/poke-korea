import React from 'react'
import styled from 'styled-components'
import { Logo } from './logo'
import { Search } from './search'
import { Filter } from './filter'

const Header = styled.header`
  width: 100%;
  height: 8.5rem;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 1px 6px -2px #838383;
  background: linear-gradient(0deg, #142129 37.5%, #7e8da1 100%);
  padding: 0 5rem 0.5rem;

  .header__search {
    width: 100%;
    max-width: 1980px;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1.11111111rem 0;
    gap: 5rem;
    margin: 0 auto;

    .header__logo {
      width: 10rem;
    }
  }

  .header__filter {
    width: 100%;
    max-width: 1980px;
    height: 3rem;
    background-color: transparent;
    margin: 0 auto;
  }
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <div className="header__search">
        <div className="header__logo">
          <Logo />
        </div>
        <Search />
      </div>
      <div className="header__filter">
        <Filter />
      </div>
    </Header>
  )
}

export default HeaderContainer
