import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DetailProvider } from '~/context/Detail.context'
import {
  GetPokemonMegaEvolutionDocument,
  GetPokemonNormalFormDocument,
  GetPokemonRegionFormDocument,
  GetVersionGroupsDocument,
  PokemonDetailDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonMegaEvolutionQuery,
  GetPokemonNormalFormQuery,
  GetPokemonRegionFormQuery,
  GetVersionGroupsQuery,
  PokemonDetail,
  PokemonDetailQuery,
  PokemonMegaEvolution,
  PokemonNormalForm,
  PokemonRegionForm,
  VersionGroup,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import {
  getPokemonNameByType,
  getPokemonTypes,
  getSeoCanonicalUrl,
  getSeoDescription,
  getSeoTitle,
} from '~/module/generateDetailSeoMetaData'
import { TActiveType } from '~/types/detailContext.type'
import DetailDesktop from '~/views/desktop/detail/Detail.desktop'
import DetailMobile from '~/views/mobile/detail/Detail.mobile'
import { generatePokemonJsonLd } from '../../../constants/pokemonJsonLd'
import { SHINY_QNA_JSON_LD } from '../../../constants/shinyJsonLd'

export const revalidate = 31536000 // 24시간마다 재생성

interface DetailPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    activeType: TActiveType
    shinyMode: string
    activeIndex: string
  }>
}

interface DetailPokemonInfo {
  pokemonBaseInfo: PokemonDetail
  normalForm: Array<PokemonNormalForm>
  megaEvolutionData?: Array<PokemonMegaEvolution>
  regionFormData?: Array<PokemonRegionForm>
  isShinyInfo: boolean
  versionGroup?: Array<VersionGroup>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: DetailPageProps): Promise<Metadata> => {
  const apolloClient = initializeApollo()
  const { pokemonId } = await params
  const { activeType = 'normal', shinyMode, activeIndex } = await searchParams
  const isShiny = shinyMode === 'shiny'

  const [
    { data: detailPokemonData },
    megaData,
    regionData,
    { data: normalFormData },
  ] = await Promise.all([
    apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parseInt(pokemonId, 10) },
      fetchPolicy: 'cache-first',
    }),
    activeType === 'mega'
      ? apolloClient.query<GetPokemonMegaEvolutionQuery>({
          query: GetPokemonMegaEvolutionDocument,
          variables: { pokemonId: parseInt(pokemonId, 10) },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeType === 'region'
      ? apolloClient.query<GetPokemonRegionFormQuery>({
          query: GetPokemonRegionFormDocument,
          variables: { pokemonId: parseInt(pokemonId, 10) },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeType === 'normal'
      ? apolloClient.query<GetPokemonNormalFormQuery>({
          query: GetPokemonNormalFormDocument,
          variables: { pokemonId: parseInt(pokemonId, 10) },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
  ])

  const pokemonDetail = detailPokemonData.getPokemonDetail

  if (!pokemonDetail) {
    throw new Error('no pokemon data')
  }

  const dataIndex = activeIndex ? parseInt(activeIndex, 10) : 0

  // 공통 함수 사용
  const commonParams = {
    pokemonDetail,
    activeType,
    activeIndex: dataIndex,
    normalForm: normalFormData?.getPokemonNormalForm ?? [],
    megaEvolutionData: megaData.data?.getPokemonMegaEvolution ?? [],
    regionFormData: regionData.data?.getPokemonRegionForm ?? [],
  }

  const types = getPokemonTypes(commonParams)

  const pokemonNameByType = getPokemonNameByType({
    activeType,
    megaEvolutionName: megaData.data?.getPokemonMegaEvolution
      ? megaData.data?.getPokemonMegaEvolution[dataIndex]?.name
      : '',
    regionFormPlace: regionData.data?.getPokemonRegionForm
      ? regionData.data?.getPokemonRegionForm[dataIndex]?.region
      : '',
    pokemonBaseInfoName: pokemonDetail.name,
    isShiny,
  })

  const title = getSeoTitle({
    pokemonName: pokemonNameByType,
    pokemonNumber: pokemonDetail.number,
  })

  const caninicalUrl = getSeoCanonicalUrl({
    activeType,
    activeIndex: dataIndex,
    pokemonNumber: pokemonDetail.number,
    isShiny,
  })

  const description = getSeoDescription({
    generation: pokemonDetail.generation,
    pokemonNumber: pokemonDetail.number,
    pokemonName: pokemonNameByType,
    types,
  })

  const metadata: Metadata = {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
    openGraph: {
      type: 'website',
      url: caninicalUrl,
      title,
      description,
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: caninicalUrl,
    },
  }

  return metadata
}

const DetailPage = async ({ params, searchParams }: DetailPageProps) => {
  const { pokemonId } = await params
  const { activeType = 'normal', shinyMode, activeIndex } = await searchParams
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  // 병렬 요청
  const [
    { data: defaultPokemonData },
    { data: normalFormData },
    { data: versionGroup },
  ] = await Promise.all([
    apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parseInt(pokemonId, 10) },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<GetPokemonNormalFormQuery>({
      query: GetPokemonNormalFormDocument,
      variables: { pokemonId: parseInt(pokemonId, 10) },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<GetVersionGroupsQuery>({
      query: GetVersionGroupsDocument,
      fetchPolicy: 'cache-first',
    }),
  ])

  const pokemonDetail = defaultPokemonData.getPokemonDetail

  if (!pokemonDetail) {
    redirect('/')
  }

  if (!pokemonDetail.isMegaEvolution && activeType === 'mega') {
    const url = new URL(`/detail/${pokemonId}`, 'https://poke-korea.com')
    url.searchParams.set('activeType', 'normal')
    if (shinyMode) url.searchParams.set('shinyMode', shinyMode)
    redirect(url.pathname + url.search)
  }

  if (!pokemonDetail.isRegionForm && activeType === 'region') {
    const url = new URL(`/detail/${pokemonId}`, 'https://poke-korea.com')
    url.searchParams.set('activeType', 'normal')
    if (shinyMode) url.searchParams.set('shinyMode', shinyMode)
    redirect(url.pathname + url.search)
  }

  const [megaData, regionData] = await Promise.all([
    activeType === 'mega'
      ? apolloClient.query<GetPokemonMegaEvolutionQuery>({
          query: GetPokemonMegaEvolutionDocument,
          variables: { pokemonId: parseInt(pokemonId, 10) },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeType === 'region'
      ? apolloClient.query<GetPokemonRegionFormQuery>({
          query: GetPokemonRegionFormDocument,
          variables: { pokemonId: parseInt(pokemonId, 10) },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
  ])

  const isShiny = shinyMode === 'shiny'
  const dataIndex = activeIndex ? parseInt(activeIndex, 10) : 0

  const props: DetailPokemonInfo = {
    pokemonBaseInfo: pokemonDetail,
    isShinyInfo: isShiny,
    normalForm: normalFormData.getPokemonNormalForm ?? [],
    megaEvolutionData: megaData.data?.getPokemonMegaEvolution ?? [],
    regionFormData: regionData.data?.getPokemonRegionForm ?? [],
    versionGroup: versionGroup.getVersionGroups ?? undefined,
  }
  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType,
    activeIndex: dataIndex,
    isShiny,
    normalForm: normalFormData.getPokemonNormalForm ?? [],
    megaEvolutionData: megaData.data?.getPokemonMegaEvolution ?? [],
    regionFormData: regionData.data?.getPokemonRegionForm ?? [],
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
