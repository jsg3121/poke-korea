'use client'

import { Ability } from '~/graphql/typeGenerated'
import AbilityListContainer from '~/container/mobile/ability/AbilityList.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MobileTabBar from '~/components/MobileTabBar'

interface AbilityListMobileProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityListMobile = ({
  initialAbilities,
  totalCount,
}: AbilityListMobileProps) => {
  return (
    <>
      <HeaderContainer />
      <AbilityListContainer
        initialAbilities={initialAbilities}
        totalCount={totalCount}
      />
      <MobileTabBar />
    </>
  )
}

export default AbilityListMobile
