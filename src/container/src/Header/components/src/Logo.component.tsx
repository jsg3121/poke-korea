import React from 'react'
import isEqual from 'fast-deep-equal'
import LogoIcon from '~/assets/logo.svg'
import styled from 'styled-components'

const Logo = styled.div`
  width: 130px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoComponent: React.FC = () => {
  return (
    <Logo>
      <LogoIcon />
    </Logo>
  )
}

export default React.memo(LogoComponent, isEqual)
