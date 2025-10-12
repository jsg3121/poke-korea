import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, permanentRedirect, RedirectType } from 'next/navigation'
import { DetailProvider } from '~/context/Detail.context'
import {
  GetPokemonMegaEvolutionDocument,
  GetPokemonNormalFormDocument,
  GetPokemonNormalFormImageListDocument,
  GetPokemonRegionFormDocument,
  GetVersionGroupsDocument,
  PokemonDetailDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonMegaEvolutionQuery,
  GetPokemonNormalFormImageListQuery,
  GetPokemonNormalFormImageListQueryVariables,
  GetPokemonNormalFormQuery,
  GetPokemonNormalFormQueryVariables,
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
import { getRobotsConfig } from '~/module/metadata.module'
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
  normalFormImageList: Array<string>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: DetailPageProps): Promise<Metadata> => {
  const { pokemonId } = await params
  const parsedPokemonId = parseInt(pokemonId, 10)

  // pokemonId 유효성 검증
  if (isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
    notFound()
  }

  const apolloClient = initializeApollo()
  const {
    activeType = 'normal',
    shinyMode,
    activeIndex = '0',
  } = await searchParams
  const isShiny = shinyMode === 'shiny'

  const [
    { data: detailPokemonData },
    megaData,
    regionData,
    { data: normalFormData },
  ] = await Promise.all([
    apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    }),
    activeType === 'mega'
      ? apolloClient.query<GetPokemonMegaEvolutionQuery>({
          query: GetPokemonMegaEvolutionDocument,
          variables: { pokemonId: parsedPokemonId },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeType === 'region'
      ? apolloClient.query<GetPokemonRegionFormQuery>({
          query: GetPokemonRegionFormDocument,
          variables: { pokemonId: parsedPokemonId },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeType === 'normal'
      ? apolloClient.query<GetPokemonNormalFormQuery>({
          query: GetPokemonNormalFormDocument,
          variables: {
            pokemonId: parsedPokemonId,
            activeIndex: parseInt(activeIndex, 10),
          },
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

  const canonicalUrl = getSeoCanonicalUrl({
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
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      locale: 'ko_KR',
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
      canonical: canonicalUrl,
    },
  }

  return metadata
}

const DetailPage = async ({ params, searchParams }: DetailPageProps) => {
  const { pokemonId } = await params
  const searchParamsData = await searchParams
  const { activeType = 'normal', shinyMode, activeIndex } = searchParamsData

  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound() // 404 페이지로 이동
  }

  // 쿼리 파라미터 검증
  let hasInvalidParams = false

  // 1. activeType 검증
  const allowedActiveTypes: TActiveType[] = ['normal', 'mega', 'region']
  if (activeType && !allowedActiveTypes.includes(activeType)) {
    hasInvalidParams = true
  }

  // 2. shinyMode 검증
  if (shinyMode && shinyMode !== 'shiny') {
    hasInvalidParams = true
  }

  // 3. activeIndex 검증
  const parsedActiveIndex = activeIndex ? parseInt(activeIndex, 10) : 0
  if (
    activeIndex &&
    (isNaN(parsedActiveIndex) ||
      parsedActiveIndex < 0 ||
      parsedActiveIndex > 100)
  ) {
    hasInvalidParams = true
  }

  // 4. 알 수 없는 파라미터 검증
  const allowedParams = ['activeType', 'shinyMode', 'activeIndex']
  const hasUnknownParams = Object.keys(searchParamsData).some(
    (key) => !allowedParams.includes(key),
  )
  if (hasUnknownParams) {
    hasInvalidParams = true
  }

  // 잘못된 파라미터가 있으면 기본 경로로 301 리다이렉트
  if (hasInvalidParams) {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const isShiny = shinyMode === 'shiny'
  const dataIndex = parsedActiveIndex

  const apolloClient = initializeApollo()

  // 병렬 요청
  const [
    { data: defaultPokemonData },
    { data: normalFormData },
    { data: versionGroup },
    { data: normalFormImageList },
  ] = await Promise.all([
    apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<
      GetPokemonNormalFormQuery,
      GetPokemonNormalFormQueryVariables
    >({
      query: GetPokemonNormalFormDocument,
      variables: {
        pokemonId: parsedPokemonId,
        activeIndex: dataIndex,
      },
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<GetVersionGroupsQuery>({
      query: GetVersionGroupsDocument,
      fetchPolicy: 'cache-first',
    }),
    apolloClient.query<
      GetPokemonNormalFormImageListQuery,
      GetPokemonNormalFormImageListQueryVariables
    >({
      query: GetPokemonNormalFormImageListDocument,
      variables: {
        pokemonId: parsedPokemonId,
      },
      fetchPolicy: 'cache-first',
    }),
  ])

  const pokemonDetail = defaultPokemonData.getPokemonDetail

  // 포켓몬이 존재하지 않으면 404 페이지 표시
  if (!pokemonDetail) {
    notFound()
  }

  // mega/region form 가능 여부 검증 후 리다이렉트
  if (!pokemonDetail.isMegaEvolution && activeType === 'mega') {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  if (!pokemonDetail.isRegionForm && activeType === 'region') {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const [megaData, regionData] = await Promise.all([
    activeType === 'mega'
      ? apolloClient.query<GetPokemonMegaEvolutionQuery>({
          query: GetPokemonMegaEvolutionDocument,
          variables: { pokemonId: parsedPokemonId },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
    activeType === 'region'
      ? apolloClient.query<GetPokemonRegionFormQuery>({
          query: GetPokemonRegionFormDocument,
          variables: { pokemonId: parsedPokemonId },
          fetchPolicy: 'cache-first',
        })
      : Promise.resolve({ data: null }),
  ])

  const props: DetailPokemonInfo = {
    pokemonBaseInfo: pokemonDetail,
    isShinyInfo: isShiny,
    normalForm: normalFormData.getPokemonNormalForm ?? [],
    megaEvolutionData: megaData.data?.getPokemonMegaEvolution ?? [],
    regionFormData: regionData.data?.getPokemonRegionForm ?? [],
    versionGroup: versionGroup.getVersionGroups ?? undefined,
    normalFormImageList:
      normalFormImageList.getPokemonNormalFormImageList ?? [],
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
