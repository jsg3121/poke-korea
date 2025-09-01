'use client'
import { useContext, useMemo, useCallback } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import { ListContext } from '~/context/List.context'
import CardComponent from './components/Card.component'

const ListContainer = () => {
  const { pokemonList, loadMore, hasNextPage, isLoadingMore } =
    useContext(ListContext)

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      loadMore()
    }
  }, [hasNextPage, isLoadingMore, loadMore])

  const list = useMemo(() => {
    return (
      <VirtuosoGrid
        useWindowScroll
        totalCount={pokemonList.length}
        itemContent={(index) => {
          return <CardComponent pokemonData={pokemonList[index]} />
        }}
        endReached={handleEndReached}
      />
    )
  }, [pokemonList, handleEndReached])

  return (
    <section className="w-full h-full mx-auto py-8 relative [&>h2]:absolute [&>h2]:top-0 [&>h2]:text-primary-1 [&>h2]:select-none [&_.virtuoso-grid-list]:w-full [&_.virtuoso-grid-list]:grid [&_.virtuoso-grid-list]:grid-cols-2 [&_.virtuoso-grid-list]:gap-x-4 [&_.virtuoso-grid-list]:gap-y-6 [&_.virtuoso-grid-list]:justify-items-center [&_.virtuoso-grid-list]:justify-between [&_.virtuoso-grid-list]:px-5 [&_.virtuoso-grid-item]:w-full">
      <h2>포켓몬 리스트</h2>
      {list}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="text-sm text-gray-600">
            포켓몬을 더 불러오는 중...
          </div>
        </div>
      )}
    </section>
  )
}

export default ListContainer
