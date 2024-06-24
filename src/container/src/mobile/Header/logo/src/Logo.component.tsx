import isEqual from 'fast-deep-equal'
import React from 'react'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'

const Div = styled.div`
  width: 100%;
  width: 20rem;
  margin: 0 auto 1rem;
`

const LogoComponent: React.FC = () => {
  return (
    <Div>
      <LogoIcon />
    </Div>
  )
}

export default React.memo(LogoComponent, isEqual)
