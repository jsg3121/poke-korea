import React from 'react'
import styled from 'styled-components'
import { Logo, Search, Settings } from './components'

const Header = styled.header`
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #333333;
  padding: 0 20px;

  .header__content {
    width: 100%;
    max-width: 2160px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.11111111rem;
    margin: 0 auto;
  }
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <div className="header__content">
        <Logo />
        <Search />
        <Settings />
      </div>
    </Header>
  )
}

export default HeaderContainer
