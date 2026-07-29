'use client'

import ChampionsTierContainer from '~/container/champions/ChampionsTier.container'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface TierGroups {
  S: ChampionsMetaSummaryFragment[]
  A: ChampionsMetaSummaryFragment[]
  B: ChampionsMetaSummaryFragment[]
  C: ChampionsMetaSummaryFragment[]
  D: ChampionsMetaSummaryFragment[]
}

interface ChampionsTierViewProps {
  tierGroups: TierGroups
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
  latestUpdatedAt?: string
}

/**
 * 챔피언스 티어 리스트 뷰 (반응형 단일, ADR-0007).
 *
 * 구버전 desktop/mobile 2벌 뷰(ChampionsTier.desktop/mobile)를 통합한다(UX-E1).
 * 전역 크롬(헤더/푸터/탭바)은 page.tsx가 UA로 선택하고, 본문만 이 뷰가 담당한다
 * (ability·list 개편과 동일 패턴).
 */
const ChampionsTierView = ({
  tierGroups,
  teamCores,
  formatSlug,
  latestUpdatedAt,
}: ChampionsTierViewProps) => {
  return (
    <ChampionsTierContainer
      tierGroups={tierGroups}
      teamCores={teamCores}
      formatSlug={formatSlug}
      latestUpdatedAt={latestUpdatedAt}
    />
  )
}

export default ChampionsTierView
