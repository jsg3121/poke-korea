import React, { useContext } from 'react'
import styled from 'styled-components'
import HeaderNav from './nav/header.nav'
import { Logo } from './logo'
import { Search } from './search'
import { Filter } from './filter'
import { useHeaderScroll } from '~/hook/src/useHeaderScroll'
import { ListContext } from '~/context'

const Header = styled.header`
  width: 100%;
  height: 29rem;
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: var(--color-primary-2);
  transition: all 0.3s;
  position: sticky;
  top: 0;
  padding: 1.5rem 0 0;

  &[data-scrolling='true'] {
  }
`

const HeaderContainer: React.FC = () => {
  const { scrolling } = useContext(ListContext)

  return (
    <Header data-scrolling={scrolling}>
      <HeaderNav />
      <Logo />
      <Search />
      <Filter />
    </Header>
  )
}

export default HeaderContainer
