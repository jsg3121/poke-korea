'use client'

import { Ability } from '~/graphql/typeGenerated'
import AbilityListContainer from '~/container/desktop/ability/AbilityList.container'
import HeaderContainer from '~/container/desktop/header/Header.container'

interface AbilityListDesktopProps {
  initialAbilities: Array<Ability>
}

const AbilityListDesktop = ({
  initialAbilities,
}: AbilityListDesktopProps) => {
  return (
    <>
      <div className="h-56">
        <HeaderContainer />
      </div>
      <AbilityListContainer initialAbilities={initialAbilities} />
    </>
  )
}

export default AbilityListDesktop
