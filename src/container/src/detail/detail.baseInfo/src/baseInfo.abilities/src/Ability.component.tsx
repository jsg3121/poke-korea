import React from 'react'
import styled from 'styled-components'
import { NormalStats } from '~/graphql/typeGenerated'
import { AbilityChart } from './components'

const Article = styled.article`
  width: 40rem;
  height: 40rem;
  padding: 2rem;
  margin: 0 auto;
`

const AbilityComponent: React.FC<NormalStats> = (props) => {
  const { total, ...restProps } = props

  return (
    <Article>
      <header>
        <h2>능력치</h2>
        <strong>총 합: {total}</strong>
      </header>
      <AbilityChart {...restProps} />
    </Article>
  )
}

export default AbilityComponent
