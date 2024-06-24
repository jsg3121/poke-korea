import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import styled from 'styled-components'
import { ListProvider } from '~/context'
import { Pokemon } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/src/useHeaderScroll'

interface ManinViewsProps {
  pokemonList: Array<Pokemon>
}

const Div = styled.div``

const checkRouteQuery = (query: ParsedUrlQuery) => {
  const values = Object.values(query)
  return (
    values.some((value) => value !== '') &&
    !values.every((value) => value === '')
  )
}

const MainViews: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  const router = useRouter()
  const { observerRef, isScroll } = useHeaderScroll()

  const ableScroll = isScroll
  const hasSearchQuery = checkRouteQuery(router.query ?? {})

  return (
    <ListProvider
      pokemonList={pokemonList}
      scrolling={ableScroll}
      searching={hasSearchQuery}
    >
      <Div
        ref={observerRef}
        data-scrolling={ableScroll}
        data-searching={hasSearchQuery ? 'has-query' : ''}
      >
        {/* <Header /> */}
      </Div>
    </ListProvider>
  )
}

export default MainViews
