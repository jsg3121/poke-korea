'use client'

import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainer from '~/container/mobile/header/Header.container'
import ChampionsPokedexContainer from '~/container/mobile/champions/ChampionsPokedex.container'
import { ChampionsPokedexProvider } from '~/context/ChampionsPokedex.context'
import { ChampionsPokemonCardFragment } from '~/graphql/typeGenerated'

interface ChampionsPokedexMobileProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
}

const ChampionsPokedexMobile = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
}: ChampionsPokedexMobileProps) => {
  return (
    <ChampionsPokedexProvider
      initialList={pokemonList}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
      totalCount={totalCount}
    >
      <HeaderContainer />
      <MobileListTopBanner />
      <ChampionsPokedexContainer />
      <MobileTabBar />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedexMobile
