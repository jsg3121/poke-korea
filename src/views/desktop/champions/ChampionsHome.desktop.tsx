'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsHomeContainer from '~/container/desktop/champions/ChampionsHome.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsHomeDesktopProps {
  topPokemons: ChampionsMetaSummaryFragment[]
  formatSlug: ChampionsFormatSlug
}

const ChampionsHomeDesktop = ({
  topPokemons,
  formatSlug,
}: ChampionsHomeDesktopProps) => {
  return (
    <main className="w-full h-full pt-52">
      <HeaderContainer />
      <ChampionsHomeContainer
        topPokemons={topPokemons}
        formatSlug={formatSlug}
      />
    </main>
  )
}

export default ChampionsHomeDesktop
