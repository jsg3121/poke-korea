'use client'

import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ChampionsTypeFilter from '~/components/champions/filter/ChampionsTypeFilter.component'
import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsPokedexContainer from '~/container/desktop/champions/ChampionsPokedex.container'
import { ChampionsPokedexProvider } from '~/context/ChampionsPokedex.context'
import {
  ChampionsPokemonCardFragment,
  ChampionsPokemonFilterInput,
} from '~/graphql/typeGenerated'

interface ChampionsPokedexDesktopProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
}

const ChampionsPokedexDesktop = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
  initialFilter,
}: ChampionsPokedexDesktopProps) => {
  return (
    <ChampionsPokedexProvider
      initialList={pokemonList}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
      totalCount={totalCount}
      initialFilter={initialFilter}
    >
      <div className="h-40">
        <HeaderContainer />
      </div>
      <section className="w-full h-[4.8rem] bg-primary-1 shadow-[0_3px_3px_-2px_var(--color-black-1)] mt-12 sticky top-52 z-20">
        <ChampionsTypeFilter />
      </section>
      <DesktopListTopBanner />
      <ChampionsPokedexContainer />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedexDesktop
