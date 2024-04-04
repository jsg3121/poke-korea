import React from 'react'
import styled from 'styled-components'
import { Header, List } from '~/container'
import { ListProvider } from '~/context'
import { Pokemon } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/src/useHeaderScroll'

interface ManinViewsProps {
  pokemonList: Array<Pokemon>
}

const Div = styled.div`
  padding-bottom: 31rem;
  transition: padding-bottom 0.3s;
  will-change: padding-bottom;

  &[data-scrolling='true'] {
    padding-bottom: 11rem;
  }
`

const MainViews: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  const { observerRef, isScroll } = useHeaderScroll()

  return (
    <ListProvider pokemonList={pokemonList} scrolling={isScroll}>
      <Div ref={observerRef} data-scrolling={isScroll}>
        <Header />
      </Div>
      <List />
    </ListProvider>
  )
}

export default MainViews
