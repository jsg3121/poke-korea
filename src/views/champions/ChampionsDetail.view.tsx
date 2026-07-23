'use client'

import ChampionsDetailContainer from '~/container/champions/ChampionsDetail.container'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsDetailViewProps {
  detail: ChampionsPokemonDetailFragment
  formatSlug: ChampionsFormatSlug
}

/**
 * 챔피언스 상세 뷰 (반응형 단일, ADR-0013).
 *
 * 구버전 desktop/mobile 2벌 뷰(ChampionsDetail.desktop/mobile)를 통합한다(UX-010).
 * 전역 크롬(헤더/푸터/탭바)은 renderChampionsDetail이 UA로 선택하고, 본문만 이
 * 뷰가 담당한다(E-1·ability·list 개편과 동일 패턴).
 */
const ChampionsDetailView = ({
  detail,
  formatSlug,
}: ChampionsDetailViewProps) => {
  return <ChampionsDetailContainer detail={detail} formatSlug={formatSlug} />
}

export default ChampionsDetailView
