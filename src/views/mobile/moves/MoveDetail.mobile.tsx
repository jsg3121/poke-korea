import {
  PokemonLearnInfo,
  PokemonSkillDetail,
  VersionGroup,
} from '~/graphql/typeGenerated'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MobileTabBar from '~/components/MobileTabBar'
import MoveDetailContainer from '~/container/mobile/moves/moves.detail/MoveDetail.container'

interface MoveDetailMobileProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
  selectedVersionGroupId?: number
  versionGroups?: Array<VersionGroup> | null
}

const MoveDetailMobile = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
  selectedVersionGroupId,
  versionGroups,
}: MoveDetailMobileProps) => {
  return (
    <main className="w-full mx-auto min-h-screen">
      <HeaderContainer />
      <MoveDetailContainer
        skillId={skillId}
        initialSkill={initialSkill}
        initialPokemonList={initialPokemonList}
        totalCount={totalCount}
        selectedVersionGroupId={selectedVersionGroupId}
        versionGroups={versionGroups}
      />
      <MobileTabBar />
    </main>
  )
}

export default MoveDetailMobile
