'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsPokedexContainer from '~/container/desktop/champions/ChampionsPokedex.container'
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

interface ChampionsPokedexDesktopProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
  formatSlug: ChampionsFormatSlug
  sort: ChampionsPokemonSort
}

const ChampionsPokedexDesktop = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
  initialFilter,
  formatSlug,
  sort,
}: ChampionsPokedexDesktopProps) => {
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
      <div className="h-32">
        <HeaderContainer />
      </div>
      <ChampionsPokedexContainer formatSlug={formatSlug} sort={sort} />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedexDesktop
