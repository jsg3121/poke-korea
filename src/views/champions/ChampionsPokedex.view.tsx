'use client'

import {
  ChampionsPokemonCardFragment,
  ChampionsPokemonFilterInput,
  ChampionsPokemonSort,
} from '~/graphql/typeGenerated'
import {
  ChampionsFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import { ChampionsPokedexProvider } from '~/context/ChampionsPokedex.context'
import ChampionsPokedexContent from '~/containers/champions/ChampionsPokedexContent.container'

interface ChampionsPokedexProps {
  pokemonList: ChampionsPokemonCardFragment[]
  hasNextPage: boolean
  endCursor: string | null
  totalCount: number
  initialFilter: ChampionsPokemonFilterInput
  formatSlug: ChampionsFormatSlug
  sort: ChampionsPokemonSort
}

/**
 * 챔피언스 도감 뷰 (반응형 단일, ADR-0007).
 *
 * 구버전 desktop/mobile 2벌 뷰(ChampionsPokedex.desktop/mobile)를 통합한다(UX-E1).
 * 무한스크롤·필터·정렬 상태는 ChampionsPokedexProvider가 관리하고, 전역 크롬
 * (헤더/푸터/탭바)은 page.tsx가 UA로 선택한다(ability·list 개편과 동일 패턴).
 */
const ChampionsPokedex = ({
  pokemonList,
  hasNextPage,
  endCursor,
  totalCount,
  initialFilter,
  formatSlug,
  sort,
}: ChampionsPokedexProps) => {
  return (
    <ChampionsPokedexProvider
      initialList={pokemonList}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
      totalCount={totalCount}
      initialFilter={initialFilter}
      format={resolveFormatEnum(formatSlug)}
      sort={sort}
    >
      <ChampionsPokedexContent formatSlug={formatSlug} sort={sort} />
    </ChampionsPokedexProvider>
  )
}

export default ChampionsPokedex
