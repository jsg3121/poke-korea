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
      {pokemonList.length === 0 && (
        <div className="w-full h-20">
          <p className="w-full text-[1.75rem] text-primary-4 font-bold text-center">
            검색 결과에 맞는 포켓몬이 없어요!
          </p>
          <p className="w-full text-[1.75rem] text-primary-4 font-bold text-center">
            포켓몬 이름을 다시 확인해주세요!
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between px-5 [&_.virtuoso-grid-item]:w-full">
          {pokemonList.map((pokemon, index) => {
            return (
              <CardComponent
                key={`pokemon-id-${pokemon.id}`}
                pokemonData={pokemon}
                setImagePriority={index < 20}
              />
            )
          })}
        </div>
      )}
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
