import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import HeaderContainer from '~/views/desktop/main/Header/Header.container'
import ListContainer from '~/container/desktop/List/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/useHeaderScroll'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
}

const checkRouteQuery = (query: ParsedUrlQuery) => {
  const values = Object.values(query)
  return (
    values.some((value) => value !== '') &&
    !values.every((value) => value === '')
  )
}

const MainDesktop = ({ pokemonList }: ManinViewsProps) => {
  const router = useRouter()
  const { observerRef, isScroll } = useHeaderScroll()

  const hasSearchQuery = checkRouteQuery(router.query ?? {})

  return (
    <ListProvider
      pokemonList={pokemonList}
      scrolling={isScroll}
      searching={hasSearchQuery}
    >
      <div
        ref={observerRef}
        className="pb-80 transition-[padding-bottom] duration-300 will-change-[padding-bottom] data-[scrolling=true]:pb-44 data-[searching=has-query]:pb-44"
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
