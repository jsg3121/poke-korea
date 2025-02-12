import React from 'react'
import styled from 'styled-components'
import LogoComponent from './logo/Logo.component'
import SearchComponent from './search/Search.component'
import FilterComponents from './filter/Filter.components'

const Header = styled.header`
  width: 100%;
  min-height: 15rem;
  padding-top: 5rem;
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <LogoComponent />
      <SearchComponent />
      <FilterComponents />
    </Header>
  )
}

export default HeaderContainer
