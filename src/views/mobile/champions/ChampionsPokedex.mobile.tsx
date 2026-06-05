'use client'

import MobileTabBar from '~/components/MobileTabBar'
import ChampionsPokedexContainer from '~/container/mobile/champions/ChampionsPokedex.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import { ChampionsPokedexProvider } from '~/context/ChampionsPokedex.context'
import {
  ChampionsPokemonCardFragment,
  ChampionsPokemonFilterInput,
  ChampionsPokemonSort,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'

interface ChampionsPokedexMobileProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
  formatSlug: ChampionsFormatSlug
  sort: ChampionsPokemonSort
}

const ChampionsPokedexMobile = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
  initialFilter,
  formatSlug,
  sort,
}: ChampionsPokedexMobileProps) => {
  return (
    <ChampionsPokedexProvider
      initialList={pokemonList}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
      totalCount={totalCount}
      initialFilter={initialFilter}
      format={resolveFormatEnum(formatSlug)}
      sort={sort}
    >
      <HeaderContainer />
      <ChampionsPokedexContainer formatSlug={formatSlug} sort={sort} />
      <MobileTabBar />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedexMobile
