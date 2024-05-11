import React from 'react'
import styled from 'styled-components'
import { NormalStats } from '~/graphql/typeGenerated'
import { AbilityChart } from './components'

const Article = styled.article`
  width: 25rem;
  height: 25rem;
`

const AbilityComponent: React.FC<NormalStats> = (props) => {
  const { total, ...restProps } = props

  return (
    <Article>
      <header>
        <h3>능력치</h3>
        <strong>총 합: {total}</strong>
      </header>
      <AbilityChart {...restProps} />
    </Article>
  )
}

export default AbilityComponent
