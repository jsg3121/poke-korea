'use client'

import { PokemonFilterInput, PokemonList } from '~/graphql/typeGenerated'
import { ListProvider } from '~/context/List.context'
import ListTopBanner from '~/components/adSlot/ListTopBanner.component'
import FilterBar from '~/components/filter/FilterBar.component'
import ListGrid from '~/containers/list/ListGrid.container'

interface ListProps {
  pokemonList: Array<PokemonList>
  initialFilter: PokemonFilterInput
  hasNextPage: boolean
}

const List = ({ pokemonList, initialFilter, hasNextPage }: ListProps) => {
  return (
    <ListProvider
      initialList={pokemonList}
      initialFilter={initialFilter}
      hasNextPage={hasNextPage}
    >
      <h1 className="sr-only">포켓몬 도감</h1>

      <div className="sticky top-12 z-30 bg-primary-1 desktop:top-30 pt-4 mb-4">
        <FilterBar />
      </div>

      <ListTopBanner />

      <ListGrid />
    </ListProvider>
  )
}

export default List
