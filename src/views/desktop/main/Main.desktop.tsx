'use client'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ListContainer from '~/container/desktop/List/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonFilterInput, PokemonList } from '~/graphql/typeGenerated'
import { useRouteChangeCache } from '~/hook/useRouteChangeCache'
import HeaderContainer from '~/views/desktop/main/Header/Header.container'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
  initialFilter: PokemonFilterInput
  hasNextPage: boolean
}

const MainDesktop = ({
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
      <div className="h-44">
        <HeaderContainer />
      </div>
      <DesktopListTopBanner />
      <ListContainer />
    </ListProvider>
  )
}

export default MainDesktop
