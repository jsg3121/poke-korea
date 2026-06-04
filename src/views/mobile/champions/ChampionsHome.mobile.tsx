'use client'

import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainer from '~/container/mobile/header/Header.container'
import ChampionsHomeContainer from '~/container/mobile/champions/ChampionsHome.container'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsHomeMobileProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeMobile = ({
  topPokemons,
  teamCores,
  formatSlug,
}: ChampionsHomeMobileProps) => {
  return (
    <main>
      <HeaderContainer />
      <ChampionsHomeContainer
        topPokemons={topPokemons}
        teamCores={teamCores}
        formatSlug={formatSlug}
      />
      <MobileTabBar />
    </main>
  )
}

export default ChampionsHomeMobile
