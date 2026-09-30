'use client'

import {
  PokemonLearnInfo,
  PokemonSkillDetail,
  VersionGroup,
} from '~/graphql/typeGenerated'
import MovesDetailBottomBanner from '~/components/adSlot/MovesDetailBottomBanner.component'
import MovesDetailTopBanner from '~/components/adSlot/MovesDetailTopBanner.component'
import MoveDetailHero from '~/containers/moves/MoveDetailHero.container'
import MoveDetailVersionNav from '~/containers/moves/MoveDetailVersionNav.container'
import PokemonBySkillList from '~/containers/moves/PokemonBySkillList.container'

interface MoveDetailProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
  selectedVersionGroupId?: number
  versionGroups?: Array<VersionGroup> | null
}

const MoveDetail = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
  selectedVersionGroupId,
  versionGroups,
}: MoveDetailProps) => {
  return (
    <>
      <div className="w-full max-w-[1280px] mx-auto px-4 py-6">
        <MoveDetailHero
          skillData={initialSkill}
          selectedVersionGroupId={selectedVersionGroupId}
          learnablePokemonCount={totalCount}
          versionGroups={versionGroups}
        />
        <MovesDetailTopBanner />
      </div>

      <MoveDetailVersionNav
        skillId={skillId}
        versionGroups={versionGroups}
        selectedVersionGroupId={selectedVersionGroupId}
      />

      <div className="w-full max-w-[1280px] mx-auto px-4 py-6 pb-8">
        <PokemonBySkillList
          skillId={skillId}
          initialPokemonList={initialPokemonList}
          totalCount={totalCount}
          selectedVersionGroupId={selectedVersionGroupId}
        />
        <div className="mt-6">
          <MovesDetailBottomBanner />
        </div>
      </div>
    </>
  )
}

export default MoveDetail
