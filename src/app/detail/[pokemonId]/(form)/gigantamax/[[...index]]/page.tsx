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
  fetchGigantamaxData,
  fetchPokemonDetail,
} from '../../modules/fetchDetailData'
import { generateDetailMetadata } from '../../modules/generateMetadata'
import { parseIndexParam } from '../../modules/parseFormParams'

export const revalidate = 31536000

interface GigantamaxPageProps {
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
}: GigantamaxPageProps): Promise<Metadata> => {
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

  const { gigantamaxData } = await fetchGigantamaxData(parsedPokemonId)

  return generateDetailMetadata({
    pokemonDetail,
    activeType: 'gigantamax',
    activeIndex,
    isShiny,
    gigantamaxData,
  })
}

const GigantamaxPage = async ({
  params,
  searchParams,
}: GigantamaxPageProps) => {
  const { pokemonId, index } = await params
  const query = await searchParams

  // activeType 또는 activeIndex 쿼리 파라미터가 남아있으면 제거하고 리다이렉트
  if (query.activeType || query.activeIndex) {
    const { activeIndex: parsedIndex } = parseIndexParam(index)
    const queryParams = query.shinyMode ? `?shinyMode=${query.shinyMode}` : ''
    const indexPath = parsedIndex > 0 ? `/${parsedIndex}` : ''
    permanentRedirect(
      `/detail/${pokemonId}/gigantamax${indexPath}${queryParams}`,
      RedirectType.replace,
    )
  }

  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound()
  }

  const { activeIndex, isValid } = parseIndexParam(index)

  if (!isValid) {
    permanentRedirect(`/detail/${pokemonId}/gigantamax`, RedirectType.replace)
  }

  const isShiny = query.shinyMode === 'shiny'

  const pokemonDetail = await fetchPokemonDetail(parsedPokemonId)

  if (!pokemonDetail) {
    notFound()
  }

  // 거다이맥스 불가능한 포켓몬인 경우 기본 상세 페이지로 리다이렉트
  if (!pokemonDetail.isGigantamax) {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const { gigantamaxData } = await fetchGigantamaxData(parsedPokemonId)

  const props = {
    pokemonBaseInfo: pokemonDetail,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData: [],
    gigantamaxData,
    isShinyInfo: isShiny,
    versionGroup: undefined,
    normalFormImageList: [],
    activeType: 'gigantamax' as const,
    activeIndex,
  }

  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType: 'gigantamax',
    activeIndex,
    isShiny,
    normalForm: [],
    megaEvolutionData: [],
    regionFormData: [],
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

export default GigantamaxPage
