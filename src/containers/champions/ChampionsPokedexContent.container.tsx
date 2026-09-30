'use client'

import { CHAMPIONS_SLOTS } from '~/constants/adSense'
import { ChampionsPokemonSort } from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  getFormatShortLabel,
} from '~/utils/championsFormat.util'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { useChampionsPokedex } from '~/context/ChampionsPokedex.context'
import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner.component'
import ChampionsFormatIntro from '~/components/champions/ChampionsFormatIntro.component'
import ChampionsPokedexSortSelect from '~/components/champions/ChampionsPokedexSortSelect.component'
import ChampionsPokemonCard from '~/components/champions/ChampionsPokemonCard.component'
import ChampionsTypeFilter from '~/components/champions/filter/ChampionsTypeFilter.component'
import PageHeader from '~/components/pageHeader/PageHeader.component'

const HIGH_PRIORITY_COUNT = 10

interface ChampionsPokedexContentProps {
  formatSlug: ChampionsFormatSlug
  sort: ChampionsPokemonSort
}

const ChampionsPokedexContent = ({
  formatSlug,
  sort,
}: ChampionsPokedexContentProps) => {
  const { pokemonList, loadMore, hasNextPage, isLoadingMore, totalCount } =
    useChampionsPokedex()

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 300px 0px',
    dependencies: [pokemonList],
  })

  const formatShort = getFormatShortLabel(formatSlug)

  return (
    <section className="w-full max-w-[1280px] min-h-dvh mx-auto px-4 pb-8 relative desktop:px-5">
      <PageHeader
        title={`챔피언스 ${formatShort} 도감`}
        description={`${formatShort} 메타 포켓몬 전체 목록`}
      />

      <ChampionsFormatIntro
        formatSlug={formatSlug}
        suffix="/list"
        className="mb-4 desktop:mb-6"
      />

      <div className="sticky top-[5.25rem] z-20 -mx-4 mb-4 px-4 pb-2 bg-primary-1 shadow-[0_3px_3px_-2px_var(--color-black-1)] desktop:top-40 desktop:-mx-5 desktop:mb-6 desktop:px-5">
        <div className="flex items-center justify-between py-1.5 border-t border-primary-2/30">
          {pokemonList.length > 0 && (
            <p className="text-xs text-primary-3">
              총 <b className="font-bold">{totalCount}종</b>의 포켓몬
            </p>
          )}
          <ChampionsPokedexSortSelect currentSort={sort} />
        </div>
        <div className="mt-2 desktop:mt-3">
          <ChampionsTypeFilter />
        </div>
      </div>

      <ChampionsInContentBanner
        mobileSlot={CHAMPIONS_SLOTS.pokedexMobile}
        desktopSlot={CHAMPIONS_SLOTS.pokedexDesktop}
      />

      {pokemonList.length === 0 && (
        <div className="w-full h-20 desktop:h-80">
          <p className="w-full text-[1.75rem] text-primary-4 font-bold text-center desktop:text-[2rem]">
            조건에 맞는 포켓몬이 없어요!
          </p>
        </div>
      )}
      {pokemonList.length > 0 && (
        <ul
          className="grid w-full grid-cols-2 gap-x-4 gap-y-6 justify-items-center desktop:grid-cols-5"
          aria-label="챔피언스 포켓몬 목록"
        >
          {pokemonList.map((pokemon, index) => (
            <li
              key={`champions-pokemon-${pokemon.id}-${index}`}
              className="w-full"
            >
              <ChampionsPokemonCard
                pokemonData={pokemon}
                isHighPriority={index < HIGH_PRIORITY_COUNT}
                formatSlug={formatSlug}
              />
            </li>
          ))}
        </ul>
      )}
      {isLoadingMore && (
        <div className="flex justify-center py-4 w-full">
          <div className="text-sm text-gray-600">
            포켓몬을 더 불러오는 중...
          </div>
        </div>
      )}
      <div ref={listRef} aria-hidden="true" className="h-px w-full" />
    </section>
  )
}

export default ChampionsPokedexContent
