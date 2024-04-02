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
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <HeaderNav />
      <Logo />
      <Search />
      <Filter />
    </Header>
  )
}

export default HeaderContainer
