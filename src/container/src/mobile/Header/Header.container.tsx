import React from 'react'
import styled from 'styled-components'
import { Filter } from './filter'
import { Logo } from './logo'
import { Search } from './search'

const Header = styled.header`
  width: 100%;
  height: 15rem;
  background-color: blue;

  & > .header-wrapper {
    width: 100%;
    padding-top: 2rem;
  }
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <div className="header-wrapper">
        <Logo />
        <Search />
      </div>
      <Filter />
    </Header>
  )
}

export default HeaderContainer
