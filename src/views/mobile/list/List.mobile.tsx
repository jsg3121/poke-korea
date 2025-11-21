'use client'

import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import ListContainer from '~/container/mobile/list/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList, PokemonFilterInput } from '~/graphql/typeGenerated'
import HeaderContainer from './header/Header.container'
import { useRouteChangeCache } from '~/hook/useRouteChangeCache'
import MobileTabBar from '~/components/MobileTabBar'

interface ListViewProps {
  pokemonList: Array<PokemonList>
  initialFilter: PokemonFilterInput
  hasNextPage: boolean
}

const ListMobile = ({
  pokemonList,
  initialFilter,
  hasNextPage,
}: ListViewProps) => {
  useRouteChangeCache()

  return (
    <ListProvider
      initialList={pokemonList}
      initialFilter={initialFilter}
      hasNextPage={hasNextPage}
    >
      <HeaderContainer />
      <MobileListTopBanner />
      <ListContainer />
      <MobileTabBar />
    </ListProvider>
  )
}

export default ListMobile
