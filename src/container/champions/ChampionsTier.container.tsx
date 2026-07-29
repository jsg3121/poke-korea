import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner'
import ChampionsFormatIntro from '~/components/champions/ChampionsFormatIntro.component'
import ChampionsScrollToTop from '~/components/champions/ChampionsScrollToTop.component'
import ChampionsTierGroup from '~/components/champions/ChampionsTierGroup.component'
import ChampionsTierTeamCoreSection from '~/components/champions/ChampionsTierTeamCoreSection.component'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
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
 * 모바일 퍼스트: base=모바일, `desktop:`로 확장. 광고 슬롯은 제거(A~D 선례).
 * 제목 헤더는 공통 DS PageHeaderComponent를 쓰고(홈·도감과 통일, 사용자 결정
 * 2026-07-22), h1은 짧게("챔피언스 VGC 티어"). 포맷 탭은 ChampionsFormatIntro,
 * 페이지 고유 캡션(채택 순위 기반·총 N종·출처)은 그 아래에 유지한다.
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
    <section className="w-full max-w-[1280px] mx-auto px-4 pb-8 desktop:mt-12 desktop:px-5">
      <PageHeaderComponent
        title={`챔피언스 ${formatShort} 티어`}
        description={`${formatShort} 채택 순위 기반 티어 분류`}
      />

      <ChampionsFormatIntro
        formatSlug={formatSlug}
        suffix="/tier"
        className="mb-6 desktop:mb-8"
      />

      {/* 페이지 고유 캡션 (채택 순위 기반·총 N종·출처) — 공통 헤더가 담지 않는다 */}
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

      {/* 광고 — S 티어 바로 위(인기 조합 뒤). 진입 시 조기 노출 목적
          (사용자 결정). space-y 리스트 밖에 둬 티어 그룹 간격 규칙과 분리 */}
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

export default ChampionsTierContainer
