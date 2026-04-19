import ChampionsScrollToTop from '~/components/champions/ChampionsScrollToTop.component'
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
      <header className="mb-4 p-4 bg-primary-4 rounded-xl">
        <h1 className="text-lg font-bold text-primary-1">
          포켓몬 챔피언스 티어 리스트
        </h1>
        <p className="text-xs text-primary-2 mt-1">
          사용률 기반 · 총 {totalCount}종 포켓몬 포함
        </p>
        <p className="text-[10px] text-primary-3 mt-2">
          본 티어는 공식 기준이 아닌 사용률 데이터를 기반으로 자체 분류한 참고용 자료입니다.
        </p>

        <div className="flex gap-1 mt-3 overflow-x-auto">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => scrollToTier(tier)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg hover:bg-primary-3/30 transition-colors flex-shrink-0"
            >
              <span className="font-bold text-sm text-primary-1">{tier}</span>
              <span className="text-xs text-primary-2">
                {tierGroups[tier].length}
              </span>
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        <ChampionsTierGroup tier="S" pokemons={tierGroups.S} />
        <ChampionsTierGroup tier="A" pokemons={tierGroups.A} />
        <ChampionsTierGroup tier="B" pokemons={tierGroups.B} />
        <ChampionsTierGroup tier="C" pokemons={tierGroups.C} />
        <ChampionsTierGroup tier="D" pokemons={tierGroups.D} />
      </div>

      <ChampionsScrollToTop />
    </>
  )
}

export default ChampionsTierContainer
