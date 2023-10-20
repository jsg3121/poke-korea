import React from 'react'
import styled from 'styled-components'
import { Logo, Search, Settings } from './components'

const Header = styled.header`
  width: 100%;
  height: 130px;
  border-bottom: 1px solid #333333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <Logo />
      <Search />
      <Settings />
    </Header>
  )
}

export default HeaderContainer
