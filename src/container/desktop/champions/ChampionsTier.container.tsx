import ChampionsTierGroup from '~/components/champions/ChampionsTierGroup.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface TierGroups {
  S: ChampionsMetaSummaryFragment[]
  A: ChampionsMetaSummaryFragment[]
  B: ChampionsMetaSummaryFragment[]
  C: ChampionsMetaSummaryFragment[]
  D: ChampionsMetaSummaryFragment[]
}

interface ChampionsTierContainerProps {
  tierGroups: TierGroups
}

const ChampionsTierContainer = ({
  tierGroups,
}: ChampionsTierContainerProps) => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-primary-1">
          포켓몬 챔피언스 티어 리스트
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          사용률 기반 티어 (S: 30%+, A: 15%+, B: 5%+, C: 1%+, D: 1%-)
        </p>
      </header>

      <div className="space-y-8">
        <ChampionsTierGroup tier="S" pokemons={tierGroups.S} />
        <ChampionsTierGroup tier="A" pokemons={tierGroups.A} />
        <ChampionsTierGroup tier="B" pokemons={tierGroups.B} />
        <ChampionsTierGroup tier="C" pokemons={tierGroups.C} />
        <ChampionsTierGroup tier="D" pokemons={tierGroups.D} />
      </div>
    </>
  )
}

export default ChampionsTierContainer
