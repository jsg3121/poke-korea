import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import MobileTabBar from '~/components/MobileTabBar'
import { DetailProvider } from '~/context/Detail.context'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import DetailView from '~/views/detail/Detail.view'
import { generatePokemonJsonLd } from '../../../../constants/pokemonJsonLd'
import {
  fetchAdjacentPokemon,
  fetchNormalFormData,
  fetchPokemonDetail,
  fetchPokemonSummaries,
} from './modules/fetchDetailData'
import { generateDetailMetadata } from './modules/generateMetadata'
import { parseNormalFormParams } from './modules/parseFormParams'

export const revalidate = 31536000

interface DetailPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    shinyMode?: string
    activeIndex?: string
    activeType?: 'region' | 'mega'
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: DetailPageProps): Promise<Metadata> => {
  const { pokemonId } = await params
  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
    notFound()
  }

  const query = await searchParams
  const { activeIndex } = parseNormalFormParams(query)
  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    throw new Error('no pokemon data')
  }

  const { normalFormData } = await fetchNormalFormData(
    parsedPokemonId,
    activeIndex,
  )

  return generateDetailMetadata({
    pokemonDetail,
    activeType: 'normal',
    activeIndex,
    isShiny,
    normalFormData,
  })
}

const DetailPage = async ({ params, searchParams }: DetailPageProps) => {
  const { pokemonId } = await params
  const query = await searchParams

  // activeType=region 쿼리 파라미터가 있으면 Path 기반 URL로 리다이렉트
  if (query.activeType === 'region') {
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    const indexPath =
      query.activeIndex && query.activeIndex !== '0'
        ? `/${query.activeIndex}`
        : ''
    redirect(`/detail/${pokemonId}/region${indexPath}${queryParams}`)
  }

  // activeType=mega 쿼리 파라미터가 있으면 Path 기반 URL로 리다이렉트
  if (query.activeType === 'mega') {
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    const indexPath =
      query.activeIndex && query.activeIndex !== '0'
        ? `/${query.activeIndex}`
        : ''
    redirect(`/detail/${pokemonId}/mega${indexPath}${queryParams}`)
  }

  // activeIndex 쿼리 파라미터가 있으면 Path 기반 URL로 리다이렉트
  if (query.activeIndex && query.activeIndex !== '0') {
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    redirect(`/detail/${pokemonId}/form/${query.activeIndex}${queryParams}`)
  }

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound()
  }

  const { activeIndex } = parseNormalFormParams(query)
  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    notFound()
  }

  const [
    { normalFormData, versionGroupData, normalFormImageList },
    adjacent,
    evolutionPokemons,
  ] = await Promise.all([
    fetchNormalFormData(parsedPokemonId, activeIndex),
    fetchAdjacentPokemon(parsedPokemonId),
    fetchPokemonSummaries(pokemonDetail.evolutionId),
  ])

  const props = {
    pokemonBaseInfo: pokemonDetail,
    normalForm: normalFormData,
    megaEvolutionData: [],
    regionFormData: [],
    isShinyInfo: isShiny,
    versionGroup: versionGroupData.length > 0 ? versionGroupData : undefined,
    normalFormImageList,
    activeType: 'normal' as const,
    activeIndex,
  }

  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType: 'normal',
    activeIndex,
    isShiny,
    normalForm: normalFormData,
    megaEvolutionData: [],
    regionFormData: [],
  })

  return (
    <DetailProvider {...props}>
      {/* 콘텐츠는 반응형 단일(DetailView, ADR-0007). UA 분기는 전역 크롬(헤더/
          푸터/탭바) 선택으로만 남는다(홈·리스트 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <DetailView
            prevPokemon={adjacent.prev}
            nextPokemon={adjacent.next}
            evolutionPokemons={evolutionPokemons}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이(리스트 개편에서 실측 확정)
        <main className="w-full min-h-screen pt-30">
          <DesktopHeaderContainer />
          <DetailView
            prevPokemon={adjacent.prev}
            nextPokemon={adjacent.next}
            evolutionPokemons={evolutionPokemons}
          />
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
    </DetailProvider>
  )
}

export default DetailPage
