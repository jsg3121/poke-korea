import styled from 'styled-components'
import { PokemonStats } from '~/graphql/typeGenerated'
import StatChartComponent from './components/StatChart.component'

const Article = styled.article`
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-4);
  border: 3px solid var(--color-primary-1);
  border-radius: 1rem;
  box-shadow: 0 0 0px 3px var(--color-primary-4);
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

  & > .stat-chart {
    width: 25rem;
    height: 25rem;
    margin: 1rem auto 0;
  }
`

const StatsComponent = ({ total, ...restProps }: PokemonStats) => {
  return (
    <Article aria-label="포켓몬 능력치 정보">
      <header>
        <h2>능력치</h2>
        <strong>총 합: {total}</strong>
      </header>
      <div className="stat-chart">
        <StatChartComponent {...restProps} />
      </div>
    </Article>
  )
}

export default StatsComponent
