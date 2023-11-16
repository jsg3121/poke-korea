import React from 'react'
import isEqual from 'fast-deep-equal'
import LogoIcon from '~/assets/logo.svg'
import styled from 'styled-components'

const Logo = styled.div`
  width: 40%;

  .header-title {
    font-size: 1.4rem;
    line-height: 2rem;
    color: #ffffff;
    text-align: center;
    margin-bottom: 1rem;
  }
`

const LogoComponent: React.FC = () => {
  return (
    <Logo>
      <h1 className="header-title">포켓몬의 모든 정보 Poke Korea</h1>
      <LogoIcon />
    </Logo>
  )
}

export default React.memo(LogoComponent, isEqual)
