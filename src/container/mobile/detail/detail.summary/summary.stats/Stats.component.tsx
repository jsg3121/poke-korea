import { PokemonStats } from '~/graphql/typeGenerated'
import StatChartComponent from './components/StatChart.component'

const StatsComponent = ({ total, ...restProps }: PokemonStats) => {
  return (
    <article
      className="w-[calc(100%-40px)] h-full bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 mx-auto"
      aria-label="포켓몬 능력치 정보"
    >
      <header className="w-full h-16 border-b border-solid border-primary-1">
        <h2 className="h-8 text-2xl leading-8 text-primary-1">능력치</h2>
        <strong className="h-6 text-base leading-6 text-primary-2">
          총 합: {total}
        </strong>
      </header>
      <div className="w-full h-full aspect-square mt-4 mx-auto">
        <StatChartComponent {...restProps} />
      </div>
    </article>
  )
}

export default StatsComponent
