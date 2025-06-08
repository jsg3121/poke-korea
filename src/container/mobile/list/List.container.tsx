'use client'
import { VirtuosoGrid } from 'react-virtuoso'
import dynamic from 'next/dynamic'
import { ListContext } from '~/context/List.context'
import { useContext, useMemo } from 'react'

const CardItem = dynamic(() => import('./components/Card.component'))

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
    <section className="w-full h-full mx-auto py-8 relative [&>h2]:absolute [&>h2]:top-0 [&>h2]:text-primary-1 [&>h2]:select-none [&_.virtuoso-grid-list]:w-full [&_.virtuoso-grid-list]:grid [&_.virtuoso-grid-list]:grid-cols-2 [&_.virtuoso-grid-list]:gap-x-4 [&_.virtuoso-grid-list]:gap-y-6 [&_.virtuoso-grid-list]:justify-items-center [&_.virtuoso-grid-list]:justify-between [&_.virtuoso-grid-list]:px-5 [&_.virtuoso-grid-item]:w-full">
      <h2>포켓몬 리스트</h2>
      {list}
    </section>
  )
}

export default ListContainer
