import React from 'react'
import { MobileContainer } from '~/container'
import { ListProvider } from '~/context'
import { Pokemon } from '~/graphql/typeGenerated'
import { useHeaderScroll } from '~/hook/src/useHeaderScroll'

interface ManinViewsProps {
  pokemonList: Array<Pokemon>
}

const MainViews: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  const { observerRef, isScroll } = useHeaderScroll('mobile')

  return (
    <ListProvider pokemonList={pokemonList}>
      <div ref={observerRef}>
        <MobileContainer.Header />
      </div>
      <MobileContainer.List />
    </ListProvider>
  )
}

export default MainViews
