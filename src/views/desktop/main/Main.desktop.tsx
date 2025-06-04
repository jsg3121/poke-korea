import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import styled from 'styled-components'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import HeaderContainer from '~/views/desktop/main/Header/Header.container'
import ListContainer from '~/container/desktop/List/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/useHeaderScroll'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
}

const Div = styled.div`
  padding-bottom: 20rem;
  transition: padding-bottom 0.3s;
  will-change: padding-bottom;

  &[data-scrolling='true'],
  &[data-searching='has-query'] {
    padding-bottom: 11rem;
  }
`

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
      <Div
        ref={observerRef}
        data-scrolling={isScroll}
        data-searching={hasSearchQuery ? 'has-query' : ''}
      >
        <HeaderContainer />
      </Div>
      <DesktopListTopBanner />
      <ListContainer />
    </ListProvider>
  )
}

export default MainDesktop
