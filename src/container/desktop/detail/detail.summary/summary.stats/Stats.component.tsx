import StatChartComponent from '~/components/chart/StatChart.component'
import { PokemonStats } from '~/graphql/typeGenerated'

const StatsComponent = ({ total, ...restProps }: PokemonStats) => {
  return (
    <article className="card-detail" aria-label="포켓몬 능력치 정보">
      <header className="w-full h-16 border-b border-solid border-primary-1">
        <h2 className="h-8 text-2xl leading-8 text-primary-1">능력치</h2>
        <strong className="h-6 text-base leading-6 text-primary-2">
          총 합: {total}
        </strong>
      </header>
      <div className="w-[25rem] h-[25rem] mt-4 mx-auto">
        <StatChartComponent stats={restProps} size="lg" />
      </div>
    </article>
  )
}

export default StatsComponent
