'use client'

import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import ListContainer from '~/container/mobile/list/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList, PokemonFilterInput } from '~/graphql/typeGenerated'
import HeaderContainer from './header/Header.container'
import { useRouteChangeCache } from '~/hook/useRouteChangeCache'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
  initialFilter: PokemonFilterInput
  hasNextPage: boolean
}

const MainMobile = ({
  pokemonList,
  initialFilter,
  hasNextPage,
}: ManinViewsProps) => {
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
    </ListProvider>
  )
}

export default MainMobile
