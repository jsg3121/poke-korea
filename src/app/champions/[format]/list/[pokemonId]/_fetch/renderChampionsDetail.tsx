import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { getChampionsDetailJsonLd } from '~/constants/championsJsonLd'
import { detectUserAgent } from '~/module/device.module'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  parseFormatSlug,
  resolveFormatEnum,
} from '~/utils/championsFormat.util'
import ChampionsDetailView from '~/views/champions/ChampionsDetail.view'
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

  const detailPath = buildChampionsDetailHref({
    formatSlug,
    pokemonId: parsedPokemonId,
    formType: detail.pokemon.formType,
    formCode: detail.pokemon.formCode,
  })
  const pokemonName = detail.pokemon.name
  const webPageJsonLd = getChampionsDetailJsonLd({
    formatSlug,
    pokemonName,
    detailPath,
    name: `${pokemonName.replace('_', ' ')} 챔피언스 도감`,
    description: `${pokemonName.replace('_', ' ')} 챔피언스 메타 정보 — 사용률, 추천 기술·도구·특성, 스탯을 확인하세요.`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {/* 콘텐츠는 반응형 단일(ChampionsDetailView, ADR-0013). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(E-1·ability·list 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <ChampionsDetailView
            detail={detail}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // h-40 스페이서 = 데스크톱 fixed 헤더(120px) + 챔피언스 SubNav(40px) 실높이.
        // champions는 헤더 안에 SubNav가 붙어 ability/list의 pt-30(120px)보다 40px 크다(E-1 tier와 동일).
        <main className="w-full min-h-screen">
          <div className="h-40">
            <DesktopHeaderContainer />
          </div>
          <ChampionsDetailView
            detail={detail}
            formatSlug={formatSlug as ChampionsFormatSlug}
          />
          <DesktopFooterContainer />
        </main>
      )}
    </>
  )
}
