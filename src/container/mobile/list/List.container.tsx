'use client'
import { useContext, useEffect, useRef } from 'react'
import { ListContext } from '~/context/List.context'
import FooterContainer from '../footer/Footer.container'
import CardComponent from './components/Card.component'

const ListContainer = () => {
  const listRef = useRef<HTMLDivElement>(null)

  const { pokemonList, loadMore, hasNextPage, isLoadingMore } =
    useContext(ListContext)

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      const intersectionRatio = entry.intersectionRatio
      if (intersectionRatio > 0 && hasNextPage) {
        loadMore()
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px 380px 0px',
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }
    return () => observer.disconnect()
  }, [pokemonList])

  return (
    <section className="w-full h-full mx-auto py-8 relative [&>h2]:absolute [&>h2]:top-0 [&>h2]:text-primary-1 [&>h2]:select-none">
      <h2>포켓몬 리스트</h2>
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between px-5 [&_.virtuoso-grid-item]:w-full">
        {pokemonList.map((pokemon) => {
          return (
            <CardComponent
              key={`pokemon-id-${pokemon.id}`}
              pokemonData={pokemon}
            />
          )
        })}
      </div>
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="text-sm text-gray-600">
            포켓몬을 더 불러오는 중...
          </div>
        </div>
      )}
      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default ListContainer
