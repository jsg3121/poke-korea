import { PokemonLearnInfo, PokemonSkillDetail } from '~/graphql/typeGenerated'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MobileTabBar from '~/components/MobileTabBar'
import MoveDetailContainer from '~/container/mobile/moves/moves.detail/MoveDetail.container'

interface MoveDetailMobileProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
  selectedVersionGroupId?: number
}

const MoveDetailMobile = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
  selectedVersionGroupId,
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
      />
      <MobileTabBar />
    </main>
  )
}

export default MoveDetailMobile
