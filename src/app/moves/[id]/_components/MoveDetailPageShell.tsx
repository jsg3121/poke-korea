import { Fragment } from 'react'
import { NormalizedCacheObject } from '@apollo/client'

import {
  PokemonLearnInfo,
  PokemonSkillDetail,
  VersionGroup,
} from '~/graphql/typeGenerated'
import MoveDetail from '~/views/moves/MoveDetail.view'
import Providers from '~/app/providers'

interface MoveDetailPageShellProps {
  initialApolloState: NormalizedCacheObject | null
  skillId: number
  skill: PokemonSkillDetail
  pokemonList: Array<PokemonLearnInfo>
  totalCount: number
  versionGroups?: Array<VersionGroup> | null
  selectedVersionGroupId?: number
  jsonLd: object
  jsonLdId: string
}

const MoveDetailPageShell = ({
  initialApolloState,
  skillId,
  skill,
  pokemonList,
  totalCount,
  versionGroups,
  selectedVersionGroupId,
  jsonLd,
  jsonLdId,
}: MoveDetailPageShellProps) => {
  const view = (
    <MoveDetail
      skillId={skillId}
      initialSkill={skill}
      initialPokemonList={pokemonList}
      totalCount={totalCount}
      versionGroups={versionGroups}
      selectedVersionGroupId={selectedVersionGroupId}
    />
  )

  return (
    <Fragment>
      <Providers initialApolloState={initialApolloState}>{view}</Providers>
      <script
        id={jsonLdId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </Fragment>
  )
}

export default MoveDetailPageShell
