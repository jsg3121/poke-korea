import { useContext, useEffect, useRef } from 'react'
import { ListContext } from '~/context/List.context'
import FooterContainer from '../footer/Footer.container'
import PokemonCardComponent from './list.pokemonCard/PokemonCard.component'

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
      rootMargin: '0px 0px 200px 0px',
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }
    return () => observer.disconnect()
  }, [pokemonList])

  return (
    <section className="w-full max-w-[1280px] min-h-dvh h-full mx-auto py-12 pb-8 relative [&>h2]:absolute [&>h2]:top-0 [&>h2]:text-primary-1 [&>h2]:select-none">
      <h2 className="visually-hidden">포켓몬 리스트</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(calc(14rem-10px),auto))] gap-x-4 gap-y-6 justify-items-center justify-between px-5">
        {pokemonList.map((pokemon) => {
          return (
            <PokemonCardComponent
              key={`pokemon-id-${pokemon.id}`}
              pokemonData={pokemon}
            />
          )
        })}
      </div>
      {isLoadingMore && (
        <div className="flex justify-center py-4 w-full col-span-full">
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
