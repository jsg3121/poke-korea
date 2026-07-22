'use client'

import ChampionsFormatIntro from '~/components/champions/ChampionsFormatIntro.component'
import ChampionsPokedexSortSelect from '~/components/champions/ChampionsPokedexSortSelect.component'
import ChampionsPokemonCard from '~/components/champions/ChampionsPokemonCard.component'
import ChampionsTypeFilter from '~/components/champions/filter/ChampionsTypeFilter.component'
import PageHeaderComponent from '~/components/pageHeader/PageHeader.component'
import { useChampionsPokedex } from '~/context/ChampionsPokedex.context'
import { ChampionsPokemonSort } from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import {
  ChampionsFormatSlug,
  getFormatShortLabel,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 도감 본문 (반응형 단일, ADR-0007).
 *
 * 구버전 desktop/mobile 2벌 컨테이너를 CSS 반응형 단일로 통합한다(UX-E1).
 * - 그리드: grid-cols-2 desktop:grid-cols-5 (도감 list와 동일 DS 패턴)
 * - 카드: ChampionsPokemonCard(DS PokemonCardShell 기반, useDevice 제거)
 * - 광고 슬롯 제거(A~D 선례, 반응형 광고 유닛 재도입은 별도 트랙)
 * - 무한스크롤 sentinel은 Footer와 분리(크롬은 page.tsx가 담당)
 *
 * SSR은 뷰포트를 모르므로 priority/observer 임계는 단일 고정값을 쓴다.
 */
// 첫 화면 카드 eager 로딩 수 — 데스크톱 5열 2행 기준(모바일 2열이면 5행)
const HIGH_PRIORITY_COUNT = 10

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
    rootMargin: '0px 0px 300px 0px',
    dependencies: [pokemonList],
  })

  const formatShort = getFormatShortLabel(formatSlug)

  return (
    <section className="w-full max-w-[1280px] min-h-dvh mx-auto px-4 pb-8 relative desktop:px-5">
      <PageHeaderComponent
        title={`챔피언스 ${formatShort} 도감`}
        description={`${formatShort} 메타 포켓몬 전체 목록`}
      />

      <ChampionsFormatIntro
        formatSlug={formatSlug}
        suffix="/list"
        className="mb-4 desktop:mb-6"
      />

      {/* sticky 필터바. -mx-4/-mx-5로 부모 좌우 패딩을 상쇄해 배경(bg-primary-1)을
          화면 끝까지 깔고, 내부는 px-4/px-5로 다시 들여쓴다. 이렇게 안 하면 sticky
          고정 시 좌우 gutter로 뒤 콘텐츠가 비친다(UX-E1 QA).
          top 오프셋은 상단 고정 크롬 실높이와 정확히 맞춘다:
          - 모바일 88px = 헤더 h-12(48) + SubNav h-10(40)
          - 데스크톱 160px = 헤더 120 + SubNav 40 */}
      <div className="sticky top-[5.5rem] z-20 -mx-4 mb-4 px-4 pb-2 bg-primary-1 shadow-[0_3px_3px_-2px_var(--color-black-1)] desktop:top-40 desktop:-mx-5 desktop:mb-6 desktop:px-5">
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
              className="w-full flex justify-center"
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
      {/* 무한스크롤 sentinel — Footer와 분리(크롬은 page.tsx가 담당) */}
      <div ref={listRef} aria-hidden="true" className="h-px w-full" />
    </section>
  )
}

export default ChampionsPokedexContainer
