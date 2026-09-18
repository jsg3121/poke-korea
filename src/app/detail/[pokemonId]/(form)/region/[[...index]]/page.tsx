import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'

import { detectUserAgent } from '~/modules/device.module'
import { DetailProvider } from '~/context/Detail.context'
import MobileTabBar from '~/components/MobileTabBar.component'
import DesktopFooterContainer from '~/containers/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/containers/desktop/header/Header.container'
import MobileFooterContainer from '~/containers/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/containers/mobile/header/Header.container'
import DetailView from '~/views/detail/Detail.view'

import { generatePokemonJsonLd } from '../../../../../../constants/pokemonJsonLd'
import {
  fetchAdjacentPokemon,
  fetchPokemonDetail,
  fetchPokemonSummaries,
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

  // 존재하지 않는 폼 인덱스는 페이지가 notFound()로 처리한다. 여기서 메타를
  // 만들면 404 응답에 정상 title이 붙으므로 빈 객체를 반환한다.
  if (!regionFormData[activeIndex]) {
    return {}
  }

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

  const [{ regionFormData, versionGroupData }, adjacent, evolutionPokemons] =
    await Promise.all([
      fetchRegionFormData(parsedPokemonId),
      fetchAdjacentPokemon(parsedPokemonId),
      fetchPokemonSummaries(pokemonDetail.evolutionId),
    ])

  // 존재하지 않는 폼 인덱스는 404. 가드가 없으면 하위 컴포넌트가 undefined
  // 폼을 참조해 500이 난다(예: 리전폼 2개인 나옹의 /region/2).
  if (!regionFormData[activeIndex]) {
    notFound()
  }

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
          <DetailView
            prevPokemon={adjacent.prev}
            nextPokemon={adjacent.next}
            evolutionPokemons={evolutionPokemons}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
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

export default RegionPage
