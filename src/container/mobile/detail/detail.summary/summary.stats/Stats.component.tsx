import React from 'react'
import styled from 'styled-components'
import { PokemonStats } from '~/graphql/typeGenerated'
import StatChartComponent from './components/StatChart.component'

const Section = styled.section`
  width: calc(100% - 40px);
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  outline: 3px solid var(--color-primary-4);
  padding: 1rem;
  margin: 0 auto;

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

  & > .stat-chart {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    margin: 1rem auto 0;
  }
`

const StatsComponent: React.FC<PokemonStats> = (props) => {
  const { total, ...restProps } = props

  return (
    <Section>
      <header>
        <h2>능력치</h2>
        <strong>총 합: {total}</strong>
      </header>
      <div className="stat-chart">
        <StatChartComponent {...restProps} />
      </div>
    </Section>
  )
}

export default StatsComponent
