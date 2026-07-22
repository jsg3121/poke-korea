'use client'

import ChampionsHomeContainer from '~/container/champions/ChampionsHome.container'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
  GetChampionsTournamentsWithTopTeamQuery,
} from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsHomeViewProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  recentTournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  formatSlug: ChampionsFormatSlug
}

/**
 * 챔피언스 홈 뷰 (반응형 단일, ADR-0007).
 *
 * 구버전 desktop/mobile 2벌 뷰(ChampionsHome.desktop/mobile)를 통합한다(UX-E1).
 * 전역 크롬(헤더/푸터/탭바)은 page.tsx가 UA로 선택하고, 본문만 이 뷰가 담당한다
 * (티어·도감 개편과 동일 패턴).
 */
const ChampionsHomeView = ({
  topPokemons,
  teamCores,
  recentTournaments,
  formatSlug,
}: ChampionsHomeViewProps) => {
  return (
    <ChampionsHomeContainer
      topPokemons={topPokemons}
      teamCores={teamCores}
      recentTournaments={recentTournaments}
      formatSlug={formatSlug}
    />
  )
}

export default ChampionsHomeView
