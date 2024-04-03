import React from 'react'
import { Header, List } from '~/container'
import { ListProvider } from '~/context'
import { Pokemon } from '~/graphql/typeGenerated'

interface ManinViewsProps {
  pokemonList: Array<Pokemon>
}

const MainViews: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  return (
    <ListProvider pokemonList={pokemonList}>
      <Header />
      <List />
    </ListProvider>
  )
}

export default MainViews
