'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsHomeContainer from '~/container/desktop/champions/ChampionsHome.container'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsHomeDesktopProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeDesktop = ({
  topPokemons,
  teamCores,
  formatSlug,
}: ChampionsHomeDesktopProps) => {
  return (
    <main className="w-full h-full pt-52">
      <HeaderContainer />
      <ChampionsHomeContainer
        topPokemons={topPokemons}
        teamCores={teamCores}
        formatSlug={formatSlug}
      />
    </main>
  )
}

export default ChampionsHomeDesktop
