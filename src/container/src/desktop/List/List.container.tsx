import React from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components'
import { ListContext } from '~/context'
import dynamic from 'next/dynamic'

const CardItem = dynamic(() => import('./components/src/Card.component'))

const List = styled.section`
  width: 100%;
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  padding: 2rem 0;
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

const ListContainer: React.FC = () => {
  const { pokemonList } = React.useContext(ListContext)

  const list = React.useMemo(() => {
    return (
      <VirtuosoGrid
        useWindowScroll
        totalCount={pokemonList.length}
        itemContent={(index) => {
          return <CardItem pokemonData={pokemonList[index]} />
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
