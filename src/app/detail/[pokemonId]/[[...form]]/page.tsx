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
import { generatePokemonJsonLd } from '../../../../constants/pokemonJsonLd'
import { SHINY_QNA_JSON_LD } from '../../../../constants/shinyJsonLd'

export const revalidate = 31536000

interface DetailPageProps {
  params: Promise<{ pokemonId: string; form?: string[] }>
  searchParams: Promise<{
    shinyMode?: string
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
  activeType: TActiveType
  activeIndex: number
}

/**
 * Path 파라미터에서 activeType과 activeIndex를 추출
 * /detail/6 -> { activeType: 'normal', activeIndex: 0 }
 * /detail/6/mega -> { activeType: 'mega', activeIndex: 0 }
 * /detail/6/mega/1 -> { activeType: 'mega', activeIndex: 1 }
 * /detail/6/region -> { activeType: 'region', activeIndex: 0 }
 * /detail/6/region/2 -> { activeType: 'region', activeIndex: 2 }
 */
const parseFormParams = (
  form?: string[],
): { activeType: TActiveType; activeIndex: number; isValid: boolean } => {
  if (!form || form.length === 0) {
    return { activeType: 'normal', activeIndex: 0, isValid: true }
  }

  const [formType, formIndexStr] = form
  const allowedFormTypes = ['mega', 'region']

  if (!allowedFormTypes.includes(formType)) {
    return { activeType: 'normal', activeIndex: 0, isValid: false }
  }

  const activeType = formType as TActiveType

  if (!formIndexStr) {
    return { activeType, activeIndex: 0, isValid: true }
  }

  const activeIndex = parseInt(formIndexStr, 10)
  if (isNaN(activeIndex) || activeIndex < 0 || activeIndex > 100) {
    return { activeType, activeIndex: 0, isValid: false }
  }

  if (form.length > 2) {
    return { activeType, activeIndex, isValid: false }
  }

  return { activeType, activeIndex, isValid: true }
}

export const generateMetadata = async ({
  params,
  searchParams,
}: DetailPageProps): Promise<Metadata> => {
  const { pokemonId, form } = await params
  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId) || parsedPokemonId <= 0) {
    notFound()
  }

  const { activeType, activeIndex } = parseFormParams(form)
  const { shinyMode } = await searchParams
  const isShiny = shinyMode === 'shiny'

  const apolloClient = initializeApollo()

  // activeType에 따라 필요한 데이터만 가져오기
  const { data: detailPokemonData } =
    await apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    })

  const pokemonDetail = detailPokemonData.getPokemonDetail

  if (!pokemonDetail) {
    throw new Error('no pokemon data')
  }

  // activeType별로 필요한 데이터만 페칭
  let megaEvolutionData: PokemonMegaEvolution[] = []
  let regionFormData: PokemonRegionForm[] = []
  let normalFormData: PokemonNormalForm[] = []

  if (activeType === 'mega') {
    const { data } = await apolloClient.query<GetPokemonMegaEvolutionQuery>({
      query: GetPokemonMegaEvolutionDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    })
    megaEvolutionData = data?.getPokemonMegaEvolution ?? []
  } else if (activeType === 'region') {
    const { data } = await apolloClient.query<GetPokemonRegionFormQuery>({
      query: GetPokemonRegionFormDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    })
    regionFormData = data?.getPokemonRegionForm ?? []
  } else {
    const { data } = await apolloClient.query<GetPokemonNormalFormQuery>({
      query: GetPokemonNormalFormDocument,
      variables: {
        pokemonId: parsedPokemonId,
        activeIndex: activeIndex,
      },
      fetchPolicy: 'cache-first',
    })
    normalFormData = data?.getPokemonNormalForm ?? []
  }

  const commonParams = {
    pokemonDetail,
    activeType,
    activeIndex,
    normalForm: normalFormData,
    megaEvolutionData,
    regionFormData,
  }

  const types = getPokemonTypes(commonParams)

  const pokemonNameByType = getPokemonNameByType({
    activeType,
    megaEvolutionName: megaEvolutionData[activeIndex]?.name ?? '',
    regionFormPlace: regionFormData[activeIndex]?.region ?? '',
    pokemonBaseInfoName: pokemonDetail.name,
    isShiny,
  })

  const title = getSeoTitle({
    pokemonName: pokemonNameByType,
    pokemonNumber: pokemonDetail.number,
  })

  const canonicalUrl = getSeoCanonicalUrl({
    activeType,
    activeIndex,
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
      title: `No. ${pokemonDetail.number} ${pokemonNameByType}`,
      description,
      locale: 'ko_KR',
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `No. ${pokemonDetail.number} ${pokemonNameByType} | 포케코리아`,
      description,
    },
  }

  return metadata
}

const DetailPage = async ({ params, searchParams }: DetailPageProps) => {
  const { pokemonId, form } = await params
  const { shinyMode } = await searchParams

  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const parsedPokemonId = parseInt(pokemonId, 10)

  if (isNaN(parsedPokemonId)) {
    notFound()
  }

  const { activeType, activeIndex, isValid } = parseFormParams(form)

  if (!isValid) {
    permanentRedirect(`/detail/${pokemonId}`, RedirectType.replace)
  }

  const isShiny = shinyMode === 'shiny'

  const apolloClient = initializeApollo()

  // 기본 포켓몬 정보는 항상 필요
  const { data: defaultPokemonData } =
    await apolloClient.query<PokemonDetailQuery>({
      query: PokemonDetailDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    })

  const pokemonDetail = defaultPokemonData.getPokemonDetail

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

  // activeType에 따라 필요한 데이터만 페칭
  let normalFormData: PokemonNormalForm[] = []
  let megaEvolutionData: PokemonMegaEvolution[] = []
  let regionFormData: PokemonRegionForm[] = []
  let versionGroupData: VersionGroup[] = []
  let normalFormImageList: string[] = []

  if (activeType === 'mega') {
    // 메가진화: 메가진화 데이터만 필요
    const { data } = await apolloClient.query<GetPokemonMegaEvolutionQuery>({
      query: GetPokemonMegaEvolutionDocument,
      variables: { pokemonId: parsedPokemonId },
      fetchPolicy: 'cache-first',
    })
    megaEvolutionData = data?.getPokemonMegaEvolution ?? []
  } else if (activeType === 'region') {
    // 리전폼: 리전폼 데이터 + 버전 그룹 정보 필요
    const [{ data: regionData }, { data: versionGroup }] = await Promise.all([
      apolloClient.query<GetPokemonRegionFormQuery>({
        query: GetPokemonRegionFormDocument,
        variables: { pokemonId: parsedPokemonId },
        fetchPolicy: 'cache-first',
      }),
      apolloClient.query<GetVersionGroupsQuery>({
        query: GetVersionGroupsDocument,
        fetchPolicy: 'cache-first',
      }),
    ])
    regionFormData = regionData?.getPokemonRegionForm ?? []
    versionGroupData = versionGroup?.getVersionGroups ?? []
  } else {
    // 기본폼: 노멀폼 데이터 + 버전 그룹 + 이미지 리스트 필요
    const [{ data: normalForm }, { data: versionGroup }, { data: imageList }] =
      await Promise.all([
        apolloClient.query<
          GetPokemonNormalFormQuery,
          GetPokemonNormalFormQueryVariables
        >({
          query: GetPokemonNormalFormDocument,
          variables: {
            pokemonId: parsedPokemonId,
            activeIndex: activeIndex,
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
    normalFormData = normalForm?.getPokemonNormalForm ?? []
    versionGroupData = versionGroup?.getVersionGroups ?? []
    normalFormImageList = imageList?.getPokemonNormalFormImageList ?? []
  }

  const props: DetailPokemonInfo = {
    pokemonBaseInfo: pokemonDetail,
    isShinyInfo: isShiny,
    normalForm: normalFormData,
    megaEvolutionData,
    regionFormData,
    versionGroup: versionGroupData.length > 0 ? versionGroupData : undefined,
    normalFormImageList,
    activeType,
    activeIndex,
  }

  const pokemonJsonLd = generatePokemonJsonLd({
    pokemonDetail,
    activeType,
    activeIndex,
    isShiny,
    normalForm: normalFormData,
    megaEvolutionData,
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

export default DetailPage
