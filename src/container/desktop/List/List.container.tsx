import dynamic from 'next/dynamic'
import React, { useContext } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components'
import { ListContext } from '~/context'

const PokemonCard = dynamic(
  () => import('./list.pokemonCard/PokemonCard.component'),
)

const List = styled.section`
  width: 100%;
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  padding: 3rem 0 2rem;
  position: relative;

  & > h2 {
    position: absolute;
    top: 0;
    color: var(--color-primary-1);
    user-select: none;
  }

  .virtuoso-grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(14rem - 10px), auto));
    grid-column-gap: 1rem;
    grid-row-gap: 1.5rem;
    justify-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
`

const ListContainer = () => {
  const { pokemonList } = useContext(ListContext)

  const list = React.useMemo(() => {
    return (
      <VirtuosoGrid
        useWindowScroll
        totalCount={pokemonList.length}
        itemContent={(index) => {
          return <PokemonCard pokemonData={pokemonList[index]} />
        }}
      />
    )
  }, [pokemonList])

  return (
    <List>
      <h2>포켓몬 리스트</h2>
      {list}
    </List>
  )
}

export default ListContainer
