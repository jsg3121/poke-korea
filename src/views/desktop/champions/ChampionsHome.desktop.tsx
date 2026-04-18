'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsHomeContainer from '~/container/desktop/champions/ChampionsHome.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeDesktopProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeDesktop = ({ topPokemons }: ChampionsHomeDesktopProps) => {
  return (
    <main className="w-full h-full pt-40">
      <HeaderContainer />
      <ChampionsHomeContainer topPokemons={topPokemons} />
    </main>
  )
}

export default ChampionsHomeDesktop
