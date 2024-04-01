import React from 'react'
import styled from 'styled-components'
import HeaderNav from './nav/header.nav'
import { Logo } from './logo'
import { Search } from './search'
import { Filter } from './filter'

const Header = styled.header`
  width: 100%;
  height: 29rem;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: var(--color-primary-2);
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
