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

const tiers = ['S', 'A', 'B', 'C', 'D'] as const

const ChampionsTierContainer = ({
  tierGroups,
}: ChampionsTierContainerProps) => {
  const totalCount = Object.values(tierGroups).reduce(
    (acc, arr) => acc + arr.length,
    0,
  )

  const scrollToTier = (tier: string) => {
    const element = document.getElementById(`tier-${tier}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <header className="mb-6 p-6 bg-primary-4 rounded-xl">
        <h1 className="text-2xl font-bold text-primary-1">
          포켓몬 챔피언스 티어 리스트
        </h1>
        <p className="text-sm text-primary-2 mt-1">
          사용률 기반 · 총 {totalCount}종 포켓몬 포함
        </p>

        <div className="flex gap-2 mt-4">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => scrollToTier(tier)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-primary-3/30 transition-colors"
            >
              <span className="font-bold text-primary-1">{tier}</span>
              <span className="text-sm text-primary-2">
                {tierGroups[tier].length}종
              </span>
            </button>
          ))}
        </div>
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
