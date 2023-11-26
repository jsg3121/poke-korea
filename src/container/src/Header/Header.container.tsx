import React from 'react'
import styled from 'styled-components'
import { Logo, Search } from './components'

const Header = styled.header`
  width: 100%;
  height: 6rem;
  padding: 0 1.11111111rem;
  background: linear-gradient(0deg, #142129 0%, #7e8da1 100%);
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 1px 6px -2px #838383;

  .header__content {
    width: 15rem;
    max-width: 2160px;
    height: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.11111111rem;
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
