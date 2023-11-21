import React from 'react'
import styled from 'styled-components'
import { Logo, Search } from './components'

const Header = styled.header`
  width: 100%;
  height: 32rem;
  padding: 7rem 1.11111111rem 1rem;
  background: linear-gradient(0deg, #142129 0%, #7e8da1 100%);
  position: sticky;
  top: -25.5rem;
  z-index: 5;

  .header__content {
    width: 100%;
    max-width: 2160px;
    height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.11111111rem;
    margin: 0 auto;
  }
`

const HeaderContainer: React.FC = () => {
  return (
    <Header>
      <div className="header__content">
        <Logo />
      </div>
      <Search />
    </Header>
  )
}

export default HeaderContainer
