import React from 'react'
import styled from 'styled-components'
import { Filter } from './filter'
import { Logo } from './logo'
import HeaderNav from './nav/header.nav'
import { Search } from './search'

const Header = styled.header`
  width: 100%;
  height: 31rem;
  background-color: var(--color-primary-2);
  transition: all 0.3s;
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 1.5rem 0 0;

  & > .header-wrapper {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
  }
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <HeaderNav />
      <div className="header-wrapper">
        <Logo />
        <Search />
      </div>
      <Filter />
    </Header>
  )
}

export default HeaderContainer
