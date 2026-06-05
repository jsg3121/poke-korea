import MobileChampionsTierBanner from '~/components/adSlot/MobileChampionsTierBanner'
import ChampionsFormatTab from '~/components/champions/ChampionsFormatTab.component'
import ChampionsScrollToTop from '~/components/champions/ChampionsScrollToTop.component'
import ChampionsTierGroup from '~/components/champions/ChampionsTierGroup.component'
import ChampionsTierTeamCoreSection from '~/components/champions/ChampionsTierTeamCoreSection.component'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  formatKstDate,
  getFormatShortLabel,
} from '~/utils/championsFormat.util'

interface TierGroups {
  S: ChampionsMetaSummaryFragment[]
  A: ChampionsMetaSummaryFragment[]
  B: ChampionsMetaSummaryFragment[]
  C: ChampionsMetaSummaryFragment[]
  D: ChampionsMetaSummaryFragment[]
}

interface ChampionsTierContainerProps {
  tierGroups: TierGroups
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
  latestUpdatedAt?: string
}

const ChampionsTierContainer = ({
  tierGroups,
  teamCores,
  formatSlug,
  latestUpdatedAt,
}: ChampionsTierContainerProps) => {
  const totalCount = Object.values(tierGroups).reduce(
    (acc, arr) => acc + arr.length,
    0,
  )
  const formatShort = getFormatShortLabel(formatSlug)
  const updatedAtLabel = formatKstDate(latestUpdatedAt)

  return (
    <section className="w-full px-4 mt-6 pb-8">
      <header className="mb-4 p-4 bg-primary-4 rounded-xl">
        <h1 className="text-lg font-bold text-primary-1">
          포켓몬 챔피언스 {formatShort} 티어 리스트
        </h1>
        <ChampionsFormatTab
          currentFormat={formatSlug}
          basePath="/champions"
          suffix="/tier"
        />
        <p className="text-xs text-primary-2 mt-1">
          사용률 기반 · 총 {totalCount}종 포켓몬 포함
          {updatedAtLabel && ` · ${updatedAtLabel} 갱신`}
        </p>
        <p className="text-[10px] text-primary-2 mt-2">
          본 티어는 공식 기준이 아닌 사용률 데이터를 기반으로 자체 분류한 참고용
          자료입니다. 출처: Pikalytics
        </p>
      </header>
      <MobileChampionsTierBanner />

      <ChampionsTierTeamCoreSection
        teamCores={teamCores}
        formatSlug={formatSlug}
      />

      <div className="space-y-6">
        <ChampionsTierGroup tier="S" pokemons={tierGroups.S} />
        <ChampionsTierGroup tier="A" pokemons={tierGroups.A} />
        <ChampionsTierGroup tier="B" pokemons={tierGroups.B} />
        <ChampionsTierGroup tier="C" pokemons={tierGroups.C} defaultCollapsed />
        <ChampionsTierGroup tier="D" pokemons={tierGroups.D} defaultCollapsed />
      </div>

      <ChampionsScrollToTop />
    </section>
  )
}

export default ChampionsTierContainer
