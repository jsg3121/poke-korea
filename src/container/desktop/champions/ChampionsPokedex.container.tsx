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
    rootMargin: '0px 0px 100px 0px',
    dependencies: [pokemonList],
  })

  return (
    <section className="w-full max-w-[1280px] min-h-dvh h-full mx-auto py-12 pb-8 relative">
      <header className="px-5 mb-6">
        <h1 className="text-2xl font-bold text-primary-1">
          포켓몬 챔피언스 도감
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          총 {totalCount}종+의 포켓몬
          <span className="text-xs text-gray-400 ml-2">
            (메가진화 정보는 상세 페이지에서 확인하실 수 있어요!)
          </span>
        </p>
      </header>
      {pokemonList.length === 0 && (
        <div className="w-full h-[20rem]">
          <p className="w-full text-[2rem] text-primary-4 font-bold text-center">
            포켓몬을 불러오는 중입니다...
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(calc(14rem-10px),auto))] gap-x-4 gap-y-6 justify-items-center justify-between px-5">
          {pokemonList.map((pokemon, index) => {
            return (
              <ChampionsPokemonCard
                key={`champions-pokemon-${pokemon.id}-${index}`}
                pokemonData={pokemon}
                isHighPriority={index < 15}
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

export default ChampionsPokedexContainer
