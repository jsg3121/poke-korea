import isEqual from 'fast-deep-equal'
import React from 'react'
import styled from 'styled-components'
import LogoIcon from '~/assets/logo.svg'

const Div = styled.div`
  width: 25rem;
  margin: 0 auto;
`

const LogoComponent: React.FC = () => {
  return (
    <Div>
      <LogoIcon />
    </Div>
  )
}

export default React.memo(LogoComponent, isEqual)
