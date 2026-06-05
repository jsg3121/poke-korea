'use client'

import MobileTabBar from '~/components/MobileTabBar'
import ChampionsTierContainer from '~/container/mobile/champions/ChampionsTier.container'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
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

interface ChampionsTierMobileProps {
  tierGroups: TierGroups
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
  latestUpdatedAt?: string
}

const ChampionsTierMobile = ({
  tierGroups,
  teamCores,
  formatSlug,
  latestUpdatedAt,
}: ChampionsTierMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <ChampionsTierContainer
        tierGroups={tierGroups}
        teamCores={teamCores}
        formatSlug={formatSlug}
        latestUpdatedAt={latestUpdatedAt}
      />
      <FooterContainer />
      <MobileTabBar />
    </>
  )
}

export default ChampionsTierMobile
