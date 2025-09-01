'use client'
import { useContext } from 'react'
import { ListContext } from '~/context/List.context'
import PokemonCardComponent from './list.pokemonCard/PokemonCard.component'

const ListContainer = () => {
  const { pokemonList, loadMore, hasNextPage, isLoadingMore } =
    useContext(ListContext)

  return (
    <section className="w-full max-w-[1280px] h-full mx-auto py-12 pb-8 relative [&>h2]:absolute [&>h2]:top-0 [&>h2]:text-primary-1 [&>h2]:select-none ">
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
    </section>
  )
}

export default ListContainer
