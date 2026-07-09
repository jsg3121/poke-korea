import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'
import MobileTabBar from '~/components/MobileTabBar'
import { DetailProvider } from '~/context/Detail.context'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import DetailView from '~/views/detail/Detail.view'
import { generatePokemonJsonLd } from '../../../../../../constants/pokemonJsonLd'
import { SHINY_QNA_JSON_LD } from '../../../../../../constants/shinyJsonLd'
import {
  fetchAdjacentPokemon,
  fetchPokemonDetail,
  fetchRegionFormData,
} from '../../modules/fetchDetailData'
import { generateDetailMetadata } from '../../modules/generateMetadata'
import { parseIndexParam } from '../../modules/parseFormParams'

export const revalidate = 31536000

interface RegionPageProps {
  params: Promise<{ pokemonId: string; index?: string[] }>
  searchParams: Promise<{
    shinyMode?: string
    activeType?: string
    activeIndex?: string
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: RegionPageProps): Promise<Metadata> => {
  const { pokemonId, index } = await params
  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
    notFound()
  }

  const { activeIndex } = parseIndexParam(index)
  const query = await searchParams
  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    throw new Error('no pokemon data')
  }

  const { regionFormData } = await fetchRegionFormData(parsedPokemonId)

  return generateDetailMetadata({
    pokemonDetail,
    activeType: 'region',
    activeIndex,
    isShiny,
    regionFormData,
  })
}

const RegionPage = async ({ params, searchParams }: RegionPageProps) => {
  const { pokemonId, index } = await params
  const query = await searchParams

  // activeType 또는 activeIndex 쿼리 파라미터가 남아있으면 제거하고 리다이렉트
  if (query.activeType || query.activeIndex) {
    const { activeIndex: parsedIndex } = parseIndexParam(index)
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    const indexPath = parsedIndex > 0 ? `/${parsedIndex}` : ''
    permanentRedirect(
      `/detail/${pokemonId}/region${indexPath}${queryParams}`,
      RedirectType.replace,
    )
  }

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound()
  }

  const { activeIndex, isValid } = parseIndexParam(index)

  if (!isValid) {
    permanentRedirect(`/detail/${pokemonId}/region`, RedirectType.replace)
  }

  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    notFound()
  }

  // 리전폼이 없는 포켓몬인 경우 기본 상세 페이지로 리다이렉트
  if (!pokemonDetail.isRegionForm) {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const [{ regionFormData, versionGroupData }, adjacent] = await Promise.all([
    fetchRegionFormData(parsedPokemonId),
    fetchAdjacentPokemon(parsedPokemonId),
  ])

  const props = {
    pokemonBaseInfo: pokemonDetail,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData,
    isShinyInfo: isShiny,
    versionGroup: versionGroupData.length > 0 ? versionGroupData : undefined,
    normalFormImageList: [],
    activeType: 'region' as const,
    activeIndex,
  }

  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType: 'region',
    activeIndex,
    isShiny,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData,
  })

  return (
    <DetailProvider {...props}>
      {/* 콘텐츠는 반응형 단일(DetailView) — UA 분기는 크롬 선택만(ADR-0007) */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <DetailView prevPokemon={adjacent.prev} nextPokemon={adjacent.next} />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        <main className="w-full min-h-screen pt-30">
          <DesktopHeaderContainer />
          <DetailView prevPokemon={adjacent.prev} nextPokemon={adjacent.next} />
          <DesktopFooterContainer />
        </main>
      )}
      <script
        id="pokemon-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pokemonJsonLd),
        }}
      />
      {isShiny && (
        <script
          id="shiny-faq-jsonLd"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SHINY_QNA_JSON_LD),
          }}
        />
      )}
    </DetailProvider>
  )
}

export default RegionPage
