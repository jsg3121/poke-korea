import React from 'react'
import styled from 'styled-components'
import { Logo, Search, Settings } from './components'

const Header = styled.header`
  width: 100%;
  padding: 0 1.11111111rem 1.38888889rem;
  box-shadow: rgb(0 0 0 / 8%) 0 1px 0;

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
        <Settings />
      </div>
      <Search />
    </Header>
  )
}

export default HeaderContainer
