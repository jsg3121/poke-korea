'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsTierContainer from '~/container/desktop/champions/ChampionsTier.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
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

interface ChampionsTierDesktopProps {
  tierGroups: TierGroups
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
  latestUpdatedAt?: string
}

const ChampionsTierDesktop = ({
  tierGroups,
  teamCores,
  formatSlug,
  latestUpdatedAt,
}: ChampionsTierDesktopProps) => {
  return (
    <>
      <div className="h-32">
        <HeaderContainer />
      </div>
      <ChampionsTierContainer
        tierGroups={tierGroups}
        teamCores={teamCores}
        formatSlug={formatSlug}
        latestUpdatedAt={latestUpdatedAt}
      />
      <FooterContainer />
    </>
  )
}

export default ChampionsTierDesktop
