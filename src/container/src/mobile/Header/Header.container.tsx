import React from 'react'
import styled from 'styled-components'
import { Filter } from './filter'
import { Logo } from './logo'
import { Search } from './search'

const Header = styled.header`
  width: 100%;
  min-height: 15rem;
  padding-top: 5rem;
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <Logo />
      <Search />
      <Filter />
    </Header>
  )
}

export default HeaderContainer
