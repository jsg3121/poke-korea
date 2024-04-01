import React from 'react'
import styled from 'styled-components'
import NavLink from './components/Nav.link'
import NavSetting from './components/Nav.setting'

interface HeaderNavProps {}

const NavBar = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
`

const HeaderNav: React.FC<HeaderNavProps> = (props) => {
  const {} = props

  return (
    <NavBar>
      <NavLink />
      <NavSetting />
    </NavBar>
  )
}

export default HeaderNav
