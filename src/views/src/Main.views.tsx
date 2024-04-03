import React from 'react'
import { Header, List } from '~/container'
import { ListProvider } from '~/context'
import { Pokemon } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/src/useHeaderScroll'

interface ManinViewsProps {
  pokemonList: Array<Pokemon>
}

const MainViews: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  const { observerRef, isScroll: scrolling } = useHeaderScroll()

  return (
    <ListProvider pokemonList={pokemonList} scrolling={scrolling}>
      <div ref={observerRef}>
        <Header />
      </div>
      <List />
    </ListProvider>
  )
}

export default MainViews
