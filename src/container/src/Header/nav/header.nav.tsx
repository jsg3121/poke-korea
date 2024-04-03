import React from 'react'
import styled from 'styled-components'
import NavSetting from './components/Nav.setting'
import { ListContext } from '~/context'

interface HeaderNavProps {}

const NavBar = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 3.33333333rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  margin: 0 auto;
`

const HeaderNav: React.FC<HeaderNavProps> = (props) => {
  const {} = props
  const { scrolling } = React.useContext(ListContext)

  return (
    <NavBar>
      {/* <NavLink /> 2차 기능 개발시 적용 */}
      <NavSetting scrolling={scrolling} />
    </NavBar>
  )
}

export default HeaderNav
