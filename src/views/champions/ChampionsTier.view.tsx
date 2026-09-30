'use client'

import {
  ChampionsMetaSummaryFragment,
  ChampionsTeamCoreFragment,
} from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ChampionsTierContent from '~/containers/champions/ChampionsTierContent.container'

interface TierGroups {
  S: ChampionsMetaSummaryFragment[]
  A: ChampionsMetaSummaryFragment[]
  B: ChampionsMetaSummaryFragment[]
  C: ChampionsMetaSummaryFragment[]
  D: ChampionsMetaSummaryFragment[]
}

interface ChampionsTierProps {
  tierGroups: TierGroups
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
  latestUpdatedAt?: string
}

const ChampionsTier = ({
  tierGroups,
  teamCores,
  formatSlug,
  latestUpdatedAt,
}: ChampionsTierProps) => {
  return (
    <ChampionsTierContent
      tierGroups={tierGroups}
      teamCores={teamCores}
      formatSlug={formatSlug}
      latestUpdatedAt={latestUpdatedAt}
    />
  )
}

export default ChampionsTier
