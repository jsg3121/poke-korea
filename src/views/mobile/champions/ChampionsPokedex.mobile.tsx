'use client'

import FilterComponents from '~/components/filter/Filter.components'
import MobileTabBar from '~/components/MobileTabBar'
import ChampionsPokedexContainer from '~/container/mobile/champions/ChampionsPokedex.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import { ChampionsPokedexProvider } from '~/context/ChampionsPokedex.context'
import {
  ChampionsPokemonCardFragment,
  ChampionsPokemonFilterInput,
} from '~/graphql/typeGenerated'

interface ChampionsPokedexMobileProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
}

const ChampionsPokedexMobile = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
  initialFilter,
}: ChampionsPokedexMobileProps) => {
  return (
    <ChampionsPokedexProvider
      initialList={pokemonList}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
      totalCount={totalCount}
      initialFilter={initialFilter}
    >
      <HeaderContainer />
      <FilterComponents />
      <ChampionsPokedexContainer />
      <MobileTabBar />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedexMobile
