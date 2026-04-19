'use client'

import ChampionsSubNavMobile from '~/components/champions/ChampionsSubNavMobile.component'
import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainer from '~/container/mobile/header/Header.container'
import ChampionsHomeContainer from '~/container/mobile/champions/ChampionsHome.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeMobileProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeMobile = ({ topPokemons }: ChampionsHomeMobileProps) => {
  return (
    <main className="w-full h-full">
      <HeaderContainer />
      <ChampionsSubNavMobile />
      <ChampionsHomeContainer topPokemons={topPokemons} />
      <MobileTabBar />
    </main>
  )
}

export default ChampionsHomeMobile
