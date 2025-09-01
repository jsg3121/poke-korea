'use client'

import MobileListTopBanner from '~/components/adSlot/MobileListTopBanner'
import ListContainer from '~/container/mobile/list/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList, PokemonFilterInput } from '~/graphql/typeGenerated'
import HeaderContainer from './header/Header.container'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
  initialFilter: PokemonFilterInput
}

const MainMobile = ({ pokemonList, initialFilter }: ManinViewsProps) => {
  return (
    <ListProvider pokemonList={pokemonList} initialFilter={initialFilter}>
      <HeaderContainer />
      <MobileListTopBanner />
      <ListContainer />
    </ListProvider>
  )
}

export default MainMobile
