import React, { useContext } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components'
import { ListContext } from '~/context'
import { Card } from './components'

const List = styled.section`
  width: 100%;
  max-width: 2160px;
  height: calc(100% - 10rem);
  margin: 0 auto;
  padding: 0 2rem 2rem;

  .virtuoso-grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, auto));
    grid-column-gap: 1rem;
    justify-items: center;
    justify-content: space-between;
  }
`

const ListContainer: React.FC = () => {
  const { pokemonList } = useContext(ListContext)

  const list = React.useMemo(() => {
    return (
      <VirtuosoGrid
        useWindowScroll
        totalCount={pokemonList.length}
        itemContent={(index) => {
          return <Card pokemonData={pokemonList[index]} />
        }}
      />
    )
  }, [pokemonList])

  return <List>{list}</List>
}

export default ListContainer
