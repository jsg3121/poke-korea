import React from 'react'
import { MobileContainer } from '~/container'
import { ListProvider } from '~/context'
import { Pokemon } from '~/graphql/typeGenerated'

interface ManinViewsProps {
  pokemonList: Array<Pokemon>
}

const MainViews: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  return (
    <ListProvider pokemonList={pokemonList}>
      <MobileContainer.Header />
      <MobileContainer.List />
    </ListProvider>
  )
}

export default MainViews
