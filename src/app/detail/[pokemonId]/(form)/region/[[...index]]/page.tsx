import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'
import { DetailProvider } from '~/context/Detail.context'
import { detectUserAgent } from '~/module/device.module'
import DetailDesktop from '~/views/desktop/detail/Detail.desktop'
import DetailMobile from '~/views/mobile/detail/Detail.mobile'
import { generatePokemonJsonLd } from '../../../../../../constants/pokemonJsonLd'
import { SHINY_QNA_JSON_LD } from '../../../../../../constants/shinyJsonLd'
import {
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

  const headersList = headers()
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

  const { regionFormData, versionGroupData } =
    await fetchRegionFormData(parsedPokemonId)

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
      {isMobile ? <DetailMobile /> : <DetailDesktop />}
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
