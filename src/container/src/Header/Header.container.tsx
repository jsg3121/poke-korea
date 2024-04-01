import React from 'react'
import styled from 'styled-components'
import HeaderNav from './nav/header.nav'

const Header = styled.header`
  width: 100%;
  height: 33.33333333rem;
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
      {/* <div className="header__search">
        <div className="header__logo">
          <Logo />
        </div>
        <Search />
      </div>
      <div className="header__filter">
        <Filter />
      </div> */}
    </Header>
  )
}

export default HeaderContainer
