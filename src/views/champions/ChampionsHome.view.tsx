'use client'

import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
  GetChampionsTournamentsWithTopTeamQuery,
} from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ChampionsHomeContent from '~/containers/champions/ChampionsHomeContent.container'

interface ChampionsHomeProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  teamCores: ChampionsTeamCoreFragment[]
  recentTournaments: GetChampionsTournamentsWithTopTeamQuery['championsTournaments']
  formatSlug: ChampionsFormatSlug
}

const ChampionsHome = ({
  topPokemons,
  teamCores,
  recentTournaments,
  formatSlug,
}: ChampionsHomeProps) => {
  return (
    <ChampionsHomeContent
      topPokemons={topPokemons}
      teamCores={teamCores}
      recentTournaments={recentTournaments}
      formatSlug={formatSlug}
    />
  )
}

export default ChampionsHome
