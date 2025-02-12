import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { ListContext } from '~/context/List.context'
import { useContext, useMemo } from 'react'

const CardItem = dynamic(() => import('./components/Card.component'))

const List = styled.section`
  width: 100%;
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
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1.5rem;
    justify-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .virtuoso-grid-item {
      width: 100%;
    }
  }
`

const ListContainer = () => {
  const { pokemonList } = useContext(ListContext)

  const list = useMemo(() => {
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
