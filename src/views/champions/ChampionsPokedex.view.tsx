'use client'

import {
  ChampionsPokemonCardFragment,
  ChampionsPokemonFilterInput,
  ChampionsPokemonSort,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import { ChampionsPokedexProvider } from '~/context/ChampionsPokedex.context'
import ChampionsPokedexContent from '~/containers/champions/ChampionsPokedexContent.container'

interface ChampionsPokedexProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
  formatSlug: ChampionsFormatSlug
  sort: ChampionsPokemonSort
}

const ChampionsPokedex = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
  initialFilter,
  formatSlug,
  sort,
}: ChampionsPokedexProps) => {
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
      <ChampionsPokedexContent formatSlug={formatSlug} sort={sort} />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedex
