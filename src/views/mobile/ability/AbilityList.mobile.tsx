'use client'

import { Ability } from '~/graphql/typeGenerated'
import AbilityListContainer from '~/container/mobile/ability/AbilityList.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MobileTabBar from '~/components/MobileTabBar'

interface AbilityListMobileProps {
  initialAbilities: Array<Ability>
}

const AbilityListMobile = ({ initialAbilities }: AbilityListMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <AbilityListContainer initialAbilities={initialAbilities} />
      <MobileTabBar />
    </>
  )
}

export default AbilityListMobile
