'use client'

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
      <div className="h-32">
        <HeaderContainer />
      </div>
      <section className="w-full h-12 bg-primary-1 shadow-[0_3px_3px_-2px_var(--color-black-1)] sticky top-40 z-20">
        <ChampionsTypeFilter />
      </section>
      <ChampionsPokedexContainer />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedexDesktop
