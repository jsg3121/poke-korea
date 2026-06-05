'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsHomeContainer from '~/container/desktop/champions/ChampionsHome.container'
import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
  GetChampionsTournamentsWithTopTeamQuery,
} from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsHomeDesktopProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  recentTournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeDesktop = ({
  topPokemons,
  teamCores,
  recentTournaments,
  formatSlug,
}: ChampionsHomeDesktopProps) => {
  return (
    <main className="w-full h-full pt-52">
      <HeaderContainer />
      <ChampionsHomeContainer
        topPokemons={topPokemons}
        teamCores={teamCores}
        recentTournaments={recentTournaments}
        formatSlug={formatSlug}
      />
    </main>
  )
}

export default ChampionsHomeDesktop
