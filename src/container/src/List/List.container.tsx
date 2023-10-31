import React, { useContext } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import styled from 'styled-components'
import { ListContext } from '~/context'

const List = styled.div`
  width: 100%;
  height: 100%;
`

const ListContainer: React.FC = () => {
  const { pokemonList } = useContext(ListContext)

  const list = React.useMemo(() => {
    return (
      <VirtuosoGrid
        totalCount={pokemonList.length}
        itemContent={(index) => {
          return <div>Item {pokemonList[index].name}</div>
        }}
      />
    )
  }, [pokemonList])

  return <List>{list}</List>
}

export default ListContainer
