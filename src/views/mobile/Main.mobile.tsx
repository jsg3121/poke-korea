import React from 'react'
import HeaderContainer from '~/container/mobile/header/Header.container'
import ListContainer from '~/container/mobile/list/List.container'
import { ListProvider } from '~/context/List.context'
import { PokemonList } from '~/graphql/typeGenerated'

interface ManinViewsProps {
  pokemonList: Array<PokemonList>
}

const MainMobile: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  return (
    <ListProvider pokemonList={pokemonList}>
      <HeaderContainer />
      <ListContainer />
    </ListProvider>
  )
}

export default MainMobile
