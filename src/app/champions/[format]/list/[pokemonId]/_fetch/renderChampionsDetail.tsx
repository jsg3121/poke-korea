import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { detectUserAgent } from '~/module/device.module'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  parseFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import ChampionsDetailDesktop from '~/views/desktop/champions/ChampionsDetail.desktop'
import ChampionsDetailMobile from '~/views/mobile/champions/ChampionsDetail.mobile'
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

  // BASE 폼처럼 챔피언스 메타 데이터가 없는 폼에 진입한 경우,
  // formSiblings 에 챔피언스 등장 폼이 있으면 가장 인기 있는(usageRate 최대) 폼으로 자동 리다이렉트.
  // Why: 플라엣테(BASE) 처럼 챔피언스 미등장 폼으로 사용자가 진입하면 빈 페이지가 노출되는데,
  //      메가플라엣테 같은 등장 폼이 있다면 그쪽으로 안내하는 것이 사용자 경험상 자연스럽다.
  if (!detail.meta && detail.formSiblings.length > 0) {
    const fallback = [...detail.formSiblings]
      .filter((s) => s.usageRate != null)
      .sort((a, b) => (b.usageRate ?? 0) - (a.usageRate ?? 0))[0]

    if (fallback) {
      const href = buildChampionsDetailHref({
        formatSlug,
        pokemonId: fallback.pokemonId,
        formType: fallback.formType,
        formCode: fallback.formCode,
      })
      redirect(href)
    }
  }

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://poke-korea.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '챔피언스',
        item: `https://poke-korea.com/champions/${formatSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '포켓몬 도감',
        item: `https://poke-korea.com/champions/${formatSlug}/list`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: detail.pokemon.name,
        item: `https://poke-korea.com/champions/${formatSlug}/list/${pokemonId}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="w-full min-h-screen">
        {isMobile ? (
          <ChampionsDetailMobile
            detail={detail}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
        ) : (
          <ChampionsDetailDesktop
            detail={detail}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
        )}
      </main>
    </>
  )
}
