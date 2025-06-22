'use client'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useMemo } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import { ListContext } from '~/context/List.context'

const PokemonCard = dynamic(
  () => import('./list.pokemonCard/PokemonCard.component'),
)

const ListContainer = () => {
  const { pokemonList } = useContext(ListContext)

  const list = useMemo(() => {
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

  const start = performance.now()

  useEffect(() => {
    const end = performance.now()
    console.log(
      `[렌더 완료] MyComponent 렌더링 시간: ${(end - start).toFixed(2)}ms`,
    )
  }, [])

  return (
    <section className="w-full max-w-[1280px] h-full mx-auto py-12 pb-8 relative [&>h2]:absolute [&>h2]:top-0 [&>h2]:text-primary-1 [&>h2]:select-none [&_.virtuoso-grid-list]:grid [&_.virtuoso-grid-list]:grid-cols-[repeat(auto-fill,minmax(calc(14rem-10px),auto))] [&_.virtuoso-grid-list]:gap-x-4 [&_.virtuoso-grid-list]:gap-y-6 [&_.virtuoso-grid-list]:justify-items-center [&_.virtuoso-grid-list]:justify-between [&_.virtuoso-grid-list]:px-5">
      <h2 className="visually-hidden">포켓몬 리스트</h2>
      {list}
    </section>
  )
}

export default ListContainer
