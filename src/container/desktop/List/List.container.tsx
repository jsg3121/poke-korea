import { useContext } from 'react'
import { ListContext } from '~/context/List.context'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import PokemonCardComponent from './list.pokemonCard/PokemonCard.component'

const ListContainer = () => {
  const { pokemonList, loadMore, hasNextPage, isLoadingMore } =
    useContext(ListContext)

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 100px 0px',
    dependencies: [pokemonList],
  })

  return (
    <section className="w-full max-w-[1280px] min-h-dvh h-full mx-auto py-12 pb-8 relative [&>h2]:absolute [&>h2]:top-0 [&>h2]:text-primary-1 [&>h2]:select-none">
      <h2 className="visually-hidden">포켓몬 리스트</h2>
      {pokemonList.length === 0 && (
        <div className="w-full h-[20rem]">
          <p className="w-full text-[2rem] text-primary-4 font-bold text-center">
            검색 결과에 맞는 포켓몬이 없어요!
          </p>
          <p className="w-full text-[2rem] text-primary-4 font-bold text-center">
            포켓몬 이름을 다시 확인해주세요!
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
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
      )}
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
