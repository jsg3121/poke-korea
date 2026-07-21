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

/**
 * 챔피언스 티어 리스트 본문 (반응형 단일, ADR-0007).
 *
 * 구버전 desktop/mobile 2벌 컨테이너를 CSS 반응형 단일로 통합한다(UX-E1).
 * 모바일 퍼스트: base=모바일, `desktop:`로 확장. 광고 슬롯은 제거(A~D 선례,
 * 반응형 광고 유닛 재도입은 별도 트랙). 헤더는 진한 배경 카드형을 유지하되
 * DS 무드(중앙 정렬 지양·타이포 위계)를 반영한다.
 */
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
    <section className="w-full max-w-[1280px] mx-auto px-4 mt-6 pb-8 desktop:mt-12 desktop:px-5">
      <header className="mb-6 p-4 bg-primary-4 rounded-xl desktop:mb-8 desktop:p-6">
        <h1 className="text-lg font-bold leading-tight text-primary-1 desktop:text-2xl">
          포켓몬 챔피언스 {formatShort} 티어 리스트
        </h1>
        <ChampionsFormatTab
          currentFormat={formatSlug}
          basePath="/champions"
          suffix="/tier"
          className="mt-3 mb-3"
        />
        <p className="text-xs text-primary-2 mt-1 desktop:text-sm">
          사용률 기반 · 총 {totalCount}종 포켓몬 포함
          {updatedAtLabel && ` · ${updatedAtLabel} 갱신`}
        </p>
        <p className="text-2xs text-primary-2 mt-2 desktop:text-xs">
          본 티어는 공식 기준이 아닌 사용률 데이터를 기반으로 자체 분류한 참고용
          자료입니다. 출처: Pikalytics
        </p>
      </header>

      <ChampionsTierTeamCoreSection
        teamCores={teamCores}
        formatSlug={formatSlug}
      />

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

export default ChampionsTierContainer
