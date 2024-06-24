import React from 'react'
import styled from 'styled-components'
import { MobileContainer } from '~/container'
import { ListProvider } from '~/context'
import { Pokemon } from '~/graphql/typeGenerated'

interface ManinViewsProps {
  pokemonList: Array<Pokemon>
}

const Div = styled.div``

const MainViews: React.FC<ManinViewsProps> = ({ pokemonList }) => {
  return (
    <ListProvider pokemonList={pokemonList}>
      <Div>
        <MobileContainer.Header />
      </Div>
    </ListProvider>
  )
}

export default MainViews
