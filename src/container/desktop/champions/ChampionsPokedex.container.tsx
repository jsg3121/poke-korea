import { Fragment } from 'react'
import DesktopChampionsPokedexBanner from '~/components/adSlot/DesktopChampionsPokedexBanner'
import ChampionsFormatTab from '~/components/champions/ChampionsFormatTab.component'
import ChampionsPokedexSortSelect from '~/components/champions/ChampionsPokedexSortSelect.component'
import ChampionsPokemonCard from '~/components/champions/ChampionsPokemonCard.component'
import ChampionsTypeFilter from '~/components/champions/filter/ChampionsTypeFilter.component'
import { useChampionsPokedex } from '~/context/ChampionsPokedex.context'
import { ChampionsPokemonSort } from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import {
  ChampionsFormatSlug,
  getFormatShortLabel,
} from '~/utils/championsFormat.util'
import FooterContainer from '../footer/Footer.container'

const AD_AFTER_INDEX = 4 // 첫 행(5개) 직후에 인아티클 1회 노출

interface ChampionsPokedexContainerProps {
  formatSlug: ChampionsFormatSlug
  sort: ChampionsPokemonSort
}

const ChampionsPokedexContainer = ({
  formatSlug,
  sort,
}: ChampionsPokedexContainerProps) => {
  const { pokemonList, loadMore, hasNextPage, isLoadingMore, totalCount } =
    useChampionsPokedex()

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 100px 0px',
    dependencies: [pokemonList],
  })

  const formatShort = getFormatShortLabel(formatSlug)

  return (
    <section className="w-full max-w-[1280px] min-h-dvh h-full mx-auto pb-8 mt-16 relative">
      <header className="px-4">
        <h1 className="text-3xl font-bold text-primary-4">
          포켓몬 챔피언스 {formatShort} 도감
        </h1>
        <ChampionsFormatTab
          currentFormat={formatSlug}
          basePath="/champions"
          suffix="/list"
        />
      </header>

      <div className="sticky top-[10rem] pb-4 z-20 bg-primary-1 shadow-[0_3px_3px_-2px_#333333] mb-6">
        <div className="flex items-center justify-between px-4 py-2 border-t border-primary-2/30">
          {pokemonList.length > 0 && (
            <p className="text-sm text-primary-3 mt-1">
              총 <b className="font-bold">{totalCount}종</b>의 포켓몬
            </p>
          )}
          <ChampionsPokedexSortSelect currentSort={sort} />
        </div>
        <ChampionsTypeFilter />
      </div>

      {pokemonList.length === 0 && (
        <div className="w-full h-[20rem]">
          <p className="w-full text-[2rem] text-primary-4 font-bold text-center">
            조건에 맞는 포켓몬이 없어요!
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <div className="grid grid-cols-5 gap-x-4 gap-y-6 justify-items-center justify-between px-5">
          {pokemonList.map((pokemon, index) => (
            <Fragment key={`champions-pokemon-${pokemon.id}-${index}`}>
              <ChampionsPokemonCard
                pokemonData={pokemon}
                isHighPriority={index < 15}
                formatSlug={formatSlug}
              />
              {index === AD_AFTER_INDEX && (
                <div className="col-span-5 w-full">
                  <DesktopChampionsPokedexBanner />
                </div>
              )}
            </Fragment>
          ))}
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
