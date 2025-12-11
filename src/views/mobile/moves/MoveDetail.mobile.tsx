import { PokemonLearnInfo, PokemonSkillDetail } from '~/graphql/typeGenerated'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MobileTabBar from '~/components/MobileTabBar'
import MoveDetailContainer from '~/container/desktop/moves/moves.detail/MoveDetail.container'

interface MoveDetailMobileProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
}

const MoveDetailMobile = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
}: MoveDetailMobileProps) => {
  return (
    <main className="w-full mx-auto min-h-screen">
      <HeaderContainer />
      <MoveDetailContainer
        skillId={skillId}
        initialSkill={initialSkill}
        initialPokemonList={initialPokemonList}
        totalCount={totalCount}
      />
      <MobileTabBar />
    </main>
  )
}

export default MoveDetailMobile
