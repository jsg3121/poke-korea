import { CHAMPIONS_SLOTS } from '~/constants/adSense'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  formatKstDate,
  getFormatShortLabel,
} from '~/utils/championsFormat.util'
import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner.component'
import ChampionsFormatIntro from '~/components/champions/ChampionsFormatIntro.component'
import ChampionsScrollToTop from '~/components/champions/ChampionsScrollToTop.component'
import ChampionsTierGroup from '~/components/champions/ChampionsTierGroup.component'
import ChampionsTierTeamCoreSection from '~/components/champions/ChampionsTierTeamCoreSection.component'
import PageHeader from '~/components/pageHeader/PageHeader.component'

interface TierGroups {
  S: ChampionsMetaSummaryFragment[]
  A: ChampionsMetaSummaryFragment[]
  B: ChampionsMetaSummaryFragment[]
  C: ChampionsMetaSummaryFragment[]
  D: ChampionsMetaSummaryFragment[]
}

interface ChampionsTierContentProps {
  tierGroups: TierGroups
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
  latestUpdatedAt?: string
}

const ChampionsTierContent = ({
  tierGroups,
  teamCores,
  formatSlug,
  latestUpdatedAt,
}: ChampionsTierContentProps) => {
  const totalCount = Object.values(tierGroups).reduce(
    (acc, arr) => acc + arr.length,
    0,
  )
  const formatShort = getFormatShortLabel(formatSlug)
  const updatedAtLabel = formatKstDate(latestUpdatedAt)

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8 desktop:mt-12 desktop:px-5">
      <PageHeader
        title={`챔피언스 ${formatShort} 티어`}
        description={`${formatShort} 채택 순위 기반 티어 분류`}
      />

      <ChampionsFormatIntro
        formatSlug={formatSlug}
        suffix="/tier"
        className="mb-6 desktop:mb-8"
      />

      <div className="mb-6 desktop:mb-8">
        <p className="text-xs text-primary-3 desktop:text-sm">
          채택 순위 기반 · 총 {totalCount}종 포켓몬 포함
          {updatedAtLabel && ` · ${updatedAtLabel} 갱신`}
        </p>
        <p className="text-2xs text-primary-3 mt-2 desktop:text-xs">
          본 티어는 공식 기준이 아닌 실전 랭크전 채택 데이터를 기반으로 자체
          분류한 참고용 자료입니다. 출처: championsbattledata.com
        </p>
      </div>

      <ChampionsTierTeamCoreSection
        teamCores={teamCores}
        formatSlug={formatSlug}
      />

      <div className="mb-6 desktop:mb-8">
        <ChampionsInContentBanner
          mobileSlot={CHAMPIONS_SLOTS.tierMobile}
          desktopSlot={CHAMPIONS_SLOTS.tierDesktop}
        />
      </div>

      <div className="space-y-6 desktop:space-y-8">
        <ChampionsTierGroup
          tier="S"
          pokemons={tierGroups.S}
          formatSlug={formatSlug}
        />
        <ChampionsTierGroup
          tier="A"
          pokemons={tierGroups.A}
          formatSlug={formatSlug}
        />
        <ChampionsTierGroup
          tier="B"
          pokemons={tierGroups.B}
          formatSlug={formatSlug}
        />
        <ChampionsTierGroup
          tier="C"
          pokemons={tierGroups.C}
          formatSlug={formatSlug}
          defaultCollapsed
        />
        <ChampionsTierGroup
          tier="D"
          pokemons={tierGroups.D}
          formatSlug={formatSlug}
          defaultCollapsed
        />
      </div>

      <ChampionsScrollToTop />
    </section>
  )
}

export default ChampionsTierContent
