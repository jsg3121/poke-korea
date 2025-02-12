import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import styled from 'styled-components'
import HeaderContainer from '~/container/desktop/Header/Header.container'
import ListContainer from '~/container/desktop/List/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/useHeaderScroll'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
}

const Div = styled.div`
  padding-bottom: 31rem;
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

const MainDesktop: React.FC<ManinViewsProps> = ({ pokemonList }) => {
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
      <ListContainer />
    </ListProvider>
  )
}

export default MainDesktop
