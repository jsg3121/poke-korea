'use client'

import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ChampionsPokedexContainer from '~/container/desktop/champions/ChampionsPokedex.container'
import { ChampionsPokedexProvider } from '~/context/ChampionsPokedex.context'
import { ChampionsPokemonCardFragment } from '~/graphql/typeGenerated'

interface ChampionsPokedexDesktopProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
}

const ChampionsPokedexDesktop = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
}: ChampionsPokedexDesktopProps) => {
  return (
    <ChampionsPokedexProvider
      initialList={pokemonList}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
      totalCount={totalCount}
    >
      <div className="h-40" />
      <DesktopListTopBanner />
      <ChampionsPokedexContainer />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedexDesktop
