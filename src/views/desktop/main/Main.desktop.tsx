'use client'
import { useSearchParams } from 'next/navigation'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ListContainer from '~/container/desktop/List/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonFilterInput, PokemonList } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/useHeaderScroll'
import HeaderContainer from '~/views/desktop/main/Header/Header.container'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
  initialFilter: PokemonFilterInput
}

const checkSearchParams = (searchParams: URLSearchParams) => {
  const values = Array.from(searchParams.values())
  return (
    values.some((value) => value !== '') &&
    !values.every((value) => value === '')
  )
}

const MainDesktop = ({ pokemonList, initialFilter }: ManinViewsProps) => {
  const searchParams = useSearchParams()
  const { observerRef, isScroll } = useHeaderScroll()

  const hasSearchQuery = checkSearchParams(searchParams)

  return (
    <ListProvider
      initialList={pokemonList}
      initialFilter={initialFilter}
      scrolling={isScroll}
      searching={hasSearchQuery}
    >
      <div
        ref={observerRef}
        className="pb-80 transition-[padding-bottom] duration-300 will-change-[padding-bottom,transition] data-[scrolling=true]:pb-44 data-[searching=has-query]:pb-44"
        data-scrolling={isScroll}
        data-searching={hasSearchQuery ? 'has-query' : ''}
      >
        <HeaderContainer />
      </div>
      <DesktopListTopBanner />
      <ListContainer />
    </ListProvider>
  )
}

export default MainDesktop
