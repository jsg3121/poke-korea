import { notFound } from 'next/navigation'

import { getChampionsDetailJsonLd } from '~/constants/championsJsonLd'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  parseFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import ChampionsDetail from '~/views/champions/ChampionsDetail.view'

import { fetchChampionsDetail } from './fetchChampionsDetail'

interface RenderArgs {
  format: string
  pokemonId: string
  formCode?: string | null
}

/**
 * 챔피언스 상세 페이지 공통 렌더링 헬퍼.
 * BASE 라우트 + 폼 라우트 (mega/region/gigantamax/form) 모두 동일한 흐름.
 */
export const renderChampionsDetail = async ({
  format,
  pokemonId,
  formCode,
}: RenderArgs) => {
  const formatSlug = parseFormatSlug(format)

  if (!formatSlug) {
    notFound()
  }

  const parsedPokemonId = parseInt(pokemonId, 10)
  if (Number.isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
    notFound()
  }

  const detail = await fetchChampionsDetail({
    pokemonId: parsedPokemonId,
    format: resolveFormatEnum(formatSlug),
    formCode,
  })

  if (!detail?.pokemon) {
    notFound()
  }

  const detailPath = buildChampionsDetailHref({
    formatSlug,
    pokemonId: parsedPokemonId,
    formType: detail.pokemon.formType,
    formCode: detail.pokemon.formCode,
  })
  const pokemonName = detail.pokemon.name
  const meta = detail.meta
  const webPageJsonLd = getChampionsDetailJsonLd({
    formatSlug,
    pokemonName,
    detailPath,
    name: `${pokemonName} 챔피언스 도감`,
    description: `${pokemonName} 챔피언스 메타 정보 — 추천 기술·도구·특성, 스탯을 확인하세요.`,
    entityInfo: {
      stats: detail.pokemon.stats,
      tier: meta?.tier,
      // usageRate/winRate는 데이터 원천 변경으로 제외. 인기 상위 1개만 요약 전달.
      topMove: meta?.topMoves?.[0]?.name,
      topAbility: meta?.topAbilities?.[0]?.name,
      topItem: meta?.topItems?.[0]?.name,
    },
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {/* 콘텐츠는 반응형 단일(ChampionsDetail, ADR-0013). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(E-1·ability·list 개편과 동일 패턴). */}
      <ChampionsDetail
        detail={detail}
        formatSlug={formatSlug as ChampionsFormatSlug}
      />
    </>
  )
}
