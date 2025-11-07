import { Ability } from '~/graphql/typeGenerated'
import AbilityListContainer from '~/container/desktop/ability/AbilityList.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

interface AbilityListDesktopProps {
  initialAbilities: Array<Ability>
}

const AbilityListDesktop = ({ initialAbilities }: AbilityListDesktopProps) => {
  return (
    <main className="w-full h-full pt-40">
      <HeaderContainer />
      <AbilityListContainer initialAbilities={initialAbilities} />
    </main>
  )
}

export default AbilityListDesktop
