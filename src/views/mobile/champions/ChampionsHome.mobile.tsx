'use client'

import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainer from '~/container/mobile/header/Header.container'
import ChampionsHomeContainer from '~/container/mobile/champions/ChampionsHome.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsHomeMobileProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeMobile = ({
  topPokemons,
  formatSlug,
}: ChampionsHomeMobileProps) => {
  return (
    <main>
      <HeaderContainer />
      <ChampionsHomeContainer
        topPokemons={topPokemons}
        formatSlug={formatSlug}
      />
      <MobileTabBar />
    </main>
  )
}

export default ChampionsHomeMobile
