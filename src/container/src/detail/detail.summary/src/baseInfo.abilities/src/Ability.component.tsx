import React from 'react'
import styled from 'styled-components'
import { NormalStats } from '~/graphql/typeGenerated'
import { AbilityChart } from './components'

const Section = styled.section`
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  padding: 1rem;

  & > header {
    width: 100%;
    height: 4rem;
    border-bottom: 1px solid var(--color-primary-1);

    & > h2 {
      height: 2rem;
      font-size: 1.5rem;
      line-height: 2rem;
      color: var(--color-primary-1);
    }

    & > strong {
      height: 1.5rem;
      font-size: 1rem;
      line-height: 1.5rem;
      color: var(--color-primary-2);
    }
  }

  & > .ability-chart {
    width: 20rem;
    height: 20rem;
    margin: 1rem auto 0;
  }
`

const AbilityComponent: React.FC<NormalStats> = (props) => {
  const { total, ...restProps } = props

  return (
    <Section>
      <header>
        <h2>능력치</h2>
        <strong>총 합: {total}</strong>
      </header>
      <div className="ability-chart">
        <AbilityChart {...restProps} />
      </div>
    </Section>
  )
}

export default AbilityComponent
