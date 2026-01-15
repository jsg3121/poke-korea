import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { DetailProvider } from '~/context/Detail.context'
import { detectUserAgent } from '~/module/device.module'
import DetailDesktop from '~/views/desktop/detail/Detail.desktop'
import DetailMobile from '~/views/mobile/detail/Detail.mobile'
import { generatePokemonJsonLd } from '../../../../constants/pokemonJsonLd'
import { SHINY_QNA_JSON_LD } from '../../../../constants/shinyJsonLd'
import {
  fetchNormalFormData,
  fetchPokemonDetail,
} from './modules/fetchDetailData'
import { generateDetailMetadata } from './modules/generateMetadata'
import { parseNormalFormParams } from './modules/parseFormParams'

export const revalidate = 31536000

interface DetailPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    shinyMode?: string
    activeIndex?: string
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

  const headersList = headers()
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

  const { normalFormData, versionGroupData, normalFormImageList } =
    await fetchNormalFormData(parsedPokemonId, activeIndex)

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

export default DetailPage
