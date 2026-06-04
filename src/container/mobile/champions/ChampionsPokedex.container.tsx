'use client'

import { Fragment } from 'react'
import MobileChampionsPokedexBanner from '~/components/adSlot/MobileChampionsPokedexBanner'
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

const AD_AFTER_INDEX = 5 // 카드 5장 직후(약 3행) 광고 1회 노출

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
    rootMargin: '0px 0px 380px 0px',
    dependencies: [pokemonList],
  })

  const formatShort = getFormatShortLabel(formatSlug)

  return (
    <section className="w-full h-full mx-auto pb-8 relative">
      <header className="px-5 mt-6">
        <h1 className="text-2xl font-bold text-primary-4">
          포켓몬 챔피언스 {formatShort} 도감
        </h1>
        <ChampionsFormatTab
          currentFormat={formatSlug}
          basePath="/champions"
          suffix="/list"
        />
      </header>

      <div className="sticky top-28 z-20 bg-primary-1 shadow-[0_3px_3px_-2px_var(--color-black-1)] mb-4 pb-2">
        <div className="flex items-center justify-between px-5 py-2 border-t border-primary-2/30">
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
        <div className="w-full h-20">
          <p className="w-full text-[1.75rem] text-primary-4 font-bold text-center">
            조건에 맞는 포켓몬이 없어요!
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between px-5">
          {pokemonList.map((pokemon, index) => (
            <Fragment key={`champions-pokemon-${pokemon.id}-${index}`}>
              <ChampionsPokemonCard
                pokemonData={pokemon}
                isHighPriority={index < 6}
              />
              {index === AD_AFTER_INDEX && (
                <div className="col-span-2 w-full">
                  <MobileChampionsPokedexBanner />
                </div>
              )}
            </Fragment>
          ))}
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
