import React from 'react'
import styled from 'styled-components'
import HeaderNav from './nav/header.nav'
import { Logo } from './logo'
import { Search } from './search'

const Header = styled.header`
  width: 100%;
  height: 28rem;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 1px 6px -2px var(--color-shadow-3);
  background-color: var(--color-primary-2);
  padding: 1.5rem 0;
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <HeaderNav />
      <Logo />
      <Search />
      {/* <div className="header__search">
        <div className="header__logo">
          
        </div>
      </div>
      <div className="header__filter">
        <Filter />
      </div> */}
    </Header>
  )
}

export default HeaderContainer
