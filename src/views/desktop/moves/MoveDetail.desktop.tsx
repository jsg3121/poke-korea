import { PokemonLearnInfo, PokemonSkillDetail } from '~/graphql/typeGenerated'
import MoveDetailContainer from '~/container/desktop/moves/moves.detail/MoveDetail.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

interface MoveDetailDesktopProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
}

const MoveDetailDesktop = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
}: MoveDetailDesktopProps) => {
  return (
    <main className="w-full h-full pt-40">
      <HeaderContainer />
      <MoveDetailContainer
        skillId={skillId}
        initialSkill={initialSkill}
        initialPokemonList={initialPokemonList}
        totalCount={totalCount}
      />
    </main>
  )
}

export default MoveDetailDesktop
