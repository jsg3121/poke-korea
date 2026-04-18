'use client'

import { useChampionsPokedex } from '~/context/ChampionsPokedex.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import ChampionsPokemonCard from '~/components/champions/ChampionsPokemonCard.component'
import FooterContainer from '../footer/Footer.container'

const ChampionsPokedexContainer = () => {
  const { pokemonList, loadMore, hasNextPage, isLoadingMore, totalCount } =
    useChampionsPokedex()

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 380px 0px',
    dependencies: [pokemonList],
  })

  return (
    <section className="w-full h-full mx-auto py-8 relative">
      <header className="px-5 mb-4">
        <h1 className="text-xl font-bold text-primary-1">
          포켓몬 챔피언스 도감
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          총{' '}
          <span className="relative group cursor-help">
            <span className="underline decoration-dotted">{totalCount}종+</span>
            <span className="absolute left-0 bottom-full mb-1 hidden group-hover:block w-48 p-2 text-xs bg-gray-800 text-white rounded shadow-lg z-10">
              리전폼/폼체인지는 상세 페이지에서 확인할 수 있습니다
            </span>
          </span>
          의 포켓몬
        </p>
      </header>
      {pokemonList.length === 0 && (
        <div className="w-full h-20">
          <p className="w-full text-[1.75rem] text-primary-4 font-bold text-center">
            포켓몬을 불러오는 중입니다...
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between px-5">
          {pokemonList.map((pokemon, index) => {
            return (
              <ChampionsPokemonCard
                key={`champions-pokemon-${pokemon.id}`}
                pokemonData={pokemon}
                isHighPriority={index < 6}
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

export default ChampionsPokedexContainer
