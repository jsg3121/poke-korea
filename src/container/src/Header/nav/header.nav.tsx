import React from 'react'
import styled from 'styled-components'
import NavSetting from './components/Nav.setting'

interface HeaderNavProps {}

const NavBar = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 3.33333333rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 auto;
`

const HeaderNav: React.FC<HeaderNavProps> = (props) => {
  const {} = props

  return (
    <NavBar>
      {/* <NavLink /> */}
      <NavSetting />
    </NavBar>
  )
}

export default HeaderNav
